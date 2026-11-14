# 字体许可与署名（NOTICE）

本文件适用于同目录的四个页面，四者同属《格致》第一期（共四版，壹·肆同纸双面、貳·叁同纸双面）：

| 文件 | 版次 | 说明 |
| --- | --- | --- |
| `variant-vertical.html` | 第壹版　要聞 | 竖排头版，第六稿 |
| `page-02.html` | 第貳版　學術 | 学报式学术版（一主四辅：動態、提要、評介、來函），同目录独立文件 |
| `page-03.html` | 第叁版　科學史 | 科学史版（一主两辅＋大事年表），同目录独立文件 |
| `page-04.html` | 第肆版　副刊 | 副刊（诗文·手记·来函·编者按·广告），同目录独立文件 |

四页**互不引用任何外部字体文件**，也互不共用字体文件：各自按本页实际用字子集化，
转成 WOFF2 后以 `data:` URI 内嵌进各自的 HTML。子集**只做裁剪与改名，未修改任何字形轮廓**。

---

## 一、本页使用的字体

### 1. 文津宋体（正文、栏目、广告、图表）

| 项目 | 内容 |
| --- | --- |
| 字体名 | WenJin Mincho Plane 0（文津宋体 平面 0） |
| 版本 | Version 2.100（`addfeatures 5.0.1`） |
| 作者／版权人 | Copyright (c) 2024-2026, Takushun Wu |
| 上游仓库 | https://github.com/takushun-wu/WenJinMincho |
| 许可 | SIL Open Font License 1.1（原文见本文件第四节） |
| 上游许可文件 | https://github.com/takushun-wu/WenJinMincho/blob/main/LICENSE.md |
| 本页内嵌后的族名 | `GeZhiSong`（子集版，非原版） |

上游版权声明（逐字引自其 `LICENSE.md` 与字体 name 表 ID 0）：

> Copyright (c) 2024-2026, Takushun Wu (https://github.com/takushun-wu/),
> with Reserved Font Name 'WenJin Mincho', '文津宋体', '文津宋體', '文津明朝', '문진(文津) 명조'.
>
> Copyright 2010-2025 Adobe (http://www.adobe.com/), with Reserved Font
> Name 'Source'. All Rights Reserved. Source is a trademark of Adobe in the United States
> and/or other countries.
>
> Copyright 2021-2025 Tamcy (https://github.com/chiron-fonts/chiron-sung-hk).
>
> Copyright 2022-2025 Shanggu Fonts (https://github.com/GuiWonder/Shanggu).
>
> © 2007–2024 Adobe, But Ko, CMEX, Creative Commons Corporation, GlyphWiki & Night Koo.
>
> Copyright 2022 The Noto Project Authors (https://github.com/notofonts/). Noto is a trademark of Google Inc.
>
> Copyright © 2015 Google Inc.
>
> Saudi Riyal Font © Emran Alhaddad - Used under SIL Open Font License 1.1
>
> This Font Software is licensed under the SIL Open Font License, Version 1.1.

**保留字体名与本文的处理。** 上述名称属 OFL 的 Reserved Font Name。本页内嵌的是
子集（OFL 定义下的 Modified Version），依 OFL 第 3 条不得沿用保留名，故已将子集的
字体名表（name ID 1 / 3 / 4 / 6 / 16 / 17）统一改为 `GeZhiSong` / `GeZhiSong Regular`。
字形、字宽、笔形一律未动。

---

### 2. 霞鹜文楷（主标题、副题、眉批、图版说明）

| 项目 | 内容 |
| --- | --- |
| 字体名 | LXGW WenKai（霞鹜文楷） |
| 版本 | Version 1.530; October 18, 2026 |
| 作者／版权人 | Copyright 2021-2026 LXGW；另含 Klee Project Authors |
| 上游仓库 | https://github.com/lxgw/LxgwWenKai |
| 许可 | SIL Open Font License 1.1（原文见本文件第四节） |
| 上游许可文件 | https://github.com/lxgw/LxgwWenKai/blob/main/OFL.txt |
| 本页内嵌后的族名 | `GeZhiKai`（子集版，非原版） |

上游版权声明（逐字引自其 `OFL.txt` 与字体 name 表 ID 0）：

> Copyright 2021-2026 LXGW (https://github.com/lxgw/LxgwWenKai), with Reserved Font Name
> '霞鹜', '霞鶩', '落霞孤鹜', '落霞孤鶩' and 'LXGW'.
> [ADDITIONAL PERMISSION] The Reserved Font Names '霞鹜', '霞鶩', '落霞孤鹜', '落霞孤鶩'
> and 'LXGW' may continue to be used in Modified Versions recompiled from the Original
> Version, without modifications to the font source code; or in Modified Versions subsetted
> or converted to other formats (e.g., WOFF/WOFF2) solely for web font delivery, provided
> such Modified Versions are not made available as installable desktop fonts (e.g., on
> mainstream platforms like Google Fonts, or third-party non-commercial platforms recognized
> by the author @lxgw; other web font platforms please contact the author @lxgw for confirmation).
>
> Copyright 2020 The Klee Project Authors (https://github.com/fontworks-fonts/Klee)

**关于附加许可。** 上游已额外允许"仅为网页字体投递而做的子集／WOFF 转换版本"沿用
保留名。本页仍然改名为 `GeZhiKai`：一是与正文子集的处理保持一致，二是确保本子集
不会被误当作原版再分发。该改名不改变 OFL 下的任何权利与义务。

---

## 二、子集化处理说明

四页各自成组，数字如下（字符集＝本页 `<body>` 全部可见文字 + `<title>` + 常用标点与 ASCII，去重后计）：

| 页面 | 字符集 | 其中汉字／汉标点 | `GeZhiSong`（WOFF2） | `GeZhiKai`（WOFF2） | 整页大小 |
| --- | --- | --- | --- | --- | --- |
| `variant-vertical.html` | 936 个字符 | 806 | 2 936 字形 / 349 924 字节 | 1 151 字形 / 210 456 字节 | 778 652 字节 |
| `page-02.html` | 822 个字符 | 714 | 2 740 字形 / 332 464 字节 | 1 036 字形 / 193 452 字节 | 728 308 字节 |
| `page-03.html` | 806 个字符 | 698 | 2 651 字形 / 306 832 字节 | 1 020 字形 / 184 908 字节 | 679 436 字节 |
| `page-04.html` | 861 个字符 | 753 | 2 913 字形 / 358 088 字节 | 1 075 字形 / 203 876 字节 | 770 500 字节 |

- 工具：`fontTools.subset`（保留全部 layout features、全部 name 记录、`notdef` 轮廓）。
- 「汉字／汉标点」按码位 U+2E7F 以上计；其中严格汉字 806（第壹版）／691（第貳版）／
  675（第叁版）／730（第肆版），余各 23 个为汉标点（、。《》「」等）。
- 字形数均含 notdef 与推荐字形，经 Brotli 压缩为 WOFF2 后 base64 内嵌。
- **未修改字形**：未执行任何轮廓编辑、变形、合并或 hinting 改动；仅删除字符集外的字形、
  改名、改变封装格式。按 OFL，这属于 Modified Version，仍完整适用 OFL 1.1。
- 四款子集字体均**不作为可安装的桌面字体分发**，只随各自页面一同提供；四页字符集不同，
  因而子集大小也不同，互不通用属正常。

## 三、考虑过但未采用的字体

| 字体 | 结论 | 原因 |
| --- | --- | --- |
| 京華老宋体（KingHwa OldSong，`frostming/jinghua-webfont`） | 不采用 | 仓库元数据 `license` 为空，仓库内无 LICENSE 文件，README 为 npm 包模板，找不到可公开引用的授权原文；"免费商用、可嵌入"仅见于转述，条款边界（能否子集、能否改名、能否随页面再分发）无法核实。公开发布不宜以此为依据。 |
| 霞鹜新致宋（`lxgw/LxgwNeoZhiSong`） | 不采用 | 仓库元数据为 `NOASSERTION`，其 `LICENSE.md` 实为 IPA Font License 1.0（条款完备，本可附全文）。但本页正文已由文津宋体承担，无需第二款宋体；且 IPA 与 OFL 两套条款并存会增加再分发时的说明成本，故统一为 OFL 字族。 |
| 汇文明朝体 | 不采用 | 授权条款表述不明，无可整份附上的许可原文。 |
| Windows 自带宋体／黑体／楷体／隶书／新魏等 | 不采用 | 商业系统字体，许可不允许随网页嵌入再分发。 |

## 四、SIL Open Font License 1.1 全文

以下为 SIL Open Font License Version 1.1 原文（2007 年 2 月 26 日），
同时适用于本页的两款子集字体（`GeZhiSong`、`GeZhiKai`）。
官方地址：https://openfontlicense.org

```
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded,
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.
```

## 五、页面内可见署名

四页底部各有同一行可见小字（`.colophon`），文字与链接顺序略有不同：

> 排字　文津宋體（SIL OFL 1.1）· 霞鶩文楷（SIL OFL 1.1）　　兩款字體均按本頁字符集裁剪、未改字形，子集更名為 GeZhiSong 與 GeZhiKai；許可原文、版權行與署名見同目錄 NOTICE.md

四页 HTML 顶部另有等价注释，便于直接查看源码者核对。
