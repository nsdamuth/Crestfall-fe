"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export default function LoginPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    setIsSubmitting(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for the login link.");
    }

    setIsSubmitting(false);
  }
    async function handleGoogleLogin() {
    setIsSubmitting(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
        redirectTo: `${siteUrl}/auth/callback`,
        },
    });

    if (error) {
        setMessage(error.message);
        setIsSubmitting(false);
    }
    }
  return (
    <main className="min-h-screen px-6 py-20 text-[var(--foreground)] sm:px-10 lg:px-16">
      <section className="mx-auto max-w-xl rounded-2xl border border-[var(--muted-gold)]/25 bg-black/45 p-8 shadow-2xl backdrop-blur-md">
       <div className="flex items-start justify-between">
        <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted-gold)]">
            Crestfall Studio
            </p>

            <h1 className="mt-4 font-display text-4xl text-[var(--foreground)]">
            Sign in
            </h1>
        </div>

        <Link
            href="/"
            className="
            flex h-10 w-10 items-center justify-center
            rounded-full
            border border-[var(--muted-gold)]/20
            bg-black/40
            text-[var(--muted-gold)]
            transition-all duration-300
            hover:border-[var(--muted-gold)]/60
            hover:bg-[var(--muted-gold)]/12
            hover:text-[var(--foreground)]
            "
            aria-label="Close"
        >
            ✕
        </Link>
        </div>
        <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isSubmitting}
        className="mt-8 w-full rounded-xl border border-[var(--muted-gold)]/40 bg-black/45 px-4 py-3 text-[var(--foreground)] transition hover:bg-[var(--muted-gold)]/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
        Continue with Google
        </button>

        <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-[var(--muted-gold)]/20" />
        <span className="text-xs uppercase tracking-[0.25em] text-[var(--foreground)]/45">
            or
        </span>
        <div className="h-px flex-1 bg-[var(--muted-gold)]/20" />
        </div>
        <p className="mt-4 text-[var(--foreground)]/75">
          Enter your email to receive a secure magic login link.
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-sm text-[var(--foreground)]/70">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[var(--muted-gold)]/25 bg-black/60 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]/70"
              placeholder="you@example.com"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl border border-[var(--muted-gold)]/40 bg-[var(--muted-gold)]/20 px-4 py-3 text-[var(--foreground)] transition hover:bg-[var(--muted-gold)]/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Send login link"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-[var(--foreground)]/75">{message}</p>
        )}
      </section>
    </main>
  );
}