import type { KnowledgeItem } from "./types";
import { TOOL_ITEMS } from "./items-tools";
import { VECTOR_ITEMS } from "./items-vectors";
import { EXPRESSION_ITEMS } from "./items-expression";
import { REMAINING_ITEMS } from "./items-remaining";
import { MIXED_ITEMS } from "./items-mixed";
import { COMPARE_ITEMS, EXAM_ITEMS } from "./items-exam";
import { KNOWLEDGE_ITEMS } from "./items-knowledge";
import { COVERAGE_ITEMS } from "./items-coverage";
import { DEEPEN_ITEMS } from "./items-deepen";
import { FINAL_ITEMS } from "./items-final";

/**
 * 知识点页面层：一页只讲一件事，短、结构化、可扫读。
 * 概念型模块走条目，连续操作与配方型模块仍按原正文呈现。
 * 条目里的数字与判据都取自现有模块正文，不新增结论。
 */
export const ITEMS_BY_MODULE: Record<string, KnowledgeItem[]> = {
  ...TOOL_ITEMS,
  ...VECTOR_ITEMS,
  ...EXPRESSION_ITEMS,
  ...REMAINING_ITEMS,
  ...MIXED_ITEMS,
  "gene-source": [
    {
      id: "target-gene",
      title: "目的基因",
      en: "TARGET GENE",
      kind: "概念",
      line: "要研究、改造、扩增或表达的基因或 DNA 片段；可以是基因组片段、cDNA 或人工合成序列。",
      params: [
        "常见类型：优良性状基因、致病基因、抗病抗虫抗逆基因、编码特殊营养蛋白或多肽的基因。",
        "拿到手的形式：基因组片段、cDNA、PCR 产物或人工合成序列。",
        "判断拿对没有：看片段大小、末端与读框，不看来源名称。",
      ],
      confuse: "目的基因不等于载体：目的基因是被带走的那一段，载体负责携带、复制与筛选。",
      table: {
        head: ["来源", "典型长度", "判据"],
        rows: [
          ["基因组文库", "插入 15–20 kb（λ）、35–45 kb（黏粒）", "覆盖度 ≥5 倍基因组当量，才能以 99% 概率拿到单拷贝基因"],
          ["cDNA 文库", "插入 1–3 kb", "只含外显子，适合真核表达；无启动子与内含子"],
          ["PCR 扩增", "常规 ≤10 kb；高保真酶可达 20–40 kb", "引物 18–25 nt、Tm 55–65 ℃；产物末端要加酶切位点或重叠区"],
          ["化学合成", "寡核苷酸 20–100 nt；基因 1–3 kb 较可靠", "越长错误率越高，>3 kb 建议分段合成再组装"],
        ],
        caption: "四条来源；长度与覆盖度按建库与合成通行参数。",
      },
      terms: ["target-gene"],
    },
    {
      id: "route-choice",
      title: "三条路线怎么选",
      en: "ROUTE CHOICE",
      kind: "判据",
      line: "先问「序列知道多少」，再决定合成、PCR 还是建库；顺序反过来就会白做。",
      params: [
        "有序列、片段短：化学合成。",
        "有序列、有模板：PCR 扩增。",
        "没序列、只有表型或探针：建库，再筛。",
      ],
      confuse: "三条路不是三个难度等级，而是三种前提。",
      table: {
        head: ["路线", "前提", "长度", "代价"],
        rows: [
          ["化学合成", "序列已知，或能由氨基酸序列反推", "寡核苷酸约 200 bp，更长需分段拼接", "成本随长度上升，长片段要组装"],
          ["PCR 扩增", "两侧序列已知，有可用模板", "常规几十 bp 到数 kb", "依赖模板质量，可能非特异扩增"],
          ["文库筛选", "没有序列信息，只有表型或探针", "取决于文库类型", "工作量大，低丰度目标可能筛不到"],
        ],
        caption: "先问「我手上已经知道什么」，再选路线；顺序反过来就会白做。",
      },
      terms: ["target-gene"],
    },
    {
      id: "synthesis",
      title: "化学合成",
      en: "SYNTHESIS",
      kind: "方法",
      line: "不依赖模板，按已知序列逐个偶联核苷酸；短片段最省事，长片段要分段拼。",
      params: [
        "单段寡核苷酸约 200 bp；60–80 bp 可合成两条互补链直接退火。",
        "中等片段用补丁延长：40–50 bp 大片段与 20 bp 小片段交错，Klenow 补齐、T4 连接酶封口。",
        "千碱基级以上把 1–3 kb 模块用 PCR 或连接酶拼起来。",
      ],
      confuse: "合成不需要模板，前提是序列已知，或能由氨基酸序列反推。",
      terms: ["chemical-synthesis", "phosphoramidite", "oligo"],
      moduleId: "synthesis",
    },
    {
      id: "pcr-target",
      title: "PCR 扩增",
      en: "PCR",
      kind: "方法",
      line: "两侧序列已知时的标准路线：一对引物把目标区间放大到可操作的量。",
      params: [
        "引物 18–25 nt、GC 40–60%、Tm 55–65 ℃，一对引物 ΔTm ≤5 ℃。",
        "退火从 Tm−5 ℃ 起试；延伸 72 ℃、约 1 kb/min。",
        "循环 30–35 次；超过 35 次非特异产物明显增加。",
      ],
      confuse: "PCR 只能扩已知区间；两侧序列不知道，就回到建库路线。",
      terms: ["pcr", "primer", "annealing"],
      moduleId: "pcr-target",
    },
    {
      id: "library",
      title: "基因文库",
      en: "LIBRARY",
      kind: "方法",
      line: "基因组文库收全部基因；cDNA 文库只收特定材料、特定时期表达的基因。",
      params: [
        "建库四步：材料与片段 → 与载体连接 → 转化或包装侵染 → 阳性克隆筛选。",
        "质检三线：克隆数、平均插入片段、覆盖度 4–6 倍基因组当量；单拷贝基因按 99% 概率要 ≥5 倍。",
        "基因组 DNA 的分子量至少是目标插入片段的 3–5 倍。",
      ],
      confuse: "要启动子、内含子，用基因组文库；要直接表达蛋白，用 cDNA 文库。",
      table: {
        head: ["物种", "基因组大小", "插入片段", "5× 覆盖所需克隆数"],
        rows: [
          ["大肠杆菌", "约 4.6 Mb", "约 10 kb 质粒", "约 2 300"],
          ["酵母", "约 12 Mb", "约 10 kb 质粒", "约 6 000"],
          ["拟南芥", "约 135 Mb", "约 100 kb BAC", "约 6 800"],
          ["人", "约 3.2 Gb", "约 150 kb BAC", "约 107 000"],
        ],
        caption: "克隆数随基因组增大而上升；插入片段越大，所需克隆越少。",
      },
      terms: ["gene-library", "coverage"],
      moduleId: "library",
    },
    {
      id: "n-formula",
      title: "文库需要多少个克隆",
      en: "LIBRARY SIZE",
      kind: "判据",
      line: "N = ln(1−p) / ln(1−f)：p 是文库含目的基因的概率，f 是插入片段占基因组的比例。",
      params: [
        "f 是「一个克隆覆盖基因组的比例」，不是覆盖倍数；覆盖倍数 = N × f。",
        "例：G = 3 × 10⁹ bp、I = 20 kb，则 f ≈ 6.67 × 10⁻⁶；p = 0.99 时 N = ln(0.01) / ln(1 − f) ≈ 4.605 / 6.67 × 10⁻⁶ ≈ 6.9 × 10⁵（约 690 800）。",
        "复核：覆盖倍数 = N × f ≈ 4.6，与「99% 概率约 5 倍覆盖」的经验值吻合。",
      ],
      confuse: "别把 p 当成覆盖倍数；p 是「至少拿到一次」的概率。旧资料里的 69 100 是按 300 Mb 基因组或 200 kb 插入算的，与本例参数不符。",
      dispute:
        "旧版把 N ≈ 69 077 写成 3 × 10⁹ bp、20 kb 的结果，实际差了 10 倍；全站按公式统一为 ≈ 6.9 × 10⁵。",
      terms: ["coverage"],
      moduleId: "n-formula",
    },
    {
      id: "genomic-library",
      title: "基因组文库",
      en: "GENOMIC LIBRARY",
      kind: "方法",
      line: "基因组随机切成片段全部装进载体；常用设计覆盖 4–6 倍，单拷贝基因按 ≥5 倍要求。",
      params: [
        "载体容量：质粒 <10 kb；噬菌体 0–23 kb；黏粒约 45 kb；BAC/YAC 100 kb–1 Mb。",
        "Sau3AI 等部分酶切做 3–5 倍覆盖，PFGE 选 20 kb 左右片段。",
        "载体先去磷酸化，降低自连；质检看覆盖度与随机性。",
      ],
      confuse: "基因组文库收全基因组；亚基因组文库只收预先切出的一段。",
      terms: ["genomic-library", "partial-digest", "hmw-dna", "pfge"],
      moduleId: "genomic-library",
    },
    {
      id: "subgenomic-library",
      title: "亚基因组文库",
      en: "SUBGENOMIC LIBRARY",
      kind: "方法",
      line: "只取基因组的一部分建库：先大片段酶切，再按大小回收目标区段。",
      params: [
        "示例：人基因组先用 SpeI 切成约 8.3 kb 重复片段，回收后再用 Sau3AI 部分酶切建库。",
        "适用前提：目标基因已定位到某条染色体或某个大片段。",
        "代价：建库前要先做酶切图谱或杂交定位。",
      ],
      confuse: "亚基因组文库仍是 DNA 文库，不是 cDNA 文库；它只缩小范围，不改来源。",
      terms: ["subgenomic-library"],
      moduleId: "subgenomic-library",
    },
    {
      id: "cdna-library",
      title: "cDNA 文库",
      en: "cDNA LIBRARY",
      kind: "方法",
      line: "mRNA 只占 RNA 的 1–5%；反转录成 cDNA 再克隆，只收表达中的基因。",
      params: [
        "四步：oligo(dT) 纯化 mRNA → 第一链 → 第二链 → 克隆（片段 >500 bp）。",
        "第二链两法：自身引导法（S1 切发夹）与置换合成法（RNase H + pol I + T4 连接酶）。",
        "所需克隆数：高/中丰度 10⁵–10⁶；低丰度 5 × 10⁶–1 × 10⁷。",
      ],
      confuse: "cDNA 文库有组织与时期特异性；同一物种换材料，文库内容就不同。",
      terms: ["cdna-library"],
      moduleId: "cdna-library",
    },
    {
      id: "cdna-normalization",
      title: "cDNA 文库均一化",
      en: "NORMALIZATION",
      kind: "方法",
      line: "把高丰度 cDNA 压下去，让低丰度基因有机会被筛到。",
      params: [
        "基因组 DNA 饱和杂交法：过量基因组 DNA 与 cDNA 杂交，高丰度 cDNA 先被饱和扣除。",
        "复性动力学法：控制复性时间，高丰度先成双链，用羟基磷灰石或酶法去除，保留单链低丰度组分。",
      ],
      confuse: "均一化只改文库内各序列的比例，不增加总克隆数。",
      moduleId: "cdna-normalization",
    },
    {
      id: "pool-pcr",
      title: "混合池 PCR 筛选",
      en: "POOL PCR",
      kind: "方法",
      line: "把文库分池，先筛池再回溯单克隆；用 PCR 代替铺板杂交。",
      params: [
        "按 96 孔板构建主池、行池、列池；先扩主池，再扩阳性池对应的行、列。",
        "行列交点即目标孔；从目标孔挑单克隆，单独培养后 PCR 或测序确认。",
        "池越大，PCR 次数越少，但弱阳性越容易漏检。",
      ],
      confuse: "筛池不等于筛单克隆：阳性池只说明池里有目标，还要回溯到单孔。",
      moduleId: "pool-pcr",
    },
    {
      id: "yeast-two-hybrid",
      title: "酵母双杂交",
      en: "YEAST TWO-HYBRID",
      kind: "方法",
      line: "GAL4 的 BD 与 AD 分开：只有两蛋白互作，报告基因才被转录。",
      params: [
        "GAL4 共 881 个氨基酸；BD 为 1–147，AD 为 768–881。",
        "pGBKT7 约 7.3 kb（TRP1、Kan^r）；pGADT7 约 8.0 kb（LEU2、Amp^r）。",
        "流程：BD-诱饵 → AD-cDNA 文库 → 双缺 → 三/四缺 → X-α-Gal 显蓝确认。",
      ],
      confuse: "假阳性来自诱饵自激活或非特异结合；假阴性来自融合构象、胞质/膜上互作或翻译后修饰。",
      moduleId: "yeast-two-hybrid",
    },
    {
      id: "other-isolation",
      title: "其他分离技术",
      en: "OTHER METHODS",
      kind: "方法",
      line: "扣除文库、SSH、DDRT-PCR、电子克隆、图位克隆：五条不在主链上的路线。",
      params: [
        "扣除文库与 SSH 的 driver 过量 10–40 倍；SSH 用 20–40 倍，两轮杂交、抑制 PCR、嵌套 PCR。",
        "DDRT-PCR 假阳性率文献从 50% 到 70% 以上都有，口径不一。",
        "三条差异路线最终都要用 qRT-PCR 或 Northern 在独立样本里复核。",
      ],
      confuse: "这些方法只「找候选」，不「证明差异」；电子克隆与图位克隆不需要先建文库。",
      moduleId: "other-isolation",
    },
    {
      id: "prep-branch",
      title: "样品制备（支线）",
      en: "SAMPLE PREP",
      kind: "支线",
      line: "基因组、RNA、质粒的提取与定量：不上主链，但决定模板能不能用。",
      params: [
        "浓度：A260 定量。",
        "纯度：A260/A280 与 A260/A230。",
        "完整性：凝胶上看条带；RNA 看 28S / 18S。",
      ],
      confuse: "提取不合格，后面的 PCR、酶切、建库都会白做。",
      moduleId: "prep-branch",
    },
    {
      id: "hgp",
      title: "人类基因组计划",
      en: "HGP",
      kind: "背景",
      line: "1990 年启动，2000 年 6 月绘出「工作框架图」；意义是认识生长、发育、繁殖与遗传病病因。",
      params: [
        "启动：1990 年。",
        "工作框架图：2000 年 6 月。",
        "应用方向：基因治疗、优生优育。",
      ],
      confuse: "它是背景事实，不是获取目的基因的操作路线。",
    },
  ],
  "restriction-enzyme": [
    {
      id: "re-overview",
      title: "限制性核酸内切酶",
      en: "RESTRICTION ENZYME",
      kind: "概念",
      line: "II 型酶识别回文对称序列，在识别序列内部或附近切割，只需 Mg²⁺；切割活性与甲基化活性是分开的。",
      params: [
        "识别序列一般 4–6 bp，多为旋转对称、反向重复；少数识别更长或简并序列。",
        "限制酶需 Mg²⁺；相应的修饰酶只需 SAM。",
        "限制酶是同源二聚体，反向结合两条链、同时切割；修饰酶是单体。",
      ],
      confuse: "「II 型」指的是识别与切割都不随机，不等于只能切一次；部分酶切是控制反应条件，不是换酶。",
      terms: ["restriction-enzyme", "palindrome"],
    },
    {
      id: "re-unit",
      title: "酶活单位怎么算",
      en: "UNIT",
      kind: "判据",
      line: "1 U = 在建议缓冲液与温度下，20 μL 反应液、1 h 内把 1 μg DNA 完全消化所需的酶量。",
      params: [
        "实际用量按 DNA 量与位点数放大，不是固定 1 U。",
        "酶体积不超过反应总体积的 1/10；甘油过量会抑制反应。",
        "SmaI 25 ℃、Taq I 65 ℃，多数酶 37 ℃。",
      ],
      confuse: "单位只说明「切得动 1 μg」，不说明星号活性；条件偏离最适缓冲时，实际效率要打折。",
      terms: ["restriction-enzyme"],
    },
    {
      id: "re-ends",
      title: "黏性末端与平末端",
      en: "ENDS",
      kind: "概念",
      line: "两条链错开切留下互补突出端，是黏性末端；同一位置切两链，是平末端。",
      params: [
        "黏性末端连接效率高，方向由两端位点决定。",
        "平末端连接效率低，需要补平、加接头或提高连接酶量。",
        "同尾酶切出的黏性末端相同，产物可以互连。",
      ],
      confuse: "平末端不是「切得更整齐所以更好连」；恰恰相反，平端连接是效率最低的一类。",
      terms: ["sticky-end", "blunt-end"],
    },
    {
      id: "re-methylation",
      title: "甲基化会让位点切不动",
      en: "METHYLATION",
      kind: "判据",
      line: "位点被宿主修饰系统甲基化后，限制酶可能完全或部分切不动。",
      params: [
        "Dam 甲基化阻断 Xba I，但不影响 EcoR I。",
        "建库与转化要选修饰系统匹配的宿主菌。",
        "从大肠杆菌提取的质粒，先查该酶是否受 Dam / Dcm 影响。",
      ],
      confuse: "「切不动」不等于酶失活；先看位点是否被甲基化，再换酶或换菌株。",
      terms: ["restriction-enzyme"],
    },
    {
      id: "re-choose",
      title: "选酶三查",
      en: "CHOOSE ENZYME",
      kind: "判据",
      line: "一查片段内部有没有这个位点，二查载体 MCS，三查双酶切能不能共用缓冲。",
      params: [
        "一查片段内部：有没有这个位点，会不会把目标片段切断。",
        "二查载体：MCS 上有没有，切完会不会丢掉必需元件。",
        "三查缓冲：双酶切能不能共用条件，不能就分步或换酶。",
      ],
      confuse: "只看「酶好不好买」会漏掉第三查；两个酶各自最适缓冲不同，双酶切效率会掉。",
      terms: ["restriction-enzyme", "mcs"],
    },
    {
      id: "re-common",
      title: "八个常用酶",
      en: "COMMON ENZYMES",
      kind: "方法",
      line: "六碱基位点在 3.2 Gb 基因组中平均每 4 kb 一个，八碱基稀有酶约每 65 kb 一个。",
      params: [
        "EcoR I G^AATTC，5′-AATT 黏性；Dam 甲基化不影响。",
        "BamH I G^GATCC，与 Bgl II、Bcl I 同尾。",
        "Not I GC^GGCCGC 为 8 bp 稀有酶，大片段组装用。",
      ],
      table: {
        head: ["酶", "识别 / 切口", "末端", "备注"],
        rows: [
          ["EcoR I", "G^AATTC", "5′-AATT 黏性", "最常用；Dam 甲基化不影响"],
          ["BamH I", "G^GATCC", "5′-GATC 黏性", "与 Bgl II、Bcl I 同尾"],
          ["Hind III", "A^AGCTT", "5′-AGCT 黏性", "常用双酶切搭档"],
          ["Pst I", "CTGCA^G", "3′-TGCA 黏性", "pBR322 的 Amp 位点"],
          ["Sal I", "G^TCGAC", "5′-TCGA 黏性", "与 Xho I 同尾"],
          ["Xba I", "T^CTAGA", "5′-CTAG 黏性", "Dam 甲基化会阻断"],
          ["Sma I", "CCC^GGG", "平端", "25 ℃ 反应，效率低"],
          ["Not I", "GC^GGCCGC", "8 bp 稀有", "大片段组装用"],
        ],
      },
      terms: ["sticky-end", "blunt-end", "isocaudomer"],
    },
    {
      id: "re-recipe",
      title: "20 μL 酶切体系",
      en: "DIGEST RECIPE",
      kind: "方法",
      line: "0.5–1 μg DNA、1× 缓冲、1–2 U 酶，补水到 20 μL，37 ℃ 1 h。",
      params: [
        "部分酶依赖 BSA，按酶说明书加 100 μg/mL。",
        "总反应 37 ℃ 1 h；Sma I 25 ℃，Taq I 65 ℃。",
        "酶量按位点数放大，不按 DNA 体积放大。",
      ],
      table: {
        head: ["组分", "常用量", "说明"],
        rows: [
          ["DNA", "0.5–1 μg", "质粒或纯化片段"],
          ["缓冲液", "1×", "按酶的最适缓冲"],
          ["酶", "1–2 U", "不超过反应体积 1/10"],
          ["BSA", "100 μg/mL（需要时）", "部分酶依赖"],
          ["总体积", "20 μL", "不足时补水"],
          ["反应", "37 ℃，1 h", "Sma I 25 ℃；Taq I 65 ℃"],
        ],
      },
      terms: ["restriction-enzyme"],
    },
    {
      id: "re-partial",
      title: "部分酶切",
      en: "PARTIAL DIGEST",
      kind: "方法",
      line: "把酶量降到 0.1–0.5 U/μg 或把时间缩到 5–15 min，让每个分子平均只切一次。",
      params: [
        "目标是互相重叠的片段，不是切得越碎越好。",
        "完全酶切得到的片段不能再拼回完整基因组，建库要用部分酶切。",
        "片段大小用脉冲场凝胶电泳回收。",
      ],
      confuse: "部分酶切不是「少加一点酶就一定有重叠片段」；要预实验定酶量与时间。",
      terms: ["partial-digest", "pfge"],
    },
  ],
  nuclease: [
    {
      id: "nuclease-overview",
      title: "核酸酶类",
      en: "NUCLEASES",
      kind: "概念",
      line: "按切的位置分四类：去单链尾（S1、绿豆）、从两头缩短（BAL 31）、从 3′ 端啃（Exo III）、只切 RNA（RNase）。",
      params: [
        "S1 与绿豆核酸酶去单链尾，把突出端修成平端。",
        "BAL 31 双链外切加单链内切，从两头缩短 DNA。",
        "外切核酸酶 III 从 dsDNA 3′-OH 端逐个去核苷酸。",
      ],
      confuse: "核酸酶不是都「降解 DNA」：S1 与绿豆主要处理单链，Exo III 只走 3′ 端，RNase 只切 RNA。",
    },
    {
      id: "nuclease-bal31",
      title: "BAL 31",
      en: "BAL 31",
      kind: "方法",
      line: "交替单胞菌来源，双链特异外切加单链特异内切，从两头缩短 DNA。",
      params: [
        "需 Ca²⁺、Mg²⁺，EDTA 可抑制。",
        "用途：做缺失突变、制作酶切图。",
        "可把超螺旋先切成开环，再切成线状。",
      ],
      confuse: "BAL 31 是「两头一起啃」，不是定点切；缩短长度靠控制时间。",
    },
    {
      id: "nuclease-s1",
      title: "S1 核酸酶",
      en: "S1 NUCLEASE",
      kind: "方法",
      line: "米曲霉来源的单链特异内切酶，产物带 5′-P。",
      params: [
        "分析 DNA:RNA 杂合体。",
        "去除单链尾，产生平端。",
        "打开 cDNA 合成中的发夹环。",
      ],
      confuse: "S1 切单链，不切双链；处理双链片段时切的是末端未配对的尾巴。",
    },
    {
      id: "nuclease-mung-bean",
      title: "绿豆核酸酶",
      en: "MUNG BEAN NUCLEASE",
      kind: "方法",
      line: "与 S1 相似但更温和，只在大切口处切，更容易把突出端修成平端。",
      params: [
        "典型用法：Hind III 切后修成 Nco I 位点 CCATGG。",
        "比 S1 温和，过度消化的风险更低。",
      ],
      confuse: "绿豆核酸酶不等于 S1 的替代品：温和意味着对单链区的容忍度不同。",
    },
    {
      id: "nuclease-rnase-a",
      title: "RNase A",
      en: "RNase A",
      kind: "方法",
      line: "牛胰内切酶，攻击嘧啶残基 3′ 端，产物带嘧啶 3′-P。",
      params: [
        "用于去除 DNA 样品中的 RNA。",
        "用前加热，使混入的 DNase 失活。",
      ],
      confuse: "RNase A 切 RNA 不切 DNA；但粗制品可能带 DNase，不做热处理会降解 DNA。",
    },
    {
      id: "nuclease-dnase-i",
      title: "DNase I",
      en: "DNase I",
      kind: "方法",
      line: "牛胰内切酶；Mg²⁺ 时两条链独立、位点随机，Mn²⁺ 时两链大致在同一位置切。",
      params: [
        "切口平移标记。",
        "闭环 DNA 引入单切口。",
        "制备嵌套缺失体；DNase 足迹法。",
      ],
      confuse: "Mg²⁺ 与 Mn²⁺ 的产物不同：前者产生随机单切口，后者近似双链断裂。",
    },
    {
      id: "nuclease-exo-iii",
      title: "外切核酸酶 III",
      en: "EXO III",
      kind: "方法",
      line: "大肠杆菌来源，从 dsDNA 的 3′-OH 端逐个去核苷酸，不降解单链与带 3′ 突出的双链。",
      params: [
        "制备部分截短探针、嵌套缺失体。",
        "定点诱变：切模板链而不切硫代磷酸链。",
        "只能从 3′ 端走，不能从 5′ 端啃。",
      ],
      confuse: "Exo III 的「不切 3′ 突出」是选择性来源：带 3′ 突出的末端它不动。",
    },
    {
      id: "nuclease-rnase-h",
      title: "RNase H",
      en: "RNase H",
      kind: "方法",
      line: "内切酶，特异水解与 DNA 杂交的那段 RNA 的磷酸二酯键。",
      params: [
        "cDNA 第二链合成前去除 RNA。",
        "在脱氧核苷酸指导下定点切 RNA。",
      ],
      confuse: "RNase H 只切「RNA:DNA 杂合体」里的 RNA，游离的单链 RNA 不是它的底物。",
    },
    {
      id: "nuclease-rnase-one",
      title: "RNase One",
      en: "RNase ONE",
      kind: "方法",
      line: "Promega 的 27 kDa 酶，可把 RNA 降解到小片段；能在 4 种碱基处切磷酸二酯键。",
      params: [
        "分子量 27 kDa。",
        "不依赖特定碱基，切点更密。",
      ],
      confuse: "「四种碱基处都能切」说的是切点不挑碱基，不代表与 RNase A 的产物相同。",
    },
    {
      id: "nuclease-rnase-inhibitor",
      title: "RNase 抑制剂",
      en: "RNase INHIBITOR",
      kind: "方法",
      line: "RNasin（人胎盘，50 kDa）与 RNAguard（人胎盘和猪肝）非竞争性、非共价结合 RNase A 类。",
      params: [
        "需要 DTT 维持活性。",
        "用于反转录、RT-PCR、体外转录与翻译。",
      ],
      confuse: "抑制剂只抑 RNase A 类，不抑 RNase H 或 RNase I；不能当万能 RNA 保护剂。",
    },
    {
      id: "nuclease-cas9",
      title: "Cas9 与编辑工具",
      en: "CAS9",
      kind: "方法",
      line: "RNA 引导的 DNA 内切酶，含 REC I/II、HNH、RuvC 与 PAM interaction，在 PAM 上游切靶双链。",
      params: [
        "SpCas9 识别 NGG PAM，guide RNA 20 nt，产物为平末端 DSB。",
        "SaCas9 识别 NNGRRT，蛋白更小，便于 AAV 递送。",
        "Cas12a 识别 TTTV，产生交错切口、5′ 突出；Cas13 切 RNA 不切 DNA。",
      ],
      table: {
        head: ["工具", "识别 / 编辑", "结果", "现状"],
        rows: [
          ["SpCas9", "NGG PAM；guide RNA 20 nt", "平末端 DSB", "最常用；Casgevy 即 Cas9 编辑 BCL11A 增强子"],
          ["SaCas9", "NNGRRT PAM", "平末端 DSB", "蛋白更小，便于 AAV 递送"],
          ["Cas12a", "TTTV PAM", "交错切口，5′ 突出", "适合多靶点与短 PAM"],
          ["Cas13", "RNA 靶标", "切割 RNA，不切 DNA", "用于 RNA 敲低与病毒检测"],
          ["碱基编辑器 BE4 / ABE8e", "C→T / A→G，不产生 DSB", "单碱基转换", "已进临床：risto-cel 2026 年 BEACON 阳性顶线；中国 β-地贫碱基编辑 2026 年 Nature"],
          ["先导编辑 PE2", "nCas9-H840A + 反转录酶 + pegRNA", "小插入、缺失与任意替换", "PM359 获 FDA RMAT（2026-06）"],
          ["桥接重组酶", "bridge RNA 指定 target / donor", "大片段插入与重排", "2024 年 Nature；2025 年 Science 报道 Mb 级重排"],
        ],
        caption: "工具越多，越要先问「要切、要换、还是要改一个碱基」；不同工具的产物不同。",
      },
      confuse: "Cas9 产生 DSB，修复靠 NHEJ / HR，随机插入缺失与染色体重排是主要风险；碱基编辑与先导编辑不产生 DSB，但仍有脱靶与旁位编辑。",
      dispute: "临床数据截至 2026-10；批准状态与适应证会变，引用时看最新标签。",
      terms: ["genome-editing"],
    },
    {
      id: "nuclease-agarase",
      title: "琼脂糖酶",
      en: "AGARASE",
      kind: "支线",
      line: "水解琼脂糖，把琼脂糖亚单位（新琼脂二糖）切成新琼脂寡糖。",
      params: [
        "用于从低熔点琼脂糖凝胶中分离纯化大片段 DNA 或 RNA。",
        "对热稳定，反应不需缓冲液。",
        "商品如 Promega Agar ACE enzyme。",
      ],
      confuse: "它降解的是胶，不是核酸；回收 DNA 时酶要随后去除或灭活。",
    },
  ],
  "enzyme-types": [
    {
      id: "type-ii",
      title: "II 型：唯一能用于构建的一型",
      en: "TYPE II",
      kind: "概念",
      line: "II 型占限制酶 96%，识别回文对称序列，切点固定在识别位点内部或附近。",
      params: [
        "识别回文对称序列，一般 4–6 bp；少数识别更长或简并序列。",
        "产物带 3′-OH 与 5′-P。",
        "限制酶为同源二聚体，反向结合两条链、同时切割；修饰酶为单体。",
      ],
      confuse: "「识别与切割都不随机」是 II 型能用于构建的原因；I 型与 III 型的切点不在识别位点上。",
      terms: ["restriction-enzyme", "palindrome"],
    },
    {
      id: "type-ii-sub",
      title: "II 型的六个亚型",
      en: "SUBTYPES",
      kind: "概念",
      line: "II P 占 90% 以上；II S 切点在识别位点一侧 20 bp 内；II B 在两端切；II G 双功能；II M 只认甲基化；切口酶只切一条链。",
      params: [
        "II P：识别回文对称序列，最常用。",
        "II S：识别非对称且非间断序列，长 4–7 bp，切点可偏到一侧 20 bp 内。",
        "II B 如 Bcg I；II M 如 Dpn I；切口酶命名加前缀 N，如 N.BstNBI。",
      ],
      table: {
        head: ["亚型", "特点"],
        rows: [
          ["II P", "识别回文对称序列，占 90% 以上"],
          ["II S", "识别非对称且非间断序列，长 4–7 bp；切点可在识别位点一侧 20 bp 内"],
          ["II B", "识别非连续序列，在识别序列两端切割，如 Bcg I"],
          ["II G", "同时具限制酶与甲基转移酶活性"],
          ["II M", "只识别甲基化序列，如 Dpn I"],
          ["切口酶", "只切双链中一条链；命名加前缀 N，如 N.BstNBI"],
        ],
      },
      confuse: "亚型不是按来源分，是按识别序列与切点位置分；同一个属可以有多个亚型。",
    },
    {
      id: "type-compare",
      title: "I / II / III 型对照",
      en: "TYPE I–III",
      kind: "判据",
      line: "I 型与 III 型都是双功能酶，切点分别距识别位点 ≥1000 bp 与 24–26 bp；只有 II 型切在识别位点上。",
      params: [
        "I 型：3 种亚基，需 ATP 与 Mg²⁺，切点距识别位点 ≥1000 bp，基因工程上无用。",
        "II 型：单一亚基，只需 Mg²⁺，切点位于识别位点上。",
        "III 型：2 种亚基，需 ATP 与 Mg²⁺，切点在下游 24–26 bp，用处不大。",
      ],
      table: {
        head: ["特性", "I 型", "II 型", "III 型"],
        rows: [
          ["限制与修饰活性", "双功能酶", "核酸内切酶与甲基化酶分开", "双功能酶"],
          ["酶蛋白组成", "3 种亚基", "单一亚基", "2 种亚基"],
          ["辅助因子", "ATP、Mg²⁺", "Mg²⁺", "ATP、Mg²⁺"],
          ["识别位点", "非对称序列", "回文对称", "非对称序列"],
          ["切割位点", "距识别位点 ≥1000 bp 处随机", "位于识别位点上", "距识别位点下游 24–26 bp"],
          ["序列特异切割", "不是", "是", "是"],
          ["基因工程应用", "无用", "广泛使用", "用处不大"],
        ],
        caption: "III 型切点有 25–27 bp 与 24–26 bp 两种写法，并列保留。I 型代表 EcoB = R₂M₄S₂、EcoK = R₂M₂S，由 hsdR、hsdM、hsdS 同一操纵子编码。",
      },
      dispute: "III 型切点有 25–27 bp 与 24–26 bp 两种写法，不合并成一种。",
      confuse: "「双功能」指限制与修饰在同一条蛋白上；II 型把它们分成两个酶，所以好控制。",
    },
    {
      id: "type-iv",
      title: "IV 型：只切被修饰的 DNA",
      en: "TYPE IV",
      kind: "概念",
      line: "IV 型编码 1–2 个蛋白，只切割被修饰的 DNA（甲基化、羟甲基化、葡萄糖基-羟甲基化碱基）。",
      params: [
        "代表酶 EcoKMCrBC（McrBC）。",
        "I 型占 1%，III 型占 <1%，IV 型不参与常规构建。",
      ],
      confuse: "IV 型不是「更高级的 II 型」；它的底物是被修饰的 DNA，用途完全不同。",
    },
  ],
  "dna-ends": [
    {
      id: "end-types",
      title: "四种末端",
      en: "END TYPES",
      kind: "概念",
      line: "5′ 突出、3′ 突出、平末端，以及两端突出不互补的非对称突出端。",
      params: [
        "5′ 突出：5′ 端多出单链，如 EcoR I 的 …G ＋ AATTC…。",
        "3′ 突出：3′ 端多出单链，如 Kpn I 的 …GGTAC ＋ C…。",
        "平末端：在对称轴上同时切两链，如 Hae III GG↓CC、EcoR V GAT↓ATC。",
      ],
      table: {
        head: ["末端类型", "定义", "代表酶"],
        rows: [
          ["5′ 突出黏末端", "5′ 端多出单链", "EcoRI：…G ＋ AATTC…"],
          ["3′ 突出黏末端", "3′ 端多出单链", "KpnI：…GGTAC ＋ C…"],
          ["平末端", "在对称轴上同时切两链", "HaeIII GG↓CC；EcoRV GAT↓ATC；XmnI GAANN↓NNTTC"],
          ["非对称突出端", "两端突出不互补", "BbvCI、AccI、DraIII"],
        ],
      },
      confuse: "突出方向决定能不能直接连：5′ 突出与 3′ 突出不能互补，非对称突出端两端也互不配对。",
      terms: ["sticky-end", "blunt-end"],
    },
    {
      id: "isoschizomer",
      title: "同裂酶",
      en: "ISOSCHIZOMER",
      kind: "概念",
      line: "识别相同序列、但切割位点可能不同的一组限制酶。",
      params: [
        "同序同切称同功酶，如 Hind II 与 Hinc II（GTY↓RAC）、Hpa II 与 Hap II（C↓CGG）。",
        "同序异切如 Kpn I（GGTAC↓C）与 Acc65 I（G↓GTACC）。",
      ],
      confuse: "同裂酶只保证识别序列相同，不保证切出来是同一种末端；同序异切的两个酶要分别看切口。",
      terms: ["restriction-enzyme"],
    },
    {
      id: "isocaudomer",
      title: "同尾酶",
      en: "ISOCAUDAMER",
      kind: "概念",
      line: "不同限制酶切出的黏性突出末端相同，因此产物可以互相连接。",
      params: [
        "EcoR I / Mfe I / Apo I 为一组。",
        "Spe I / Nhe I / Xba I 为一组。",
        "BamH I / Sau3A I / Sty I 为一组。",
      ],
      confuse: "同尾酶识别序列不同、末端相同；同裂酶识别序列相同、切口可能不同，两者别混。",
      terms: ["isocaudomer"],
    },
    {
      id: "isocaudomer-loss",
      title: "同尾连接后位点消失",
      en: "SITE LOSS",
      kind: "判据",
      line: "BamH I 的 GATC 端与 Bgl II 的 GATC 端连成 GGATCT，既不是 BamH I 也不是 Bgl II 位点。",
      params: [
        "用途：多拷贝构建、去除位点。",
        "代价：连上以后不能再切回。",
      ],
      confuse: "同尾连接是「一次性」的：想再切出来，必须换别的酶或重新设计接头。",
      terms: ["isocaudomer", "sticky-end"],
    },
    {
      id: "multi-copy",
      title: "体外多拷贝",
      en: "IN VITRO MULTIMER",
      kind: "方法",
      line: "pPICZαA,B,C（3.6 kb）用 BamH I + Bgl II 双酶切，把表达框反复插入，得到 2 个表达框串联。",
      params: [
        "科研实例（Zhang L 等，Int J Biol Macromol，2026: 153785）：构建 pPICZαA/GOD-GCW21 与 pPIC3.5K/HAC1。",
        "路线：体外多拷贝＋电转化＋His⁺ 筛选。",
        "Western 检测到约 75 kDa 条带。",
      ],
      confuse: "多拷贝不是把同一段随机连一堆；靠同尾末端定向串联，拷贝数与方向都要验证。",
      terms: ["isocaudomer", "electroporation"],
    },
  ],
  gel: [
    {
      id: "gel-voltage",
      title: "电压按胶长算",
      en: "VOLTAGE",
      kind: "判据",
      line: "约 5 V/cm：0.8% 胶 80–100 V 跑约 1 h，1.5–2.0% 胶 5–8 V/cm 并缩短时间。",
      params: [
        "电压过高会拖尾，分辨率反而下降。",
        "浓度与分离范围的完整对照见「电泳条件与 PAGE」。",
      ],
      confuse: "V/cm 是按两极间距算，不是按电源面板上的总电压；胶越长，同样电压下场强越低。",
      terms: ["agarose-gel"],
    },
    {
      id: "gel-loading",
      title: "上样与指示",
      en: "LOADING",
      kind: "方法",
      line: "上样缓冲液含甘油与指示染料：甘油让样品沉进孔里，染料指示跑到了哪里。",
      params: [
        "上样量按孔容积与目标条带浓度定，不要满孔。",
        "指示染料前沿不等于目标片段位置。",
      ],
      confuse: "染料前沿只作进度参考；判断大小仍要看 Marker，不能拿染料位置当分子量。",
      terms: ["agarose-gel"],
    },
    {
      id: "gel-stain",
      title: "染色与灵敏度",
      en: "STAINING",
      kind: "方法",
      line: "溴化乙锭 0.5 μg/mL 可在胶中或染缸中染色；SYBR Safe / Gel Red 按 1× 使用。",
      params: [
        "SYBR Safe / Gel Red 灵敏度与 EB 相当，毒性更低。",
        "EB 需按危废处理，不要在普通台面操作。",
      ],
      confuse: "「灵敏度相当」不等于成像条件一样；不同染料的激发波长不同，凝胶成像仪要换滤光片。",
      terms: ["agarose-gel"],
    },
  ],
  antibiotic: [
    {
      id: "antibiotic-conc",
      title: "常用抗生素工作浓度",
      en: "WORKING CONC.",
      kind: "判据",
      line: "Amp 50–100 μg/mL、Kan 25–50、Tet 10–15、Cm 25（扩增）/34（筛选）、Spec 50–100、Zeocin 25。",
      params: [
        "Amp 母液 100 mg/mL 水溶液；β-内酰胺环易水解，平板 4 ℃ 存 2 周内。",
        "Kan 母液 50 mg/mL；灭菌后冷却至 50 ℃ 左右再加。",
        "Tet 母液 5 mg/mL 70% 乙醇，避光；Cm 母液 34 mg/mL 乙醇，现配现用。",
      ],
      table: {
        head: ["抗生素", "工作浓度（LB / E. coli）", "母液与要点"],
        rows: [
          ["氨苄青霉素 Amp", "50–100 μg/mL（常用 100）", "100 mg/mL 水溶液；β-内酰胺环易水解，平板 4 ℃ 存 2 周内"],
          ["卡那霉素 Kan", "25–50 μg/mL（常用 50）", "50 mg/mL 水溶液；灭菌后冷却至 50 ℃ 左右再加"],
          ["四环素 Tet", "10–15 μg/mL（常用 10）", "5 mg/mL 70% 乙醇溶液；避光"],
          ["氯霉素 Cm", "25 μg/mL（扩增）/ 34 μg/mL（筛选）", "34 mg/mL 乙醇溶液；现配现用"],
          ["壮观霉素 Spec", "50–100 μg/mL", "水溶液，避光"],
          ["博来霉素 Zeocin", "25 μg/mL", "实例；用低盐 LB（NaCl 5 g/L）"],
        ],
        caption: "Zeocin 25 μg/mL 一例；其余为厂商手册与通行配方的工作浓度，按菌株、载体与培养基调整。",
      },
      terms: ["selectable-marker"],
    },
    {
      id: "antibiotic-timing",
      title: "加药时机与涂布量",
      en: "TIMING",
      kind: "判据",
      line: "培养基冷却到 50 ℃ 左右再加抗生素；取 100 μL 复苏菌液涂皿，菌太密先稀释。",
      params: [
        "温度过高会使抗生素失活。",
        "37 ℃、150 rpm 复苏 1 h 后再涂含药平板（rpm 照配方原文记，未换算 ×g：换算取决于转子半径，换机时按说明书复核）。",
        "影印平板：先在主平板长菌，再影印到第二种抗生素平板，比较两种抗性。",
      ],
      table: {
        head: ["操作环节", "做法", "原因"],
        rows: [
          ["加药时机", "灭菌培养基冷却至 50 ℃ 左右再加抗生素", "高温使抗生素失活"],
          ["涂布量", "取 100 μL 复苏菌液涂皿；菌太密先稀释", "菌落过密无法挑单克隆"],
          ["先复苏再加药", "37 ℃、150 rpm 复苏 1 h 后再涂含药平板", "让抗性基因先表达，否则假阴性"],
          ["影印平板", "先在主平板长菌，再影印到第二种抗生素平板", "比较两种抗性，判断插入失活"],
        ],
      },
      confuse: "不复苏直接涂含药平板，长不出来不代表没转化成功，是抗性基因还没表达。",
      terms: ["selectable-marker", "insertional-inactivation"],
    },
    {
      id: "antibiotic-false",
      title: "假阴性与假阳性的来源",
      en: "FALSE RESULTS",
      kind: "判据",
      line: "假阴性多来自「没复苏就加药」；假阳性多来自抗生素失效或浓度不够。",
      params: [
        "平板存放过久、反复回温，Amp 会水解失效。",
        "抗生素浓度不足时，未转化的空载菌也可能长出。",
        "每次配药记录批号与配制日期。",
      ],
      confuse: "平板长菌不等于转化成功；先看抗生素是否还有效，再看质粒是否带对应抗性。",
      terms: ["selectable-marker"],
    },
  ],
  insertional: [
    {
      id: "insertional-pbr322",
      title: "pBR322 的两种插入失活",
      en: "pBR322",
      kind: "方法",
      line: "插入 tet^r 内得到 Tet^s、Amp^r；插入 amp^r 内得到 Amp^s、Tet^r。",
      params: [
        "BamH I / Sal I 位点在 tet^r 内，插入后 Tet^s、Amp^r；用四环素＋环丝氨酸富集，再转 Amp 平板。",
        "Pst I 位点在 amp^r 内，插入后 Amp^s、Tet^r；先涂 Tet 平板，再喷碘-青霉素指示液。",
      ],
      table: {
        head: ["载体", "插入位点", "插入后表型", "筛法"],
        rows: [
          ["pBR322（4.36 kb）", "BamH I / Sal I（tet^r 内）", "Tet^s、Amp^r", "四环素 + 环丝氨酸富集，再转 Amp 平板"],
          ["pBR322（4.36 kb）", "Pst I（amp^r 内）", "Amp^s、Tet^r", "先涂 Tet 平板，再喷碘-青霉素指示液"],
        ],
      },
      confuse: "插入失活是「丢了抗性」，不是「多了抗性」；筛选靠的是反向选择，不是正向选择。",
      terms: ["insertional-inactivation"],
    },
    {
      id: "cycloserine",
      title: "环丝氨酸富集",
      en: "CYCLOSERINE",
      kind: "判据",
      line: "环丝氨酸只杀正在生长的细菌：未插入的 Tet^r 细胞在四环素中生长而被杀，插入失活的 Tet^s 细胞停止生长而躲过。",
      params: [
        "富集后再转 Amp 平板，只有 Amp^r 的插入失活克隆能长。",
        "四环素是抑菌不是杀菌，所以「停止生长」的细胞能活下来。",
      ],
      confuse: "富集的是「不长的那一批」，不是「长得最好的那一批」；这是反向选择的共同逻辑。",
      terms: ["insertional-inactivation"],
    },
    {
      id: "iodine-penicillin",
      title: "碘-青霉素指示液",
      en: "IODINE TEST",
      kind: "判据",
      line: "指示液遇 β-内酰胺酶由蓝灰变浅：Amp^r 菌落周围褪色，Amp^s 菌落保持原色。",
      params: [
        "先涂 Tet 平板长出菌落，再喷指示液。",
        "褪色圈说明菌落产 β-内酰胺酶，即 Amp^r。",
      ],
      confuse: "褪色的是 Amp^r，不是 Amp^s；判读方向反了会把重组体全筛掉。",
      terms: ["insertional-inactivation"],
    },
  ],
  "blue-white": [
    {
      id: "blue-white-reagents",
      title: "IPTG 与 X-gal 的用量",
      en: "IPTG / X-GAL",
      kind: "判据",
      line: "平板终浓度：IPTG 0.1 mM、X-gal 20–40 μg/mL，Amp 100 μg/mL 维持质粒选择压力。",
      params: [
        "IPTG 母液 0.1 M 水溶液，过滤除菌，−20 ℃ 保存。",
        "X-gal 母液 20 mg/mL DMF 溶液，避光；每皿涂 40 μL 后晾干。",
      ],
      table: {
        head: ["试剂", "平板终浓度", "母液与操作"],
        rows: [
          ["IPTG", "0.1 mM", "0.1 M 水溶液，过滤除菌，-20 ℃ 保存"],
          ["X-gal", "20–40 μg/mL", "20 mg/mL DMF 溶液，避光；每皿涂 40 μL 后晾干"],
          ["Amp", "100 μg/mL", "见抗生素筛选；维持质粒选择压力"],
        ],
      },
      confuse: "IPTG 是诱导物、X-gal 是底物，两者都要加；只加 X-gal 不会显色。",
      terms: ["blue-white", "iptg", "x-gal"],
    },
    {
      id: "blue-white-read",
      title: "显色时间与判读",
      en: "READING",
      kind: "判据",
      line: "37 ℃ 培养 12–16 h 后转 4 ℃ 静置 2–4 h，蓝色更清楚；蓝色为空载，白色为重组体。",
      params: [
        "继续延长培养，蓝色菌落会连成片。",
        "白色仍需酶切或测序确认。",
      ],
      confuse: "白斑不等于一定重组；也可能来自突变或 α-互补失效，必须再做酶切或测序。",
      terms: ["blue-white", "alpha-complementation"],
    },
  ],
  auxotroph: [
    {
      id: "auxotroph-select",
      title: "营养缺陷型筛选",
      en: "AUXOTROPH",
      kind: "方法",
      line: "受体菌 his⁻、外源基因 his⁺，涂不含组氨酸的极限培养基，长出即带上 his⁺。",
      params: [
        "回复突变会造成假阳性，需做空载对照。",
        "受体先在完全培养基长、在缺陷培养基不长，对照才算成立。",
      ],
      table: {
        head: ["系统", "选择条件", "判据"],
        rows: [
          ["营养缺陷型", "缺氨基酸或碱基的极限培养基", "his⁻ 受体只有带上 his⁺ 外源基因才能长"],
          ["supF", "琥珀突变（UAG）报告基因", "supF 抑制终止密码，表型恢复"],
          ["sacB", "含 5–10% 蔗糖的平板", "表达 sacB 的细胞把蔗糖转成果聚糖而致死，sacB 缺失的重组子存活"],
        ],
      },
      confuse: "缺陷型的「不长」要靠对照证明；对照不成立，筛选结果不算。",
      terms: ["auxotrophic-marker"],
    },
    {
      id: "supf",
      title: "supF 抑制",
      en: "supF",
      kind: "概念",
      line: "supF 抑制琥珀突变（UAG）终止密码，让报告基因的表型恢复。",
      params: [
        "报告基因带 UAG，宿主带 supF 才能读出表型。",
        "适用于质粒与宿主配对的互补筛选。",
      ],
      confuse: "supF 不是「补一个基因」，是改读终止密码；它改变的是翻译，不是序列。",
      terms: ["auxotrophic-marker"],
    },
    {
      id: "sacb",
      title: "sacB 反向选择",
      en: "sacB",
      kind: "判据",
      line: "表达 sacB 的细胞把蔗糖转成果聚糖而致死，sacB 缺失的重组子存活。",
      params: [
        "平板含 5–10% 蔗糖。",
        "长出来的是丢了 sacB 的那一批，不是长得最好的那一批。",
      ],
      confuse: "sacB 是反向选择；蔗糖平板上长出的菌落，恰恰是失去了 sacB 的。",
      terms: ["auxotrophic-marker"],
    },
    {
      id: "dhfr-mtx",
      title: "DHFR / MTX 选择",
      en: "DHFR / MTX",
      kind: "方法",
      line: "外源 DHFR 使细胞抗三甲氧苄二氨嘧啶（MTX），在含 MTX 平板上筛选。",
      params: [
        "含 DHFR 的克隆能长。",
        "药物浓度需预先滴定，过高会连阳性克隆一起抑制。",
      ],
      confuse: "MTX 筛选靠的是酶量优势，不是抗性基因灭活药物；扩增后拷贝数升高，耐受度也会变。",
      terms: ["selectable-marker"],
    },
  ],
  "probe-labeling": [
    {
      id: "nick-translation",
      title: "切口平移",
      en: "NICK TRANSLATION",
      kind: "方法",
      line: "DNase I 在双链上造切口，DNA pol I 从切口 5′→3′ 外切并合成，带标记的 dNTP 掺进去。",
      params: [
        "标记整个双链探针。",
        "比活 10⁶–10⁸ cpm/μg。",
        "片段长度不均一。",
      ],
      confuse: "切口平移靠的是 DNA pol I 的 5′→3′ 外切活性；只用 Klenow 做不了这个反应。",
    },
    {
      id: "random-priming",
      title: "随机引物法",
      en: "RANDOM PRIMING",
      kind: "方法",
      line: "六聚体随机引物退火到变性 DNA，Klenow 延伸时掺入标记 dNTP。",
      params: [
        "比活高、操作快。",
        "探针 100–1000 bp 最常用。",
      ],
      confuse: "随机引物法用的是 Klenow（无 5′→3′ 外切），与切口平移的酶不同。",
    },
    {
      id: "pcr-labeling",
      title: "PCR 标记",
      en: "PCR LABELING",
      kind: "方法",
      line: "在 PCR 体系里用标记 dNTP 或标记引物，扩增的同时把标记掺进产物。",
      params: [
        "产量大、比活高、模板量要求低。",
        "适合短探针。",
      ],
      confuse: "PCR 标记要求两端序列已知；没有引物结合位点的模板不能用这条路。",
    },
    {
      id: "end-labeling",
      title: "末端标记",
      en: "END LABELING",
      kind: "方法",
      line: "T4 多核苷酸激酶把 [γ-³²P]ATP 的 γ-磷酸转到 5′ 端；或用末端转移酶加尾。",
      params: [
        "只标末端，比活低。",
        "适合寡核苷酸探针与测序引物。",
      ],
      confuse: "末端标记只标末端，不是整条探针；需要高比活的全长探针时别选它。",
    },
    {
      id: "probe-activity",
      title: "比活与探针长度",
      en: "SPECIFIC ACTIVITY",
      kind: "判据",
      line: "探针常用 100–1000 bp、比活 10⁶–10⁸ cpm/μg；越长越容易非特异结合。",
      params: [
        "100–1000 bp、10⁶–10⁸ cpm/μg 是常用区间。",
        "探针越长，非特异结合越多。",
      ],
      confuse: "比活不是越高越好；比活过高会缩短探针半衰期，背景也更重。",
    },
    {
      id: "probe-detection",
      title: "放射性与非放射性",
      en: "DETECTION",
      kind: "判据",
      line: "放射性用 ³²P、³⁵S、³H 放射自显影；非放射性用生物素、DIG、荧光素，酶联显色或化学发光。",
      params: [
        "³²P 灵敏度最高，半衰期 14.3 天。",
        "DIG 检出限约 0.1 pg。",
        "非放射性保存期长、无辐射；步骤比放射性多。",
      ],
      confuse: "非放射性不是「灵敏度更低」；DIG 的 0.1 pg 检出限靠抗体–酶放大，代价是步骤更多。",
    },
  ],
  vector: [
    {
      id: "vector-basics",
      title: "载体要同时满足三件事",
      en: "VECTOR",
      kind: "概念",
      line: "载体是能把外源片段带进宿主、并在宿主里复制与筛选的 DNA 分子。",
      params: [
        "能复制：有自己的复制区，或能整合进宿主染色体。",
        "能选：带选择标记，转化后只有带载体的细胞能长。",
        "能切：有克隆位点，外源片段能插进去。",
      ],
      confuse: "载体不等于「能装 DNA 的质粒」；没有复制区或选择标记，插进去也扩不出来、挑不出来。",
      terms: ["vector", "plasmid"],
    },
    {
      id: "vector-capacity",
      title: "按片段大小选骨架",
      en: "CAPACITY",
      kind: "判据",
      line: "5–10 kb 用质粒，10–25 kb 用 λ，30–45 kb 用黏粒，100–300 kb 用 BAC/PAC，0.2–2 Mb 用 YAC。",
      params: [
        "质粒 5–10 kb；pUC18/19 高拷贝 500–700，pBR322 低拷贝 15–20。",
        "λ 置换型 10–25 kb；黏粒 35–45 kb。",
        "BAC/PAC 100–300 kb 单拷贝；YAC 0.2–2 Mb 单拷贝。",
      ],
      confuse: "容量是上限不是目标：片段越大，稳定性越差，验证（脉冲场凝胶、PFGE）也越重。",
      terms: ["vector", "cloning-vector", "bac-yac", "cosmid"],
    },
    {
      id: "vector-copy",
      title: "高拷贝与低拷贝",
      en: "COPY NUMBER",
      kind: "判据",
      line: "pUC 系列 500–700 拷贝，pBR322 15–20 拷贝；插入片段越大，越要提防高拷贝下的不稳定。",
      params: [
        "常规克隆、亚克隆 5–10 kb：pUC18/19，高拷贝、蓝白斑、M13 引物。",
        "需要低拷贝、避免毒性：pBR322，拷贝数低、标记清楚，但容量小。",
        "插入太大易不稳定，高拷贝不是越多数越好。",
      ],
      confuse: "拷贝数高不等于产量高；表达毒蛋白或大片段时，高拷贝反而容易丢质粒或突变。",
      terms: ["copy-number", "plasmid"],
    },
    {
      id: "vector-need",
      title: "四类需求对应四种骨架",
      en: "BY PURPOSE",
      kind: "判据",
      line: "克隆保存、建库、表达、单链探针，四类需求各有一套骨架，不能互相顶替。",
      params: [
        "克隆保存：小质粒，位点多、拷贝数高。",
        "建库：λ 或黏粒/BAC，容量与包装效率优先。",
        "表达：pET / pGEX（原核）、YEp / YCp / YIp（酵母）。",
        "单链探针、定点突变：M13mp18/19 或噬菌粒。",
      ],
      confuse: "拿表达载体去建库会丢片段；拿文库载体去做表达，启动子和诱导条件都不对。",
      terms: ["expression-vector", "cloning-vector", "lambda-vector"],
    },
    {
      id: "vector-host",
      title: "宿主与载体必须配套",
      en: "HOST MATCH",
      kind: "判据",
      line: "大肠杆菌、酵母、噬菌体各有自己的复制区与标记，载体的复制子决定它能进哪种宿主。",
      params: [
        "酵母附加型载体高拷贝但易丢；整合型最稳。",
        "λ 载体要体外包装、侵染受体菌，不走转化。",
        "YAC 在酵母里维持，易嵌合，需 PFGE 验证。",
      ],
      confuse: "「质粒」不是大肠杆菌专用词；同一段 DNA 换宿主，复制区与标记都要重配。",
      terms: ["vector", "transformation", "pichia"],
    },
    {
      id: "vector-table",
      title: "常用载体对照表",
      en: "VECTOR TABLE",
      kind: "方法",
      line: "十种常用骨架按需求、容量、拷贝数与注意事项排成一张表。",
      params: [
        "先看片段多大，再看要做什么，最后看宿主与筛选。",
        "BAC 原始论文报 300 kb 级，后续优化到 1–2 Mb。",
      ],
      table: {
        head: ["需求", "首选载体", "容量 / 拷贝数", "理由与注意"],
        rows: [
          ["常规克隆、亚克隆 5–10 kb", "pUC18 / pUC19", "5–10 kb / 500–700 拷贝", "高拷贝、蓝白斑、M13 引物；插入太大易不稳定"],
          ["需要低拷贝、避免毒性", "pBR322", "5–10 kb / 15–20 拷贝", "拷贝数低、标记清楚；容量小"],
          ["cDNA 文库 0.5–7 kb", "λgt10 / λgt11", "0–7 kb / 噬菌斑", "包装效率高；λgt11 可表达融合蛋白"],
          ["基因组文库 10–25 kb", "λEMBL3/4、λGEM-11", "10–25 kb / 噬菌斑", "置换型，需纯化左右臂；Spi 筛选"],
          ["基因组文库 30–45 kb", "黏粒", "35–45 kb / 按质粒复制", "λ cos 位点＋质粒复制子；菌落形式"],
          ["大片段 100–300 kb", "BAC / PAC", "100–300 kb / 单拷贝", "电转化、脉冲场凝胶；避免剪切"],
          ["超大片段 0.2–2 Mb", "YAC", "0.2–2 Mb / 单拷贝", "酵母宿主；易嵌合、需 PFGE 验证"],
          ["蛋白表达", "pET / pGEX", "5–10 kb / 中高拷贝", "T7 或 tac 启动子；BL21(DE3) 诱导"],
          ["酵母表达", "YEp / YCp / YIp", "1–200 拷贝", "附加型高拷贝但易丢；整合型最稳"],
          ["单链探针、定点突变", "M13mp18/19、噬菌粒", "6.4 kb / 单链", "用 RF 双链操作；噬菌粒需辅助噬菌体"],
        ],
        caption: "容量与拷贝数按常用数据与 GenBank 序列整理；BAC 与 YAC 的两组区间并列保留。",
      },
      dispute: "BAC 有 50–300 kb 与 120–300 kb 两种写法，YAC 有 0.2–2 Mb 与 250–400 kb 两种写法，不合并成一种。",
      terms: ["vector", "bac-yac", "cosmid", "lambda-vector"],
    },
  ],
};

/** 知识页、考点与易混对比按模块追加，不能整表覆盖原有条目 */
for (const extraMap of [KNOWLEDGE_ITEMS, EXAM_ITEMS, COMPARE_ITEMS, COVERAGE_ITEMS, DEEPEN_ITEMS, FINAL_ITEMS]) {
  for (const [moduleId, extra] of Object.entries(extraMap)) {
    ITEMS_BY_MODULE[moduleId] = [...(ITEMS_BY_MODULE[moduleId] ?? []), ...extra];
  }
}

export const ITEM_COUNT = Object.values(ITEMS_BY_MODULE).reduce(
  (total, items) => total + items.length,
  0,
);

export function itemsForModule(moduleId: string): KnowledgeItem[] | undefined {
  return ITEMS_BY_MODULE[moduleId];
}

/** 术语反向找条目：只在该站挂着的模块里找，避免跨站指错。 */
export function itemForTerm(
  termId: string,
  moduleIds: string[],
  label = "",
): { moduleId: string; item: KnowledgeItem } | undefined {
  const keys = label
    .toLowerCase()
    .split(/[\s·/、]+/)
    .filter((key) => key.length > 1);
  let best: { moduleId: string; item: KnowledgeItem } | undefined;
  let bestScore = -1;
  for (const moduleId of moduleIds) {
    const items = ITEMS_BY_MODULE[moduleId];
    if (!items) continue;
    for (const item of items) {
      if (!item.terms?.includes(termId)) continue;
      const head = `${item.title} ${item.en ?? ""}`.toLowerCase();
      const score = keys.reduce((total, key) => total + (head.includes(key) ? 1 : 0), 0);
      if (score > bestScore) {
        best = { moduleId, item };
        bestScore = score;
      }
    }
  }
  return best;
}
