# 基因工程站点 · 信息架构方案（总图版）

> **2026-11-10 方向修正：总图方案已撤，本文仅作历史记录。**
> 现行结构是「叙事板序列」：45 个旧节点重组为 13 块板，一板一页；首页是可滚动的主线入口。
> 只做桌面端（1440，最低 1280），移动端适配、总图、路径 tour、节点页均已移除。
> 现行数据见 `src/data/story/outline.json` 与 `src/data/story/boards/`。

> 状态：待评审，未改代码。现有 ch01/ch03/ch04 正文作为迁移底稿保留。
> 目标：把“按章排的笔记”改成“一张统领全站的技术链路图”，章节降级为图上的路径。

---

## 1. 一句话结构

全站只有一张图：**从元件到产物的基因工程链路**。

```
元件库 ──→ 切割 ──→ 连接 ──→ 组装 ──→ 导入 ──→ 筛选 ──→ 表达 ──→ 验证 ──→ 应用
  ↑                                                          │
  └────────────── 失败回流：重切 / 重连 / 重导 ←──────────────┘

下带：样品制备（提取 → 定量 → 电泳）为验证供样
顶带：学科前史（理论 → 技术 → 1972/1973）
底带：安全与法规，对导入、应用施加约束
```

- 横向是**操作主链**，纵向是**供给与约束**。
- 每个圆点是节点，节点有独立页面；连线有类型（物质流、元件供给、选择压力、验证反馈、失败回流、治理约束）。
- 章节不再拥有正文，只登记一条“走法”（tour）：一串节点 id。点章节 = 在图上点亮这条路径。

---

## 2. 与生化三件套的对应

| 生化 | 本项目 | 职责 |
|---|---|---|
| `data/homeMap.ts` | `data/map/nodes.ts` + `data/map/edges.ts` | 节点、边、类型、证据来源；唯一内容源 |
| `data/homeLayout.ts` | `data/map/layout.ts` | 画布尺寸、分区带、节点坐标、标签朝向、连线偏移 |
| `lib/bubbleModel.ts` | `lib/mapModel.ts` | 把节点/边/路径推导成悬浮标签、当前路径高亮集、上下站 |
| `data/skeleton*.json` 管步骤 | `data/tours/*.json` | 章节 → 有序节点 id；只存路径元信息与考点卡 |
| `HomeMap` 组件 | `components/map/MapCanvas.tsx` | 一张 SVG 总图；tour 模式只改高亮，不换版式 |
| 通路页 | `pages/NodePage.tsx` | 节点正文页，复用现有 `BlockRenderer` |
| 通路页的挂图 | `pages/ChapterPage.tsx` | 改为“总图 + 路径侧栏”，不再渲染章节正文 |

关键原则：**节点正文只有一份**。章节页不复制段落，只引用节点 id；节点页显示“属于哪几条路径”，反查 tour。

---

## 3. 节点清单（45 个）

层级说明：`L0 起源/总览`、`L1 主链站`、`L2 机制/标本`、`L3 缺口`。缺口节点没有足够课件证据，页面只放“已知一句 + 待核对 + 需要什么材料”。

### 3.1 起源与总览（3）

| id | 名称 | 层级 | 现有证据 |
|---|---|---|---|
| `origin-foundations` | 理论前提与技术前提 | L0 | ch01 三大发现、三大发明 |
| `origin-timeline` | 1972/1973 与之后 | L0 | ch01 诞生标志、发展年表、两个案例 |
| `concept-workflow` | 基因工程是什么 · 切接转检养 | L0 | ch01 概念三层定义、五步流程 |

### 3.2 元件库（12）

| id | 名称 | 层级 | 现有证据 |
|---|---|---|---|
| `part-target` | 目的基因 | L1 | ch01 目的基因定义与获取途径 |
| `part-promoter` | 启动子与表达元件 | L2 | ch03 质粒的启动子、ch01 表达元件 |
| `part-vector` | 载体总论 | L1 | ch03 载体定义、7 条特征、分类 |
| `part-plasmid` | 质粒载体 | L2 | ch03 质粒基本特性（拷贝数、不相容、转移、命名） |
| `part-pbr322` | pBR322 | L2 | ch03 pBR322 表、插入失活、转移缺陷、改进型 |
| `part-puc18` | pUC18/19 | L2 | ch03 pUC 优点、MCS、蓝白筛选 |
| `part-phage` | λ 噬菌体载体 | L2 | ch03 λ 基因组、插入型、置换型 |
| `part-m13` | M13 与噬菌粒 | L2 | ch03 单链丝状噬菌体 |
| `part-artificial` | 人工染色体 | L2 | ch03 BAC/YAC/PAC/cosmid、容量图 |
| `part-host` | 宿主细胞 | L1 | ch01 受体类型表；ch03 宿主相关表述 |
| `part-marker` | 标记基因总论 | L1 | ch03 选择性与非选择性标记 |
| `part-reporter` | 报告基因 | L2 | ch03 lacZ、GFP |

### 3.3 工具与操作（6）

| id | 名称 | 层级 | 现有证据 |
|---|---|---|---|
| `tool-enzyme` | 工具酶总览 | L1 | ch01 四类工具酶；ch02 资料清单（无正文） |
| `op-digest` | 切割 | L1 | ch01 限制酶定义；ch03 酶切位点实例 |
| `op-ligate` | 连接 | L1 | ch03 载体构建中的连接；ch02 仅有酶说明书清单 |
| `op-assemble` | 组装 | L1 | ch03 MCS、定向插入；ch01 五步“接” |
| `op-mutate` | 改造 / 诱变 | L3 | ch04 第六节未读，仅登记 |
| `op-pcr` | PCR | L3 | ch04 第四节未读；ch01 仅记 1985 年问世 |

### 3.4 导入（3）

| id | 名称 | 层级 | 现有证据 |
|---|---|---|---|
| `deliver-transform` | 转化（微生物） | L1 | ch01 五步“转”、受体表 |
| `deliver-infect` | 侵染（噬菌体/病毒） | L2 | ch03 λ 高效感染、体外包装 |
| `deliver-physical` | 物理导入（基因枪/电激/显微注射） | L2 | ch01 新技术、乳腺反应器流程 |

### 3.5 筛选与鉴定（4）

| id | 名称 | 层级 | 现有证据 |
|---|---|---|---|
| `select-antibiotic` | 抗生素筛选 | L1 | ch03 抗性基因表、平板筛选 |
| `select-auxotroph` | 营养缺陷型 / supF / sacB | L2 | ch03 GS115、Leu/His/Trp/Lys、URA/ADE、supF、sacB |
| `select-insertional` | 插入失活 | L2 | ch03 pBR322 BamH I / Pst I |
| `select-blue-white` | 蓝白斑 α-互补 | L2 | ch03 lacZΔM15/lacZ′、IPTG/X-gal、平板图 |

### 3.6 表达（2）

| id | 名称 | 层级 | 现有证据 |
|---|---|---|---|
| `vector-expression` | 表达 / 穿梭 / 整合载体 | L1 | ch03 第八节全部 |
| `express-tag` | 融合标签与纯化 | L2 | ch03 His/FLAG/V5/GST、pGEX、PG5 案例 |

### 3.7 样品制备（4）

| id | 名称 | 层级 | 现有证据 |
|---|---|---|---|
| `prep-plasmid` | 质粒 DNA 制备 | L1 | ch04 碱裂解、煮沸、CsCl、产量因素 |
| `prep-genomic` | 基因组 DNA 制备 | L2 | ch04 CTAB、SDS、酵母试剂盒 |
| `prep-rna` | RNA 提取 | L2 | ch04 TRIzol、硅胶膜、RNase 防护 |
| `prep-quantify` | 浓度测定与保存 | L2 | ch04 紫外吸收、纯度、保存 |

### 3.8 验证（6）

| id | 名称 | 层级 | 现有证据 |
|---|---|---|---|
| `verify-electrophoresis` | 凝胶电泳原理 | L1 | ch04 分类、电荷/分子筛、EB、迁移图 |
| `gel-conditions` | 电泳条件与 PAGE | L2 | ch04 缓冲液、上样、浓度、PAGE、染色 |
| `verify-hybridization` | 分子杂交与探针 | L1 | ch04 Southern/Northern、Tm、四类探针 |
| `verify-restriction` | 酶切鉴定 | L2 | ch03 酶切位点 + ch04 电泳 |
| `verify-phenotype` | 表型与报告基因验证 | L2 | ch03 蓝白斑/GFP + ch01 筛选鉴定 |
| `verify-sequence` | 测序 | L3 | ch04 第五节未读，仅登记 |

### 3.9 应用与治理（5）

| id | 名称 | 层级 | 现有证据 |
|---|---|---|---|
| `apply-medicine` | 医药、诊断与基因治疗 | L1 | ch01 基因工程药物、基因诊断、SCID/ADA |
| `apply-agri` | 农业与畜牧 | L2 | ch01 转基因植物、乳腺生物反应器 |
| `apply-industry` | 工业酶与环保 | L2 | ch01 酶制剂、超级细菌、DNA 探针监测 |
| `govern-safety` | 生物安全 | L1 | ch01 四类隐患、物理/生物防护 |
| `govern-regulation` | 法规与伦理 | L2 | ch01 NIH 1976、中国 1993/1996/2002 |

---

## 4. 边怎么连

六种边，各有颜色与线型；默认全部显示但压到 30% 透明度，路径激活时只亮本条。

| 类型 | 含义 | 视觉 | 典型边 |
|---|---|---|---|
| `flow` | 主链物质/信息流 | 青绿实线 | 切 → 接 → 组装 → 导入 → 筛选 → 表达 → 验证 → 应用 |
| `supply` | 元件供给 | 紫实线 | 目的基因 → 切割；载体 → 组装；宿主 → 导入；启动子 → 表达 |
| `select` | 选择压力 | 橙实线 | 标记基因 → 抗生素筛选；lacZ′ → 蓝白斑 |
| `verify` | 验证证据 | 深青虚线 | 电泳 → 杂交；酶切 → 表型；表型 → 应用 |
| `fail` | 失败回流 | 橙虚线 | 验证不成立 → 重切 / 重连 / 重导 |
| `govern` | 治理约束 | 灰点线 | 安全 → 物理导入 / 农业应用；法规 → 应用 |

主链 8 条边固定；供给边 10 条左右；选择边 6 条；验证边 8 条；回流 3 条；治理 4 条。合计约 39 条，单屏可读。

**反馈闭环**（这是“大逻辑”而不是目录的关键）：

1. `verify-phenotype → op-digest`：表型不对，回到切/接。
2. `select-antibiotic → op-assemble`：筛不出转化子，回到组装/导入。
3. `verify-sequence → op-mutate`：序列不对，进入改造。

---

## 5. 章节怎么挂上去

章节文件只保留：`id / no / title / source / intro blocks / stopIds / exam blocks`。

| 章节 | tour id | 停靠节点（顺序） | 状态 |
|---|---|---|---|
| 第一章 绪论 | `ch01` | origin-foundations → origin-timeline → concept-workflow → part-target → part-vector → part-host → op-digest → op-ligate → deliver-transform → select-antibiotic → vector-expression → verify-phenotype → apply-medicine → govern-safety | 全部有正文 |
| 第二章 工具酶 | `ch02` | tool-enzyme → op-digest → op-ligate → op-mutate | 后三站标注“课件未取到” |
| 第三章 载体 | `ch03` | part-vector → part-plasmid → part-marker → select-antibiotic → select-auxotroph → select-insertional → select-blue-white → part-pbr322 → part-puc18 → part-phage → part-m13 → part-artificial → vector-expression → express-tag | 全部有正文 |
| 第四章 常用技术 | `ch04` | prep-plasmid → prep-genomic → prep-rna → prep-quantify → verify-electrophoresis → gel-conditions → verify-hybridization → op-pcr → verify-sequence → op-mutate | 后三站标注“未读” |

页面行为：

- 首页 = 总图，默认全部边淡显；顶部一排“路径”标签（非卡片），点选后图上点亮该 tour。
- `/chapter/:id` = 同一张图进入 tour 模式（自动缩放到路径包围盒、非路径节点降透明），下方是停靠站列表与本章考点卡。**不重复渲染正文。**
- `/node/:id` = 节点正文页；顶部面包屑显示“总图 / 路径 / 节点”，底部“上一站 / 下一站”保留 tour 上下文。
- `/node/:id?tour=ch03` 时，图缩略条保留路径高亮；无 tour 则显示全部相邻节点。

---

## 6. 现有 ch03 怎么拆（不丢内容）

72 块、5 图全部落位，按小节拆：

| 原小节 | 块数 | 去向 | 说明 |
|---|---|---|---|
| `what-is-a-vector` | 5 | `part-vector` | 定义、7 特征、分类原样保留 |
| `plasmid-basics` | 9 | `part-plasmid` | 含拷贝数表、不相容、转移、命名 |
| `markers` | 13 | `part-marker` + `select-antibiotic` + `select-auxotroph` + `part-reporter` + `express-tag` | 按机制拆：总论/抗性/营养缺陷+supF+sacB/α-互补+GFP/标签 |
| `pbr322-puc18` | 7 | `part-pbr322` + `part-puc18` | 两张环图各归其节点 |
| `lambda` | 10 | `part-phage` | λ 图随节点 |
| `m13` | 8 | `part-m13` | 原样 |
| `artificial-chromosomes` | 10 | `part-artificial` | 容量图随节点 |
| `expression-shuttle-integration` | 7 | `vector-expression` | 表达/穿梭/整合三合一，不再拆薄 |
| `exam-card` | 3 | ch03 tour 的 `exam` 字段 | 易混、术语、待核对不进入节点，避免与正文重复 |

图表归属：`plasmid-puc18 → part-puc18`、`plasmid-pbr322 → part-pbr322`、`lambda-genome → part-phage`、`vector-capacity → part-artificial`、`plate-blue-white → select-blue-white`。

ch01 / ch04 同一原则迁移：ch01 拆到 origin / concept / part-host / apply / govern；ch04 拆到 prep / verify / gel。迁移完成后，`src/data/chXX/chapter.json` 只保留 tour 元信息，正文段落删除，避免两处维护。

---

## 7. 数据与代码结构

```
src/data/map/
  nodes.ts            // 节点元信息（id/title/zone/stage/evidence/blocks 引用）
  nodes/*.json        // 每个节点正文，唯一内容源
  edges.ts            // 边：id/from/to/kind/label/evidence
  layout.ts           // HOME_CANVAS、分区带、NODE_POS、EDGE_OFFSETS、标签侧
  index.ts            // nodeById / neighbors / toursForNode
src/data/tours/
  ch01.json ch02.json ch03.json ch04.json   // intro + stopIds + exam
src/lib/mapModel.ts   // 路径高亮集、节点气泡、上下站
src/components/map/
  MapCanvas.tsx       // 一张 SVG；tour 模式只改 class
  MapNode.tsx         // 样品点 + 标签 + 引线
  MapEdge.tsx         // 六类边
  MapBubble.tsx       // 悬停“标本标签”，不是卡片
src/pages/
  HomePage.tsx        // 总图
  ChapterPage.tsx     // 总图 + 路径
  NodePage.tsx        // 节点正文
```

回归脚本沿用三段式并改名：

- `tools/validate-map.mjs`：节点 id 唯一；边端点存在；tour 停靠点存在；图谱已注册；每个节点至少 1 块正文；**块指纹查重**（同一段落不得出现在两个节点）。
- `tools/audit-layout.mjs`：新增 `/`、`/chapter/ch03`、`/node/part-vector`、`/node/prep-plasmid` × 1440/390。
- `tools/smoke-layout.mjs`：断言节点数、边数、路径高亮数、无溢出、无控制台错误。

---

## 8. 视觉：第一眼必须是一张图

保留现有记录纸、青绿/橙、直角、等宽编号，只改“构图语法”：

- **一条贯穿主链**：从切割到应用画一条连续的青绿 protocol line，节点像加样孔一样挂在线上；不是 45 张卡片。
- **九条泳道**：主链九个站各占一条竖向浅色带，顶部大号等宽编号 01–09，像凝胶泳道，而不是栅格卡片。
- **节点是样品点**：直径 16 px 的圆环 + 实心点，标签用 10.5 px 等宽字，必要时引线错位；没有边框卡片。
- **路径高亮**：选中 ch03 时，路径边变橙 2 px，非路径降到 12% 透明度；节点按“已走过/下一站”两态。
- **唯一的浮层**：悬停节点出现“标本标签”气泡（标题 + 2 行 + 进入节点），与现有标本卡同语言，不新增卡片墙。
- **底图水印**：右侧一枚极淡的质粒环，底部一条凝胶刻度尺，提示“实验记录本”而不是“课程目录”。
- **移动端**：画布 1240 宽，容器内横向拖动；底部固定“当前路径 / 站点进度”，不做缩小成蜘蛛网。

与生化的差异仍在：生化是细胞内代谢域地图（上胞质/下基质），这里是**实验台上的操作链**（元件架 → 泳道 → 产物），构图与意象都不同，但共用“数据 + 布局 + 泡泡”的实现逻辑。

---

## 9. 缺口与待核对（不会补写）

| 节点 | 现状 | 需要什么 |
|---|---|---|
| `op-digest` / `op-ligate` | ch02 仅章名与 15 份资料清单，PPT 转码失败 9005 | 可读 PPT/PDF 或酶说明书正文 |
| `op-pcr` | ch04 第四节 pp.69 起未读 | 该 PDF 的可读副本 |
| `verify-sequence` | ch04 第五节未读 | 同上 |
| `op-mutate` | ch04 第六节未读 | 同上 |
| `part-pbr322` | pSC102 卡那霉素/链霉素表述冲突 | 教材或原始论文核对 |
| `apply-medicine` | 镰状细胞 GAA→GUA 与图示 GAG→GTG 冲突 | 教材核对 |

这些节点在图上用**空心点 + “待核对”角标**呈现，点进去只有已知事实和缺口说明。

---

## 10. 实施顺序（评审通过后）

1. 建 `data/map` 的节点/边/布局/tour 骨架，先迁移 ch03（内容最完整，能最快验证拆法）。
2. 做 `MapCanvas` + `NodePage` + tour 模式，首页换成总图。
3. 迁移 ch01、ch04；删除章节正文，只留 tour。
4. 更新 validate/audit/smoke，跑三档回归与桌面/移动截图。
5. 最后处理 ch02 与三个缺口节点的“待核对”呈现。

**需要你拍板的三件事：**

1. 主链九站是否按“元件→切→接→组装→导入→筛选→表达→验证→应用”定稿，还是把“样品制备”提到主链（变成十站）？
2. 节点粒度是否接受 45 个（其中 4 个缺口点），还是要压到 30 个左右、把 pBR322/pUC18 并回“质粒载体”？
3. 首页路径入口用“顶部路径标签 + 图上高亮”，还是保留一条很窄的章节条（不做卡片）？
