import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';

// Vertex shader for atmospheric scattering
const vertexShader = `
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Fragment shader with time-based lighting
const fragmentShader = `
uniform float uTime;
uniform vec3 uSunPosition;
uniform float uSunIntensity;
uniform vec3 uSkyColor;
uniform vec3 uHorizonColor;
uniform vec3 uGroundColor;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

// Simplex noise functions
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Fractional Brownian Motion
float fbm(vec2 st) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
  for (int i = 0; i < 5; ++i) {
    value += amplitude * snoise(st);
    st = rot * st * 2.0;
    amplitude *= 0.5;
  }
  return value;
}

// Cloud function
float cloud(vec2 uv, float time) {
  vec2 q = vec2(0.);
  q.x = fbm(uv + 0.1 * time);
  q.y = fbm(uv + vec2(1.0));
  
  vec2 r = vec2(0.);
  r.x = fbm(uv + 1.0 * q + vec2(1.7, 9.2) + 0.15 * time);
  r.y = fbm(uv + 1.0 * q + vec2(8.3, 2.8) + 0.126 * time);
  
  float f = fbm(uv + r);
  return clamp((f * f * f + 0.6 * f * f + 0.5 * f), 0.0, 1.0);
}

void main() {
  vec2 uv = vUv;
  
  // Calculate sun direction
  vec3 sunDir = normalize(uSunPosition);
  
  // Atmospheric scattering calculation
  float zenith = acos(vNormal.y);
  float rayleigh = exp(-zenith * 2.0);
  
  // Mie scattering (sun glow)
  float mieAngle = dot(sunDir, vNormal);
  float mie = pow(max(mieAngle, 0.0), 32.0) * uSunIntensity;
  
  // Sky gradient based on view angle
  vec3 skyColor = mix(uGroundColor, uHorizonColor, smoothstep(-0.1, 0.4, vNormal.y));
  skyColor = mix(skyColor, uSkyColor, smoothstep(0.3, 1.0, vNormal.y));
  
  // Add sun contribution
  vec3 finalColor = skyColor;
  finalColor += vec3(1.0, 0.9, 0.7) * mie * 2.0;
  
  // Rayleigh scattering tint
  finalColor += uSkyColor * rayleigh * 0.3;
  
  // Cloud layer
  float clouds = cloud(uv * 3.0, uTime * 0.05);
  vec3 cloudColor = vec3(0.9, 0.9, 0.95) * clouds * 0.4;
  
  // Sun occlusion on clouds
  float sunOcclusion = 1.0 - smoothstep(0.0, 0.3, distance(uv, sunDir.xy * 0.5 + 0.5));
  cloudColor *= (0.7 + 0.3 * sunOcclusion);
  
  finalColor += cloudColor;
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

// Fullscreen plane component
function Atmosphere() {
  const meshRef = useRef();
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSunPosition: { value: new THREE.Vector3(0, 1, 1) },
    uSunIntensity: { value: 1.0 },
    uSkyColor: { value: new THREE.Color(0x1e3a8a) },
    uHorizonColor: { value: new THREE.Color(0x60a5fa) },
    uGroundColor: { value: new THREE.Color(0x0f172a) },
  }), []);

  const animate = () => {
    if (meshRef.current) {
      const elapsedTime = performance.now() / 1000;
      meshRef.current.material.uniforms.uTime.value = elapsedTime;
      
      // Calculate sun position based on time of day
      const hours = new Date().getHours();
      const minutes = new Date().getMinutes();
      const timeOfDay = (hours + minutes / 60) / 24;
      
      // Sun moves in an arc across the sky
      const sunAngle = (timeOfDay - 0.25) * Math.PI * 2;
      const sunHeight = Math.sin(sunAngle);
      const sunX = Math.cos(sunAngle);
      
      // Update sun position
      meshRef.current.material.uniforms.uSunPosition.value.set(sunX, Math.max(sunHeight, -0.5), 1);
      
      // Adjust sun intensity and colors based on time
      let sunIntensity, skyColor, horizonColor, groundColor;
      
      if (sunHeight > 0.3) {
        // Day
        sunIntensity = 1.0 + sunHeight * 0.5;
        skyColor = new THREE.Color(0x3b82f6);
        horizonColor = new THREE.Color(0x93c5fd);
        groundColor = new THREE.Color(0x1e3a8a);
      } else if (sunHeight > 0) {
        // Morning/Evening
        const t = sunHeight / 0.3;
        sunIntensity = 1.5 + t * 0.5;
        skyColor = new THREE.Color().lerpColors(new THREE.Color(0xf97316), new THREE.Color(0x3b82f6), t);
        horizonColor = new THREE.Color().lerpColors(new THREE.Color(0xfbbf24), new THREE.Color(0x93c5fd), t);
        groundColor = new THREE.Color().lerpColors(new THREE.Color(0x7c2d12), new THREE.Color(0x1e3a8a), t);
      } else if (sunHeight > -0.3) {
        // Dusk/Dawn
        const t = -sunHeight / 0.3;
        sunIntensity = 2.0 - t * 0.5;
        skyColor = new THREE.Color().lerpColors(new THREE.Color(0x3b82f6), new THREE.Color(0x1e1b4b), t);
        horizonColor = new THREE.Color().lerpColors(new THREE.Color(0x93c5fd), new THREE.Color(0x4c1d95), t);
        groundColor = new THREE.Color().lerpColors(new THREE.Color(0x1e3a8a), new THREE.Color(0x0f172a), t);
      } else {
        // Night
        sunIntensity = 0.3;
        skyColor = new THREE.Color(0x0f172a);
        horizonColor = new THREE.Color(0x1e1b4b);
        groundColor = new THREE.Color(0x020617);
      }
      
      meshRef.current.material.uniforms.uSunIntensity.value = sunIntensity;
      meshRef.current.material.uniforms.uSkyColor.value.copy(skyColor);
      meshRef.current.material.uniforms.uHorizonColor.value.copy(horizonColor);
      meshRef.current.material.uniforms.uGroundColor.value.copy(groundColor);
    }
    requestAnimationFrame(animate);
  };

  React.useEffect(() => {
    animate();
  }, []);

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

// Main App component
function App() {
  return (
    <Canvas
      camera={{ position: [0, 0, 1], fov: 75 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
    >
      <Atmosphere />
    </Canvas>
  );
}

// Render the app
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
