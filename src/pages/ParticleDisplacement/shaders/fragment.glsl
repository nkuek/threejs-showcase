varying vec3 vColor;

void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));

    if (dist > 0.5) discard;

    gl_FragColor = vec4(vColor, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
