uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute float aOffset;

#include ../../../../../utils/shaders/simplexNoise3d.glsl

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float randomness = simplexNoise3d(modelPosition.xyz + uTime * 0.01 + aOffset);
    modelPosition.y += sin(uTime + randomness) * aScale * randomness * 0.1;
    modelPosition.z += cos(uTime + randomness * 5.0) * aScale * 0.1;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    gl_PointSize = aScale * uSize * uPixelRatio * -1.0 / viewPosition.z;
}
