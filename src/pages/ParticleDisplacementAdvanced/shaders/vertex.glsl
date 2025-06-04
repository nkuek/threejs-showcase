attribute vec2 aUv;

varying vec2 vUv;

uniform sampler2D uPosition;

void main() {
    vec3 pos = texture2D(uPosition, aUv).xyz;
    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    gl_PointSize = 2.;
    vUv = aUv;
}
