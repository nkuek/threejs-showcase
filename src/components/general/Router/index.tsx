import Layout from "../Layout";
import Fireworks from "~/pages/Fireworks";
import Home from "~/pages/Home";
import { useRouterContext } from "~/utils/useRouterContext";

export default function Router() {
  const { page } = useRouterContext();
  return (
    <>
      {page === "/" && (
        <Layout>
          <Home />
        </Layout>
      )}
      {page === "/fireworks" && (
        <Layout>
          <Fireworks />
        </Layout>
      )}
    </>
  );
}
