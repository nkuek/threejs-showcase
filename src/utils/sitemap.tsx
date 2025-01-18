export type SitemapHrefs = (typeof sitemap)[keyof typeof sitemap]["href"];

const sitemap = {
  home: {
    label: "Home",
    href: "/",
  },
  fireworks: {
    label: "Fireworks",
    href: "/fireworks",
  },
} as const;

export default sitemap;
