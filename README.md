# GENE/LAB · 基因工程课程笔记

把《基因工程（B）》的课件整理成可检索、可对照的网页笔记。当前只上线**第三章**，其余章节按真实状态登记，不提供空入口。

- 课程：基因工程（B）· 中南民族大学 · 张莉
- 底稿：`notes/ch01`–`ch04`（`ch04` 覆盖 PDF pp.1–68/178）
- 技术栈：Vite 6.4.5 + React 18.3.1 + TypeScript 5.9.3 + React Router 7.18.5

## 跑起来

```powershell
cd d:\基因工程

npm run dev                        # 开发预览 http://localhost:5173
npm run build                      # tsc --noEmit + vite build
npm run preview -- --port 4310     # 预览构建产物 http://localhost:4310

npm run validate                   # 章节 JSON 结构校验 + 负向自测
npm run audit                      # 用本机 Edge 跑版面审计（需先启动 preview）
npm run smoke                      # 读取审计报告做断言
```

说明：

- **不需要 `npm install`**：`node_modules` 已从 `d:\生化大项目` 复用。
- 若以后删除了 `node_modules`，`npm ci` 会按 `package-lock.json` 重新安装（需要网络）。
- 本机 Vite 预览默认绑定 `localhost`（IPv6）。如果 `127.0.0.1` 连不上，请用 `http://localhost:4310`。
- 审计默认端口 4310，避开 4173 上可能残留的其他项目预览进程。

## 部署

纯静态站点，没有服务端进程；把 `dist/` 整目录交给任意静态托管或 CDN 即可。

```powershell
Remove-Item dist -Recurse -Force -ErrorAction SilentlyContinue   # 先清空，避免旧哈希残留
npm run build                                                    # tsc --noEmit + vite build
npm run preview -- --port 4310                                   # 上线前本机核对
```

产物是 `dist/index.html` 加 `dist/assets/`，约 235 个文件、8.9 MB。资源用站点根绝对路径（`/assets/...`），**默认部署在域名根**；若要挂在子目录，先在 `vite.config.ts` 设 `base: "/子路径/"` 再重新构建。

### 单页应用的回退规则

路由用 `createBrowserRouter`，只认这几类路径：

| 路径 | 处理 |
|---|---|
| `/` | 首页 |
| `/station/<站 id>` | 六个站：`qie` `jie` `zhuan` `zeng` `jian` `yang`（切、接、转、增、检、养） |
| `/station/<旧步骤 id>` | 旧八步地址：`target` `cut` → `qie`；`ligate` → `jie`；`deliver` → `zhuan`；`select` `apply` → `zeng`；`verify` → `jian`；`express` → `yang`，前端替换地址并保留锚点 |
| `/station/<站 id>/k` | 本站知识目录（父模块 → 子节点按层级展开） |
| `/station/<站 id>/k/<模块 id>` | 单模块正文，纵排、从顶部开始 |
| `/flow` | 前端跳转到 `/` |
| `/assets/**` | 静态资源，直接由托管层返回 |

因此托管层要分开处理，不能一律回退：

- 命中上表（含 `/station/*`）→ 回退 `index.html`，状态码 **200**；
- 其余路径 → 必须返回 **404 状态码**，不能拿 `index.html` 顶成 200。

后一条是硬要求。`*` 路由渲染的是站内 404 页，如果托管层用「所有未知路径 → index.html + 200」兜底，那么拼错的地址、外部死链、已删除的旧路径都会以 200 返回一个看似正常的页面：搜索引擎会收录，监控里也永远看不到坏链。页面可以是站内 404 页的壳（SPA 需要它才能渲染），**状态码必须是 404**。

nginx 参考（`error_page` 内部跳转保留原状态码，所以下列写法返回的是 404 而不是 200）：

```nginx
server {
    root /var/www/gene-lab/dist;
    index index.html;

    # 未知路径也渲染前端 404 页，但状态码保持 404
    error_page 404 /index.html;

    # 已知路由：200 返回应用壳
    location ^~ /station/ { try_files /index.html =404; }
    location = /flow        { try_files /index.html =404; }

    # 其它路径：确实不存在就 404，不回退成 200
    location / { try_files $uri $uri/ =404; }

    # 资源文件名带哈希，可长缓存
    location ^~ /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
}
```

Vercel / Netlify / Cloudflare Pages 同理：只对 `/station/*` 与 `/flow` 做 rewrite 到 `/index.html`，其余保留平台默认 404，不要开「全局 SPA fallback」。

### 资源目录

| 目录 | 内容 | 说明 |
|---|---|---|
| `public/assets/figures/` | 13 组配图，每组 `.webp` + `.jpg` | 页面只引用 `.webp`；`.jpg` 是同图备份 |
| `public/assets/fonts/` | 自托管 woff2（Noto Sans SC 分片 + 刻纸宋/楷）与许可文件 | 不走 CDN；`NOTICE-gezhi.md` 与 OFL 文本随字体发布，不要删 |

`public/` 在构建时原样复制到 `dist/`，所以 `dist/assets/figures/` 与 `dist/assets/fonts/` 是上面两个目录的镜像。托管层需保证 `.woff2` 与 `.webp` 的 MIME 正确（现代 nginx 默认 `mime.types` 已包含 `font/woff2`、`image/webp`）。

### 上线前

```powershell
npm run validate   # 骨架 / 知识块 / 图片接线 / 演示注册
npm run links      # 索引与锚点
npm run audit      # 需先开 preview；桌面 1440 与移动 390 版面审计
npm run smoke      # 读审计报告做断言
```

四门加 `npm run build` 全绿再上传。`dist/` 不要手工改，下次构建会覆盖。

## 目录

```
src/
  data/
    types.ts              章节 / 小节 / 内容块类型
    chapters.ts           全站章节索引、状态与统计
    figures.ts            图谱几何与数值
    ch03/chapter.json     第三章正文（9 节）
  components/
    BlockRenderer.tsx     内容块 → 版面
    Inline.tsx            **加粗** / `等宽` 行内标记
    ChapterRail.tsx       章节侧栏
    SiteHeader.tsx
    figures/Figure.tsx    质粒环图、λ 基因组、容量图、蓝白斑平板
  pages/
    HomePage.tsx          封面 + 章节目录
    ChapterPage.tsx       章节阅读页
    NotFoundPage.tsx
  styles/
    fonts.css             从参考项目提取的 Noto Sans SC 声明
    site.css              GENE/LAB 视觉系统
tools/
  validate-chapters.mjs   数据校验（含负向自测）
  audit-layout.mjs        Edge 版面审计 + 截图
  smoke-layout.mjs        审计报告断言
```

## 第一阶段结论

### 1. 复用了什么

| 层次 | 参考实现 `d:\生化大项目` | 本项目做法 |
|---|---|---|
| 构建栈 | Vite + React + TS + `@vitejs/plugin-react` | 原版本复用，不另起框架 |
| 路由 | `react-router-dom` | `createBrowserRouter`，首页 + 章节页 |
| 数据层 | JSON 正文 + `types.ts` + 索引导出 | 同一模式；正文只写 JSON |
| 渲染层 | 页面 / 组件 / 数据驱动 | 内容块渲染器 + 图谱注册表 |
| 回归脚本 | `tools/validate-*.mjs` / `audit-layout.mjs` / `smoke-*.mjs` | 迁移为三个对应脚本，保留负向自测与报告-断言两段式 |
| 字体 | 本地自托管 Noto Sans SC | 复制 woff2 + 提取 `@font-face`，附 OFL |
| 3D | `3dmol` | 依赖已就地复用，本期未引用 |

**依赖台账**

| 项目 | 结果 |
|---|---|
| 本机环境 | Node 24.11.1、npm 11.6.2；无 pnpm / yarn |
| 参考项目已装 | React 18.3.1、React DOM 18.3.1、Router 7.18.5、Vite 6.4.5、TypeScript 5.9.3、plugin-react 4.7.0、playwright-core 1.64.1、3dmol 2.5.5、@types/react 18.3.31、@types/react-dom 18.3.7 |
| 直接复用 | `node_modules` 整树复制（排除 `.vite` / `.vite-temp` 缓存），110.2 MB |
| 字体复用 | Noto Sans SC 400/700 共 202 个 woff2，4.6 MB；`OFL.txt` 一并保留 |
| 新装依赖 | **无**。没有下载任何 npm 包、字体或图片 |
| 锁文件 | `package-lock.json` 为本次生成；只解析 registry 元数据，未安装包 |

`3dmol` 保留在依赖中，供后续结构页直接 `import`；当前没有任何页面引用它，所以构建产物不含 3D 代码，也不占首屏体积。

### 2. 和生化的视觉差异

| 维度 | 生化项目 | GENE/LAB |
|---|---|---|
| 底色 | 暖米色挂图纸 | 冷白 + 26px 青绿方格记录纸 |
| 标题字体 | 衬线（Noto Serif SC） | 无衬线粗体（Noto Sans SC）+ 等宽编号 |
| 主色 | 赭石 / 暗红 | SYBR 青绿 `#1f8a70` + 乙锭橙 `#e2662f` |
| 图像语言 | 3D 分子、通路挂图 | 质粒环图、λ 基因组、容量对数图、蓝白斑平板、凝胶条 |
| 容器 | 圆角卡片 | 直角 + 条码 + 标本卡 + 橡皮章 |
| 导航 | 顶部导航 | 侧栏 protocol rail + 顶部阅读进度条 |

具体落点：首页右侧「SPECIMEN 003」暗色标本卡与凝胶条；章节页左侧 01–09 小节轨道；图谱统一用 `FIG. xxx` 等宽编号；提示卡分 MEMO / 注意 / 待核对 / 考点四色。

### 3. 内容与数据

第三章《基因工程操作中的载体》共 **9 节**、**5 张图谱**、**10 组易混对照**、**12 个术语**：

1. 载体是什么（七项特征、克隆/表达载体）
2. 质粒的基本特性（构型、拷贝数、不相容性、转移性）
3. 标记基因与筛选（抗性、营养缺陷、supF、sacB、α-互补、GFP、标签）
4. pBR322 与 pUC18（图谱、插入失活、改造型）
5. λ 噬菌体载体（插入型/置换型、Spi⁻、Gateway）
6. M13 与噬菌粒（RF、mp18/19、M13KO7）
7. 人工染色体（黏粒、BAC、YAC、PAC）
8. 表达、穿梭与整合载体
9. 考点卡

未上线章节在首页登记真实状态：`ch01` 底稿已整理待上线，`ch02` 课件转码失败待补，`ch04` 仅覆盖 pp.1–68/178。

课件自相矛盾的容量数字（BAC / YAC / PAC）没有自行统一，正文单列「容量口径」提示；质粒环图的位置为示意，图注明确写出「不是测序坐标」。

### 4. 回归方式

- `validate-chapters.mjs`：扫描各章 JSON，检查 id、表格列数、空段落、未知图谱等；对 ch03 断言 9 节 / 5 图 / 10 组易混及关键数值；内置 4 个负向自测，防止校验器永远通过。
- `audit-layout.mjs`：用本机 Edge 打开首页与章节页，桌面 1440 / 移动 390 各一次，检查控制台错误、页面错误、横向溢出，输出 `preview/layout-audit.json` 与 `.screenshots/` 截图。
- `smoke-layout.mjs`：只读审计报告，断言 4 条结果均无错误/溢出，章节页 9 节、5 图、9 个侧栏锚点均按数据渲染。

移动端宽图谱放在可横向滚动的容器里，并显示「左右滑动查看完整图谱」提示；版面审计会豁免这类刻意设置的内部滚动容器，但页面级横向滚动仍视为失败。

### 5. 已知限制与下一步

- `ch02` 缺少可读课件，暂不补写；`ch04` 只覆盖前 68 页，剩余页未整理。
- 质粒环图的弧段与位点为教学示意，不能当作真实测序坐标。
- 3D 能力（3dmol 2.5.5）已就位但未启用，等有可靠结构素材再接入，避免为演示硬塞功能。
- 下一步顺序：接入 `ch01` 正文 → 续读 `ch04` pp.69–178 → 若 `ch02` 有可用 PDF/PPT 再补。

## 内容来源声明

内容依据课程 PDF 逐页阅读整理，非原文复制；页码指预览器 PDF 页码。图谱为教学示意，不替代测序或实验数据。

## 许可

本仓库一个库里放两套许可，按**文件类型**划线，不是按目录整体授权：

| 文件 | 许可 | 覆盖范围 |
|---|---|---|
| [`LICENSE`](LICENSE) | **MIT** | 程序代码：`src/`（`src/data/` 除外）、`tools/`、`vite.config.ts`、`tsconfig.json`、`index.html`、`package.json` 及构建配置 |
| [`LICENSE-CONTENT`](LICENSE-CONTENT) | **CC BY-NC-SA 4.0** | 文字与图像内容：`notes/`、`docs/`、`src/data/` 下的正文数据（章节、知识条目、术语、图谱文案），以及 `public/assets/figures/` 下的自绘配图 |
| [`public/assets/fonts/NOTICE-gezhi.md`](public/assets/fonts/NOTICE-gezhi.md) | **SIL OFL 1.1** | 第三方字体（Noto Sans SC、文津宋体子集 `GeZhiSong`、霞鹜文楷子集 `GeZhiKai`），不适用上面两套许可；版权行与许可原文随字体同目录发布 |

内容许可的要点：**署名**（注明来源）、**非商业性使用**（不得用于商业目的）、**相同方式共享**（改编后须以同一许可发布）。教学、研究、个人学习可直接使用；商业用途需另行取得授权。

### 图与素材

- `public/assets/figures/` 下的配图均为**自绘示意图**，可随本仓库一同再分发；它们是对教学内容的图解，不是测序坐标或实验原始数据。
- 仓库内**不含**第三方非商用授权（NC）位图，也不含课件原件（PDF / PPT / DOCX 等）——课件原件不入库，仅在本机保留，`.gitignore` 已排除。
- 字体按上游 OFL 1.1 子集化处理：只裁字符集、改子集名、转 WOFF2，未改动字形轮廓；许可原文与署名见 `public/assets/fonts/`。
