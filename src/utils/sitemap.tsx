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
const LazyHalftoneShading = lazy(() => import("~/pages/HalftoneShading"));

export const externalLinks = {
  portfolio: {
    path: "https://www.nkuek.dev",
  },
};

const sitemap = {
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
    label: "Shader Lighting",
    path: "/shader-lighting",
    exact: true,
    component: <LazyLightShading />,
    theme: "dark",
  },
  halftoneShading: {
    label: "Halftone Shading",
    path: "/halftone-shading",
    exact: true,
    component: <LazyHalftoneShading />,
    theme: "dark",
  },
} as const;

export default sitemap;
