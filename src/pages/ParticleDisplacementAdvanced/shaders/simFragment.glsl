void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 velocity = texture2D(uVelocity, uv).xyz;
    vec3 position = texture2D(uPosition, uv).xyz;

    position += velocity; // Update position based on velocity

    // position.xy += normalize(position.xy) * 0.001; // Update position based on velocity

    gl_FragColor = vec4(position, 1.0);
}
