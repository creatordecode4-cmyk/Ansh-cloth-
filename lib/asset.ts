/**
 * Base path the site is served from: "" on Vercel / dev, "/Ansh-cloth-" on
 * GitHub Pages. Next.js prefixes its own routes and chunks, but not plain
 * string URLs for files in /public, so those go through asset().
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const asset = (path: string) => `${BASE_PATH}${path}`;
