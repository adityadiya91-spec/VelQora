/**
 * KarWan PIN & Geography Resolver
 * Maps 6-digit postal PIN codes to KarWan corridor villages and hubs.
 */

export const CORRIDOR_PINS = {
  "413102": { name: "Baramati", code: "BRM", district: "Pune", landmark: "Main Bazaar Hub" },
  "413106": { name: "Indapur", code: "IND", district: "Pune", landmark: "Bus Stand Hub" },
  "413801": { name: "Daund", code: "DND", district: "Pune", landmark: "Railway Gate Hub" },
  "412215": { name: "Shirur", code: "SHR", district: "Pune", landmark: "Market Yard" },
  "412303": { name: "Jejuri", code: "JJR", district: "Pune", landmark: "MIDC Gate Hub" },
  "415523": { name: "Phaltan", code: "PLT", district: "Satara", landmark: "APMC Market Yard" },
};

/**
 * Resolves a 6-digit PIN code to a KarWan corridor village
 */
export function resolvePinCode(pin) {
  const cleanPin = String(pin).replace(/[^0-9]/g, "").slice(0, 6);
  if (CORRIDOR_PINS[cleanPin]) {
    return {
      success: true,
      pin: cleanPin,
      ...CORRIDOR_PINS[cleanPin],
    };
  }

  // Fallback: Default to nearest active central corridor (Baramati / Phaltan)
  return {
    success: false,
    pin: cleanPin,
    name: "Baramati",
    code: "BRM",
    district: "Pune",
    landmark: "Central Collection Hub",
    note: "Unmapped rural PIN code, defaulted to primary corridor node",
  };
}

export default {
  CORRIDOR_PINS,
  resolvePinCode,
};

