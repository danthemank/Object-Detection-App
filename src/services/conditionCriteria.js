export const CONDITION_CRITERIA = {
  pokemon_card: {
    criteria: [
      {
        name: "Surface",
        description: "Check for scratches, whitening, scuffs, or print defects",
        points: 30
      },
      {
        name: "Corners",
        description: "Examine corner sharpness and wear",
        points: 30
      },
      {
        name: "Edges",
        description: "Look for edge wear or damage",
        points: 20
      },
      {
        name: "Centering",
        description: "Evaluate print centering on front and back",
        points: 20
      }
    ],
    grades: [
      { grade: "Gem Mint", value: 10, minPoints: 98, description: "Perfect condition in every way" },
      { grade: "Mint", value: 9, minPoints: 90, description: "Nearly perfect with minimal imperfections" },
      { grade: "Near Mint", value: 8, minPoints: 80, description: "Excellent condition with very minor wear" },
      { grade: "Excellent", value: 6, minPoints: 60, description: "Light wear but still very presentable" },
      { grade: "Good", value: 4, minPoints: 40, description: "Moderate wear visible" },
      { grade: "Poor", value: 2, minPoints: 0, description: "Heavy wear or damage" }
    ]
  },
  collectible: {
    criteria: [
      {
        name: "Overall Condition",
        description: "General condition and preservation",
        points: 40
      },
      {
        name: "Completeness",
        description: "All original parts present",
        points: 30
      },
      {
        name: "Functionality",
        description: "Working condition if applicable",
        points: 15
      },
      {
        name: "Aesthetics",
        description: "Visual appeal and original finish",
        points: 15
      }
    ],
    grades: [
      { grade: "Mint", value: "A", minPoints: 90, description: "Perfect or nearly perfect condition" },
      { grade: "Excellent", value: "B", minPoints: 75, description: "Minor wear but very well preserved" },
      { grade: "Good", value: "C", minPoints: 60, description: "Shows wear but intact and presentable" },
      { grade: "Fair", value: "D", minPoints: 40, description: "Significant wear or damage" },
      { grade: "Poor", value: "F", minPoints: 0, description: "Heavy wear or damage" }
    ]
  }
};

export function getConditionTemplate(type) {
  return CONDITION_CRITERIA[type] || CONDITION_CRITERIA.collectible;
}
