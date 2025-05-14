uniform sampler2D uTexture;
uniform vec2 uMousePosition;
uniform vec2 uPreviousMousePosition;
uniform float uIntensity;

varying vec2 vUv;

void main() {
    vec3 color = gl_FragCoord.rgb;
    vec2 gridUv = floor(vUv * 20.0) / 20.0;
    vec2 centerOfPixel = gridUv + 1.0 / 20.0;
    vec2 mouseDirection = uMousePosition - uPreviousMousePosition;
    vec2 pixelToMouseDirection = uMousePosition - centerOfPixel;
    float pixelDistanceToMouse = length(pixelToMouseDirection);
    float strength = smoothstep(0.3, 0.0, pixelDistanceToMouse);
    vec2 uvOffset = strength * -mouseDirection * 0.2;
    vec2 textureUv = vUv - uvOffset;

    float colorR = texture(uTexture, textureUv + vec2(uIntensity * strength * 0.01, 0.0), 0.0).r;
    float colorG = texture(uTexture, textureUv + 0.0).g;
    float colorB = texture(uTexture, textureUv - vec2(uIntensity * strength * 0.01, 0.0), 0.0).b;

    gl_FragColor = vec4(colorR, colorG, colorB, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
