uniform float uTime;
uniform vec3 uColor;

void main() {
    float alpha = clamp(sin(uTime * 3.0) * 2.5 + 2.0, 0.0, 1.0);
    gl_FragColor = vec4(uColor, alpha);
}
