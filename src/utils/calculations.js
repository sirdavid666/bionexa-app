
export const Calculations = {
  ohmsLaw(voltage, current) {
    if (voltage == null || current == null || current === 0) {
      throw new Error("Voltage and non-zero current are required.");
    }

    return {
      resistance: Number((voltage / current).toFixed(6)),
      unit: "Ω",
      formula: "R = V / I"
    };
  },

  electricalPower(voltage, current) {
    if (voltage == null || current == null) {
      throw new Error("Voltage and current are required.");
    }

    return {
      power: Number((voltage * current).toFixed(6)),
      unit: "W",
      formula: "P = V × I"
    };
  },

  force(mass, acceleration) {
    if (mass < 0 || acceleration == null) {
      throw new Error("Enter a valid mass and acceleration.");
    }

    return {
      force: Number((mass * acceleration).toFixed(6)),
      unit: "N",
      formula: "F = m × a"
    };
  },

  density(mass, volume) {
    if (mass == null || volume <= 0) {
      throw new Error("Enter a valid mass and positive volume.");
    }

    return {
      density: Number((mass / volume).toFixed(6)),
      unit: "kg/m³",
      formula: "ρ = m / V"
    };
  },

  pressure(force, area) {
    if (force == null || area <= 0) {
      throw new Error("Enter a valid force and positive area.");
    }

    return {
      pressure: Number((force / area).toFixed(6)),
      unit: "Pa",
      formula: "P = F / A"
    };
  },

  convert(value, factor) {
    if (!Number.isFinite(value) || !Number.isFinite(factor)) {
      throw new Error("Enter valid numerical values.");
    }

    return Number((value * factor).toFixed(8));
  }
};

export default Calculations;
