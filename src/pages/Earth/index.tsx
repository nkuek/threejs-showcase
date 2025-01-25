import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import EarthCanvasContent from "./components/EarthCanvasContent";
import LevaWrapper from "~/components/general/LevaWrapper";
import AnimatedLink from "~/components/general/AnimatedLink";

export default function Earth() {
  return (
    <div className="h-svh bg-black w-full relative">
      <LevaWrapper />
      <Canvas dpr={[1, 2]}>
        <Suspense>
          <EarthCanvasContent />
        </Suspense>
      </Canvas>
      <div className="z-10 text-slate-100 absolute bottom-0 left-0 right-0 text-center text-sm flex items-center justify-center gap-2">
        Texture Assets Credit:{" "}
        <AnimatedLink
          arrowProps={{ direction: "right" }}
          to="https://www.solarsystemscope.com/textures/"
          underline
        >
          Solar Textures
        </AnimatedLink>
      </div>
    </div>
  );
}
