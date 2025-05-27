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
const LazyEarth = lazy(() => import("~/pages/Earth"));
const LazyParticleDisplacement = lazy(
  () => import("~/pages/ParticleDisplacement")
);
// const LazyParticleMorphing = lazy(() => import("~/pages/ParticleMorphing"));
const LazyParticleFlowField = lazy(() => import("~/pages/ParticleFlowField"));
const LazyShade = lazy(() => import("~/pages/Shade"));
const LazyPortalScene = lazy(() => import("~/pages/PortalScene"));
const LazyChromaticAberration = lazy(
  () => import("~/pages/ChromaticAberration")
);
const LazyCorne = lazy(() => import("~/pages/Corne"));
const LazyParticleMorphingAdvanced = lazy(
  () => import("~/pages/ParticleMorphingAdvanced")
);

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
    component: <LazyParticleMorphingAdvanced />,
    theme: "dark",
  },
  particleFlowField: {
    label: "Particle Flow Field",
    path: "/particle-flow-field",
    exact: true,
    component: <LazyParticleFlowField />,
    theme: "dark",
  },
  shade: {
    label: "Shade",
    path: "/shade",
    exact: true,
    component: <LazyShade />,
    theme: "dark",
  },
  portalScene: {
    label: "Portal Scene",
    path: "/portal",
    exact: true,
    component: <LazyPortalScene />,
    theme: "dark",
  },
  chromaticAberration: {
    label: "Chromatic Aberration",
    path: "/chromatic-aberration",
    exact: true,
    component: <LazyChromaticAberration />,
    theme: "dark",
  },
  corne: {
    label: "Corne",
    path: "/corne",
    exact: true,
    component: <LazyCorne />,
    theme: "light",
  },
} as const;

export default sitemap;
