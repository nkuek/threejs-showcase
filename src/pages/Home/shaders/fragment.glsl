uniform vec2 uResolution;
uniform vec3 uColor;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
    float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    vec3 color = uColor;
    color *= strength;

    gl_FragColor = vec4(color, 1.0);
}
