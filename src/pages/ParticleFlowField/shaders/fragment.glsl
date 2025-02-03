varying vec3 vColor;
void main() {
    float distanceToCenter = length(gl_PointCoord - 0.5);
    if (distanceToCenter > 0.5) {
        discard;
    }
    vec3 color = vColor;
    gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
