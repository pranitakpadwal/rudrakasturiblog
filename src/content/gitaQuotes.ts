// Bhagavad Gita ideas, reframed for the corporate/work world. Not
// verbatim scripture quotes, short reinterpretations for a rotating strip.
// The actual teaching (Nishkama Karma) isn't "don't care about the
// outcome." It's "master the process so completely that the outcome
// stops being a source of anxiety." Metrics still matter; they're just
// not where your attention should live while you're doing the work.
const GITA_QUOTES: string[] = [
  "Master the process and the metric follows. Obsess over the number instead, and both suffer.",
  "A mind that stays steady in the win and the miss is the one that compounds over a career, not just a quarter.",
  "The target doesn't move because you stared at it harder. It moves because the work under it got better.",
  "Anxiety about the outcome is not the same as accountability for it. One sharpens you, the other clouds you.",
  "Change is the only constant: the org chart, the market, the algorithm. Build for that, not for this quarter.",
  "Knowing when to act and when to hold is worth more than acting constantly and calling it drive.",
  "Chase the reward too hard and you start optimizing for the applause, not the work that earns it.",
  "Freedom at work isn't doing whatever you want. It's not being ruled by every number that moves.",
  "A restless mind is not a focused one. Discipline is a skill, not a personality trait. It's trained.",
  "Equanimity in success and failure isn't detachment from results. It's what lets you read them clearly.",
  "The professional who's neither inflated by a win nor wrecked by a loss is the one still standing in year ten.",
  "Better to do your own work well than someone else's job perfectly. Competence borrowed doesn't compound.",
];

export function gitaQuoteForIndex(i: number): string {
  return GITA_QUOTES[i % GITA_QUOTES.length];
}

export const GITA_QUOTE_COUNT = GITA_QUOTES.length;
