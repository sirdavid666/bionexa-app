export const subjects = [
  {
    name: "Mathematics for Engineers",
    icon: "∑",
    description: "Quantitative tools used throughout engineering and biomedical analysis.",
    topics: [
      "Algebra",
      "Trigonometry",
      "Calculus",
      "Differentiation",
      "Integration",
      "Vectors",
      "Linear algebra and matrices",
      "Complex numbers",
      "Differential equations",
      "Statistics and probability",
      "Numerical methods"
    ]
  },
  {
    name: "Physics",
    icon: "ϕ",
    description: "Physical principles underlying measurement, devices and biological systems.",
    topics: [
      "Motion and forces",
      "Work, energy and power",
      "Waves and oscillations",
      "Electricity and magnetism",
      "Thermodynamics",
      "Fluid mechanics",
      "Optics",
      "Introductory modern physics"
    ]
  },
  {
    name: "Chemistry",
    icon: "⚗",
    description: "Chemical foundations for understanding materials and biological processes.",
    topics: [
      "Atomic structure",
      "Chemical bonding",
      "Acids and bases",
      "Solutions and concentration",
      "Organic chemistry foundations",
      "Chemical reactions",
      "Biochemistry foundations"
    ]
  },
  {
    name: "Biology and Human Anatomy",
    icon: "◎",
    description: "Cells, tissues and the structure of the human body.",
    topics: [
      "Cell biology",
      "Tissues",
      "Skeletal system",
      "Muscular system",
      "Nervous system",
      "Cardiovascular anatomy",
      "Respiratory anatomy",
      "Digestive system",
      "Blood and immunity"
    ]
  },
  {
    name: "Physiology",
    icon: "♡",
    description: "How body systems function and maintain homeostasis.",
    topics: [
      "Cell physiology",
      "Cardiovascular physiology",
      "Respiratory physiology",
      "Renal physiology",
      "Neurophysiology",
      "Musculoskeletal physiology",
      "Human physiology for biomedical engineers"
    ]
  },
  {
    name: "Engineering Mechanics",
    icon: "↗",
    description: "Statics, dynamics and material response relevant to devices and movement.",
    topics: [
      "Statics and equilibrium",
      "Kinematics",
      "Dynamics",
      "Stress and strain",
      "Mechanical properties",
      "Fluid mechanics",
      "Biomechanics"
    ]
  },
  {
    name: "Electrical and Electronic Engineering",
    icon: "ϟ",
    description: "Core electrical and electronic concepts used in biomedical devices.",
    topics: [
      "Electrical quantities",
      "Circuit theory",
      "Ohm's law",
      "Kirchhoff's laws",
      "Resistors and capacitors",
      "Diodes and transistors",
      "Operational amplifiers",
      "Digital electronics"
    ]
  },
  {
    name: "Programming and Computing",
    icon: "</>",
    description: "Computational thinking, coding and data handling for engineering.",
    topics: [
      "Programming fundamentals",
      "Algorithms",
      "Data structures",
      "Data analysis",
      "Numerical computing",
      "Digital systems"
    ]
  },
  {
    name: "Materials Science and Biomaterials",
    icon: "◇",
    description: "Engineering materials and their interaction with biological environments.",
    topics: [
      "Material structure and properties",
      "Metals",
      "Ceramics",
      "Polymers",
      "Biocompatibility concepts",
      "Implant materials",
      "Tissue engineering foundations"
    ]
  },
  {
    name: "Medical Instrumentation",
    icon: "⌁",
    description: "Measurement systems and devices used to acquire physiological information.",
    topics: [
      "Sensors and transducers",
      "Measurement systems",
      "Signal conditioning",
      "ECG instrumentation",
      "Patient monitoring",
      "Medical device safety"
    ]
  },
  {
    name: "Biomedical Signals",
    icon: "∿",
    description: "Acquisition and analysis of signals produced by biological systems.",
    topics: [
      "ECG signals",
      "EEG signals",
      "EMG signals",
      "Sampling",
      "Filtering",
      "Signal processing foundations"
    ]
  },
  {
    name: "Medical Imaging",
    icon: "▣",
    description: "Principles of imaging technologies and biomedical image processing.",
    topics: [
      "X-ray imaging",
      "Computed tomography",
      "Magnetic resonance imaging",
      "Ultrasound",
      "Image processing foundations"
    ]
  },
  {
    name: "Biomedical Engineering Design",
    icon: "⌘",
    description: "Human-centred engineering methods for developing and evaluating biomedical solutions.",
    topics: [
      "Problem definition",
      "Requirements and constraints",
      "Prototyping",
      "Verification and validation",
      "Risk and safety considerations",
      "Design communication"
    ]
  }
];

export function findSubjectTopic(topic) {
  const query = String(topic || "").trim().toLowerCase();

  return subjects
    .flatMap(subject => subject.topics.map(item => ({ subject: subject.name, topic: item })))
    .find(item => item.topic.toLowerCase() === query);
}
