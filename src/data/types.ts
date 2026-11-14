// 课程笔记数据模型：章节 → 小节 → 内容块。
// 页面只做「数据 → 版面」映射，正文事实全部落在 JSON 里，便于后续逐章扩充与校验。

/** 章节上线状态：published 可阅读；ready 底稿已整理但未上线；partial 仅覆盖部分内容；unavailable 暂不可读 */
export type ChapterStatus = "published" | "ready" | "partial" | "unavailable";

/** 站点已接入的图谱组件；新增图谱时同步 figures.ts 与 tools/validate-chapters.mjs */
export type FigureId =
  | "plasmid-puc18"
  | "plasmid-pbr322"
  | "lambda-genome"
  | "vector-capacity"
  | "plate-blue-white"
  | "gel-migration"
  | "restriction-site"
  | "dna-ends"
  | "plasmid-general"
  | "pcr-cycles"
  | "ligation-ends"
  | "overlap-assembly"
  | "ni-nta"
  | "yeast-factory"
  | "blot-transfer"
  | "qpcr-curve"
  | "sanger-ladder"
  | "illumina-sbs"
  | "nanopore"
  | "yeast-two-hybrid"
  | "delivery-methods"
  | "ti-plasmid"
  | "alpha-complement"
  | "ssh-suppression"
  | "sec-tat"
  | "inclusion-refold"
  | "struct-cas9"
  | "struct-taq"
  | "struct-gfp"
  | "plasmid-pet28a"
  | "plasmid-px459"
  | "edit-paths"
  | "rnai-pathway"
  | "chromatography"
  | "mammalian-culture"
  | "bevs-cycle"
  | "transgene-routes"
  | "gene-therapy-vectors"
  | "codon-map"
  | "double-crossover"
  | "crispr-screen"
  | "western-flow"
  | "qpcr-melt"
  | "omics-layers"
  | "cell-free-flow"
  | "plant-regeneration";

/** 行内标记：**加粗**、`等宽`，由 Inline 组件解析，不写入 HTML */
export interface ParagraphBlock {
  type: "p";
  text: string;
}

export interface LeadBlock {
  type: "lead";
  text: string;
}

export interface ListBlock {
  type: "list";
  ordered?: boolean;
  items: string[];
}

export interface TableBlock {
  type: "table";
  head: string[];
  rows: string[][];
  caption?: string;
}

export interface NoteBlock {
  type: "note";
  /** memory=记忆抓手；caution=易错/限制；verify=两种口径不一致，并列保留；exam=考点 */
  tone: "memory" | "caution" | "verify" | "exam";
  title: string;
  lines: string[];
}

export interface DefinitionBlock {
  type: "definition";
  term: string;
  en?: string;
  text: string;
}

export interface FigureBlock {
  type: "figure";
  figure: FigureId;
  caption: string;
}

/** 实拍/授权位图：与手绘 figure 块分开，图片存 public/assets/figures，不热链 */
export interface PhotoBlock {
  type: "photo";
  /** 站内绝对路径，须以 /assets/figures/ 开头 */
  src: string;
  alt: string;
  /** 图注：这张图该看什么 */
  caption: string;
  /** 出处：作者 / 来源 / 许可 */
  credit: string;
  /** 原始来源链接 */
  href: string;
  /** 只在指定的站显示：模块同时挂两站时，避免同一张图出现在两页 */
  only?: string;
}

export interface ConfusionBlock {
  type: "confusion";
  items: { left: string; right: string; note: string }[];
}

export interface TermsBlock {
  type: "terms";
  items: { term: string; en?: string; def: string }[];
}

/** 站内嵌过程演示：默认收起，点开才渲染 */
export type DemoId = "pcr" | "digest" | "ligase" | "transform";

export interface DemoBlock {
  type: "demo";
  demo: DemoId;
}

export type Block =
  | ParagraphBlock
  | LeadBlock
  | ListBlock
  | TableBlock
  | NoteBlock
  | DefinitionBlock
  | FigureBlock
  | PhotoBlock
  | ConfusionBlock
  | TermsBlock
  | DemoBlock;

export interface Section {
  id: string;
  /** 小节短标题（导航用） */
  title: string;
  /** 编号 + 主题标签，如「02 / 质粒的基本特性」 */
  kicker: string;
  blocks: Block[];
}

export interface ChapterSource {
  course: string;
  provider: string;
  lecturer: string;
  /** 章节材料的文件名与形态 */
  material: string;
  /** 实际阅读范围 */
  range: string;
  /** 来源声明 */
  note: string;
}

export interface Chapter {
  id: string;
  /** 章序号，用于 CH.03 与排序 */
  no: number;
  title: string;
  en: string;
  summary: string;
  status: ChapterStatus;
  statusLabel: string;
  /** 首页目录里的覆盖度说明 */
  coverage: string;
  source: ChapterSource;
  tags: string[];
  sections: Section[];
}

/** 首页目录条目：数据由章节 JSON + 索引共同推导，不在页面里另写数组 */
export interface ChapterNavEntry {
  id: string;
  no: number;
  title: string;
  en: string;
  status: ChapterStatus;
  statusLabel: string;
  coverage: string;
  /** 可阅读路由；未上线为 null */
  route: string | null;
  sections: number;
  figures: number;
}
