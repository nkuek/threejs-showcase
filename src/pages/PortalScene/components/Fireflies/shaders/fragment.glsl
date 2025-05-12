void main() {
    vec2 uv = gl_PointCoord;
    float dist = distance(uv, vec2(0.5));
    float alpha = 1.0 - dist;
    alpha = 0.05 / dist - 0.05 * 2.0;
    gl_FragColor = vec4(vec3(1.0), alpha);
}
