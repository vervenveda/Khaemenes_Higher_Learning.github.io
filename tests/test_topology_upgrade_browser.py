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
    page.goto(site + BASE + "records/learner-profile.html", wait_until="domcontentloaded")
    assert "1 of 92 mathematics topic checks" in page.locator("#topicSummary").inner_text()
    with page.expect_download() as download_info:
        page.locator("#exportLessonRecords").click()
    assert download_info.value.suggested_filename == "topology-lesson-evidence.json"
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


def test_all_remaining_72_lessons_have_distinct_math_workshops(browser, site):
    ctx, page, errors = visit(browser, site, "units/unit-02/lessons/u02-l02.html")
    seen = set()
    for unit in range(2, 14):
        for lesson in range(2, 8):
            lesson_id = f"u{unit:02d}-l{lesson:02d}"
            if lesson_id != "u02-l02":
                page.goto(
                    site + BASE + f"units/unit-{unit:02d}/lessons/{lesson_id}.html",
                    wait_until="domcontentloaded"
                )
            page.locator("#mathWorkshopProof").wait_for(timeout=20000)
            assert page.locator("#rigor-workshop").count() == 1, lesson_id
            example = page.locator("#rigor-workshop h3").first.inner_text()
            assert "Statement and verified reasoning" in example
            assert page.locator("#rigor-workshop textarea").count() == 2
            title = page.locator("#rigor-workshop .lesson-section p").first.inner_text()
            assert len(title) > 80, lesson_id
            seen.add(lesson_id)
    assert len(seen) == 72
    assert not errors, errors
    ctx.close()


def test_workshop_proof_evidence_saved_by_student(browser, site):
    ctx, page, errors = visit(browser, site, "units/unit-08/lessons/u08-l04.html")
    page.locator("#mathWorkshopProof").wait_for(timeout=20000)
    page.locator("#mathWorkshopProof").fill("Given regularity of the parameter derivatives, their cross product is nonzero; the tangent plane is spanned by them.")
    page.locator("#mathWorkshopReflection").fill("Without independent derivatives a singular patch could fail to define a surface.")
    page.locator("#saveMathWorkshop").click()
    assert "saved locally" in page.locator("#mathWorkshopStatus").inner_text().lower()
    page.reload(wait_until="domcontentloaded")
    page.locator("#mathWorkshopProof").wait_for(timeout=20000)
    assert "Given regularity" in page.locator("#mathWorkshopProof").input_value()
    assert "singular patch" in page.locator("#mathWorkshopReflection").input_value()
    assert not errors, errors
    ctx.close()


def test_proof_evidence_is_separated_for_two_course_learners(browser, site):
    ctx, page, errors = visit(browser, site, "units/unit-08/lessons/u08-l04.html")
    page.evaluate("""() => localStorage.setItem('khaemenes-topology-differential-geometry-course-v1',
         JSON.stringify({activeId:'proof-learner-A', students:[]}))""")
    page.reload(wait_until="domcontentloaded")
    page.locator("#mathWorkshopProof").wait_for(timeout=20000)
    page.locator("#mathWorkshopProof").fill("Learner A proves that two tangent derivatives are independent.")
    page.locator("#saveMathWorkshop").click()
    page.evaluate("""() => localStorage.setItem('khaemenes-topology-differential-geometry-course-v1',
         JSON.stringify({activeId:'proof-learner-B', students:[]}))""")
    page.reload(wait_until="domcontentloaded")
    page.locator("#mathWorkshopProof").wait_for(timeout=20000)
    assert page.locator("#mathWorkshopProof").input_value()==""
    page.locator("#mathWorkshopProof").fill("Learner B submits a distinct argument.")
    page.locator("#saveMathWorkshop").click()
    page.evaluate("""() => localStorage.setItem('khaemenes-topology-differential-geometry-course-v1',
         JSON.stringify({activeId:'proof-learner-A', students:[]}))""")
    page.reload(wait_until="domcontentloaded")
    page.locator("#mathWorkshopProof").wait_for(timeout=20000)
    assert page.locator("#mathWorkshopProof").input_value().startswith("Learner A")
    assert not errors, errors
    ctx.close()


def test_offline_workshop_cache_after_course_install(browser, site):
    ctx, page, errors = visit(browser, site, "index.html")
    page.evaluate("""async () => { if (!('serviceWorker' in navigator)) throw Error('service worker unavailable');
       await navigator.serviceWorker.ready; }""")
    page.reload(wait_until="domcontentloaded")
    page.wait_for_function("!!navigator.serviceWorker.controller", timeout=20000)
    ctx.set_offline(True)
    page.goto(site + BASE + "units/unit-08/lessons/u08-l04.html", wait_until="domcontentloaded", timeout=20000)
    page.locator("#mathWorkshopProof").wait_for(timeout=20000)
    assert "Worked mathematical investigation" in page.locator("#rigor-workshop").inner_text()
    ctx.set_offline(False)
    ctx.close()


def test_narrow_mobile_workshop_visible(browser, site):
    ctx, page, errors = visit(browser, site, "units/unit-08/lessons/u08-l04.html", width=255)
    page.locator("#mathWorkshopProof").wait_for(timeout=20000)
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth + 2")
    assert not errors, errors
    ctx.close()


def check_unit00(page, correct_count):
    return page.evaluate("""correctCount => {
      const bank=window.KHAEMENES_TOPOLOGY_UNIT00_QUESTIONS;
      const cards=[...document.querySelectorAll('#bridgeQuestions [data-q]')];
      if(!cards.length)throw Error('Unit 00 question list absent');
      cards.forEach((card,i)=>{
        const prompt=card.querySelector('legend').textContent.replace(/^\\d+\\.\\s*/, '');
        const q=bank.find(q=>q.prompt===prompt);
        if(!q)throw Error('Question missing from Unit 00 bank: '+prompt);
        card.querySelectorAll('input[type=radio]')[i<correctCount?q.answer:(q.answer+1)%4].click();
      });
      return cards.length;
    }""", correct_count)


def test_placement_diagnostic_routes_under_80_to_unit00(browser, site):
    ctx, page, errors = visit(browser,site,"diagnostic/index.html")
    page.locator("#assessmentRoot article.question").first.wait_for(timeout=20000)
    assert page.locator("#assessmentRoot article.question").count()==40
    page.evaluate("""() => {
      const bank=window.TOPOLOGY_DIFFERENTIAL_GEOMETRY_DIAGNOSTIC;
      [...document.querySelectorAll('#assessmentRoot article.question')].forEach((card,i)=>{
        const prompt=card.querySelector('legend').textContent.replace(/^\\d+\\.\\s*/, '');
        const q=bank.find(x=>x.prompt===prompt);
        if(!q)throw Error('diagnostic item not found');
        card.querySelectorAll('input[type=radio]')[i<30?q.answer:(q.answer+1)%4].click();
      });
    }""")
    page.locator("#submitAssessment").click()
    page.wait_for_timeout(100)
    assert "75%" in page.locator("#assessmentMessage").inner_text()
    assert "Unit 00" in page.locator("#readinessOutcome").inner_text()
    assert page.locator("#readinessOutcome a").get_attribute("href").endswith("units/unit-00/index.html")
    assert not errors, errors
    ctx.close()


@pytest.mark.parametrize("n", list(range(1,7)))
def test_six_unit00_lesson_routes_and_questions(browser, site, n):
    ctx, page, errors = visit(browser,site,f"units/unit-00/lessons/u00-l{n:02d}.html")
    if n>1:
        page.evaluate("""n => {
            let record={lessons:{}};
            for(let i=1;i<n;i++)record.lessons[i]={passed:true,score:80};
            localStorage.setItem('khaemenes-topology-differential-geometry-unit00-v1:learner-1',JSON.stringify(record));
        }""",n)
        page.reload(wait_until="domcontentloaded")
    page.locator("#bridgeQuestions [data-q]").first.wait_for(timeout=20000)
    assert page.locator("#bridgeQuestions [data-q]").count()==10
    assert page.locator("#bridgeProof").count()==1
    assert not errors, errors
    ctx.close()


def test_unit00_80_percent_correct_and_reload_locks(browser, site):
    ctx, page, errors=visit(browser,site,"units/unit-00/lessons/u00-l01.html")
    page.locator("#bridgeQuestions").wait_for(timeout=20000)
    check_unit00(page,7)
    page.locator("#bridgeProof").fill("Choose arbitrary x in A∩B; the definition of intersection guarantees x belongs to A and B, hence x belongs to A.")
    page.locator("#bridgeCorrections").fill("One confirming example cannot establish that all elements satisfy an assertion.")
    page.locator("#submitBridge").click()
    assert "70%" in page.locator("#lessonScore").inner_text()
    assert not page.locator("#submitBridge").is_disabled()
    page.reload(wait_until="domcontentloaded")
    page.locator("#bridgeQuestions").wait_for(timeout=20000)
    assert page.locator("#bridgeQuestions input:checked").count()==10
    check_unit00(page,8)
    page.locator("#submitBridge").click()
    assert "80%" in page.locator("#lessonScore").inner_text()
    assert page.locator("#submitBridge").is_disabled()
    page.reload(wait_until="domcontentloaded")
    assert page.locator("#submitBridge").is_disabled()
    assert page.locator("#bridgeQuestions input:disabled").count()==40
    assert not errors, errors
    ctx.close()


def test_unit00_exit_requires_six_lessons_and_20_correct(browser,site):
    ctx,page,errors=visit(browser,site,"units/unit-00/exit-check.html")
    assert "not yet open" in page.locator("#bridgeContent").inner_text().lower()
    page.evaluate("""() => {
      let record={lessons:{}};
      for(let i=1;i<=6;i++)record.lessons[i]={passed:true,score:80};
      localStorage.setItem('khaemenes-topology-differential-geometry-unit00-v1:learner-1',JSON.stringify(record));
    }""")
    page.reload(wait_until="domcontentloaded")
    page.locator("#bridgeQuestions").wait_for(timeout=20000)
    assert check_unit00(page,20)==24
    page.locator("#bridgeProof").fill("For continuous maps f:X→Y and g:Y→Z, the inverse image of each open set U in Z under g∘f is f⁻¹(g⁻¹(U)); continuity of g makes the inner preimage open in Y and continuity of f makes the outer preimage open in X.")
    page.locator("#bridgeCorrections").fill("A bijection can fail continuity, and a continuous bijection can have an inverse that is not continuous. The inverse hypotheses must be independently checked.")
    page.locator("#submitBridge").click()
    assert page.locator("#submitBridge").is_disabled()
    record=page.evaluate("""() => JSON.parse(localStorage.getItem('khaemenes-topology-differential-geometry-unit00-v1:learner-1'))""")
    assert record["exit"]["score"]>=80
    assert record["exit"]["passed"] is True
    page.reload(wait_until="domcontentloaded")
    assert page.locator("#submitBridge").is_disabled()
    assert not errors, errors
    ctx.close()


def test_unit00_two_learners_isolated(browser,site):
    ctx,page,errors=visit(browser,site,"units/unit-00/lessons/u00-l01.html")
    page.locator("#bridgeProof").wait_for(timeout=20000)
    page.locator("#bridgeProof").fill("Learner A proof evidence remains entirely separate from Learner B.")
    page.evaluate("""() => {
      document.getElementById('bridgeProof').dispatchEvent(new Event('input',{bubbles:true}));
      localStorage.setItem('khaemenes-topology-differential-geometry-course-v1',JSON.stringify({activeId:'second-learner',students:[{id:'second-learner',weeks:{}}]}))
    }""")
    page.reload(wait_until="domcontentloaded")
    page.locator("#bridgeProof").wait_for(timeout=20000)
    assert page.locator("#bridgeProof").input_value()==""
    assert not errors, errors
    ctx.close()



def test_revised_diagnostic_has_balanced_answer_positions(browser,site):
    ctx,page,errors=visit(browser,site,"diagnostic/index.html")
    page.locator("#assessmentRoot article.question").first.wait_for(timeout=20000)
    vals=page.evaluate("""() => {
      const q=window.TOPOLOGY_DIFFERENTIAL_GEOMETRY_DIAGNOSTIC;
      const freq=[0,0,0,0];
      q.forEach(item=>{freq[item.answer]++;if(!item.id.startsWith('diagnostic-v2-'))throw Error('old question bank')});
      return {total:q.length,unique:new Set(q.map(x=>x.prompt)).size,frequency:freq};
    }""")
    assert vals=={"total":40,"unique":40,"frequency":[10,10,10,10]}
    assert not errors,errors
    ctx.close()


def test_legacy_diagnostic_does_not_lock_or_claim_revised_placement(browser,site):
    ctx,page,errors=visit(browser,site,"diagnostic/index.html")
    page.evaluate("""() => localStorage.setItem('khaemenes-topology-differential-geometry-assessment-v2:learner-1',
      JSON.stringify({diagnostic:{attempts:[{date:'2026-10-01',score:100,total:40}],draft:{ids:['diagnostic-01'],choices:[0],passed:true,lastScore:100}}}))""")
    page.reload(wait_until="domcontentloaded")
    page.locator("#assessmentRoot article.question").first.wait_for(timeout=20000)
    assert not page.locator("#submitAssessment").is_disabled()
    assert "earlier" in page.locator("#readinessOutcome").inner_text().lower()
    assert page.locator("#assessmentRoot input:checked").count()==0
    assert not errors,errors
    ctx.close()


def test_revised_diagnostic_80_percent_direct_route_and_profile(browser,site):
    ctx,page,errors=visit(browser,site,"diagnostic/index.html")
    page.locator("#assessmentRoot article.question").first.wait_for(timeout=20000)
    page.evaluate("""() => {
      const bank=window.TOPOLOGY_DIFFERENTIAL_GEOMETRY_DIAGNOSTIC;
      [...document.querySelectorAll('#assessmentRoot article.question')].forEach((card,i)=>{
        const prompt=card.querySelector('legend').textContent.replace(/^\\d+\\.\\s*/, '');
        const q=bank.find(x=>x.prompt===prompt);
        if(!q)throw Error('question lookup failed');
        card.querySelectorAll('input[type=radio]')[i<32?q.answer:(q.answer+1)%4].click();
      });
    }""")
    page.locator("#submitAssessment").click()
    page.wait_for_timeout(100)
    assert "80%" in page.locator("#assessmentMessage").inner_text()
    assert "Official Unit 01" in page.locator("#readinessOutcome").inner_text()
    assert page.locator("#readinessOutcome .readiness-strand-table tbody tr").count()==6
    with page.expect_download() as placement_file:
        page.get_by_role("button",name="Export Six-Strand Placement Evidence").click()
    assert placement_file.value.suggested_filename=="topology-placement-six-strand.json"
    history=page.evaluate("""() => JSON.parse(localStorage.getItem('khaemenes-topology-differential-geometry-assessment-v2:learner-1')).diagnostic.attempts""")
    assert history[-1]["assessmentVersion"]=="topology-readiness-v2"
    page.goto(site+BASE+"records/learner-profile.html",wait_until="domcontentloaded")
    assert "80%" in page.locator("#preCourseSummary").inner_text()
    assert page.locator("#exportReadiness").count()==1
    assert not errors,errors
    ctx.close()


def test_offline_unit00_lessons_open_with_questions(browser,site):
    ctx,page,errors=visit(browser,site,"index.html")
    page.evaluate("""async () => {await navigator.serviceWorker.ready}""")
    page.reload(wait_until="domcontentloaded")
    page.wait_for_function("!!navigator.serviceWorker.controller",timeout=20000)
    ctx.set_offline(True)
    page.goto(site+BASE+"units/unit-00/lessons/u00-l01.html",wait_until="domcontentloaded",timeout=20000)
    page.locator("#bridgeQuestions [data-q]").first.wait_for(timeout=20000)
    assert page.locator("#bridgeQuestions [data-q]").count()==10
    ctx.set_offline(False)
    ctx.close()
