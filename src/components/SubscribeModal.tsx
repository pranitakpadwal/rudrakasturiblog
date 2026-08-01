"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "rk-subscribe-dismissed";

export default function SubscribeModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY)) return;

    // Re-check on fire, not just at effect setup: the user may have
    // already subscribed or closed the modal (setting the dismiss flag)
    // between when this timer/listener was scheduled and when it fires.
    const timer = setTimeout(() => {
      if (!sessionStorage.getItem(DISMISS_KEY)) setOpen(true);
    }, 15000);

    const onScroll = () => {
      if (sessionStorage.getItem(DISMISS_KEY)) {
        window.removeEventListener("scroll", onScroll);
        return;
      }
      if (window.scrollY > document.body.scrollHeight * 0.4) {
        setOpen(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  function close() {
    setOpen(false);
    sessionStorage.setItem(DISMISS_KEY, "1");
  }

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
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      setErrorMessage("Something went wrong: try again.");
      setStatus("error");
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Subscribe to Rudra Kasturi"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-line bg-paper p-7 shadow-xl"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="float-right -mt-2 -mr-2 text-lg text-ink-soft hover:text-ink"
        >
          ×
        </button>

        {status === "done" ? (
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">You&apos;re in.</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Check your inbox for a confirmation: new posts will land there as they go up.
            </p>
          </div>
        ) : (
          <>
            <h2 className="font-display text-xl font-semibold text-ink">
              Discover more from Rudra Kasturi
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              Subscribe to get new posts on SEO, AEO, and AI search sent to your inbox.
            </p>
            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2.5">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="rounded-lg border border-line px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-paper transition hover:bg-accent disabled:opacity-60"
              >
                {status === "loading" ? "Subscribing…" : "Subscribe"}
              </button>
              {status === "error" && <p className="text-xs text-accent">{errorMessage}</p>}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
