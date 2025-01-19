import Layout from "../Layout";
import { Routes as RouterRoutes, Route } from "react-router";
import sitemap from "~/utils/sitemap";

export default function Router() {
  return (
    <>
      <RouterRoutes>
        <Route element={<Layout />}>
          {Object.values(sitemap).map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.component}
            />
          ))}
        </Route>
      </RouterRoutes>
    </>
  );
}
