import fs from "node:fs";
import assert from "node:assert/strict";

const bridge=fs.readFileSync("assets/khaemenes-higher-learning-bridge.js","utf8");
const start=fs.readFileSync("start/index.html","utf8");
const mentor=fs.readFileSync("mentor/index.html","utf8");

assert.ok(bridge.includes('EXPECTED_STAGE="higher"'),"bridge must retain canonical Higher Learning stage");
assert.ok(bridge.includes("mentorAssignment"),"bridge must expose NAIB mentor assignment");
assert.ok(bridge.includes("khaemenes-naib-mentor-router.js"),"bridge must know the canonical NAIB router");
assert.ok(bridge.includes("masteryThresholdMinimum:80"),"course context must publish Academy 80% minimum");
assert.ok(bridge.includes("bypassesPrerequisites:false"),"Higher Learning mentor/course authority must not bypass prerequisites");
assert.ok(bridge.includes("revealsLockedAssessments:false"),"Higher Learning mentor/course authority must not reveal locked assessments");
assert.ok(bridge.includes("scopedCourseKey"),"learner-scoped Higher Learning course keys must remain available");

assert.ok(start.includes("Open Scholar Mentor"),"Higher Learning entry must expose the scholar mentor");
assert.ok(start.includes("80% mastery"),"Higher Learning entry must state formal mastery policy");
assert.ok(start.includes("khaemenes-naib-mentor-router.js"),"Higher Learning entry must load canonical NAIB router");

assert.ok(mentor.includes("Khaemenes Higher Learning · Scholar Mentor"),"mentor surface must exist");
assert.ok(mentor.includes("allowLockedAssessmentDisclosure:false"),"mentor transport must forbid locked assessment disclosure");
assert.ok(mentor.includes("allowProgressionBypass:false"),"mentor transport must forbid progression bypass");
const canonicalBetaWidget=mentor.includes("https://vervenveda.com/assets/vnv-beta-link.js");
const canonicalBetaFallback=mentor.includes('href="https://vervenveda.com/beta/"');
assert.ok(canonicalBetaWidget||canonicalBetaFallback,"mentor surface must preserve a canonical Beta doorway (widget or CSP-safe fallback)");

console.log("Khaemenes Higher Learning mentor bridge: PASS");
