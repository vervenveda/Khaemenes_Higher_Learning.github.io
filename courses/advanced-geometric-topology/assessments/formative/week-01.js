"use strict";
(function () {
  window.KHAEMENES_ASSESSMENTS = window.KHAEMENES_ASSESSMENTS || {};

  window.KHAEMENES_ASSESSMENTS["W01D1"] = {
    id: "W01D1-concept",
    title: "W01D1 Concept Check",
    threshold: 80,
    questions: [
      {
        id: "q1",
        prompt: "Before computing Euler characteristic from a polygonal quotient, what must be determined about the polygon vertices?",
        choices: [
          "Their Euclidean distances",
          "Their quotient equivalence classes",
          "Their interior angles",
          "Their coordinate values"
        ],
        answer: 1
      },
      {
        id: "q2",
        prompt: "For the standard square torus model, how many quotient 1-cells come from the four boundary edges?",
        choices: ["1", "2", "3", "4"],
        answer: 1
      },
      {
        id: "q3",
        prompt: "If V = 2, E = 3, and F = 1, what is χ?",
        choices: ["0", "1", "2", "6"],
        answer: 0
      },
      {
        id: "q4",
        prompt: "Which statement is mathematically safest?",
        choices: [
          "A matching Euler characteristic always proves two surfaces are homeomorphic.",
          "A picture of a gluing is a complete proof.",
          "Euler characteristic is an invariant but may not completely classify a surface.",
          "Edge orientations do not affect polygonal presentations."
        ],
        answer: 2
      },
      {
        id: "q5",
        prompt: "The boundary word a b a⁻¹ b⁻¹ is the standard square presentation of which surface?",
        choices: ["Sphere", "Torus", "Projective plane", "Klein bottle"],
        answer: 1
      },
      {
        id: "q6",
        prompt: "What does the quotient map do to points in the same equivalence class?",
        choices: [
          "Sends them to the same quotient point",
          "Deletes them",
          "Moves them to the polygon interior",
          "Assigns them different coordinates"
        ],
        answer: 0
      },
      {
        id: "q7",
        prompt: "Why is a matching Euler characteristic not always enough to identify a surface?",
        choices: [
          "Euler characteristic depends on the drawing scale.",
          "Different topological types can share the same Euler characteristic.",
          "Euler characteristic is not preserved by homeomorphism.",
          "Euler characteristic cannot be computed from cells."
        ],
        answer: 1
      },
      {
        id: "q8",
        prompt: "Which formula applies to a finite two-dimensional CW decomposition?",
        choices: ["χ = V + E + F", "χ = E − V − F", "χ = V − E + F", "χ = F − V + E"],
        answer: 2
      },
      {
        id: "q9",
        prompt: "Which item belongs to a proof-quality vertex analysis?",
        choices: [
          "Only naming the expected surface",
          "Tracking identifications and their transitive consequences",
          "Estimating the number of vertices from the drawing",
          "Ignoring boundary pairings"
        ],
        answer: 1
      },
      {
        id: "q10",
        prompt: "Which distinction is central to this course?",
        choices: [
          "Visual evidence and proof are identical.",
          "Computation replaces proof.",
          "Evidence types must be labeled according to what they actually establish.",
          "Only numerical evidence matters."
        ],
        answer: 2
      }
    ]
  };
})();
