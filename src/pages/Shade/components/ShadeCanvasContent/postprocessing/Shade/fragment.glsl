uniform float uTime;
uniform sampler2D uTexture;
uniform sampler2D uBackgroundTexture;
uniform float uAngle;
uniform float uRadius;
uniform float uXStretch;
uniform float uYStretch;
uniform vec2 uCenter;
uniform float uIntensity;

#include ../../../../../../utils/shaders/simplexNoise3d.glsl
#include ../../../../../../utils/shaders/perlinNoise2d.glsl
// These functions must be defined exactly as shown for the Effect Composer

// void mainUv(inout vec2 uv) {
//     uv.y = texture(uTexture, uv).r;
// }

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec3 color = inputColor.rgb;
    vec2 backgroundUv = uv;
    backgroundUv *= 5.0;
    vec3 backgroundTexture = texture(uBackgroundTexture, backgroundUv).rgb;
    float backgroundColor = backgroundTexture.r;
    float roughness = backgroundTexture.g;
    roughness = clamp(roughness, 0.04, 1.0);

    backgroundColor = smoothstep(0.7, 0.1, backgroundColor);
    color = mix(vec3(0.0), color, backgroundColor * 0.3);

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

    float light = texture(uTexture, lightUv).r * uIntensity;
    light = smoothstep(0.1, 1.0, light);
    light *= 1.0 - roughness;
    light = clamp(light, 0.0, 1.0);
    light *= smoothstep(1.0 - uRadius, 1.0, 1.0 - dist);

    vec3 litColor = mix(color, inputColor.rgb, light);
    color = mix(color, litColor, 1.0 - roughness);

    color = mix(color, inputColor.rgb, light);
    color = clamp(color, 0.0, 1.0);

    outputColor = vec4(color, inputColor.a);
}
