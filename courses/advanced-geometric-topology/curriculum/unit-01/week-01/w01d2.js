"use strict";
(function () {
  window.KHAEMENES_LESSONS = window.KHAEMENES_LESSONS || {};
  window.KHAEMENES_LESSONS["W01D2"] = {
    id:"W01D2", week:1, day:2, unit:1,
    title:"Theorem & Proof Workshop: Polygonal Models and Quotient Surfaces",
    topic:"Proof architecture for polygonal models, edge identifications, and quotient surfaces",
    estimatedMinutes:100,
    objectives:[
      "State a quotient-surface claim with hypotheses and conclusions separated explicitly.",
      "Build a proof skeleton from definitions, induced equivalence relations, quotient cells, and invariants.",
      "Prove that the standard square presentation aba⁻¹b⁻¹ has one quotient vertex, two quotient edges, and one quotient face.",
      "Use Euler characteristic and orientability as distinct pieces of evidence.",
      "Audit a proof for hidden assumptions and unsupported diagram claims.",
      "Construct a counterexample showing why equal Euler characteristic alone does not force homeomorphism.",
      "Revise a proof after identifying a missing hypothesis or unjustified inference."
    ],
    prerequisites:[
      "W01D1 quotient-space and edge-pairing vocabulary",
      "Equivalence relations and transitive closure",
      "Finite CW decompositions and Euler characteristic",
      "Definition of homeomorphism",
      "Basic orientability language"
    ],
    warmup:[
      "Write the standard torus boundary word and identify its two edge pairs.",
      "Explain why quotient vertex count must be proved from the generated equivalence relation.",
      "State what Euler characteristic can establish and one thing it cannot establish by itself.",
      "Name the difference between evidence that supports a claim and an argument that proves it."
    ],
    reading:[
      {heading:"1. Proofs begin with the claim, not the picture",paragraphs:[
        "A polygon diagram represents an equivalence relation. A proof must translate the diagram into statements about identified points, quotient cells, and topological invariants.",
        "A strong proof states the space, identifications, and precise conclusion, then names the definitions or results that permit each transition."
      ]},
      {heading:"2. A reusable proof skeleton",paragraphs:[
        "Specify the polygon and edge relation; determine induced vertex classes; determine quotient 1-cells and 2-cells; compute relevant invariants; analyze orientability or other structure; then connect these facts to the intended topological conclusion.",
        "Euler characteristic may narrow possibilities, while orientability can distinguish surfaces that Euler characteristic alone does not separate."
      ]},
      {heading:"3. Hypothesis auditing",paragraphs:[
        "When using a classification statement, check compactness, connectedness, boundary conditions, orientability assumptions, and whether the quotient is actually a surface.",
        "A hypothesis audit prevents circular reasoning such as applying a classification theorem before establishing that the quotient belongs to the class of spaces the theorem classifies."
      ]},
      {heading:"4. Counterexamples test claims",paragraphs:[
        "To test a weakened statement, search for spaces satisfying the weakened hypotheses but failing the conclusion.",
        "The torus and Klein bottle both have Euler characteristic zero, yet one is orientable and the other is not. Since orientability is preserved by homeomorphism, they cannot be homeomorphic."
      ]}
    ],
    definitions:[
      {term:"Proof skeleton",statement:"An ordered outline of claims, definitions, lemmas, and invariants required to establish a conclusion."},
      {term:"Hypothesis audit",statement:"A deliberate check that every assumption required by a theorem or definition has been established."},
      {term:"Topological invariant",statement:"A quantity or property preserved under homeomorphism, such as Euler characteristic or orientability."},
      {term:"Counterexample",statement:"An example satisfying a proposed statement's hypotheses while failing its conclusion."}
    ],
    examples:[
      {title:"Euler characteristic is necessary, not sufficient",body:"Homeomorphic finite CW complexes have equal Euler characteristic, but equal Euler characteristic alone does not imply homeomorphism."},
      {title:"Torus versus Klein bottle",body:"Both have χ=0. The torus is orientable and the Klein bottle is nonorientable, so they are not homeomorphic."},
      {title:"Hypothesis failure",body:"A quotient cannot be classified by a theorem about compact connected closed surfaces until those hypotheses are established."}
    ],
    nonExamples:[
      "All four corners clearly become one point, so V=1.",
      "χ=0, therefore the quotient is a torus.",
      "The quotient is a surface because it was made by gluing a polygon."
    ],
    workedExample:{title:"Proof skeleton for the square torus presentation",steps:[
      "Let P be a square with boundary word aba⁻¹b⁻¹ and q:P→P/∼ the quotient map.",
      "Label the four vertices v1,v2,v3,v4 cyclically.",
      "Use both edge identifications to derive the induced endpoint equivalences.",
      "Take transitive closure to conclude all four vertices lie in one quotient class.",
      "The two edge pairs produce two quotient 1-cells; the interior produces one 2-cell.",
      "Thus χ=1−2+1=0.",
      "Analyze the edge-orientation pattern separately to establish orientability evidence.",
      "State explicitly which conclusions came from the quotient relation, χ, and orientability."
    ]},
    guidedPractice:[
      {prompt:"Rewrite 'χ=0 implies torus' as a defensible statement.",hint:"Include orientability and distinguish necessary from sufficient information."},
      {prompt:"Create a four-line proof skeleton showing the torus and Klein bottle are not homeomorphic.",hint:"Use one invariant they share and one they do not."},
      {prompt:"A proof invokes classification without checking the quotient is a compact connected surface. What is wrong?",hint:"The theorem's hypotheses have not been established."}
    ],
    independentPractice:[
      "Write a complete vertex-equivalence proof for the standard torus square presentation.",
      "Give a concise proof that the torus and Klein bottle are not homeomorphic.",
      "Explain why χ is a necessary test for homeomorphism but not by itself sufficient.",
      "Audit the claim 'the diagram has no twist, therefore the quotient is orientable.'",
      "State the hypotheses to verify before applying classification of compact connected closed surfaces.",
      "Construct a counterexample to 'equal Euler characteristic implies homeomorphic closed surfaces.'"
    ],
    proofTasks:[
      {title:"Primary proof",prompt:"Prove from aba⁻¹b⁻¹ that the quotient CW structure has one 0-cell, two 1-cells, and one 2-cell, hence χ=0.",rubric:[
        "Defines the polygon and quotient relation.","Derives the vertex class.","Counts quotient edge classes correctly.","Explains the single 2-cell.","Computes χ and limits the conclusion appropriately."
      ]},
      {title:"Counterexample proof",prompt:"Disprove 'equal Euler characteristic implies homeomorphic closed surfaces' using the torus and Klein bottle.",rubric:[
        "States χ=0 for both.","States the orientability difference.","Uses invariance of orientability.","Concludes the implication is false."
      ]}
    ],
    misconceptions:[
      {error:"An easy-to-compute invariant must classify the objects.",correction:"An invariant is only as discriminating as the theorem that uses it."},
      {error:"A correct final answer means the proof is complete.",correction:"A proof must justify every nontrivial implication and theorem hypothesis."},
      {error:"A diagram can replace the quotient relation.",correction:"The diagram represents the formal equivalence relation; it does not replace it."}
    ],
    mentor_prompts:[
      "Which exact statement are you proving, and which parts are hypotheses?",
      "Where does your argument first use something only visible in the diagram?",
      "Which invariant supports the conclusion, and what information is still missing?",
      "Can you break the proof by deleting one hypothesis?"
    ],
    evidence:["written proof or proof skeleton","hypothesis audit","counterexample to a weakened claim","revision note identifying one repaired inference"],
    reflectionPrompts:[
      "Which inference required the most justification?",
      "Which hypothesis would be easiest to forget?",
      "How did the counterexample change your understanding of Euler characteristic?"
    ]
  };
})();