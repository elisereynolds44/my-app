export type GameChoice = {
  feedback: string;
  id: string;
  isBest: boolean;
  label: string;
  result: string;
};

export type QuizRound = {
  choices: GameChoice[];
  clues: string[];
  prompt: string;
  title: string;
};

export type BananaBasket = {
  accent: string;
  id: string;
  label: string;
};

export type BananaRound = {
  baskets: BananaBasket[];
  breakBasketId: string;
  prompt: string;
  safeDistribution: Record<string, number>;
  title: string;
  totalBananas: number;
};

export type OwnerSignalCard = {
  feedback: string;
  id: string;
  isBest: boolean;
  kind: "customers" | "logo" | "price" | "profit" | "stores" | "surprise";
  label: string;
  result: string;
  value: string;
};

export type OwnerRound = {
  cards: OwnerSignalCard[];
  chartBars: number[];
  headline: string;
  prompt: string;
  title: string;
};

export type MoveSignalCard = {
  feedback: string;
  id: string;
  isBest: boolean;
  kind: "company" | "market" | "sector";
  label: string;
  result: string;
  value: string;
};

export type MoveRound = {
  cards: MoveSignalCard[];
  chartBars: number[];
  headline: string;
  prompt: string;
  title: string;
};

export type StrategyBagChoice = {
  feedback: string;
  id: string;
  isBest: boolean;
  kind: "fast" | "safe" | "simple";
  label: string;
  result: string;
  value: string;
};

export type StrategyRound = {
  choices: StrategyBagChoice[];
  kidKind: "beginner" | "long" | "sleep";
  mood: string;
  prompt: string;
  title: string;
  tripLabel: string;
};

export type FruitItem = {
  id: string;
  kind: "apple" | "orange" | "berry";
  label: string;
};

export type FruitRound = {
  baskets: BananaBasket[];
  spoiledKind: FruitItem["kind"];
  prompt: string;
  safeDistribution: Record<string, number>;
  title: string;
  totalItems: FruitItem[];
};

export type GoalCard = {
  id: string;
  correctBucket: "soon" | "later";
  label: string;
};

export type GoalRound = {
  cards: GoalCard[];
  prompt: string;
  title: string;
};

export type CoinCompareRound = {
  leftCoins: number;
  leftTax: number;
  prompt: string;
  rightCoins: number;
  rightTax: number;
  title: string;
};

export type PaycheckBucket = {
  accent: string;
  id: string;
  label: string;
};

export type PaycheckRound = {
  buckets: PaycheckBucket[];
  matchBucketId?: string;
  prompt: string;
  safeDistribution: Record<string, number>;
  title: string;
  totalCoins: number;
};

export type ShelfRound = {
  prompt: string;
  safeDistribution: Record<string, number>;
  shelves: BananaBasket[];
  title: string;
  totalBlocks: Array<{ id: string; kind: "blue" | "green" | "purple" }>;
};

export type ConsistencyRound = {
  choices: Array<{
    feedback: string;
    id: string;
    isBest: boolean;
    kind: "plan" | "shiny";
    label: string;
    result: string;
  }>;
  prompt: string;
  scene: "rain" | "sun";
  title: string;
};

export type GameDefinition = {
  completionKey: string;
  gameTitle: string;
  intro?: {
    concept: string;
    instruction: string;
  };
  lessonNumber: number;
  mechanicType?:
    | "quiz"
    | "bananas"
    | "owner-board"
    | "move-board"
    | "strategy-bags"
    | "fruit-basket"
    | "goal-sort"
    | "coin-compare"
    | "paycheck-buckets"
    | "shelf-build"
    | "consistency-scene";
  resultLabels: {
    needsWork: string;
    solid: string;
    strong: string;
  };
  rounds:
    | QuizRound[]
    | BananaRound[]
    | OwnerRound[]
    | MoveRound[]
    | StrategyRound[]
    | FruitRound[]
    | GoalRound[]
    | CoinCompareRound[]
    | PaycheckRound[]
    | ShelfRound[]
    | ConsistencyRound[];
  skill: string;
  summary: string;
  theme?: {
    accent: string;
    glow: string;
    panel: string;
  };
  visual?: {
    icon: string;
    mascot: string;
  };
  win?: {
    takeaway: string;
    title: string;
  };
};

export const GAME_LIBRARY: Record<number, GameDefinition> = {
  1: {
    lessonNumber: 1,
    completionKey: "completedGame1",
    gameTitle: "Owner Board",
    mechanicType: "owner-board",
    intro: {
      concept: "Owners watch the business.",
      instruction: "Tap the best card.",
    },
    skill: "Practice ownership, price, and expectations.",
    summary: "Use the mini dashboard, chart, and business cards to spot what a real owner should focus on.",
    theme: {
      accent: "#7ED6A5",
      glow: "rgba(126,214,165,0.18)",
      panel: "rgba(126,214,165,0.08)",
    },
    win: {
      title: "Owner eyes",
      takeaway: "Owners watch the business, not just the price.",
    },
    resultLabels: {
      needsWork: "Getting started",
      solid: "Thoughtful beginner",
      strong: "Owner mindset",
    },
    rounds: [
      {
        title: "Round 1",
        headline: "New stores open",
        prompt: "What matters most?",
        chartBars: [3, 4, 6, 8],
        cards: [
          {
            id: "stores",
            kind: "stores",
            label: "Store growth",
            value: "3 new",
            result: "+Best move",
            feedback: "More strong stores matters to an owner.",
            isBest: true,
          },
          {
            id: "logo",
            kind: "logo",
            label: "Logo look",
            value: "same",
            result: "Not the point",
            feedback: "The logo is not the main thing.",
            isBest: false,
          },
          {
            id: "customers",
            kind: "customers",
            label: "Tasty meal",
            value: "yum",
            result: "Customer lens",
            feedback: "That is customer thinking. Owners watch growth.",
            isBest: false,
          },
        ],
      },
      {
        title: "Round 2",
        headline: "Price jumps fast",
        prompt: "Pick the best owner thought.",
        chartBars: [4, 4, 5, 9],
        cards: [
          {
            id: "price",
            kind: "price",
            label: "Price board",
            value: "+18%",
            result: "Only half",
            feedback: "Price matters, but it is not enough by itself.",
            isBest: false,
          },
          {
            id: "profit",
            kind: "profit",
            label: "Business vs price",
            value: "2 checks",
            result: "+Best move",
            feedback: "Yes. Owners compare the business with the price.",
            isBest: true,
          },
          {
            id: "logo-2",
            kind: "logo",
            label: "Brand hype",
            value: "loud",
            result: "Too shallow",
            feedback: "Hype is not enough. Owners look deeper.",
            isBest: false,
          },
        ],
      },
      {
        title: "Round 3",
        headline: "Good quarter, red stock",
        prompt: "What explains the drop?",
        chartBars: [8, 8, 8, 6],
        cards: [
          {
            id: "surprise",
            kind: "surprise",
            label: "Expectations gap",
            value: "missed",
            result: "+Best move",
            feedback: "Yes. Prices move when reality misses expectations.",
            isBest: true,
          },
          {
            id: "broken",
            kind: "stores",
            label: "Business broke",
            value: "no",
            result: "Too dramatic",
            feedback: "The business can still be fine.",
            isBest: false,
          },
          {
            id: "random",
            kind: "price",
            label: "Random move",
            value: "?",
            result: "Missed the lesson",
            feedback: "It is not just random.",
            isBest: false,
          },
        ],
      },
    ],
  },
  2: {
    lessonNumber: 2,
    completionKey: "completedGame2",
    gameTitle: "What Moved It?",
    mechanicType: "move-board",
    intro: {
      concept: "Prices move for a reason.",
      instruction: "Tap the best match.",
    },
    skill: "Identify why a stock moved.",
    summary: "Look at how big the move feels, then tap whether it came from one company, a group, or the whole market.",
    theme: {
      accent: "#60A5FA",
      glow: "rgba(96,165,250,0.18)",
      panel: "rgba(96,165,250,0.08)",
    },
    win: {
      title: "Move reader",
      takeaway: "Some moves hit one, some hit many, some hit all.",
    },
    resultLabels: {
      needsWork: "Still sorting signals",
      solid: "Pattern spotter",
      strong: "Movement reader",
    },
    rounds: [
      {
        title: "Round 1",
        headline: "One company raises guidance",
        prompt: "Who moved?",
        chartBars: [3, 4, 4, 8],
        cards: [
          {
            id: "company",
            kind: "company",
            label: "One",
            value: "just one",
            result: "+Best move",
            feedback: "Yes. This is just one company.",
            isBest: true,
          },
          {
            id: "sector",
            kind: "sector",
            label: "Group",
            value: "same kind",
            result: "Too broad",
            feedback: "A group move hits several similar companies.",
            isBest: false,
          },
          {
            id: "market",
            kind: "market",
            label: "All",
            value: "whole board",
            result: "Too wide",
            feedback: "An all move hits much more.",
            isBest: false,
          },
        ],
      },
      {
        title: "Round 2",
        headline: "Restaurant stocks all drop together",
        prompt: "Who moved?",
        chartBars: [8, 7, 5, 4],
        cards: [
          {
            id: "company",
            kind: "company",
            label: "One",
            value: "just one",
            result: "Too narrow",
            feedback: "Too small. More than one moved.",
            isBest: false,
          },
          {
            id: "sector",
            kind: "sector",
            label: "Group",
            value: "same kind",
            result: "+Best move",
            feedback: "Yes. This hits one whole group.",
            isBest: true,
          },
          {
            id: "market",
            kind: "market",
            label: "All",
            value: "whole board",
            result: "Too wide",
            feedback: "Too big. Not everything moved.",
            isBest: false,
          },
        ],
      },
      {
        title: "Round 3",
        headline: "The whole screen is red",
        prompt: "Who moved?",
        chartBars: [8, 6, 4, 2],
        cards: [
          {
            id: "company",
            kind: "company",
            label: "One",
            value: "just one",
            result: "Too narrow",
            feedback: "Too small. It was bigger than one.",
            isBest: false,
          },
          {
            id: "sector",
            kind: "sector",
            label: "Group",
            value: "same kind",
            result: "Still too narrow",
            feedback: "Still too small.",
            isBest: false,
          },
          {
            id: "market",
            kind: "market",
            label: "All",
            value: "whole board",
            result: "+Best move",
            feedback: "Yes. This hits the whole market.",
            isBest: true,
          },
        ],
      },
    ],
  },
  3: {
    lessonNumber: 3,
    completionKey: "completedGame3",
    gameTitle: "Bananas in Baskets",
    mechanicType: "bananas",
    intro: {
      concept: "Spread risk.",
      instruction: "Tap baskets.",
    },
    skill: "Spot concentration and behavior risk.",
    summary:
      "Help the monkey spread bananas across baskets so one broken basket does not wipe everything out.",
    theme: {
      accent: "#FACC15",
      glow: "rgba(250,204,21,0.20)",
      panel: "rgba(250,204,21,0.09)",
    },
    resultLabels: {
      needsWork: "Risky setup",
      solid: "Safer thinker",
      strong: "Risk-aware",
    },
    win: {
      title: "Spread risk",
      takeaway: "One broken basket should not ruin it all.",
    },
    rounds: [
      {
        title: "Round 1",
        prompt: "4 bananas. 2 baskets.",
        totalBananas: 4,
        breakBasketId: "left",
        baskets: [
          { id: "left", label: "Basket A", accent: "#F59E0B" },
          { id: "right", label: "Basket B", accent: "#84CC16" },
        ],
        safeDistribution: {
          left: 2,
          right: 2,
        },
      },
      {
        title: "Round 2",
        prompt: "6 bananas. 3 baskets.",
        totalBananas: 6,
        breakBasketId: "middle",
        baskets: [
          { id: "left", label: "Basket A", accent: "#22C55E" },
          { id: "middle", label: "Basket B", accent: "#F97316" },
          { id: "right", label: "Basket C", accent: "#0EA5E9" },
        ],
        safeDistribution: {
          left: 2,
          middle: 2,
          right: 2,
        },
      },
      {
        title: "Round 3",
        prompt: "5 bananas. Spread them out.",
        totalBananas: 5,
        breakBasketId: "right",
        baskets: [
          { id: "left", label: "Basket A", accent: "#8B5CF6" },
          { id: "middle", label: "Basket B", accent: "#14B8A6" },
          { id: "right", label: "Basket C", accent: "#F43F5E" },
        ],
        safeDistribution: {
          left: 2,
          middle: 2,
          right: 1,
        },
      },
    ],
  },
  4: {
    lessonNumber: 4,
    completionKey: "completedGame4",
    gameTitle: "Pack the Right Bag",
    mechanicType: "strategy-bags",
    intro: {
      concept: "A good plan should fit the person.",
      instruction: "Tap the best bag.",
    },
    skill: "Match a simple plan to the person using it.",
    summary: "Each kid needs a different kind of bag. Pick the one that fits best.",
    theme: {
      accent: "#C084FC",
      glow: "rgba(192,132,252,0.18)",
      panel: "rgba(192,132,252,0.08)",
    },
    win: {
      title: "Nice fit",
      takeaway: "The best plan is one they can really use.",
    },
    resultLabels: {
      needsWork: "Still matching",
      solid: "Good fit finder",
      strong: "Strategy matcher",
    },
    rounds: [
      {
        title: "Round 1",
        prompt: "Pick the bag that fits this kid.",
        kidKind: "beginner",
        tripLabel: "First investing trip",
        mood: "Very new and gets nervous fast",
        choices: [
          {
            id: "simple",
            kind: "simple",
            label: "Simple bag",
            value: "light + easy",
            result: "+Best move",
            feedback: "Yes. A beginner needs a simple bag.",
            isBest: true,
          },
          {
            id: "fast",
            kind: "fast",
            label: "Fast bag",
            value: "busy + risky",
            result: "Too much",
            feedback: "Too busy for a nervous beginner.",
            isBest: false,
          },
          {
            id: "safe",
            kind: "safe",
            label: "Heavy bag",
            value: "super stiff",
            result: "Not best",
            feedback: "Close, but simple is the better fit.",
            isBest: false,
          },
        ],
      },
      {
        title: "Round 2",
        prompt: "Pick the bag that fits this kid.",
        kidKind: "long",
        tripLabel: "Long hiking trail",
        mood: "Lots of time and can stay patient",
        choices: [
          {
            id: "safe",
            kind: "safe",
            label: "Steady bag",
            value: "balanced + ready",
            result: "+Best move",
            feedback: "Yes. A long trip needs a steady bag.",
            isBest: true,
          },
          {
            id: "fast",
            kind: "fast",
            label: "Fast bag",
            value: "flashy today",
            result: "Too reactive",
            feedback: "Too flashy for a long trip.",
            isBest: false,
          },
          {
            id: "simple",
            kind: "simple",
            label: "Tiny bag",
            value: "too little",
            result: "Needs more",
            feedback: "Too small for this trip.",
            isBest: false,
          },
        ],
      },
      {
        title: "Round 3",
        prompt: "Pick the bag that fits this kid.",
        kidKind: "sleep",
        tripLabel: "Night hike",
        mood: "Needs a plan that feels calm enough to keep",
        choices: [
          {
            id: "safe",
            kind: "safe",
            label: "Calm bag",
            value: "steady + comfy",
            result: "+Best move",
            feedback: "Yes. Calm helps them keep going.",
            isBest: true,
          },
          {
            id: "fast",
            kind: "fast",
            label: "Wild bag",
            value: "shaky ride",
            result: "Poor fit",
            feedback: "Too wild to stick with.",
            isBest: false,
          },
          {
            id: "simple",
            kind: "simple",
            label: "Light bag",
            value: "easy but plain",
            result: "Close",
            feedback: "Close, but calm matters most here.",
            isBest: false,
          },
        ],
      },
    ],
  },
  5: {
    lessonNumber: 5,
    completionKey: "completedGame5",
    gameTitle: "Fruit Basket",
    mechanicType: "fruit-basket",
    intro: {
      concept: "A mix is safer.",
      instruction: "Tap baskets.",
    },
    skill: "See why spreading risk changes the experience.",
    summary: "Spread fruit across baskets so one spoiled fruit type does not ruin everything.",
    theme: {
      accent: "#FB923C",
      glow: "rgba(251,146,60,0.18)",
      panel: "rgba(251,146,60,0.08)",
    },
    win: {
      title: "Mixed basket",
      takeaway: "A mix handles bad surprises better.",
    },
    resultLabels: {
      needsWork: "Too concentrated",
      solid: "Balanced beginner",
      strong: "Diversification builder",
    },
    rounds: [
      {
        title: "Round 1",
        prompt: "4 fruits. 2 baskets.",
        spoiledKind: "apple",
        baskets: [
          { id: "left", label: "Basket A", accent: "#FB923C" },
          { id: "right", label: "Basket B", accent: "#34D399" },
        ],
        safeDistribution: { left: 2, right: 2 },
        totalItems: [
          { id: "a1", kind: "apple", label: "Apple" },
          { id: "o1", kind: "orange", label: "Orange" },
          { id: "b1", kind: "berry", label: "Berry" },
          { id: "a2", kind: "apple", label: "Apple" },
        ],
      },
      {
        title: "Round 2",
        prompt: "6 fruits. 3 baskets.",
        spoiledKind: "orange",
        baskets: [
          { id: "left", label: "Basket A", accent: "#F59E0B" },
          { id: "middle", label: "Basket B", accent: "#A78BFA" },
          { id: "right", label: "Basket C", accent: "#22C55E" },
        ],
        safeDistribution: { left: 2, middle: 2, right: 2 },
        totalItems: [
          { id: "o1", kind: "orange", label: "Orange" },
          { id: "a1", kind: "apple", label: "Apple" },
          { id: "b1", kind: "berry", label: "Berry" },
          { id: "o2", kind: "orange", label: "Orange" },
          { id: "a2", kind: "apple", label: "Apple" },
          { id: "b2", kind: "berry", label: "Berry" },
        ],
      },
      {
        title: "Round 3",
        prompt: "5 fruits. Spread them out.",
        spoiledKind: "berry",
        baskets: [
          { id: "left", label: "Basket A", accent: "#EC4899" },
          { id: "middle", label: "Basket B", accent: "#F97316" },
          { id: "right", label: "Basket C", accent: "#14B8A6" },
        ],
        safeDistribution: { left: 2, middle: 2, right: 1 },
        totalItems: [
          { id: "b1", kind: "berry", label: "Berry" },
          { id: "a1", kind: "apple", label: "Apple" },
          { id: "o1", kind: "orange", label: "Orange" },
          { id: "b2", kind: "berry", label: "Berry" },
          { id: "a2", kind: "apple", label: "Apple" },
        ],
      },
    ],
  },
  6: {
    lessonNumber: 6,
    completionKey: "completedGame6",
    gameTitle: "Soon or Later",
    mechanicType: "goal-sort",
    intro: {
      concept: "Timing changes the plan.",
      instruction: "Tap the right jar.",
    },
    skill: "Match money decisions to when the money is needed.",
    summary: "Sort each goal into the Soon jar or the Later jar.",
    theme: {
      accent: "#38BDF8",
      glow: "rgba(56,189,248,0.18)",
      panel: "rgba(56,189,248,0.08)",
    },
    win: {
      title: "Time-aware",
      takeaway: "Match the money to the timing.",
    },
    resultLabels: {
      needsWork: "Timeline tangle",
      solid: "Time-aware",
      strong: "Horizon matcher",
    },
    rounds: [
      {
        title: "Round 1",
        prompt: "Soon or later?",
        cards: [
          { id: "rent", label: "Rent next month", correctBucket: "soon" },
          { id: "trip", label: "Trip next year", correctBucket: "soon" },
          { id: "retire", label: "Retirement", correctBucket: "later" },
        ],
      },
      {
        title: "Round 2",
        prompt: "Soon or later?",
        cards: [
          { id: "car", label: "Car in 1 year", correctBucket: "soon" },
          { id: "college", label: "College in 12 years", correctBucket: "later" },
          { id: "wedding", label: "Wedding in 2 years", correctBucket: "soon" },
        ],
      },
      {
        title: "Round 3",
        prompt: "Soon or later?",
        cards: [
          { id: "emergency", label: "Emergency fund", correctBucket: "soon" },
          { id: "home", label: "Home in 10 years", correctBucket: "later" },
          { id: "retire2", label: "Retirement", correctBucket: "later" },
        ],
      },
    ],
  },
  7: {
    lessonNumber: 7,
    completionKey: "completedGame7",
    gameTitle: "Keep More Coins",
    mechanicType: "coin-compare",
    intro: {
      concept: "What you keep matters.",
      instruction: "Tap the better pile.",
    },
    skill: "Notice that taxes change the real result.",
    summary: "Compare the two coin piles after tax takes some away.",
    theme: {
      accent: "#F472B6",
      glow: "rgba(244,114,182,0.18)",
      panel: "rgba(244,114,182,0.08)",
    },
    win: {
      title: "After-tax thinker",
      takeaway: "After-tax money is the real result.",
    },
    resultLabels: {
      needsWork: "Tax fog",
      solid: "After-tax thinker",
      strong: "Tax-aware beginner",
    },
    rounds: [
      {
        title: "Round 1",
        prompt: "Which side keeps more?",
        leftCoins: 8,
        leftTax: 3,
        rightCoins: 6,
        rightTax: 0,
      },
      {
        title: "Round 2",
        prompt: "Which side keeps more?",
        leftCoins: 10,
        leftTax: 4,
        rightCoins: 7,
        rightTax: 1,
      },
      {
        title: "Round 3",
        prompt: "Which side keeps more?",
        leftCoins: 9,
        leftTax: 2,
        rightCoins: 8,
        rightTax: 2,
      },
    ],
  },
  8: {
    lessonNumber: 8,
    completionKey: "completedGame8",
    gameTitle: "Paycheck Builder",
    mechanicType: "paycheck-buckets",
    intro: {
      concept: "Some buckets help future-you more.",
      instruction: "Tap buckets.",
    },
    skill: "Understand why retirement accounts matter.",
    summary: "Place paycheck coins into buckets and watch which choices help future-you the most.",
    theme: {
      accent: "#34D399",
      glow: "rgba(52,211,153,0.18)",
      panel: "rgba(52,211,153,0.08)",
    },
    win: {
      title: "Future builder",
      takeaway: "Future buckets can help money do more.",
    },
    resultLabels: {
      needsWork: "Starter mode",
      solid: "Future builder",
      strong: "Retirement thinker",
    },
    rounds: [
      {
        title: "Round 1",
        prompt: "6 coins. Feed the future bucket.",
        totalCoins: 6,
        buckets: [
          { id: "spend", label: "Spend", accent: "#F87171" },
          { id: "future", label: "Future", accent: "#34D399" },
        ],
        safeDistribution: {
          spend: 2,
          future: 4,
        },
      },
      {
        title: "Round 2",
        prompt: "8 coins. Match bucket gets a bonus.",
        totalCoins: 8,
        matchBucketId: "match",
        buckets: [
          { id: "spend", label: "Spend", accent: "#FCA5A5" },
          { id: "match", label: "Match", accent: "#A78BFA" },
          { id: "future", label: "Future", accent: "#34D399" },
        ],
        safeDistribution: {
          spend: 2,
          match: 3,
          future: 3,
        },
      },
      {
        title: "Round 3",
        prompt: "7 coins. Build for later.",
        totalCoins: 7,
        buckets: [
          { id: "spend", label: "Spend", accent: "#FCA5A5" },
          { id: "save", label: "Save", accent: "#60A5FA" },
          { id: "future", label: "Future", accent: "#22C55E" },
        ],
        safeDistribution: {
          spend: 2,
          save: 2,
          future: 3,
        },
      },
    ],
  },
  9: {
    lessonNumber: 9,
    completionKey: "completedGame9",
    gameTitle: "Build the Shelf",
    mechanicType: "shelf-build",
    intro: {
      concept: "Simple beats messy.",
      instruction: "Tap shelves.",
    },
    skill: "Build a simple beginner portfolio.",
    summary: "Build a simple, balanced shelf instead of making one area carry everything.",
    theme: {
      accent: "#A78BFA",
      glow: "rgba(167,139,250,0.18)",
      panel: "rgba(167,139,250,0.08)",
    },
    win: {
      title: "Simple shelf",
      takeaway: "A starter setup should feel simple and balanced.",
    },
    resultLabels: {
      needsWork: "Portfolio draft",
      solid: "Starter builder",
      strong: "Beginner allocator",
    },
    rounds: [
      {
        title: "Round 1",
        prompt: "4 blocks. 2 shelves.",
        shelves: [
          { id: "top", label: "Top shelf", accent: "#A78BFA" },
          { id: "bottom", label: "Bottom shelf", accent: "#60A5FA" },
        ],
        safeDistribution: { top: 2, bottom: 2 },
        totalBlocks: [
          { id: "b1", kind: "blue" },
          { id: "g1", kind: "green" },
          { id: "p1", kind: "purple" },
          { id: "b2", kind: "blue" },
        ],
      },
      {
        title: "Round 2",
        prompt: "6 blocks. 3 shelves.",
        shelves: [
          { id: "top", label: "Top shelf", accent: "#A78BFA" },
          { id: "middle", label: "Middle shelf", accent: "#34D399" },
          { id: "bottom", label: "Bottom shelf", accent: "#60A5FA" },
        ],
        safeDistribution: { top: 2, middle: 2, bottom: 2 },
        totalBlocks: [
          { id: "b1", kind: "blue" },
          { id: "g1", kind: "green" },
          { id: "p1", kind: "purple" },
          { id: "b2", kind: "blue" },
          { id: "g2", kind: "green" },
          { id: "p2", kind: "purple" },
        ],
      },
      {
        title: "Round 3",
        prompt: "5 blocks. Keep it balanced.",
        shelves: [
          { id: "top", label: "Top shelf", accent: "#A78BFA" },
          { id: "middle", label: "Middle shelf", accent: "#34D399" },
          { id: "bottom", label: "Bottom shelf", accent: "#60A5FA" },
        ],
        safeDistribution: { top: 2, middle: 2, bottom: 1 },
        totalBlocks: [
          { id: "b1", kind: "blue" },
          { id: "g1", kind: "green" },
          { id: "p1", kind: "purple" },
          { id: "b2", kind: "blue" },
          { id: "g2", kind: "green" },
        ],
      },
    ],
  },
  10: {
    lessonNumber: 10,
    completionKey: "completedGame10",
    gameTitle: "Water the Plant",
    mechanicType: "consistency-scene",
    intro: {
      concept: "Steady habits win.",
      instruction: "Tap the steady action.",
    },
    skill: "Practice staying consistent through noise.",
    summary: "Different weather shows up, but the plant still needs the same steady care.",
    theme: {
      accent: "#22C55E",
      glow: "rgba(34,197,94,0.18)",
      panel: "rgba(34,197,94,0.08)",
    },
    win: {
      title: "Stay steady",
      takeaway: "Steady habits beat changing moods.",
    },
    resultLabels: {
      needsWork: "Easily shaken",
      solid: "Steady learner",
      strong: "Consistency builder",
    },
    rounds: [
      {
        title: "Round 1",
        prompt: "Rainy day. What stays steady?",
        scene: "rain",
        choices: [
          { id: "plan", kind: "plan", label: "Water the plant", result: "+Best move", feedback: "Yes. The steady plan still matters.", isBest: true },
          { id: "shiny", kind: "shiny", label: "Chase the distraction", result: "Too reactive", feedback: "The plant still needs steady care.", isBest: false },
        ],
      },
      {
        title: "Round 2",
        prompt: "Sunny day. What stays steady?",
        scene: "sun",
        choices: [
          { id: "plan", kind: "plan", label: "Water the plant", result: "+Best move", feedback: "Yes. The steady habit still wins.", isBest: true },
          { id: "shiny", kind: "shiny", label: "Chase the sparkle", result: "Hype trap", feedback: "Shiny things do not grow the plant.", isBest: false },
        ],
      },
      {
        title: "Round 3",
        prompt: "Weather changed. What stays steady?",
        scene: "rain",
        choices: [
          { id: "plan", kind: "plan", label: "Water the plant", result: "+Best move", feedback: "Yes. Same steady action again.", isBest: true },
          { id: "shiny", kind: "shiny", label: "Follow the mood", result: "Not stable", feedback: "Changing with the mood is not steady.", isBest: false },
        ],
      },
    ],
  },
};
