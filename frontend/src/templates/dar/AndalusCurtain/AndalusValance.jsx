/**
 * AndalusValance — the ornate pelmet that crowns the curtain and hides the
 * hardware, in the Maghrebi palace idiom.
 *
 * It is real 3D geometry (not a flat strip): a velvet swag whose bottom edge
 * scallops into draped arcs and whose surface bulges toward the viewer at each
 * swag centre, so it catches the key light and self-shadows. A glossy gold
 * braid (TubeGeometry) traces the scalloped hem, a slim gold header rail caps
 * the top, and weighted gold tassels hang at each gathered junction. The whole
 * group lifts away at the end of the reveal.
 */
import { useRef, useMemo, useEffect, forwardRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createVelvetNormal, createGoldNormal } from './andalusTextures';

const SWAGS = 5;

/* Build the scalloped velvet swag surface as an indexed grid. */
function buildSwagGeometry(W, top, headerH, dipDepth, zAmp) {
  const MX = SWAGS * 10; // columns
  const MY = 14;         // rows top->bottom
  const x0 = -W / 2;
  const swagW = W / SWAGS;

  const positions = new Float32Array((MX + 1) * (MY + 1) * 3);
  const uvs = new Float32Array((MX + 1) * (MY + 1) * 2);

  const bottomYAt = (x) => {
    const local = ((x - x0) % swagW) / swagW; // 0..1 within swag
    const dip = Math.sin(local * Math.PI); // 0 at junctions, 1 at centre
    return top - headerH - dip * dipDepth;
  };
  const bulgeAt = (x) => {
    const local = ((x - x0) % swagW) / swagW;
    return Math.sin(local * Math.PI) * zAmp;
  };

  let pi = 0;
  let ui = 0;
  for (let iy = 0; iy <= MY; iy++) {
    const vFrac = iy / MY; // 0 top, 1 bottom
    for (let ix = 0; ix <= MX; ix++) {
      const u = ix / MX;
      const x = x0 + u * W;
      const yBottom = bottomYAt(x);
      const y = top + (yBottom - top) * vFrac;
      const z = bulgeAt(x) * vFrac * vFrac; // bulge grows toward the hem
      positions[pi++] = x;
      positions[pi++] = y;
      positions[pi++] = z;
      uvs[ui++] = u * SWAGS; // repeat fibre texture per swag
      uvs[ui++] = vFrac;
    }
  }

  const indices = [];
  const rowLen = MX + 1;
  for (let iy = 0; iy < MY; iy++) {
    for (let ix = 0; ix < MX; ix++) {
      const a = iy * rowLen + ix;
      const b = a + 1;
      const c = a + rowLen;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return { geo, bottomYAt, bulgeAt, x0, swagW };
}

/* A gold braid tube following the scalloped hem. */
function buildBraid(W, bottomYAt, bulgeAt) {
  const pts = [];
  const steps = 160;
  const x0 = -W / 2;
  for (let i = 0; i <= steps; i++) {
    const x = x0 + (i / steps) * W;
    pts.push(new THREE.Vector3(x, bottomYAt(x) + 0.004, bulgeAt(x) + 0.012));
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  return new THREE.TubeGeometry(curve, steps, 0.018, 8, false);
}

/* One hanging tassel (cord + knot + grooved skirt). */
function Tassel({ x, y, z, goldMat, normalMap }) {
  const cordLen = 0.10;
  const skirtLen = 0.16;
  const skirtR = 0.045;
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, -cordLen / 2, 0]} castShadow>
        <cylinderGeometry args={[0.006, 0.006, cordLen, 6]} />
        <primitive object={goldMat} attach="material" />
      </mesh>
      <mesh position={[0, -cordLen, 0]} castShadow>
        <sphereGeometry args={[0.026, 16, 16]} />
        <primitive object={goldMat} attach="material" />
      </mesh>
      {/* tassel skirt — cone pointing up, flared base down */}
      <mesh position={[0, -cordLen - skirtLen / 2 - 0.01, 0]} castShadow>
        <coneGeometry args={[skirtR, skirtLen, 16, 1, true]} />
        <meshStandardMaterial
          color={0xb98e36}
          metalness={0.85}
          roughness={0.4}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.8, 1.2)}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, -cordLen - skirtLen - 0.012, 0]} castShadow>
        <sphereGeometry args={[skirtR * 0.96, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={0xb98e36} metalness={0.85} roughness={0.4} />
      </mesh>
    </group>
  );
}

const AndalusValance = forwardRef(function AndalusValance(_props, ref) {
  const { width, height } = useThree((s) => s.viewport);

  const W = width + 0.5;
  const top = height / 2 + 0.24;
  const headerH = height * 0.085;
  const dipDepth = height * 0.17;
  const zAmp = 0.11;

  const { geo, bottomYAt, bulgeAt, x0, swagW } = useMemo(
    () => buildSwagGeometry(W, top, headerH, dipDepth, zAmp),
    [W, top, headerH, dipDepth, zAmp],
  );
  const braidGeo = useMemo(
    () => buildBraid(W, bottomYAt, bulgeAt),
    [W, bottomYAt, bulgeAt],
  );

  const velvetNormal = useMemo(() => createVelvetNormal(512), []);
  const goldNormal = useMemo(() => createGoldNormal(256), []);

  const velvetMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0x4a0e1c,
        roughness: 0.92,
        metalness: 0.0,
        normalMap: velvetNormal,
        normalScale: new THREE.Vector2(0.5, 0.7),
        sheen: 1.0,
        sheenColor: new THREE.Color(0xe0a06a),
        sheenRoughness: 0.32,
        side: THREE.DoubleSide,
      }),
    [velvetNormal],
  );

  const goldMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xc9a24a,
        metalness: 0.95,
        roughness: 0.28,
        normalMap: goldNormal,
        normalScale: new THREE.Vector2(0.4, 0.4),
      }),
    [goldNormal],
  );

  useEffect(() => {
    return () => {
      geo.dispose();
      braidGeo.dispose();
      velvetNormal.dispose();
      goldNormal.dispose();
      velvetMat.dispose();
      goldMat.dispose();
    };
  }, [geo, braidGeo, velvetNormal, goldNormal, velvetMat, goldMat]);

  // tassels at gathered junctions
  const junctions = [];
  for (let j = 0; j <= SWAGS; j++) {
    const x = x0 + j * swagW;
    junctions.push({ x, y: bottomYAt(x + 0.0001) - 0.01, z: bulgeAt(x + 0.0001) + 0.02 });
  }

  return (
    <group ref={ref}>
      {/* velvet swag body */}
      <mesh geometry={geo} material={velvetMat} castShadow receiveShadow />
      {/* glossy gold braid along the hem */}
      <mesh geometry={braidGeo} material={goldMat} castShadow />
      {/* slim gold header rail capping the top */}
      <mesh position={[0, top - headerH * 0.32, zAmp * 0.2 + 0.02]} castShadow>
        <boxGeometry args={[W, headerH * 0.34, 0.05]} />
        <primitive object={goldMat} attach="material" />
      </mesh>
      {junctions.map((p, i) => (
        <Tassel key={i} x={p.x} y={p.y} z={p.z} goldMat={goldMat} normalMap={goldNormal} />
      ))}
    </group>
  );
});

export default AndalusValance;
