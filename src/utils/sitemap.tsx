import Fireworks from "~/pages/Fireworks";
import Home from "~/pages/Home";

const sitemap = {
  home: {
    label: "Home",
    path: "/",
    exact: true,
    component: <Home />,
    index: true,
  },
  fireworks: {
    label: "Fireworks",
    path: "/fireworks",
    exact: true,
    component: <Fireworks />,
  },
} as const;

export default sitemap;
