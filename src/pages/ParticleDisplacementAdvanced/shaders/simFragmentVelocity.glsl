varying vec2 vUv;

uniform sampler2D uOriginalPosition;
uniform vec2 uMousePosition;
uniform float uMouseForce;
uniform float uTime;

float random(vec2 st) {
    return fract(sin(dot(st.xy,
                vec2(12.9898, 78.233))) *
            43758.5453123);
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 velocity = texture2D(uVelocity, uv).xyz;
    vec3 position = texture2D(uPosition, uv).xyz;
    vec3 originalPosition = texture2D(uOriginalPosition, uv).xyz;

    velocity *= 0.99; // Dampen the velocity

    // movement towards the original position
    vec3 directionToOriginal = normalize(originalPosition - position);
    float distanceToOriginal = length(originalPosition - position);
    if (distanceToOriginal > 0.01) {
        // Apply a force towards the original position
        velocity += directionToOriginal * 0.0001;
    }

    float mouseDistance = distance(position, vec3(uMousePosition, 0.0));
    float maxDistance = 0.2;

    if (mouseDistance < maxDistance) {
        vec3 mouseDirection = normalize(position - vec3(uMousePosition, 0.0));
        velocity += mouseDirection * (1.0 - mouseDistance / maxDistance) * 0.001 * smoothstep(0.001, 1.0, uMouseForce); // Apply a force away from the mouse
    }

    // float lifespan = 5.;
    // float lifespanOffset = random(uv) * lifespan;
    // float age = mod(lifespanOffset + uTime, lifespan);
    // if (age < 0.1) {
    //     // Reset position and velocity when age is low
    //     position = originalPosition;
    //     velocity = vec2(0.0, 0.001);
    // }

    // position.xy += normalize(position.xy) * 0.001; // Update position based on velocity

    gl_FragColor = vec4(velocity, 1.0);
}
