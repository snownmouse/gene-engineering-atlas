import type { Block, FigureId } from "../types";

/** 骨架层：一次基因工程的最短可执行流程，一步只做一件事。 */
export interface FlowStep {
  id: string;
  no: number;
  title: string;
  en: string;
  /** 一句话说明这一步在做什么 */
  oneLine: string;
  /** 支线说明：只挂在步骤上，不占主轴 */
  side?: string;
}

/** 知识层：挂在某一步（或多步）上的展开模块，可以继续嵌套。 */
export interface KnowledgeModule {
  id: string;
  title: string;
  en: string;
  /** 这个模块服务的步骤；可以是多个步骤 */
  hooks: string[];
  summary: string;
  /** 模块定位：回答「这个模块服务流程里的哪一步」 */
  note?: string;
  /** 正文来自 src/data/map/nodes/*.json，避免复制维护 */
  nodes?: string[];
  /** 站内补写的正文块（连接条件等节点里没有的部分） */
  blocks?: Block[];
  children?: KnowledgeModule[];
}

/** 知识点页面：一页只讲一件事，供页面视图逐页翻。 */
export interface KnowledgeItem {
  id: string;
  title: string;
  en?: string;
  kind: "概念" | "判据" | "方法" | "背景" | "支线" | "考点";
  /** 考点题型：只有 kind=考点 时填写，用于页眉与清单区分 */
  examType?: "名词解释" | "简答论述" | "计算题" | "实验设计";
  /** 一句话定义 */
  line: string;
  /** 关键参数或判据 */
  params?: string[];
  /** 难点与边界：卡在哪、常见失败模式、什么条件下不适用 */
  limits?: string;
  /** 本页配套的过程演示 */
  demo?: import("../types").DemoId;
  /** 易混点 */
  confuse?: string;
  /** 真实存在的口径分歧，原样并列 */
  dispute?: string;
  /** 附表：沿用正文表格的渲染 */
  table?: { head: string[]; rows: string[][]; caption?: string };
  /** 配图：复用已有的手绘 figure 组件 */
  figure?: FigureId;
  /** 配图说明：画在 figure 下方 */
  figureCaption?: string;
  /** 位图：public 下的静态图，如蛋白结构截图 */
  image?: { src: string; alt: string; caption?: string };
  /** 展开细读对应的现有子模块；复用原路由 */
  moduleId?: string;
  /** 关联术语 id，供术语抽屉反查 */
  terms?: string[];
}

export interface StationMustStep {
  no: string;
  title: string;
  body: string;
  /** 这一步最少的判断 */
  check: string;
}

export interface StationEdgeItem {
  label: string;
  title: string;
  text: string;
  /** 资料未覆盖或口径不一致，标「口径」 */
  pending?: boolean;
  pendingNote?: string;
}

export interface Station {
  id: string;
  no: number;
  /** 对外只露这一个字：切、接、转、增、检、养 */
  char: string;
  /** 内部八步里归到这一站的步骤；只在数据层使用，不对外显示 */
  steps: string[];
  title: string;
  en: string;
  kicker: string;
  /** 这一站要回答的问题 */
  question: string;
  summary: string;
  /** 在整条骨架里的位置 */
  position: string;
  must: {
    lead: string;
    steps: StationMustStep[];
    gate: string;
  };
  edge: {
    lead: string;
    items: StationEdgeItem[];
  };
  bridge: {
    from: string;
    to: string;
  };
  source: string;
}

export interface FlowFile {
  title: string;
  note: string;
  steps: FlowStep[];
}

/** 叙事层：六工序只是讲法，一步归一序，不另建一套步骤数据。 */
export interface FlowProcess {
  id: string;
  char: string;
  title: string;
  en: string;
  gloss: string;
  steps: string[];
}

export interface ProcessFile {
  note: string;
  processes: FlowProcess[];
}
