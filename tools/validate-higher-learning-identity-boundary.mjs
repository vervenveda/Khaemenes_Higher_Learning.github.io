import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const passes = [];

function rel(p){ return p.split(path.sep).join("/"); }
function file(p){
  const full = path.join(ROOT, p);
  if(!fs.existsSync(full)){
    failures.push(`missing required file: ${p}`);
    return "";
  }
  return fs.readFileSync(full, "utf8");
}
function expect(condition, message){
  if(condition) passes.push(message);
  else failures.push(message);
}
function includes(p, needles){
  const text = file(p);
  for(const needle of needles){
    expect(text.includes(needle), `${p} contains ${JSON.stringify(needle)}`);
  }
  return text;
}
function listDirs(p){
  const full = path.join(ROOT, p);
  return fs.readdirSync(full, {withFileTypes:true}).filter(x=>x.isDirectory()).map(x=>x.name).sort();
}

// Canonical shared boundaries.
const appScope = includes("assets/khaemenes-higher-app-scope.js", [
  'identityAuthority:"academy-family-registry"',
  'legacyMigration:"only-when-sole-higher-scholar"',
  'learnerScopedStorage:true',
  'noScholarPersistence:"fail-closed"',
  'canonicalCertificateIdentity:true'
]);
expect(appScope.includes('if(mode==="career")'), "shared app scope covers Career");
expect(appScope.includes('if(mode==="ged")'), "shared app scope covers GED");
expect(appScope.includes('if(mode==="science")'), "shared app scope covers Science");
expect(appScope.includes('if(mode==="coding")'), "shared app scope covers Coding");
expect(appScope.includes("khaemenes.higher.app:${s.learnerId}:${key}"), "shared app scope keys learner records by Academy learner id");

const courseAdapter = includes("assets/khaemenes-course-identity-adapter.js", [
  'identityAuthority:"academy-family-registry"',
  'duplicateLearnerCreation:false',
  'multiLearnerCourseAccounts:false',
  'noScholarPersistence:"fail-closed"'
]);
expect(courseAdapter.includes("state.students=[student]"), "mathematics adapter collapses course-local account lists to the active Academy scholar");
expect(courseAdapter.includes('studentSelect'), "mathematics adapter locks legacy student switching controls");
expect(courseAdapter.includes('addLearner'), "mathematics adapter locks legacy learner creation controls");

const profileAdapter = includes("assets/khaemenes-higher-learning-profile-adapter.js", [
  'identityAuthority:"academy-family-registry"'
]);
expect(profileAdapter.includes('if(key===LEGACY_PROFILE_KEY){if(scholar)savePreferencesObject'), "profile adapter fails closed for profile writes without an Academy scholar");
expect(profileAdapter.includes('if(key===PINNED_KEY){if(scholar?.learnerId)rawSet'), "profile adapter fails closed for pinned-course writes without an Academy scholar");
expect(profileAdapter.includes('if(key===FAVORITES_KEY){if(scholar?.learnerId)rawSet'), "profile adapter fails closed for resource-favorite writes without an Academy scholar");
expect(!/legacy[^\n]{0,120}name[^\n]{0,120}(import|promot)/i.test(profileAdapter), "profile adapter does not advertise legacy display-name promotion");

includes("assets/khaemenes-core-page-loader.js", ["dataset?.core", "dataset?.scope"]);

// Campus and department identity wrappers.
includes("index.html", ["index-core.txt", "assets/khaemenes-higher-learning-profile-adapter.js"]);
includes("courses/index.html", ["index-core.txt", "../assets/khaemenes-higher-learning-profile-adapter.js"]);
includes("Science/index.html", ["index-core.txt", "../assets/khaemenes-higher-app-scope.js"]);
includes("Career/index.html", ["index-core.txt", "../assets/khaemenes-higher-app-scope.js"]);

// GED learner-bearing surfaces. Interactive_index.html is intentionally direct and has no persistent learner record.
for(const p of ["GED/Preparation_index.html", "GED/Survey_index.html", "GED/portal_index.html"]){
  includes(p, ["khaemenes-core-page-loader.js", "khaemenes-higher-app-scope.js"]);
}
const gedInteractive = file("GED/Interactive_index.html");
expect(!/(?:localStorage|sessionStorage|indexedDB)/.test(gedInteractive), "GED/Interactive_index.html remains non-persistent");

// Career application wrappers.
for(const p of [
  "Career/apps/assessment-mentor_index.html",
  "Career/apps/career-assessment_index.html",
  "Career/apps/career-mentor-hub_index.html",
  "Career/apps/career-star_index.html"
]){
  includes(p, ["khaemenes-core-page-loader.js", "khaemenes-higher-app-scope.js"]);
}
includes("Career/directory-agi/index.html", ["index-core.txt", "identity-scope.js"]);

// Complete Coding 101-303 wrapper family.
for(const p of [
  "Technology/coding/coding-101/index.html",
  "Technology/coding/coding-102/index.html",
  "Technology/coding/coding-103/index.html",
  "Technology/coding/coding-201_index.html",
  "Technology/coding/coding-202_index.html",
  "Technology/coding/coding-203_index.html",
  "Technology/coding/coding-301_index.html",
  "Technology/coding/coding-302_index.html",
  "Technology/coding/coding-303_index.html"
]){
  includes(p, ["khaemenes-core-page-loader.js", "khaemenes-higher-app-scope.js"]);
}

// The nine shared mathematics engines must all enter through the Academy identity adapter.
const mathCourses = [
  "calculus-ii",
  "linear-algebra",
  "differential-equations",
  "statistics",
  "discrete-mathematics",
  "introduction-to-proofs",
  "real-complex-analysis",
  "abstract-algebra",
  "topology-differential-geometry"
];
for(const course of mathCourses){
  const p = `courses/${course}/assets/app.js`;
  const text = includes(p, ["khaemenes-course-identity-adapter.js", `courseId:\"${course}\"`]);
  expect(!text.includes("localStorage.setItem"), `${p} wrapper does not bypass the shared identity boundary`);
}

// Advanced Geometric Topology has its own V1/V2 storage boundary and must load it before course storage/runtime.
const agtIndex = file("courses/advanced-geometric-topology/index.html");
const agtScopeAt = agtIndex.indexOf('assets/identity-scope.js');
const agtStorageAt = agtIndex.indexOf('assets/js/storage.js');
expect(agtScopeAt >= 0, "Advanced Geometric Topology loads its identity scope");
expect(agtStorageAt >= 0 && agtScopeAt < agtStorageAt, "Advanced Geometric Topology installs identity scope before V2 storage");
const agtScope = includes("courses/advanced-geometric-topology/assets/identity-scope.js", [
  "khaemenes-hl-agtgmp-progress-v1",
  "khaemenes-hl-agtgmp-progress-v2"
]);
expect(agtScope.includes("learnerId"), "Advanced Geometric Topology scope is learner-aware");

// Scholar Entry is a bridge, never a local account factory.
const start = file("start/index.html");
expect(start.includes("khaemenes-family-registry.js"), "Scholar Entry reads the Academy Family Registry");
expect(!/(?:registerLearner|createLearner|addLearner)\s*\(/.test(start), "Scholar Entry does not create a separate learner");
expect(!/localStorage\.setItem\([^\n]*(?:student|learner|profile|account)/i.test(start), "Scholar Entry does not persist a second learner profile");

// Public mentor reads Academy context but owns no learner persistence.
const mentor = file("mentor/index.html");
expect(mentor.includes("khaemenes-family-registry.js"), "Higher Learning mentor reads Academy learner context");
expect(!/(?:localStorage|sessionStorage|indexedDB)/.test(mentor), "Higher Learning mentor does not own learner persistence");

// Core snapshots must remain inert source, never executable replacements.
const protectedSnapshots = [
  "index-core.txt",
  "courses/index-core.txt",
  "Science/index-core.txt",
  "Career/index-core.txt",
  "GED/Preparation_core.txt",
  "GED/Survey_core.txt",
  "GED/portal_core.txt"
];
for(const p of protectedSnapshots){
  expect(fs.existsSync(path.join(ROOT,p)), `${p} preserved as an inert source snapshot`);
}

// No learner identity parameters in the executable wrappers we control.
const wrapperFiles = [
  "index.html", "courses/index.html", "Science/index.html", "Career/index.html",
  "GED/Preparation_index.html", "GED/Survey_index.html", "GED/portal_index.html",
  "Technology/coding/coding-201_index.html", "Technology/coding/coding-202_index.html",
  "Technology/coding/coding-203_index.html", "Technology/coding/coding-301_index.html",
  "Technology/coding/coding-302_index.html", "Technology/coding/coding-303_index.html"
];
for(const p of wrapperFiles){
  const text=file(p);
  expect(!/(?:familyId|learnerId|adultId)\s*=/.test(text), `${p} does not place Registry identifiers in public URL/query construction`);
}

if(failures.length){
  console.error(`Higher Learning identity boundary: FAILED (${failures.length} issue${failures.length===1?"":"s"})`);
  for(const failure of failures) console.error(` - ${failure}`);
  process.exit(1);
}
console.log(`Higher Learning identity boundary: PASSED (${passes.length} checks)`);
console.log("Authority: Khaemenes Academy Family Registry");
console.log("Scope: Higher Learning identity wrappers, learner-owned browser records, certificates, and course-local account controls");
