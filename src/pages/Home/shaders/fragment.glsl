uniform vec3 uColor;
uniform vec3 uAmbientLightColor;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

#include ../../../utils/shaders/ambientLight.glsl
#include ../../../utils/shaders/directionalLight.glsl

void main() {
    vec3 color = uColor;
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);

    vec3 light = vec3(0.0);
    light += ambientLight(uAmbientLightColor, 1.5);
    light += directionalLight(
            vec3(1.0, 1.0, 1.0),
            0.75,
            normal,
            vec3(3.0, 1.0, 0.0),
            viewDirection,
            16.0
        );
    color *= light;
    color *= color;

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
