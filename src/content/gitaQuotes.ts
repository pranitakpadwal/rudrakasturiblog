// Bhagavad Gita ideas, reframed for the corporate/work world — not
// verbatim scripture quotes, short reinterpretations for a rotating strip.
const GITA_QUOTES: string[] = [
  "You have a right to your effort, never to the outcome of your work. — do the work, let go of the metric.",
  "A mind that is even in success and failure is the one that lasts a career, not just a quarter.",
  "The wise do not grieve for what is lost, nor rejoice for what is gained — they just ship the next thing.",
  "Do your work without attachment to results, and you'll find the work itself gets better.",
  "Change is the only constant — the org chart, the market, the algorithm. Act anyway.",
  "He who sees inaction in action, and action in inaction, is wise among his peers.",
  "Set your heart upon your work, but never on its reward — burnout usually starts the other way round.",
  "Freedom is not doing whatever you want — it's not being enslaved by the outcome of what you do.",
  "The mind is restless and hard to tame — but it can be tamed, through practice and detachment. Same as any skill.",
  "Perform your duty equipoised, abandoning all attachment to success or failure — that equanimity is called yoga.",
  "One who is dissatisfied with achievement and unaffected by disappointment has steady wisdom.",
  "It is better to fail at your own work than to succeed at someone else's.",
];

export function gitaQuoteForIndex(i: number): string {
  return GITA_QUOTES[i % GITA_QUOTES.length];
}

export const GITA_QUOTE_COUNT = GITA_QUOTES.length;
