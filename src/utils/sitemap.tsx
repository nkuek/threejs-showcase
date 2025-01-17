import Fireworks from "~/components/Fireworks";
import Home from "~/components/Home";

export type SitemapHrefs = (typeof sitemap)[keyof typeof sitemap]["href"];

const sitemap = {
  home: {
    label: "Home",
    href: "/",
    component: <Home />,
  },
  fireworks: {
    label: "Fireworks",
    href: "/fireworks",
    component: <Fireworks />,
  },
} as const;

export default sitemap;
