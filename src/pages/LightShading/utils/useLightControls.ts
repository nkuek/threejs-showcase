import { folder, useControls } from "leva";

export function useAmbientLightControls() {
  return useControls({
    "Ambient Light": folder(
      {
        ambientLightColor: {
          value: "#ffffff",
          label: "Color",
        },
        ambientLightIntensity: {
          value: 0.03,
          min: 0,
          max: 0.1,
          step: 0.01,
          label: "Intensity",
        },
        ambientLightEnabled: {
          value: true,
          label: "Enabled",
        },
      },
      { collapsed: true }
    ),
  });
}

export function useDirectionalLightControls() {
  return useControls(() => ({
    "Directional Light": folder(
      {
        directionalLightPosition: {
          value: [0, 2, 2],
          step: 0.1,
          label: "Position",
        },
        directionalLightColor: {
          value: "#3b82ff",
          label: "Color",
        },
        directionalLightSpecularPower: {
          value: 20,
          min: 1,
          max: 100,
          step: 0.1,
          label: "Specular Power",
        },
        directionalLightIntensity: {
          value: 1,
          min: 0,
          max: 2,
          step: 0.1,
          label: "Intensity",
        },
        directionalLightEnabled: {
          value: true,
          label: "Enabled",
        },
      },
      { collapsed: true }
    ),
  }));
}

export function usePointLightControls({
  position,
  color,
  label,
}: {
  position: [number, number, number];
  color: string;
  label: string;
}) {
  return useControls(() => ({
    [label]: folder(
      {
        pointLightPosition: {
          value: position,
          step: 0.1,
          label: "Position",
        },
        pointLightColor: {
          value: color,
          label: "Color",
        },
        pointLightIntensity: {
          value: 1,
          min: 0,
          max: 10,
          step: 0.1,
          label: "Intensity",
        },
        pointLightDecay: {
          value: 0.2,
          min: 0,
          max: 1,
          step: 0.01,
          label: "Decay",
        },
        pointLightSpecularPower: {
          value: 20,
          min: 1,
          max: 100,
          step: 0.1,
          label: "Specular Power",
        },
        pointLightEnabled: {
          value: true,
          label: "Enabled",
        },
      },
      { collapsed: true }
    ),
  }));
}
