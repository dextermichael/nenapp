export enum NenType {
  ENHANCER = 'Enhancer',
  TRANSMUTER = 'Transmuter',
  CONJURER = 'Conjurer',
  SPECIALIST = 'Specialist',
  MANIPULATOR = 'Manipulator',
  EMITTER = 'Emitter',
}

export interface NenProfile {
  type: NenType;
  description: string;
  traits: string[];
  characters: string[];
  suggestedAbility: string;
  element?: string;
}

class NenTypeService {
  private nenProfiles: Record<NenType, NenProfile> = {
    [NenType.ENHANCER]: {
      type: NenType.ENHANCER,
      description: "Enhancers are simple and determined. They possess great physical strength and recovery ability that is typically honed through training and meditation.",
      traits: [
        "Straightforward and honest",
        "Determined and hardworking", 
        "Excellent physical abilities",
        "Strong willpower",
        "Sometimes naive"
      ],
      characters: ["Gon Freecss", "Uvogin", "Phinks"],
      suggestedAbility: "Rock-Paper-Scissors: Enhance your fists with devastating power for different attack types",
      element: "earth"
    },
    [NenType.TRANSMUTER]: {
      type: NenType.TRANSMUTER,
      description: "Transmuters are whimsical and prone to deceit. They enjoy copying others and have a fickle, individualistic mindset.",
      traits: [
        "Whimsical and unpredictable",
        "Clever and creative",
        "Independent thinkers",
        "Can be deceptive",
        "Highly adaptable"
      ],
      characters: ["Killua Zoldyck", "Hisoka", "Biscuit Krueger"],
      suggestedAbility: "Lightning Palm: Transform your aura into electricity for speed and stunning attacks",
      element: "lightning"
    },
    [NenType.CONJURER]: {
      type: NenType.CONJURER,
      description: "Conjurers are typically high-strung or overly serious, stoic, and nervous. They are often on guard as to be cautious.",
      traits: [
        "Serious and focused",
        "Highly analytical", 
        "Cautious and prepared",
        "Detail-oriented",
        "Sometimes anxious"
      ],
      characters: ["Kurapika", "Kortopi", "Owl"],
      suggestedAbility: "Chain Jail: Conjure unbreakable chains that can bind and restrict specific targets",
      element: "metal"
    },
    [NenType.SPECIALIST]: {
      type: NenType.SPECIALIST,
      description: "Specialists are independent and charismatic. They won't listen to what others say and do things at their own pace.",
      traits: [
        "Highly independent",
        "Charismatic leaders",
        "Unique perspective",
        "Strong personal beliefs",
        "Difficult to categorize"
      ],
      characters: ["Chrollo Lucilfer", "Neon Nostrade", "Pakunoda"],
      suggestedAbility: "Skill Hunter: Copy and use other people's Nen abilities under specific conditions",
      element: "void"
    },
    [NenType.MANIPULATOR]: {
      type: NenType.MANIPULATOR,
      description: "Manipulators are logical people who advance at their own pace. They are all argumentative and can be very annoying.",
      traits: [
        "Logical and strategic",
        "Argumentative nature",
        "Control-oriented",
        "Patient planners",
        "Can be manipulative"
      ],
      characters: ["Illumi Zoldyck", "Shalnark", "Morel"],
      suggestedAbility: "Puppet Master: Control objects or people through your aura-infused needles or smoke",
      element: "air"
    },
    [NenType.EMITTER]: {
      type: NenType.EMITTER,
      description: "Emitters are impatient, not detail-oriented, and quick to react in a volatile manner. Many of them are quick-tempered and hot-headed.",
      traits: [
        "Quick-tempered",
        "Impatient nature",
        "Direct approach",
        "High energy",
        "Reactive personality"
      ],
      characters: ["Leorio Paradinight", "Razor", "Franklin"],
      suggestedAbility: "Remote Punch: Project your aura as powerful ranged attacks from a distance",
      element: "fire"
    }
  };

  mapMBTIToNen(mbtiType: string): NenType {
    // Clean up MBTI type (remove spaces, make uppercase)
    const cleanMBTI = mbtiType.replace(/\s/g, '').toUpperCase();
    
    // Enhancer: ExxP (Extraverted, any, any, Perceiving)
    if (cleanMBTI.match(/^E[NS][TF]P$/)) {
      return NenType.ENHANCER;
    }
    
    // Transmuter: xNxP (any, iNtuitive, any, Perceiving)  
    if (cleanMBTI.match(/^[EI]N[TF]P$/)) {
      return NenType.TRANSMUTER;
    }
    
    // Conjurer: ISxx (Introverted, Sensing, any, any)
    if (cleanMBTI.match(/^IS[TF][JP]$/)) {
      return NenType.CONJURER;
    }
    
    // Specialist: IxTx (Introverted, any, Thinking, any)
    if (cleanMBTI.match(/^I[NS]T[JP]$/)) {
      return NenType.SPECIALIST;
    }
    
    // Manipulator: xSxJ (any, Sensing, any, Judging)
    if (cleanMBTI.match(/^[EI]S[TF]J$/)) {
      return NenType.MANIPULATOR;
    }
    
    // Emitter: ExxJ (Extraverted, any, any, Judging)
    if (cleanMBTI.match(/^E[NS][TF]J$/)) {
      return NenType.EMITTER;
    }
    
    // Default fallback (shouldn't happen with valid MBTI)
    return NenType.ENHANCER;
  }

  getNenProfile(nenType: NenType): NenProfile {
    return this.nenProfiles[nenType];
  }

  getAllNenTypes(): NenType[] {
    return Object.values(NenType);
  }

  getWaterDivinationResult(nenType: NenType): string {
    const results: Record<NenType, string> = {
      [NenType.ENHANCER]: "The water overflows from the glass",
      [NenType.TRANSMUTER]: "The taste of the water changes",
      [NenType.CONJURER]: "Impurities appear in the water",
      [NenType.SPECIALIST]: "A completely different change occurs",
      [NenType.MANIPULATOR]: "A leaf on the water moves",
      [NenType.EMITTER]: "The color of the water changes"
    };
    
    return results[nenType];
  }
}

export default new NenTypeService();