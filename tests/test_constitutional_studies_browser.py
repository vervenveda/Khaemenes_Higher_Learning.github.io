"""Offline Chromium smoke tests for Khaemenes Constitutional Studies.

Run from repository root:
  python -m pip install playwright pytest
  python -m playwright install chromium
  pytest -q tests/test_constitutional_studies_browser.py
"""
import json
import pathlib
import socket
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from functools import partial

import pytest
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parents[1]
BASE = "/courses/constitutional-studies/"
class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

@pytest.fixture(scope="session")
def site():
    httpd = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=str(ROOT)))
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    yield f"http://127.0.0.1:{httpd.server_port}" + BASE
    httpd.shutdown()
    thread.join(timeout=3)

@pytest.fixture
def browser():
    with sync_playwright() as pw:
        b = pw.chromium.launch(headless=True, args=["--no-sandbox"])
        yield b
        b.close()

def visit(browser, site, filename, width=900):
    context = browser.new_context(viewport={"width": width, "height": 850}, accept_downloads=True)
    page = context.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(site + filename, wait_until="domcontentloaded")
    return page, context, errors

def passed_week(student="Browser QA Student"):
    return {
        "answers": ["Primary document evidence supports the proposed constitutional claim; the author, date, and response require independent consideration."] * 5,
        "profile": {"student": student, "grade": "10", "date": "2026-10-20", "reviewer": "QA Parent", "reviewNotes": "Primary documents examined."},
        "attempts": [{
            "date": "2026-10-20T12:00:00Z", "score": 10, "total": 10, "percent": 100,
            "details": [{"question": "Test question", "answer": "Correct", "response": "Correct", "correct": True} for _ in range(10)]
        }],
        "reviewed": True,
    }

@pytest.mark.parametrize("week", [1, 2, 3, 4])
def test_week_render_255px_and_no_js_errors(browser, site, week):
    page, context, errors = visit(browser, site, f"week-{week:02d}/", 255)
    assert page.locator("#lesson h3").count() >= 1
    assert page.locator("#tabs button").count() == 5
    assert page.locator("#vocabWord").inner_text()
    assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 2"), "horizontal overflow at 255px"
    assert not errors, errors
    context.close()

def test_week_2_gate_and_completed_week_1_unlock(browser, site):
    page, context, errors = visit(browser, site, "week-02/")
    assert page.locator("#begin").is_disabled()
    page.evaluate("(data) => localStorage.setItem('khaemenes.billofrights.week01.v1', JSON.stringify(data))", passed_week())
    page.locator("#checkPrior").click()
    assert page.locator("#begin").is_enabled()
    page.locator("#begin").click()
    assert "Question 1 of 10" in page.locator("#question").inner_text()
    assert not errors, errors
    context.close()

def test_interrupted_quiz_restores_and_does_not_double_score(browser, site):
    page, context, errors = visit(browser, site, "week-01/")
    page.locator("#begin").click()
    page.locator("#question .answer").first.click()
    assert page.locator("#question .answer").first.is_disabled()
    page.locator("#question button").last.click()  # next question
    page.reload()
    assert "Question 2 of 10" in page.locator("#question").inner_text()
    assert not errors, errors
    context.close()

def test_export_download_week_1(browser, site):
    page, context, errors = visit(browser, site, "week-01/")
    page.locator("#student").fill("QA Student")
    with page.expect_download() as download_info:
        page.locator("#export").click()
    downloaded = download_info.value
    assert downloaded.suggested_filename == "khaemenes-bill-of-rights-week01.json"
    assert not errors, errors
    context.close()

def test_final_locked_with_incomplete_weeks_and_certificate_hidden(browser, site):
    page, context, errors = visit(browser, site, "completion.html", 255)
    assert page.locator("#start").is_disabled()
    assert page.locator("#certificate").is_hidden()
    assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 2")
    assert not errors, errors
    context.close()

def test_final_unlocked_with_all_four_week_records(browser, site):
    page, context, errors = visit(browser, site, "completion.html")
    page.evaluate("""() => { for(let i=1;i<=4;i++){const data={
      answers:Array(5).fill('A claim supported by dated primary evidence and source citations in this learning portfolio.'),
      profile:{student:'QA Student',reviewer:'QA Reviewer',grade:'10',date:'2026-10-20'},
      reviewed:true,
      attempts:[{date:'2026-10-20',score:10,total:10,percent:100,
      details:Array.from({length:10},()=>({question:'Test',answer:'Yes',response:'Yes',correct:true}))}]
    };localStorage.setItem('khaemenes.billofrights.week0'+i+'.v1',JSON.stringify(data))} }""")
    page.locator("#refresh").click()
    assert page.locator("#start").is_enabled()
    page.locator("#start").click()
    assert "Question 1 of 40" in page.locator("#exam").inner_text()
    page.locator("#exam .choice").first.click()
    assert "Feedback will be available" in page.locator("#exam").inner_text()
    assert "correct answer:" not in page.locator("#exam").inner_text().lower()
    assert not errors, errors
    context.close()


def test_incorrect_import_rejected_without_loss(browser, site):
    page, context, errors = visit(browser, site, "week-01/")
    page.locator("#student").fill("Kept Student")
    import tempfile
    with tempfile.NamedTemporaryFile(mode="w", suffix=".json", encoding="utf-8", delete=False) as tmp:
        json.dump({"week":1,"answers":["x"]*5,"attempts":[{"score":99}],"profile":{}}, tmp)
        invalid = tmp.name
    try:
        page.locator("#importFile").set_input_files(invalid)
        assert "Import failed" in page.locator("#result").inner_text()
        assert page.locator("#student").input_value() == "Kept Student"
    finally:
        pathlib.Path(invalid).unlink(missing_ok=True)
    assert not errors, errors
    context.close()

def test_certificate_requires_final_and_review(browser, site):
    page, context, errors = visit(browser, site, "completion.html")
    page.evaluate("""() => {for(let i=1;i<=4;i++){localStorage.setItem('khaemenes.billofrights.week0'+i+'.v1',JSON.stringify({
        answers:Array(5).fill('A documented primary source supports the reasoned claim discussed in the response.'),
        profile:{student:'QA Learner'},reviewed:true,attempts:[{
        total:10,score:10,percent:100,date:'2026-10-20',
        details:Array.from({length:10},()=>({question:'Test',answer:'Yes',response:'Yes',correct:true}))}]}
    ))}}""")
    page.locator("#refresh").click()
    assert page.locator("#certificate").is_hidden()
    page.locator("#reviewer").fill("QA Reviewer")
    page.locator("#capstone").check()
    page.locator("#saveReview").click()
    assert page.locator("#certificate").is_hidden()
    assert not errors, errors
    context.close()
