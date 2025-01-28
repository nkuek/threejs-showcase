uniform vec2 uResolution;
uniform sampler2D uPictureTexture;

varying vec2 vUv;
varying vec3 vColor;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    float pictureIntensity = texture(uPictureTexture, uv).r * 3.0;

    gl_PointSize = 0.15 * uResolution.y * pictureIntensity;
    gl_PointSize *= -1.0 / viewPosition.z;

    vUv = uv;
    vColor = vec3(pow(pictureIntensity, 2.0));
}
