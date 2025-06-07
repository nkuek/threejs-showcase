import { Canvas } from "@react-three/fiber";
import { Link, useSearchParams } from "react-router";
import sitemap from "~/utils/sitemap";
import HomeCanvasContent from "./components/HomeCanvasContent";
import { Leva } from "leva";
import { Suspense } from "react";

export default function Home() {
  const [searchParams] = useSearchParams();
  const showLeva = searchParams.has("debug");
  return (
    <div className="h-full pt-[76px] grid place-items-center w-full relative">
      <ul className="p-4 z-[1] md:columns-2 space-y-8 gap-16 ">
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
      <div className="absolute h-full w-full">
        <Canvas>
          <Suspense>
            <HomeCanvasContent />
          </Suspense>
        </Canvas>
        <Leva hidden={!showLeva} />
      </div>
    </div>
  );
}
