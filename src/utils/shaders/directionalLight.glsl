vec3 directionalLight(vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower) {
    vec3 lightDirection = normalize(lightPosition);
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

    return lightColor * lightIntensity * (shading + specular);
}
