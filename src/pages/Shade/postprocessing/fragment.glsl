// uniform float uamplitude;
// uniform float uFrequency;
uniform float uTime;
uniform sampler2D uTexture;
uniform float uAngle;
uniform float uRadius;
uniform float uXStretch;
uniform float uYStretch;
uniform vec2 uCenter;

#include ../../../utils/shaders/simplexNoise3d.glsl
// These functions must be defined exactly as shown for the Effect Composer

// void mainUv(inout vec2 uv) {
//     uv.y += sin(uv.x * uFrequency + uTime) * uAmplitude;
// }

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec3 color = inputColor.rgb * 0.1;
    vec2 center = vec2(0.5);

    float dist = distance(uv, uCenter);
    float cosA = cos(uAngle);
    float sinA = sin(uAngle);
    mat2 rotation = mat2(cosA, -sinA, sinA, cosA);
    vec2 lightUv = uv;
    lightUv -= center;
    lightUv = rotation * lightUv;
    lightUv += center;

    lightUv.y *= uYStretch;
    lightUv.x *= uXStretch;
    lightUv.y += uTime * 0.05;

    float light = texture(uTexture, lightUv).r;
    light = smoothstep(0.1, 1.0, light);
    light = clamp(light, 0.0, 1.0);
    light *= smoothstep(1.0 - uRadius, 1.0, 1.0 - dist);

    color = mix(color, inputColor.rgb, light);
    // color = clamp(color, 0.0, 1.0);

    outputColor = vec4(color, inputColor.a);
}
