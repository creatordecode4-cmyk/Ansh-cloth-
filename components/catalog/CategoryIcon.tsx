import type { IconName } from "@/lib/catalog/types";

const PATHS: Record<IconName, string> = {
  watch: "M9 3h6l1 4M9 3 8 7m1 14h6l1-4M9 21l-1-4M12 9v3l2 1.5M17.5 12a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z",
  tshirt: "M9 3c.6 1.4 1.7 2 3 2s2.4-.6 3-2l5 2.5-1.8 4-2.2-1V21H8V8.5l-2.2 1L4 5.5 9 3Z",
  pants: "M7 3h10l1 18h-4.5L12 9l-1.5 12H6L7 3Zm0 3h10M12 3v6",
  perfume: "M10 2.5h4V6h-4zM9 6h6l1 3H8l1-3Zm-2 3h10a1 1 0 0 1 1 1v9.5a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V10a1 1 0 0 1 1-1Zm5 5.5v3",
  jacket: "M9 3 6 4.5 4 8l-.5 12H7l.5-8V21h9v-9l.5 8h3.5L20 8l-2-3.5L15 3l-3 5-3-5Zm3 5v13",
  belt: "M3 10h18v4H3zM8 9h5v6H8zM10 12h3M17 12h.01M19.5 12h.01",
  shoe: "M3 17v-6.5c0-.8.7-1.5 1.5-1.5H7l1.5 2.5L12 13l6.5 1.2c1.5.3 2.5 1.5 2.5 3V17H3Zm0 0v2h18v-2M9 11.5l1-1.5M11 12.5l1-1.5",
  bag: "M5 8h14l-1 13H6L5 8Zm4 0V6.5a3 3 0 0 1 6 0V8",
  wallet: "M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Zm0 0 11-3.5V7M16 13.5h.01M20 11h-4a2 2 0 0 0 0 4h4",
  sunglasses: "M2 9h20M3.5 9l.8 5a2.5 2.5 0 0 0 2.5 2h1.4a2.5 2.5 0 0 0 2.4-1.8L11 12h2l.4 2.2a2.5 2.5 0 0 0 2.4 1.8h1.4a2.5 2.5 0 0 0 2.5-2l.8-5",
  cap: "M3 15.5c0-4.7 3.6-8.5 8-8.5s8 3.8 8 8.5M3 15.5h12.5l5 1.5c.3.1.5.4.4.7-.1.2-.3.3-.5.3H3v-2.5ZM11 7V5.5",
  accessories: "M12 3 4 9l8 12 8-12-8-6Zm-8 6h16M9 9l3 12 3-12M8 3.8 9 9m7-5.2L15 9",
};

export default function CategoryIcon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={PATHS[name]} />
    </svg>
  );
}
