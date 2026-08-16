/**
 * PHASE 2 SEED — ontology-corrected, full lifecycle recorded through kernel
 * Every UI animation replays events that actually happened in the kernel.
 */
import { UniversalCommandCenter, FilesystemObserver, FilesystemEffector } from '../core/src/index';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const ucc = new UniversalCommandCenter();

  const nviro = await ucc.entityRegistry.create({
    type: 'system', name: 'NviroGear', status: 'OPERATIONAL', health: 'HEALTHY',
    metadata: { description: 'Master ecosystem' }, capabilities: [],
    location: { logicalZone: 'ecosystem' },
  });
  const treeos = await ucc.entityRegistry.create({
    type: 'application', name: 'TreeOS', status: 'OPERATIONAL', health: 'HEALTHY',
    metadata: { description: 'Field data network' }, capabilities: [],
    location: { logicalZone: 'operations' },
  });
  const arca = await ucc.entityRegistry.create({
    type: 'system', name: 'ARCA', status: 'OPERATIONAL', health: 'HEALTHY',
    metadata: { description: 'Orchestration engine' }, capabilities: [],
    location: { logicalZone: 'orchestration' },
  });
  const buildboard = await ucc.entityRegistry.create({
    type: 'system', name: 'BuildBoard', status: 'OPERATIONAL', health: 'HEALTHY',
    metadata: { description: 'Project and build tracking' }, capabilities: [],
    location: { logicalZone: 'delivery' },
  });
  const fieldtrace = await ucc.entityRegistry.create({
    type: 'module', name: 'FieldTrace', status: 'RUNNING', health: 'HEALTHY',
    metadata: {
      version: '1.2.4', creator: 'Joe', gate: 'G5',
      currentAgent: 'Worker A', currentTask: 'Spatial mapping module',
      agentState: 'ACTIVE', workingBranch: 'fieldtrace/spatial-v1',
      tests: '43 / 43 passing', lastAction: 'Added offline map cache',
      arcaActivity: '2 context packets received', needsOwner: 'No', hasCodeTree: true,
    },
    capabilities: [
      { id: 'c1', name: 'inspect', riskLevel: 'LOW' },
      { id: 'c2', name: 'logs', riskLevel: 'LOW' },
      { id: 'c3', name: 'update', riskLevel: 'MEDIUM' },
      { id: 'c4', name: 'deploy_production', riskLevel: 'CRITICAL' },
    ],
    location: { logicalZone: 'operations' },
  });
  const imageshell = await ucc.entityRegistry.create({
    type: 'module', name: 'Image Shell', status: 'RUNNING', health: 'HEALTHY',
    metadata: { version: '2.0.1', gate: 'G5', capabilitiesNote: 'camera / media capture' },
    capabilities: [], location: { logicalZone: 'operations' },
  });
  const worker = await ucc.entityRegistry.create({
    type: 'agent', name: 'Worker A', status: 'RUNNING', health: 'HEALTHY',
    metadata: {
      currentTask: 'Spatial mapping module', state: 'ACTIVE',
      lastAction: 'Added offline map cache', tests: '43 / 43 passing', needsOwner: 'No',
    },
    capabilities: [], location: { logicalZone: 'orchestration' },
  });
  // ── PROTO-STAR: an idea that exists but is not yet operational ──────
  const protoIdea = await ucc.entityRegistry.create({
    type: 'idea', name: 'Artwork-First Storefront', status: 'IDLE', health: 'UNKNOWN',
    metadata: { lifecycle: 'idea', origin: 'spoken in NviroGear room',
      note: 'let people generate the artwork before they pick the shirt' },
    capabilities: [], location: { logicalZone: 'ecosystem' },
  });

  const deploy = await ucc.entityRegistry.create({
    type: 'deployment', name: 'Production', status: 'OPERATIONAL', health: 'HEALTHY',
    metadata: { environment: 'production', version: '1.2.4' }, capabilities: [],
    location: { logicalZone: 'delivery' },
  });

  // ── TREE HEALTH MODULE + ITS CODEBASE AS CANONICAL ENTITIES ──────────
  // Files are entities. The file tree is a `contains` projection.
  // The Living Tree is a `logicRole` projection. Test failure = health.
  const treehealth = await ucc.entityRegistry.create({
    type: 'module', name: 'Tree Health', status: 'RUNNING', health: 'WARNING',
    metadata: {
      version: '0.9.2', gate: 'G4', hasCodeTree: true,
      currentAgent: 'Worker A', currentTask: 'Refactoring risk thresholds',
      agentState: 'ACTIVE', tests: '41 / 43 passing', needsOwner: 'No',
      lastAction: 'Editing healthEngine.ts',
    },
    capabilities: [], location: { logicalZone: 'operations' },
  });

  const f = async (name: string, meta: any) => ucc.entityRegistry.create({
    type: meta.kind, name, status: 'OPERATIONAL',
    health: meta.health || 'HEALTHY',
    metadata: meta, capabilities: [], location: { logicalZone: 'codebase' },
  });

  const d_src   = await f('src',        { kind: 'folder' });
  const d_comp  = await f('components', { kind: 'folder' });
  const d_serv  = await f('services',   { kind: 'folder' });
  const d_data  = await f('data',       { kind: 'folder' });
  const d_api   = await f('api',        { kind: 'folder' });
  const d_tests = await f('tests',      { kind: 'folder' });

  const fi_card  = await f('TreeHealthCard.tsx', { kind: 'file', ext: 'tsx', logicRole: 'UI', deployed: true });
  const fi_badge = await f('RiskBadge.tsx',      { kind: 'file', ext: 'tsx', logicRole: 'UI', deployed: true });
  const fi_eng   = await f('healthEngine.ts',    { kind: 'file', ext: 'ts',  logicRole: 'Health Engine',
                            editing: 'Worker A', modified: true, deployed: true });
  const fi_thr   = await f('thresholds.json',    { kind: 'file', ext: 'json', logicRole: 'Database', modified: true });
  const fi_api   = await f('tree-health.ts',     { kind: 'file', ext: 'ts',  logicRole: 'API', deployed: true });
  const fi_test  = await f('tree-health.test.ts',{ kind: 'file', ext: 'test', logicRole: 'Tests',
                            health: 'CRITICAL', failing: '2 FAILING' });

  // physical structure — `contains` is the FILES projection
  const mk2 = (a: string, b: string, ty: string) =>
    ucc.relationshipGraph.create({ sourceId: a, targetId: b, type: ty, status: 'ACTIVE' });
  await mk2(treeos.id, treehealth.id, 'contains');
  await mk2(treehealth.id, d_src.id, 'contains');
  await mk2(d_src.id, d_comp.id, 'contains');
  await mk2(d_src.id, d_serv.id, 'contains');
  await mk2(d_src.id, d_data.id, 'contains');
  await mk2(treehealth.id, d_api.id, 'contains');
  await mk2(treehealth.id, d_tests.id, 'contains');
  await mk2(d_comp.id, fi_card.id, 'contains');
  await mk2(d_comp.id, fi_badge.id, 'contains');
  await mk2(d_serv.id, fi_eng.id, 'contains');
  await mk2(d_data.id, fi_thr.id, 'contains');
  await mk2(d_api.id, fi_api.id, 'contains');
  await mk2(d_tests.id, fi_test.id, 'contains');

  // ── FIELDTRACE CODEBASE ──────────────────────────────────────────────
  const ft_src   = await f('src',        { kind: 'folder' });
  const ft_spat  = await f('spatial',    { kind: 'folder' });
  const ft_comp  = await f('components', { kind: 'folder' });
  const ft_serv  = await f('services',   { kind: 'folder' });
  const ft_tests = await f('tests',      { kind: 'folder' });
  const ft_conf  = await f('config',     { kind: 'folder' });

  const ft_map   = await f('map-engine.ts',    { kind: 'file', ext: 'ts',  logicRole: 'Health Engine', deployed: true });
  const ft_cache = await f('offline-cache.ts', { kind: 'file', ext: 'ts',  logicRole: 'API',
                            editing: 'Worker A', modified: true });
  const ft_haz   = await f('hazard-marker.tsx',{ kind: 'file', ext: 'tsx', logicRole: 'UI', modified: true });
  const ft_test  = await f('spatial.test.ts',  { kind: 'file', ext: 'test', logicRole: 'Tests', testCount: '43 ✓' });
  const ft_json  = await f('fieldtrace.json',  { kind: 'file', ext: 'json', logicRole: 'Database', deployed: true });

  await mk2(fieldtrace.id, ft_src.id, 'contains');
  await mk2(ft_src.id, ft_spat.id, 'contains');
  await mk2(ft_src.id, ft_comp.id, 'contains');
  await mk2(ft_src.id, ft_serv.id, 'contains');
  await mk2(fieldtrace.id, ft_tests.id, 'contains');
  await mk2(fieldtrace.id, ft_conf.id, 'contains');
  await mk2(ft_spat.id, ft_map.id, 'contains');
  await mk2(ft_spat.id, ft_cache.id, 'contains');
  await mk2(ft_spat.id, ft_haz.id, 'contains');
  await mk2(ft_tests.id, ft_test.id, 'contains');
  await mk2(ft_conf.id, ft_json.id, 'contains');

  await mk2(ft_map.id, ft_json.id, 'depends_on');
  await mk2(ft_cache.id, ft_map.id, 'depends_on');
  await mk2(ft_haz.id, ft_map.id, 'depends_on');
  await mk2(ft_haz.id, imageshell.id, 'depends_on');   // cross-module: file → module
  await mk2(ft_test.id, ft_map.id, 'depends_on');
  await mk2(worker.id, ft_cache.id, 'assigned_to');
  await mk2(protoIdea.id, nviro.id, 'related_to');

  await ucc.eventLedger.append({ type: 'file.modified', entityId: ft_cache.id, actorId: 'worker-a',
    actorType: 'agent', summary: 'Worker A: added offline map cache with LRU eviction', severity: 'INFO' });
  await ucc.eventLedger.append({ type: 'file.modified', entityId: ft_haz.id, actorId: 'worker-a',
    actorType: 'agent', summary: 'Worker A: hazard marker now reuses Image Shell capture', severity: 'INFO' });
  await ucc.eventLedger.append({ type: 'test.passed', entityId: ft_test.id, actorId: 'ci',
    actorType: 'system', summary: 'Spatial suite: 43/43 passing', severity: 'INFO' });

  // functional dependencies — the "what does this file affect?" projection
  await mk2(fi_eng.id, fi_thr.id, 'depends_on');
  await mk2(fi_api.id, fi_eng.id, 'depends_on');
  await mk2(fi_card.id, fi_api.id, 'depends_on');
  await mk2(fi_card.id, fi_badge.id, 'depends_on');
  await mk2(fi_test.id, fi_eng.id, 'depends_on');

  // module-level truth
  await mk2(treehealth.id, arca.id, 'orchestrated_by');
  await mk2(fieldtrace.id, treehealth.id, 'reads_from');
  await mk2(worker.id, fi_eng.id, 'assigned_to');

  // real ledger history for the hot file
  await ucc.eventLedger.append({ type: 'file.modified', entityId: fi_eng.id, actorId: 'worker-a',
    actorType: 'agent', summary: 'Worker A: extracted RiskThreshold interface', severity: 'INFO' });
  await ucc.eventLedger.append({ type: 'file.modified', entityId: fi_eng.id, actorId: 'worker-a',
    actorType: 'agent', summary: 'Worker A: added canopy-density weighting', severity: 'INFO' });
  await ucc.eventLedger.append({ type: 'test.failed', entityId: fi_test.id, actorId: 'ci',
    actorType: 'system', summary: '2 tests failing: threshold boundary cases', severity: 'ERROR' });

  // ── ONTOLOGY-CORRECTED RELATIONSHIPS ─────────────────────────────────
  // Relationships are first-class truth, not folder nesting.
  const mk = (sourceId: string, targetId: string, type: string) =>
    ucc.relationshipGraph.create({ sourceId, targetId, type, status: 'ACTIVE' });

  await mk(nviro.id, treeos.id, 'contains');            // TreeOS truly lives inside the ecosystem
  await mk(nviro.id, arca.id, 'orchestrated_by');       // ARCA is not a container — it orchestrates
  await mk(nviro.id, buildboard.id, 'tracked_by');      // BuildBoard tracks, doesn't own
  await mk(fieldtrace.id, nviro.id, 'operational_in');
  await mk(fieldtrace.id, treeos.id, 'related_to');
  await mk(fieldtrace.id, arca.id, 'orchestrated_by');
  await mk(fieldtrace.id, buildboard.id, 'assigned_to');
  await mk(fieldtrace.id, deploy.id, 'deployed_to');
  await mk(worker.id, fieldtrace.id, 'assigned_to');
  await mk(imageshell.id, fieldtrace.id, 'related_to');
  await mk(imageshell.id, arca.id, 'managed_by');
  await mk(imageshell.id, treeos.id, 'related_to');

  // ── COMPOSITION LAYER: extraction, shells, containment ──────────────
  const landintel = await ucc.entityRegistry.create({
    type: 'system', name: 'Land Intelligence', status: 'OPERATIONAL', health: 'HEALTHY',
    metadata: { description: 'Land analysis super-system' }, capabilities: [],
    location: { logicalZone: 'ecosystem' },
  });
  const alice = await ucc.entityRegistry.create({
    type: 'application', name: 'Alice', status: 'RUNNING', health: 'HEALTHY',
    metadata: { description: 'Identify usable land from maps + environmental data',
      lifecycle: 'operational', version: '0.8.0' }, capabilities: [],
    location: { logicalZone: 'operations' },
  });
  const mapshell = await ucc.entityRegistry.create({
    type: 'module', name: 'Map Shell', status: 'RUNNING', health: 'HEALTHY',
    metadata: { version: '1.0.0', gate: 'G6', shell: true,
      note: 'extracted from Alice — one module, two contexts' }, capabilities: [],
    location: { logicalZone: 'operations' },
  });
  const idshell = await ucc.entityRegistry.create({
    type: 'module', name: 'Identity Shell', status: 'RUNNING', health: 'HEALTHY',
    metadata: { version: '2.1.0', gate: 'G7', shell: true }, capabilities: [],
    location: { logicalZone: 'operations' },
  });
  const payshell = await ucc.entityRegistry.create({
    type: 'module', name: 'Payment Shell', status: 'RUNNING', health: 'HEALTHY',
    metadata: { version: '1.3.0', gate: 'G6', shell: true }, capabilities: [],
    location: { logicalZone: 'operations' },
  });
  const landscapeos = await ucc.entityRegistry.create({
    type: 'idea', name: 'LandscapeOS', status: 'IDLE', health: 'UNKNOWN',
    metadata: { lifecycle: 'idea', note: 'an app for somebody who runs a landscaping business' },
    capabilities: [], location: { logicalZone: 'ecosystem' },
  });

  // containment WITHOUT swallowing: Alice keeps her ID and history
  await mk2(nviro.id, landintel.id, 'contains');
  await mk2(landintel.id, alice.id, 'contains');
  // extraction provenance + shared reuse: one module, two contexts
  await mk2(mapshell.id, alice.id, 'derived_from');
  await mk2(alice.id, mapshell.id, 'uses');
  await mk2(fieldtrace.id, mapshell.id, 'uses');
  await mk2(landscapeos.id, nviro.id, 'related_to');

  // ── EXTRACTION recorded (correlationId extraction-mapshell) ──────────
  const ext = (type: string, entityId: string, summary: string) =>
    ucc.eventLedger.append({ type, entityId, actorId: 'arca', actorType: 'agent',
      summary, severity: 'INFO', correlationId: 'extraction-mapshell' });
  await ext('graph.searched', alice.id, "ARCA: Alice's map shell capability matches FieldTrace requirement");
  await ext('module.extracted', mapshell.id, 'Map Shell extracted from Alice as reusable canonical module');
  await ext('relationship.created', mapshell.id, 'Alice uses Map Shell · FieldTrace uses Map Shell — one module, two contexts, zero copies');

  // ── COMPOSITION ANALYSIS run through the kernel (compose-landscapeos) ─
  const comp = (type: string, entityId: string, summary: string, details: any = {}) =>
    ucc.eventLedger.append({ type, entityId, actorId: 'arca', actorType: 'agent',
      summary, severity: 'INFO', correlationId: 'compose-landscapeos', details });
  await comp('idea.captured', landscapeos.id,
    'Joe: "I want an app for somebody who runs a landscaping business"');
  const scan = await ucc.relationshipGraph.traverse(nviro.id, 8, 'both');
  await comp('graph.searched', landscapeos.id,
    'ARCA scanned canonical graph: ' + scan.entities.size + ' entities examined for reusable capability');
  const matches = [
    [idshell.id, 'Identity Shell'], [mapshell.id, 'Map Shell'],
    [imageshell.id, 'Image Shell (photo/media)'], [payshell.id, 'Payment Shell'],
    [fieldtrace.id, 'FieldTrace (crew field data)'],
  ];
  for (const [mid, mname] of matches)
    await comp('composition.matched', mid as string, mname + ' ✓ existing', { match: true });
  await comp('composition.gap', landscapeos.id, 'Scheduling △ adaptation needed', { match: false });
  await comp('composition.report', landscapeos.id,
    'Estimated reusable architecture: 5/6 capabilities ≈ 83% · new work: Scheduling + landscape domain rules');

  // ── PROMOTION: LandscapeOS composed → operational product ───────────
  const promo = (type: string, entityId: string, summary: string, details: any = {}) =>
    ucc.eventLedger.append({ type, entityId, actorId: details.actor||'arca', actorType: details.at||'agent',
      summary, severity: 'INFO', correlationId: 'compose-landscapeos', details });
  await promo('owner.approved', landscapeos.id, 'Joe approved composition — build the missing Scheduling capability', { actor: 'joe', at: 'user' });
  for (const [mid] of matches) await mk2(landscapeos.id, mid as string, 'uses');
  const sched = await ucc.entityRegistry.create({
    type: 'module', name: 'Scheduling Shell', status: 'RUNNING', health: 'HEALTHY',
    metadata: { version: '0.1.0', gate: 'G4', shell: true, note: 'the one missing capability, built new' },
    capabilities: [], location: { logicalZone: 'operations' } });
  await mk2(landscapeos.id, sched.id, 'uses');
  await ucc.entityRegistry.update(landscapeos.id, { type: 'application', status: 'RUNNING', health: 'HEALTHY',
    metadata: { lifecycle: 'operational', note: 'composed from 5 existing shells + 1 new', version: '1.0.0' } });
  await promo('lifecycle.promoted', landscapeos.id, 'LandscapeOS promoted: idea → operational product (composed, 83% reused)');

  // ── TENANTS: sovereign instances, one shared shell library ──────────
  const tenant = (name: string, meta: any = {}) => ucc.entityRegistry.create({
    type: 'tenant', name, status: 'RUNNING', health: 'HEALTHY',
    metadata: { plan: 'standard', ...meta }, capabilities: [], location: { logicalZone: 'field' } });
  const dale = await tenant("Dale's Tree Service", { region: 'Muskegon' });
  const brush = await tenant('Brushman Tree Service', { region: 'Jackson' });
  const able = await tenant('Able Tree Service', { region: 'Monroe' });
  await mk2(dale.id, treeos.id, 'instance_of');
  await mk2(brush.id, treeos.id, 'instance_of');
  await mk2(able.id, treeos.id, 'instance_of');
  // Brushman extends his own world without forking anyone's
  const stump = await ucc.entityRegistry.create({
    type: 'module', name: 'Stump-Grinding Module', status: 'RUNNING', health: 'HEALTHY',
    metadata: { version: '0.2.0', builtBy: 'Brushman', extractable: true }, capabilities: [],
    location: { logicalZone: 'field' } });
  await mk2(brush.id, stump.id, 'contains');
  await ucc.eventLedger.append({ type: 'tenant.igniited', entityId: dale.id, actorId: 'joe', actorType: 'user',
    summary: "Dale's Tree Service ignited on TreeOS platform", severity: 'INFO', correlationId: 'tenants' });
  await ucc.eventLedger.append({ type: 'tenant.ignited', entityId: brush.id, actorId: 'joe', actorType: 'user',
    summary: 'Brushman Tree Service ignited — building custom stump-grinding module', severity: 'INFO', correlationId: 'tenants' });
  await ucc.eventLedger.append({ type: 'tenant.ignited', entityId: able.id, actorId: 'joe', actorType: 'user',
    summary: 'Able Tree Service ignited on TreeOS platform', severity: 'INFO', correlationId: 'tenants' });

  // ── DEMAND-DRIVEN EVOLUTION: request → extension → overlap → shell → core ──
  const dd = (type: string, entityId: string, summary: string, details: any = {}) =>
    ucc.eventLedger.append({ type, entityId, actorId: details.actor||'arca',
      actorType: details.at||'agent', summary, severity: 'INFO',
      correlationId: 'demand-evolution', details });

  // shared shells that already exist in the belt
  const shellMk = (name: string, v: string) => ucc.entityRegistry.create({
    type: 'module', name, status: 'RUNNING', health: 'HEALTHY',
    metadata: { version: v, shell: true }, capabilities: [], location: { logicalZone: 'operations' } });
  const acctShell = await shellMk('Accounting Shell', '1.4.0');
  const jobCost   = await shellMk('Job Costing', '1.1.0');
  const equipLed  = await shellMk('Equipment Ledger', '0.9.0');

  // 1) CUSTOMER REQUEST — Dale is the actor
  const daleCaps = ['general-ledger','equipment-depreciation','job-costing','equipment-ledger',
                    'invoice-export','tax-categories','report-builder','profitability-dashboard'];
  await dd('request.captured', dale.id,
    'Dale: "I need a custom accounting workflow for equipment depreciation and job profitability"',
    { actor: 'dale', at: 'user', capabilities: daleCaps });
  const scan2 = await ucc.relationshipGraph.traverse(nviro.id, 8, 'both');
  await dd('graph.searched', arca.id,
    'ARCA checked the graph before building from scratch: Accounting Shell, Job Costing, Equipment Ledger already exist ('
    + scan2.entities.size + ' entities scanned)');

  // 2) CUSTOM EXTENSION — belongs to Dale, runs in TreeOS, uses shells
  const daleExt = await ucc.entityRegistry.create({
    type: 'extension', name: 'Dale Accounting Extension', status: 'RUNNING', health: 'HEALTHY',
    metadata: { owner: 'dale', capabilities: daleCaps }, capabilities: [],
    location: { logicalZone: 'field' } });
  await mk2(daleExt.id, dale.id, 'part_of');
  await mk2(daleExt.id, treeos.id, 'operational_in');
  await mk2(daleExt.id, acctShell.id, 'uses');
  await mk2(daleExt.id, jobCost.id, 'uses');
  await mk2(daleExt.id, equipLed.id, 'uses');
  await dd('extension.created', daleExt.id,
    'Dale Accounting Extension created — customer-scoped, zero forking, uses 3 existing shells');

  // 3) SECOND REQUEST + OVERLAP DETECTED — a real intersection
  const abelCaps = ['general-ledger','crew-profit-split','job-costing','equipment-ledger',
                    'invoice-export','tax-categories','report-builder','profitability-dashboard'];
  await dd('request.captured', able.id,
    'Abel: "We need job profitability and equipment accounting too"',
    { actor: 'abel', at: 'user', capabilities: abelCaps });
  const shared = daleCaps.filter((c) => abelCaps.includes(c));
  const overlapPct = Math.floor(100 * shared.length / Math.max(daleCaps.length, abelCaps.length));
  await dd('overlap.detected', daleExt.id,
    'Dale Accounting Extension and Abel request overlap ' + overlapPct + '% ('
    + shared.length + '/' + daleCaps.length + ' capabilities) — extract shared capability?',
    { overlapPct, shared });

  // 4) OWNER GATE → SHARED SHELL EXTRACTION (derived_from intact)
  const gate = await ucc.capabilityBroker.request({ actorId: 'joe', actorType: 'user',
    entityId: daleExt.id, capability: 'update', parameters: { action: 'extract shared shell' } });
  await dd('gate.decision', daleExt.id, 'Extraction gate — broker: ' + gate.decision, { decision: gate.decision });
  await dd('owner.approved', daleExt.id, 'Joe approved: extract Tree Accounting Shell', { actor: 'joe', at: 'user' });

  const treeAcct = await ucc.entityRegistry.create({
    type: 'module', name: 'Tree Accounting Shell', status: 'RUNNING', health: 'HEALTHY',
    metadata: { version: '1.0.0', shell: true, tier: 'shared', capabilities: shared },
    capabilities: [], location: { logicalZone: 'operations' } });
  await mk2(treeAcct.id, daleExt.id, 'derived_from');
  await mk2(daleExt.id, treeAcct.id, 'uses');            // Dale keeps depreciation as his thin extension
  const abelExt = await ucc.entityRegistry.create({
    type: 'extension', name: 'Abel Accounting Extension', status: 'RUNNING', health: 'HEALTHY',
    metadata: { owner: 'abel', note: 'thin — crew-profit-split only' }, capabilities: [],
    location: { logicalZone: 'field' } });
  await mk2(abelExt.id, able.id, 'part_of');
  await mk2(abelExt.id, treeAcct.id, 'uses');
  await dd('module.extracted', treeAcct.id,
    'Tree Accounting Shell extracted from Dale Accounting Extension — differences remain as thin extensions');

  // 5) ADOPTION → CORE CAPABILITY
  await mk2(brush.id, treeAcct.id, 'uses');
  await dd('shell.adopted', brush.id, 'Brushman adopts Tree Accounting Shell (3rd consumer)');
  await mk2(treeos.id, treeAcct.id, 'uses');
  await ucc.entityRegistry.update(treeAcct.id, { metadata: { version: '1.0.0', shell: true, tier: 'core', capabilities: shared } });
  await dd('core.promoted', treeAcct.id,
    'Tree Accounting Shell promoted to TreeOS Core Capability — born from a customer request');

  // ── ALICE AS INTELLIGENCE ENGINE: violet module family ──────────────
  await ucc.entityRegistry.update(alice.id, { metadata: {
    description: 'Land-intelligence engine — a family of reusable ingestion + analysis capabilities',
    lifecycle: 'operational', version: '0.9.0', familyColor: '#8b5cf6', familyRoot: true } });
  const aMod = (name: string, familyColor: string, extra: any = {}) =>
    ucc.entityRegistry.create({ type: 'module', name, status: extra.status||'RUNNING',
      health: extra.health||'HEALTHY',
      metadata: { shell: true, family: 'alice', familyColor, version: '1.0.0', ...extra.meta },
      capabilities: [], location: { logicalZone: 'operations' } });
  const aParcel = await aMod('Alice Parcel', '#818cf8');            // violet-blue
  const aHydro  = await aMod('Alice Hydrology', '#7dd3fc',
    { status: 'STALLED', health: 'WARNING', meta: { note: 'upstream sensor feed delayed' } }); // violet-cyan
  const aTerra  = await aMod('Alice Terrain', '#5eead4');           // violet-teal
  const aZone   = await aMod('Alice Zoning', '#fbbf24');            // violet-amber
  const aImg    = await aMod('Alice Imagery', '#e879f9');           // violet-magenta
  const aLoc    = await aMod('Alice Location Intelligence', '#a78bfa'); // brighter violet
  for (const m of [aParcel,aHydro,aTerra,aZone,aImg,aLoc]) await mk2(m.id, alice.id, 'part_of');

  // cross-app reuse: same modules, no copies
  await mk2(treeos.id, aParcel.id, 'uses');
  await mk2(treeos.id, aImg.id, 'uses');
  await mk2(treeos.id, aLoc.id, 'uses');

  // ── ARCA COMPOSES A NEW WORLD FROM ALICE (alice-composition) ────────
  const homestead = await ucc.entityRegistry.create({
    type: 'idea', name: 'Homestead Finder', status: 'IDLE', health: 'UNKNOWN',
    metadata: { lifecycle: 'idea', familyColor: '#f59e0b',
      note: 'find land you could actually live on' },
    capabilities: [], location: { logicalZone: 'ecosystem' } });
  await mk2(homestead.id, nviro.id, 'related_to');
  const ac = (type: string, entityId: string, summary: string, details: any = {}) =>
    ucc.eventLedger.append({ type, entityId, actorId: details.actor||'arca',
      actorType: details.at||'agent', summary, severity: 'INFO',
      correlationId: 'alice-composition', details });
  await ac('idea.captured', homestead.id,
    'Joe: "an app that finds land you could actually homestead on"', { actor: 'joe', at: 'user' });
  await ac('needs.analyzed', homestead.id,
    'This app needs: parcel boundaries · water proximity · terrain · zoning');
  const provided = [aParcel, aHydro, aTerra, aZone];
  await ac('graph.searched', alice.id,
    'ARCA: Alice already provides all four — no new ingestion work required');
  for (const m of provided) {
    await mk2(homestead.id, m.id, 'uses');
    await ac('composition.matched', m.id, m.name + ' ✓ Alice provides', { match: true });
  }
  await ac('composition.report', homestead.id,
    'Homestead Finder composed: 4/4 core capabilities from the Alice family · violet provenance preserved in every host');

  // ── LATENT DISCOVERY: a real graph computation ───────────────────────
  const lat = (type: string, entityId: string, summary: string, details: any = {}) =>
    ucc.eventLedger.append({ type, entityId, actorId: 'arca', actorType: 'agent',
      summary, severity: 'INFO', correlationId: 'latent-discovery', details });
  const allE = await ucc.entityRegistry.list();
  const shells = allE.filter((e) => e.metadata && (e.metadata as any).shell);
  const consumedBy: Record<string, string[]> = {};
  for (const sh of shells) {
    const inRels = await ucc.relationshipGraph.findByTarget(sh.id);
    consumedBy[sh.id] = inRels.filter((r) => r.type === 'uses').map((r) => r.sourceId);
  }
  await lat('latent.scan', nviro.id,
    'ARCA scanned ' + shells.length + ' reusable shells across ' + allE.length + ' entities for high-overlap combinations with no parent product');
  // candidate: Homestead Planner = map + identity + image + scheduling + parcel-analysis(missing)
  const combo = [mapshell, idshell, imageshell, sched];
  for (const c of combo) await lat('latent.member', c.id, c.name + ' ✓ existing');
  await lat('latent.gap', nviro.id, 'Parcel-analysis workflow △ missing (extractable from Alice)');
  await lat('latent.candidate', nviro.id,
    'Latent product: HOMESTEAD PLANNER · coverage ' + combo.length + '/' + (combo.length + 1) + ' = ' +
    Math.round(100 * combo.length / (combo.length + 1)) + '% existing · no current parent product consumes this combination');

  // ── GENESIS: creation history recorded to the ledger ────────────────
  const born = (entityId: string, summary: string, details: any = {}) =>
    ucc.eventLedger.append({ type: 'entity.created', entityId, actorId: 'joe',
      actorType: 'user', summary, severity: 'INFO', correlationId: 'genesis', details });

  await born(nviro.id, 'NviroGear ecosystem founded');
  await born(arca.id, 'ARCA orchestration engine online');
  await born(buildboard.id, 'BuildBoard tracking online');
  await born(treeos.id, 'TreeOS application created');
  await born(fieldtrace.id, 'FieldTrace v0.1 — first mapping prototype', { version: 'v0.1' });
  await born(imageshell.id, 'Image Shell module extracted');
  await ucc.eventLedger.append({ type: 'milestone', entityId: fieldtrace.id, actorId: 'worker-a',
    actorType: 'agent', summary: 'FieldTrace v0.4 — offline cache added', severity: 'INFO',
    correlationId: 'genesis', details: { version: 'v0.4' } });
  await born(worker.id, 'Worker A commissioned');
  await born(deploy.id, 'Production environment stood up');
  await ucc.eventLedger.append({ type: 'milestone', entityId: fieldtrace.id, actorId: 'joe',
    actorType: 'user', summary: 'FieldTrace v1.0 — first production deploy', severity: 'INFO',
    correlationId: 'genesis', details: { version: 'v1.0' } });
  await born(treehealth.id, 'Tree Health module started (G4)');
  await born(protoIdea.id, 'Idea captured: Artwork-First Storefront (proto-star)');
  await born(landintel.id, 'Land Intelligence system established');
  await born(alice.id, 'Alice v0.1 — land analysis prototype', { version: 'alice' });
  await born(mapshell.id, 'Map Shell extracted from Alice (reusable)');
  await born(idshell.id, 'Identity Shell reaches G7');
  await born(payshell.id, 'Payment Shell reaches G6');
  await born(landscapeos.id, 'New star ignited: LandscapeOS');
  await born(sched.id, 'Scheduling Shell built (the missing capability)');
  await born(dale.id, "Dale's Tree Service joins as tenant");
  await born(brush.id, 'Brushman Tree Service joins as tenant');
  await born(able.id, 'Able Tree Service joins as tenant');
  await born(stump.id, 'Brushman builds Stump-Grinding Module (extractable)');
  await born(daleExt.id, 'Dale Accounting Extension created from customer request');
  await born(treeAcct.id, 'Tree Accounting Shell extracted → promoted to TreeOS core');
  await born(aParcel.id, 'Alice module family established: Parcel, Hydrology, Terrain, Zoning, Imagery, Location Intelligence');
  await born(homestead.id, 'New star: Homestead Finder — composed 4/4 from Alice');

  // ── PROPOSAL PHASE (correlationId idea-001) — real kernel operations ──
  const IDEA = 'idea-001';
  const say = (type: string, entityId: string, summary: string, details: any = {}) =>
    ucc.eventLedger.append({
      type, entityId, actorId: details.actor || 'arca',
      actorType: details.actorType || 'system', summary, severity: 'INFO',
      correlationId: details.cid || IDEA, details,
    });

  await say('idea.captured', fieldtrace.id,
    'Joe: "I want the crew to mark a hazard by pointing their phone at it"',
    { actor: 'joe', actorType: 'user', spokenIn: 'FieldTrace Room' });

  const hoodT = await ucc.relationshipGraph.traverse(fieldtrace.id, 3, 'both');
  const hood = await Promise.all([...hoodT.entities].map((id) => ucc.entityRegistry.read(id)));
  const hit = hood.find((e) => e && e.name === 'Image Shell');
  await say('graph.searched', arca.id,
    'ARCA searched canonical graph: camera/media capture exists in Image Shell (' + hood.length + ' entities scanned)',
    { match: hit ? hit.id : null });

  const proposal = await ucc.capabilityBroker.request({
    actorId: 'arca', actorType: 'agent', entityId: fieldtrace.id, capability: 'update',
    context: { idea: IDEA }, parameters: { proposal: 'point-to-mark hazard capture via Image Shell' },
  });
  await say('proposal.routed', imageshell.id,
    'Proposal routed — reuse Image Shell capture · broker: ' + proposal.decision,
    { decision: proposal.decision });

  // ── OWNER GATE + EXECUTION PHASE (correlationId idea-001-exec) ───────
  const EXEC = 'idea-001-exec';
  await say('owner.approved', fieldtrace.id,
    'Joe approved: point-to-mark hazard capture', { actor: 'joe', actorType: 'user', cid: EXEC });
  await say('agent.assigned', worker.id,
    'Worker A assigned — hazard capture via Image Shell', { cid: EXEC, actor: 'arca' });
  await say('build.started', fieldtrace.id,
    'Worker A: building hazard-pin capture on fieldtrace/spatial-v1', { cid: EXEC, actor: 'worker-a', actorType: 'agent' });
  await say('test.passed', fieldtrace.id,
    'Tests passed 47/47 (4 new hazard-capture tests)', { cid: EXEC, actor: 'ci', actorType: 'system' });
  await say('deployment.completed', deploy.id,
    'Deployed to Production — hazard capture live', { cid: EXEC, actor: 'joe', actorType: 'user' });

  const ideaTrace = await ucc.eventLedger.listByCorrelation(IDEA);
  const ideaTraceExec = await ucc.eventLedger.listByCorrelation(EXEC);

  const contexts = [
    { name: 'NviroGear', id: nviro.id }, { name: 'TreeOS', id: treeos.id },
    { name: 'ARCA', id: arca.id }, { name: 'BuildBoard', id: buildboard.id },
  ];
  const contextProjections: Record<string, any> = {};
  for (const c of contexts) {
    contextProjections[c.name] = await ucc.projectionEngine.getContextProjection(fieldtrace.id, c.name);
  }
  const capabilityDecisions: Record<string, any> = {};
  for (const capability of ['inspect', 'logs', 'update', 'deploy_production']) {
    capabilityDecisions[capability] = await ucc.capabilityBroker.request({
      actorId: 'joe', actorType: 'user', entityId: fieldtrace.id, capability,
    });
  }

  // ── PHASE 5: THE KERNEL OBSERVES ITSELF INTO ITS OWN UNIVERSE ────────
  const kernelWorld = await ucc.entityRegistry.create({
    type: 'system', name: 'UCC Kernel', status: 'RUNNING', health: 'HEALTHY',
    metadata: { description: 'The command center itself — observed from the real filesystem, not typed in',
      familyColor: '#e8eaf0' }, capabilities: [], location: { logicalZone: 'ecosystem' } });
  await mk2(nviro.id, kernelWorld.id, 'contains');
  await ucc.capabilityBroker.grant('fs-observer', 'fs.observe');
  const fsObs = new FilesystemObserver(ucc.entityRegistry, ucc.relationshipGraph,
    ucc.eventLedger, ucc.capabilityBroker);
  const coreDir = require('path').resolve(__dirname, '../core/src');
  const observations = await fsObs.observe(coreDir, 'phase5-self');
  await fsObs.resolve(coreDir, kernelWorld.id, 'represented_by');
  const admittedFiles = await fsObs.admit(observations, kernelWorld.id, 'phase5-self');

  // ── PHASE 6: ONE GATED REAL EFFECT, RE-OBSERVED — THE LOOP CLOSES ────
  await ucc.capabilityBroker.grant('arca', 'fs.write');
  const eff = new FilesystemEffector(ucc.eventLedger, ucc.capabilityBroker);
  const loopDir = require('path').resolve(__dirname, 'loop');
  require('fs').mkdirSync(loopDir, { recursive: true });
  const reportPath = require('path').join(loopDir, 'SELF_OBSERVED.md');
  await eff.writeFile({ actorId: 'arca', actorType: 'agent', filePath: reportPath,
    correlationId: 'closed-loop', purpose: 'nervous-system loop proof',
    content: '# Self-Observed\n\nThis file was written by a broker-authorized effector (arca → fs.write),\nthen re-observed by the read-only filesystem adapter, then admitted to the\ncanonical graph with provenance. Kernel → Reality → Kernel.\n\nEntities observed from packages/core/src: ' + admittedFiles.length + '\n' });
  const loopObs = await fsObs.observe(loopDir, 'closed-loop');
  const loopFile = loopObs.filter(o => o.externalRef === reportPath);
  await fsObs.admit(loopFile, kernelWorld.id, 'closed-loop');
  // a refused attempt, for honest contrast: the observer identity tries to write
  await eff.writeFile({ actorId: 'fs-observer', actorType: 'system',
    filePath: reportPath, content: 'x', correlationId: 'closed-loop' });


  const t = await ucc.relationshipGraph.traverse(nviro.id, 8, 'both');
  const rels: any[] = [];
  const seen = new Set<string>();
  for (const r of t.relationships) { if (!seen.has(r.id)) { rels.push(r); seen.add(r.id); } }
  for (const r of await ucc.relationshipGraph.findInvolvingEntity(fieldtrace.id)) {
    if (!seen.has(r.id)) { rels.push(r); seen.add(r.id); }
  }

  // ── PERSPECTIVE DEMO: three callers, one FieldTrace, sanctioned views ─
  await ucc.projectionEngine.registerContextLens({
    name: 'trios', version: 'trios-v8',
    allowedRelationships: ['related_to','uses','instance_of','operational_in','reads_from'],
    maxHops: 1, denied: ['orchestration internals','build infrastructure','unrelated tenants'] });
  await ucc.projectionEngine.registerContextLens({
    name: 'arca', version: 'arca-v3',
    allowedRelationships: ['orchestrated_by','deployed_to','depends_on','derived_from','uses'],
    maxHops: 1 });
  await ucc.capabilityBroker.grant('trios-ui', 'graph.read.trios');
  await ucc.capabilityBroker.grant('arca-core', 'graph.read.arca');
  const pTrios = await ucc.projectionEngine.project({ subject: fieldtrace.id,
    requestedContext: 'trios', caller: { actorId: 'trios-ui', actorType: 'system', tenant: 'dale-tree-service' }, purpose: 'operations' });
  const pArca = await ucc.projectionEngine.project({ subject: fieldtrace.id,
    requestedContext: 'arca', caller: { actorId: 'arca-core', actorType: 'agent' }, purpose: 'orchestration' });
  const pDenied = await ucc.projectionEngine.project({ subject: fieldtrace.id,
    requestedContext: 'arca', caller: { actorId: 'trios-ui', actorType: 'system' }, purpose: 'operations' });

  const state = {
    perspective: {
      trios: { edges: pTrios.edges, names: Object.fromEntries(pTrios.entities.map(e=>[e.id,e.name])), receipt: pTrios.receipt },
      arca: { edges: pArca.edges, names: Object.fromEntries(pArca.entities.map(e=>[e.id,e.name])), receipt: pArca.receipt },
      denied: { authorized: pDenied.authorized, receipt: pDenied.receipt },
    },
    generatedAt: new Date().toISOString(),
    generatedBy: 'Phase 0 kernel (@ucc/core) — seed.ts',
    entities: await ucc.entityRegistry.list(),
    relationships: rels,
    events: await ucc.eventLedger.listByEntity(fieldtrace.id),
    contextProjections, capabilityDecisions,
    ideaTrace, ideaTraceExec,
    compositionTrace: await ucc.eventLedger.listByCorrelation('compose-landscapeos'),
    extractionTrace: await ucc.eventLedger.listByCorrelation('extraction-mapshell'),
    compositionTargets: { star: landscapeos.id, shells: [idshell.id, mapshell.id, imageshell.id, payshell.id, fieldtrace.id] },
    latentTrace: await ucc.eventLedger.listByCorrelation('latent-discovery'),
    tenants: [dale.id, brush.id, able.id],
    kernelWorld: kernelWorld.id, kernelFiles: admittedFiles.length,
    loopTrace: (await ucc.eventLedger.listByCorrelation('closed-loop')).slice(0, 12),
    aliceTrace: await ucc.eventLedger.listByCorrelation('alice-composition'),
    aliceTargets: { alice: alice.id, star: homestead.id,
      modules: [aParcel.id, aHydro.id, aTerra.id, aZone.id] },
    demandTrace: await ucc.eventLedger.listByCorrelation('demand-evolution'),
    demandTargets: { dale: dale.id, abel: able.id, brush: brush.id, arca: arca.id, treeos: treeos.id,
      daleExt: daleExt.id, abelExt: abelExt.id, shell: treeAcct.id,
      acctShells: [acctShell.id, jobCost.id, equipLed.id] },
    containment: { boundary: landintel.id, inside: alice.id },
    allEvents: await ucc.eventLedger.getRecent(400),
    ideaTargets: {
      fieldtrace: fieldtrace.id, arca: arca.id, imageshell: imageshell.id,
      worker: worker.id, production: deploy.id, room: nviro.id,
    },
    focusEntityId: fieldtrace.id,
    contextEntityIds: Object.fromEntries(contexts.map((c) => [c.name, c.id])),
  };

  fs.writeFileSync(path.join(__dirname, 'state.json'), JSON.stringify(state, null, 2));
  console.log('Entities:', state.entities.length, '| Relationships:', state.relationships.length);
  console.log('Proposal trace:', ideaTrace.length, 'events | Exec trace:', ideaTraceExec.length, 'events');
  console.log('Broker gate decision:', proposal.decision);
  console.log('Same ID in all contexts:', Object.values(contextProjections).every((p: any) => p.entityId === fieldtrace.id));
  ucc.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
