import type { Block } from "../types";
import knowledgeFile from "./knowledge.json";
import processFile from "./six-process.json";
import stepsFile from "./steps.json";
import type { FlowFile, FlowProcess, FlowStep, KnowledgeModule, ProcessFile, Station } from "./types";

interface NodeDoc {
  id: string;
  title: string;
  blocks: Block[];
}

const rawNodes = import.meta.glob("../map/nodes/*.json", {
  eager: true,
  import: "default",
}) as Record<string, NodeDoc>;

export const NODE_BY_ID = new Map(Object.values(rawNodes).map((node) => [node.id, node]));

const rawStations = import.meta.glob("./stations/*.json", {
  eager: true,
  import: "default",
}) as unknown as Record<string, Station>;

export const FLOW = stepsFile as unknown as FlowFile;
export const FLOW_STEPS: FlowStep[] = [...FLOW.steps].sort((a, b) => a.no - b.no);
export const STATIONS: Station[] = Object.values(rawStations).sort((a, b) => a.no - b.no);
export const STATION_BY_ID = new Map(STATIONS.map((station) => [station.id, station]));
export const KNOWLEDGE = (knowledgeFile as unknown as { modules: KnowledgeModule[] }).modules;
export const STEP_BY_ID = new Map(FLOW_STEPS.map((step) => [step.id, step]));

export const PROCESS_FILE = processFile as unknown as ProcessFile;
export const PROCESSES: FlowProcess[] = PROCESS_FILE.processes;
export const PROCESS_BY_ID = new Map(PROCESSES.map((process) => [process.id, process]));
export const PROCESS_BY_STEP = new Map(
  PROCESSES.flatMap((process) => process.steps.map((stepId) => [stepId, process] as const))
);

/** 内部八步 → 六站。旧地址、旧 hook 都从这里归一。 */
export const STATION_BY_STEP = new Map(
  STATIONS.flatMap((station) => station.steps.map((stepId) => [stepId, station] as const))
);

export function processForStep(stepId: string): FlowProcess | undefined {
  return PROCESS_BY_STEP.get(stepId);
}

/** 站 id 就是工序 id；六站之外一律视为空。 */
export function processForStation(stationId: string): FlowProcess | undefined {
  return PROCESS_BY_ID.get(stationId);
}

/** 一条工序里的步骤，按骨架序号排，不另排顺序。 */
export function stepsOfProcess(processId: string): FlowStep[] {
  const process = PROCESS_BY_ID.get(processId);
  if (!process) return [];
  return FLOW_STEPS.filter((step) => process.steps.includes(step.id));
}

export function getStation(id: string | undefined): Station | undefined {
  return id ? STATION_BY_ID.get(id) : undefined;
}

/** 把站 id 或旧的步骤 id 归一成六站 id。 */
export function canonicalStationId(id: string | undefined): string | undefined {
  if (!id) return undefined;
  if (STATION_BY_ID.has(id)) return id;
  return STATION_BY_STEP.get(id)?.id;
}

/** 旧步骤 id 落到它所属的六站。 */
export function stationForStep(stepId: string): Station | undefined {
  return STATION_BY_STEP.get(stepId) ?? STATION_BY_ID.get(stepId);
}

export function stepTitle(stepId: string): string {
  return STEP_BY_ID.get(stepId)?.title ?? stepId;
}

/** 只留下挂在这一站的模块：站里任一内部步骤的 hook 都算。 */
export function modulesFor(stationId: string): KnowledgeModule[] {
  const station = STATION_BY_ID.get(stationId);
  const hooks = new Set(station?.steps ?? [stationId]);
  const keep = (module: KnowledgeModule): KnowledgeModule | null => {
    if (!module.hooks.some((hook) => hooks.has(hook))) return null;
    const children = (module.children ?? [])
      .map(keep)
      .filter((child): child is KnowledgeModule => child !== null);
    return { ...module, children };
  };

  return KNOWLEDGE.map(keep).filter((module): module is KnowledgeModule => module !== null);
}

export function countModules(modules: KnowledgeModule[]): number {
  return modules.reduce((total, module) => total + 1 + countModules(module.children ?? []), 0);
}

export function moduleDepth(modules: KnowledgeModule[]): number {
  return modules.reduce(
    (deepest, module) => Math.max(deepest, 1 + moduleDepth(module.children ?? [])),
    0
  );
}

/** 在某一站的知识树里找模块，并带出从顶层到父级的路径。 */
export interface ModuleLocation {
  module: KnowledgeModule;
  ancestors: KnowledgeModule[];
}

export function findModule(stationId: string, moduleId: string): ModuleLocation | undefined {
  const walk = (
    list: KnowledgeModule[],
    ancestors: KnowledgeModule[]
  ): ModuleLocation | undefined => {
    for (const module of list) {
      if (module.id === moduleId) return { module, ancestors };
      const found = walk(module.children ?? [], [...ancestors, module]);
      if (found) return found;
    }
    return undefined;
  };
  return walk(modulesFor(stationId), []);
}

/** 树的先序展开：用于上一则 / 下一则，不改变层级本身。 */
export function flattenModules(modules: KnowledgeModule[]): KnowledgeModule[] {
  return modules.flatMap((module) => [module, ...flattenModules(module.children ?? [])]);
}

/** 节点正文 + 站内补写正文，按顺序拼成模块内容。 */
export function blocksForModule(module: KnowledgeModule): Block[] {
  const fromNodes = (module.nodes ?? []).flatMap((id) => NODE_BY_ID.get(id)?.blocks ?? []);
  return [...fromNodes, ...(module.blocks ?? [])];
}

/** 首页统计：步数、已铺站数、知识模块总数。 */
export function flowStats() {
  return {
    steps: FLOW_STEPS.length,
    stations: STATIONS.length,
    modules: KNOWLEDGE.reduce((total, module) => total + 1 + countModules(module.children ?? []), 0),
  };
}
