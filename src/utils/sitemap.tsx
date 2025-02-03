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
const LazyEarth = lazy(() => import("~/pages/Earth"));
const LazyParticleDisplacement = lazy(
  () => import("~/pages/ParticleDisplacement")
);
const LazyParticleMorphing = lazy(() => import("~/pages/ParticleMorphing"));
const LazyParticleFlowField = lazy(() => import("~/pages/ParticleFlowField"));

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
  earth: {
    label: "Earth",
    path: "/earth",
    exact: true,
    component: <LazyEarth />,
    theme: "dark",
  },
  particleDisplacement: {
    label: "Particle Displacement",
    path: "/particle-displacement",
    exact: true,
    component: <LazyParticleDisplacement />,
    theme: "dark",
  },
  particleMorphing: {
    label: "Particle Morphing",
    path: "/particle-morphing",
    exact: true,
    component: <LazyParticleMorphing />,
    theme: "dark",
  },
  particleFlowField: {
    label: "Particle Flow Field",
    path: "/particle-flow-field",
    exact: true,
    component: <LazyParticleFlowField />,
    theme: "dark",
  },
} as const;

export default sitemap;
