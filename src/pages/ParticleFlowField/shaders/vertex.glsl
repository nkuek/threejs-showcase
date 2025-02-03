uniform float uSize;
uniform vec2 uResolution;
uniform sampler2D uParticleTexture;

attribute vec2 aParticlesUv;
attribute vec3 aColor;
attribute float aSize;

varying vec3 vColor;

void main() {
    vec4 particle = texture(uParticleTexture, aParticlesUv);
    vec4 modelPosition = modelMatrix * vec4(particle.xyz, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    float sizeIn = smoothstep(0.0, 1.0, particle.a);
    float sizeOut = 1.0 - smoothstep(0.7, 1.0, particle.a);
    float size = min(sizeIn, sizeOut);
    gl_PointSize = size * uSize * uResolution.y * aSize;
    gl_PointSize *= 1.0 / -viewPosition.z;

    vColor = aColor;
}
