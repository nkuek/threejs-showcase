uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uSpecularTexture;
uniform vec3 uSunDirection;
uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereTwilightColor;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);

    vec3 color = vec3(0.0);
    vec3 dayColor = texture(uDayTexture, vUv).rgb;
    vec3 nightColor = texture(uNightTexture, vUv).rgb;
    vec3 specularTextureColor = texture(uSpecularTexture, vUv).rgb;

    vec3 sunDirection = normalize(uSunDirection);
    float sunOrientation = dot(sunDirection, normal);

    // Day/Night
    float dayMix = smoothstep(-0.25, 0.5, sunOrientation);
    dayMix = max(dayMix, 0.0);

    color = mix(nightColor, dayColor, dayMix);

    // Clouds
    vec2 specularCloudsColor = specularTextureColor.rg;
    float cloudsMix = specularCloudsColor.g;
    cloudsMix = smoothstep(0.1, 1.0, cloudsMix);
    cloudsMix *= dayMix;

    color = mix(color, vec3(1.0), cloudsMix);

    float fresnel = dot(normal, viewDirection) + 1.0;
    float fresnelMix = pow(fresnel, 2.0) * dayMix;

    // Atmosphere
    float atmosphereMix = smoothstep(-0.5, 1.0, sunOrientation);
    vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereMix);

    color = mix(color, atmosphereColor, fresnelMix);

    // Specular
    vec3 reflection = reflect(-sunDirection, normal);
    float specular = -dot(reflection, viewDirection);
    specular = max(specular, 0.0);
    specular = pow(specular, 64.0);
    specular *= specularCloudsColor.r + 0.1;
    vec3 specularColor = specular * mix(vec3(1.0), atmosphereColor, fresnelMix) * dayMix;

    color += specular;

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
