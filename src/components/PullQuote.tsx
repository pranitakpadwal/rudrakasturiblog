export default function PullQuote({ text }: { text: string }) {
  return (
    <div className="not-prose my-10 border-l-4 border-ink pl-6 sm:pl-8">
      <p className="font-display text-2xl font-semibold leading-[1.15] tracking-tight text-ink sm:text-3xl">
        {text}
      </p>
    </div>
  );
}
