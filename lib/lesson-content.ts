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
  2: {
    lessonNumber: 2,
    moduleTitle: "Markets & movements",
    completionKey: "completedLesson2",
    steps: [
      {
        kind: "info",
        kicker: "BIG IDEA",
        title: "Stock prices move when expectations change.",
        body:
          "A stock does not move only because a company is good or bad. It moves when new information changes what investors expect to happen next.",
      },
      {
        kind: "snapshot",
        kicker: "WHY PRICES MOVE",
        title: "Four things can move a stock fast.",
        eyebrow: "A price move is usually the market reacting to a new story.",
        bullets: [
          "Company news like earnings, guidance, or product launches.",
          "Industry news like regulation, supply problems, or competitor pressure.",
          "Big market mood shifts when indexes fall or rise together.",
          "Interest-rate and economic news that changes risk appetite.",
        ],
      },
      {
        kind: "visual",
        display: "ticker",
        kicker: "VISUAL",
        title: "Good news can still lead to a drop.",
        caption:
          "If investors expected an amazing quarter and the company only delivered a decent one, the stock can still fall.",
        data: [
          { label: "Fear", value: 28 },
          { label: "Expected", value: 82 },
          { label: "Reality", value: 61 },
        ],
        note: "The market compares reality to expectations, not just good versus bad.",
      },
      {
        kind: "example",
        kicker: "EXAMPLE",
        title: "A stock can fall on a headline that sounds good.",
        scenario:
          "Imagine a company grows sales by 10 percent. That sounds strong. But if investors expected 20 percent growth, the stock can still drop because the result was below the market's hopes.",
        takeaway:
          "Price movement is usually about surprise, not just whether the news sounds positive.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Expectations",
        prompt: "Why might a stock fall after a company reports growth?",
        options: [
          { key: "A", text: "Because the company grew slower than investors expected." },
          { key: "B", text: "Because growth never matters." },
          { key: "C", text: "Because stock prices only follow yesterday's move." },
        ],
        correct: "A",
        correctMsg: "Correct. The key question is whether the result beat or missed expectations.",
        wrongMsg:
          "Not quite. Stocks often move based on whether results were better or worse than investors expected.",
      },
      {
        kind: "terms",
        kicker: "VOCAB",
        title: "A few movement words to know.",
        intro: "These words help explain why prices can swing around so much.",
        items: [
          {
            label: "Volatility",
            meaning: "How much a price moves up and down over time.",
            whyItMatters: "Higher volatility usually means a bumpier ride.",
          },
          {
            label: "Catalyst",
            meaning: "A new event or piece of information that changes investor expectations.",
            whyItMatters: "Catalysts often trigger the biggest price moves.",
          },
          {
            label: "Market sentiment",
            meaning: "The overall mood of investors, such as fear or optimism.",
            whyItMatters: "Sometimes sentiment moves stocks even before fundamentals do.",
          },
          {
            label: "Sector move",
            meaning: "A price move affecting many similar companies at once.",
            whyItMatters: "It helps you tell whether a move is company-specific or broader.",
          },
        ],
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Market context",
        prompt: "If your stock falls and the whole sector falls too, what is the best first conclusion?",
        options: [
          { key: "A", text: "It may be a broader sector move, not just a company problem." },
          { key: "B", text: "Your company definitely failed." },
          { key: "C", text: "The stock market is random." },
        ],
        correct: "A",
        correctMsg: "Correct. Sector context helps explain whether the move is broad or specific.",
        wrongMsg:
          "Not quite. When many similar stocks fall together, broader context usually matters.",
      },
      {
        kind: "win",
        kicker: "LESSON COMPLETE",
        title: "Lesson 2 complete.",
        body:
          "You now understand that stock prices move when expectations change, and that context matters just as much as the headline itself.",
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
        title: "Risk is the chance that reality goes differently than you hoped.",
        body:
          "In investing, risk is not just losing money forever. It is also the chance of big swings, bad timing, concentration, and needing cash at the wrong moment.",
      },
      {
        kind: "terms",
        kicker: "RISK TERMS",
        title: "Four kinds of beginner risk.",
        intro: "These are some of the most common ways new investors get surprised.",
        items: [
          {
            label: "Concentration risk",
            meaning: "Too much money in one stock or one idea.",
            whyItMatters: "One bad event can hurt your whole portfolio.",
          },
          {
            label: "Volatility risk",
            meaning: "Big price swings over short periods of time.",
            whyItMatters: "It can trigger emotional decisions even when the business is fine.",
          },
          {
            label: "Liquidity need",
            meaning: "Needing your money before the investment had time to recover.",
            whyItMatters: "Time pressure can turn a temporary drop into a real loss.",
          },
          {
            label: "Behavior risk",
            meaning: "Making choices based on fear, hype, or impatience.",
            whyItMatters: "A good plan can still fail if behavior falls apart.",
          },
        ],
      },
      {
        kind: "visual",
        display: "metrics",
        kicker: "VISUAL",
        title: "One-stock risk versus spread-out risk.",
        caption:
          "Putting everything in one stock can create a much bumpier experience than spreading risk across many investments.",
        data: [
          { label: "One stock", value: 88 },
          { label: "Diversified mix", value: 54 },
          { label: "Emergency cash", value: 70 },
        ],
        note: "The goal is not to remove risk. It is to make it survivable.",
      },
      {
        kind: "example",
        kicker: "EXAMPLE",
        title: "The same drop feels different depending on your setup.",
        scenario:
          "If your only investment drops 20 percent and you need the money soon, the experience is very different from a 20 percent drop inside a diversified long-term portfolio you do not need right away.",
        takeaway:
          "Risk is partly about the investment and partly about your situation.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Concentration",
        prompt: "What is concentration risk?",
        options: [
          { key: "A", text: "Having too much money in one investment." },
          { key: "B", text: "Owning both stocks and bonds." },
          { key: "C", text: "Saving cash for emergencies." },
        ],
        correct: "A",
        correctMsg: "Correct. Concentration risk means one position matters too much.",
        wrongMsg:
          "Not quite. Concentration risk is about being too dependent on one investment or theme.",
      },
      {
        kind: "info",
        kicker: "REALITY CHECK",
        title: "Losses and drawdowns are normal parts of investing.",
        body:
          "A portfolio can drop in value even when your long-term plan is still reasonable. A drop does not automatically mean the plan failed.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "A drop is not always disaster",
        prompt: "If a diversified long-term portfolio falls during a rough market, the best first thought is:",
        options: [
          { key: "A", text: "This may be a normal market decline, not proof the plan is broken." },
          { key: "B", text: "Every investment should be sold immediately." },
          { key: "C", text: "Risk only matters if you lose everything." },
        ],
        correct: "A",
        correctMsg: "Correct. Declines happen. The key is whether your plan still fits your goal and time horizon.",
        wrongMsg:
          "Not quite. Market drops are part of reality, and context matters before reacting.",
      },
      {
        kind: "win",
        kicker: "LESSON COMPLETE",
        title: "Lesson 3 complete.",
        body:
          "You now understand that risk is not just about whether an investment can go down, but also whether your plan can handle that reality.",
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
        title: "A strategy is just a repeatable way to make decisions.",
        body:
          "A beginner strategy does not need to be complicated. It usually starts with a goal, a time horizon, a contribution plan, and a few simple rules.",
      },
      {
        kind: "terms",
        kicker: "PLAN PIECES",
        title: "What a simple beginner strategy can include.",
        intro: "The point is consistency, not complexity.",
        items: [
          {
            label: "Goal",
            meaning: "What the money is for, such as retirement or a future purchase.",
            whyItMatters: "A strategy makes more sense when it serves a real purpose.",
          },
          {
            label: "Contribution plan",
            meaning: "How often and how much you invest.",
            whyItMatters: "Regular investing reduces guesswork.",
          },
          {
            label: "Rules",
            meaning: "The conditions that guide your choices.",
            whyItMatters: "Rules help when emotions are loud.",
          },
          {
            label: "Review schedule",
            meaning: "How often you check in on your plan.",
            whyItMatters: "A schedule helps you avoid constant reacting.",
          },
        ],
      },
      {
        kind: "visual",
        display: "line",
        kicker: "VISUAL",
        title: "Steady contributions can do a lot of work.",
        caption:
          "A beginner strategy often looks boring in the best way: invest regularly, stick to the plan, and let time do part of the heavy lifting.",
        data: [
          { label: "Month 1", value: 22 },
          { label: "Month 3", value: 39 },
          { label: "Month 6", value: 61 },
          { label: "Month 12", value: 86 },
        ],
        note: "Consistency usually matters more than trying to time every move.",
      },
      {
        kind: "example",
        kicker: "EXAMPLE",
        title: "A simple first strategy",
        scenario:
          "A beginner might decide to invest a fixed amount every month, stay diversified, avoid buying based on hype, and only review the plan once a month instead of every day.",
        takeaway:
          "A good first strategy is often simple enough to repeat during stressful weeks.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Consistency",
        prompt: "Which choice sounds most like a strategy?",
        options: [
          { key: "A", text: "Buying whatever is trending that day." },
          { key: "B", text: "Investing a set amount monthly with simple rules." },
          { key: "C", text: "Changing your plan every week." },
        ],
        correct: "B",
        correctMsg: "Correct. A strategy should be repeatable and understandable.",
        wrongMsg:
          "Not quite. A strategy is meant to create consistency, not constant improvisation.",
      },
      {
        kind: "info",
        kicker: "CHECKLIST",
        title: "A checklist can protect you from random decisions.",
        body:
          "You can keep a strategy simple by asking the same few questions every time: What is this money for? How long until I need it? Does this fit my plan?",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "What a checklist does",
        prompt: "Why is a checklist useful in a beginner strategy?",
        options: [
          { key: "A", text: "It removes all investment risk." },
          { key: "B", text: "It gives you a repeatable process." },
          { key: "C", text: "It guarantees better returns." },
        ],
        correct: "B",
        correctMsg: "Correct. A checklist helps you think in a consistent way.",
        wrongMsg:
          "Not quite. A checklist does not guarantee outcomes, but it does create process.",
      },
      {
        kind: "win",
        kicker: "LESSON COMPLETE",
        title: "Lesson 4 complete.",
        body:
          "You now know what a first strategy can look like: simple goals, steady contributions, and repeatable rules.",
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
        title: "ETFs and index funds can make diversification easier.",
        body:
          "Instead of choosing one company at a time, many investors use funds that hold lots of investments at once.",
      },
      {
        kind: "terms",
        kicker: "FUND BASICS",
        title: "The words you will see most often.",
        intro: "These terms come up a lot when people talk about simple diversified investing.",
        items: [
          {
            label: "ETF",
            meaning: "A fund that trades on an exchange and can hold many investments inside it.",
            whyItMatters: "One ETF can give exposure to many stocks or bonds at once.",
          },
          {
            label: "Mutual fund",
            meaning: "A pooled investment fund that holds a portfolio of assets.",
            whyItMatters: "Mutual funds can also provide diversification.",
          },
          {
            label: "Index fund",
            meaning: "A fund designed to follow an index instead of trying to beat it.",
            whyItMatters: "Index funds are a common low-maintenance choice for beginners.",
          },
          {
            label: "Expense ratio",
            meaning: "The annual fund cost charged as a percentage of assets.",
            whyItMatters: "Higher costs can reduce your returns over time.",
          },
        ],
      },
      {
        kind: "visual",
        display: "metrics",
        kicker: "VISUAL",
        title: "One stock versus one broad fund.",
        caption:
          "A single stock may give you one company. A broad fund can spread you across many companies in one purchase.",
        data: [
          { label: "One stock", value: 18 },
          { label: "Sector fund", value: 48 },
          { label: "Broad index fund", value: 92 },
        ],
        note: "More diversification does not remove risk, but it can reduce dependence on one outcome.",
      },
      {
        kind: "example",
        kicker: "EXAMPLE",
        title: "Why funds feel different",
        scenario:
          "If one company has a rough quarter, a broad fund may hold up better because many other companies are inside it too. A single stock has nowhere to hide.",
        takeaway:
          "Diversification spreads your risk across more than one story.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Why investors use broad funds",
        prompt: "What is one reason many beginners start with a broad fund?",
        options: [
          { key: "A", text: "It can provide diversification in one investment." },
          { key: "B", text: "It guarantees gains." },
          { key: "C", text: "It has no fees at all." },
        ],
        correct: "A",
        correctMsg: "Correct. Broad funds are often used because they make diversification easier.",
        wrongMsg:
          "Not quite. The main beginner benefit is broad diversification, not guarantees.",
      },
      {
        kind: "snapshot",
        kicker: "TARGET DATE",
        title: "Some funds even adjust over time.",
        eyebrow: "Target date funds are designed to become more conservative as a goal date approaches.",
        bullets: [
          "They usually hold a mix of stock and bond funds.",
          "The mix changes over time as the target date gets closer.",
          "They are often used in retirement plans like 401(k)s.",
        ],
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Fees matter",
        prompt: "Why should beginners care about fund fees?",
        options: [
          { key: "A", text: "Because higher fees can reduce returns over time." },
          { key: "B", text: "Because fees only matter to traders." },
          { key: "C", text: "Because expensive funds are always better." },
        ],
        correct: "A",
        correctMsg: "Correct. Costs matter because they come out of what you keep.",
        wrongMsg:
          "Not quite. Even small ongoing fees can matter a lot over long periods.",
      },
      {
        kind: "win",
        kicker: "LESSON COMPLETE",
        title: "Lesson 5 complete.",
        body:
          "You now understand why ETFs, mutual funds, and index funds are often part of a simple diversified investing plan.",
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
        title: "When you need the money changes the whole plan.",
        body:
          "The same investment can feel reasonable for a 30-year goal and risky for a 2-year goal. Time horizon changes what kind of ups and downs you can handle.",
      },
      {
        kind: "terms",
        kicker: "TIME HORIZON",
        title: "What time horizon affects.",
        intro: "Time horizon influences both your risk level and your flexibility.",
        items: [
          {
            label: "Short horizon",
            meaning: "You may need the money soon.",
            whyItMatters: "Large market drops can hurt more when time is limited.",
          },
          {
            label: "Long horizon",
            meaning: "You have years or decades before using the money.",
            whyItMatters: "You may have more time to recover from market declines.",
          },
          {
            label: "Liquidity",
            meaning: "How easily you can access money when needed.",
            whyItMatters: "Shorter goals usually need more flexibility and stability.",
          },
          {
            label: "Compounding",
            meaning: "Growth earning more growth over time.",
            whyItMatters: "Longer horizons give compounding more time to work.",
          },
        ],
      },
      {
        kind: "visual",
        display: "line",
        kicker: "VISUAL",
        title: "Time gives growth more room to work.",
        caption:
          "A longer investing window can give your money more time to grow and recover through market ups and downs.",
        data: [
          { label: "1 yr", value: 18 },
          { label: "5 yr", value: 42 },
          { label: "10 yr", value: 67 },
          { label: "25 yr", value: 92 },
        ],
        note: "Longer time does not remove risk, but it can change how manageable that risk feels.",
      },
      {
        kind: "example",
        kicker: "EXAMPLE",
        title: "Two goals, two different plans.",
        scenario:
          "Saving for a car in two years is not the same as saving for retirement in forty years. The shorter goal usually needs more stability. The longer goal may allow for more growth-focused investing.",
        takeaway:
          "Your goal and your timeline belong in the same conversation.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Why time horizon matters",
        prompt: "Why might a long-term investor be able to take more risk than a short-term investor?",
        options: [
          { key: "A", text: "Because they may have more time to recover from drops." },
          { key: "B", text: "Because long-term investors cannot lose money." },
          { key: "C", text: "Because risk does not matter over time." },
        ],
        correct: "A",
        correctMsg: "Correct. More time can make temporary declines easier to absorb.",
        wrongMsg:
          "Not quite. The main reason is time to recover, not the disappearance of risk.",
      },
      {
        kind: "info",
        kicker: "MATCH THE MONEY",
        title: "Good investing often means matching the money to the goal.",
        body:
          "Money for near-term goals usually needs more stability. Money for far-off goals may be able to handle more volatility in exchange for growth potential.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Matching money to goals",
        prompt: "Which situation sounds most appropriate for a shorter time horizon?",
        options: [
          { key: "A", text: "Money needed for a down payment soon." },
          { key: "B", text: "Money for retirement decades away." },
          { key: "C", text: "Money you are comfortable not touching for a very long time." },
        ],
        correct: "A",
        correctMsg: "Correct. Near-term goals usually need a more careful approach to volatility.",
        wrongMsg:
          "Not quite. The shorter the timeline, the more stability often matters.",
      },
      {
        kind: "win",
        kicker: "LESSON COMPLETE",
        title: "Lesson 6 complete.",
        body:
          "You now understand that time horizon is one of the biggest drivers of what kind of investing plan makes sense.",
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
          "Investing is not only about returns. Taxes can affect how much of those returns you actually keep after selling investments or receiving distributions.",
      },
      {
        kind: "terms",
        kicker: "TAX BASICS",
        title: "The main tax words beginners should know.",
        intro: "You do not need to memorize tax law. You do need the basic shape of how it works.",
        items: [
          {
            label: "Taxable account",
            meaning: "A regular investment account that does not have special retirement tax treatment.",
            whyItMatters: "Selling investments or receiving income in the account can create taxes.",
          },
          {
            label: "Capital gain",
            meaning: "The profit when you sell an investment for more than you paid.",
            whyItMatters: "Gains may be taxed when they are realized.",
          },
          {
            label: "Short-term vs long-term",
            meaning: "How long you held the investment before selling.",
            whyItMatters: "Holding period can affect how gains are taxed.",
          },
          {
            label: "Dividend",
            meaning: "A cash payment some investments make to shareholders.",
            whyItMatters: "Dividend income can also have tax consequences.",
          },
        ],
      },
      {
        kind: "example",
        kicker: "EXAMPLE",
        title: "Selling can create taxes.",
        scenario:
          "If you buy an investment for one price and later sell it for more, you may owe taxes on the gain in a taxable account. If you sell for less, that may create a capital loss instead.",
        takeaway:
          "Taxes usually show up when gains or losses are realized, not just while a price is moving on paper.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Realized gains",
        prompt: "When does a capital gain usually become relevant for taxes in a taxable account?",
        options: [
          { key: "A", text: "When the investment is sold for more than its cost." },
          { key: "B", text: "Every time the price changes during the day." },
          { key: "C", text: "Only when the market closes higher." },
        ],
        correct: "A",
        correctMsg: "Correct. Taxes usually matter when gains are realized through a sale.",
        wrongMsg:
          "Not quite. A normal daily price move does not by itself mean you realized a taxable gain.",
      },
      {
        kind: "snapshot",
        kicker: "SIMPLE RULE",
        title: "Three tax reminders for beginners.",
        eyebrow: "These ideas are more important than memorizing every detail.",
        bullets: [
          "Selling can create taxable gains or losses.",
          "Holding period matters when gains are taxed.",
          "Account type matters because retirement accounts and taxable accounts work differently.",
        ],
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Why account type matters",
        prompt: "Why is it useful to know whether money is in a taxable account or a retirement account?",
        options: [
          { key: "A", text: "Because taxes can work differently depending on the account." },
          { key: "B", text: "Because only retirement accounts can go up in value." },
          { key: "C", text: "Because taxable accounts have no rules at all." },
        ],
        correct: "A",
        correctMsg: "Correct. Account type can change when and how taxes apply.",
        wrongMsg:
          "Not quite. A key beginner concept is that taxes differ across account types.",
      },
      {
        kind: "win",
        kicker: "LESSON COMPLETE",
        title: "Lesson 7 complete.",
        body:
          "You now understand the basic tax shape of investing: gains, dividends, holding period, and why account type matters.",
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
        title: "Retirement accounts are wrappers with different tax rules.",
        body:
          "A Roth IRA and a 401(k) are not investments by themselves. They are account types that can hold investments and come with special rules and tax treatment.",
      },
      {
        kind: "terms",
        kicker: "ACCOUNT BASICS",
        title: "The main retirement account ideas.",
        intro: "These are some of the first account types beginners hear about.",
        items: [
          {
            label: "401(k)",
            meaning: "A workplace retirement plan that lets employees contribute part of their wages.",
            whyItMatters: "It is one of the most common places people begin retirement saving.",
          },
          {
            label: "Employer match",
            meaning: "Money an employer may add when you contribute to a 401(k).",
            whyItMatters: "Many people see the match as one of the highest-priority retirement benefits to understand.",
          },
          {
            label: "Roth IRA",
            meaning: "An IRA with after-tax contributions and potential tax-free qualified withdrawals.",
            whyItMatters: "It is a common long-term retirement account for individuals.",
          },
          {
            label: "Traditional vs Roth",
            meaning: "Different timing for the tax benefit.",
            whyItMatters: "One broad beginner question is whether taxes help you more now or later.",
          },
        ],
      },
      {
        kind: "snapshot",
        kicker: "HOW PEOPLE USE THEM",
        title: "A simple beginner order of operations.",
        eyebrow: "People often learn these accounts as part of a broader retirement plan.",
        bullets: [
          "Understand whether your workplace offers a 401(k).",
          "Learn whether there is an employer match.",
          "Compare Roth and traditional features before deciding what fits you best.",
          "Remember that the account is only the wrapper. You still need to choose investments inside it.",
        ],
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Account wrapper",
        prompt: "What is the best way to think about a Roth IRA or 401(k)?",
        options: [
          { key: "A", text: "An account that can hold investments and has special rules." },
          { key: "B", text: "A guaranteed stock picker." },
          { key: "C", text: "A single investment that never changes." },
        ],
        correct: "A",
        correctMsg: "Correct. These are account types, not single investments.",
        wrongMsg:
          "Not quite. A retirement account is the container. You still choose what goes inside it.",
      },
      {
        kind: "info",
        kicker: "COMMON MISTAKE",
        title: "Opening the account is not the same as investing the money.",
        body:
          "One beginner mistake is putting money into a retirement account but forgetting to choose the investments inside it. The account and the investment choice are separate decisions.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "What happens after opening the account",
        prompt: "Why does it matter what you invest in inside a retirement account?",
        options: [
          { key: "A", text: "Because the account wrapper and the investments inside it are separate." },
          { key: "B", text: "Because retirement accounts invest themselves automatically in every case." },
          { key: "C", text: "Because the tax rules do not matter at all." },
        ],
        correct: "A",
        correctMsg: "Correct. Choosing the account and choosing the investments are different steps.",
        wrongMsg:
          "Not quite. A retirement account is not automatically the same as an investment strategy.",
      },
      {
        kind: "win",
        kicker: "LESSON COMPLETE",
        title: "Lesson 8 complete.",
        body:
          "You now understand the basic role of a Roth IRA and 401(k), and why the account type is only one part of the plan.",
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
          "A starter portfolio does not need to be complicated. It is simply your collection of investments and cash, organized in a way that fits your goals and risk level.",
      },
      {
        kind: "terms",
        kicker: "PORTFOLIO PIECES",
        title: "What can go into a simple portfolio.",
        intro: "These are common building blocks of a beginner-friendly setup.",
        items: [
          {
            label: "Stock fund",
            meaning: "A fund that gives exposure to stocks for growth potential.",
            whyItMatters: "Stocks often drive long-term growth.",
          },
          {
            label: "Bond fund",
            meaning: "A fund that holds bonds or other fixed-income securities.",
            whyItMatters: "Bonds can help balance risk and reduce volatility.",
          },
          {
            label: "Cash",
            meaning: "Money not currently invested in market assets.",
            whyItMatters: "Cash can help with near-term needs and flexibility.",
          },
          {
            label: "Allocation",
            meaning: "How you divide money among those pieces.",
            whyItMatters: "Your mix affects both risk and expected return.",
          },
        ],
      },
      {
        kind: "visual",
        display: "metrics",
        kicker: "VISUAL",
        title: "A simple mix can still be purposeful.",
        caption:
          "Different mixes can fit different people. The key is being able to explain why your portfolio is built the way it is.",
        data: [
          { label: "Growth", value: 76 },
          { label: "Stability", value: 52 },
          { label: "Flexibility", value: 40 },
        ],
        note: "There is not one perfect mix for everyone.",
      },
      {
        kind: "example",
        kicker: "EXAMPLE",
        title: "A simple portfolio can be enough.",
        scenario:
          "A beginner may use a broad stock fund for growth, some bonds or safer assets for balance, and enough cash for short-term needs. The point is fit, not complexity.",
        takeaway:
          "A portfolio should be understandable, not impressive-looking.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "What allocation means",
        prompt: "What is allocation in a portfolio?",
        options: [
          { key: "A", text: "How your money is divided among different investments." },
          { key: "B", text: "How often you check stock prices." },
          { key: "C", text: "How much money a company makes." },
        ],
        correct: "A",
        correctMsg: "Correct. Allocation is how your money is spread across your portfolio.",
        wrongMsg:
          "Not quite. Allocation means dividing money among different asset types or holdings.",
      },
      {
        kind: "info",
        kicker: "BEGINNER RULE",
        title: "If you cannot explain your portfolio, it may be too complicated.",
        body:
          "A good starter portfolio should be simple enough that you can explain what you own, why you own it, and what each part is supposed to do.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Starter portfolio mindset",
        prompt: "Which portfolio description sounds most beginner-friendly?",
        options: [
          { key: "A", text: "A simple mix you can explain and stick with." },
          { key: "B", text: "A collection of random trending investments." },
          { key: "C", text: "A strategy you do not understand but hope works." },
        ],
        correct: "A",
        correctMsg: "Correct. Simplicity and understanding are strengths, not weaknesses.",
        wrongMsg:
          "Not quite. A beginner portfolio should be explainable and manageable.",
      },
      {
        kind: "win",
        kicker: "LESSON COMPLETE",
        title: "Lesson 9 complete.",
        body:
          "You now understand what a starter portfolio is: a simple, explainable mix that fits your goals and your risk level.",
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
          "Many investing mistakes come from trying to react to every headline or price move. A steady process usually does more for long-term progress than bursts of excitement.",
      },
      {
        kind: "terms",
        kicker: "HABITS",
        title: "Habits that help people stay consistent.",
        intro: "These habits matter because investing is part knowledge and part behavior.",
        items: [
          {
            label: "Automation",
            meaning: "Setting contributions to happen on a schedule.",
            whyItMatters: "It makes progress less dependent on motivation.",
          },
          {
            label: "Review schedule",
            meaning: "Checking your plan on purpose instead of constantly.",
            whyItMatters: "It can reduce stress and overreacting.",
          },
          {
            label: "Rebalancing",
            meaning: "Adjusting your portfolio back toward its intended mix.",
            whyItMatters: "It helps your portfolio stay aligned with your plan.",
          },
          {
            label: "Noise filter",
            meaning: "A way of deciding which information deserves action.",
            whyItMatters: "Not every headline deserves a trade.",
          },
        ],
      },
      {
        kind: "example",
        kicker: "EXAMPLE",
        title: "The difference between a plan and a mood.",
        scenario:
          "A person with a plan keeps contributing, reviews monthly, and rebalances when needed. A person without a plan may buy on hype, panic on dips, and constantly change direction.",
        takeaway:
          "Consistency is mostly about reducing random behavior.",
      },
      {
        kind: "question",
        kicker: "QUIZ",
        title: "Why automation helps",
        prompt: "Why do many investors automate contributions?",
        options: [
          { key: "A", text: "Because it helps progress continue without constant decisions." },
          { key: "B", text: "Because automation removes all risk." },
          { key: "C", text: "Because automation guarantees market timing." },
        ],
        correct: "A",
        correctMsg: "Correct. Automation can make consistency easier.",
        wrongMsg:
          "Not quite. The main benefit is reducing friction and random decision-making.",
      },
      {
        kind: "snapshot",
        kicker: "STAYING STEADY",
        title: "A simple consistency checklist.",
        eyebrow: "These habits can keep a long-term plan from turning into headline-chasing.",
        bullets: [
          "Contribute on a schedule.",
          "Review on a schedule.",
          "Rebalance when needed instead of reacting daily.",
          "Ignore hype unless it changes your real plan.",
        ],
      },
      {
        kind: "question",
        kicker: "FINAL QUIZ",
        title: "Consistency mindset",
        prompt: "Which habit best supports long-term consistency?",
        options: [
          { key: "A", text: "Changing your portfolio every time the market feels scary." },
          { key: "B", text: "Following a repeatable plan and review schedule." },
          { key: "C", text: "Buying whatever is most exciting online." },
        ],
        correct: "B",
        correctMsg: "Correct. A repeatable process is one of the strongest consistency tools.",
        wrongMsg:
          "Not quite. Long-term consistency usually comes from process, not impulse.",
      },
      {
        kind: "win",
        kicker: "COURSE COMPLETE",
        title: "Lesson 10 complete.",
        body:
          "You now have the full beginner arc: foundations, market context, risk, strategy, diversification, time horizon, taxes, retirement accounts, portfolio building, and consistency.",
      },
    ],
  },
};
