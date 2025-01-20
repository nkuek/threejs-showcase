import { AnimatePresence } from "motion/react";
import Layout from "../Layout";
import { Routes as RouterRoutes, Route } from "react-router";
import sitemap from "~/utils/sitemap";
import PageWrapper from "../PageWrapper";

export default function Router() {
  return (
    <>
      <RouterRoutes>
        <Route element={<Layout />}>
          {Object.values(sitemap).map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <AnimatePresence mode="wait" initial={false}>
                  <PageWrapper route={route} key={route.path} />
                </AnimatePresence>
              }
            />
          ))}
        </Route>
      </RouterRoutes>
    </>
  );
}
