export const QUESTIONS = [
  "Who are your competitors?",
  "What is your product?",
  "What is your business model?",
  "What do customers say about your product?",
  "Who uses your product?",
  "What do customers use your product for?",
  "How do you get to $100 million in ARR?",
  "How do you differentiate from the incumbents? (OpenAI, Microsoft, HuggingFace, Co-pilot)",
  "How do you know people want this?",
  "How did your team get together?",
  "What is your unfair advantage?",
  "What do you understand about your business that others don't?",
  "What do you understand about your users?",
  "Why will you succeed?",
  "Why did you pick this idea to work on?",
  "What is the next step with the product evolution?",
  "Who needs what you're making?",
  "How do we know your team will stick together?",
  "What has surprised you about user behaviour?",
  "What is your distribution strategy?",
  "How will you get users?",
  "What problems/hurdles are you anticipating?",
  "Who would you hire or how would you add to your team?",
  "What domain expertise do you have?",
  "How will customers and/or users find out about you?",
  "Who are your competitors?",
  "What are the top things users want?",
  "Where else can the company grow into into?",
  "What's new about what you make?",
  "How did your team meet?",
  "What will you do if we don't fund you?",
  "Who might become competitors?",
  "Why did you choose this idea?",
  "What is your burn rate?",
  "Why will you succeed?",
  "How many users are paying?",
  "How does your product work in more detail?",
  "How are you meeting customers?",
  "What, exactly, makes you different from existing options?",
  "How long can you go before funding?",
  "How big an opportunity is there?",
  "What metrics do you track daily, weekly, and monthly?",
  "Have there been any substantial pivots in your business strategy? If so, why?",
  "How do you handle internal conflicts within the team?",
  "Describe your ideal customer.",
  "How do you handle the potential misuse of your AI technology?",
  "What keeps you up at night regarding your business?",
  "What’s the equity split among the founders? How did you decide on that split?",
  "If there were one area where you could use external help or expertise, what would it be?",
];

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = array.slice(); // Make a shallow copy to avoid modifying the original array

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }

    return shuffled;
}

export const getQuestions = () => shuffleArray(QUESTIONS);