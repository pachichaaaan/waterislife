// Full-screen water. A single fragment shader draws one body of water whose
// surface recedes (uDepletion) and boils to vapour (uHeat) as the reader
// scrolls from the "Water" chapters into the "AI cost" chapters. Air above the
// waterline is left transparent so the migrating CSS background shows through —
// palette and shader stay glued without shipping colours twice.

export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform float uTime;
  uniform float uDepletion;
  uniform float uHeat;
  uniform float uTheme;
  uniform float uAspect;
  uniform vec2  uMouse;

  uniform vec3 cDeep;
  uniform vec3 cAqua;
  uniform vec3 cTide;
  uniform vec3 cFoam;
  uniform vec3 cAmber;
  uniform vec3 cMolten;
  uniform vec3 cAsh;

  // --- Ashima simplex noise (2D) ---
  vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p){
    float s = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
      s += a * snoise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return s * 0.5 + 0.5; // 0..1
  }

  // Travelling wave height-field. Layered directional swells + organic churn,
  // all flowing over time. Perspective compresses the waves toward the far
  // ("up") edge so it reads as a moving body of water, not a flat pattern.
  float waveHeight(vec2 p){
    float t = uTime * (1.0 - uDepletion * 0.55); // calmer as drawn down
    float h = 0.0;
    h += sin(p.x * 3.5 + t * 0.9) * 0.50;
    h += sin(p.x * 6.5 - p.y * 2.2 + t * 1.25) * 0.28;
    h += sin((p.x * 0.7 + p.y) * 4.2 + t * 0.65) * 0.24;
    h += sin(p.x * 11.0 + p.y * 1.5 - t * 1.7) * 0.12;
    h += (fbm(vec2(p.x * 1.6 + t * 0.18, p.y * 2.4 - t * 0.32)) - 0.5) * 1.5;
    return h;
  }

  void main(){
    vec2 uv = vUv;
    vec2 auv = vec2(uv.x * uAspect, uv.y);
    float t = uTime * (1.0 - uDepletion * 0.55);

    // Sample the moving water surface. Frequency rises toward the top so waves
    // recede into the distance like a real sea seen at a shallow angle.
    float persp = mix(1.0, 3.4, pow(uv.y, 1.4));
    vec2 p = vec2(auv.x * 3.2, uv.y * 3.0) * vec2(persp, 1.0);

    // Interactive pointer swell, folded into the height-field.
    vec2 m = vec2(uMouse.x * uAspect, uMouse.y);
    float md = distance(auv, m);
    float ripple = sin(md * 26.0 - t * 4.0) * exp(-md * 5.5) * (1.0 - uDepletion * 0.8);

    float e = 0.015 * persp;
    float h  = waveHeight(p) + ripple;
    float hx = waveHeight(p + vec2(e, 0.0)) + ripple;
    float hy = waveHeight(p + vec2(0.0, e)) + ripple;

    float ampScale = mix(1.0, 0.4, uDepletion);
    h *= ampScale; hx *= ampScale; hy *= ampScale;

    // Pseudo-normal from the height gradient, for lighting.
    vec3 n = normalize(vec3((h - hx) / e, (h - hy) / e, 1.0));

    // Waterline: full-bleed at rest, drawn low as the machines drink it.
    float baseLevel = mix(1.10, 0.20, uDepletion);
    float surface = baseLevel + h * mix(0.05, 0.015, uDepletion);
    float underAmt = surface - uv.y;   // > 0 under water
    float above = -underAmt;

    // Palette, warmed by heat.
    vec3 deep  = mix(cDeep, mix(cAmber, cMolten, 0.5) * 0.32, uHeat);
    vec3 mid   = mix(cTide, cMolten, uHeat);
    vec3 shine = mix(cAqua, cAmber, uHeat);
    vec3 crest = mix(cFoam, cAsh, uHeat);

    // Body colour follows wave height: dark troughs, lit crests.
    float crestF = clamp(h * 0.5 + 0.5, 0.0, 1.0);
    vec3 water = mix(deep, mid, smoothstep(0.15, 0.95, crestF));

    // Directional light → diffuse shimmer + sharp specular off the crests.
    vec3 L = normalize(vec3(0.35, 0.55, 0.75));
    float diff = clamp(dot(n, L) * 0.5 + 0.5, 0.0, 1.0);
    float spec = pow(clamp(dot(n, L), 0.0, 1.0), 22.0);
    water *= 0.72 + 0.5 * diff;
    water += shine * spec * (1.1 - uDepletion * 0.55);

    // Moving foam ridges along the wave crests.
    float ridge = smoothstep(0.6, 1.0, sin(h * 7.5 - uTime * 1.3) * 0.5 + 0.5);
    water += crest * ridge * (0.14 + 0.12 * crestF) * (1.0 - uDepletion * 0.5);

    // Caustic light bands drifting under the surface.
    float caust = fbm(vec2(auv.x * 5.0 + t * 0.3, uv.y * 3.5 - t * 0.4));
    water += shine * pow(max(caust, 0.0), 2.4) * 0.22 * (1.0 - uDepletion * 0.6);

    // Bright foam right at the receding waterline.
    float edge = smoothstep(0.02, 0.0, abs(underAmt));
    water = mix(water, crest, edge * 0.6);

    // Heat haze / vapour rising just above the hot waterline.
    float vap = fbm(vec2(auv.x * 3.0 + sin(t * 0.4) * 0.4, uv.y * 2.4 - t * 0.6));
    vap = pow(max(vap, 0.0), 1.6);
    float vapour = vap * uHeat * smoothstep(0.5, 0.0, abs(above - 0.06));
    float shimmerBand = exp(-pow((above - 0.02) * 9.0, 2.0)) * uHeat;

    // Compose: opaque waves below; transparent air (migrating CSS bg) above,
    // with warm vapour drawn faintly on top when hot.
    float waterMask = smoothstep(-0.004, 0.004, underAmt);
    vec3 col = water;
    float alpha = waterMask;

    vec3 hazeCol = mix(cAmber, cAsh, 0.4);
    float haze = vapour * 0.5 + shimmerBand * 0.4;
    col = mix(col, hazeCol, (1.0 - waterMask) * clamp(haze, 0.0, 1.0));
    alpha = max(alpha, (1.0 - waterMask) * clamp(haze, 0.0, 1.0) * 0.85);

    // Gentle vignette to seat it.
    float vig = smoothstep(1.35, 0.15, distance(uv, vec2(0.5)));
    col *= 0.84 + 0.16 * vig;

    gl_FragColor = vec4(col, alpha);
  }
`;
