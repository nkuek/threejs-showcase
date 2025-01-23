uniform vec3 uColor;
uniform vec3 uShadowColor;
uniform vec2 uResolution;
uniform float uShadowRepetitions;
uniform vec3 uLightColor;
uniform float uLightRepetitions;
uniform vec3 uLightDirection;

varying vec3 vNormal;
varying vec3 vPosition;

#include ../../../utils/shaders/ambientLight.glsl
#include ../../../utils/shaders/directionalLight.glsl
#include ../../../utils/shaders/halftone.glsl

void main() {
    vec3 viewDirection = normalize(vPosition - vNormal);
    vec3 normal = normalize(vNormal);
    vec3 color = uColor;

    vec3 light = vec3(0.0);
    light += ambientLight(vec3(1.0), 1.0);
    light += directionalLight(
            vec3(1.0, 1.0, 1.0),
            1.0,
            normal,
            uLightDirection,
            viewDirection,
            1.0
        );

    color *= light;

    color = halftone(color, uShadowRepetitions, vec3(0.0, -1.0, 0.0), -0.8, 1.5, uShadowColor, normal);
    color = halftone(color, uLightRepetitions, uLightDirection, 0.8, 1.5, uLightColor, normal);

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
