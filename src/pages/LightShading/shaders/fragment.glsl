uniform vec3 uColor;
uniform vec3 uAmbientLightColor;
uniform float uAmbientLightIntensity;
uniform vec3 uDirectionalLightPosition;
uniform vec3 uDirectionalLightColor;
uniform float uDirectionalLightSpecularPower;
uniform float uDirectionalLightIntensity;
uniform vec3 uPointLight1Position;
uniform vec3 uPointLight1Color;
uniform float uPointLight1Intensity;
uniform float uPointLight1SpecularPower;
uniform float uPointLight1Decay;
uniform vec3 uPointLight2Position;
uniform vec3 uPointLight2Color;
uniform float uPointLight2Intensity;
uniform float uPointLight2SpecularPower;
uniform float uPointLight2Decay;

varying vec3 vNormal;
varying vec3 vPosition;

#include ../../../utils/shaders/ambientLight.glsl
#include ../../../utils/shaders/directionalLight.glsl
#include ../../../utils/shaders/pointLight.glsl

void main() {
    vec3 color = uColor;
    vec3 viewDirection = normalize(vPosition - cameraPosition);

    // since the normal value is being interpolated, we need to renormalize it here
    vec3 normal = normalize(vNormal);

    vec3 light = vec3(0.0);
    light += ambientLight(vec3(uAmbientLightColor), uAmbientLightIntensity);
    light += directionalLight(
            uDirectionalLightColor,
            uDirectionalLightIntensity,
            normal,
            uDirectionalLightPosition,
            viewDirection,
            uDirectionalLightSpecularPower
        );
    light += pointLight(
            uPointLight1Color,
            uPointLight1Intensity,
            normal,
            uPointLight1Position,
            viewDirection,
            uPointLight1SpecularPower,
            vPosition,
            uPointLight1Decay
        );
    light += pointLight(
            uPointLight2Color,
            uPointLight2Intensity,
            normal,
            uPointLight2Position,
            viewDirection,
            uPointLight2SpecularPower,
            vPosition,
            uPointLight2Decay
        );

    color *= light;

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
