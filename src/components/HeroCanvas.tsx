import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── Shared Vertex Shader ───────────────────────────────────────────
const sharedVertexShader = `
varying vec2 v_uv;
void main() {
  v_uv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// ─── Simulation Fragment Shader ─────────────────────────────────────
const simFragmentShader = `
precision mediump float;

uniform sampler2D uPrevState;
uniform vec4 iMouse;
uniform vec2 uResolution;
uniform float uBrushSize;
uniform float uBrushStrength;
uniform float uFluidDecay;
uniform float uTrailLength;
uniform float uStopDecay;

varying vec2 v_uv;

vec3 encode(vec3 state) {
  return vec3(state.xy * 0.5 + 0.5, state.z * 2.0);
}

vec3 decode(vec3 raw) {
  return vec3((raw.xy - 0.5) * 2.0, raw.z * 0.5);
}

float lineDistance(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  float t = clamp(dot(p - a, ab) / max(dot(ab, ab), 1e-6), 0.0, 1.0);
  return length(p - (a + ab * t));
}

void main() {
  vec2 texel = 1.0 / uResolution;
  vec2 pixel = v_uv * uResolution;

  vec3 prev = texture2D(uPrevState, v_uv).xyz;
  vec3 state = decode(prev);
  vec2 vel = state.xy;
  float ink = state.z;

  // Sample neighbors
  vec3 stateL = decode(texture2D(uPrevState, v_uv + vec2(-texel.x, 0.0)).xyz);
  vec3 stateR = decode(texture2D(uPrevState, v_uv + vec2(texel.x, 0.0)).xyz);
  vec3 stateU = decode(texture2D(uPrevState, v_uv + vec2(0.0, texel.y)).xyz);
  vec3 stateD = decode(texture2D(uPrevState, v_uv + vec2(0.0, -texel.y)).xyz);

  // Diffusion
  vec2 avgVel = (stateL.xy + stateR.xy + stateU.xy + stateD.xy) * 0.25;
  float avgInk = (stateL.z + stateR.z + stateU.z + stateD.z) * 0.25;
  vel = mix(vel, avgVel, 0.15);
  ink = mix(ink, avgInk, 0.15);

  // Advection
  vec2 advectUV = v_uv - vel * texel * 0.5;
  vec3 advected = decode(texture2D(uPrevState, advectUV).xyz);
  vel = mix(vel, advected.xy, 0.35);
  ink = mix(ink, advected.z, 0.35);

  // Vorticity confinement
  vec3 stateLU = decode(texture2D(uPrevState, v_uv + vec2(-texel.x, texel.y)).xyz);
  vec3 stateRU = decode(texture2D(uPrevState, v_uv + vec2(texel.x, texel.y)).xyz);
  vec3 stateLD = decode(texture2D(uPrevState, v_uv + vec2(-texel.x, -texel.y)).xyz);
  vec3 stateRD = decode(texture2D(uPrevState, v_uv + vec2(texel.x, -texel.y)).xyz);

  float curlC = stateR.z - stateL.z + stateU.z - stateD.z;
  float curlR = stateRD.z - stateRU.z + stateR.z - state.z;
  float curlL = stateLD.z - stateLU.z + state.z - stateL.z;
  float curlU = stateRU.z - stateLU.z + stateU.z - state.z;
  float curlD = stateRD.z - stateLD.z + state.z - stateD.z;

  vec2 grad = vec2(abs(curlR) - abs(curlL), abs(curlU) - abs(curlD));
  grad = grad / max(length(grad), 1e-6);
  vec2 vcForce = grad * curlC * 0.3;
  vel += vcForce;

  // Decay
  vel *= uFluidDecay;
  ink *= uTrailLength;

  // Mouse injection
  if (iMouse.z > 0.0) {
    vec2 mousePos = iMouse.xy;
    vec2 mousePrev = iMouse.zw;
    vec2 motion = mousePos - mousePrev;
    float motionLen = length(motion);
    if (motionLen > 6.0) {
      motion = motion / motionLen * 6.0;
    }
    float qLine = lineDistance(pixel, mousePos, mousePrev);
    float qPoint = distance(pixel, mousePos);
    float q = mix(qLine, qPoint, 0.4);
    float brushSizeFactor = 2.2e-4 / uBrushSize;
    float strengthFactor = 0.03 * uBrushStrength;
    float falloff = exp(-q * q * brushSizeFactor);
    vel += motion * falloff * strengthFactor;
    ink += falloff * strengthFactor * 2.0;
  } else {
    float noMouseFade = 0.97 + (1.0 - uStopDecay) * 0.03;
    vel *= noMouseFade;
    ink *= noMouseFade;
  }

  // Clamp
  vel = clamp(vel, vec2(-1.0), vec2(1.0));
  ink = clamp(ink, 0.0, 1.0);

  gl_FragColor = vec4(encode(vec3(vel, ink)), 1.0);
}
`;

// ─── Display Fragment Shader ────────────────────────────────────────
const displayFragmentShader = `
precision mediump float;

uniform sampler2D u_texture;
uniform sampler2D u_fluid;
uniform float u_aspect;
uniform float u_textureAspect;

varying vec2 v_uv;

void main() {
  vec3 fluid = texture2D(u_fluid, v_uv).xyz;
  vec2 uv = v_uv;

  if (u_aspect > u_textureAspect) {
    fluid.x *= u_textureAspect / u_aspect;
  } else {
    fluid.y *= u_aspect / u_textureAspect;
  }

  uv += fluid.xy * 0.028;

  vec2 scale;
  if (u_aspect > u_textureAspect) {
    scale = vec2(u_textureAspect / u_aspect, 1.0);
  } else {
    scale = vec2(1.0, u_aspect / u_textureAspect);
  }
  uv = (uv - 0.5) * scale + 0.5;

  vec4 tex = texture2D(u_texture, uv);
  gl_FragColor = vec4(tex.rgb * (1.0 + fluid.z * 0.9), 1.0);
}
`;

// ─── FluidSim Component ─────────────────────────────────────────────
function FluidSim({ materialRef }: { materialRef: React.RefObject<THREE.ShaderMaterial | null> }) {
  const fboSize = useMemo(() => new THREE.Vector2(512, 512), []);
  const { gl, pointer, viewport } = useThree();

  const rtA = useMemo(
    () =>
      new THREE.WebGLRenderTarget(fboSize.x, fboSize.y, {
        type: THREE.FloatType,
        format: THREE.RGBAFormat,
      }),
    [fboSize]
  );
  const rtB = useMemo(
    () =>
      new THREE.WebGLRenderTarget(fboSize.x, fboSize.y, {
        type: THREE.FloatType,
        format: THREE.RGBAFormat,
      }),
    [fboSize]
  );

  const simScene = useMemo(() => new THREE.Scene(), []);
  const simCamera = useMemo(
    () => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
    []
  );

  const simMaterial = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      vertexShader: sharedVertexShader,
      fragmentShader: simFragmentShader,
      uniforms: {
        uPrevState: { value: null },
        iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
        uResolution: { value: fboSize },
        uBrushSize: { value: 4.0 },
        uBrushStrength: { value: 0.32 },
        uFluidDecay: { value: 0.986 },
        uTrailLength: { value: 0.95 },
        uStopDecay: { value: 0.84 },
      },
    });
    return mat;
  }, [fboSize]);

  useEffect(() => {
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMaterial);
    simScene.add(quad);
    return () => {
      simScene.remove(quad);
      quad.geometry.dispose();
    };
  }, [simScene, simMaterial]);

  let currentRTA = rtA;
  let currentRTB = rtB;

  useFrame(() => {
    if (!materialRef.current) return;

    const px = (pointer.x * 0.5 + 0.5) * viewport.width;
    const py = (pointer.y * 0.5 + 0.5) * viewport.height;

    simMaterial.uniforms.iMouse.value.set(
      px,
      py,
      simMaterial.uniforms.iMouse.value.x,
      simMaterial.uniforms.iMouse.value.y
    );

    // Simulation pass
    simMaterial.uniforms.uPrevState.value = currentRTA.texture;
    gl.setRenderTarget(currentRTB);
    gl.render(simScene, simCamera);

    // Swap
    [currentRTA, currentRTB] = [currentRTB, currentRTA];

    // Display pass
    materialRef.current.uniforms.u_fluid.value = currentRTA.texture;
    gl.setRenderTarget(null);
  });

  useEffect(() => {
    return () => {
      rtA.dispose();
      rtB.dispose();
      simMaterial.dispose();
    };
  }, [rtA, rtB, simMaterial]);

  return null;
}

// ─── Display Plane ──────────────────────────────────────────────────
function DisplayPlane({ imageUrl }: { imageUrl: string }) {
  const { viewport, size } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [textureLoaded, setTextureLoaded] = useState(false);

  const tex = useMemo(() => {
    const texture = new THREE.TextureLoader().load(imageUrl, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.minFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
      setTextureLoaded(true);
    });
    return texture;
  }, [imageUrl]);

  const displayMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: sharedVertexShader,
        fragmentShader: displayFragmentShader,
        uniforms: {
          u_texture: { value: tex },
          u_fluid: { value: null },
          u_aspect: { value: viewport.width / viewport.height },
          u_textureAspect: { value: 1 },
        },
      }),
    [tex, viewport]
  );

  useEffect(() => {
    materialRef.current = displayMaterial;
  }, [displayMaterial]);

  useEffect(() => {
    if (textureLoaded && tex.image) {
      displayMaterial.uniforms.u_textureAspect.value =
        tex.image.width / tex.image.height;
    }
  }, [textureLoaded, tex, displayMaterial]);

  useEffect(() => {
    displayMaterial.uniforms.u_aspect.value = size.width / size.height;
  }, [size, displayMaterial]);

  return (
    <mesh scale={[viewport.width, viewport.height, 1]} position={[0, 0, 0]}>
      <planeGeometry args={[2, 2]} />
      <primitive object={displayMaterial} attach="material" />
      <FluidSim materialRef={materialRef} />
    </mesh>
  );
}

// ─── Hero Canvas ────────────────────────────────────────────────────
export default function HeroCanvas({ imageUrl }: { imageUrl: string }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="absolute inset-0 w-full h-full transition-opacity duration-700"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <Canvas
        orthographic
        camera={{ zoom: 1, position: [0, 0, 1] }}
        gl={{ antialias: false, alpha: false }}
        style={{ width: "100%", height: "100%" }}
      >
        <DisplayPlane imageUrl={imageUrl} />
      </Canvas>
    </div>
  );
}
