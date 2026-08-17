import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const state = JSON.parse(readFileSync(new URL('../state.json', import.meta.url), 'utf8'));
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

const requiredPlanets = ['Alice', 'TreeOS', 'Vyro', 'Control Map', 'Gear Room', 'Creative Studio'];
const requiredPlanetFields = [
  'rendererType',
  'radius',
  'surfaceType',
  'atmosphere',
  'waterCoverage',
  'landCoverage',
  'ringCount',
  'moonCount',
  'glowIntensity',
  'rotationSpeed',
  'orbitRadius',
  'orbitSpeed',
  'developmentLevel',
];

test('planetary system config preserves the six initial app worlds', () => {
  assert.equal(state.planetarySystem.schemaVersion, 'planetary-system-v1');
  assert.deepEqual(state.planetarySystem.apps, requiredPlanets);

  for (const name of requiredPlanets) {
    const entity = state.entities.find((candidate) => candidate.name === name);
    assert.ok(entity, `${name} entity exists`);
    assert.ok(entity.metadata?.planet, `${name} has planet metadata`);
    assert.equal(entity.metadata.planet.rendererType, 'three', `${name} uses the Three.js universe renderer`);
    assert.ok(Array.isArray(entity.metadata.planet.layers), `${name} has architecture layers`);
    assert.ok(entity.metadata.planet.layers.length > 0, `${name} has at least one architecture layer`);

    for (const field of requiredPlanetFields) {
      assert.ok(field in entity.metadata.planet, `${name} has ${field}`);
    }
  }
});

test('TreeOS architecture layers describe scoped workspace boundaries', () => {
  const treeos = state.entities.find((candidate) => candidate.name === 'TreeOS');
  const layerIds = treeos.metadata.planet.layers.map((layer) => layer.id);

  assert.deepEqual(layerIds, ['presentation', 'operations', 'intelligence', 'canonical', 'authority']);

  for (const layer of treeos.metadata.planet.layers) {
    assert.ok(layer.shell, `${layer.id} has shell`);
    assert.ok(layer.repo, `${layer.id} has repo`);
    assert.ok(Array.isArray(layer.modules), `${layer.id} has modules`);
    assert.ok(Array.isArray(layer.dependencies), `${layer.id} has dependencies`);
  }
});

test('HTML renderer includes planet rendering hooks and preserved shell features', () => {
  for (const marker of [
    'PLANETARY_SHELL_VERSION',
    'new THREE.WebGLRenderer',
    'MeshPhysicalMaterial',
    'ShaderMaterial',
    'ACESFilmicToneMapping',
    'textureSet',
    'fbm',
    'OrbitControls',
    'Raycaster',
    'EntitySceneCompiler',
    'LIVE_ACTIVITY_SPECS',
    'class ActivityObject',
    'WORLD_INTERACTION_MODES',
    'focusDesk',
    'depthSlider',
    'createInnerWorldPreview',
    'innerWorldPreview',
    'createFloatingModuleTerritory',
    'moduleTerritory',
    'createCinematicAtmosphereLens',
    'cinematicAtmosphereLens',
    'relationshipPath',
    'drawPlanet',
    'drawOrbitPath',
    'drawSpace',
    'renderArchitectureCutaway',
    'selectArchitectureLayer',
    'WORK ON THIS LAYER',
    "themeId:'cosmos'",
    "themeId:'forest'",
    "themeId:'minimal'",
    '+ STAR',
    'compositionTrace',
    'function enterRoom',
  ]) {
    assert.ok(html.includes(marker), `index.html includes ${marker}`);
  }
});
