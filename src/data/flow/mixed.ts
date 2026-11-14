import type { Block } from "../types";

/**
 * 混排视图：前段概念走条目，后段必须按顺序成立的操作/配方保留为原文段。
 * 只按块的特征挑「操作段」，不写死下标，正文增删后仍能对上。
 */
export interface MixedView {
  /** 哪一类块留在页面上作「段」 */
  keep: (block: Block) => boolean;
  title: string;
  hint: string;
}

const ordered = (block: Block) => block.type === "list" && block.ordered === true;
const figure = (block: Block) => block.type === "figure";
const table = (block: Block, head: string) =>
  block.type === "table" && block.head[0] === head;
const note = (block: Block, title: string) =>
  block.type === "note" && block.title.includes(title);

export const MIXED_VIEWS: Record<string, MixedView> = {
  sequencing: {
    // 测序页的表格与图本身就是参考件，全部保留在条目之后，不压缩成条目。
    keep: () => true,
    title: "四平台对照与 Sanger 操作",
    hint: "前面几页讲原理与考点；这里保留完整对照表、五步操作与三张原理图。",
  },
  hybridization: {
    keep: (block) => ordered(block) || figure(block) || table(block, "探针"),
    title: "Southern 杂交操作",
    hint: "七步转膜杂交与探针四型；变性、Tm 与严格度查上面几页。",
  },
  qpcr: {
    keep: (block) => ordered(block) || figure(block) || table(block, "化学"),
    title: "qPCR 程序与曲线",
    hint: "四段程序与扩增曲线；Ct、定量方式与效率口径查上面几页。",
  },
  "pcr-target": {
    keep: (block) => ordered(block) || table(block, "类型"),
    title: "PCR 扩增与变体",
    hint: "扩增三步与五种变体；循环原理、引物参数与前提查上面几页。",
  },
  library: {
    keep: (block) =>
      ordered(block) || table(block, "物种") || table(block, "策略"),
    title: "建库六步与筛选",
    hint: "从材料到保存的六步、克隆数表与四种筛选；两类文库的分工查上面几页。",
  },
  "yeast-two-hybrid": {
    keep: (block) => ordered(block) || figure(block) || table(block, "局限"),
    title: "双杂交操作与筛选",
    hint: "四步筛选与三缺/四缺判读；BD/AD 原理、质粒与对照查上面几页。",
  },
  "inclusion-body": {
    keep: (block) =>
      ordered(block) || figure(block) || table(block, "优点") || note(block, "复性无活性"),
    title: "包涵体处理与复性",
    hint: "破碎到复性的五步、利弊表与七条复性排查；内因外因查上面几页。",
  },
  "fusion-purification": {
    keep: (block) => ordered(block) || figure(block) || table(block, "标签／载体"),
    title: "五类标签与 GST 纯化",
    hint: "五种标签的洗脱逻辑与 GST 六步；树脂参数与构建原则查上面几页。",
  },
  "ecoli-expression": {
    keep: (block) => table(block, "参数") || note(block, "表达无带"),
    title: "诱导表达与无带排查",
    hint: "诱导参数、八条无带排查；宿主优劣、调控与元件查上面几页。",
  },
  "ecoli-vector-lines": {
    keep: (block) => ordered(block) || table(block, "载体"),
    title: "载体谱系与构建",
    hint: "三种载体谱系与构建六步；载体类型、宿主分工与读框查上面几页。",
  },
  delivery: {
    keep: (block) => block.type === "demo",
    title: "微生物转化四步",
    hint: "感受态制备、热激、复苏、涂板；五种方法参数与递送平台查上面几页。",
  },
  "delivery-routes": {
    keep: (block) => figure(block) || table(block, "宿主"),
    title: "三条导入路线",
    hint: "电穿孔示意与按宿主选路线；感受态、λ 包装与物理参数查上面几页。",
  },
  "prep-branch": {
    // 这一页原本只有「三个指标」一条提示；补页后仍整段留在末尾，作为提取与定量的总纲。
    keep: () => true,
    title: "三个指标与提取总纲",
    hint: "浓度、纯度、完整性；碱裂解、柱法与三种定量的细节查上面几页。",
  },
  expression: {
    // 表达条件表与无细胞体系表是参考件，整段保留，避免补页后被条目盖掉。
    keep: () => true,
    title: "表达条件与无细胞体系",
    hint: "保可溶与高表达的取舍、四种无细胞体系与三个瓶颈；原理与载体查上面几页。",
  },
  application: {
    keep: () => true,
    title: "场景判据与生产线",
    hint: "医药、农业、工业三套判据，放大与质控的数；代谢工程与基因治疗查上面几页。",
  },
  "plant-delivery": {
    keep: () => true,
    title: "植物七法与受体",
    hint: "七种方法、效率量级与受体限制；再生流程查上面几页。",
  },
  "safety-principles": {
    keep: () => true,
    title: "五原则与 BSL 等级",
    hint: "评价原则、四级防护与阿西洛马三步；实验室操作查上面几页。",
  },
};
