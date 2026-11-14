# 主题级覆盖对照（内部）

对照对象（只记主题级，不抄原文、不记页码）：

- 《基因工程原理》（吴乃虎）
- 《现代分子生物学》（朱玉贤等）
- 《分子克隆实验指南》（Green & Sambrook）
- Principles of Gene Manipulation（Old & Primrose）
- Gene Cloning and DNA Analysis（Brown）
- An Introduction to Genetic Engineering（Nicholl）

站点基线：6 站、131 个知识模块、143 条路由、479 个知识页。以下三张表只做主题判断；教材名与页码只留在本文件，不进站点正文。

## 表 1　教材有、站内没有或明显偏薄

| # | 主题 | 站内现状 | 缺什么 | 建议 |
|---|---|---|---|---|
| 1 | 基因编辑 | `op-mutate` 表内一行「CRISPR 编辑」；`pX459` 图谱页；`struct-cas9` 结构页 | sgRNA–PAM–Cas9 切割机制、NHEJ/HDR 两条修复、脱靶与检测、ZFN/TALEN/碱基编辑/先导编辑、RNP–LNP–AAV 递送对比 | 新页 3 张，并入 `mutagenesis`；配 1 图（切割后两条修复路径） |
| 2 | 哺乳动物细胞表达 | `part-host` 一行 CHO/HEK293；`medicine` 一行滴度；`yeast-glyco` 作对照 | 瞬时/稳定转染流程、筛选与扩增、糖基化差异、无血清悬浮培养、滴度与质量 | 新页 1–2 张，并入 `expression` |
| 3 | 昆虫杆状病毒表达系统 | 仅 `medicine` 表中「HEK293 / 杆状病毒」一处 | 杆状病毒生活史、Bac-to-Bac、Sf9/High Five、分泌与翻译后修饰 | 新页 1 张，并入 `expression` |
| 4 | RNA 干扰与基因沉默 | 仅 LNP 递送表提到 siRNA；无机制页 | dsRNA→Dicer→RISC→切割；siRNA/shRNA/miRNA/反义 RNA 的区别与用量 | 新页 1 张，并入 `verification`；配 1 图 |
| 5 | 转基因动物制作 | `animal-delivery` 列了方法；`part-host` 列了受体 | 原核显微注射、ES 细胞打靶、体细胞核移植、Cre/loxP 条件敲除、鉴定与品系维持 | 新页 1 张，并入 `animal-delivery` |
| 6 | 基因治疗 | `medicine` 一段定义；LNP/AAV/慢病毒递送表 | 体外/体内两条路线、CAR-T、已批产品与适应证、插入突变与免疫反应 | 新页 1 张，并入 `application` |
| 7 | 分子诊断与组学 | `sequencing` 有三平台；`qpcr` 完整；`hybridization` 有杂交 | 基因芯片、RNA-seq 流程、差异表达与生信入口 | 已做：2 页并入 `sequencing`（omics-map、molecular-diagnostics），配 1 图 |
| 8 | 蛋白质层析纯化 | Ni-NTA、可溶性纯化、包涵体复性都有；IEX/GFC/HIC 只在表里点名 | 离子交换、凝胶过滤、疏水层析的分离原理、盐梯度、峰图判读、标签切除 | 新页 1 张，并入 `soluble-purification`；配 1 图 |
| 9 | 质粒提取与核酸定量 | `prep-plasmid` 节点列方法名（碱裂解、试剂盒、煮沸法、CsCl） | 碱裂解三步原理、柱纯化、A260/A280 与 A260/A230、回收率 | 已做：先加 mixed 规则保留原有正文，再补 3 页 |
| 10 | 生物信息学基础与密码子优化 | `expression-boost` 讲措施；`gene-source` 讲来源 | 序列检索、ORF 判读、限制性图谱、密码子偏好与优化边界 | 新页 1 张，并入 `expression-boost` |
| 11 | 无细胞表达系统 | `expression` 表内一行；`industry` 提及 | 裂解液体系、能量再生、批式/连续、产量瓶颈 | 已做：1 页并入 `expression`，配 1 图 |
| 12 | 代谢工程与合成生物学 | `synthetic-genome` 讲 Sc2.0；glossary 有定义 | DBTL 循环、底盘、途径模块化、通量平衡 | 已做：1 页并入 `application` |
| 13 | 转基因植物再生 | `plant-delivery` 有七法 | 组织培养再生、芽/根诱导、筛选与转基因植株鉴定 | 已做：1 页并入 `plant-delivery`，配 1 图 |
| 14 | 实验室生物安全 | `safety-principles` 讲 GMO 评价与生物安全等级 | 操作级防护、废弃物灭活、抗性基因扩散 | 已做：1 页并入 `safety-principles` |

## 表 2　站内有、教材写得更深（可加深的点）

| # | 主题 | 站内现状 | 教材更深的点 |
|---|---|---|---|
| 1 | 基因表达调控 | `promoter` 只讲 T5 / lac / AOX1 的诱导开关 | lac 操纵子的负调控与 CAP–cAMP 正调控、trp 衰减、葡萄糖效应、严谨反应 |
| 2 | DNA 复制机制 | `polymerase-enzyme`、`dna-binding-protein` 按酶逐个讲 | 复制叉与引发体、前导/滞后链、拓扑与终止、复制起点识别 |
| 3 | DNA 损伤与修复 | 新增 `edit-repair` 只讲双链断裂后的 NHEJ / HDR | 错配修复、BER / NER、SOS 应答、甲基化修复、突变热点 |
| 4 | 同源重组与转座 | `assembly`、`yeast-integrative` 从操作讲 | Holliday 连接体、RecBCD / RecA 途径、位点特异性重组、转座子类型与机制 |
| 5 | 转录与 RNA 加工 | `rna-polymerase` 只讲噬菌体 RNA 聚合酶 | 真核 RNAP II 与启动子元件、加帽/加尾/剪接、可变剪接 |
| 6 | 翻译与密码子 | `codon-optimization` 只讲优化做法 | 起始/延伸/终止、tRNA 与氨酰化、稀有密码子与翻译停顿 |
| 7 | 蛋白折叠与修饰 | `inclusion-body`、`yeast-glyco` 从工艺角度讲 | 分子伴侣、二硫键形成、脯氨酸顺反异构、泛素–蛋白酶体降解 |
| 8 | 分子杂交动力学 | `hybridization` 讲 Tm 与严格度 | Cot 曲线与复杂度、液相/固相杂交动力学、探针长度与信号关系 |
| 9 | 免疫检测 | `immunodetection` 四种方法并列一页 | 单抗/多抗制备、ELISA 夹心与竞争类型、Western 定量与内参 |
| 10 | 细胞培养 | `animal-delivery` 只列导入方法 | 无菌操作、传代与汇合度、培养基与血清、污染判读、悬浮驯化 |
| 11 | 生物反应器与放大 | `pichia-induction` 只给补料节奏 | kLa、OUR / OTR、补料策略、放大判据、代谢副产物 |
| 12 | 层析理论 | 新增 `chromatography` 偏操作参数 | 分辨率公式、理论塔板、梯度形状、载量与线性流速 |

附：站内反而更细、教材多为一段带过的主题（保持现有深度即可）：限制酶四型与星活性、载体图谱与宿主基因型、芽孢杆菌 σ 因子与分泌途径、酵母五类载体、法规与全球种植数据、酶学参数与 pI、胰岛素实例。

## 表 3　两边口径冲突（并列保留，不裁决）

| 主题 | 口径 A | 口径 B | 站内处理 |
|---|---|---|---|
| λ 载体容量 | 重组分子总长 38–52 kb | 插入型 0–10 kb；置换型 10–25 kb（部分教材 15–20 kb） | 两种并列，不合并 |
| 限制酶 1 U 定义 | 20 μL 体系、1 μg DNA、37 ℃ 1 h | 50 μL 体系、1 μg DNA、37 ℃ 1 h | 站内取 20 μL，注明体系 |
| PCR 问世年份 | 1983 年构想 | 1985 年公开报道 | 写「1985 年公开报道」，不写「发明于」 |
| pUC 拷贝数 | 500–700 拷贝/细胞 | 200–700 拷贝/细胞 | 取 500–700，注明宿主与培养条件相关 |
| Ti 质粒 T-DNA 长度 | 约 20 kb | 约 23 kb | 并列区间，不取单值 |
| 化学转化效率 | 10⁷–10⁸ cfu/μg | 10⁶–10⁷ cfu/μg | 站内取 10⁷–10⁸，注明菌株与操作差异 |
| 蓝白斑 X-gal 浓度 | 20 μg/mL | 40 μg/mL | 给区间 20–40 μg/mL |
| 胰岛素表达策略 | A/B 链分别表达后复性 | 单链前体（proinsulin）表达后酶切 | 两种策略并列 |
| 全球转基因面积 | 1.9 亿公顷 | 2 亿公顷 | 按年份并列，不取单值 |
| 工具酶分类 | 四类（切、接、扩、修） | 五类（含修饰酶单列） | 站内四类，「修」内含修饰酶 |

## 本轮按表 1 补齐的范围

已补 10 页，共 3 028 汉字：

| 模块 | 新页 |
|---|---|
| mutagenesis | edit-crispr（266 字）、edit-repair（321 字）、edit-tools（295 字） |
| expression | mammalian-expression（291 字）、bevs（297 字） |
| verification | rnai（260 字） |
| animal-delivery | transgenic-animal（304 字） |
| application | gene-therapy（289 字） |
| soluble-purification | chromatography（374 字） |
| expression-boost | codon-optimization（331 字） |

配图 3 张：edit-paths、rnai-pathway、chromatography。

## 表 2 的加深（已做）

表 2 列的 12 处已全部加深，另加 1 页熔解曲线判读（qpcr，作为新图宿主），共 13 页、约 4 030 汉字：

| 主题页 | 模块 | 核心判据 |
|---|---|---|
| operon-logic | promoter | 诱导与葡萄糖阻遏分开查 |
| replication-fork | polymerase-enzyme | 前导连续、滞后分段，辅助蛋白各管一段 |
| dna-repair | mutagenesis | 五条通路对应不同损伤，SOS 易错 |
| hr-transposition | yeast-integrative | 同源臂 vs 转座末端重复 |
| transcription-processing | rna-polymerase | 原核共转录、真核先加工 |
| translation-steps | expression-boost | 起始定效率、延伸受 tRNA 限制 |
| folding-ptm | inclusion-body | 伴侣、二硫键、糖基化缺一不可 |
| hybrid-kinetics | hybridization | Cot 与严格度的权衡 |
| antibody-assays | immunodetection | 夹心/竞争的选择与检测限 |
| cell-culture | animal-delivery | 汇合度、传代、支原体 |
| bioreactor-scaleup | yeast-host | kLa 与 OUR=OTR |
| chromatography-theory | soluble-purification | Rs、N、载量三者分开判断 |
| qp-melt | qpcr | 单峰特异、低温峰为二聚体 |

配图 9 张（mammalian-culture、bevs-cycle、transgene-routes、gene-therapy-vectors、codon-map、double-crossover、crispr-screen、western-flow、qpcr-melt），全部自绘 SVG，沿用纸墨四色。

## 收尾补页（已做）

7、9、11–14 共 9 页，约 4 000 汉字，全部并入已有模块，不新增路由：

| 主题页 | 模块 | 核心判据 |
|---|---|---|
| omics-map | sequencing | 三层各答一个问题，层间可以不一致 |
| molecular-diagnostics | sequencing | 分析性能与临床场景分开看，阴性不等于排除 |
| prep-alkaline | prep-branch | 冰上减慢不可逆损伤，裂解宁短勿长 |
| prep-column | prep-branch | 沉淀去杂质 vs 吸附留质粒，纯度与得率同看 |
| prep-quant | prep-branch | 三种定量测的不是同一个东西 |
| cell-free | expression | 生长与合成解耦，能量再生与放大是瓶颈 |
| metabolic-engineering | application | 得率、生产强度、终浓度互相牵制 |
| plant-regeneration | plant-delivery | 再生出植株不等于转化成功 |
| lab-biosafety | safety-principles | 等级由风险与操作共同决定 |

配图 3 张：omics-layers、cell-free-flow、plant-regeneration。`prep-branch` 先加 mixed 规则再挂页，原有 34 段正文（含「只看三个指标」）完整保留。
