"use strict";
(function () {
  window.KHAEMENES_LESSONS = window.KHAEMENES_LESSONS || {};

  window.KHAEMENES_LESSONS["W01D1"] = {
    id: "W01D1",
    week: 1,
    day: 1,
    unit: 1,
    title: "Polygonal Models, Edge Identifications, and Quotient Surfaces",
    topic: "Polygonal models, edge identifications, and quotient surfaces",
    estimatedMinutes: 90,

    objectives: [
      "Define an equivalence relation and explain how a quotient space is formed from identified points.",
      "Read an oriented edge-pairing word on a polygon and identify which boundary edges are glued.",
      "Track vertex equivalence classes induced by edge identifications.",
      "Construct basic quotient models for the sphere, torus, projective plane, and Klein bottle.",
      "Compute Euler characteristic from a polygonal quotient model.",
      "Use edge orientation data to make an initial orientability determination.",
      "Distinguish a visual model, a finite combinatorial check, and a proof."
    ],

    prerequisites: [
      "Equivalence relations",
      "Quotient topology",
      "CW-complex language",
      "Euler characteristic",
      "Basic orientation ideas"
    ],

    warmup: [
      "State the three properties required of an equivalence relation.",
      "If a square has opposite edges identified, what must be checked before you count quotient vertices?",
      "Explain why a picture of a glued polygon is evidence of intuition but is not by itself a proof of homeomorphism.",
      "Recall the formula χ = V − E + F for a finite CW decomposition."
    ],

    reading: [
      {
        heading: "1. From identifications to quotient spaces",
        paragraphs: [
          "A polygonal model begins with a compact polygon P and an equivalence relation on selected boundary points. The quotient space P/∼ is obtained by treating equivalent boundary points as a single point while leaving nonidentified points distinct.",
          "The geometry drawn on the page is secondary. What matters topologically is the equivalence relation. Two diagrams can look different while describing the same quotient space, and similar-looking diagrams can encode different quotients."
        ]
      },
      {
        heading: "2. Edge-pairing notation",
        paragraphs: [
          "Give each edge a label and an orientation. A common convention records the labels encountered while traversing the polygon boundary once. Repeated labels indicate the two edges to be paired. Whether the second occurrence agrees with or reverses the traversal orientation records how the gluing is performed.",
          "For example, the standard torus can be represented by the boundary word a b a⁻¹ b⁻¹. The inverse symbols indicate that each matching pair is glued with opposite boundary traversal direction."
        ]
      },
      {
        heading: "3. Vertex classes matter",
        paragraphs: [
          "Before computing Euler characteristic, determine which polygon vertices become equivalent after all edge identifications. Do not simply count the polygon's original corners.",
          "For the standard square torus model, all four original corners lie in a single quotient vertex class. There is one 2-cell, two quotient 1-cells, and one quotient 0-cell, so χ = 1 − 2 + 1 = 0."
        ]
      },
      {
        heading: "4. Orientability and edge pairings",
        paragraphs: [
          "In a polygonal presentation of a closed surface, orientation information is encoded by the edge pairings. Informally, a consistent surface orientation requires the local orientations on identified boundary edges to fit together after gluing.",
          "At this stage, use orientation behavior as diagnostic evidence. A complete orientability argument should state precisely how local orientations behave under the quotient identifications."
        ]
      }
    ],

    definitions: [
      {
        term: "Quotient space",
        statement: "Given a topological space X and an equivalence relation ∼ on X, the quotient X/∼ is the set of equivalence classes equipped with the quotient topology."
      },
      {
        term: "Polygonal presentation",
        statement: "A description of a surface or related quotient space obtained from a polygon by pairing boundary edges according to specified identifications."
      },
      {
        term: "Edge-pairing word",
        statement: "A cyclic word recording boundary-edge labels and orientations, used to encode the gluing pattern of a polygonal presentation."
      },
      {
        term: "Vertex equivalence class",
        statement: "A class of polygon vertices identified to one quotient vertex after the edge-pairing relation is imposed."
      },
      {
        term: "Euler characteristic",
        statement: "For a finite CW decomposition, χ = V − E + F in dimension two, where V, E, and F denote the numbers of 0-, 1-, and 2-cells."
      }
    ],

    examples: [
      {
        title: "Sphere from a disk",
        body: "A disk whose entire boundary circle is collapsed to one point gives a quotient homeomorphic to S². This is best understood as D²/∂D² ≅ S²."
      },
      {
        title: "Torus from a square",
        body: "The word a b a⁻¹ b⁻¹ produces the standard torus. All four corners become one vertex; the two edge pairs become two quotient 1-cells; the square interior becomes one 2-cell. Thus χ = 1 − 2 + 1 = 0."
      },
      {
        title: "Projective plane",
        body: "A standard polygonal word for RP² is a a. The edge pair is identified in the same boundary-word direction. This produces a nonorientable closed surface with χ = 1."
      },
      {
        title: "Klein bottle",
        body: "A standard presentation is a b a⁻¹ b. One edge pair behaves as in the torus model while the other introduces the orientation-reversing feature responsible for nonorientability."
      }
    ],

    nonExamples: [
      "Counting four original square corners as four quotient vertices after opposite-edge identifications.",
      "Declaring two quotient spaces homeomorphic solely because their polygon diagrams look similar.",
      "Calling a numerical or visual experiment a proof without establishing the required topological argument."
    ],

    workedExample: {
      title: "Compute χ for the standard square torus",
      steps: [
        "Start with one square, so the quotient has one 2-cell.",
        "The four boundary edges form two identified pairs, so the quotient has two 1-cells.",
        "Track the corner identifications induced by both edge pairings; all four corners become one quotient vertex.",
        "Therefore V = 1, E = 2, F = 1.",
        "Compute χ = 1 − 2 + 1 = 0.",
        "This calculation is consistent with the Euler characteristic of the torus, but identifying the quotient as a torus also relies on understanding the gluing model, not the number χ alone."
      ]
    },

    guidedPractice: [
      {
        prompt: "A square has boundary word a a b b. List the data you must determine before claiming what surface the quotient is.",
        hint: "Do not start with the surface name. Track edge orientations, vertex classes, the quotient cell counts, and orientability evidence."
      },
      {
        prompt: "For a polygonal presentation with one face, three edge pairs, and two quotient vertex classes, compute χ.",
        hint: "Use V = 2, E = 3, F = 1."
      },
      {
        prompt: "Why can two different polygonal words have the same Euler characteristic but represent nonhomeomorphic surfaces?",
        hint: "Euler characteristic is an invariant, but not a complete classifier by itself."
      }
    ],

    independentPractice: [
      "Draw a square model for the torus and mark the induced vertex identifications.",
      "Compute χ for a one-face polygonal presentation with four quotient edges and one quotient vertex.",
      "Explain why the quotient map q : P → P/∼ is generally not injective on the boundary.",
      "Compare the words a b a⁻¹ b⁻¹ and a b a⁻¹ b. What orientation behavior differs?",
      "Write a short argument explaining why one should identify vertex classes before applying χ = V − E + F.",
      "Give an example of a topological claim about a polygonal quotient that Euler characteristic alone cannot establish."
    ],

    proofTasks: [
      {
        title: "Proof preparation",
        prompt: "Show carefully that all four vertices of the standard square torus model belong to a single equivalence class.",
        rubric: [
          "Names or labels the four vertices.",
          "Uses the two edge identifications explicitly.",
          "Shows transitive closure of the induced identifications.",
          "Concludes that the quotient has one 0-cell."
        ]
      },
      {
        title: "Reasoning task",
        prompt: "Explain why a matching Euler characteristic is necessary but not sufficient, in general, to conclude that two closed surfaces are homeomorphic.",
        rubric: [
          "States invariance of Euler characteristic under homeomorphism.",
          "Explains that a single invariant need not distinguish all homeomorphism types.",
          "Provides or prepares a relevant orientability-based distinction."
        ]
      }
    ],

    misconceptions: [
      {
        error: "The polygon's corners are the quotient vertices.",
        correction: "Original corners must first be partitioned into equivalence classes induced by the edge pairings."
      },
      {
        error: "The edge word is just notation.",
        correction: "The cyclic order, labels, and orientations encode the quotient relation and therefore affect the topology."
      },
      {
        error: "Same Euler characteristic means same surface.",
        correction: "Euler characteristic is useful but does not encode orientability or all topological information."
      }
    ],

    mentor_prompts: [
      "Which points are actually equivalent after the gluing?",
      "What is invariant here, and what information has been lost?",
      "Can you separate the combinatorial calculation from the homeomorphism claim?"
    ],

    evidence: [
      "Completed vertex-equivalence analysis for the torus square.",
      "Euler characteristic computation with quotient cell counts shown.",
      "Written response distinguishing invariant evidence from a homeomorphism proof.",
      "At least one corrected misconception or counterexample.",
      "Reflection identifying the hypothesis or definition that mattered most."
    ],

    reflectionPrompts: [
      "Which part of the quotient construction was least visible from the picture alone?",
      "Where could a careless cell count change χ incorrectly?",
      "What additional information beyond Euler characteristic will matter when classifying surfaces?"
    ],

    references: [
      "Course prerequisite notes on quotient topology and CW complexes.",
      "A standard algebraic topology or topology text section on polygonal presentations of surfaces.",
      "Instructor-provided classification-of-surfaces notes for later sessions."
    ]
  };
})();
