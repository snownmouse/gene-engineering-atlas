# 主题级覆盖对照（内部）

对照对象（只记主题级，不抄原文、不记页码）：

- 《基因工程原理》（吴乃虎）
- 《现代分子生物学》（朱玉贤等）
- 《分子克隆实验指南》（Green & Sambrook）
- Principles of Gene Manipulation（Old & Primrose）
- Gene Cloning and DNA Analysis（Brown）
- An Introduction to Genetic Engineering（Nicholl）

站点基线：6 站、131 个知识模块、143 条路由、479 个知识页。以下三张表只做主题判断；教材名与页码只留在本文件，不进站点正文。

改法口径（已定）：只做内容补充——缺的知识点、判读标准、条件边界加进现有模块；不改结构、版式与动效，不新增路由、不新做页面。补不齐的留白并写清缺什么，两种强争议口径并列保留。

## 表 1　教材有、站内没有或明显偏薄

| # | 主题 | 站内现状 | 缺什么 | 建议 |
|---|---|---|---|---|
| 1 | 基因编辑 | `op-mutate` 表内一行「CRISPR 编辑」；`pX459` 图谱页；`struct-cas9` 结构页 | sgRNA–PAM–Cas9 切割机制、NHEJ/HDR 两条修复、脱靶与检测、ZFN/TALEN/碱基编辑/先导编辑、RNP–LNP–AAV 递送对比 | 已做：3 页并入 `mutagenesis`（edit-crispr、edit-repair、edit-tools），配 1 图 |
| 2 | 哺乳动物细胞表达 | `part-host` 一行 CHO/HEK293；`medicine` 一行滴度；`yeast-glyco` 作对照 | 瞬时/稳定转染流程、筛选与扩增、糖基化差异、无血清悬浮培养、滴度与质量 | 已做：1 页并入 `expression`（mammalian-expression），配 1 图 |
| 3 | 昆虫杆状病毒表达系统 | 仅 `medicine` 表中「HEK293 / 杆状病毒」一处 | 杆状病毒生活史、Bac-to-Bac、Sf9/High Five、分泌与翻译后修饰 | 已做：1 页并入 `expression`（bevs），配 1 图 |
| 4 | RNA 干扰与基因沉默 | 仅 LNP 递送表提到 siRNA；无机制页 | dsRNA→Dicer→RISC→切割；siRNA/shRNA/miRNA/反义 RNA 的区别与用量 | 已做：1 页并入 `verification`（rnai），配 1 图 |
| 5 | 转基因动物制作 | `animal-delivery` 列了方法；`part-host` 列了受体 | 原核显微注射、ES 细胞打靶、体细胞核移植、Cre/loxP 条件敲除、鉴定与品系维持 | 已做：1 页并入 `animal-delivery`（transgenic-animal），配 1 图 |
| 6 | 基因治疗 | `medicine` 一段定义；LNP/AAV/慢病毒递送表 | 体外/体内两条路线、CAR-T、已批产品与适应证、插入突变与免疫反应 | 已做：1 页并入 `application`（gene-therapy）；本轮补已批产品适应证、年龄与抗体门槛 |
| 7 | 分子诊断与组学 | `sequencing` 有三平台；`qpcr` 完整；`hybridization` 有杂交 | 基因芯片、RNA-seq 流程、差异表达与生信入口 | 已做：2 页并入 `sequencing`（omics-map、molecular-diagnostics），配 1 图 |
| 8 | 蛋白质层析纯化 | Ni-NTA、可溶性纯化、包涵体复性都有；IEX/GFC/HIC 只在表里点名 | 离子交换、凝胶过滤、疏水层析的分离原理、盐梯度、峰图判读、标签切除 | 已做：1 页并入 `soluble-purification`（chromatography，配 1 图）；本轮补峰图判读与标签切除 |
| 9 | 质粒提取与核酸定量 | `prep-plasmid` 节点列方法名（碱裂解、试剂盒、煮沸法、CsCl） | 碱裂解三步原理、柱纯化、A260/A280 与 A260/A230、回收率 | 已做：先加 mixed 规则保留原有正文，再补 3 页 |
| 10 | 生物信息学基础与密码子优化 | `expression-boost` 讲措施；`gene-source` 讲来源 | 序列检索、ORF 判读、限制性图谱、密码子偏好与优化边界 | 已做：codon-optimization 并入 `expression-boost`；本轮补 seq-basics 到 `gene-source` |
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

## 联网补齐（四批，已做）

口径：只补现有条目，不新增路由；不写出处名与页码；找不到的继续留白。

| 批次 | 位置 | 补的内容 | 来源类型 |
|---|---|---|---|
| 1 | op-digest 双酶切表 | 8 对酶逐格给 TaKaRa / NEB / Thermo 缓冲液与相对活性；4 条条件边界 | 三家官方缓冲液兼容表 |
| 2 | molecular-diagnostics | mNGS 四类阳性判断值、对照与质控、报告范围、假阴性边界 | 2026 规范化应用指南、2020 专家共识、急危重症共识 |
| 2 | lab-biosafety | BSL-3 两档压差、气流/HEPA/互锁、BSL-4 生命支持；WHO 与 GB 并列 | GB 19489—2008、WHO LBM 4th ed |
| 3 | plant-regeneration | 拟南芥、烟草三个种、水稻、番茄的激素范围与外植体条件 | 原始论文与已发表体系 |
| 4 | br-coordinates | pBR322 / pUC18 功能区与位点坐标，插入失活对应关系 | NEB 官方图谱、GenBank |
| 4 | law-cn | 农业转基因生物安全管理条例条文号 | 国务院公报原文 |
| 4 | safe-bsl、hyb-transfer、seq-endpoint | P/BSL 非一一对应、印迹三步机制、测序读长与失败模式 | 条例、GB 19489、方法学通识 |
| 5 | seq-basics（gene-source） | 登记号与版本、6 个读框与 ORF 边界、环状限制性图谱、非标准遗传密码 | GenBank/ENA/DDBJ 说明、NCBI 遗传密码表 |
| 5 | chromatography | 峰图判读（肩峰、电导峰、重复峰）、TEV/凝血酶切标签后二次纯化 | 厂商层析手册、方法学通识 |
| 5 | gene-therapy | 已批产品适应证与年龄：Luxturna（RPE65）、Zolgensma（SMN1）、Casgevy（SCD/TDT，2026 扩到 ≥2 岁）、Hemgenix / Roctavian（血友病 B/A）、今又生与安柯瑞；抗体与器官功能门槛 | FDA/EMA 说明书与 2026 年补充批准公告 |
| 6 | lab-biosafety | 废弃物出口（生物安全型双扉高压灭菌器、清洁侧门联锁）、不能高压物品的替代措施、污水与辅助区处理及效果监测、紫外线只作辅助；灭菌的三类失效 | GB 19489—2008 第 6.3.5 条 |

第 2–4 批净增 2 067 汉字（不含数字与英文）；第 1 批为双酶切表逐格替换，未单列字数。仍未取到全文：2026 mNGS 指南「结果判读/报告」后半段、玉米/小麦/大豆再生的单一一手体系；GB 19489 的废弃物条款已补到「设施与流程」层，具体的灭菌温度—时间组合与化学消毒剂浓度表未逐条抄录。

## 延展轮（第 7 批，已做）

| 位置 | 补的内容 | 结果 |
|---|---|---|
| expression、application、sequencing、inclusion-body、hybridization、gel、marker、prokaryote-expression | 8 个新页：无细胞放大、通量平衡、mNGS 判读边界、复性边界、洗膜严格度、SDS-PAGE 分离、无抗性筛选、稀有密码子 | 共 3 976 汉字，全部并入已有模块 |
| 15 个深度页 + gene-therapy、chromatography、lab-biosafety | 「难点与边界」：卡在哪、常见失败模式、什么条件下不适用 | 18 页，共 2 094 汉字 |
| mNGS 阈值 | 统一 reads / RPM 阈值仍无权威通用口径，写清「各室自建验证」与四条判据 | 保留「此处未载」并说明原因 |
| 植物再生激素 | 补出处性质与适用范围：已发表体系的条件性数值，无官方标准值 | 数值不新增，边界写明 |
| BSL-3/4 | 数值沿用 GB 19489—2008 与 WHO 并列口径；补废弃物灭菌三类失效 | 不新增未核实数值 |
| 10 个模块底部 | 延伸资源：Addgene、GenBank、UniProt、PDB、NCBI Datasets、SGD、NEB、Thermo、Cytiva、iBiology、MIT OCW、Learn.Genetics 等 | 28 条链接 + 8 张视频卡，逐条访问核验 |
| seq-ngs、antibody-assays、edit-crispr | 新演示：SBS 测序循环、Western 转膜显色、Cas9 切割与修复 | 沿用现有演示的步进、播放与打印兜底 |

外链核验记录：HHMI BioInteractive、EMA 深链与部分厂商深层页返回拦截或错误页，已去掉或改链总入口；NCBI Datasets 在人工浏览器可正常打开（自动化访问会先过 reCAPTCHA），故保留并注明去向。
