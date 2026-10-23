import { useId, type ReactNode } from "react";
import type { ArtName } from "@/lib/catalog/types";

/*
 * Recolourable vector product illustrations (400x500 viewBox, 4:5 like the
 * studio renders). They stand in for product photography in categories that
 * have no 3D model or photo yet — swap ProductImage to a real photo per
 * product when you have one.
 */

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (c: number[]) => "#" + c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
/** Mix towards white (amt > 0) or black (amt < 0). */
const shade = (h: string, amt: number) => {
  const c = hex(h);
  return toHex(c.map((v) => (amt >= 0 ? v + (255 - v) * amt : v * (1 + amt))));
};
const luminance = (h: string) => {
  const [r, g, b] = hex(h);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};

type P = { color: string; accent?: string; id: string };

function Defs({ id, color }: { id: string; color: string }) {
  const dark = luminance(color) < 0.25;
  return (
    <defs>
      {/* Left-lit body shading */}
      <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="0.35">
        <stop offset="0" stopColor={shade(color, dark ? 0.22 : 0.18)} />
        <stop offset="0.55" stopColor={color} />
        <stop offset="1" stopColor={shade(color, dark ? -0.35 : -0.2)} />
      </linearGradient>
      <linearGradient id={`${id}-v`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={shade(color, dark ? 0.18 : 0.12)} />
        <stop offset="1" stopColor={shade(color, dark ? -0.3 : -0.18)} />
      </linearGradient>
      <radialGradient id={`${id}-shadow`}>
        <stop offset="0" stopColor="#544E68" stopOpacity="0.38" />
        <stop offset="0.5" stopColor="#544E68" stopOpacity="0.15" />
        <stop offset="1" stopColor="#544E68" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#F2F3F5" />
        <stop offset="0.5" stopColor="#B9BDC4" />
        <stop offset="1" stopColor="#7C8089" />
      </linearGradient>
    </defs>
  );
}

const stitch = (color: string) => ({
  fill: "none",
  stroke: shade(color, luminance(color) < 0.3 ? 0.35 : -0.25),
  strokeWidth: 1.6,
  strokeDasharray: "5 4",
  strokeLinecap: "round" as const,
  opacity: 0.8,
});
const edge = (color: string) => ({ stroke: shade(color, -0.4), strokeWidth: 1.5, strokeLinejoin: "round" as const });

const Shadow = ({ id, cx = 200, cy = 440, rx = 140, ry = 22 }: { id: string; cx?: number; cy?: number; rx?: number; ry?: number }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${id}-shadow)`} />
);

/* ---------- Tops ---------- */

const TEE = "M165,112 C180,126 220,126 235,112 L290,128 L350,186 L316,224 L290,203 L292,402 C240,412 160,412 108,402 L110,203 L84,224 L50,186 L110,128 Z";

function Tee({ color, id, neck }: P & { neck: "crew" | "v" | "polo" }) {
  return (
    <>
      <Shadow id={id} cy={432} rx={150} />
      <path d={TEE} fill={`url(#${id}-body)`} {...edge(color)} />
      {/* Folds */}
      <path d="M140,230 C150,300 145,350 150,395 M258,240 C252,300 262,350 255,398" fill="none" stroke={shade(color, -0.25)} strokeWidth="2" opacity="0.25" />
      <path d="M86,214 L114,190 M314,214 L286,190" {...stitch(color)} />
      <path d="M112,392 C160,401 240,401 288,392" {...stitch(color)} />
      {neck === "crew" && <path d="M165,112 C180,134 220,134 235,112" fill="none" stroke={shade(color, -0.3)} strokeWidth="7" strokeLinecap="round" />}
      {neck === "v" && (
        <>
          <path d="M163,112 L200,168 L237,112" fill={shade(color, -0.45)} stroke={shade(color, -0.3)} strokeWidth="6" strokeLinejoin="round" />
        </>
      )}
      {neck === "polo" && (
        <>
          <path d="M165,112 C180,126 220,126 235,112 L240,116 L206,150 L200,128 L194,150 L160,116 Z" fill={shade(color, -0.18)} {...edge(color)} />
          <rect x="190" y="128" width="20" height="62" rx="3" fill={shade(color, -0.08)} {...edge(color)} />
          <circle cx="200" cy="148" r="3.2" fill={shade(color, 0.5)} />
          <circle cx="200" cy="172" r="3.2" fill={shade(color, 0.5)} />
        </>
      )}
    </>
  );
}

/* ---------- Trousers ---------- */

function Pants({ color, accent = "#C9A55A", id }: P) {
  const crease = shade(color, -0.22);
  return (
    <>
      <Shadow id={id} cy={452} rx={120} ry={18} />
      {/* Legs */}
      <path d="M128,118 L272,118 L284,430 L216,434 L200,196 L184,434 L116,430 Z" fill={`url(#${id}-body)`} {...edge(color)} />
      {/* Waistband with belt loops */}
      <rect x="126" y="92" width="148" height="28" rx="4" fill={shade(color, -0.08)} {...edge(color)} />
      {[140, 176, 224, 260].map((x) => (
        <rect key={x} x={x} y="88" width="8" height="34" rx="2" fill={shade(color, -0.15)} {...edge(color)} />
      ))}
      <circle cx="200" cy="106" r="4" fill={accent} />
      {/* Fly, pockets, creases */}
      <path d="M200,120 L200,190 C200,198 194,204 186,206" fill="none" stroke={crease} strokeWidth="2" />
      <path d="M136,124 C150,150 160,156 172,158 M264,124 C250,150 240,156 228,158" fill="none" stroke={crease} strokeWidth="2.2" />
      <path d="M160,200 L150,426 M240,200 L250,426" stroke={crease} strokeWidth="1.6" opacity="0.55" />
      <path d="M118,420 L182,423 M218,423 L282,420" {...stitch(color)} />
    </>
  );
}

/* ---------- Outerwear ---------- */

const COAT = (hem: number) =>
  `M168,104 L128,118 C104,128 94,152 88,192 L62,${hem - 30} L96,${hem - 22} L113,222 L110,${hem} L290,${hem} L287,222 L304,${hem - 22} L338,${hem - 30} L312,192 C306,152 296,128 272,118 L232,104 Z`;

function Biker({ color, accent = "#C9CCD1", id }: P) {
  return (
    <>
      <Shadow id={id} cy={440} rx={150} />
      <path d={COAT(408)} fill={`url(#${id}-body)`} {...edge(color)} />
      {/* Lapels */}
      <path d="M168,104 L150,170 L186,206 L196,140 Z" fill={shade(color, 0.08)} {...edge(color)} />
      <path d="M232,104 L262,178 L226,232 L214,150 Z" fill={shade(color, -0.12)} {...edge(color)} />
      {/* Asymmetric zip */}
      <path d="M226,232 L208,300 L208,404" fill="none" stroke={`url(#${id}-metal)`} strokeWidth="4" />
      <path d="M226,232 L208,300 L208,404" fill="none" stroke={accent} strokeWidth="1.2" strokeDasharray="2 3" />
      {/* Pocket zips + belt */}
      <path d="M130,300 L150,330 M248,290 L276,262" stroke={`url(#${id}-metal)`} strokeWidth="3.5" strokeLinecap="round" />
      <rect x="110" y="378" width="180" height="20" fill={shade(color, -0.1)} {...edge(color)} />
      <rect x="150" y="374" width="24" height="28" rx="3" fill="none" stroke={`url(#${id}-metal)`} strokeWidth="4" />
      <circle cx="146" cy="118" r="3.5" fill={accent} />
      <circle cx="254" cy="118" r="3.5" fill={accent} />
    </>
  );
}

function Bomber({ color, accent = "#C9CCD1", id }: P) {
  const rib = shade(color, -0.22);
  return (
    <>
      <Shadow id={id} cy={438} rx={150} />
      <path d={COAT(392)} fill={`url(#${id}-body)`} {...edge(color)} />
      <path d="M168,104 C182,124 218,124 232,104 L236,112 C220,136 180,136 164,112 Z" fill={rib} {...edge(color)} />
      <rect x="110" y="372" width="180" height="24" rx="4" fill={rib} {...edge(color)} />
      <path d="M62,362 L96,370 L95,384 L60,376 Z M338,362 L304,370 L305,384 L340,376 Z" fill={rib} />
      <path d="M200,122 L200,396" stroke={`url(#${id}-metal)`} strokeWidth="4" />
      <path d="M200,122 L200,396" stroke={accent} strokeWidth="1" strokeDasharray="2 3" />
      <path d="M120,372 v24 M134,372 v24 M148,372 v24 M162,372 v24 M176,372 v24 M224,372 v24 M238,372 v24 M252,372 v24 M266,372 v24 M280,372 v24" stroke={shade(color, -0.4)} strokeWidth="1" opacity="0.5" />
      <path d="M128,270 C140,262 160,262 172,270 M228,270 C240,262 260,262 272,270" fill="none" stroke={shade(color, -0.35)} strokeWidth="3" strokeLinecap="round" />
      <rect x="296" y="200" width="22" height="30" rx="3" fill={shade(color, -0.08)} {...edge(color)} transform="rotate(8 307 215)" />
    </>
  );
}

function Overcoat({ color, accent = "#C9CCD1", id }: P) {
  return (
    <>
      <Shadow id={id} cy={458} rx={150} />
      <path d={COAT(438)} fill={`url(#${id}-body)`} {...edge(color)} />
      <path d="M168,104 L142,182 L176,214 L162,226 L200,300 L198,150 Z" fill={shade(color, 0.07)} {...edge(color)} />
      <path d="M232,104 L258,182 L224,214 L238,226 L200,300 L202,150 Z" fill={shade(color, -0.1)} {...edge(color)} />
      <path d="M200,300 L200,438" stroke={shade(color, -0.4)} strokeWidth="1.5" />
      {[318, 368].map((y) => (
        <g key={y} fill={shade(accent, -0.2)}>
          <circle cx="178" cy={y} r="5" />
          <circle cx="222" cy={y} r="5" />
        </g>
      ))}
      <path d="M126,340 L162,336 M238,336 L274,340" stroke={shade(color, -0.35)} strokeWidth="3" strokeLinecap="round" />
      <path d="M66,380 L94,388 M306,388 L334,380" {...stitch(color)} />
    </>
  );
}

/* ---------- Leather goods ---------- */

function Belt({ color, accent = "#C9CCD1", id }: P) {
  const metal = accent === "#C9CCD1" ? `url(#${id}-metal)` : accent;
  return (
    <>
      <Shadow id={id} cy={372} rx={170} ry={30} />
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <ellipse cx="200" cy={300 - k * 16} rx={150 - k * 26} ry={70 - k * 13} fill="none" stroke={shade(color, -0.35)} strokeWidth="30" />
          <ellipse cx="200" cy={296 - k * 16} rx={150 - k * 26} ry={70 - k * 13} fill="none" stroke={`url(#${id}-v)`} strokeWidth="26" />
          <ellipse cx="200" cy={296 - k * 16} rx={150 - k * 26} ry={70 - k * 13} {...stitch(color)} strokeDasharray="3 4" />
        </g>
      ))}
      {/* Buckle on the front of the outer coil */}
      <rect x="164" y="338" width="72" height="48" rx="6" fill="none" stroke={shade(accent, -0.35)} strokeWidth="11" />
      <rect x="164" y="338" width="72" height="48" rx="6" fill="none" stroke={metal} strokeWidth="8" />
      <rect x="182" y="356" width="34" height="10" rx="3" fill={metal} />
    </>
  );
}

function Bifold({ color, accent = "#E9DFC9", id }: P) {
  return (
    <>
      <Shadow id={id} cy={372} rx={150} ry={24} />
      <rect x="88" y="188" width="224" height="168" rx="16" fill={shade(color, -0.35)} transform="translate(4 6)" />
      <rect x="88" y="188" width="224" height="168" rx="16" fill={`url(#${id}-body)`} {...edge(color)} />
      <rect x="100" y="200" width="200" height="144" rx="10" {...stitch(color)} />
      <path d="M88,212 C120,206 280,206 312,212" fill="none" stroke={shade(color, 0.2)} strokeWidth="2" opacity="0.5" />
      <text x="200" y="285" textAnchor="middle" fontFamily="Georgia, serif" fontSize="30" letterSpacing="6" fill={shade(color, -0.28)} opacity="0.9">
        A
      </text>
      <rect x="282" y="196" width="22" height="6" rx="3" fill={accent} opacity="0.6" />
    </>
  );
}

function Cardholder({ color, accent = "#E9DFC9", id }: P) {
  return (
    <>
      <Shadow id={id} cy={372} rx={130} ry={22} />
      {/* Card peeking out */}
      <rect x="140" y="170" width="132" height="84" rx="8" fill={accent} stroke={shade(accent, -0.3)} strokeWidth="1.5" transform="rotate(-6 206 212)" />
      <rect x="112" y="204" width="176" height="148" rx="14" fill={`url(#${id}-body)`} {...edge(color)} />
      <path d="M112,236 C150,256 250,256 288,236" fill="none" stroke={shade(color, -0.35)} strokeWidth="2.5" />
      <path d="M112,276 C150,294 250,294 288,276" fill="none" stroke={shade(color, -0.35)} strokeWidth="2.5" />
      <rect x="122" y="214" width="156" height="128" rx="9" {...stitch(color)} />
    </>
  );
}

/* ---------- Eyewear ---------- */

function Sunglasses({ color, accent = "#2F3B33", id, shape }: P & { shape: "aviator" | "wayfarer" | "round" }) {
  const lens = (
    <linearGradient id={`${id}-lens`} x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stopColor={shade(accent, -0.35)} />
      <stop offset="0.6" stopColor={accent} />
      <stop offset="1" stopColor={shade(accent, 0.35)} />
    </linearGradient>
  );
  const frame = shape === "aviator" ? 4 : shape === "round" ? 5 : 14;
  const L =
    shape === "aviator"
      ? "M88,222 C88,206 104,200 128,200 L176,200 C186,200 190,208 188,222 C182,262 164,296 132,296 C100,296 88,264 88,222 Z"
      : shape === "wayfarer"
        ? "M82,206 L184,202 C190,202 192,208 190,216 L178,272 C176,282 168,288 158,288 L110,288 C98,288 92,282 90,272 Z"
        : "M136,200 a48,48 0 1,0 0.1,0 Z";
  const R = `scale(-1 1) translate(-400 0)`;
  return (
    <>
      <defs>{lens}</defs>
      <Shadow id={id} cy={360} rx={150} ry={18} />
      {/* Temples receding behind */}
      <path d="M86,214 L58,198 M314,214 L342,198" stroke={shade(color, -0.25)} strokeWidth="7" strokeLinecap="round" />
      <path d={shape === "wayfarer" ? "M188,212 C196,204 204,204 212,212" : "M186,214 C194,206 206,206 214,214"} fill="none" stroke={color} strokeWidth={shape === "wayfarer" ? 12 : 5} />
      {shape === "aviator" && <path d="M120,200 C160,192 240,192 280,200" fill="none" stroke={color} strokeWidth="4" />}
      {[undefined, R].map((t, k) => (
        <g key={k} transform={t}>
          <path d={L} fill={`url(#${id}-lens)`} stroke={color} strokeWidth={frame} strokeLinejoin="round" />
          <path d={shape === "round" ? "M110,226 C116,214 126,208 138,206" : "M106,224 C112,214 124,210 140,210"} fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.35" />
        </g>
      ))}
    </>
  );
}

/* ---------- Headwear ---------- */

function Baseball({ color, accent = "#E9DFC9", id }: P) {
  return (
    <>
      <Shadow id={id} cy={372} rx={160} ry={24} />
      <path d="M248,318 C300,312 352,322 360,338 C366,352 320,360 262,350 Z" fill={shade(color, -0.25)} {...edge(color)} />
      <path d="M86,322 C80,232 132,170 206,168 C276,166 316,226 312,318 C250,330 150,332 86,322 Z" fill={`url(#${id}-body)`} {...edge(color)} />
      <path d="M206,168 C188,220 182,270 186,326 M206,168 C238,214 262,262 268,320 M206,168 C150,200 116,250 112,318" fill="none" stroke={shade(color, -0.3)} strokeWidth="2" opacity="0.7" />
      <path d="M88,312 C150,322 250,320 310,308" {...stitch(color)} />
      <circle cx="206" cy="168" r="8" fill={shade(color, -0.15)} {...edge(color)} />
      <text x="150" y="268" fontFamily="Georgia, serif" fontSize="34" fill={accent} opacity="0.9">
        A
      </text>
    </>
  );
}

function Bucket({ color, id }: P) {
  return (
    <>
      <Shadow id={id} cy={378} rx={170} ry={26} />
      <path d="M58,320 C58,292 342,292 342,320 C342,352 58,352 58,320 Z" fill={shade(color, -0.2)} {...edge(color)} />
      <path d="M72,322 C80,306 320,306 328,322" {...stitch(color)} />
      <path d="M92,322 C96,330 304,330 308,322" {...stitch(color)} />
      <path d="M118,316 L130,206 C134,180 266,180 270,206 L282,316 C240,328 160,328 118,316 Z" fill={`url(#${id}-body)`} {...edge(color)} />
      <path d="M130,206 C134,222 266,222 270,206" fill="none" stroke={shade(color, -0.3)} strokeWidth="2" />
      <path d="M124,286 C170,296 230,296 276,286" {...stitch(color)} />
    </>
  );
}

/* ---------- Watch / shoes ---------- */

function DigitalWatch({ color, accent = "#9FD3C7", id }: P) {
  return (
    <>
      <Shadow id={id} cy={448} rx={110} ry={18} />
      <path d="M160,92 L240,92 L246,206 L154,206 Z" fill={`url(#${id}-v)`} {...edge(color)} />
      <path d="M154,296 L246,296 L240,418 L160,418 Z" fill={`url(#${id}-v)`} {...edge(color)} />
      {[330, 356, 382].map((y) => (
        <ellipse key={y} cx="200" cy={y} rx="5" ry="3.5" fill={shade(color, -0.5)} />
      ))}
      <rect x="136" y="188" width="128" height="128" rx="30" fill={shade(color, -0.3)} />
      <rect x="132" y="184" width="128" height="128" rx="30" fill={`url(#${id}-body)`} {...edge(color)} />
      <rect x="150" y="204" width="92" height="88" rx="16" fill="#14171C" />
      <text x="196" y="258" textAnchor="middle" fontFamily="ui-monospace, Menlo, monospace" fontSize="30" fontWeight="600" fill={accent}>
        10:08
      </text>
      <text x="196" y="278" textAnchor="middle" fontFamily="ui-monospace, Menlo, monospace" fontSize="10" fill={accent} opacity="0.7">
        MON 21
      </text>
      <rect x="258" y="218" width="8" height="18" rx="3" fill={shade(color, -0.2)} />
      <rect x="258" y="258" width="8" height="18" rx="3" fill={shade(color, -0.2)} />
    </>
  );
}

function Oxford({ color, accent = "#F4F1EA", id }: P) {
  return (
    <>
      <Shadow id={id} cy={352} rx={175} ry={22} />
      <path d="M52,318 L52,262 C52,232 74,214 100,212 L140,210 C170,232 220,248 268,256 C320,264 356,282 356,312 L356,322 Z" fill={`url(#${id}-body)`} {...edge(color)} />
      <path d="M50,320 L358,320 C360,332 352,338 340,338 L60,338 C52,338 48,330 50,320 Z" fill={shade(color, -0.55)} />
      <path d="M52,322 L112,322 L112,342 L54,342 Z" fill={shade(color, -0.6)} />
      <path d="M140,210 C160,236 186,250 214,256 L226,236 C196,226 168,212 150,196 Z" fill={shade(color, -0.12)} {...edge(color)} />
      <path d="M162,220 L196,214 M172,232 L206,226 M184,242 L214,236" stroke={accent} strokeWidth="3" strokeLinecap="round" />
      <path d="M268,256 C300,262 330,276 340,300" fill="none" stroke={shade(color, -0.35)} strokeWidth="2" />
      {Array.from({ length: 7 }, (_, k) => (
        <circle key={k} cx={276 + k * 10} cy={262 + k * 5.5} r="1.8" fill={shade(color, -0.4)} />
      ))}
      <path d="M58,306 L350,306" {...stitch(color)} />
    </>
  );
}

function Runner({ color, accent = "#F4F1EA", id }: P) {
  return (
    <>
      <Shadow id={id} cy={356} rx={175} ry={22} />
      <path d="M48,300 C46,262 60,224 92,210 L140,204 C170,228 214,244 262,250 C318,256 354,276 356,304 Z" fill={`url(#${id}-body)`} {...edge(color)} />
      <path d="M44,298 L360,302 C364,322 352,338 330,338 L72,338 C52,338 42,322 44,298 Z" fill={accent} stroke={shade(accent, -0.25)} strokeWidth="1.5" />
      <path d="M50,326 L352,326" stroke={shade(accent, -0.2)} strokeWidth="2" />
      <path d="M120,290 C160,250 210,240 260,268 M140,296 C176,264 214,258 252,280" fill="none" stroke={accent} strokeWidth="6" strokeLinecap="round" opacity="0.9" />
      <path d="M140,204 C160,226 188,238 214,244" fill="none" stroke={shade(color, -0.3)} strokeWidth="3" />
      <path d="M160,216 L188,206 M172,226 L200,216 M186,234 L212,224" stroke={accent} strokeWidth="3" strokeLinecap="round" />
      <path d="M92,210 C86,196 94,186 108,188" fill="none" stroke={shade(color, -0.2)} strokeWidth="6" strokeLinecap="round" />
    </>
  );
}

const ART: Record<ArtName, (p: P) => ReactNode> = {
  "tee-crew": (p) => <Tee {...p} neck="crew" />,
  "tee-vneck": (p) => <Tee {...p} neck="v" />,
  polo: (p) => <Tee {...p} neck="polo" />,
  pants: Pants,
  "jacket-biker": Biker,
  "jacket-bomber": Bomber,
  overcoat: Overcoat,
  belt: Belt,
  "wallet-bifold": Bifold,
  cardholder: Cardholder,
  "sunglasses-aviator": (p) => <Sunglasses {...p} shape="aviator" />,
  "sunglasses-wayfarer": (p) => <Sunglasses {...p} shape="wayfarer" />,
  "sunglasses-round": (p) => <Sunglasses {...p} shape="round" />,
  "cap-baseball": Baseball,
  "cap-bucket": Bucket,
  "watch-digital": DigitalWatch,
  "shoe-oxford": Oxford,
  "shoe-runner": Runner,
};

export default function Illustration({ art, color, accent, className, title }: { art: ArtName; color: string; accent?: string; className?: string; title?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 400 500" className={className} role="img" aria-label={title}>
      {title && <title>{title}</title>}
      <Defs id={id} color={color} />
      {ART[art]({ color, accent, id })}
    </svg>
  );
}
