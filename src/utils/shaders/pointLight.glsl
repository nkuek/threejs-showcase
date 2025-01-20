vec3 pointLight(vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower, vec3 position, float lightDecay) {
    // calculate the direction of the fragment to the light
    vec3 lightDelta = lightPosition - position;
    float lightDistance = length(lightDelta);

    vec3 lightDirection = normalize(lightDelta);

    vec3 lightReflection = reflect(-lightDirection, normal);

    // dot product essentially tells us how aligned the normal (the surface of the object) is with the light direction
    // if the normal is facing the light direction, the dot product will be 1
    // if the normal is facing the opposite direction, the dot product will be -1
    // if the normal is perpendicular to the light direction, the dot product will be 0
    float shading = dot(normal, lightDirection);

    // we don't want to shade the back side so we clamp the shading to be between 0 and 1
    shading = max(shading, 0.0);

    float specular = -dot(lightReflection, viewDirection);
    specular = max(specular, 0.0);
    specular = pow(specular, specularPower);

    float decay = 1.0 - (lightDistance * lightDecay);
    decay = max(decay, 0.0);

    return lightColor * lightIntensity * decay * (shading + specular);
}
