uniform float uFrequency;
uniform float uAmplitude;
uniform float uTime;

#include ../../../utils/shaders/perlinNoise2d.glsl
// These functions must be defined exactly as shown for the Effect Composer

void mainUv(inout vec2 uv) {
    // uv.y += sin(uv.x * uFrequency + uTime) * uAmplitude;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec3 color = inputColor.rgb;
    vec2 center = vec2(0.5, 0.75);

    // coord = coord * perlinNoise2d(coord);

    float d = distance(uv, center);
    d = sin(d * 5.0 + uTime) * 1.18 + 0.5;
    d = perlinNoise2d(uv * 5.0 + uTime) * d;
    color *= smoothstep(0.8, 0.1 * 0.799, d * (0.5 + 0.1));

    outputColor = vec4(color, inputColor.a);
}
