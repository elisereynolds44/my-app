export type LessonChoice = "A" | "B" | "C";

export type LessonStep =
  | { kind: "info"; kicker: string; title: string; body: string }
  | {
      kind: "terms";
      kicker: string;
      title: string;
      intro: string;
      items: { label: string; meaning: string; whyItMatters: string }[];
    }
  | {
      kind: "example";
      kicker: string;
      title: string;
      scenario: string;
      takeaway: string;
    }
  | {
      kind: "visual";
      display: "line" | "metrics" | "ticker";
      kicker: string;
      title: string;
      caption: string;
      data: { label: string; value: number }[];
      note?: string;
    }
  | {
      kind: "snapshot";
      kicker: string;
      title: string;
      eyebrow: string;
      bullets: string[];
    }
  | {
      kind: "question";
      kicker: string;
      title: string;
      prompt: string;
      options: { key: LessonChoice; text: string }[];
      correct: LessonChoice;
      correctMsg: string;
      wrongMsg: string;
    }
  | { kind: "win"; kicker: string; title: string; body: string };

export type LessonDefinition = {
  lessonNumber: number;
  moduleTitle: string;
  completionKey: string;
  steps: LessonStep[];
};

export const LESSON_LIBRARY: Record<number, LessonDefinition> = {
  1: {
    lessonNumber: 1,
    moduleTitle: "Foundations",
    completionKey: "completedLesson1",
    steps: [
      {
        kind: "info",
        kicker: "BIG IDEA",
        title: "A stock is a tiny piece of ownership.",
        body:
          "Buying a stock is not buying a burger, shoe, or phone. It is buying a small stake in the business behind it.",
      },
      {
        kind: "snapshot",
        kicker: "OWNER LENS",
        title: "Customers and owners look for different clues.",
        eyebrow: "A customer watches the product. An owner watches the business.",
        bullets: [
          "Customers care about taste, speed, and the line.",
          "Owners care about sales, profit, growth, and price.",
          "Owners ask what is changing in the business.",
        ],
      },
      {
        kind: "terms",
        kicker: "CORE WORDS",
        title: "Four basics to notice first.",
        intro: "These are the first clues on almost any investing screen.",
        items: [
          {
            label: "Price",
            meaning: "What one share costs right now.",
            whyItMatters: "It tells you what the market is charging today.",
          },
          {
            label: "Revenue",
            meaning: "Money the company brings in from sales.",
            whyItMatters: "It shows whether demand is growing.",
          },
          {
            label: "Profit",
            meaning: "Money left after costs.",
            whyItMatters: "It shows whether growth is actually useful.",
          },
          {
            label: "Expectations",
            meaning: "What investors already hope will happen next.",
            whyItMatters: "Expectations help explain why prices move.",
          },
        ],
      },
      {
        kind: "visual",
        display: "metrics",
        kicker: "VISUAL",
        title: "Owners watch more than the price.",
        caption: "A good owner board compares business clues, not just one big green number.",
        data: [
          { label: "Store growth", value: 78 },
          { label: "Profit", value: 72 },
          { label: "Price jump", value: 60 },
        ],
        note: "The price matters, but it is only one clue on the board.",
      },
      {
        kind: "example",
        kicker: "EXAMPLE",
        title: "A fast price jump is not the whole story.",
        scenario:
          "A stock can jump because people are excited today, even if the business itself did not improve much. Owners want to know whether the real business is getting stronger too.",
        takeaway: "Owner thinking starts with the business, not just the move.",
      },
      {
        kind: "info",
        kicker: "PRICE VS VALUE",
        title: "A great company can still be a bad buy at the wrong price.",
        body:
          "The business can be strong and the stock can still be too expensive. Good company and good investment are not exactly the same question.",
      },
      {
        kind: "visual",
        display: "ticker",
        kicker: "EXPECTATIONS",
        title: "Prices react to surprise.",
        caption: "If investors expected amazing results and got only decent results, the stock can still fall.",
        data: [
          { label: "Expected", value: 86 },
          { label: "Reality", value: 62 },
          { label: "Price", value: 44 },
        ],
        note: "The market compares reality with expectations.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Owner lens",
        prompt: "Which clue sounds most like owner thinking?",
        options: [
          { key: "A", text: "The meal tastes good." },
          { key: "B", text: "Profit is improving." },
          { key: "C", text: "The logo looks cool." },
        ],
        correct: "B",
        correctMsg: "Correct. Owners watch how the business is performing.",
        wrongMsg: "Not quite. Owner thinking is about business results, not customer preference.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "What moves price",
        prompt: "If results miss expectations, what can happen next?",
        options: [
          { key: "A", text: "The stock can drop even if the company still grew." },
          { key: "B", text: "The stock must rise because growth happened." },
          { key: "C", text: "Nothing changes because the past already happened." },
        ],
        correct: "A",
        correctMsg: "Correct. Prices move when the result is better or worse than expected.",
        wrongMsg: "Not quite. The market reacts to surprise, not just whether growth existed.",
      },
      {
        kind: "win",
        kicker: "LESSON COMPLETE",
        title: "Lesson 1 complete.",
        body:
          "You learned the owner lens: watch the business, compare price with expectations, and get ready for Owner Board next.",
      },
    ],
  },
  2: {
    lessonNumber: 2,
    moduleTitle: "Markets & movements",
    completionKey: "completedLesson2",
    steps: [
      {
        kind: "info",
        kicker: "BIG IDEA",
        title: "Prices move when expectations change.",
        body:
          "A stock does not move only because a company is good or bad. It moves when new information changes what people expect next.",
      },
      {
        kind: "snapshot",
        kicker: "MOVE TYPES",
        title: "Some moves hit one, some hit many, some hit all.",
        eyebrow: "This is the exact idea behind the game at the end.",
        bullets: [
          "One company can move on its own news.",
          "A whole group can move together on sector news.",
          "Almost everything can move on a big market day.",
        ],
      },
      {
        kind: "visual",
        display: "metrics",
        kicker: "VISUAL",
        title: "Scope matters.",
        caption: "When you look at a move, first ask how wide the splash is.",
        data: [
          { label: "One", value: 34 },
          { label: "Group", value: 63 },
          { label: "All", value: 88 },
        ],
        note: "The first question is not why yet. It is how many things moved.",
      },
      {
        kind: "example",
        kicker: "EXAMPLE",
        title: "A company move",
        scenario:
          "If one company reports weak earnings and only that stock drops, the move is probably company-specific.",
        takeaway: "One name moving by itself usually points to company news.",
      },
      {
        kind: "info",
        kicker: "EXPECTATIONS",
        title: "Good news can still disappoint.",
        body:
          "If investors expected huge growth and only got decent growth, the stock can still fall because the result missed the bar.",
      },
      {
        kind: "terms",
        kicker: "VOCAB",
        title: "Words that help explain movement.",
        intro: "These are the main labels you will see around price moves.",
        items: [
          {
            label: "Catalyst",
            meaning: "New information that changes expectations.",
            whyItMatters: "Catalysts often trigger the move.",
          },
          {
            label: "Sector move",
            meaning: "Many similar companies move together.",
            whyItMatters: "It tells you the move is broader than one company.",
          },
          {
            label: "Market mood",
            meaning: "The overall tone of the market, like fear or optimism.",
            whyItMatters: "It can pull many stocks together.",
          },
          {
            label: "Surprise",
            meaning: "The gap between what was expected and what happened.",
            whyItMatters: "Surprise is often what actually moves price.",
          },
        ],
      },
      {
        kind: "snapshot",
        kicker: "GAME PREP",
        title: "Use this quick check before guessing.",
        eyebrow: "The game is basically this question over and over.",
        bullets: [
          "If one stock moved, think company.",
          "If one category moved, think sector.",
          "If everything moved, think market.",
        ],
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "One or group",
        prompt: "If all restaurant stocks fall together, what is the best label?",
        options: [
          { key: "A", text: "Company move" },
          { key: "B", text: "Sector move" },
          { key: "C", text: "Random move" },
        ],
        correct: "B",
        correctMsg: "Correct. When similar companies move together, that is usually a sector move.",
        wrongMsg: "Not quite. A whole category moving together usually points to sector news.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "All together",
        prompt: "If the whole market is red, what is the best first thought?",
        options: [
          { key: "A", text: "This is probably a broad market move." },
          { key: "B", text: "Every company failed at once." },
          { key: "C", text: "Only one stock matters." },
        ],
        correct: "A",
        correctMsg: "Correct. Broad red days usually point to the market, not just one company.",
        wrongMsg: "Not quite. When almost everything moves together, the market is the bigger story.",
      },
      {
        kind: "win",
        kicker: "LESSON COMPLETE",
        title: "Lesson 2 complete.",
        body:
          "You are ready for What Moved It?: read the scope of the move, then match it to one, group, or all.",
      },
    ],
  },
  3: {
    lessonNumber: 3,
    moduleTitle: "Risk & reality",
    completionKey: "completedLesson3",
    steps: [
      {
        kind: "info",
        kicker: "BIG IDEA",
        title: "Risk is what happens when reality does not go your way.",
        body:
          "Risk is not only losing money forever. It is also big swings, bad timing, and having too much in one place.",
      },
      {
        kind: "snapshot",
        kicker: "BASKET IDEA",
        title: "One basket can break.",
        eyebrow: "This lesson ends in the banana game for a reason.",
        bullets: [
          "If everything sits in one basket, one break hurts a lot.",
          "If you spread things out, one break hurts less.",
          "Diversifying does not remove risk. It softens it.",
        ],
      },
      {
        kind: "visual",
        display: "metrics",
        kicker: "VISUAL",
        title: "Spread-out risk feels different.",
        caption: "Putting everything in one spot creates a bumpier ride than spreading it out.",
        data: [
          { label: "One basket", value: 90 },
          { label: "Three baskets", value: 54 },
          { label: "Cash buffer", value: 62 },
        ],
        note: "The goal is not perfect safety. It is survivable risk.",
      },
      {
        kind: "example",
        kicker: "EXAMPLE",
        title: "Timing changes the pain.",
        scenario:
          "A 20 percent drop feels very different if you need the money soon versus if you have time and a spread-out plan.",
        takeaway: "Risk depends on both the investment and your situation.",
      },
      {
        kind: "terms",
        kicker: "RISK WORDS",
        title: "Four beginner risks to know.",
        intro: "These are the main ways beginners get surprised.",
        items: [
          {
            label: "Concentration risk",
            meaning: "Too much money in one thing.",
            whyItMatters: "One mistake can hit everything you have.",
          },
          {
            label: "Volatility",
            meaning: "Big up and down moves.",
            whyItMatters: "It can shake people out of good plans.",
          },
          {
            label: "Liquidity need",
            meaning: "Needing money before it had time to recover.",
            whyItMatters: "Bad timing can lock in losses.",
          },
          {
            label: "Behavior risk",
            meaning: "Fear, hype, or impatience taking over.",
            whyItMatters: "A smart plan still needs steady behavior.",
          },
        ],
      },
      {
        kind: "info",
        kicker: "REALITY CHECK",
        title: "A drop does not always mean the plan failed.",
        body:
          "Even good long-term plans can fall during rough markets. A decline is painful, but it is not automatic proof that everything was wrong.",
      },
      {
        kind: "snapshot",
        kicker: "GAME PREP",
        title: "The safer setup is usually the spread-out one.",
        eyebrow: "That is the whole logic of Bananas in Baskets.",
        bullets: [
          "Do not load one basket with everything.",
          "Use more than one place when you can.",
          "Assume one basket might crack.",
        ],
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Concentration risk",
        prompt: "What is concentration risk?",
        options: [
          { key: "A", text: "Having too much in one investment." },
          { key: "B", text: "Owning a mix of investments." },
          { key: "C", text: "Keeping emergency cash." },
        ],
        correct: "A",
        correctMsg: "Correct. Concentration risk means one position matters too much.",
        wrongMsg: "Not quite. Concentration risk is about being too dependent on one place.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Better setup",
        prompt: "Which setup is safer before a basket breaks?",
        options: [
          { key: "A", text: "Everything in one basket" },
          { key: "B", text: "Bananas spread across baskets" },
          { key: "C", text: "No plan at all" },
        ],
        correct: "B",
        correctMsg: "Correct. Spreading risk helps one break hurt less.",
        wrongMsg: "Not quite. The spread-out setup is the safer one.",
      },
      {
        kind: "win",
        kicker: "LESSON COMPLETE",
        title: "Lesson 3 complete.",
        body:
          "You are ready for Bananas in Baskets: spread things out so one broken basket does not ruin the whole plan.",
      },
    ],
  },
  4: {
    lessonNumber: 4,
    moduleTitle: "Your first strategy",
    completionKey: "completedLesson4",
    steps: [
      {
        kind: "info",
        kicker: "BIG IDEA",
        title: "A strategy is a repeatable plan.",
        body:
          "A strategy is just a simple way to make choices again and again without starting from zero every time.",
      },
      {
        kind: "snapshot",
        kicker: "FIT",
        title: "The best plan should fit the person.",
        eyebrow: "Fast, safe, and simple are not the same plan.",
        bullets: [
          "A nervous beginner may need simple.",
          "Someone using money soon may need safe.",
          "Someone with lots of time may handle more speed.",
        ],
      },
      {
        kind: "terms",
        kicker: "PLAN TAGS",
        title: "Three easy strategy labels.",
        intro: "These match the bags in the game.",
        items: [
          {
            label: "Simple",
            meaning: "Easy to understand and easy to repeat.",
            whyItMatters: "Simple plans are easier to stick with.",
          },
          {
            label: "Safe",
            meaning: "Built for shorter timelines or lower stress.",
            whyItMatters: "It can fit people who need stability sooner.",
          },
          {
            label: "Fast",
            meaning: "Higher growth focus with more bumps.",
            whyItMatters: "It usually fits longer timelines better.",
          },
        ],
      },
      {
        kind: "example",
        kicker: "EXAMPLE",
        title: "One person, one better fit.",
        scenario:
          "If someone is new, nervous, and still learning, a simple plan usually fits better than a complicated or aggressive one.",
        takeaway: "Good fit matters more than trying to look advanced.",
      },
      {
        kind: "visual",
        display: "metrics",
        kicker: "VISUAL",
        title: "The right fit feels steadier.",
        caption: "A perfect-looking plan is useless if the person cannot stay with it.",
        data: [
          { label: "Simple fit", value: 82 },
          { label: "Safe fit", value: 70 },
          { label: "Wrong fit", value: 38 },
        ],
        note: "The best plan is the one a real person can follow.",
      },
      {
        kind: "info",
        kicker: "REAL LIFE",
        title: "There is no prize for picking the hardest plan.",
        body:
          "A plan that feels clear and repeatable often beats a flashy plan that makes you panic, quit, or change your mind.",
      },
      {
        kind: "snapshot",
        kicker: "GAME PREP",
        title: "Pack the right bag, not the fanciest one.",
        eyebrow: "The game asks one question: which bag fits this person?",
        bullets: [
          "Beginner plus nervous often means simple.",
          "Needs money soon often means safe.",
          "Long runway can handle more speed.",
        ],
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Short timeline",
        prompt: "If someone needs the money soon, which tag fits best first?",
        options: [
          { key: "A", text: "Safe" },
          { key: "B", text: "Fast" },
          { key: "C", text: "Random" },
        ],
        correct: "A",
        correctMsg: "Correct. Shorter timelines usually call for safer choices.",
        wrongMsg: "Not quite. Money needed soon usually calls for a safer fit.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "New beginner",
        prompt: "If someone is brand new and easily stressed, which tag fits best?",
        options: [
          { key: "A", text: "Fast" },
          { key: "B", text: "Simple" },
          { key: "C", text: "No plan" },
        ],
        correct: "B",
        correctMsg: "Correct. Simple is often the best fit for a new stressed beginner.",
        wrongMsg: "Not quite. A simple plan is usually the better fit there.",
      },
      {
        kind: "win",
        kicker: "LESSON COMPLETE",
        title: "Lesson 4 complete.",
        body:
          "You are ready for Pack the Right Bag: match the person to the plan that really fits them.",
      },
    ],
  },
  5: {
    lessonNumber: 5,
    moduleTitle: "ETFs & diversification",
    completionKey: "completedLesson5",
    steps: [
      {
        kind: "info",
        kicker: "BIG IDEA",
        title: "A mix is safer than all one thing.",
        body:
          "Diversification means spreading your money instead of depending on one stock or one outcome.",
      },
      {
        kind: "snapshot",
        kicker: "BASKET IDEA",
        title: "One bad fruit should not ruin the whole basket.",
        eyebrow: "That is exactly what the Fruit Basket game is teaching.",
        bullets: [
          "All one thing means one surprise can hurt a lot.",
          "A mix can hold up better when one piece struggles.",
          "Diversification reduces concentration risk.",
        ],
      },
      {
        kind: "terms",
        kicker: "FUND BASICS",
        title: "Words that make mixing easier.",
        intro: "These are the labels beginners see most often here.",
        items: [
          {
            label: "ETF",
            meaning: "A fund that can hold many investments inside one wrapper.",
            whyItMatters: "It can make diversification easier.",
          },
          {
            label: "Index fund",
            meaning: "A fund built to track a market index.",
            whyItMatters: "It gives broad exposure in one purchase.",
          },
          {
            label: "Diversification",
            meaning: "Spreading risk across many holdings.",
            whyItMatters: "It helps one disappointment hurt less.",
          },
          {
            label: "Fee",
            meaning: "The cost of owning the fund.",
            whyItMatters: "Lower fees leave more of the return with you.",
          },
        ],
      },
      {
        kind: "visual",
        display: "metrics",
        kicker: "VISUAL",
        title: "One stock versus one broad fund.",
        caption: "A broad mix usually feels steadier than betting everything on one name.",
        data: [
          { label: "One stock", value: 89 },
          { label: "Broad fund", value: 55 },
          { label: "Mixed basket", value: 50 },
        ],
        note: "A mix is not magic. It is just less fragile.",
      },
      {
        kind: "example",
        kicker: "EXAMPLE",
        title: "Why a mix feels different",
        scenario:
          "If one company disappoints, a broad fund may wobble much less because many other holdings are still inside the basket.",
        takeaway: "A mix can handle one bad surprise better.",
      },
      {
        kind: "info",
        kicker: "BEGINNER EDGE",
        title: "Funds can do the mixing for you.",
        body:
          "Instead of hand-picking lots of separate companies, a broad fund can give you many holdings at once in a simpler way.",
      },
      {
        kind: "snapshot",
        kicker: "GAME PREP",
        title: "Fruit Basket uses the same logic.",
        eyebrow: "Do not build a basket with only one fruit.",
        bullets: [
          "A mixed basket is stronger than a single-fruit basket.",
          "One spoiled fruit should not ruin everything.",
          "Variety is the point.",
        ],
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Why people use broad funds",
        prompt: "Why do many beginners like broad funds?",
        options: [
          { key: "A", text: "They can give diversification in one place." },
          { key: "B", text: "They remove all risk." },
          { key: "C", text: "They guarantee the best return." },
        ],
        correct: "A",
        correctMsg: "Correct. Broad funds can make diversification easier.",
        wrongMsg: "Not quite. The main benefit is easier diversification, not zero risk.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "What matters in the basket",
        prompt: "Which basket is safer?",
        options: [
          { key: "A", text: "All one fruit" },
          { key: "B", text: "A mix of fruits" },
          { key: "C", text: "The fullest basket" },
        ],
        correct: "B",
        correctMsg: "Correct. A mix handles bad surprises better.",
        wrongMsg: "Not quite. The mixed basket is the safer idea here.",
      },
      {
        kind: "win",
        kicker: "LESSON COMPLETE",
        title: "Lesson 5 complete.",
        body:
          "You are ready for Fruit Basket: build a mix so one spoiled piece does not wreck the whole basket.",
      },
    ],
  },
  6: {
    lessonNumber: 6,
    moduleTitle: "Time horizon",
    completionKey: "completedLesson6",
    steps: [
      {
        kind: "info",
        kicker: "BIG IDEA",
        title: "When you need the money changes the plan.",
        body:
          "A goal that is close by should not be treated the same way as a goal that is far away.",
      },
      {
        kind: "snapshot",
        kicker: "TIMING",
        title: "Some goals are soon. Some are later.",
        eyebrow: "This lesson leads right into the Soon or Later game.",
        bullets: [
          "Rent next month is soon.",
          "A trip next year is still fairly soon.",
          "Retirement decades away is later.",
        ],
      },
      {
        kind: "terms",
        kicker: "TIME HORIZON",
        title: "What timing changes.",
        intro: "Time horizon is one of the biggest inputs in a plan.",
        items: [
          {
            label: "Time horizon",
            meaning: "How long until you need the money.",
            whyItMatters: "It shapes what kind of risk makes sense.",
          },
          {
            label: "Risk room",
            meaning: "How much time the money has to recover from bumps.",
            whyItMatters: "Longer timelines usually have more room.",
          },
          {
            label: "Emergency cash",
            meaning: "Money kept available for near-term surprises.",
            whyItMatters: "Soon money should stay easy to reach.",
          },
          {
            label: "Goal match",
            meaning: "Using the right money setup for the right goal.",
            whyItMatters: "Good investing often starts with matching money to timing.",
          },
        ],
      },
      {
        kind: "visual",
        display: "line",
        kicker: "VISUAL",
        title: "Time gives growth more room to work.",
        caption: "Longer timelines usually give money more time to ride through bumps and grow.",
        data: [
          { label: "1 yr", value: 28 },
          { label: "3 yr", value: 47 },
          { label: "5 yr", value: 62 },
          { label: "10 yr", value: 80 },
        ],
        note: "More time does not remove risk, but it usually gives you more room.",
      },
      {
        kind: "example",
        kicker: "EXAMPLE",
        title: "Two goals, two plans.",
        scenario:
          "Money for rent next month and money for retirement should not be handled the same way because the timelines are completely different.",
        takeaway: "Different timing should lead to different choices.",
      },
      {
        kind: "info",
        kicker: "MATCH THE MONEY",
        title: "Soon money and later money should not get mixed up.",
        body:
          "Good planning often means protecting near-term money and giving long-term money more time and room.",
      },
      {
        kind: "snapshot",
        kicker: "GAME PREP",
        title: "Think in two jars.",
        eyebrow: "The game asks one simple question: soon or later?",
        bullets: [
          "Bills and emergency money usually go in soon.",
          "Long-run goals usually go in later.",
          "Match the jar to the goal.",
        ],
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Near-term goal",
        prompt: "A trip next month belongs in which jar?",
        options: [
          { key: "A", text: "Soon" },
          { key: "B", text: "Later" },
          { key: "C", text: "Either one" },
        ],
        correct: "A",
        correctMsg: "Correct. A near-term goal belongs in the soon jar.",
        wrongMsg: "Not quite. A trip next month is a soon goal.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Long-term goal",
        prompt: "Retirement most likely belongs in which jar?",
        options: [
          { key: "A", text: "Soon" },
          { key: "B", text: "Later" },
          { key: "C", text: "Neither" },
        ],
        correct: "B",
        correctMsg: "Correct. Retirement is a later goal.",
        wrongMsg: "Not quite. Retirement is the classic later goal.",
      },
      {
        kind: "win",
        kicker: "LESSON COMPLETE",
        title: "Lesson 6 complete.",
        body:
          "You are ready for Soon or Later: sort each goal by timing and match the money to the job.",
      },
    ],
  },
  7: {
    lessonNumber: 7,
    moduleTitle: "Tax basics",
    completionKey: "completedLesson7",
    steps: [
      {
        kind: "info",
        kicker: "BIG IDEA",
        title: "What you keep matters as much as what you earn.",
        body:
          "A bigger number before tax is not always the better result. What you keep after tax is the number that really matters.",
      },
      {
        kind: "terms",
        kicker: "TAX WORDS",
        title: "Core tax words for beginners.",
        intro: "You do not need every detail yet. Just know the main ideas.",
        items: [
          {
            label: "Realized gain",
            meaning: "A gain that becomes real when you sell.",
            whyItMatters: "Selling can create taxes.",
          },
          {
            label: "Taxable account",
            meaning: "A regular investing account with normal tax rules.",
            whyItMatters: "Buying and selling there can create tax consequences.",
          },
          {
            label: "Retirement account",
            meaning: "An account with special tax rules.",
            whyItMatters: "The tax treatment can work differently there.",
          },
          {
            label: "After-tax",
            meaning: "What is left after taxes are taken out.",
            whyItMatters: "That is the result you actually keep.",
          },
        ],
      },
      {
        kind: "example",
        kicker: "EXAMPLE",
        title: "Selling can create taxes.",
        scenario:
          "If you sell an investment for more than you paid in a taxable account, part of the gain may go to taxes instead of staying in your pocket.",
        takeaway: "Selling can change your after-tax result.",
      },
      {
        kind: "visual",
        display: "metrics",
        kicker: "VISUAL",
        title: "Before tax and after tax are not the same pile.",
        caption: "Two piles can look close at first, then end very differently after taxes are removed.",
        data: [
          { label: "Before tax", value: 84 },
          { label: "Tax taken", value: 26 },
          { label: "After tax", value: 58 },
        ],
        note: "The after-tax pile is the real result.",
      },
      {
        kind: "info",
        kicker: "ACCOUNT TYPE",
        title: "Where the money sits can change the tax story.",
        body:
          "A taxable account and a retirement account do not always treat gains the same way, so account type matters.",
      },
      {
        kind: "snapshot",
        kicker: "THREE REMINDERS",
        title: "Simple tax rules to remember.",
        eyebrow: "Keep these in mind before the game.",
        bullets: [
          "Selling can trigger taxes.",
          "Account type changes the rules.",
          "After-tax money is the number to compare.",
        ],
      },
      {
        kind: "info",
        kicker: "GAME PREP",
        title: "The better pile is the one that keeps more.",
        body:
          "The game is simple on purpose: compare two results and pick the side that leaves you with more after taxes.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Realized gains",
        prompt: "When might taxes show up on a gain in a taxable account?",
        options: [
          { key: "A", text: "When you sell and lock in the gain" },
          { key: "B", text: "Just by watching the price go up" },
          { key: "C", text: "Never" },
        ],
        correct: "A",
        correctMsg: "Correct. Selling is what can make the gain taxable.",
        wrongMsg: "Not quite. The tax issue usually shows up when the gain is realized by selling.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Which number matters most",
        prompt: "Which result should you compare first?",
        options: [
          { key: "A", text: "Before-tax result" },
          { key: "B", text: "After-tax result" },
          { key: "C", text: "The bigger headline" },
        ],
        correct: "B",
        correctMsg: "Correct. After-tax money is the real amount you keep.",
        wrongMsg: "Not quite. The after-tax result is the one that matters most.",
      },
      {
        kind: "win",
        kicker: "LESSON COMPLETE",
        title: "Lesson 7 complete.",
        body:
          "You are ready for Keep More Coins: ignore the flashy starting pile and choose the result that keeps more after tax.",
      },
    ],
  },
  8: {
    lessonNumber: 8,
    moduleTitle: "Roth IRA & 401(k)",
    completionKey: "completedLesson8",
    steps: [
      {
        kind: "info",
        kicker: "BIG IDEA",
        title: "Retirement accounts are wrappers with special rules.",
        body:
          "A 401(k) or Roth IRA is not the investment by itself. It is the bucket the investment sits inside.",
      },
      {
        kind: "terms",
        kicker: "ACCOUNT BASICS",
        title: "The big ideas to know here.",
        intro: "These are the most useful starter concepts.",
        items: [
          {
            label: "401(k)",
            meaning: "A workplace retirement account.",
            whyItMatters: "Some jobs offer matching money there.",
          },
          {
            label: "Employer match",
            meaning: "Extra money an employer may add when you contribute.",
            whyItMatters: "It can boost the future bucket fast.",
          },
          {
            label: "Roth IRA",
            meaning: "A personal retirement account with its own tax rules.",
            whyItMatters: "It is another future bucket people often use.",
          },
          {
            label: "Investing the money",
            meaning: "Choosing what the account money actually buys.",
            whyItMatters: "Opening the account alone is not the last step.",
          },
        ],
      },
      {
        kind: "snapshot",
        kicker: "PAYCHECK PATH",
        title: "Think in buckets.",
        eyebrow: "This lesson flows right into the paycheck game.",
        bullets: [
          "Some money is for spending now.",
          "Some money is for future-you.",
          "Match buckets can add extra help.",
        ],
      },
      {
        kind: "example",
        kicker: "EXAMPLE",
        title: "Why match matters",
        scenario:
          "If your employer adds money when you contribute to your 401(k), the future bucket grows faster than if you ignored the match.",
        takeaway: "Matching money is one reason the bucket matters.",
      },
      {
        kind: "visual",
        display: "metrics",
        kicker: "VISUAL",
        title: "Some buckets do more work for future-you.",
        caption: "A paycheck can feed several buckets, but some help the future more than others.",
        data: [
          { label: "Spend now", value: 42 },
          { label: "Future", value: 70 },
          { label: "Match", value: 88 },
        ],
        note: "The match bucket stands out because extra money can join in there.",
      },
      {
        kind: "info",
        kicker: "COMMON MISTAKE",
        title: "Opening the account is not the same as investing the money.",
        body:
          "You can open a retirement account and still need to choose the investments inside it. The wrapper and the investment are two separate steps.",
      },
      {
        kind: "snapshot",
        kicker: "GAME PREP",
        title: "The game asks where the coins should go.",
        eyebrow: "Feed the stronger future buckets, not just the easiest bucket.",
        bullets: [
          "Future buckets matter.",
          "Match buckets can be extra powerful.",
          "Do not confuse the bucket with the investment.",
        ],
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Employer match",
        prompt: "If a match is available, what is the best first thought?",
        options: [
          { key: "A", text: "Ignoring it is fine" },
          { key: "B", text: "It can add extra money to the future bucket" },
          { key: "C", text: "It only helps spending now" },
        ],
        correct: "B",
        correctMsg: "Correct. A match can add extra money to your future bucket.",
        wrongMsg: "Not quite. The match matters because extra money can be added there.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "After opening the account",
        prompt: "What usually still needs to happen after opening a retirement account?",
        options: [
          { key: "A", text: "Choose the investments inside it" },
          { key: "B", text: "Nothing else" },
          { key: "C", text: "Spend the money back out" },
        ],
        correct: "A",
        correctMsg: "Correct. The money still needs to be invested inside the account.",
        wrongMsg: "Not quite. Opening the account is only the wrapper step.",
      },
      {
        kind: "win",
        kicker: "LESSON COMPLETE",
        title: "Lesson 8 complete.",
        body:
          "You are ready for Paycheck Builder: send coins into the buckets that help future-you the most.",
      },
    ],
  },
  9: {
    lessonNumber: 9,
    moduleTitle: "Starter portfolio",
    completionKey: "completedLesson9",
    steps: [
      {
        kind: "info",
        kicker: "BIG IDEA",
        title: "A portfolio is the mix of what you own.",
        body:
          "A portfolio is not one investment. It is the whole collection of what your money is sitting in.",
      },
      {
        kind: "snapshot",
        kicker: "SHELF IDEA",
        title: "A starter portfolio should feel simple and balanced.",
        eyebrow: "That is exactly what the shelf game is practicing.",
        bullets: [
          "A few clear pieces beat random clutter.",
          "Balance matters more than trying to own everything.",
          "If it feels messy, it may be too much.",
        ],
      },
      {
        kind: "terms",
        kicker: "PORTFOLIO WORDS",
        title: "Starter words to know.",
        intro: "These are the basic labels that show up here.",
        items: [
          {
            label: "Allocation",
            meaning: "How your money is split across the portfolio.",
            whyItMatters: "It shows where the weight really sits.",
          },
          {
            label: "Diversification",
            meaning: "Not relying on one holding alone.",
            whyItMatters: "It can make the shelf feel steadier.",
          },
          {
            label: "Fund",
            meaning: "One investment that can hold many others inside.",
            whyItMatters: "Funds can simplify a starter mix.",
          },
          {
            label: "Cash",
            meaning: "Money not currently invested.",
            whyItMatters: "Cash has a role too, depending on the goal.",
          },
        ],
      },
      {
        kind: "visual",
        display: "metrics",
        kicker: "VISUAL",
        title: "A simple mix can still be strong.",
        caption: "You do not need a crowded portfolio to have a thoughtful one.",
        data: [
          { label: "Simple", value: 82 },
          { label: "Balanced", value: 76 },
          { label: "Messy", value: 36 },
        ],
        note: "Simple does not mean careless. It means clear.",
      },
      {
        kind: "example",
        kicker: "EXAMPLE",
        title: "A simple portfolio can be enough.",
        scenario:
          "A beginner can start with a small number of clear positions and still have a real portfolio. More pieces is not automatically better.",
        takeaway: "A starter setup should be understandable on purpose.",
      },
      {
        kind: "info",
        kicker: "BEGINNER RULE",
        title: "If you cannot explain it, it may be too complicated.",
        body:
          "A beginner portfolio should feel simple enough that you could explain what is in it and why it belongs there.",
      },
      {
        kind: "snapshot",
        kicker: "GAME PREP",
        title: "Build the shelf, not a pile.",
        eyebrow: "The game rewards balance and simplicity.",
        bullets: [
          "Do not overload one shelf.",
          "Do not add random extra pieces just to look fancy.",
          "Simple and balanced wins.",
        ],
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Allocation",
        prompt: "What does allocation mean?",
        options: [
          { key: "A", text: "How your money is split" },
          { key: "B", text: "How many headlines you read" },
          { key: "C", text: "How fast a stock moved today" },
        ],
        correct: "A",
        correctMsg: "Correct. Allocation is how the money is divided up.",
        wrongMsg: "Not quite. Allocation is about where the money is placed.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Starter mindset",
        prompt: "If a portfolio feels random and hard to explain, what is the best thought?",
        options: [
          { key: "A", text: "It may be too complicated" },
          { key: "B", text: "That means it is advanced" },
          { key: "C", text: "Random is better" },
        ],
        correct: "A",
        correctMsg: "Correct. Hard-to-explain portfolios are often too messy for a beginner.",
        wrongMsg: "Not quite. A starter portfolio should feel clear and explainable.",
      },
      {
        kind: "win",
        kicker: "LESSON COMPLETE",
        title: "Lesson 9 complete.",
        body:
          "You are ready for Build the Shelf: keep the setup balanced, simple, and easy to explain.",
      },
    ],
  },
  10: {
    lessonNumber: 10,
    moduleTitle: "Staying consistent",
    completionKey: "completedLesson10",
    steps: [
      {
        kind: "info",
        kicker: "BIG IDEA",
        title: "Consistency beats hype over time.",
        body:
          "A calm repeatable habit usually helps more than changing your plan every time the mood changes.",
      },
      {
        kind: "snapshot",
        kicker: "PLANT IDEA",
        title: "A plant grows from steady care, not mood swings.",
        eyebrow: "This is the exact picture behind the final game.",
        bullets: [
          "Rainy days still need the plan.",
          "Sunny days still need the plan.",
          "The weather changes faster than the goal.",
        ],
      },
      {
        kind: "terms",
        kicker: "HABITS",
        title: "Words that support consistency.",
        intro: "These are simple habit ideas, not fancy jargon.",
        items: [
          {
            label: "Automation",
            meaning: "Setting a plan to happen on its own.",
            whyItMatters: "It can reduce emotion-based decisions.",
          },
          {
            label: "Rules",
            meaning: "A simple set of decisions made ahead of time.",
            whyItMatters: "Rules help when feelings are loud.",
          },
          {
            label: "Noise",
            meaning: "Short-term market chatter and mood swings.",
            whyItMatters: "Noise can distract you from the plan.",
          },
          {
            label: "Consistency",
            meaning: "Repeating the useful action over time.",
            whyItMatters: "That is how habits compound.",
          },
        ],
      },
      {
        kind: "example",
        kicker: "EXAMPLE",
        title: "Same plan, different weather.",
        scenario:
          "One day the market feels scary, another day it feels exciting. A steady investor does not rebuild the whole plan each time the weather changes.",
        takeaway: "A mood is not the same thing as a plan.",
      },
      {
        kind: "visual",
        display: "line",
        kicker: "VISUAL",
        title: "Steady habits build slowly.",
        caption: "Consistent action can look boring in the moment and strong over time.",
        data: [
          { label: "Week 1", value: 22 },
          { label: "Week 2", value: 38 },
          { label: "Week 3", value: 55 },
          { label: "Week 4", value: 76 },
        ],
        note: "The power comes from repeating the plan.",
      },
      {
        kind: "info",
        kicker: "REALITY CHECK",
        title: "Feelings change faster than goals.",
        body:
          "Fear, excitement, and boredom show up all the time. Long-term goals usually change much more slowly, so the plan should not swing with every mood.",
      },
      {
        kind: "snapshot",
        kicker: "GAME PREP",
        title: "Water the plant again.",
        eyebrow: "The final game keeps asking the same question on purpose.",
        bullets: [
          "Rain? Still water the plant.",
          "Sun? Still water the plant.",
          "Mood change? Still follow the plan.",
        ],
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Why automation helps",
        prompt: "Why can automation be useful?",
        options: [
          { key: "A", text: "It helps the plan keep going without relying on mood" },
          { key: "B", text: "It removes all risk" },
          { key: "C", text: "It makes headlines matter more" },
        ],
        correct: "A",
        correctMsg: "Correct. Automation can help the plan keep going steadily.",
        wrongMsg: "Not quite. The point is to rely less on changing emotions.",
      },
      {
        kind: "question",
        kicker: "FINAL QUIZ",
        title: "Steady choice",
        prompt: "On a noisy market day, what is usually the better first move?",
        options: [
          { key: "A", text: "Follow the plan" },
          { key: "B", text: "Chase the mood" },
          { key: "C", text: "Change everything fast" },
        ],
        correct: "A",
        correctMsg: "Correct. Steady habits beat changing moods.",
        wrongMsg: "Not quite. Consistency usually starts by following the plan.",
      },
      {
        kind: "win",
        kicker: "COURSE COMPLETE",
        title: "Lesson 10 complete.",
        body:
          "You are ready for Water the Plant: keep choosing the steady action even when the weather changes.",
      },
    ],
  },
};
