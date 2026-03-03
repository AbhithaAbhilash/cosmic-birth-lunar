// Moon phase calculation based on the synodic month
// Algorithm adapted from astronomical calculations

export interface MoonPhaseData {
  phase: number; // 0-1 where 0 = new moon, 0.5 = full moon
  phaseName: string;
  illumination: number; // 0-100
  emoji: string;
  poeticLine: string;
}

const SYNODIC_MONTH = 29.53058867; // Average length of synodic month in days

// Known new moon reference: January 6, 2000 at 18:14 UTC
const KNOWN_NEW_MOON = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));

export function getMoonPhase(date: Date): MoonPhaseData {
  const diffMs = date.getTime() - KNOWN_NEW_MOON.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  
  // Normalize to 0-1
  let phase = (diffDays % SYNODIC_MONTH) / SYNODIC_MONTH;
  if (phase < 0) phase += 1;

  const illumination = Math.round((1 - Math.cos(phase * 2 * Math.PI)) / 2 * 100);
  
  const { name, emoji, poeticLine } = getPhaseDetails(phase);
  
  return {
    phase,
    phaseName: name,
    illumination,
    emoji,
    poeticLine,
  };
}

function getPhaseDetails(phase: number): { name: string; emoji: string; poeticLine: string } {
  if (phase < 0.0625) {
    return {
      name: "New Moon",
      emoji: "🌑",
      poeticLine: "The moon hid in shadow, a secret kept by the night sky.",
    };
  } else if (phase < 0.1875) {
    return {
      name: "Waxing Crescent",
      emoji: "🌒",
      poeticLine: "A silver sliver whispered promises of light to come.",
    };
  } else if (phase < 0.3125) {
    return {
      name: "First Quarter",
      emoji: "🌓",
      poeticLine: "Half in light, half in mystery — perfectly balanced.",
    };
  } else if (phase < 0.4375) {
    return {
      name: "Waxing Gibbous",
      emoji: "🌔",
      poeticLine: "Almost whole, the moon swelled with anticipation.",
    };
  } else if (phase < 0.5625) {
    return {
      name: "Full Moon",
      emoji: "🌕",
      poeticLine: "The moon blazed in full glory, illuminating every dream below.",
    };
  } else if (phase < 0.6875) {
    return {
      name: "Waning Gibbous",
      emoji: "🌖",
      poeticLine: "Slowly releasing its light, the moon began its graceful retreat.",
    };
  } else if (phase < 0.8125) {
    return {
      name: "Last Quarter",
      emoji: "🌗",
      poeticLine: "A contemplative half-moon gazed down in quiet reflection.",
    };
  } else if (phase < 0.9375) {
    return {
      name: "Waning Crescent",
      emoji: "🌘",
      poeticLine: "A fading crescent, a gentle farewell before darkness returns.",
    };
  } else {
    return {
      name: "New Moon",
      emoji: "🌑",
      poeticLine: "The moon hid in shadow, a secret kept by the night sky.",
    };
  }
}
