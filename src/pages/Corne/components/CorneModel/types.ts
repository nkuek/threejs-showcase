import { GLTF } from "three-stdlib";
import * as THREE from "three";
import { InstanceProps } from "@react-three/drei";
import { ThreeElements } from "@react-three/fiber";

export type GLTFResult = GLTF & {
  nodes: {
    display: THREE.Mesh;
    display_1: THREE.Mesh;
    case: THREE.Mesh;
    screen: THREE.Mesh;
    escape: THREE.Mesh;
    b: THREE.Mesh;
    l: THREE.Mesh;
    d: THREE.Mesh;
    c: THREE.Mesh;
    v: THREE.Mesh;
    modifier: THREE.Mesh;
    n: THREE.Mesh;
    nice_nano: THREE.Mesh;
    r: THREE.Mesh;
    t: THREE.Mesh;
    s: THREE.Mesh;
    g: THREE.Mesh;
    modifier001: THREE.Mesh;
    x: THREE.Mesh;
    q: THREE.Mesh;
    m: THREE.Mesh;
    w: THREE.Mesh;
    z: THREE.Mesh;
    switch_1: THREE.Mesh;
    switch_2: THREE.Mesh;
    switch_3: THREE.Mesh;
    space: THREE.Mesh;
    modifier003: THREE.Mesh;
    modifier002: THREE.Mesh;
  };
  materials: {
    screen: THREE.MeshPhysicalMaterial;
    pcb: THREE.MeshStandardMaterial;
    metal: THREE.MeshStandardMaterial;
    keycap_stem: THREE.MeshStandardMaterial;
    keycap_base: THREE.MeshStandardMaterial;
    base_keycap: THREE.MeshStandardMaterial;
    fuji_keycap: THREE.MeshStandardMaterial;
    modifiers_keycap: THREE.MeshStandardMaterial;
  };
};

export type CorneContext = {
  Switch: React.FC<InstanceProps>;
  Switch1: React.FC<InstanceProps>;
  Switch2: React.FC<InstanceProps>;
  BaseKey: React.FC<InstanceProps>;
  Modifier: React.FC<InstanceProps>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  setText: React.Dispatch<React.SetStateAction<string>>;
  textRef: React.RefObject<ThreeElements["mesh"]>;
};
