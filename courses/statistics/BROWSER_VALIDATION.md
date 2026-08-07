# Statistics Browser Interaction Report

Chromium interaction testing used the generated HTML, CSS, and JavaScript with local assets inlined because direct localhost and `file://` navigation are blocked in this environment. A deterministic in-memory substitute was used for browser storage.

## Results

- **Landing title:** `Khaemenes Higher Learning Statistics`
- **Landing H1:** `Statistics`
- **View controls:** `17`
- **Desktop horizontal overflow:** `False`
- **Weekly view visible:** `True`
- **Unit cards:** `14`
- **Units view visible:** `True`
- **Profile pin transition:** `['false', 'true']`
- **Laboratories view visible:** `True`
- **Laboratory dialog opened:** `True`
- **Theme transition:** `['dark', 'light']`
- **Mobile horizontal overflow:** `False`
- **Lesson title:** `Statistics as an Evidence Discipline · Statistics`
- **Interactive questions:** `4`
- **Worksheet problems:** `6`
- **Quick-check result:** `4/4 correct · 100%`
- **Reflection result:** `Reflection saved locally.`
- **Lesson completion:** `Completed locally · Quick check 100%.`
- **Midterm questions:** `60`

## Laboratory output checks

- Data Explorer: `Sorted data: 4, 5, 6, 7, 8, 8, 9, 10, 11, 12, 13, 15, 18, 28
Q1=7.250 · Q3=12.750
Fences: -1.000 to 21.000
Potential outliers: 28

Interpret center and spread i`
- Sampling & Simulation: `True p = 0.4
Mean of p-hat = 0.39874
Simulated SD = 0.04919
Theoretical SE = 0.04899
95% Wald interval coverage = 95.35%

Check whether np and n(1-p) are large `
- Inference & Regression: `n=8
y-hat = 0.32857 + 1.68810x
r = 0.99971
R² = 0.99942
Residual SD = 0.10728
SE(slope) = 0.01655
t for slope=0 = 101.98184

Inspect residual shape, influence, `

## Errors

- Page errors: `0`
- Console errors: `0`

A final smoke test on the published GitHub Pages URL is still recommended because production hosting headers, service-worker scope, external iframe policies, and a learner’s actual browser storage operate only after deployment.
