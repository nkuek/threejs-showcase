uniform sampler2D uTexture;
uniform float uProgress;

varying vec3 vColor;
void main() {
    float textureAlpha = texture(uTexture, gl_PointCoord).r;
    textureAlpha *= 1.0 - uProgress;
    gl_FragColor = vec4(vColor, textureAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
