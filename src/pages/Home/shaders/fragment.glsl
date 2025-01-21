uniform vec3 uColor;
uniform vec3 uAmbientLightColor;

varying vec2 vUv;

#include ../../../utils/shaders/ambientLight.glsl

void main() {
    float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    vec3 color = uColor;
    color *= strength;

    vec3 light = vec3(0.0);
    light += ambientLight(uAmbientLightColor, 2.0);
    color *= light;

    gl_FragColor = vec4(color, 1.0);
}
