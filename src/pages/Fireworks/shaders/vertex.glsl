uniform float uScale;
uniform vec2 uResolution;
uniform float uProgress;

attribute float aScale;
attribute vec3 aColor;
attribute float aLifespan;

varying vec3 vColor;

#include ../../../utils/shaders/remap.glsl

void main() {
    vec3 newPosition = position;
    float progress = aLifespan * uProgress;

    // Explosions
    float explosionProgress = remap(progress, 0.0, 0.1, 0.0, 1.0);
    explosionProgress = clamp(explosionProgress, 0.0, 1.0);
    explosionProgress = 1.0 - pow(1.0 - explosionProgress, 3.0);
    newPosition *= explosionProgress;

    // Falling
    float fallProgress = remap(progress, 0.1, 1.0, 0.0, 1.0);
    fallProgress = clamp(fallProgress, 0.0, 1.0);
    fallProgress = 1.0 - pow(1.0 - fallProgress, 3.0);
    newPosition.y -= fallProgress * 0.3;

    // Scale
    float scaleOpenProgress = remap(progress, 0.0, 0.125, 0.0, 1.0);
    float scaleCloseProgress = remap(progress, 0.125, 1.0, 1.0, 0.0);
    float scaleProgress = min(scaleOpenProgress, scaleCloseProgress);
    scaleProgress = clamp(scaleProgress, 0.0, 1.0);

    // Twinkling
    float twinkleProgress = remap(progress, 0.2, 0.8, 0.0, 1.0);
    twinkleProgress = clamp(twinkleProgress, 0.0, 1.0);
    float sizeTwinkling = sin(progress * 30.0) * 0.5 + 0.5;
    sizeTwinkling *= 1.0 - twinkleProgress;

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;

    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = aScale * uScale * uResolution.y * scaleProgress * sizeTwinkling;
    gl_PointSize *= 1.0 / -viewPosition.z;

    // Windows struggles with rendering points smaller than 1 pixel so a hacky fix
    // is to set the position to something ridiculously far if the size is too small
    if (gl_PointSize < 1.0) {
        gl_Position = vec4(9999.0);
    }

    vColor = aColor;
}
