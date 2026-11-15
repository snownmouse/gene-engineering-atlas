# 深度补写清单（2026-11）

口径：六站、131 模块、页面组织不变；新内容一律并入已有模块，单位用「页」；不写出处名、章节号、页码。
只补「机制 / 判据 / 边界 / 近年进展」；查不到可靠口径的写「此处未载」。

## 一、自评方法

1. 通读 131 个模块的正文与条目：按「自有正文汉字数 + 知识页数」估体量，标出停在教科书层面的模块。
2. 判断「浅」的三条标准：只给结论不给判据；只讲经典做法不讲近年变化；有方法名但没有适用边界与失败模式。
3. 只对「近年真有进展、且站内现有页回答不了」的主题立项；纯经典且已讲透的模块不动（如限制酶四型、pUC18 图谱、酶切缓冲液表）。

## 二、待补清单（15 页，按站分批）

| 站 | 模块 | 现有体量 | 停在哪 | 缺什么（近年进展） | 补法 |
|---|---|---|---|---|---|
| 切 | mutagenesis | 约 950 字 + 4 页 | 讲 CRISPR 切割、NHEJ/HDR、ZFN/TALEN/碱基编辑/先导编辑，但停在「工具是什么」 | 碱基编辑与先导编辑的编辑窗口、PAM 限制、递送与在研管线；表观编辑（CRISPRoff/CRISPRon）只改修饰不改序列；体内编辑的剂量与脱靶判据 | 1 页 `edit-clinical` |
| 切 | synthesis | 约 670 字 + 1 页 | 化学合成按长度分段拼接，成本随长度上升 | 芯片寡核苷酸池与酶促合成（更长、更省、错误率更高）；合成长度—错误率—组装层数的关系；合成长基因组的现实边界 | 1 页 `dna-synthesis-now` |
| 切 | qpcr | 约 1 080 字 + 1 页 | Ct 与熔解曲线判读完整 | 数字 PCR 的绝对定量、分区数与泊松校正；低丰度与抑制物场景的选择判据；与 NGS 的互补边界 | 1 页 `dpcr` |
| 接 | assembly | 约 910 字 | 酶切连接、In-Fusion、Gibson、Golden Gate 的选择 | 算法辅助的组装设计（片段数上限、同源臂长度、重复序列导致的失败）；大片段与多片段组装的降级路径 | 1 页 `assembly-design` |
| 接 | vector | 约 3 390 字 | 按大小与宿主选质粒、λ、黏粒、BAC/YAC | 非病毒 DNA 载体（dbDNA、ceDNA、minicircle）的容量与持续表达；病毒载体与质粒的分工；载体工程的近年路线 | 1 页 `next-gen-vectors` |
| 转 | delivery-routes | 约 1 170 字 | 转化、侵染、物理导入三条路线 | LNP 的肝外靶向（SORT、可电离脂质 pKa）、AAV 新血清型与衣壳工程、VLP/eVLP 递送编辑器；各路线在体内的富集器官与剂量边界 | 1 页 `next-gen-delivery` |
| 转 | plant-delivery | 约 340 字 + 1 页 | 七种导入法与再生 | 基因编辑作物的监管分类（SDN-1/2/3）、中国安全证书与商业化现状；编辑作物的检测难点（无外源片段时怎么查） | 1 页 `plant-editing-status` |
| 增 | medicine | 约 2 360 字 | 生物药、乳腺反应器、基因诊断与治疗的定义 | 已上市细胞与基因治疗产品的类型与边界（CAR-T、TCR-T、TIL、通用型、体内 CAR-T）；实体瘤为何难；产品与技术的对应关系 | 1 页 `cell-gene-products` |
| 增 | medicine | 同上 | 只有 LNP 递送 siRNA 的一行 | mRNA 技术：修饰核苷降低免疫原性、5′ 帽与 poly(A)、saRNA 与环状 RNA、稳定性与冻干、平台化换靶的时间优势与边界 | 1 页 `mrna-therapy` |
| 检 | sequencing | 约 1 590 字 + 2 页 | 三平台并列，组学三层与分子诊断已补 | 长读长与单分子：HiFi 与 ONT 的读长—准确率—甲基化直读；结构变异与重复区的判据；与短读长的组合策略 | 1 页 `long-read` |
| 检 | sequencing | 同上 | RNA-seq 只到 counts/TPM | 单细胞与空间组学：UMI、细胞 calling、批次效应；空间分辨率与通量的取舍；什么结论单细胞能给、什么给不了 | 1 页 `single-cell-spatial` |
| 检 | verification | 约 750 字 + 1 页 | DNA/RNA/蛋白三层验证，加 CRISPR 筛库图 | 编辑后的脱靶检测：GUIDE-seq、CIRCLE-seq、Digenome-seq 与全基因组测序的分辨率与假阳性；无对照时怎么判 | 1 页 `offtarget-detection` |
| 养 | synthetic-genome | 约 720 字 | Sc2.0、最小基因组、57 密码子、成本 | 基因组精简的现状：Syn3.0/Syn3A 的基因数与生长速率、Sc2.0 的完成度与染色体设计规则；重编码的边界（终止密码子释放） | 1 页 `genome-minimization` |
| 养 | expression-boost | 2 页 | 载体、密码子、mRNA 稳定性、蛋白稳定性逐层加码 | AI 在蛋白与元件设计上的现状：结构预测与复合物、蛋白语言模型、启动子/RBS 的预测模型；湿实验验证的边界与失败判据 | 1 页 `ai-protein-design` |
| 养 | yeast-host | 约 470 字 + 1 页 | 高密度培养、kLa 与 OUR=OTR 已补 | 连续培养与灌流：稀释率、菌株稳定性、产物抑制；与补料批式的放大判据差异；连续制造在生物药上的现状 | 1 页 `continuous-fermentation` |

小计：切 3、接 2、转 2、增 2、检 3、养 3，共 15 页。

## 三、看过但不立项（复查后更新）

复查口径：能用公开方法学或官方规范落到「机制 / 参数 / 判据」的就补；只能复述条文或押时间点的，不立项并写明理由。

| 模块 | 首次判断 | 复查结论 | 本轮处理 |
|---|---|---|---|
| cell-free | 缺具体产量，口径不稳 | 产量确实不能横比，但能量再生、副产物抑制与批间差能落到机制 | 新增 `cell-free-scale`（expression） |
| metabolic-engineering | 再写只能堆例子 | FBA 上限、通量范围与实际通量的差别是机制层内容 | 新增 `flux-balance`（application） |
| molecular-diagnostics | 缺指南后半段原文 | 阈值可以写成「各室自建验证」的操作判据，统一数值仍缺 | 新增 `mngs-limits`（sequencing），统一阈值保留「此处未载」 |
| inclusion-body | 机制与边界已够 | 复性浓度、氧化还原对与收率判据仍缺 | 新增 `refold-boundary`（inclusion-body） |
| hybridization | 近年变化属设备层 | 甲酰胺换算、SSC 梯度与洗膜不可逆属判据层 | 新增 `wash-stringency`（hybridization） |
| gel | 同上 | 胶浓度—分子量范围、还原条件与条带异常可写 | 新增 `page-separation`（gel） |
| marker、auxotroph | 与现有正文重复度高 | sacB / upp 反选与 loxP 疤痕的判据不重复 | 新增 `marker-free`（marker） |
| gene-source、prokaryote-expression | 并入 AI 页更合适 | 稀有密码子与 tRNA 供给属独立机制，AI 页装不下 | 新增 `rare-codon`（prokaryote-expression） |
| ethics、management-models、china-gmo-status | 法规数字易过期 | **补不了**：批准状态与种植面积按年份变，站内已按年份并列；再写只能抄条文或押时间点，且没有稳定权威口径能落到机制层 | 不立项，理由留档 |

## 六、延展一轮（8 页，共 3 976 汉字）

| 站 | 页 | 汉字 | 模块 |
|---|---|---|---|
| 增 | cell-free-scale | 556 | expression |
| 增 | flux-balance | 533 | application |
| 检 | mngs-limits | 603 | sequencing |
| 养 | refold-boundary | 515 | inclusion-body |
| 检 | wash-stringency | 422 | hybridization |
| 检 | page-separation | 433 | gel |
| 增 | marker-free | 459 | marker |
| 增 | rare-codon | 455 | prokaryote-expression |

每页均给参数、判据与失败模式；`mngs-limits` 明确写出「跨实验室统一阈值此处未载」的理由，`cell-free-scale` 与 `refold-boundary` 也标注了不能横比的项。

## 七、「难点与边界」（18 页，共 2 094 汉字）

15 个深度页各补一条，另加 gene-therapy、chromatography、lab-biosafety 三处值得写的地方：

| 范围 | 页数 | 写法 |
|---|---|---|
| 15 个深度页 | 15 | 卡在哪个参数、常见失败模式、什么条件下不适用；全部落到窗口位置、pKa、稀释率、胶浓度、点直径一类具体量 |
| gene-therapy、chromatography、lab-biosafety | 3 | 补免疫与剂量上限、分辨率—载量—流速的牵制、压差与灭菌验证的失效方式 |

新增字段 `limits` 只在有内容时渲染为「难点与边界」小节，不改变既有版式与交互。

## 八、三处「此处未载」的复查结果

| 项 | 复查结果 | 处理 |
|---|---|---|
| mNGS 阈值 | 现行指南与共识不给跨实验室统一的 reads / RPM 阈值，要求各室自建并验证检出限；能写的是对照、背景清单与四条判据 | 新增 `mngs-limits`；统一阈值仍写「此处未载」，并说明原因 |
| 植物再生激素浓度 | 已有按物种、外植体、阶段的数值；没有官方推荐标准值，也没有跨物种通用表 | 补「出处性质与适用范围」一条：属已发表体系的条件性数值，引用须连同基因型与外植体 |
| BSL-3/4 设施参数 | 压差、气流、HEPA、互锁与废弃物出口已有数值；GB 19489—2008 与 WHO 手册口径并列 | 维持现有数值与并列说明；本轮补废弃物灭菌的三类失效方式 |

## 九、延伸资源与新演示

- 延伸资源：10 个模块底部加「延伸资源」，共 28 条数据库/厂商/课程链接与 8 张视频卡片；每条写机构与「能查到什么」，视频标时长量级与看点，全部新窗口外链。
- 新演示：`sbs`（挂 `seq-ngs`）、`western`（挂 `antibody-assays`）、`crispr`（挂 `edit-crispr`），沿用步进、播放/暂停、末步不回绕与打印兜底。
- 外链逐条实际访问核验；HHMI BioInteractive 与 EMA 深链返回拦截或错误页，已去掉；Cytiva 深层页不可达，改链到蛋白研究总入口。

## 四、执行批次

1. 切：edit-clinical、dna-synthesis-now、dpcr
2. 接：assembly-design、next-gen-vectors
3. 转：next-gen-delivery、plant-editing-status
4. 增：cell-gene-products、mrna-therapy
5. 检：long-read、single-cell-spatial、offtarget-detection
6. 养：genome-minimization、ai-protein-design、continuous-fermentation

每批：并入已有模块 → validate / links / build → 报进度与新增量。
全部完成后：清 dist 重建、smoke 逐路由、375 审计、4320 指向最新产物、报总数与分站字数。

## 五、完成情况（15 页，共 8 562 汉字）

| 站 | 页 | 汉字 | 模块 |
|---|---|---|---|
| 切 | edit-clinical | 696 | mutagenesis |
| 切 | dna-synthesis-now | 536 | synthesis |
| 切 | dpcr | 538 | qpcr |
| 接 | assembly-design | 556 | assembly |
| 接 | next-gen-vectors | 550 | vector |
| 转 | next-gen-delivery | 659 | delivery-routes |
| 转 | plant-editing-status | 596 | plant-delivery |
| 增 | cell-gene-products | 559 | medicine |
| 增 | mrna-therapy | 630 | medicine |
| 检 | long-read | 541 | sequencing |
| 检 | single-cell-spatial | 561 | sequencing |
| 检 | offtarget-detection | 590 | verification |
| 养 | genome-minimization | 525 | synthetic-genome |
| 养 | ai-protein-design | 558 | expression-boost |
| 养 | continuous-fermentation | 467 | yeast-host |

分站小计：切 1 770、接 1 106、转 1 255、增 1 189、检 1 692、养 1 550。

未新增路由、未改版式与动效；每页均带参数、条件边界与失败判据，含近年进展的页写明「到 2026 年」的口径。
