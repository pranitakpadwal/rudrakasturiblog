"use client";

import { useState } from "react";

export default function NewsletterBox() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErrorMessage(data?.error || "Something went wrong: try again.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setErrorMessage("Something went wrong: try again.");
      setStatus("error");
    }
  }

  return (
    <div className="rounded-xl border border-line bg-paper p-5">
      <h3 className="font-display text-base font-semibold text-ink">Get new posts by email</h3>
      {status === "done" ? (
        <p className="mt-2 text-sm text-ink-soft">You&apos;re in: check your inbox.</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="rounded-lg border border-line px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-paper transition hover:bg-accent disabled:opacity-60"
          >
            {status === "loading" ? "Subscribing…" : "Subscribe"}
          </button>
          {status === "error" && <p className="text-xs text-accent">{errorMessage}</p>}
        </form>
      )}
    </div>
  );
}
