"""Topology & Differential Geometry draft: browser regression tests.
Run from repository root:
    python -m pytest -v tests/test_topology_upgrade_browser.py
Requires pytest, playwright, and an installed Playwright Chromium browser.
"""
import json
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

import pytest
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
BASE = "/courses/topology-differential-geometry/"


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


@pytest.fixture(scope="module")
def site():
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=str(ROOT)))
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    yield "http://127.0.0.1:%d" % server.server_port
    server.shutdown()
    thread.join(timeout=5)


@pytest.fixture(scope="module")
def browser():
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True, args=["--no-sandbox"])
        yield b
        b.close()


def visit(browser, site, path, width=900):
    ctx = browser.new_context(viewport={"width": width, "height": 850}, accept_downloads=True)
    page = ctx.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.route("**/*", lambda route: route.continue_() if urlparse(route.request.url).hostname in ("127.0.0.1", "localhost") else route.abort())
    page.goto(site + BASE + path, wait_until="domcontentloaded")
    return ctx, page, errors


def choose_topic(page, correct_count=3):
    return page.evaluate("""(correctCount) => {
      const inputs=[...document.querySelectorAll('#topicMasteryCheck [data-topic-question]')];
      const bank=window.TOPOLOGY_DIFFERENTIAL_GEOMETRY_QUESTIONS;
      if(inputs.length!==5) throw Error('expected five topic questions');
      inputs.forEach((card,i)=>{
        const prompt=card.querySelector('h3').textContent.replace(/^\\d+\\.\\s*/, '');
        const q=bank.find(item=>item.prompt===prompt);
        if(!q)throw Error('topic question missing from bank: '+prompt);
        const radio=card.querySelectorAll('input[type=radio]')[(i<correctCount)?q.answer:(q.answer+1)%4];
        radio.click();
      });
      return inputs.length;
    }""", correct_count)


def choose_formal(page, correct_count):
    return page.evaluate("""correctCount => {
      const bank=window.TOPOLOGY_DIFFERENTIAL_GEOMETRY_QUESTIONS;
      const boxes=[...document.querySelectorAll('#assessmentRoot article.question')];
      if(boxes.length!==12)throw Error('expected 12 mastery items');
      boxes.forEach((card,i)=>{
        const prompt=card.querySelector('legend').textContent.replace(/^\\d+\\.\\s*/, '');
        const options=[...card.querySelectorAll(".option span")].map(el=>el.textContent);
        const q=bank.find(item=>item.prompt===prompt && item.options.length===options.length && item.options.every((x,i)=>x===options[i]));
        if(!q)throw Error('formal question or answer options missing: '+prompt);
        card.querySelectorAll('input[type=radio]')[(i<correctCount)?q.answer:(q.answer+1)%4].click();
      });
      return boxes.length;
    }""", correct_count)


@pytest.mark.parametrize("lesson", ["u01-l01", "u01-l02", "u01-l08", "u05-l01", "u08-l03", "u13-l07"])
def test_lesson_topic_check_and_script_errors(browser, site, lesson):
    unit=lesson[1:3]
    ctx,page,errors=visit(browser,site,f"units/unit-{unit}/lessons/{lesson}.html")
    page.locator("#topicMasteryCheck [data-topic-question]").first.wait_for(timeout=20000)
    assert page.locator("#topicMasteryCheck [data-topic-question]").count() == 5
    assert not page.locator("#scoreTopicCheck").is_disabled()
    assert not errors, errors
    ctx.close()


def test_same_questions_below_80_and_saved_lock_after_refresh(browser, site):
    ctx,page,errors=visit(browser,site,"units/unit-01/lessons/u01-l02.html")
    page.locator("#topicMasteryCheck").wait_for(timeout=20000)
    choose_topic(page,3)  # 60%
    page.locator("#scoreTopicCheck").click()
    assert "60%" in page.locator("#topicResult").inner_text()
    assert not page.locator("#scoreTopicCheck").is_disabled()
    page.reload(wait_until="domcontentloaded")
    page.locator("#topicMasteryCheck").wait_for(timeout=20000)
    assert page.locator("#topicMasteryCheck input:checked").count()==5
    choose_topic(page,4)  # 80%, same questions
    page.locator("#scoreTopicCheck").click()
    assert "80%" in page.locator("#topicResult").inner_text()
    assert page.locator("#scoreTopicCheck").is_disabled()
    assert page.locator("#topicMasteryCheck input:disabled").count()==20
    page.reload(wait_until="domcontentloaded")
    page.locator("#topicMasteryCheck").wait_for(timeout=20000)
    assert page.locator("#scoreTopicCheck").is_disabled()
    assert page.locator("#topicMasteryCheck input:checked").count()==5
    assert not errors, errors
    ctx.close()


def test_formal_unit_mastery_retry_reload_and_lock(browser, site):
    ctx,page,errors=visit(browser,site,"units/unit-01/mastery-check.html")
    page.locator("#assessmentRoot article.question").first.wait_for(timeout=20000)
    choose_formal(page,9) # 75%
    page.locator("#submitAssessment").click()
    assert "75%" in page.locator("#assessmentMessage").inner_text()
    assert not page.locator("#submitAssessment").is_disabled()
    page.reload(wait_until="domcontentloaded")
    assert page.locator("#assessmentRoot input:checked").count()==12
    choose_formal(page,10) # 83%
    page.locator("#submitAssessment").click()
    assert page.locator("#submitAssessment").is_disabled()
    page.reload(wait_until="domcontentloaded")
    assert page.locator("#submitAssessment").is_disabled()
    assert page.locator("#assessmentRoot input:disabled").count()==48
    assert not errors, errors
    ctx.close()


@pytest.mark.parametrize("name,expected", [
    ("polygon-gluing-studio.html", "Euler characteristic χ="),
    ("simplicial-homology-studio.html", "Euler characteristic χ=")
])
def test_new_labs_render(browser, site, name, expected):
    ctx,page,errors=visit(browser,site,"tools/"+name)
    assert expected in page.locator("#result").inner_text()
    assert page.locator("svg").count()==1
    assert not errors, errors
    ctx.close()


def test_two_learners_do_not_share_attempts(browser, site):
    ctx,page,errors=visit(browser,site,"units/unit-01/mastery-check.html")
    page.evaluate("""() => localStorage.setItem('khaemenes-topology-differential-geometry-course-v1',
        JSON.stringify({activeId:'learner-A',students:[{id:'learner-A',name:'A',weeks:{}}]}))""")
    page.reload(wait_until="domcontentloaded")
    choose_formal(page,9)
    page.locator("#submitAssessment").click()
    scoped=page.evaluate("""() => JSON.parse(localStorage.getItem('khaemenes-topology-differential-geometry-assessment-v2:learner-A'))['unit-01'].attempts.length""")
    assert scoped==1
    page.evaluate("""() => localStorage.setItem('khaemenes-topology-differential-geometry-course-v1',
        JSON.stringify({activeId:'learner-B',students:[{id:'learner-B',name:'B',weeks:{}}]}))""")
    page.reload(wait_until="domcontentloaded")
    assert page.locator("#assessmentRoot input:checked").count()==0
    assert page.evaluate("""() => localStorage.getItem('khaemenes-topology-differential-geometry-assessment-v2:learner-B')""") is not None
    assert not errors, errors
    ctx.close()


@pytest.mark.parametrize("path", ["index.html", "units/unit-01/lessons/u01-l02.html", "tools/polygon-gluing-studio.html", "tools/simplicial-homology-studio.html"])
def test_255px_mobile_no_document_overflow(browser, site, path):
    ctx,page,errors=visit(browser,site,path,width=255)
    if "lessons" in path:
        page.locator("#topicMasteryCheck").wait_for(timeout=20000)
    assert page.evaluate("document.documentElement.scrollWidth<=window.innerWidth+2"),path
    assert not errors, errors
    ctx.close()
