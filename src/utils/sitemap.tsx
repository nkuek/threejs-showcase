import Fireworks from "~/pages/Fireworks";
import Home from "~/pages/Home";

export type SitemapPath = (typeof sitemap)[keyof typeof sitemap]["path"];

export type Theme = "light" | "dark";

export type SitemapRoute = {
  label: string;
  path: string;
  exact?: boolean;
  component: React.ReactNode;
  theme: Theme;
};

const sitemap: Record<string, SitemapRoute> = {
  home: {
    label: "Home",
    path: "/",
    exact: true,
    component: <Home />,
    theme: "light",
  },
  fireworks: {
    label: "Fireworks",
    path: "/fireworks",
    exact: true,
    component: <Fireworks />,
    theme: "dark",
  },
};

export default sitemap;
