# 配图盘点（内部）

口径：图只按 ID 记，页面上的图注不带文件名与来源；「所在模块」指首次挂载的模块，节点图与页内图可能同时出现。

## 现有图（46 张，全部已挂载）

| ID | 主题 | 所在模块 |
|---|---|---|
| pcr-cycles | PCR 三步循环的温度–时间曲线 | pcr-program |
| qpcr-curve | qPCR 标准曲线与扩增曲线 | qpcr |
| restriction-site | 识别序列与错位切口 | recognition-site |
| dna-ends | 黏端、平端、同尾酶 | dna-ends |
| ligation-ends | 连接反应的末端配对 | ligation |
| overlap-assembly | 重叠延伸 PCR 拼接 | overlap-extension / op-assemble |
| gel-migration | 琼脂糖凝胶迁移 | verify-electrophoresis |
| blot-transfer | 核酸印迹转膜 | hybridization |
| sanger-ladder | Sanger 双脱氧测序梯 | sequencing |
| illumina-sbs | Illumina 边合成边测序 | sequencing |
| nanopore | 纳米孔测序 | sequencing |
| alpha-complement | α-互补与蓝白斑 | select-blue-white |
| plate-blue-white | 蓝白斑平板判读 | select-blue-white |
| plasmid-general | 质粒通用结构 | part-plasmid / part-vector |
| plasmid-pbr322 | pBR322 图谱 | part-pbr322 |
| plasmid-puc18 | pUC18 图谱 | part-puc18 / origin-foundations |
| plasmid-pet28a | pET-28a 图谱 | puc18 |
| plasmid-px459 | pX459 图谱 | puc18 |
| lambda-genome | λ 基因组与载体容量 | part-phage |
| vector-capacity | 各类载体容量对照 | part-artificial |
| ti-plasmid | Ti 质粒与 T-DNA | vector-expression |
| yeast-factory | 酵母表达系统 | part-host / yeast-platform |
| yeast-two-hybrid | 酵母双杂交 | yeast-two-hybrid |
| ssh-suppression | 抑制性杂交筛选 | other-isolation |
| delivery-methods | 物理导入方法 | deliver-physical |
| sec-tat | 芽孢杆菌四条分泌途径 | bacillus-secretion |
| ni-nta | Ni-NTA 亲和纯化 | fusion-purification |
| inclusion-refold | 包涵体复性 | inclusion-body |
| struct-cas9 | Cas9 结构域（PDB 4OO8） | enzyme-discovery |
| struct-taq | Taq 聚合酶结构（PDB 1TAQ） | enzyme-discovery |
| struct-gfp | GFP β-桶（PDB 1EMA） | enzyme-discovery |
| edit-paths | NHEJ / HDR 两条修复路径 | mutagenesis |
| rnai-pathway | Dicer–RISC–靶 mRNA | verification |
| chromatography | IEX 与 GFC 峰图 | soluble-purification |
| mammalian-culture | HEK293 瞬时 / CHO 稳定两条工艺 | expression |
| bevs-cycle | 杆状病毒生活史与 Bac-to-Bac | expression |
| transgene-routes | 原核注射 / ES 打靶 / 核移植 | animal-delivery |
| gene-therapy-vectors | LNP / AAV / 慢病毒容量与表达 | application |
| codon-map | 密码子表与稀有密码子 | expression-boost |
| double-crossover | 双交换与基因打靶 | yeast-integrative |
| crispr-screen | sgRNA 文库筛选 | mutagenesis |
| western-flow | Western blot 流程与读膜 | immunodetection |
| qpcr-melt | 扩增曲线与熔解峰 | qpcr |
| omics-layers | 基因组 / 转录组 / 蛋白组三层对照 | sequencing |
| cell-free-flow | 无细胞表达与能量再生 | expression |
| plant-regeneration | 外植体到炼苗的再生流程 | plant-delivery |

## 建议补的图（12 张，已做 12 张）

| # | ID | 主题 | 理由 | 状态 |
|---|---|---|---|---|
| 1 | edit-paths | 双链断裂后的 NHEJ/HDR | 编辑结果由修复路径决定，文字难讲清分叉 | 已做 |
| 2 | rnai-pathway | Dicer–RISC 通路 | 敲低是酶促级联，箭头图比段落直观 | 已做 |
| 3 | chromatography | IEX/GFC 峰图 | 盐梯度与出峰顺序必须看图 | 已做 |
| 4 | mammalian-culture | HEK293 瞬时 vs CHO 稳定 | 两条工艺路线与糖型差异适合并列 | 已做（expression） |
| 5 | bevs-cycle | 杆状病毒生活史与 Bac-to-Bac | 病毒周期与转座建株是两套流程 | 已做（expression） |
| 6 | transgene-routes | 原核注射 / ES 打靶 / 核移植 | 三条路线的起点与效率差异大 | 已做（animal-delivery） |
| 7 | gene-therapy-vectors | AAV / 慢病毒 / LNP 容量与时长 | 选载体先看容量与表达时长 | 已做（application） |
| 8 | codon-map | 密码子偏好与优化前后 | 同义替换的分布用热图最清楚 | 已做（expression-boost） |
| 9 | double-crossover | 同源重组双交换 | 基因打靶与敲入的经典机制图 | 已做（yeast-integrative） |
| 10 | crispr-screen | sgRNA 文库筛选 | 全基因组筛选的池化流程 | 已做（mutagenesis） |
| 11 | western-flow | Western blot 全流程 | 现有印迹图只讲转膜，缺封闭/抗体/显影 | 已做（immunodetection） |
| 12 | qpcr-melt | 熔解曲线 | 现有 qPCR 图只讲标准曲线，缺产物特异性判读 | 已做（qpcr） |

素材口径：全部自绘 SVG，沿用纸墨配色（ink / hair / cinnabar），不引外部图片；需要位图时只用可商用或自绘素材。
