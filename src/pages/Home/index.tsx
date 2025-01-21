import { Canvas } from "@react-three/fiber";
import { Link } from "react-router";
import sitemap from "~/utils/sitemap";
import HomeCanvasContent from "./components/HomeCanvasContent";
import { Leva } from "leva";

const hideLeva = true;

export default function Home() {
  return (
    <div className="h-svh grid place-items-center w-full">
      <div className="grid place-items-center h-[80%] w-[80%] mix-blend-difference bg-white text-slate-800 z-[1]">
        <ul className="flex flex-col gap-8 justify-center h-full">
          {Object.entries(sitemap)
            .filter(([key]) => key !== "home")
            .map(([, link]) => (
              <li key={link.path}>
                <Link
                  className="~text-3xl/4xl hover:underline hover:cursor-pointer"
                  to={link.path}
                >
                  {link.label}
                </Link>
              </li>
            ))}
        </ul>
      </div>
      <div className="absolute inset-0">
        <Canvas>
          <HomeCanvasContent />
        </Canvas>
        <Leva hidden={hideLeva} />
      </div>
    </div>
  );
}
