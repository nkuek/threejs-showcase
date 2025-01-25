import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import EarthCanvasContent from "./components/EarthCanvasContent";
import LevaWrapper from "~/components/general/LevaWrapper";

export default function Earth() {
  return (
    <div className="h-svh bg-black w-full relative">
      <LevaWrapper />
      <Canvas dpr={[1, 2]}>
        <Suspense>
          <EarthCanvasContent />
        </Suspense>
      </Canvas>
      <span className="z-10 text-slate-100 absolute bottom-0 left-0 right-0 text-center text-sm">
        Texture Assets Credit:{" "}
        <a
          className="underline"
          href="https://www.solarsystemscope.com/textures/"
        >
          Solar Textures
        </a>
      </span>
    </div>
  );
}
