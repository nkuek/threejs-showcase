import { lazy } from "react";

export type SitemapPath = (typeof sitemap)[keyof typeof sitemap]["path"];

export type Theme = "light" | "dark";

export type SitemapRoute = {
  label: string;
  path: string;
  exact?: boolean;
  component: React.ReactNode;
  theme: Theme;
};

const LazyHome = lazy(() => import("~/pages/Home"));
const LazyFireworks = lazy(() => import("~/pages/Fireworks"));
const LazyLightShading = lazy(() => import("~/pages/LightShading"));

const sitemap: Record<string, SitemapRoute> = {
  home: {
    label: "Home",
    path: "/",
    exact: true,
    component: <LazyHome />,
    theme: "light",
  },
  fireworks: {
    label: "Fireworks",
    path: "/fireworks",
    exact: true,
    component: <LazyFireworks />,
    theme: "dark",
  },
  lightShading: {
    label: "Shader Light Shading",
    path: "/light-shading",
    exact: true,
    component: <LazyLightShading />,
    theme: "dark",
  },
};

export default sitemap;
