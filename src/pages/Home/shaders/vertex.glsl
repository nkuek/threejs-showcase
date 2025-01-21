uniform float uTime;
uniform float uRandomness;
uniform vec2 uResolution;
uniform float uOffset;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

attribute float aRandomness;
attribute vec3 aPosition;
attribute float aScale;
attribute float aOffset;

#include ../../../utils/shaders/perlinNoise.glsl

void main() {
    float displacementSpeed = uTime * 0.25;
    float displacementStrength = 0.4;
    vec3 newPosition = position + aPosition;

    float displacement = cnoise(newPosition + vec3(displacementSpeed));
    displacement *= displacementStrength;

    newPosition += normal * displacement;

    vec4 modelPosition = modelMatrix * vec4((newPosition) * aScale, 1.0);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    float upwardsMotion = mod((uTime + aOffset * 10.0) * 2.0, 50.0) - 25.0;

    projectionPosition.y += upwardsMotion;

    gl_Position = projectionPosition;

    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);
    vNormal = normal;
    vPosition = modelPosition.xyz;
    vUv = uv;
}
