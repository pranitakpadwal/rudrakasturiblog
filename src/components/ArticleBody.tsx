import type { ContentItem } from "@/lib/content";
import { getRelatedPosts } from "@/lib/content";
import { autoLinkContent } from "@/lib/interlink";
import MarkdownContent from "@/components/MarkdownContent";
import ReadAlsoCard from "@/components/ReadAlsoCard";

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

const MIN_PARAGRAPHS_FOR_INSERT = 8;

export default function ArticleBody({ post }: { post: ContentItem }) {
  const linked = autoLinkContent(post.content_md, post.slug);
  const paragraphs = splitParagraphs(linked);

  if (paragraphs.length < MIN_PARAGRAPHS_FOR_INSERT) {
    return <MarkdownContent content={linked} />;
  }

  const related = getRelatedPosts(post, [], 2);
  if (related.length === 0) {
    return <MarkdownContent content={linked} />;
  }

  const insertPoints = related.map((_, i) =>
    Math.round(((i + 1) * paragraphs.length) / (related.length + 1))
  );

  const segments: string[] = [];
  let start = 0;
  for (const point of insertPoints) {
    segments.push(paragraphs.slice(start, point).join("\n\n"));
    start = point;
  }
  segments.push(paragraphs.slice(start).join("\n\n"));

  return (
    <>
      {segments.map((segment, i) => (
        <div key={i}>
          <MarkdownContent content={segment} />
          {related[i] && <ReadAlsoCard post={related[i]} />}
        </div>
      ))}
    </>
  );
}
