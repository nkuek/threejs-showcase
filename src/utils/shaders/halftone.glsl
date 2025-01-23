vec3 halftone(vec3 color, float repetitions, vec3 direction, float bottomEdge, float topEdge, vec3 pointColor, vec3 normal) {
    float intensity = dot(direction, normal);
    intensity = smoothstep(bottomEdge, topEdge, intensity);

    vec2 uv = gl_FragCoord.xy / uResolution.y;
    uv *= repetitions;
    uv = mod(uv, 1.0);
    float point = distance(uv, vec2(0.5));
    point = 1.0 - step(0.5 * intensity, point);

    return mix(color, pointColor, point);
}
