/**
 * AndalusVelvetPanel — one cloth-simulated velvet drape, rendered with a
 * physically based velvet material.
 *
 * The geometry is a PlaneGeometry whose vertices are driven every frame by an
 * AndalusClothSim. Lighting follows the deformation because we recompute vertex
 * normals each frame, and the panel both casts and receives shadows so the
 * folds self-shadow (the look that reads as "real heavy fabric" rather than a
 * flat lit sheet). Velvet response comes from MeshPhysicalMaterial sheen
 * (grazing-angle back-scatter) + anisotropy aligned to the vertical pile.
 */
import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import AndalusClothSim, { CONFIG } from './AndalusClothSim';
import { createVelvetSurface, createVelvetNormal } from './andalusTextures';

const COLS = CONFIG.cols;
const ROWS = CONFIG.rows;

export default function AndalusVelvetPanel({ side = 'left', simulatorRef }) {
  const meshRef = useRef();
  const geoRef = useRef();
  const { width, height } = useThree((s) => s.viewport);

  const simulator = useMemo(() => {
    const sim = new AndalusClothSim(side, width, height);
    if (simulatorRef) simulatorRef.current = sim;
    return sim;
  }, [side, simulatorRef, width, height]);

  const surface = useMemo(() => createVelvetSurface(1024, side), [side]);
  const normalMap = useMemo(() => createVelvetNormal(512), []);

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(1, 1, COLS - 1, ROWS - 1),
    [],
  );

  useEffect(() => { geoRef.current = geometry; }, [geometry]);

  const material = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,            // colour lives in the albedo map
      map: surface.map,
      roughness: 1.0,             // scaled by roughnessMap (~0.9 velvet, ~0.3 braid)
      roughnessMap: surface.roughnessMap,
      metalness: 1.0,             // scaled by metalnessMap (0 velvet, ~0.9 braid)
      metalnessMap: surface.metalnessMap,
      normalMap,
      normalScale: new THREE.Vector2(0.6, 0.85),
      sheen: 1.0,
      sheenColor: new THREE.Color(0xe0a06a),  // warm rose-gold grazing rim
      sheenRoughness: 0.32,
      anisotropy: 0.35,
      anisotropyRotation: Math.PI / 2,          // along the vertical pile
      envMapIntensity: 0.32,
      side: THREE.DoubleSide,
    });
    m.shadowSide = THREE.DoubleSide;
    return m;
  }, [surface, normalMap]);

  // dispose generated textures/material/geometry on unmount
  useEffect(() => {
    return () => {
      surface.map.dispose();
      surface.roughnessMap.dispose();
      surface.metalnessMap.dispose();
      normalMap.dispose();
      material.dispose();
      geometry.dispose();
    };
  }, [surface, normalMap, material, geometry]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    simulator.update(dt);
    const geo = geoRef.current;
    if (!geo) return;
    const pos = geo.attributes.position;
    const pts = simulator.points;
    for (let i = 0; i < pts.length; i++) pos.setXYZ(i, pts[i].x, pts[i].y, pts[i].z);
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geometry} material={material} castShadow receiveShadow />
  );
}
