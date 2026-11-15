/**
 * 延伸资源：外部数据库、厂商手册与公开课程/视频。
 * 只放能稳定打开的权威站点；每条都注明机构与「能查到什么」。
 * 视频一律外链新窗口，不下载、不内嵌播放器，离线时只是少一个入口，页面不空。
 */

export interface ExtLink {
  /** 机构或数据库名 */
  org: string;
  /** 资源名 */
  name: string;
  /** 一句话说明它在讲什么 / 能查到什么 */
  note: string;
  href: string;
}

export interface ExtVideo {
  org: string;
  title: string;
  /** 时长量级，如「30 分钟级」「5–10 分钟」 */
  length: string;
  /** 看点 */
  note: string;
  href: string;
}

export interface ResourceSet {
  links: ExtLink[];
  videos?: ExtVideo[];
}

export const RESOURCES: Record<string, ResourceSet> = {
  "gene-source": {
    links: [
      {
        org: "Addgene",
        name: "质粒库",
        note: "非营利质粒库：查已发表质粒的图谱、抗性、启动子与配套协议，也能反向找谁在用同一元件。",
        href: "https://www.addgene.org/",
      },
      {
        org: "NCBI",
        name: "GenBank",
        note: "核酸序列原始库：按登记号与版本查序列、注释和提交记录；版本号变了说明序列被修正。",
        href: "https://www.ncbi.nlm.nih.gov/genbank/",
      },
      {
        org: "UniProt",
        name: "蛋白序列与注释",
        note: "查蛋白序列、结构域、修饰位点、亚细胞定位与文献条目；比单纯翻译核酸序列多一层功能信息。",
        href: "https://www.uniprot.org/",
      },
      {
        org: "RCSB PDB",
        name: "实验结构库",
        note: "查蛋白与核酸的实验测定结构、配体、分辨率与坐标文件，用来核对结构域边界与活性位点。",
        href: "https://www.rcsb.org/",
      },
      {
        org: "NCBI Datasets",
        name: "基因组组装（Assembly）",
        note: "按物种或登录号取组装版本、注释与 FASTA / GFF 下载；同一个物种常有多个组装，先看版本与水平。",
        href: "https://www.ncbi.nlm.nih.gov/assembly/",
      },
      {
        org: "SGD",
        name: "酿酒酵母库",
        note: "酵母基因、表型、遗传互作与参考文献；做酵母宿主或整合位点时，先在这里核对标准命名。",
        href: "https://www.yeastgenome.org/",
      },
    ],
    videos: [
      {
        org: "MIT OpenCourseWare",
        title: "7.016 Introductory Biology",
        length: "50 分钟级 / 讲",
        note: "分子生物学基础系统课：遗传信息流、复制转录翻译与实验逻辑讲得完整，适合补底层框架。",
        href: "https://ocw.mit.edu/courses/7-016-introductory-biology-fall-2018/",
      },
    ],
  },

  "restriction-enzyme": {
    links: [
      {
        org: "NEB",
        name: "限制酶与缓冲液",
        note: "查每个酶的识别序列、最适温度、甲基化敏感性、星活性说明与双酶切缓冲兼容表。",
        href: "https://www.neb.com/",
      },
      {
        org: "Thermo Fisher",
        name: "分子克隆流程",
        note: "限制酶、连接与克隆体系的选型入口，可查 FastDigest 一类快速体系的适用条件。",
        href: "https://www.thermofisher.cn/cn/zh/home/life-science/cloning.html",
      },
      {
        org: "Addgene",
        name: "克隆协议库",
        note: "酶切、连接、转化、菌落 PCR 的逐步协议，附条件、对照与常见故障排查。",
        href: "https://www.addgene.org/protocols/",
      },
    ],
    videos: [
      {
        org: "Learn.Genetics（犹他大学）",
        title: "Gel Electrophoresis",
        length: "5–10 分钟",
        note: "短动画：加样、电场、按大小分离与条带判读，先建立「为什么小片段跑得快」的直觉。",
        href: "https://learn.genetics.utah.edu/content/labs/gel/",
      },
    ],
  },

  "pcr-target": {
    links: [
      {
        org: "Addgene",
        name: "克隆协议库",
        note: "PCR 体系、引物设计、退火温度摸索与产物纯化的逐步协议，附失败排查清单。",
        href: "https://www.addgene.org/protocols/",
      },
    ],
    videos: [
      {
        org: "Learn.Genetics（犹他大学）",
        title: "All About PCR",
        length: "5–10 分钟",
        note: "交互式动画：变性、退火、延伸三轮循环与产物累积，适合对照站内 PCR 演示一起看。",
        href: "https://learn.genetics.utah.edu/content/labs/pcr/",
      },
    ],
  },

  sequencing: {
    links: [
      {
        org: "NCBI",
        name: "SRA",
        note: "原始测序数据档案：按项目或样本查 FASTQ 与元数据，用来复现公共数据集或找对照。",
        href: "https://www.ncbi.nlm.nih.gov/sra",
      },
      {
        org: "EMBL-EBI",
        name: "ENA Browser",
        note: "欧洲核酸档案：序列、组装与原始 reads；与 GenBank、DDBJ 每日交换，登记号可互查。",
        href: "https://www.ebi.ac.uk/ena/browser/home",
      },
      {
        org: "DDBJ",
        name: "日本核酸数据库",
        note: "与 GenBank、ENA 同步的核酸库：查登记号、提交记录与部分物种的注释。",
        href: "https://www.ddbj.nig.ac.jp/index-e.html",
      },
      {
        org: "EMBL-EBI Training",
        name: "生信在线课程",
        note: "测序数据分析、比对、变异检出与组学流程的系统课程，多数附练习数据。",
        href: "https://www.ebi.ac.uk/training/on-demand",
      },
    ],
    videos: [
      {
        org: "iBiology",
        title: "Methods for Sequencing DNA",
        length: "30 分钟级",
        note: "把 Sanger 与二代测序的原理放在一起讲：读长、准确率与通量为什么会互相牵制。",
        href: "https://www.ibiology.org/techniques/dna-sequencing/",
      },
      {
        org: "MIT OpenCourseWare",
        title: "7.016 Introductory Biology",
        length: "50 分钟级 / 讲",
        note: "测序与基因组学部分的系统课，适合补「数据怎么来、能回答什么问题」的框架。",
        href: "https://ocw.mit.edu/courses/7-016-introductory-biology-fall-2018/",
      },
    ],
  },

  "expression-boost": {
    links: [
      {
        org: "Addgene",
        name: "表达与克隆协议",
        note: "表达载体构建、诱导条件、可溶性与标签切除的协议，附常见失败原因。",
        href: "https://www.addgene.org/protocols/",
      },
      {
        org: "Cytiva",
        name: "蛋白研究",
        note: "表达、纯化、检测与定量的方法手册与选型指南，参数页比产品页更有用。",
        href: "https://www.cytivalifesciences.com/en/us/solutions/protein-research",
      },
      {
        org: "QIAGEN",
        name: "样本制备与纯化",
        note: "核酸与蛋白纯化的产品与协议入口，可查裂解、结合、洗脱条件与兼容性。",
        href: "https://www.qiagen.com/us",
      },
    ],
  },

  "soluble-purification": {
    links: [
      {
        org: "Cytiva",
        name: "蛋白研究",
        note: "层析选型、填料参数、流速与载量上限；查方法开发与放大时的操作区间。",
        href: "https://www.cytivalifesciences.com/en/us/solutions/protein-research",
      },
      {
        org: "QIAGEN",
        name: "蛋白纯化",
        note: "标签纯化、缓冲液配方与洗脱条件的协议入口，适合先定「用什么标签、怎么洗」。",
        href: "https://www.qiagen.com/us",
      },
      {
        org: "Addgene",
        name: "蛋白纯化协议",
        note: "从表达、裂解到亲和纯化与标签切除的逐步协议，常附 SDS-PAGE 判读示例。",
        href: "https://www.addgene.org/protocols/",
      },
    ],
  },

  immunodetection: {
    links: [
      {
        org: "Thermo Fisher",
        name: "Western blotting 资源",
        note: "转膜、封闭、抗体选择、显色与发光的条件与故障排查；查「没信号 / 背景高」先看这里。",
        href: "https://www.thermofisher.cn/cn/zh/home/life-science/protein-biology/protein-gel-electrophoresis-western-blot/western-blotting.html",
      },
      {
        org: "Cytiva",
        name: "蛋白检测与分析",
        note: "膜选择、转膜方式与检测体系的参数页，可查 PVDF 与 NC 的适用差异。",
        href: "https://www.cytivalifesciences.com/en/us/solutions/protein-research",
      },
    ],
  },

  mutagenesis: {
    links: [
      {
        org: "Addgene",
        name: "CRISPR 与克隆协议",
        note: "sgRNA 设计、载体构建、递送与验证的协议合集，附脱靶检测与克隆筛选的实操细节。",
        href: "https://www.addgene.org/protocols/",
      },
      {
        org: "Learn.Genetics（犹他大学）",
        name: "遗传学互动材料",
        note: "把基因编辑、遗传病与检测做成短动画与互动，适合先建立概念再读机制。",
        href: "https://learn.genetics.utah.edu/",
      },
    ],
    videos: [
      {
        org: "iBiology",
        title: "Genome Engineering with CRISPR-Cas9",
        length: "30 分钟级",
        note: "从细菌免疫系统到可编程核酸酶的路径，讲清 PAM、切割与修复选择为何决定结果。",
        href: "https://www.ibiology.org/genetics-and-gene-regulation/crispr-cas9/",
      },
    ],
  },

  medicine: {
    links: [
      {
        org: "FDA（CBER）",
        name: "细胞与基因治疗产品",
        note: "已批产品清单、适应证与安全信息入口；查「有没有获批、批的是什么」以这里为准。",
        href: "https://www.fda.gov/vaccines-blood-biologics/cellular-gene-therapy-products",
      },
      {
        org: "NHGRI",
        name: "基因组学与基因治疗",
        note: "美国国立人类基因组研究所的科普与政策资料：查技术背景、伦理议题与项目进展。",
        href: "https://www.genome.gov/",
      },
    ],
    videos: [
      {
        org: "iBiology",
        title: "Genome Engineering with CRISPR-Cas9",
        length: "30 分钟级",
        note: "理解体内编辑类产品之前，先看清「切、修、递送」三件事各自的风险边界。",
        href: "https://www.ibiology.org/genetics-and-gene-regulation/crispr-cas9/",
      },
    ],
  },

  "synthetic-genome": {
    links: [
      {
        org: "SGD",
        name: "酿酒酵母库",
        note: "查酵母基因必需性、缺失表型与遗传互作；判断「这个基因能不能删」的第一站。",
        href: "https://www.yeastgenome.org/",
      },
      {
        org: "NCBI Datasets",
        name: "基因组组装",
        note: "取参考基因组与注释，用来比对合成染色体与野生型的差异区间。",
        href: "https://www.ncbi.nlm.nih.gov/assembly/",
      },
    ],
    videos: [
      {
        org: "Learn.Genetics（犹他大学）",
        title: "遗传学互动材料",
        length: "5–15 分钟",
        note: "用短动画讲基因组、基因表达与遗传修饰，适合作为合成基因组议题的入门。",
        href: "https://learn.genetics.utah.edu/",
      },
    ],
  },
};
