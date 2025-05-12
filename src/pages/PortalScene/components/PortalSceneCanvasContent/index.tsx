import {
  OrbitControls,
  PerspectiveCamera,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import portal from "../../assets/portal_merged.glb?url";
import portalTexture from "../../assets/baked.jpg?url";
import * as THREE from "three";
import Fireflies from "../Fireflies";
import PortalMaterial from "../PortalMaterial/";

export default function PortalSceneCanvasContent() {
  const { nodes } = useGLTF(portal, true);
  const texture = useTexture(portalTexture);

  const bakedModel = nodes.baked as THREE.Mesh;
  const poleLightLeft = nodes.pole_light_left as THREE.Mesh;
  const poleLightRight = nodes.pole_light_right as THREE.Mesh;
  const portalLight = nodes.portal_light as THREE.Mesh;
  const lights = [poleLightLeft, poleLightRight];

  texture.flipY = false;
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <>
      <OrbitControls maxDistance={7} maxPolarAngle={Math.PI / 2.2} />
      <PerspectiveCamera
        rotation={[-Math.PI / 4, 0, 0]}
        makeDefault
        position={[5, 5, 7]}
      />
      <mesh
        geometry={bakedModel.geometry}
        rotation={bakedModel.rotation}
        position={bakedModel.position}
      >
        <meshBasicMaterial map={texture} />
      </mesh>
      {lights.map((light, index) => {
        return (
          <mesh
            key={index}
            geometry={light.geometry}
            position={light.position}
            rotation={light.rotation}
          >
            <meshBasicMaterial color="#FFFFF4" />
          </mesh>
        );
      })}
      <mesh
        geometry={portalLight.geometry}
        position={portalLight.position}
        rotation={portalLight.rotation}
      >
        <PortalMaterial />
      </mesh>
      <Fireflies />
    </>
  );
}
