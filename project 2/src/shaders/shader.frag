#ifdef GL_ES
precision highp float;
#endif

varying vec4 vFinalColor;
varying vec2 vTextureCoord;

uniform float normScale;
uniform vec4 selectedColor;

uniform sampler2D uSampler;

uniform bool uUseTexture;

void main() {
    vec4 color = mix(vFinalColor, selectedColor, (1.0 - normScale));
    if (uUseTexture)
    {
        vec4 textureColor = texture2D(uSampler, vTextureCoord);
        gl_FragColor = textureColor * color;
    }
    else
        gl_FragColor = color;
}