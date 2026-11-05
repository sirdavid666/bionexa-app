export const practiceTopics = {
  Mathematics: [
    "Algebra",
    "Trigonometry",
    "Calculus",
    "Differentiation",
    "Integration",
    "Vectors",
    "Matrices",
    "Complex numbers",
    "Differential equations",
    "Statistics",
    "Probability"
  ],

  Physics: [
    "Mechanics",
    "Motion and forces",
    "Work, energy and power",
    "Waves and oscillations",
    "Electricity",
    "Magnetism",
    "Thermodynamics",
    "Fluid mechanics",
    "Optics",
    "Modern physics"
  ],

  "Human Biology": [
    "Cell biology",
    "Human anatomy",
    "Human physiology",
    "The nervous system",
    "The cardiovascular system",
    "The respiratory system",
    "The digestive system",
    "The musculoskeletal system",
    "Blood and immunity",
    "Genetics"
  ],

  "Biomedical Engineering": [
    "Introduction to Biomedical Engineering",
    "Medical instrumentation",
    "Biomedical sensors",
    "Biomaterials",
    "Biomechanics",
    "Medical imaging",
    "Biomedical signal processing",
    "Prosthetics and orthotics",
    "Clinical engineering",
    "Medical device safety"
  ],

  Electronics: [
    "Basic electrical circuits",
    "Ohm's law",
    "Kirchhoff's laws",
    "Resistors and capacitors",
    "Diodes",
    "Transistors",
    "Operational amplifiers",
    "Digital electronics",
    "Logic gates",
    "Circuit analysis"
  ],

  Computing: [
    "Computer fundamentals",
    "Programming basics",
    "Algorithms",
    "Data structures",
    "Computer networks",
    "Data analysis",
    "Digital systems"
  ],

  Chemistry: [
    "Atomic structure",
    "Chemical bonding",
    "Acids and bases",
    "Organic chemistry",
    "Chemical reactions",
    "Solutions",
    "Biochemistry fundamentals"
  ]
};

export function getAllPracticeTopics() {
  return Object.entries(practiceTopics).flatMap(([category, topics]) =>
    topics.map((topic) => ({ category, topic }))
  );
}

export function searchPracticeTopics(searchTerm = "") {
  const term = String(searchTerm).trim().toLowerCase();

  return getAllPracticeTopics().filter((item) =>
    item.topic.toLowerCase().includes(term) ||
    item.category.toLowerCase().includes(term)
  );
}
