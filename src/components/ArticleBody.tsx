import type { ContentItem } from "@/lib/content";
import { getRelatedPosts, getArticleSummary } from "@/lib/content";
import { autoLinkContent } from "@/lib/interlink";
import MarkdownContent from "@/components/MarkdownContent";
import ReadAlsoCard from "@/components/ReadAlsoCard";
import PullQuote from "@/components/PullQuote";

// Splits on blank-line paragraph boundaries, but keeps fenced code blocks
// intact even if they contain blank lines.
function splitParagraphs(markdown: string): string[] {
  const lines = markdown.split("\n");
  const blocks: string[] = [];
  let current: string[] = [];
  let inFence = false;

  for (const line of lines) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    if (!inFence && line.trim() === "") {
      if (current.length) {
        blocks.push(current.join("\n"));
        current = [];
      }
    } else {
      current.push(line);
    }
  }
  if (current.length) blocks.push(current.join("\n"));
  return blocks;
}

function firstSentence(text: string): string {
  const match = text.match(/^.*?[.!?](?=\s|$)/);
  return (match ? match[0] : text).trim();
}

const MIN_PARAGRAPHS_FOR_INSERT = 8;

type Marker = { at: number; render: () => React.ReactNode };

export default function ArticleBody({ post }: { post: ContentItem }) {
  const linked = autoLinkContent(post.content_md, post.slug);
  const paragraphs = splitParagraphs(linked);

  if (paragraphs.length < MIN_PARAGRAPHS_FOR_INSERT) {
    return <MarkdownContent content={linked} />;
  }

  const related = getRelatedPosts(post, [], 2);
  const summary = getArticleSummary(post.slug);

  const markers: Marker[] = [];

  if (summary) {
    const quote = firstSentence(summary);
    // Roughly a third of the way in: far enough that the reader has
    // committed, early enough to still be a hook forward.
    const at = Math.max(1, Math.round(paragraphs.length * 0.32));
    markers.push({ at, render: () => <PullQuote text={quote} /> });
  }

  related.forEach((relatedPost, i) => {
    const at = Math.round(((i + 1) * paragraphs.length) / (related.length + 2)) + 2;
    markers.push({
      at: Math.min(at, paragraphs.length - 1),
      render: () => <ReadAlsoCard post={relatedPost} />,
    });
  });

  if (markers.length === 0) {
    return <MarkdownContent content={linked} />;
  }

  markers.sort((a, b) => a.at - b.at);

  const segments: { text: string; after?: () => React.ReactNode }[] = [];
  let start = 0;
  for (const marker of markers) {
    const at = Math.max(start + 1, Math.min(marker.at, paragraphs.length));
    segments.push({ text: paragraphs.slice(start, at).join("\n\n"), after: marker.render });
    start = at;
  }
  if (start < paragraphs.length) {
    segments.push({ text: paragraphs.slice(start).join("\n\n") });
  }

  return (
    <>
      {segments.map((segment, i) => (
        <div key={i}>
          <MarkdownContent content={segment.text} />
          {segment.after?.()}
        </div>
      ))}
    </>
  );
}
