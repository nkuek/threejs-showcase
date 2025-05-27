uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uProgress;

varying vec2 vUv;

void main() {
    vec4 textureColor = texture2D(uTexture1, vUv);
    vec4 textureColor2 = texture2D(uTexture2, vUv);

    textureColor = mix(textureColor, textureColor2, smoothstep(0.25, 0.75, uProgress));
    gl_FragColor = vec4(textureColor.rgb, 1.);
    if (gl_FragColor.r < 0.1 && gl_FragColor.g < 0.1 && gl_FragColor.b < 0.1) {
        discard; // Discard pixels that are close to black
    }
}
