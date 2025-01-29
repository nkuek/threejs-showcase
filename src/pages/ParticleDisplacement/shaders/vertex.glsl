uniform vec2 uResolution;
uniform sampler2D uPictureTexture;
uniform sampler2D uDisplacementTexture;

attribute float aIntensity;

varying vec2 vUv;
varying vec3 vColor;

void main() {
    vec3 newPosition = position;
    float displacementIntensity = texture(uDisplacementTexture, uv).r;

    vec3 displacement = vec3(0.0, 0.0, 1.0);
    displacement *= clamp(displacementIntensity - 0.3, 0.0, 1.0);
    displacement *= 3.0;
    displacement *= aIntensity;

    newPosition += displacement;

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    float pictureIntensity = texture(uPictureTexture, uv).r * 4.0;

    gl_PointSize = 0.15 * uResolution.y * pictureIntensity;
    gl_PointSize *= -1.0 / viewPosition.z;

    vUv = uv;
    vColor = vec3(pow(pictureIntensity, 2.0));
}
