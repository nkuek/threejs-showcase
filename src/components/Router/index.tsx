import Layout from "../Layout";
import Fireworks from "../Fireworks";
import Home from "../Home";
import { useRouterContext } from "~/utils/useRouterContext";

export default function Router() {
  const { page, navigate } = useRouterContext();
  return (
    <>
      {page === "/" && (
        <Layout>
          <Home navigate={navigate} />
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
