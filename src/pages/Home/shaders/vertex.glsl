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

void main() {
    vec4 modelPosition = modelMatrix * vec4((position + aPosition) * aScale, 1.0);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    float blobMotion = sin(uTime + modelPosition.x * aRandomness) * 0.5;
    blobMotion += cos(uTime + modelPosition.y * aRandomness) * 0.1;
    float upwardsMotion = mod(uTime * 0.5 * aOffset, 30.0) - 10.0;

    projectionPosition.y += blobMotion;
    projectionPosition.y += upwardsMotion;

    gl_Position = projectionPosition;

    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);
    vNormal = normal;
    vPosition = modelPosition.xyz;
    vUv = uv;
}
