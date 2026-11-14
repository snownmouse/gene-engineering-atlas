// 图谱的几何与标注数据：组件只负责画，事实与数值集中在这里。
// 环状质粒的弧段位置为示意（没有精确测序坐标），位点顺序按常见图谱排列。

export type Tone = "teal" | "orange" | "violet" | "slate";

export interface RingFeature {
  label: string;
  /** 起始 bp（示意） */
  start: number;
  /** 结束 bp（示意） */
  end: number;
  tone: Tone;
}

export interface PlasmidFigure {
  name: string;
  sizeBp: number;
  sizeLabel: string;
  shape: string;
  features: RingFeature[];
  /** 多克隆位点 / 关键位点，按常见图谱顺序列出 */
  sites: string[];
  siteNote: string;
}

export const PLASMID_PUC18: PlasmidFigure = {
  name: "pUC18",
  sizeBp: 2686,
  sizeLabel: "2 686 bp",
  shape: "环状双链 DNA",
  features: [
    { label: "lacZ′ / MCS", start: 210, end: 470, tone: "violet" },
    { label: "Amp^r", start: 1626, end: 2486, tone: "orange" },
    { label: "ori（突变的 pMB1）", start: 2500, end: 2630, tone: "teal" },
  ],
  sites: ["EcoR I", "Sac I", "Kpn I", "Sma I", "BamH I", "Xba I", "Sal I", "Pst I", "Sph I", "Hind III"],
  siteNote: "MCS 位点顺序按常见图谱排列；环上弧段与位点位置为示意，不是测序坐标。",
};

export const PLASMID_PBR322: PlasmidFigure = {
  name: "pBR322",
  sizeBp: 4361,
  sizeLabel: "4 361 bp",
  shape: "环状双链 DNA",
  features: [
    { label: "tet^r", start: 30, end: 1275, tone: "orange" },
    { label: "ori（pMB1）", start: 2535, end: 2620, tone: "teal" },
    { label: "amp^r", start: 3290, end: 4152, tone: "violet" },
  ],
  sites: ["BamH I（tet^r 内，插入失活）", "Pst I（amp^r 内，插入失活）", "EcoR I", "Sal I", "Hind III"],
  siteNote: "pBR322 含 30 多种限制酶的单一识别位点；图中只标出最常用的几个。",
};

export const PLASMID_PX459: PlasmidFigure = {
  name: "pX459 V2.0",
  sizeBp: 9200,
  sizeLabel: "9 200 bp",
  shape: "环状双链 DNA",
  features: [
    { label: "U6 · sgRNA", start: 1, end: 500, tone: "violet" },
    { label: "CBh 启动子", start: 520, end: 1180, tone: "teal" },
    { label: "hSpCas9", start: 1200, end: 5300, tone: "orange" },
    { label: "2A-Puro", start: 5320, end: 6000, tone: "slate" },
    { label: "Amp^r", start: 7060, end: 7920, tone: "orange" },
    { label: "pUC ori", start: 6300, end: 7000, tone: "teal" },
  ],
  sites: ["BbsI ×2（sgRNA 插入）", "AgeI", "EcoR I（不唯一）"],
  siteNote: "Addgene #62988，总长 9 200 bp；弧段位置为示意，不是测序坐标。",
};

export const PLASMID_PET28A: PlasmidFigure = {
  name: "pET-28a(+)",
  sizeBp: 5369,
  sizeLabel: "5 369 bp",
  shape: "环状双链 DNA",
  features: [
    { label: "T7 终止子", start: 26, end: 72, tone: "slate" },
    { label: "6×His · MCS", start: 140, end: 270, tone: "violet" },
    { label: "T7 启动子 · lac 操纵基因", start: 370, end: 421, tone: "teal" },
    { label: "lacI", start: 826, end: 1911, tone: "slate" },
    { label: "pBR322 ori", start: 3280, end: 3360, tone: "teal" },
    { label: "Kan^r", start: 3995, end: 4807, tone: "orange" },
  ],
  sites: ["Nde I", "Nhe I", "BamH I", "EcoR I", "Sac I", "Sal I", "Hind III", "Not I", "Xho I"],
  siteNote: "Addgene 载体库 #2565，总长 5 369 bp；T7 表达骨架，弧段位置为示意。",
};

export interface LambdaSegment {
  label: string;
  /** 示意长度（kb） */
  kb: number;
  tone: Tone | "dashed";
}

export interface LambdaRow {
  label: string;
  segments: LambdaSegment[];
  note: string;
}

export const LAMBDA_GENOME: { totalKb: number; rows: LambdaRow[]; foot: string } = {
  totalKb: 48.5,
  rows: [
    {
      label: "野生型 λ DNA",
      segments: [
        { label: "左臂 · 头部/尾部蛋白", kb: 20, tone: "teal" },
        { label: "中区 · 整合/切出（非必需）", kb: 19.5, tone: "slate" },
        { label: "右臂 · 复制/裂解", kb: 9, tone: "orange" },
      ],
      note: "两端各 12 nt 互补黏性末端，即 cos 位点",
    },
    {
      label: "插入型载体",
      segments: [
        { label: "左臂", kb: 20, tone: "teal" },
        { label: "中区保留部分", kb: 8, tone: "slate" },
        { label: "插入位点 0–7.2 kb", kb: 7, tone: "dashed" },
        { label: "右臂", kb: 9, tone: "orange" },
      ],
      note: "单一酶切位点插入；常使 cI 或 lacZ 插入失活",
    },
    {
      label: "置换型载体",
      segments: [
        { label: "左臂", kb: 20, tone: "teal" },
        { label: "外源片段替换填充片段 10–25 kb", kb: 14, tone: "dashed" },
        { label: "右臂", kb: 9, tone: "orange" },
      ],
      note: "EMBL3/4、λGEM-11；主要用于基因组文库",
    },
  ],
  foot: "区段长度按代表性数值示意；三行并非同一比例尺，重点看区段关系而非绝对长度。",
};

export interface CapacityRow {
  label: string;
  /** 容量区间（kb） */
  range: [number, number];
  host: string;
  tone: Tone;
  note: string;
}

export const VECTOR_CAPACITY: { rows: CapacityRow[]; foot: string } = {
  rows: [
    { label: "质粒", range: [0.1, 10], host: "E. coli", tone: "teal", note: "pUC18 2.7 kb" },
    { label: "λ 噬菌体", range: [10, 25], host: "E. coli", tone: "slate", note: "插入型 0–7.2；置换型 10–25" },
    { label: "黏粒 cosmid", range: [35, 45], host: "E. coli", tone: "violet", note: "λ cos + ColE1" },
    { label: "PAC", range: [130, 150], host: "E. coli", tone: "slate", note: "P1 复制子" },
    { label: "BAC", range: [100, 300], host: "E. coli", tone: "orange", note: "F 复制子" },
    { label: "YAC", range: [250, 400], host: "酵母", tone: "teal", note: "ARS / CEN / TEL" },
  ],
  foot: "区间取常用口径；同一载体在不同资料里出现 100–2000 kb 等更大数值，差异见正文「容量口径」提示。",
};

export interface GelBand {
  /** 距加样孔的相对位置（0–100），数值越大迁移越远 */
  top: number;
  height: number;
  tone: Tone | "dim";
}

export interface GelLane {
  title: string;
  sub: string;
  bands: GelBand[];
}

export const GEL_MIGRATION: { lanes: GelLane[]; foot: string } = {
  lanes: [
    {
      title: "Marker",
      sub: "已知分子量",
      bands: [
        { top: 16, height: 5, tone: "slate" },
        { top: 29, height: 5, tone: "slate" },
        { top: 42, height: 5, tone: "slate" },
        { top: 56, height: 5, tone: "slate" },
        { top: 70, height: 5, tone: "slate" },
        { top: 84, height: 5, tone: "slate" },
      ],
    },
    {
      title: "开环 ocDNA",
      sub: "一条链断裂 · 最慢",
      bands: [{ top: 40, height: 7, tone: "orange" }],
    },
    {
      title: "线状 L-DNA",
      sub: "双链断裂",
      bands: [{ top: 58, height: 7, tone: "violet" }],
    },
    {
      title: "超螺旋 cccDNA",
      sub: "共价闭合 · 最快",
      bands: [{ top: 76, height: 7, tone: "teal" }],
    },
  ],
  foot: "条带相对位置按「超螺旋 > 线状 > 开环」的迁移顺序示意，不是实测电泳图；实际迁移率还受凝胶浓度、电压、缓冲液与染色影响。",
};

export const PLATE_BLUE_WHITE = {
  left: {
    title: "lacZ′ 完整",
    genotype: "lacZΔM15 + lacZ′",
    result: "蓝色菌落",
    blue: true,
    colonies: 30,
  },
  right: {
    title: "插入外源 DNA",
    genotype: "lacZΔM15 + lacZ′::insert",
    result: "白色菌落",
    blue: false,
    colonies: 30,
  },
  reagents: ["IPTG：诱导物", "X-gal：生色底物", "Amp：选择压力"],
};
