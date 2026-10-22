"use client";

import { useState, type FormEvent } from "react";

const socials = [
  {
    name: "Instagram",
    href: "https://instagram.com",
    path: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5.5-1.5h.01",
  },
  { name: "X", href: "https://x.com", path: "M4 4l16 16M20 4 4 20" },
  {
    name: "Pinterest",
    href: "https://pinterest.com",
    path: "M12 3a9 9 0 0 0-3.3 17.4c0-1 .1-2 .4-3l1.2-5s-.3-.6-.3-1.6c0-1.5.9-2.6 2-2.6.9 0 1.4.7 1.4 1.6 0 1-.6 2.4-1 3.7-.2 1.1.6 2 1.7 2 2 0 3.4-2.6 3.4-5.6 0-2.3-1.6-4-4.4-4a5 5 0 0 0-5.2 5c0 1 .3 1.6.7 2.1",
  },
  { name: "YouTube", href: "https://youtube.com", path: "M3 8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8Zm7 1v6l5-3-5-3Z" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="relative z-10 border-t border-white/10 bg-ink/95 px-6 pb-10 pt-24 backdrop-blur-xl md:px-[8vw]">
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="text-[11px] uppercase tracking-[0.4em] text-gold-soft/70">The Aurum Letter</p>
          <h3 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
            First access to <span className="italic gold-text">new arrivals</span>.
          </h3>
          <form onSubmit={onSubmit} className="mt-8 flex max-w-md items-center gap-3 border-b border-white/20 pb-3 focus-within:border-gold">
            <label htmlFor="newsletter" className="sr-only">Email address</label>
            <input
              id="newsletter"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none"
            />
            <button type="submit" className="shrink-0 text-[11px] uppercase tracking-[0.3em] text-gold-soft transition-colors hover:text-white">
              Subscribe
            </button>
          </form>
          <p className="mt-3 h-4 text-xs text-gold-soft/80" aria-live="polite">
            {subscribed ? "Thank you. You're on the list." : ""}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm text-white/60">
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-white/40">Maison</p>
            <ul className="space-y-2">
              <li><a href="#collection" className="hover:text-gold-soft">Collections</a></li>
              <li><a href="#top" className="hover:text-gold-soft">Ateliers</a></li>
              <li><a href="#top" className="hover:text-gold-soft">Boutiques</a></li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-white/40">Client care</p>
            <ul className="space-y-2">
              <li><a href="#top" className="hover:text-gold-soft">Contact</a></li>
              <li><a href="#top" className="hover:text-gold-soft">Shipping</a></li>
              <li><a href="#top" className="hover:text-gold-soft">Returns</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-20 flex max-w-6xl flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
        <p className="font-serif text-2xl tracking-[0.3em] gold-text">AURUM</p>
        <ul className="flex gap-4">
          {socials.map((s) => (
            <li key={s.name}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.name}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-gold hover:text-gold"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d={s.path} />
                </svg>
              </a>
            </li>
          ))}
        </ul>
        <p className="text-xs text-white/35">&copy; {new Date().getFullYear()} Aurum. All rights reserved.</p>
      </div>
    </footer>
  );
}
