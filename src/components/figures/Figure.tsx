import type { ReactNode } from "react";
import {
  GEL_MIGRATION,
  LAMBDA_GENOME,
  PLASMID_PBR322,
  PLASMID_PET28A,
  PLASMID_PUC18,
  PLASMID_PX459,
  PLATE_BLUE_WHITE,
  VECTOR_CAPACITY,
  type PlasmidFigure,
} from "../../data/figures";
import type { FigureId } from "../../data/types";

/** 所有图谱共用的外框：图号、图注、示意说明都由这里统一呈现 */
function FigureFrame({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <div className="fig-frame" data-figure={id}>
      <div className="fig-head">
        <span className="fig-id">FIG. {id}</span>
        <span className="fig-title">{title}</span>
      </div>
      <div className="fig-canvas">{children}</div>
      <span className="fig-scroll-hint" aria-hidden="true">
        ← 左右滑动看图 →
      </span>
      {note ? <p className="fig-note">{note}</p> : null}
    </div>
  );
}

function polar(cx: number, cy: number, r: number, bp: number, size: number) {
  const angle = (bp / size) * Math.PI * 2 - Math.PI / 2;
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), angle };
}

function arcPath(cx: number, cy: number, r: number, startBp: number, endBp: number, size: number) {
  const start = polar(cx, cy, r, startBp, size);
  const end = polar(cx, cy, r, endBp, size);
  const largeArc = ((endBp - startBp + size) % size) > size / 2 ? 1 : 0;
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

function PlasmidMap({ data }: { data: PlasmidFigure }) {
  const cx = 330;
  const cy = 208;
  const r = 132;
  return (
    <FigureFrame id={data.name.toLowerCase()} title={`${data.name} 环状图谱`} note={data.siteNote}>
      <svg viewBox="0 0 760 430" role="img" aria-label={`${data.name} 质粒示意图`}>
        <circle className="ring-base" cx={cx} cy={cy} r={r} />
        <circle className="ring-track" cx={cx} cy={cy} r={r} />
        {data.features.map((feature) => {
          const midBp = (feature.start + feature.end) / 2;
          const mid = polar(cx, cy, r, midBp, data.sizeBp);
          const label = polar(cx, cy, r + 40, midBp, data.sizeBp);
          const leader = polar(cx, cy, r + 14, midBp, data.sizeBp);
          const anchor = Math.cos(mid.angle) > 0.2 ? "start" : Math.cos(mid.angle) < -0.2 ? "end" : "middle";
          return (
            <g key={feature.label} className={`tone-${feature.tone}`}>
              <path
                className="ring-feature"
                d={arcPath(cx, cy, r, feature.start, feature.end, data.sizeBp)}
              />
              <line className="ring-leader" x1={mid.x} y1={mid.y} x2={leader.x} y2={leader.y} />
              <text className="ring-label" x={label.x} y={label.y} textAnchor={anchor}>
                {feature.label}
              </text>
            </g>
          );
        })}
        <text className="ring-name" x={cx} y={cy - 8} textAnchor="middle">
          {data.name}
        </text>
        <text className="ring-size" x={cx} y={cy + 18} textAnchor="middle">
          {data.sizeLabel}
        </text>
        <text className="ring-shape" x={cx} y={cy + 40} textAnchor="middle">
          {data.shape}
        </text>
      </svg>
      <div className="mcs-strip">
        <span className="mcs-label">位点顺序</span>
        {data.sites.map((site) => (
          <span className="mcs-site" key={site}>
            {site}
          </span>
        ))}
      </div>
    </FigureFrame>
  );
}

function LambdaMap() {
  const left = 104;
  const width = 590;
  const scale = width / LAMBDA_GENOME.totalKb;
  return (
    <FigureFrame id="lambda" title="λ 基因组与两类载体" note={LAMBDA_GENOME.foot}>
      <svg viewBox="0 0 760 360" role="img" aria-label="λ 噬菌体基因组示意图">
        <line className="axis" x1={left} y1={318} x2={left + width} y2={318} />
        {[0, 10, 20, 30, 40, 48.5].map((tick) => (
          <g key={tick}>
            <line className="axis-tick" x1={left + tick * scale} y1={318} x2={left + tick * scale} y2={325} />
            <text className="axis-text" x={left + tick * scale} y={340} textAnchor="middle">
              {tick}
            </text>
          </g>
        ))}
        <text className="axis-unit" x={left + width + 10} y={356} textAnchor="start">
          kb
        </text>
        {LAMBDA_GENOME.rows.map((row, rowIndex) => {
          const y = 42 + rowIndex * 88;
          let cursor = left;
          return (
            <g key={row.label}>
              <text className="lambda-row-label" x={left - 12} y={y + 17} textAnchor="end">
                {row.label}
              </text>
              <line className="cos-cap" x1={left - 4} y1={y - 4} x2={left - 4} y2={y + 32} />
              <text className="cos-text" x={left - 4} y={y - 10} textAnchor="middle">
                cos
              </text>
              {row.segments.map((segment) => {
                const segWidth = segment.kb * scale;
                const x = cursor;
                cursor += segWidth;
                const dashed = segment.tone === "dashed";
                return (
                  <g key={segment.label}>
                    <rect
                      className={dashed ? "lambda-seg lambda-seg-dashed" : `lambda-seg tone-${segment.tone}`}
                      x={x}
                      y={y}
                      width={segWidth}
                      height={30}
                    />
                    {segWidth >= 96 ? (
                      <text
                        className={dashed ? "lambda-seg-label is-dashed" : "lambda-seg-label"}
                        x={x + segWidth / 2}
                        y={y + 19}
                        textAnchor="middle"
                      >
                        {segment.label}
                      </text>
                    ) : (
                      <text className="lambda-seg-label small" x={x + segWidth / 2} y={y + 44} textAnchor="middle">
                        {segment.label}
                      </text>
                    )}
                  </g>
                );
              })}
              <line className="cos-cap" x1={cursor + 4} y1={y - 4} x2={cursor + 4} y2={y + 32} />
              <text className="cos-text" x={cursor + 4} y={y - 10} textAnchor="middle">
                cos
              </text>
              <text className="lambda-row-note" x={left} y={y + 60}>
                {row.note}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="fig-legend">
        <span className="legend-item tone-teal">左臂</span>
        <span className="legend-item tone-slate">中区 / 非必需</span>
        <span className="legend-item tone-orange">右臂</span>
        <span className="legend-item tone-dashed">插入或替换片段</span>
      </div>
    </FigureFrame>
  );
}

function CapacityChart() {
  const left = 128;
  const width = 566;
  const minLog = Math.log10(0.1);
  const maxLog = Math.log10(1000) - minLog;
  const x = (value: number) => left + ((Math.log10(Math.max(value, 0.1)) - minLog) / maxLog) * width;
  return (
    <FigureFrame id="capacity" title="载体容量区间（kb · 对数刻度）" note={VECTOR_CAPACITY.foot}>
      <svg viewBox="0 0 760 400" role="img" aria-label="载体容量对比图">
        {[0.1, 1, 10, 100, 1000].map((tick) => (
          <g key={tick}>
            <line className="grid-line" x1={x(tick)} y1={34} x2={x(tick)} y2={330} />
            <text className="axis-text" x={x(tick)} y={350} textAnchor="middle">
              {tick}
            </text>
          </g>
        ))}
        {VECTOR_CAPACITY.rows.map((row, index) => {
          const y = 54 + index * 44;
          const x1 = x(row.range[0]);
          const x2 = x(row.range[1]);
          return (
            <g key={row.label}>
              <text className="cap-label" x={left - 12} y={y + 14} textAnchor="end">
                {row.label}
              </text>
              <text className="cap-host" x={left - 12} y={y + 28} textAnchor="end">
                {row.host}
              </text>
              <line className="cap-baseline" x1={left} y1={y + 11} x2={left + width} y2={y + 11} />
              <rect className={`cap-bar tone-${row.tone}`} x={x1} y={y} width={Math.max(x2 - x1, 4)} height={22} rx={2} />
              <text className="cap-range" x={Math.min(x2 + 8, 740)} y={y + 15} textAnchor={x2 > 660 ? "end" : "start"}>
                {row.range[0]}–{row.range[1]}
              </text>
            </g>
          );
        })}
      </svg>
    </FigureFrame>
  );
}

function colonyPosition(index: number, radius: number) {
  const angle = (index * 137.508 * Math.PI) / 180;
  const distance = 22 + ((index * 29) % (radius - 40));
  return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
}

function Plate({ plate, cx }: { plate: typeof PLATE_BLUE_WHITE.left; cx: number }) {
  const radius = 104;
  return (
    <g>
      <circle className="plate-rim" cx={cx} cy={168} r={radius + 8} />
      <circle className="plate-agar" cx={cx} cy={168} r={radius} />
      {Array.from({ length: plate.colonies }, (_, index) => {
        const point = colonyPosition(index, radius);
        return (
          <circle
            key={index}
            className={plate.blue ? "colony colony-blue" : "colony colony-white"}
            cx={cx + point.x}
            cy={168 + point.y}
            r={5.4}
          />
        );
      })}
      <text className="plate-title" x={cx} y={22} textAnchor="middle">
        {plate.title}
      </text>
      <text className="plate-genotype" x={cx} y={300} textAnchor="middle">
        {plate.genotype}
      </text>
      <text className={plate.blue ? "plate-result blue" : "plate-result white"} x={cx} y={322} textAnchor="middle">
        {plate.result}
      </text>
    </g>
  );
}

function BlueWhitePlate() {
  return (
    <FigureFrame
      id="plate"
      title="蓝白斑筛选"
      note="同一宿主、同一抗生素压力，颜色差异只来自 lacZ′ 是否被外源片段打断；菌落位置为示意。"
    >
      <svg viewBox="0 0 760 380" role="img" aria-label="蓝白斑筛选示意">
        <text className="plate-conditions" x={380} y={18} textAnchor="middle">
          Amp + IPTG + X-gal
        </text>
        <Plate plate={PLATE_BLUE_WHITE.left} cx={210} />
        <Plate plate={PLATE_BLUE_WHITE.right} cx={550} />
        <line className="plate-divider" x1={380} y1={70} x2={380} y2={300} />
      </svg>
      <div className="fig-legend">
        {PLATE_BLUE_WHITE.reagents.map((reagent) => (
          <span className="legend-item" key={reagent}>
            {reagent}
          </span>
        ))}
      </div>
    </FigureFrame>
  );
}

function GelMigration() {
  const gel = { x: 78, y: 44, w: 604, h: 286 };
  const laneWidth = gel.w / GEL_MIGRATION.lanes.length;
  const toneColor: Record<string, string> = {
    teal: "#1f8a70",
    orange: "#e2662f",
    violet: "#6b5aa6",
    slate: "#7c8b93",
    dim: "#c2cfc9",
  };
  return (
    <FigureFrame id="gel" title="琼脂糖凝胶中的迁移顺序" note={GEL_MIGRATION.foot}>
      <svg viewBox="0 0 760 410" role="img" aria-label="DNA 构型在凝胶中的迁移示意">
        <rect x={gel.x} y={gel.y} width={gel.w} height={gel.h} fill="#f5f8f6" stroke="#c9d5cf" />
        <text className="plate-genotype" x={gel.x} y={gel.y - 12} textAnchor="start">
          加样孔在上，DNA 向正极迁移 ↓
        </text>
        {GEL_MIGRATION.lanes.map((lane, laneIndex) => {
          const cx = gel.x + laneWidth * (laneIndex + 0.5);
          return (
            <g key={lane.title}>
              <rect x={cx - 24} y={gel.y + 10} width={48} height={8} fill="#cfdad5" />
              {lane.bands.map((band, bandIndex) => (
                <rect
                  key={bandIndex}
                  x={cx - 27}
                  y={gel.y + (band.top / 100) * gel.h}
                  width={54}
                  height={band.height}
                  rx={2}
                  fill={toneColor[band.tone]}
                />
              ))}
              <text className="plate-title" x={cx} y={gel.y + gel.h + 28} textAnchor="middle">
                {lane.title}
              </text>
              <text className="plate-genotype" x={cx} y={gel.y + gel.h + 46} textAnchor="middle">
                {lane.sub}
              </text>
            </g>
          );
        })}
      </svg>
    </FigureFrame>
  );
}

const INK = "var(--ink)";
const INK3 = "var(--ink-3)";
const HAIR = "var(--hair)";
const CINNABAR = "var(--cinnabar)";
const MONO = '"Consolas", "SFMono-Regular", monospace';

/** 限制酶：回文位点与两条链上的切口位置 */
function RestrictionSite() {
  const step = 26;
  const left = 120;
  const topSeq = ["G", "A", "A", "T", "T", "C"];
  const bottomSeq = ["C", "T", "T", "A", "A", "G"];
  const cutTop = left + step;
  const cutBottom = left + step * 5;
  const rightLeft = 470;
  const cutFlat = rightLeft + step * 3;
  return (
    <FigureFrame
      id="restriction-site"
      title="回文识别与切口位置"
      note="EcoRI 在 G|AATTC 交错切开，留下 4 nt 的 5′ 突出端；SmaI 在 CCC|GGG 同一位置平切。PDB 1ERI 为 EcoRI–DNA 复合物结构（CC0），这里只画识别与切口关系。"
    >
      <svg viewBox="0 0 760 320" role="img" aria-label="限制酶回文位点与切口位置示意">
        <text x="40" y="30" fontSize="13" fill={INK}>A · 交错切：EcoRI</text>
        {topSeq.map((base, index) => (
          <text
            key={`et-${index}`}
            x={left + step * index + step / 2}
            y="110"
            textAnchor="middle"
            fontFamily={MONO}
            fontSize="20"
            fill={INK}
          >
            {base}
          </text>
        ))}
        {bottomSeq.map((base, index) => (
          <text
            key={`eb-${index}`}
            x={left + step * index + step / 2}
            y="156"
            textAnchor="middle"
            fontFamily={MONO}
            fontSize="20"
            fill={INK}
          >
            {base}
          </text>
        ))}
        <text x={left - 10} y="110" textAnchor="end" fontSize="12" fill={INK3}>5′</text>
        <text x={left - 10} y="156" textAnchor="end" fontSize="12" fill={INK3}>3′</text>
        <text x={left + step * 6 + 10} y="110" fontSize="12" fill={INK3}>3′</text>
        <text x={left + step * 6 + 10} y="156" fontSize="12" fill={INK3}>5′</text>
        <line x1={cutTop} y1="88" x2={cutTop} y2="124" stroke={CINNABAR} strokeWidth="1.6" strokeDasharray="4 4" />
        <line x1={cutBottom} y1="142" x2={cutBottom} y2="178" stroke={CINNABAR} strokeWidth="1.6" strokeDasharray="4 4" />
        <text x={(cutTop + cutBottom) / 2} y="196" textAnchor="middle" fontSize="12" fill={CINNABAR}>
          两条链错开 4 nt
        </text>
        <text x={left + step * 3} y="212" textAnchor="middle" fontSize="12" fill={INK3}>
          5′-GAATTC-3′ / 3′-CTTAAG-5′：反向读一样
        </text>

        <line x1="400" y1="40" x2="400" y2="250" stroke={HAIR} strokeWidth="1" />
        <text x="440" y="30" fontSize="13" fill={INK}>B · 平切：SmaI</text>
        {["C", "C", "C", "G", "G", "G"].map((base, index) => (
          <text
            key={`st-${index}`}
            x={rightLeft + step * index + step / 2}
            y="110"
            textAnchor="middle"
            fontFamily={MONO}
            fontSize="20"
            fill={INK}
          >
            {base}
          </text>
        ))}
        {["G", "G", "G", "C", "C", "C"].map((base, index) => (
          <text
            key={`sb-${index}`}
            x={rightLeft + step * index + step / 2}
            y="156"
            textAnchor="middle"
            fontFamily={MONO}
            fontSize="20"
            fill={INK}
          >
            {base}
          </text>
        ))}
        <line x1={cutFlat} y1="84" x2={cutFlat} y2="178" stroke={CINNABAR} strokeWidth="1.6" strokeDasharray="4 4" />
        <text x={cutFlat + 8} y="196" fontSize="12" fill={CINNABAR}>同一位置切 → 平端</text>
        <text x={rightLeft + step * 3} y="212" textAnchor="middle" fontSize="12" fill={INK3}>
          CCC|GGG，两条链不留突出
        </text>
      </svg>
    </FigureFrame>
  );
}

/** 三种末端：5′ 突出、平端、同尾酶 */
function DnaEnds() {
  const block = (x: number, y: number) => (
    <g>
      <rect x={x} y={y} width="168" height="14" fill="none" stroke={INK} strokeWidth="1.2" />
      <rect x={x} y={y + 22} width="168" height="14" fill="none" stroke={INK} strokeWidth="1.2" />
    </g>
  );
  return (
    <FigureFrame
      id="dna-ends"
      title="黏端、平端与同尾酶"
      note="突出端越长、GC 越多，配对越稳；同尾酶识别序列不同但切出的黏端相同，所以产物能互连——这正是单酶切方向不可控与双酶切定向的区别来源。"
    >
      <svg viewBox="0 0 760 340" role="img" aria-label="黏性末端、平末端与同尾酶示意">
        <text x="40" y="28" fontSize="13" fill={INK}>5′ 突出端（黏端）</text>
        <rect x="50" y="46" width="120" height="14" fill="none" stroke={INK} strokeWidth="1.2" />
        <rect x="50" y="70" width="90" height="14" fill="none" stroke={INK} strokeWidth="1.2" />
        <rect x="230" y="46" width="90" height="14" fill="none" stroke={INK} strokeWidth="1.2" />
        <rect x="260" y="70" width="90" height="14" fill="none" stroke={INK} strokeWidth="1.2" />
        <text x="200" y="58" textAnchor="middle" fontFamily={MONO} fontSize="12" fill={CINNABAR}>AATT</text>
        <text x="200" y="82" textAnchor="middle" fontFamily={MONO} fontSize="12" fill={CINNABAR}>TTAA</text>
        <text x="50" y="106" fontSize="12" fill={INK3}>EcoRI · 5′ 突出，两端互补</text>

        <line x1="40" y1="120" x2="720" y2="120" stroke={HAIR} strokeWidth="1" />
        <text x="40" y="150" fontSize="13" fill={INK}>平端</text>
        {block(40, 166)}
        {block(208, 166)}
        <text x="452" y="190" fontSize="12" fill={INK3}>SmaI · 无突出，连接效率低</text>

        <line x1="40" y1="228" x2="720" y2="228" stroke={HAIR} strokeWidth="1" />
        <text x="40" y="258" fontSize="13" fill={INK}>同尾酶：识别不同，末端相同</text>
        {block(40, 274)}
        {block(296, 274)}
        <text x="216" y="286" fontFamily={MONO} fontSize="16" fill={CINNABAR}>GATC</text>
        <text x="216" y="308" fontFamily={MONO} fontSize="16" fill={CINNABAR}>CTAG</text>
        <text x="484" y="292" fontSize="12" fill={INK3}>BamHI G|GATCC · BglII A|GATCT</text>
        <text x="484" y="312" fontSize="12" fill={INK3}>切出的都是 5′-GATC，可以互连</text>
      </svg>
    </FigureFrame>
  );
}

/** 通用质粒环图：四个功能区，不按比例 */
function PlasmidGeneral() {
  const cx = 240;
  const cy = 196;
  const r = 118;
  const features = [
    { label: "复制起始区 ori", start: 8, end: 92, dash: "", width: 7 },
    { label: "选择标记（抗性）", start: 116, end: 196, dash: "7 5", width: 5 },
    { label: "多克隆位点 MCS", start: 214, end: 250, dash: "", width: 12 },
    { label: "启动子 → 目标基因", start: 272, end: 348, dash: "2 4", width: 6 },
  ];
  const labels = [
    { x: 368, y: 106, anchor: "start" },
    { x: 368, y: 310, anchor: "start" },
    { x: 16, y: 292, anchor: "start" },
    { x: 16, y: 84, anchor: "start" },
  ] as const;
  return (
    <FigureFrame
      id="plasmid-general"
      title="质粒载体的四个功能区"
      note="环图按功能区相对位置排布，不是 pUC18 / pBR322 的测序坐标；真实图谱可直接从 GenBank（J01749 / L08752）取坐标核对。"
    >
      <svg viewBox="0 0 760 400" role="img" aria-label="质粒载体功能区示意">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={HAIR} strokeWidth="1" />
        {features.map((feature, index) => {
          const start = polar(cx, cy, r, feature.start, 360);
          const end = polar(cx, cy, r, feature.end, 360);
          const mid = polar(cx, cy, r, (feature.start + feature.end) / 2, 360);
          const label = labels[index];
          const largeArc = ((feature.end - feature.start + 360) % 360) > 180 ? 1 : 0;
          return (
            <g key={feature.label}>
              <path
                d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`}
                fill="none"
                stroke={INK}
                strokeWidth={feature.width}
                strokeDasharray={feature.dash || undefined}
                strokeLinecap="butt"
              />
              <line
                x1={mid.x}
                y1={mid.y}
                x2={label.anchor === "start" ? label.x - 6 : label.x + 6}
                y2={label.y - 10}
                stroke={HAIR}
                strokeWidth="1"
              />
              <text x={label.x} y={label.y} textAnchor={label.anchor} fontSize="12" fill={INK}>
                {feature.label}
              </text>
            </g>
          );
        })}
        <text x="16" y="104" fontSize="12" fill={INK}>→ 终止子</text>
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="15" fill={INK}>克隆 / 表达载体</text>
        <text x={cx} y={cy + 18} textAnchor="middle" fontSize="12" fill={INK3}>环状双链 DNA</text>
        <text x={cx} y={cy + 40} textAnchor="middle" fontSize="11" fill={INK3}>图不为比例尺</text>

        <g fontSize="12" fill={INK}>
          <text x="490" y="90" fontSize="13">四个功能区各管什么</text>
          <text x="490" y="126">1  ori：决定能否复制</text>
          <text x="490" y="150">2  标记：把带载体的细胞筛出</text>
          <text x="490" y="174">3  MCS：提供单一酶切位点</text>
          <text x="490" y="198">4  启动子/终止子：管转录</text>
        </g>
        <g fontSize="11" fill={INK3}>
          <text x="490" y="238">pUC18：2 686 bp，lacZ′ + MCS</text>
          <text x="490" y="260">pBR322：4 361 bp，Amp / Tet</text>
          <text x="490" y="282">表达载体另加 RBS、标签与终止子</text>
        </g>
      </svg>
    </FigureFrame>
  );
}

/** PCR：三温度循环 + 产物累积 */
function PcrCycles() {
  const x0 = 78;
  const y0 = 52;
  const w = 286;
  const h = 190;
  const tempY = (temp: number) => y0 + h - ((temp - 40) / 60) * h;
  const cycle = [
    [50, 0],
    [94, 0],
    [94, 46],
    [55, 46],
    [55, 82],
    [72, 82],
    [72, 148],
    [50, 148],
  ];
  const points = cycle
    .map(([temp, offset]) => `${x0 + (offset / 150) * w},${tempY(temp)}`)
    .join(" ");
  const curve = Array.from({ length: 37 }, (_, n) => {
    // 前两轮只有长度未限定的产物；目标长度产物从第 3 轮起才按 2^(n−2) 累积。
    const value = n < 3 ? 0 : 1 - Math.exp(-0.19 * (n - 2));
    return `${462 + (n / 35) * 248},${286 - value * 176}`;
  }).join(" ");
  return (
    <FigureFrame
      id="pcr-cycles"
      title="三温度循环与产物累积"
      note="一个循环三个阶段：94 ℃ 变性、55 ℃ 退火、72 ℃ 延伸。前两轮只得到长度未限定的产物；从第 3 轮起，两端由引物限定的目标长度产物才按 2^(n−2) 累积，30 轮后进入平台期。温度与时间按具体聚合酶手册调整。"
    >
      <svg viewBox="0 0 760 330" role="img" aria-label="PCR 温度循环与目标长度产物累积曲线">
        <text x="40" y="28" fontSize="13" fill={INK}>A · 一个循环的温度曲线</text>
        <line x1={x0} y1={y0} x2={x0} y2={y0 + h} stroke={INK} strokeWidth="1.2" />
        <line x1={x0} y1={y0 + h} x2={x0 + w + 18} y2={y0 + h} stroke={INK} strokeWidth="1.2" />
        {[50, 72, 94].map((temp) => (
          <g key={temp}>
            <line x1={x0 - 5} y1={tempY(temp)} x2={x0} y2={tempY(temp)} stroke={INK} strokeWidth="1" />
            <text x={x0 - 9} y={tempY(temp) + 4} textAnchor="end" fontSize="11" fill={INK3}>{temp} ℃</text>
          </g>
        ))}
        <polyline points={points} fill="none" stroke={CINNABAR} strokeWidth="2.2" />
        <text x={x0 + 22} y={tempY(94) - 8} fontSize="11" fill={CINNABAR}>变性</text>
        <text x={x0 + 88} y={tempY(55) - 8} fontSize="11" fill={CINNABAR}>退火</text>
        <text x={x0 + 142} y={tempY(72) - 8} fontSize="11" fill={CINNABAR}>延伸</text>
        <text x={x0 + w / 2} y={y0 + h + 26} textAnchor="middle" fontSize="11" fill={INK3}>一轮约 2–4 min，重复 30–35 轮</text>

        <line x1="408" y1="40" x2="408" y2="300" stroke={HAIR} strokeWidth="1" />
        <text x="446" y="28" fontSize="13" fill={INK}>B · 目标长度产物（第 3 轮起 2ⁿ⁻²）</text>
        <line x1="462" y1="110" x2="462" y2="286" stroke={INK} strokeWidth="1.2" />
        <line x1="462" y1="286" x2="726" y2="286" stroke={INK} strokeWidth="1.2" />
        <polyline points={curve} fill="none" stroke={INK} strokeWidth="2" />
        {[0, 10, 20, 30, 35].map((n) => (
          <g key={n}>
            <line x1={462 + (n / 35) * 248} y1="286" x2={462 + (n / 35) * 248} y2="291" stroke={INK} strokeWidth="1" />
            <text x={462 + (n / 35) * 248} y="304" textAnchor="middle" fontSize="10" fill={INK3}>{n}</text>
          </g>
        ))}
        <text x="726" y="322" textAnchor="end" fontSize="11" fill={INK3}>循环数</text>
        <text x="474" y="104" fontSize="11" fill={INK3}>目标产物量</text>
        <text x="474" y="258" fontSize="10" fill={INK3}>第 1–2 轮：长度未限定</text>
        <line x1="660" y1="146" x2="700" y2="146" stroke={HAIR} strokeWidth="1" strokeDasharray="3 3" />
        <text x="706" y="150" fontSize="10" fill={INK3}>平台期</text>
      </svg>
    </FigureFrame>
  );
}

/** 连接：末端配对、方向性、去磷酸化 */
function LigationEnds() {
  return (
    <FigureFrame
      id="ligation-ends"
      title="末端配对、方向与去磷酸化"
      note="黏端配对只是把两段 DNA 拉到一起，封口靠 T4 连接酶；两端用不同酶切才能定向，单酶切载体先去磷酸化以减少自连。"
    >
      <svg viewBox="0 0 760 320" role="img" aria-label="连接反应的末端配对与方向性示意">
        <text x="40" y="28" fontSize="13" fill={INK}>A · 黏端配对后封口</text>
        <rect x="50" y="62" width="120" height="12" fill="none" stroke={INK} strokeWidth="1.2" />
        <rect x="50" y="86" width="90" height="12" fill="none" stroke={INK} strokeWidth="1.2" />
        <rect x="230" y="62" width="90" height="12" fill="none" stroke={INK} strokeWidth="1.2" />
        <rect x="260" y="86" width="90" height="12" fill="none" stroke={INK} strokeWidth="1.2" />
        <text x="200" y="72" textAnchor="middle" fontFamily={MONO} fontSize="11" fill={CINNABAR}>AATT</text>
        <text x="200" y="96" textAnchor="middle" fontFamily={MONO} fontSize="11" fill={CINNABAR}>TTAA</text>
        <path d="M 200 118 L 200 104" stroke={CINNABAR} strokeWidth="1.2" />
        <path d="M 200 104 l -4 7 l 8 0 z" fill={CINNABAR} />
        <text x="50" y="136" fontSize="11" fill={INK3}>T4 ligase + ATP 把缺口接成磷酸二酯键</text>
        <text x="50" y="154" fontSize="11" fill={INK3}>黏端只负责配对，封口靠酶</text>

        <line x1="380" y1="46" x2="380" y2="282" stroke={HAIR} strokeWidth="1" />
        <text x="410" y="28" fontSize="13" fill={INK}>B · 方向由两端位点决定</text>
        <path d="M 432 78 a 34 34 0 1 1 0 68 a 34 34 0 1 1 0 -68" fill="none" stroke={INK} strokeWidth="2" />
        <path d="M 466 112 l -10 -6 v 12 z" fill={INK} />
        <text x="392" y="166" fontSize="11" fill={INK3}>载体（EcoRI + BamHI）</text>
        <rect x="492" y="92" width="96" height="14" fill="none" stroke={INK} strokeWidth="1.2" />
        <path d="M 588 99 l 12 0 m -6 -6 l 6 6 l -6 6" fill="none" stroke={INK} strokeWidth="1.4" />
        <text x="600" y="88" fontSize="11" fill={INK3}>正向</text>
        <rect x="492" y="132" width="96" height="14" fill="none" stroke={INK} strokeWidth="1.2" strokeDasharray="4 3" />
        <path d="M 492 139 l -12 0 m 6 -6 l -6 6 l 6 6" fill="none" stroke={CINNABAR} strokeWidth="1.4" />
        <text x="446" y="156" fontSize="11" fill={CINNABAR}>反向</text>
        <text x="410" y="204" fontSize="11" fill={INK3}>双酶切：两端不互补，方向被锁死</text>

        <line x1="40" y1="242" x2="720" y2="242" stroke={HAIR} strokeWidth="1" />
        <text x="40" y="272" fontSize="13" fill={INK}>C · 去磷酸化</text>
        <rect x="150" y="262" width="180" height="14" fill="none" stroke={INK} strokeWidth="1.2" />
        <circle cx="150" cy="269" r="4" fill="none" stroke={CINNABAR} strokeWidth="1.4" />
        <text x="342" y="274" fontSize="11" fill={CINNABAR}>5′ 磷酸被去掉</text>
        <text x="470" y="274" fontSize="11" fill={INK3}>载体不能自连，只能接带磷酸的插入片段</text>
      </svg>
    </FigureFrame>
  );
}

/** 重叠臂组装：Gibson / In-Fusion */
function OverlapAssembly() {
  return (
    <FigureFrame
      id="overlap-assembly"
      title="重叠臂组装（Gibson / In-Fusion）"
      note="两段末端共享 15–20 bp 同源序列：外切酶先退出一段单链，退火后聚合酶补齐、连接酶封口。片段多、无合适酶切位点时用这条路。"
    >
      <svg viewBox="0 0 760 300" role="img" aria-label="重叠臂组装示意">
        <text x="40" y="28" fontSize="13" fill={INK}>A · 两个片段共享一段同源序列</text>
        <rect x="48" y="58" width="290" height="16" fill="none" stroke={INK} strokeWidth="1.3" />
        <rect x="418" y="58" width="290" height="16" fill="none" stroke={INK} strokeWidth="1.3" />
        <rect x="286" y="58" width="52" height="16" fill="none" stroke={CINNABAR} strokeWidth="1.6" strokeDasharray="5 3" />
        <rect x="418" y="58" width="52" height="16" fill="none" stroke={CINNABAR} strokeWidth="1.6" strokeDasharray="5 3" />
        <text x="338" y="46" textAnchor="middle" fontSize="11" fill={CINNABAR}>两端各带同一段 15–20 bp</text>
        <path d="M 292 82 q 66 26 132 0" fill="none" stroke={CINNABAR} strokeWidth="1.1" strokeDasharray="4 3" />
        <text x="48" y="92" fontSize="11" fill={INK3}>片段 A</text>
        <text x="610" y="92" textAnchor="end" fontSize="11" fill={INK3}>片段 B</text>

        <text x="40" y="134" fontSize="13" fill={INK}>B · 退火后补齐、封口</text>
        <path d="M 60 160 L 330 160" stroke={INK} strokeWidth="3" fill="none" />
        <path d="M 330 160 L 330 196" stroke={INK} strokeWidth="3" fill="none" />
        <path d="M 330 196 L 690 196" stroke={INK} strokeWidth="3" fill="none" />
        <text x="330" y="150" textAnchor="middle" fontSize="11" fill={CINNABAR}>退火</text>
        <text x="338" y="216" fontSize="11" fill={CINNABAR}>缺口：聚合酶补齐 + 连接酶封口</text>
        <text x="60" y="238" fontSize="11" fill={INK3}>外切酶先咬掉 5′ 端，露出单链</text>

        <line x1="40" y1="256" x2="720" y2="256" stroke={HAIR} strokeWidth="1" />
        <text x="40" y="282" fontSize="12" fill={INK}>Gibson：三种酶一管完成</text>
        <text x="380" y="282" fontSize="12" fill={INK}>In-Fusion：同样靠 15 bp 重叠</text>
      </svg>
    </FigureFrame>
  );
}

/** Ni-NTA 四步 */
function NiNta() {
  const steps = [
    { title: "结合", detail: "His₆ 与 Ni²⁺ 配位", buffer: "10–20 mM 咪唑" },
    { title: "洗杂", detail: "弱结合蛋白先走", buffer: "20–40 mM 咪唑" },
    { title: "洗脱", detail: "高咪唑竞争置换", buffer: "250–500 mM 咪唑" },
    { title: "换液", detail: "透析或超滤去咪唑", buffer: "储存缓冲液" },
  ];
  return (
    <FigureFrame
      id="ni-nta"
      title="Ni-NTA 四步纯化"
      note="His₆ 标签与 Ni²⁺ 配位实现捕获；咪唑是竞争洗脱剂，浓度越高洗得越彻底。洗脱后必须去咪唑，否则影响后续酶活与保存。"
    >
      <svg viewBox="0 0 760 280" role="img" aria-label="Ni-NTA 亲和纯化四步">
        <defs>
          <marker id="ni-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 z" fill={INK3} />
          </marker>
        </defs>
        {steps.map((step, index) => {
          const x = 40 + index * 178;
          return (
            <g key={step.title}>
              <circle cx={x + 64} cy="96" r="44" fill="none" stroke={HAIR} strokeWidth="1.2" />
              {[0, 1, 2, 3, 4].map((dot) => {
                const angle = (dot * 72 * Math.PI) / 180;
                return (
                  <circle
                    key={dot}
                    cx={x + 64 + Math.cos(angle) * 22}
                    cy={96 + Math.sin(angle) * 22}
                    r="2.6"
                    fill={INK3}
                  />
                );
              })}
              <rect x={x + 42} y="72" width="18" height="34" rx="4" fill="none" stroke={INK} strokeWidth="1.3" />
              <rect x={x + 64} y="80" width="26" height="20" rx="4" fill="none" stroke={CINNABAR} strokeWidth="1.3" />
              <text x={x + 64} y="66" textAnchor="middle" fontSize="11" fill={CINNABAR}>His₆</text>
              <text x={x + 64} y="158" textAnchor="middle" fontSize="13" fill={INK}>{index + 1} · {step.title}</text>
              <text x={x + 64} y="176" textAnchor="middle" fontSize="11" fill={INK3}>{step.detail}</text>
              <text x={x + 64} y="194" textAnchor="middle" fontSize="10.5" fill={INK3}>{step.buffer}</text>
              {index < 3 ? (
                <line x1={x + 118} y1="96" x2={x + 158} y2="96" stroke={INK3} strokeWidth="1.2" markerEnd="url(#ni-arrow)" />
              ) : null}
            </g>
          );
        })}
        <text x="380" y="238" textAnchor="middle" fontSize="11" fill={INK3}>
          每一步都留样跑 SDS-PAGE：看目标带是否出现、杂带是否减少
        </text>
      </svg>
    </FigureFrame>
  );
}

/** 酵母细胞工厂 */
function YeastFactory() {
  return (
    <FigureFrame
      id="yeast-factory"
      title="酵母细胞工厂"
      note="外源基因可整合进基因组或用附加型质粒表达；AOX1 由甲醇诱导，产物经内质网折叠、高尔基体加工后分泌。酵母的 N-糖基化为高甘露糖型，与哺乳动物不同。"
    >
      <svg viewBox="0 0 760 340" role="img" aria-label="酵母表达与分泌途径示意">
        <ellipse cx="300" cy="178" rx="236" ry="128" fill="none" stroke={INK} strokeWidth="1.6" />
        <ellipse cx="300" cy="178" rx="206" ry="100" fill="none" stroke={HAIR} strokeWidth="1" strokeDasharray="4 4" />
        <text x="300" y="42" textAnchor="middle" fontSize="12" fill={INK3}>毕赤酵母 / 酿酒酵母</text>

        <rect x="128" y="88" width="96" height="28" fill="none" stroke={CINNABAR} strokeWidth="1.4" />
        <text x="176" y="107" textAnchor="middle" fontSize="11" fill={CINNABAR}>AOX1 启动子</text>
        <path d="M 224 102 L 252 102" stroke={CINNABAR} strokeWidth="1.6" />
        <path d="M 252 102 l -8 -5 v 10 z" fill={CINNABAR} />
        <rect x="254" y="88" width="92" height="28" fill="none" stroke={INK} strokeWidth="1.2" />
        <text x="300" y="107" textAnchor="middle" fontSize="11" fill={INK}>目标基因</text>
        <text x="176" y="80" textAnchor="middle" fontSize="10.5" fill={INK3}>甲醇诱导</text>

        <path d="M 120 150 q 30 -18 60 0 q 30 18 60 0 q 30 -18 60 0" fill="none" stroke={INK} strokeWidth="1.4" />
        <text x="210" y="140" textAnchor="middle" fontSize="10.5" fill={INK3}>内质网：折叠</text>

        <g>
          <path d="M 360 128 q 34 -14 68 0" fill="none" stroke={INK} strokeWidth="1.5" />
          <path d="M 360 144 q 34 -14 68 0" fill="none" stroke={INK} strokeWidth="1.5" />
          <path d="M 360 160 q 34 -14 68 0" fill="none" stroke={INK} strokeWidth="1.5" />
        </g>
        <text x="394" y="184" textAnchor="middle" fontSize="10.5" fill={INK3}>高尔基体：糖基化</text>

        <path d="M 394 200 L 394 244 Q 394 266 424 266 L 520 266" fill="none" stroke={INK} strokeWidth="1.6" />
        <path d="M 520 266 l -9 -5 v 10 z" fill={INK} />
        <text x="470" y="256" textAnchor="middle" fontSize="10.5" fill={INK3}>分泌到胞外</text>

        <text x="300" y="232" textAnchor="middle" fontSize="11" fill={INK3}>转录 → 翻译 → 折叠 → 加工</text>

        <line x1="574" y1="64" x2="574" y2="290" stroke={HAIR} strokeWidth="1" />
        <text x="596" y="76" fontSize="12" fill={INK}>为什么常用它</text>
        <text x="596" y="102" fontSize="11" fill={INK3}>· 真核折叠与分泌</text>
        <text x="596" y="126" fontSize="11" fill={INK3}>· 高密度发酵便纯化</text>
        <text x="596" y="150" fontSize="11" fill={INK3}>· AOX1 甲醇诱导</text>
        <text x="596" y="182" fontSize="12" fill={INK}>要注意</text>
        <text x="596" y="208" fontSize="11" fill={INK3}>· 高甘露糖型糖基化</text>
        <text x="596" y="232" fontSize="11" fill={INK3}>· 甲醇易燃需防爆</text>
        <text x="596" y="256" fontSize="11" fill={INK3}>· 分泌易被蛋白酶降解</text>
      </svg>
    </FigureFrame>
  );
}

/** Southern 转膜三明治 */
function BlotTransfer() {
  const steps = [
    "电泳：按大小把 DNA 分开",
    "变性：0.5 M NaOH / 1.5 M NaCl",
    "中和：1 M Tris-HCl pH 7.4",
    "转膜：10×SSC 上行，压 500 g",
    "固定：80 ℃ 2 h 或 UV 交联",
  ];
  return (
    <FigureFrame
      id="blot-transfer"
      title="Southern 转膜三明治"
      note="盐溶液经滤纸上行，把凝胶里的核酸带到膜上；胶与膜之间不能有气泡，膜放反就白做。转膜只固定位置，是否为目标序列仍要靠探针杂交回答。"
    >
      <svg viewBox="0 0 760 340" role="img" aria-label="Southern 转膜三明治与步骤示意">
        <defs>
          <marker id="blot-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 z" fill={INK3} />
          </marker>
        </defs>
        <text x="40" y="26" fontSize="13" fill={INK}>A · 从下往上叠</text>

        <rect x="60" y="262" width="300" height="46" fill="none" stroke={HAIR} strokeWidth="1.2" />
        <path d="M 62 276 L 358 276" stroke={HAIR} strokeWidth="1" strokeDasharray="4 4" />
        <text x="72" y="298" fontSize="10.5" fill={INK3}>10×SSC 转移缓冲液</text>

        <rect x="78" y="250" width="264" height="10" fill="none" stroke={INK} strokeWidth="1.2" />
        <text x="346" y="258" fontSize="10.5" fill={INK3}>支持物</text>

        <rect x="84" y="242" width="252" height="6" fill="none" stroke={HAIR} strokeWidth="1.2" />
        <rect x="84" y="228" width="252" height="10" fill="none" stroke={CINNABAR} strokeWidth="1.8" />
        <text x="346" y="236" fontSize="10.5" fill={CINNABAR}>膜</text>

        <rect x="84" y="196" width="252" height="28" fill="none" stroke={INK} strokeWidth="1.3" />
        <rect x="102" y="204" width="34" height="3" fill={INK} />
        <rect x="102" y="211" width="52" height="3" fill={INK} />
        <rect x="102" y="218" width="22" height="3" fill={INK} />
        <text x="346" y="214" fontSize="10.5" fill={INK3}>凝胶</text>

        <rect x="84" y="186" width="252" height="6" fill="none" stroke={HAIR} strokeWidth="1.2" />
        {[0, 1, 2].map((i) => (
          <rect key={i} x="84" y={150 + i * 11} width="252" height="8" fill="none" stroke={HAIR} strokeWidth="1.1" />
        ))}
        <text x="346" y="164" fontSize="10.5" fill={INK3}>吸水纸</text>

        <rect x="78" y="138" width="264" height="8" fill="none" stroke={INK} strokeWidth="1.2" />
        <rect x="176" y="104" width="78" height="24" fill="none" stroke={INK} strokeWidth="1.3" />
        <text x="215" y="120" textAnchor="middle" fontSize="11" fill={INK}>500 g</text>
        <line x1="215" y1="128" x2="215" y2="136" stroke={INK3} strokeWidth="1.1" markerEnd="url(#blot-arrow)" />

        <line x1="44" y1="266" x2="44" y2="112" stroke={INK3} strokeWidth="1.2" markerEnd="url(#blot-arrow)" />
        <text x="36" y="196" fontSize="10.5" fill={INK3} transform="rotate(-90 36 196)">上行</text>

        <line x1="400" y1="48" x2="400" y2="312" stroke={HAIR} strokeWidth="1" />
        <text x="424" y="26" fontSize="13" fill={INK}>B · 五步走完才叫印迹</text>
        {steps.map((step, index) => (
          <text key={step} x="424" y={60 + index * 28} fontSize="11.5" fill={index === 1 ? CINNABAR : INK3}>
            {index + 1} · {step}
          </text>
        ))}
        <line x1="424" y1="214" x2="720" y2="214" stroke={HAIR} strokeWidth="1" />
        <text x="424" y="238" fontSize="11.5" fill={INK}>胶与膜之间不能有气泡</text>
        <text x="424" y="260" fontSize="11.5" fill={INK}>膜放反 = 转移白做</text>
        <text x="424" y="282" fontSize="11.5" fill={INK3}>转膜只固定位置，认序列靠探针</text>
      </svg>
    </FigureFrame>
  );
}

/** qPCR 扩增曲线与 Ct */
function QpcrCurve() {
  return (
    <FigureFrame
      id="qpcr-curve"
      title="qPCR 扩增曲线与 Ct"
      note="三条曲线只差起始模板量：模板越多，越早越过阈值，Ct 越小。效率 100% 时，Ct 相差 3.3 约等于模板相差 10 倍；阈值必须落在指数期，Ct 才能用来比较。"
    >
      <svg viewBox="0 0 760 310" role="img" aria-label="实时荧光定量 PCR 扩增曲线与 Ct 示意">
        <line x1="60" y1="256" x2="520" y2="256" stroke={INK} strokeWidth="1.2" />
        <line x1="60" y1="256" x2="60" y2="52" stroke={INK} strokeWidth="1.2" />
        <text x="520" y="278" textAnchor="end" fontSize="11" fill={INK3}>循环数</text>
        <text x="48" y="50" textAnchor="end" fontSize="11" fill={INK3}>荧光</text>

        <line x1="60" y1="150" x2="520" y2="150" stroke={CINNABAR} strokeWidth="1" strokeDasharray="5 4" />
        <text x="516" y="144" textAnchor="end" fontSize="10.5" fill={CINNABAR}>阈值</text>

        <path
          d="M 60 250 C 150 248 180 232 206 150 C 232 78 270 64 320 62 L 520 62"
          fill="none"
          stroke={INK}
          strokeWidth="2"
        />
        <path
          d="M 60 250 C 200 248 244 236 272 170 C 300 116 344 92 392 84 L 520 78"
          fill="none"
          stroke={CINNABAR}
          strokeWidth="1.8"
        />
        <path
          d="M 60 250 C 250 249 310 240 342 204 C 378 164 432 122 478 110 L 520 104"
          fill="none"
          stroke={INK3}
          strokeWidth="1.6"
        />

        {[
          { x: 206, label: "Ct₁" },
          { x: 272, label: "Ct₂" },
          { x: 342, label: "Ct₃" },
        ].map((ct) => (
          <g key={ct.label}>
            <line x1={ct.x} y1="150" x2={ct.x} y2="256" stroke={HAIR} strokeWidth="1" strokeDasharray="4 4" />
            <text x={ct.x} y="272" textAnchor="middle" fontSize="10.5" fill={INK3}>{ct.label}</text>
          </g>
        ))}

        <text x="96" y="44" fontSize="10.5" fill={INK3}>基线</text>
        <text x="228" y="44" fontSize="10.5" fill={INK3}>指数期</text>
        <text x="360" y="44" fontSize="10.5" fill={INK3}>线性期</text>
        <text x="466" y="44" fontSize="10.5" fill={INK3}>平台期</text>

        <line x1="556" y1="48" x2="556" y2="272" stroke={HAIR} strokeWidth="1" />
        <text x="580" y="70" fontSize="12" fill={INK}>Ct 差 3.3</text>
        <text x="580" y="92" fontSize="11.5" fill={INK3}>≈ 模板差 10 倍</text>
        <text x="580" y="126" fontSize="12" fill={INK}>Ct 越小</text>
        <text x="580" y="148" fontSize="11.5" fill={INK3}>起始模板越多</text>
        <text x="580" y="182" fontSize="12" fill={INK}>看效率</text>
        <text x="580" y="204" fontSize="11.5" fill={INK3}>标准曲线斜率 −3.32</text>
        <text x="580" y="226" fontSize="11.5" fill={INK3}>= 效率 100%</text>
        <text x="580" y="248" fontSize="11.5" fill={INK3}>90%–110% 可接受</text>
      </svg>
    </FigureFrame>
  );
}

/** Sanger 阶梯与四色峰 */
function SangerLadder() {
  const reads = [
    { base: "A", lane: 1 },
    { base: "T", lane: 3 },
    { base: "G", lane: 0 },
    { base: "C", lane: 2 },
    { base: "A", lane: 1 },
    { base: "A", lane: 1 },
    { base: "T", lane: 3 },
    { base: "G", lane: 0 },
    { base: "C", lane: 2 },
    { base: "T", lane: 3 },
  ];
  const colorOf = (base: string) =>
    base === "A" ? INK : base === "T" ? CINNABAR : INK3;
  return (
    <FigureFrame id="sanger-ladder" title="Sanger 阶梯与四色峰">
      <svg viewBox="0 0 760 330" role="img" aria-label="Sanger 测序四色阶梯读序示意">
        <text x="40" y="26" fontSize="13" fill={INK}>A · 四管电泳</text>
        <rect x="64" y="46" width="168" height="240" fill="none" stroke={HAIR} strokeWidth="1.2" />
        {["G", "A", "T", "C"].map((base, index) => (
          <text key={base} x={96 + index * 34} y="40" textAnchor="middle" fontSize="13" fill={INK3}>{base}</text>
        ))}
        {reads.map((read, index) => {
          const y = 266 - index * 22;
          const x = 96 + read.lane * 34;
          return (
            <rect
              key={index}
              x={x - 13}
              y={y}
              width="26"
              height="4"
              fill={colorOf(read.base)}
            />
          );
        })}
        <line x1="52" y1="272" x2="52" y2="72" stroke={INK3} strokeWidth="1.1" />
        <path d="M 52 72 l -4 8 h 8 z" fill={INK3} />
        <text x="44" y="186" fontSize="12" fill={INK3} transform="rotate(-90 44 186)">从下往上读</text>

        <line x1="264" y1="46" x2="264" y2="300" stroke={HAIR} strokeWidth="1" />
        <text x="288" y="26" fontSize="13" fill={INK}>B · 四色峰</text>
        <line x1="288" y1="250" x2="720" y2="250" stroke={INK} strokeWidth="1.1" />
        {reads.map((read, index) => {
          const x = 310 + index * 40;
          const h = 54 + (index % 3) * 18;
          return (
            <g key={index}>
              <path
                d={`M ${x - 15} 250 Q ${x} ${250 - h * 2} ${x + 15} 250`}
                fill="none"
                stroke={colorOf(read.base)}
                strokeWidth={read.base === "C" ? 1.2 : 1.8}
                strokeDasharray={read.base === "C" ? "4 3" : undefined}
              />
              <text x={x} y={250 - h * 2 - 8} textAnchor="middle" fontSize="13" fill={colorOf(read.base)}>
                {read.base}
              </text>
            </g>
          );
        })}
        <text x="310" y="286" fontSize="13" fill={INK3}>碱基序列：A T G C A A T G C T</text>
        <text x="288" y="308" fontSize="12.5" fill={INK3}>峰高不必一致，颜色与间隔才是判读依据</text>
      </svg>
    </FigureFrame>
  );
}

/** Illumina：桥式扩增成簇 + 边合成边测序 */
function IlluminaSbs() {
  const oligos = Array.from({ length: 23 }, (_, index) => 48 + index * 14);
  /* 四色可逆终止：A 绿、C 蓝、G 黑、T 红，与仪器四通道一一对应 */
  const bases = [
    { base: "A", x: 430, y: 150, tone: "#1f8a70" },
    { base: "T", x: 452, y: 132, tone: CINNABAR },
    { base: "G", x: 474, y: 150, tone: INK },
    { base: "C", x: 496, y: 132, tone: "#6b5aa6" },
  ];
  return (
    <FigureFrame
      id="illumina-sbs"
      title="桥式扩增与边合成边测序"
      note="桥式扩增只负责把信号放大成簇，不改变序列；SBS 每个循环只读一个碱基，读长受循环数与去相位限制。"
    >
      <svg viewBox="0 0 760 340" role="img" aria-label="Illumina 桥式扩增与边合成边测序示意">
        <text x="40" y="26" fontSize="13" fill={INK}>A · 桥式扩增</text>
        <line x1="40" y1="210" x2="360" y2="210" stroke={INK} strokeWidth="1.4" />
        {oligos.map((x, index) => (
          <line key={index} x1={x} y1="210" x2={x} y2="224" stroke={INK3} strokeWidth="1.2" />
        ))}
        <text x="40" y="244" fontSize="11" fill={INK3}>流动池表面 · 固定接头引物</text>

        <path d="M 66 210 L 96 164" stroke={CINNABAR} strokeWidth="2.2" fill="none" />
        <circle cx="96" cy="164" r="3.4" fill={CINNABAR} />
        <text x="66" y="132" fontSize="11" fill={INK3}>① 单链上样</text>

        <path d="M 150 210 Q 185 128 220 210" stroke={CINNABAR} strokeWidth="2.2" fill="none" />
        <path d="M 150 210 Q 185 146 220 210" stroke={INK3} strokeWidth="1.4" fill="none" strokeDasharray="4 3" />
        <text x="146" y="124" fontSize="11" fill={INK3}>② 成桥延伸</text>
        <text x="146" y="264" fontSize="11" fill={INK3}>聚合酶从固定引物 3′ 端补成双链</text>

        {[274, 280, 286, 292, 298].map((x, index) => (
          <line key={x} x1={x} y1="210" x2={x} y2={index === 2 ? 150 : 156} stroke={CINNABAR} strokeWidth="2" />
        ))}
        <ellipse cx="286" cy="180" rx="26" ry="36" fill="none" stroke={HAIR} strokeWidth="1" strokeDasharray="3 3" />
        <text x="252" y="132" fontSize="11" fill={INK3}>③ 变性成簇</text>
        <text x="248" y="286" fontSize="11" fill={INK3}>同一分子的克隆簇</text>

        <line x1="380" y1="46" x2="380" y2="300" stroke={HAIR} strokeWidth="1" />
        <text x="404" y="26" fontSize="13" fill={INK}>B · 边合成边测序（SBS）</text>
        <line x1="404" y1="210" x2="640" y2="210" stroke={INK} strokeWidth="1.4" />
        {[430, 452, 474, 496].map((x) => (
          <line key={x} x1={x} y1="210" x2={x} y2="170" stroke={INK3} strokeWidth="1.8" />
        ))}
        {bases.map((item) => (
          <g key={item.base}>
            <circle cx={item.x} cy={item.y} r="9" fill="none" stroke={item.tone} strokeWidth="1.8" />
            <text x={item.x} y={item.y + 4} textAnchor="middle" fontSize="10" fill={item.tone}>{item.base}</text>
          </g>
        ))}
        <text x="404" y="240" fontSize="11" fill={INK3}>每轮加一种可逆终止 dNTP</text>
        <text x="404" y="258" fontSize="11" fill={INK3}>→ 荧光成像 → 切掉阻断基团与荧光</text>
        <text x="404" y="276" fontSize="11" fill={INK3}>→ 下一轮；四色读出该位置的碱基</text>
        <text x="404" y="302" fontSize="11.5" fill={CINNABAR}>读序：A T G C …（每簇只从一个方向读）</text>

        <path d="M 676 108 a 26 26 0 1 1 -12 -21" fill="none" stroke={INK3} strokeWidth="1.3" />
        <path d="M 664 87 l 0 10 l 10 -4 z" fill={INK3} />
        <text x="692" y="168" textAnchor="middle" fontSize="10.5" fill={INK3}>一个循环</text>
        <text x="692" y="184" textAnchor="middle" fontSize="10.5" fill={INK3}>约 2–4 min</text>
      </svg>
    </FigureFrame>
  );
}

/** ONT：单链核酸过纳米孔，电流特征对应序列 */
function Nanopore() {
  return (
    <FigureFrame
      id="nanopore"
      title="纳米孔测序"
      note="单链 DNA 被马达蛋白逐碱基拉过孔道，孔内同时容纳约 5–6 个碱基；不同 k-mer 组合给出不同的离子电流台阶。无需扩增，因此可直接读天然甲基化等碱基修饰；单读准确率低于共识序列。"
    >
      <svg viewBox="0 0 760 340" role="img" aria-label="纳米孔测序原理：单链过孔与电流台阶">
        <text x="40" y="26" fontSize="13" fill={INK}>A · 单链过孔</text>
        <rect x="40" y="46" width="380" height="140" fill="none" stroke={HAIR} strokeWidth="1.2" />
        <text x="52" y="66" fontSize="11" fill={INK3}>cis（−）</text>
        <line x1="40" y1="200" x2="420" y2="200" stroke={INK} strokeWidth="1.4" />
        <line x1="40" y1="216" x2="420" y2="216" stroke={INK} strokeWidth="1.4" />
        <text x="426" y="212" fontSize="11" fill={INK3}>脂双层</text>
        <path d="M 214 200 L 246 200 L 239 216 L 221 216 Z" fill="none" stroke={CINNABAR} strokeWidth="1.8" />
        <text x="252" y="236" fontSize="10.5" fill={CINNABAR}>孔蛋白</text>

        <path d="M 230 74 L 230 200 L 230 252" stroke={CINNABAR} strokeWidth="2" fill="none" />
        {[86, 104, 122, 140, 158, 176].map((y) => (
          <line key={y} x1="224" y1={y} x2="236" y2={y - 4} stroke={CINNABAR} strokeWidth="1.4" />
        ))}
        <circle cx="230" cy="164" r="12" fill="none" stroke={INK} strokeWidth="1.6" />
        <text x="230" y="168" textAnchor="middle" fontSize="9" fill={INK}>马达</text>
        <rect x="40" y="252" width="380" height="56" fill="none" stroke={HAIR} strokeWidth="1.2" />
        <text x="52" y="272" fontSize="11" fill={INK3}>trans（+）</text>
        <text x="52" y="292" fontSize="11" fill={INK3}>单链逐碱基过孔，无需扩增</text>

        <line x1="450" y1="46" x2="450" y2="300" stroke={HAIR} strokeWidth="1" />
        <text x="474" y="26" fontSize="13" fill={INK}>B · 电流台阶</text>
        <line x1="490" y1="90" x2="490" y2="250" stroke={INK} strokeWidth="1.1" />
        <line x1="490" y1="250" x2="726" y2="250" stroke={INK} strokeWidth="1.1" />
        <polyline
          points="500,140 520,140 520,112 544,112 544,150 568,150 568,126 592,126 592,168 616,168 616,120 640,120 640,146 664,146 664,134 688,134 688,140 716,140"
          fill="none"
          stroke={CINNABAR}
          strokeWidth="2"
        />
        <text x="608" y="196" textAnchor="middle" fontSize="10" fill={INK3}>每段台阶 = 一个 k-mer</text>
        <text x="478" y="86" fontSize="10.5" fill={INK3}>电流</text>
        <text x="726" y="272" textAnchor="end" fontSize="10.5" fill={INK3}>时间</text>
        <text x="486" y="300" fontSize="11" fill={INK3}>不同碱基组合 → 特征电流；由电流解码序列</text>
      </svg>
    </FigureFrame>
  );
}


/** 酵母双杂交：BD 与 AD 靠互作拉近 */
function YeastTwoHybrid() {
  return (
    <FigureFrame
      id="yeast-two-hybrid"
      title="酵母双杂交"
      note="GAL4 的 DNA 结合域（BD）与转录激活域（AD）分开后都不工作；只有诱饵与猎物互作，把两者拉到同一个启动子上，报告基因才被转录。"
    >
      <svg viewBox="0 0 760 310" role="img" aria-label="酵母双杂交 BD 与 AD 重组示意">
        <text x="40" y="26" fontSize="13" fill={INK}>A · 两个融合蛋白</text>
        <rect x="52" y="62" width="104" height="30" fill="none" stroke={INK} strokeWidth="1.3" />
        <text x="104" y="82" textAnchor="middle" fontSize="11" fill={INK}>GAL4 BD</text>
        <rect x="156" y="62" width="112" height="30" fill="none" stroke={CINNABAR} strokeWidth="1.3" />
        <text x="212" y="82" textAnchor="middle" fontSize="11" fill={CINNABAR}>诱饵蛋白</text>

        <rect x="52" y="176" width="104" height="30" fill="none" stroke={INK} strokeWidth="1.3" />
        <text x="104" y="196" textAnchor="middle" fontSize="11" fill={INK}>GAL4 AD</text>
        <rect x="156" y="176" width="112" height="30" fill="none" stroke={CINNABAR} strokeWidth="1.3" />
        <text x="212" y="196" textAnchor="middle" fontSize="11" fill={CINNABAR}>猎物蛋白</text>

        <path d="M 212 94 L 212 174" stroke={CINNABAR} strokeWidth="1.2" strokeDasharray="4 3" />
        <text x="222" y="138" fontSize="10.5" fill={CINNABAR}>互作</text>
        <text x="52" y="238" fontSize="11" fill={INK3}>两者单独存在都不激活转录</text>

        <line x1="304" y1="46" x2="304" y2="280" stroke={HAIR} strokeWidth="1" />
        <text x="328" y="26" fontSize="13" fill={INK}>B · 报告基因被拉近才转录</text>

        <line x1="328" y1="120" x2="720" y2="120" stroke={INK} strokeWidth="1.4" />
        <rect x="344" y="100" width="96" height="20" fill="none" stroke={CINNABAR} strokeWidth="1.4" />
        <text x="392" y="114" textAnchor="middle" fontSize="10" fill={CINNABAR}>UAS（GAL4 位点）</text>
        <rect x="456" y="108" width="44" height="12" fill="none" stroke={INK3} strokeWidth="1.2" />
        <text x="478" y="96" textAnchor="middle" fontSize="10" fill={INK3}>TATA</text>
        <rect x="516" y="98" width="190" height="26" fill="none" stroke={INK} strokeWidth="1.3" />
        <text x="611" y="115" textAnchor="middle" fontSize="11" fill={INK}>HIS3 / URA3 / lacZ</text>

        <path d="M 392 74 Q 392 88 392 98" stroke={INK3} strokeWidth="1.2" />
        <path d="M 392 74 l -4 8 h 8 z" fill={INK3} />
        <text x="404" y="70" fontSize="10.5" fill={INK3}>BD 结合</text>
        <path d="M 500 74 Q 470 84 430 92" stroke={INK3} strokeWidth="1.2" strokeDasharray="3 3" />
        <text x="508" y="70" fontSize="10.5" fill={INK3}>AD 激活</text>

        <text x="328" y="160" fontSize="11" fill={INK3}>互作把 AD 带到 UAS 旁，RNA 聚合酶被招募</text>
        <text x="328" y="184" fontSize="11" fill={INK3}>转录出 HIS3 → 缺组氨酸板能长</text>
        <text x="328" y="208" fontSize="11" fill={INK3}>转录出 lacZ → X-gal 板变蓝</text>

        <line x1="328" y1="236" x2="720" y2="236" stroke={HAIR} strokeWidth="1" />
        <text x="328" y="260" fontSize="11" fill={INK}>对照：BD-诱饵 + 空 AD 不长</text>
        <text x="540" y="260" fontSize="11" fill={INK}>AD-猎物 + 空 BD 不长</text>
        <text x="328" y="284" fontSize="11" fill={INK3}>两个都长，才说明是「互作」而不是自激活</text>
      </svg>
    </FigureFrame>
  );
}

/** 物理导入：电穿孔与显微注射 */
function DeliveryMethods() {
  return (
    <FigureFrame
      id="delivery-methods"
      title="物理导入：电穿孔与显微注射"
      note="两种方法都绕过感受态：电穿孔靠脉冲在膜上打出瞬时孔道，显微注射直接把 DNA 送进原核。参数按细胞类型定，细菌的电压不能照搬到动植物细胞。"
    >
      <svg viewBox="0 0 760 300" role="img" aria-label="电穿孔与显微注射示意">
        <text x="40" y="26" fontSize="13" fill={INK}>A · 电穿孔</text>
        <rect x="56" y="62" width="180" height="150" fill="none" stroke={INK} strokeWidth="1.3" />
        <line x1="70" y1="80" x2="70" y2="194" stroke={INK3} strokeWidth="2.4" />
        <line x1="222" y1="80" x2="222" y2="194" stroke={INK3} strokeWidth="2.4" />
        {[[100, 106], [136, 132], [174, 112], [112, 168], [160, 176], [194, 146]].map(([x, y], index) => (
          <circle key={index} cx={x} cy={y} r="11" fill="none" stroke={HAIR} strokeWidth="1.2" />
        ))}
        <path d="M 118 150 q 14 -10 28 0 q 14 10 28 0" fill="none" stroke={CINNABAR} strokeWidth="1.6" />
        <path d="M 146 74 l -14 36 h 22 l -18 42" fill="none" stroke={CINNABAR} strokeWidth="2" />
        <text x="40" y="238" fontSize="12" fill={INK}>脉冲打孔 → DNA 进入 → 孔闭合</text>
        <text x="40" y="258" fontSize="10.5" fill={INK3}>细菌 1.8–2.5 kV（0.1 cm 杯，约 18–25 kV/cm）；原生质体 250–500 V/cm</text>

        <line x1="288" y1="46" x2="288" y2="270" stroke={HAIR} strokeWidth="1" />
        <text x="312" y="26" fontSize="13" fill={INK}>B · 显微注射</text>
        <ellipse cx="456" cy="150" rx="92" ry="74" fill="none" stroke={INK} strokeWidth="1.4" />
        <ellipse cx="456" cy="150" rx="84" ry="66" fill="none" stroke={HAIR} strokeWidth="1" />
        <circle cx="492" cy="150" r="30" fill="none" stroke={INK3} strokeWidth="1.3" />
        <line x1="330" y1="34" x2="486" y2="136" stroke={INK} strokeWidth="1.6" />
        <path d="M 486 136 l -12 -2 l 6 -9 z" fill={INK} />
        <path d="M 486 152 q 10 -7 20 0 q 10 7 20 0" fill="none" stroke={CINNABAR} strokeWidth="1.6" />
        <text x="318" y="238" fontSize="12" fill={INK}>针穿膜与核膜，送入原核</text>
        <text x="318" y="258" fontSize="10.5" fill={INK3}>每次 1–2 pL；整合率约 1%–5%</text>

        <line x1="580" y1="46" x2="580" y2="270" stroke={HAIR} strokeWidth="1" />
        <text x="604" y="70" fontSize="12" fill={INK}>为什么用它</text>
        <text x="604" y="96" fontSize="11" fill={INK3}>· 绕过感受态</text>
        <text x="604" y="120" fontSize="11" fill={INK3}>· 植物细胞与受精卵</text>
        <text x="604" y="144" fontSize="11" fill={INK3}>· 可同时导入多基因</text>
        <text x="604" y="178" fontSize="12" fill={INK}>代价</text>
        <text x="604" y="204" fontSize="11" fill={INK3}>· 一次一个细胞</text>
        <text x="604" y="228" fontSize="11" fill={INK3}>· 设备贵、易损伤</text>
        <text x="604" y="252" fontSize="11" fill={INK3}>· 整合位置不可控</text>
      </svg>
    </FigureFrame>
  );
}

/** Ti 质粒与植物转化 */
function TiPlasmid() {
  return (
    <FigureFrame
      id="ti-plasmid"
      title="Ti 质粒与植物转化"
      note="根癌农杆菌的 Ti 质粒上有一段 T-DNA，两端是 LB 与 RB；vir 区编码的蛋白把 T-DNA 切下、送入植物细胞并整合进基因组。载体在这里是「细菌质粒 + 植物染色体」的接力。"
    >
      <svg viewBox="0 0 760 310" role="img" aria-label="Ti 质粒 T-DNA 转移与植物细胞整合示意">
        <defs>
          <marker id="ti-arrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
            <path d="M 0 0 L 7 3 L 0 6 z" fill={CINNABAR} />
          </marker>
        </defs>
        <text x="40" y="26" fontSize="13" fill={INK}>A · 农杆菌 Ti 质粒</text>
        <circle cx="196" cy="166" r="98" fill="none" stroke={INK} strokeWidth="1.4" />
        <path d="M 229 74 A 98 98 0 0 1 288 200" fill="none" stroke={CINNABAR} strokeWidth="8" opacity="0.55" />
        <path d="M 196 264 A 98 98 0 0 1 116 96" fill="none" stroke={INK3} strokeWidth="8" opacity="0.35" />
        <text x="262" y="128" fontSize="10.5" fill={CINNABAR}>T-DNA</text>
        <text x="82" y="196" fontSize="10.5" fill={INK3}>vir 区</text>
        <circle cx="196" cy="166" r="3" fill={INK} />
        <text x="206" y="182" fontSize="10" fill={INK3}>ori</text>
        <text x="222" y="66" fontSize="10" fill={CINNABAR}>RB</text>
        <text x="286" y="214" fontSize="10" fill={CINNABAR}>LB</text>

        <path d="M 300 150 Q 360 130 408 142" fill="none" stroke={CINNABAR} strokeWidth="1.6" markerEnd="url(#ti-arrow)" />
        <text x="312" y="124" fontSize="10.5" fill={CINNABAR}>T-DNA 转移</text>

        <text x="424" y="26" fontSize="13" fill={INK}>B · 植物细胞</text>
        <ellipse cx="560" cy="166" rx="118" ry="86" fill="none" stroke={INK} strokeWidth="1.6" />
        <ellipse cx="560" cy="166" rx="108" ry="76" fill="none" stroke={HAIR} strokeWidth="1" />
        <circle cx="590" cy="160" r="34" fill="none" stroke={INK3} strokeWidth="1.3" />
        <path d="M 566 160 q 12 -8 24 0 q 12 8 24 0" fill="none" stroke={INK} strokeWidth="1.6" />
        <rect x="586" y="154" width="14" height="8" fill={CINNABAR} opacity="0.6" />
        <text x="590" y="222" textAnchor="middle" fontSize="10.5" fill={INK3}>T-DNA 整合进染色体</text>
        <text x="560" y="276" textAnchor="middle" fontSize="11" fill={INK}>组织培养 → 再生植株</text>
        <line x1="676" y1="60" x2="676" y2="240" stroke={HAIR} strokeWidth="1" />
        <text x="692" y="88" fontSize="11" fill={INK3}>T-DNA 内的</text>
        <text x="692" y="108" fontSize="11" fill={INK3}>目的基因</text>
        <text x="692" y="134" fontSize="11" fill={INK3}>随染色体</text>
        <text x="692" y="154" fontSize="11" fill={INK3}>稳定遗传</text>
      </svg>
    </FigureFrame>
  );
}

/** α-互补：两个片段单独无活性，合起来才切 X-gal */
function AlphaComplement() {
  return (
    <FigureFrame
      id="alpha-complement"
      title="α-互补的分子机制"
      note="宿主 lacZΔM15 提供缺第 11–41 位氨基酸的 ω 片段，质粒 lacZ′ 提供约 140 aa 的 α 片段；两者互补恢复 β-半乳糖苷酶活性，切开 X-gal 显蓝。外源片段插进 MCS 把 α 片段打断，互补消失，菌落变白。"
    >
      <svg viewBox="0 0 760 360" role="img" aria-label="α-互补与蓝白斑分子机制示意">
        <text x="40" y="26" fontSize="13" fill={INK}>A · 两个片段单独都没有活性，合起来才有</text>

        <text x="40" y="62" fontSize="11" fill={INK3}>宿主 LacZΔM15：ω 片段，缺 aa 11–41</text>
        <rect x="40" y="72" width="116" height="18" fill="none" stroke={INK} strokeWidth="1.2" />
        <rect x="156" y="72" width="34" height="18" fill="none" stroke={CINNABAR} strokeWidth="1.1" strokeDasharray="4 3" />
        <rect x="190" y="72" width="150" height="18" fill="none" stroke={INK} strokeWidth="1.2" />
        <text x="173" y="106" textAnchor="middle" fontSize="10" fill={CINNABAR}>缺口</text>

        <text x="40" y="134" fontSize="11" fill={INK3}>质粒 lacZ′：α 片段，约 140 aa，含 MCS</text>
        <rect x="40" y="144" width="300" height="18" fill="none" stroke={INK} strokeWidth="1.2" />
        <rect x="150" y="144" width="54" height="18" fill="none" stroke={CINNABAR} strokeWidth="1.1" strokeDasharray="4 3" />
        <text x="177" y="158" textAnchor="middle" fontSize="9.5" fill={CINNABAR}>MCS</text>

        <text x="362" y="120" fontSize="20" fill={INK}>+</text>
        <path d="M 390 114 L 432 114" stroke={INK3} strokeWidth="1.2" fill="none" />
        <path d="M 432 114 l -9 -4 v 8 z" fill={INK3} />

        <rect x="446" y="88" width="126" height="52" fill="none" stroke={INK} strokeWidth="1.4" />
        <text x="509" y="110" textAnchor="middle" fontSize="11" fill={INK}>活性 β-半乳糖苷酶</text>
        <text x="509" y="128" textAnchor="middle" fontSize="10" fill={INK3}>α + ω 互补</text>

        <path d="M 572 114 L 606 114" stroke={CINNABAR} strokeWidth="1.2" fill="none" />
        <path d="M 606 114 l -9 -4 v 8 z" fill={CINNABAR} />
        <text x="616" y="104" fontSize="11" fill={CINNABAR}>X-gal</text>
        <text x="616" y="128" fontSize="11" fill={CINNABAR}>蓝色产物</text>

        <line x1="40" y1="178" x2="720" y2="178" stroke={HAIR} strokeWidth="1" />

        <text x="40" y="206" fontSize="13" fill={INK}>B · 外源片段插进 MCS，α 片段被断开</text>
        <text x="40" y="236" fontSize="11" fill={INK3}>质粒 lacZ′::insert</text>
        <rect x="40" y="246" width="128" height="18" fill="none" stroke={INK} strokeWidth="1.2" />
        <rect x="168" y="240" width="74" height="30" fill="none" stroke={CINNABAR} strokeWidth="1.6" strokeDasharray="5 3" />
        <text x="205" y="260" textAnchor="middle" fontSize="9.5" fill={CINNABAR}>外源片段</text>
        <rect x="242" y="246" width="98" height="18" fill="none" stroke={INK} strokeWidth="1.2" />
        <text x="206" y="294" textAnchor="middle" fontSize="10" fill={CINNABAR}>α 片段不再完整</text>

        <path d="M 372 255 L 412 255" stroke={INK3} strokeWidth="1.2" fill="none" />
        <path d="M 412 255 l -9 -4 v 8 z" fill={INK3} />
        <text x="426" y="240" fontSize="11" fill={INK}>无互补 → 酶失活</text>
        <text x="426" y="264" fontSize="11" fill={INK3}>X-gal 不被切开</text>
        <text x="426" y="288" fontSize="11" fill={CINNABAR}>白色菌落</text>

        <text x="614" y="240" fontSize="10.5" fill={INK3}>显色还要</text>
        <text x="614" y="260" fontSize="10.5" fill={INK3}>IPTG 诱导</text>
        <text x="614" y="280" fontSize="10.5" fill={INK3}>lac 启动子</text>
      </svg>
    </FigureFrame>
  );
}

/** SSH：抑制 PCR 只让两端带不同接头的差异片段指数扩增 */
function SshSuppression() {
  const steps = [
    { title: "① tester 分两份", lines: ["cDNA 分成两管", "分别接 1 / 2R", "两种不同接头"] },
    { title: "② 过量 driver 杂交", lines: ["driver 20–40×", "两轮杂交", "扣掉共同序列"] },
    { title: "③ 抑制 PCR", lines: ["补平末端、加接头", "同接头两端成锅柄", "非差异片段被抑制"] },
    { title: "④ 嵌套 PCR", lines: ["只用差异片段", "克隆、测序", "qRT-PCR 复核"] },
  ];
  return (
    <FigureFrame
      id="ssh-suppression"
      title="SSH：抑制 PCR 为什么只扩差异片段"
      note="抑制性扣除杂交（Diatchenko et al., PNAS, 1996）把 tester 分成两份、各接一种接头，用过量 driver 杂交两轮；只有两端带不同接头的差异片段能指数扩增，两端同接头的分子会形成锅柄结构而被抑制。"
    >
      <svg viewBox="0 0 760 370" role="img" aria-label="抑制性扣除杂交与抑制 PCR 原理示意">
        <text x="40" y="26" fontSize="13" fill={INK}>A · 四步流程</text>
        {steps.map((step, index) => {
          const x = 40 + index * 174;
          return (
            <g key={step.title}>
              <rect x={x} y="42" width="152" height="96" fill="none" stroke={index === 2 ? CINNABAR : INK} strokeWidth="1.2" />
              <text x={x + 76} y="62" textAnchor="middle" fontSize="10.5" fill={index === 2 ? CINNABAR : INK}>{step.title}</text>
              {step.lines.map((line, lineIndex) => (
                <text key={line} x={x + 76} y={82 + lineIndex * 18} textAnchor="middle" fontSize="10" fill={INK3}>{line}</text>
              ))}
              {index < 3 ? (
                <g>
                  <path d={`M ${x + 154} 90 L ${x + 168} 90`} stroke={INK3} strokeWidth="1.1" fill="none" />
                  <path d={`M ${x + 168} 90 l -7 -3 v 6 z`} fill={INK3} />
                </g>
              ) : null}
            </g>
          );
        })}

        <line x1="40" y1="164" x2="720" y2="164" stroke={HAIR} strokeWidth="1" />

        <text x="40" y="192" fontSize="13" fill={INK}>B · 抑制 PCR 的分叉</text>

        <text x="40" y="220" fontSize="11" fill={CINNABAR}>两端同一接头 → 锅柄结构 → 不扩增</text>
        <line x1="46" y1="252" x2="300" y2="252" stroke={INK} strokeWidth="2" />
        <rect x="30" y="243" width="18" height="18" fill="none" stroke={CINNABAR} strokeWidth="1.4" />
        <rect x="298" y="243" width="18" height="18" fill="none" stroke={CINNABAR} strokeWidth="1.4" />
        <text x="39" y="238" textAnchor="middle" fontSize="9.5" fill={CINNABAR}>1</text>
        <text x="307" y="238" textAnchor="middle" fontSize="9.5" fill={CINNABAR}>1</text>
        <path d="M 298 252 C 330 252 330 210 300 210 C 270 210 270 252 240 252" fill="none" stroke={INK3} strokeWidth="1.2" strokeDasharray="4 3" />
        <text x="196" y="288" fontSize="10" fill={INK3}>接头互补，链内退火成锅柄</text>
        <text x="196" y="306" fontSize="10" fill={INK3}>引物无处结合，产物不成倍增加</text>

        <line x1="360" y1="204" x2="360" y2="330" stroke={HAIR} strokeWidth="1" />

        <text x="388" y="220" fontSize="11" fill={INK}>两端不同接头 → 指数扩增</text>
        <line x1="394" y1="252" x2="690" y2="252" stroke={INK} strokeWidth="2" />
        <rect x="378" y="243" width="18" height="18" fill="none" stroke={CINNABAR} strokeWidth="1.4" />
        <rect x="688" y="243" width="18" height="18" fill="none" stroke={INK} strokeWidth="1.4" />
        <text x="387" y="238" textAnchor="middle" fontSize="9.5" fill={CINNABAR}>1</text>
        <text x="697" y="238" textAnchor="middle" fontSize="9.5" fill={INK}>2R</text>
        <path d="M 420 282 L 456 282" stroke={CINNABAR} strokeWidth="1.2" fill="none" />
        <path d="M 456 282 l -7 -3 v 6 z" fill={CINNABAR} />
        <path d="M 664 282 L 628 282" stroke={INK3} strokeWidth="1.2" fill="none" />
        <path d="M 628 282 l 7 -3 v 6 z" fill={INK3} />
        <text x="540" y="300" textAnchor="middle" fontSize="10" fill={INK3}>两端引物各认一种接头</text>
        <text x="540" y="318" textAnchor="middle" fontSize="10" fill={INK3}>只有差异片段被指数扩增</text>
      </svg>
    </FigureFrame>
  );
}

/** Sec 与 Tat：一条运未折叠，一条运已折叠 */
function SecTat() {
  return (
    <FigureFrame
      id="sec-tat"
      title="Sec 与 Tat：两条分泌途径的分叉"
      note="Sec 占枯草芽孢杆菌胞外蛋白的 90% 以上，只能运未折叠前体；Tat 的信号肽含两个相邻精氨酸，能把胞内已折叠的蛋白运出去。两条途径的信号肽都在 N 端，最终都由信号肽酶切除。"
    >
      <svg viewBox="0 0 760 380" role="img" aria-label="Sec 与 Tat 分泌途径对比示意">
        <defs>
          <marker id="sec-tat-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 z" fill={INK3} />
          </marker>
        </defs>

        <text x="40" y="26" fontSize="13" fill={INK}>A · Sec：运未折叠前体</text>
        <text x="40" y="48" fontSize="10" fill={INK3}>胞外</text>
        <rect x="40" y="176" width="300" height="20" fill="none" stroke={INK} strokeWidth="1.4" />
        <line x1="40" y1="186" x2="340" y2="186" stroke={HAIR} strokeWidth="1" strokeDasharray="5 4" />
        <text x="40" y="222" fontSize="10" fill={INK3}>胞内</text>

        <ellipse cx="92" cy="300" rx="28" ry="14" fill="none" stroke={INK} strokeWidth="1.2" />
        <ellipse cx="92" cy="286" rx="22" ry="9" fill="none" stroke={HAIR} strokeWidth="1" />
        <text x="92" y="332" textAnchor="middle" fontSize="10" fill={INK3}>核糖体</text>

        <path d="M 112 292 C 140 280 146 254 170 244 C 190 236 200 224 214 214" fill="none" stroke={INK} strokeWidth="2" />
        <path d="M 112 292 l -8 -4 l 2 8" fill="none" stroke={CINNABAR} strokeWidth="2" />
        <text x="124" y="256" fontSize="10" fill={CINNABAR}>信号肽</text>
        <text x="124" y="272" fontSize="10" fill={INK3}>未折叠链</text>

        <rect x="204" y="176" width="10" height="20" fill="none" stroke={INK} strokeWidth="1.3" />
        <rect x="226" y="176" width="10" height="20" fill="none" stroke={INK} strokeWidth="1.3" />
        <text x="220" y="168" textAnchor="middle" fontSize="9.5" fill={INK3}>SecYEG</text>
        <circle cx="220" cy="212" r="12" fill="none" stroke={CINNABAR} strokeWidth="1.2" />
        <text x="220" y="216" textAnchor="middle" fontSize="9" fill={CINNABAR}>SecA</text>

        <path d="M 220 200 L 220 146" stroke={INK3} strokeWidth="1.6" markerEnd="url(#sec-tat-arrow)" />
        <path d="M 236 140 C 250 128 268 126 278 112" fill="none" stroke={INK} strokeWidth="2" />
        <path d="M 278 112 l 6 -8 l -9 1" fill="none" stroke={CINNABAR} strokeWidth="1.6" />
        <text x="284" y="102" fontSize="10" fill={CINNABAR}>切信号肽</text>
        <path d="M 236 140 C 236 120 252 106 268 106 C 284 106 292 118 288 130" fill="none" stroke={INK} strokeWidth="2" />
        <text x="250" y="92" fontSize="10" fill={INK3}>出去后折叠</text>

        <line x1="372" y1="46" x2="372" y2="344" stroke={HAIR} strokeWidth="1" />

        <text x="400" y="26" fontSize="13" fill={INK}>B · Tat：运已折叠蛋白</text>
        <text x="400" y="48" fontSize="10" fill={INK3}>胞外</text>
        <rect x="400" y="176" width="300" height="20" fill="none" stroke={INK} strokeWidth="1.4" />
        <line x1="400" y1="186" x2="700" y2="186" stroke={HAIR} strokeWidth="1" strokeDasharray="5 4" />
        <text x="400" y="222" fontSize="10" fill={INK3}>胞内</text>

        <circle cx="468" cy="280" r="34" fill="none" stroke={INK} strokeWidth="1.4" />
        <path d="M 452 270 q 10 -12 20 0 q 10 12 20 0" fill="none" stroke={INK} strokeWidth="1.4" />
        <path d="M 488 258 l 12 -8" stroke={CINNABAR} strokeWidth="2" />
        <text x="504" y="246" fontSize="10" fill={CINNABAR}>RR</text>
        <text x="468" y="330" textAnchor="middle" fontSize="10" fill={INK3}>已折叠蛋白</text>

        <rect x="536" y="176" width="10" height="20" fill="none" stroke={INK} strokeWidth="1.3" />
        <rect x="558" y="176" width="10" height="20" fill="none" stroke={INK} strokeWidth="1.3" />
        <text x="552" y="168" textAnchor="middle" fontSize="9.5" fill={INK3}>TatA / TatBC</text>

        <path d="M 552 200 L 552 144" stroke={INK3} strokeWidth="1.6" markerEnd="url(#sec-tat-arrow)" />
        <path d="M 568 138 l 14 -7" stroke={CINNABAR} strokeWidth="1.6" />
        <text x="586" y="128" fontSize="10" fill={CINNABAR}>切信号肽</text>
        <circle cx="588" cy="110" r="24" fill="none" stroke={INK} strokeWidth="1.4" />
        <path d="M 574 104 q 8 -8 16 0 q 8 8 16 0" fill="none" stroke={INK} strokeWidth="1.2" />
        <text x="588" y="152" textAnchor="middle" fontSize="10" fill={INK3}>折叠状态不变</text>

        <line x1="40" y1="344" x2="720" y2="344" stroke={HAIR} strokeWidth="1" />
        <text x="40" y="366" fontSize="10.5" fill={INK3}>分叉点：蛋白在胞内折没折好——没折好走 Sec，已折好走 Tat；选错途径，产物会堵在膜上或被降解。</text>
      </svg>
    </FigureFrame>
  );
}

/** 包涵体：从破碎到复性的五步与失败分支 */
function InclusionRefold() {
  const steps = [
    { title: "① 收菌 · 破碎", lines: ["超声或高压", "上清 / 沉淀分开"] },
    { title: "② 离心 · 洗涤", lines: ["1% Triton X-100", "或 2 M 尿素"] },
    { title: "③ 溶解", lines: ["6–8 M 尿素", "或 6 M 盐酸胍", "加 DTT 还原"] },
    { title: "④ 复性", lines: ["0.01–0.1 mg/mL", "4 ℃，pH 7.5–8.5", "GSH / GSSG", "12–24 h"] },
    { title: "⑤ 可溶 · 纯化", lines: ["可溶、有活性", "再走亲和", "或离子交换"] },
  ];
  return (
    <FigureFrame
      id="inclusion-refold"
      title="包涵体：从沉淀到复性的路径"
      note="包涵体是表达了却折错，不是没表达。洗涤去杂、变性剂溶解、低浓度复性是三步主线；复性浓度过高会重新聚成无活性沉淀。"
    >
      <svg viewBox="0 0 760 360" role="img" aria-label="包涵体洗涤、溶解与复性流程示意">
        {steps.map((step, index) => {
          const x = 40 + index * 146;
          const highlight = index === 3;
          return (
            <g key={step.title}>
              <rect x={x} y="48" width="130" height="104" fill="none" stroke={highlight ? CINNABAR : INK} strokeWidth={highlight ? 1.5 : 1.2} />
              <text x={x + 65} y="70" textAnchor="middle" fontSize="10.5" fill={highlight ? CINNABAR : INK}>{step.title}</text>
              {step.lines.map((line, lineIndex) => (
                <text key={line} x={x + 65} y={90 + lineIndex * 17} textAnchor="middle" fontSize="9.5" fill={INK3}>{line}</text>
              ))}
              {index < 4 ? (
                <g>
                  <path d={`M ${x + 132} 98 L ${x + 142} 98`} stroke={INK3} strokeWidth="1.1" fill="none" />
                  <path d={`M ${x + 142} 98 l -6 -3 v 6 z`} fill={INK3} />
                </g>
              ) : null}
            </g>
          );
        })}

        <path d="M 569 152 L 569 186" stroke={CINNABAR} strokeWidth="1.2" fill="none" strokeDasharray="4 3" />
        <path d="M 569 186 l -4 -8 h 8 z" fill={CINNABAR} />
        <rect x="470" y="194" width="198" height="66" fill="none" stroke={CINNABAR} strokeWidth="1.2" strokeDasharray="5 3" />
        <text x="569" y="216" textAnchor="middle" fontSize="10.5" fill={CINNABAR}>仍聚集 / 无活性</text>
        <text x="569" y="236" textAnchor="middle" fontSize="9.5" fill={INK3}>降浓度、换氧化还原对</text>
        <text x="569" y="252" textAnchor="middle" fontSize="9.5" fill={INK3}>加 0.5–1 M 精氨酸或伴侣</text>

        <text x="40" y="294" fontSize="10.5" fill={INK3}>复性不是「稀释就完事」：浓度、pH、温度与氧化还原对同时决定二硫键能不能配对。</text>
        <text x="40" y="318" fontSize="10.5" fill={INK3}>有些蛋白即使重新折叠后仍不能表现活性——失败分支要预留。</text>
        <text x="40" y="342" fontSize="10.5" fill={INK3}>判断成功：可溶上清 + 活性测定 + 非还原胶看二硫键状态，三者同时成立。</text>
      </svg>
    </FigureFrame>
  );
}

function Cas9Structure() {
  return (
    <FigureFrame
      id="cas9"
      title="SpCas9–sgRNA–DNA 三元复合物"
      note="PDB 4OO8（2.5 Å）为 SpCas9–sgRNA–靶 DNA 结构；本图为结构域示意，不是按原子坐标绘制。"
    >
      <svg viewBox="0 0 760 400" role="img" aria-label="SpCas9 结构域与切割位点示意">
        <ellipse cx="250" cy="120" rx="140" ry="64" fill="none" stroke={INK} strokeWidth="1.6" />
        <text x="250" y="112" textAnchor="middle" fontSize="15" fill={INK}>REC 识别叶</text>
        <text x="250" y="134" textAnchor="middle" fontSize="11" fill={INK3}>识别 sgRNA–DNA 异源双链</text>

        <ellipse cx="530" cy="120" rx="118" ry="64" fill="none" stroke={INK} strokeWidth="1.6" />
        <text x="530" y="112" textAnchor="middle" fontSize="15" fill={INK}>NUC 核酸酶叶</text>
        <text x="530" y="134" textAnchor="middle" fontSize="11" fill={INK3}>HNH 与 RuvC 两个切口</text>

        <circle cx="452" cy="208" r="25" fill="var(--paper-3)" stroke={CINNABAR} strokeWidth="1.6" />
        <text x="452" y="212" textAnchor="middle" fontSize="11" fill={CINNABAR}>HNH</text>
        <circle cx="332" cy="208" r="25" fill="var(--paper-3)" stroke={CINNABAR} strokeWidth="1.6" />
        <text x="332" y="212" textAnchor="middle" fontSize="11" fill={CINNABAR}>RuvC</text>

        <path d="M 250 184 C 300 230, 400 230, 452 208" fill="none" stroke={INK} strokeWidth="1.4" strokeDasharray="5 4" />
        <path d="M 250 184 C 290 250, 300 250, 332 208" fill="none" stroke={INK} strokeWidth="1.4" strokeDasharray="5 4" />
        <text x="205" y="250" fontSize="11" fill={INK3}>sgRNA</text>

        <line x1="60" y1="292" x2="700" y2="292" stroke={INK} strokeWidth="2" />
        <line x1="60" y1="318" x2="700" y2="318" stroke={INK} strokeWidth="2" />
        {Array.from({ length: 33 }, (_, i) => (
          <line key={i} x1={62 + i * 19.4} y1="292" x2={62 + i * 19.4} y2="318" stroke={HAIR} strokeWidth="1" />
        ))}
        <text x="60" y="340" fontSize="11" fill={INK3}>非靶链</text>
        <text x="60" y="282" fontSize="11" fill={INK3}>靶链（sgRNA 20 nt 互补配对）</text>

        <line x1="452" y1="233" x2="452" y2="292" stroke={CINNABAR} strokeWidth="1.6" />
        <line x1="332" y1="233" x2="332" y2="318" stroke={CINNABAR} strokeWidth="1.6" />
        <text x="470" y="268" fontSize="11" fill={CINNABAR}>HNH 切靶链</text>
        <text x="245" y="268" fontSize="11" fill={CINNABAR} textAnchor="end">RuvC 切非靶链</text>

        <rect x="620" y="282" width="58" height="46" fill="none" stroke={CINNABAR} strokeDasharray="4 3" />
        <text x="649" y="312" textAnchor="middle" fontSize="11" fill={CINNABAR}>PAM</text>
        <text x="649" y="352" textAnchor="middle" fontSize="10.5" fill={INK3}>5′-NGG-3′</text>
      </svg>
    </FigureFrame>
  );
}

function TaqStructure() {
  return (
    <FigureFrame
      id="taq"
      title="Taq 聚合酶的结构域与耐热性"
      note="PDB 1TAQ（2.4 Å）为 Taq 聚合酶结构；最适 75–80 ℃、95 ℃ 半衰期约 40 min，数值按厂商手册。"
    >
      <svg viewBox="0 0 760 400" role="img" aria-label="Taq 聚合酶结构域示意">
        <circle cx="190" cy="190" r="62" fill="var(--paper-3)" stroke={INK} strokeWidth="1.5" />
        <text x="190" y="185" textAnchor="middle" fontSize="14" fill={INK}>5′→3′</text>
        <text x="190" y="204" textAnchor="middle" fontSize="12" fill={INK}>外切酶域</text>

        <rect x="300" y="145" width="190" height="120" rx="26" fill="var(--paper-3)" stroke={INK} strokeWidth="1.6" />
        <text x="395" y="196" textAnchor="middle" fontSize="15" fill={INK}>手掌 palm</text>
        <text x="395" y="218" textAnchor="middle" fontSize="11" fill={INK3}>三瓣结构围出催化中心</text>

        <circle cx="330" cy="118" r="26" fill="none" stroke={INK} strokeWidth="1.4" />
        <circle cx="382" cy="104" r="26" fill="none" stroke={INK} strokeWidth="1.4" />
        <circle cx="436" cy="118" r="26" fill="none" stroke={INK} strokeWidth="1.4" />
        <text x="395" y="76" textAnchor="middle" fontSize="13" fill={INK}>手指 fingers</text>

        <path d="M 490 150 C 540 150, 548 210, 500 245" fill="none" stroke={INK} strokeWidth="1.6" />
        <text x="536" y="135" textAnchor="middle" fontSize="13" fill={INK}>拇指 thumb</text>

        <line x1="600" y1="240" x2="700" y2="240" stroke={INK} strokeWidth="1.4" />
        <text x="600" y="262" fontSize="11" fill={INK3}>模板链 3′→5′</text>
        <circle cx="560" cy="222" r="9" fill={CINNABAR} />
        <text x="552" y="200" fontSize="11" fill={CINNABAR}>dNTP</text>

        <line x1="300" y1="300" x2="560" y2="300" stroke={HAIR} strokeWidth="1.2" />
        <text x="300" y="330" fontSize="11.5" fill={INK3}>耐热来自结构紧凑与离子键网络；最适 pH 8.0–8.5（Tris，25 ℃），Mg²⁺ 1.5–2 mM。</text>
      </svg>
    </FigureFrame>
  );
}

function GfpStructure() {
  return (
    <FigureFrame
      id="gfp"
      title="GFP 的 β-桶与发色团"
      note="PDB 1EMA（1.9 Å）为 GFP 结构；发色团由 Ser65–Tyr66–Gly67 形成，激发峰约 395/475 nm，发射峰约 508 nm。"
    >
      <svg viewBox="0 0 760 400" role="img" aria-label="GFP β-桶与发色团示意">
        <ellipse cx="360" cy="205" rx="120" ry="150" fill="var(--paper-3)" stroke={INK} strokeWidth="1.8" />
        {Array.from({ length: 11 }, (_, i) => {
          const x = 250 + (i + 1) * 20;
          return (
            <path
              key={i}
              d={`M ${x} 62 C ${x + 8} 140, ${x - 8} 270, ${x} 348`}
              fill="none"
              stroke={HAIR}
              strokeWidth="1.2"
            />
          );
        })}
        <rect x="338" y="190" width="44" height="28" rx="6" fill={CINNABAR} opacity="0.85" />
        <text x="360" y="250" textAnchor="middle" fontSize="11" fill={CINNABAR}>发色团</text>
        <line x1="360" y1="188" x2="360" y2="118" stroke={HAIR} strokeWidth="1.2" />
        <text x="360" y="108" textAnchor="middle" fontSize="11" fill={INK3}>Ser65–Tyr66–Gly67</text>

        <text x="510" y="150" fontSize="12.5" fill={INK}>11 条 β 折叠围成桶</text>
        <text x="510" y="174" fontSize="11.5" fill={INK3}>发色团在桶中央，受保护</text>
        <text x="510" y="198" fontSize="11.5" fill={INK3}>激发 395 / 475 nm</text>
        <text x="510" y="222" fontSize="11.5" fill={INK3}>发射 508 nm</text>
        <line x1="485" y1="155" x2="420" y2="190" stroke={HAIR} strokeWidth="1.2" />
      </svg>
    </FigureFrame>
  );
}

function EditPaths() {
  return (
    <FigureFrame
      id="edit-paths"
      title="双链断裂后的两条修复路径"
      note="NHEJ 快、易产生小插入缺失；HDR 需要供体模板，只在 S/G2 期活跃。两条路径竞争，结果由修复方式决定，不由切割本身决定。"
    >
      <svg viewBox="0 0 760 400" role="img" aria-label="Cas9 切割后 NHEJ 与 HDR 两条修复路径示意">
        <line x1="50" y1="200" x2="250" y2="200" stroke={INK} strokeWidth="2.2" />
        <line x1="50" y1="222" x2="250" y2="222" stroke={INK} strokeWidth="2.2" />
        <line x1="152" y1="188" x2="152" y2="234" stroke={CINNABAR} strokeWidth="1.6" strokeDasharray="4 3" />
        <text x="152" y="176" textAnchor="middle" fontSize="11.5" fill={CINNABAR}>Cas9 双链断裂</text>
        <text x="50" y="250" fontSize="11" fill={INK3}>PAM 上游 3 bp</text>

        <path d="M 250 200 C 300 200, 320 130, 372 122" fill="none" stroke={INK} strokeWidth="1.4" />
        <path d="M 372 122 l -9 -4 v 8 z" fill={INK} />
        <path d="M 250 222 C 300 222, 320 292, 372 300" fill="none" stroke={INK} strokeWidth="1.4" />
        <path d="M 372 300 l -9 -4 v 8 z" fill={INK} />

        <rect x="380" y="52" width="330" height="140" fill="var(--paper-3)" stroke={INK} strokeWidth="1.3" />
        <text x="400" y="80" fontSize="14" fill={INK}>NHEJ　非同源末端连接</text>
        <text x="400" y="108" fontSize="11.5" fill={INK3}>断端直接接上，不依赖模板</text>
        <text x="400" y="132" fontSize="11.5" fill={INK3}>常留下 1–10 bp 插入或缺失</text>
        <text x="400" y="156" fontSize="11.5" fill={CINNABAR}>移码 → 基因敲除</text>
        <text x="400" y="178" fontSize="11" fill={INK3}>占多数，周期短</text>

        <rect x="380" y="238" width="330" height="140" fill="var(--paper-3)" stroke={INK} strokeWidth="1.3" />
        <text x="400" y="266" fontSize="14" fill={INK}>HDR　同源定向修复</text>
        <text x="400" y="294" fontSize="11.5" fill={INK3}>需要供体模板：ssODN 或同源臂质粒</text>
        <text x="400" y="318" fontSize="11.5" fill={INK3}>同源臂 30–100 nt（ssODN）或 0.5–1 kb</text>
        <text x="400" y="342" fontSize="11.5" fill={CINNABAR}>精确替换 → 敲入或改碱基</text>
        <text x="400" y="364" fontSize="11" fill={INK3}>只在 S/G2 期活跃，效率低于 NHEJ</text>
      </svg>
    </FigureFrame>
  );
}

function RnaiPathway() {
  return (
    <FigureFrame
      id="rnai"
      title="RNA 干扰：从双链 RNA 到靶 mRNA 降解"
      note="Dicer 把长双链 RNA 切成 21–23 nt 的 siRNA；RISC 保留一条引导链，按种子区（第 2–8 位）找靶，切割后 mRNA 被降解。"
    >
      <svg viewBox="0 0 760 360" role="img" aria-label="RNA 干扰通路示意">
        <line x1="50" y1="160" x2="180" y2="160" stroke={INK} strokeWidth="2" />
        <line x1="50" y1="182" x2="180" y2="182" stroke={INK} strokeWidth="2" />
        <text x="115" y="140" textAnchor="middle" fontSize="11.5" fill={INK}>长双链 RNA</text>

        <circle cx="238" cy="171" r="34" fill="var(--paper-3)" stroke={CINNABAR} strokeWidth="1.5" />
        <text x="238" y="176" textAnchor="middle" fontSize="12" fill={CINNABAR}>Dicer</text>
        <path d="M 190 171 l 12 -5 v 10 z" fill={CINNABAR} />

        <line x1="292" y1="164" x2="350" y2="164" stroke={INK} strokeWidth="2" />
        <line x1="292" y1="178" x2="350" y2="178" stroke={INK} strokeWidth="2" />
        <text x="321" y="146" textAnchor="middle" fontSize="11" fill={INK3}>siRNA 21–23 nt</text>

        <circle cx="424" cy="171" r="42" fill="none" stroke={INK} strokeWidth="1.4" />
        <text x="424" y="176" textAnchor="middle" fontSize="12" fill={INK}>RISC</text>
        <text x="424" y="230" textAnchor="middle" fontSize="11" fill={INK3}>保留引导链</text>

        <line x1="474" y1="171" x2="700" y2="171" stroke={INK} strokeWidth="2.2" />
        <text x="596" y="150" textAnchor="middle" fontSize="11.5" fill={INK}>靶 mRNA</text>
        <line x1="556" y1="158" x2="556" y2="184" stroke={CINNABAR} strokeWidth="1.6" />
        <text x="556" y="204" textAnchor="middle" fontSize="11" fill={CINNABAR}>切割</text>

        <line x1="590" y1="236" x2="640" y2="236" stroke={HAIR} strokeWidth="2" strokeDasharray="4 5" />
        <line x1="660" y1="252" x2="700" y2="252" stroke={HAIR} strokeWidth="2" strokeDasharray="4 5" />
        <text x="645" y="286" textAnchor="middle" fontSize="11" fill={INK3}>片段被降解</text>
        <text x="424" y="270" textAnchor="middle" fontSize="10.5" fill={INK3}>种子区第 2–8 位决定脱靶</text>
      </svg>
    </FigureFrame>
  );
}

function Chromatography() {
  const peak = (x: number, h: number) =>
    `M ${x - 26} 330 C ${x - 14} 330, ${x - 12} ${330 - h}, ${x} ${330 - h} C ${x + 12} ${330 - h}, ${x + 14} 330, ${x + 26} 330`;
  return (
    <FigureFrame
      id="chromatography"
      title="离子交换与凝胶过滤的分离逻辑"
      note="离子交换按电荷差异、用盐梯度洗脱；凝胶过滤按分子大小、大分子先出柱。两张峰图都是示意，不按实际柱效绘制。"
    >
      <svg viewBox="0 0 760 400" role="img" aria-label="离子交换与凝胶过滤峰图示意">
        <text x="30" y="34" fontSize="13" fill={INK}>IEX　离子交换</text>
        <rect x="52" y="54" width="46" height="120" fill="none" stroke={INK} strokeWidth="1.3" />
        {Array.from({ length: 8 }, (_, i) => (
          <circle key={i} cx={64 + (i % 2) * 22} cy={78 + Math.floor(i / 2) * 24} r="4" fill={i < 4 ? CINNABAR : INK3} />
        ))}
        <text x="110" y="90" fontSize="10.5" fill={INK3}>带负电蛋白结合</text>
        <text x="110" y="112" fontSize="10.5" fill={INK3}>0 → 1 M NaCl 洗脱</text>

        <line x1="40" y1="330" x2="350" y2="330" stroke={INK} strokeWidth="1.4" />
        <line x1="40" y1="330" x2="40" y2="210" stroke={INK} strokeWidth="1.4" />
        <path d="M 40 322 L 350 232" fill="none" stroke={HAIR} strokeWidth="1.2" strokeDasharray="5 4" />
        <text x="330" y="224" textAnchor="end" fontSize="10" fill={INK3}>盐浓度</text>
        <path d={peak(140, 44)} fill="none" stroke={CINNABAR} strokeWidth="1.8" />
        <path d={peak(214, 82)} fill="none" stroke={CINNABAR} strokeWidth="1.8" />
        <path d={peak(288, 56)} fill="none" stroke={CINNABAR} strokeWidth="1.8" />
        <text x="195" y="360" textAnchor="middle" fontSize="10.5" fill={INK3}>洗脱体积 →</text>

        <text x="410" y="34" fontSize="13" fill={INK}>GFC　凝胶过滤</text>
        <rect x="432" y="54" width="46" height="120" fill="none" stroke={INK} strokeWidth="1.3" />
        {Array.from({ length: 12 }, (_, i) => (
          <circle key={i} cx={446 + (i % 3) * 12} cy={70 + Math.floor(i / 3) * 24} r="3" fill={HAIR} />
        ))}
        <text x="492" y="90" fontSize="10.5" fill={INK3}>大分子不进孔</text>
        <text x="492" y="112" fontSize="10.5" fill={INK3}>小分子进孔、后出</text>

        <line x1="420" y1="330" x2="730" y2="330" stroke={INK} strokeWidth="1.4" />
        <line x1="420" y1="330" x2="420" y2="210" stroke={INK} strokeWidth="1.4" />
        <path d={peak(500, 96)} fill="none" stroke={CINNABAR} strokeWidth="1.8" />
        <path d={peak(590, 54)} fill="none" stroke={CINNABAR} strokeWidth="1.8" />
        <text x="500" y="222" textAnchor="middle" fontSize="10.5" fill={CINNABAR}>目标二聚体</text>
        <text x="600" y="264" textAnchor="middle" fontSize="10.5" fill={INK3}>单体 / 盐</text>
        <text x="575" y="360" textAnchor="middle" fontSize="10.5" fill={INK3}>洗脱体积 →</text>
        <text x="380" y="386" textAnchor="middle" fontSize="10.5" fill={INK3}>先用亲和捕获，再用 IEX 中度纯化，最后 GFC 精纯并换缓冲液。</text>
      </svg>
    </FigureFrame>
  );
}

function Box({
  x,
  y,
  w,
  h,
  title,
  sub,
  tone,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub?: string;
  tone?: "mark" | "plain";
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="var(--paper-3)"
        stroke={tone === "mark" ? CINNABAR : INK}
        strokeWidth="1.2"
      />
      <text x={x + w / 2} y={sub ? y + h / 2 - 4 : y + h / 2 + 4} textAnchor="middle" fontSize="11.5" fill={INK}>
        {title}
      </text>
      {sub ? (
        <text x={x + w / 2} y={y + h / 2 + 15} textAnchor="middle" fontSize="10.5" fill={tone === "mark" ? CINNABAR : INK3}>
          {sub}
        </text>
      ) : null}
    </g>
  );
}

function Arrow({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return (
    <g>
      <line x1={x1} y1={y} x2={x2 - 8} y2={y} stroke={INK3} strokeWidth="1.2" />
      <path d={`M ${x2} ${y} l -9 -4 v 8 z`} fill={INK3} />
    </g>
  );
}

function ArrowV({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  const dir = y2 > y1 ? 1 : -1;
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2 - dir * 9} stroke={INK3} strokeWidth="1.2" />
      <path d={`M ${x} ${y2} l -4 ${-dir * 9} h 8 z`} fill={INK3} />
    </g>
  );
}

function MammalianCulture() {
  return (
    <FigureFrame
      id="mammalian-culture"
      title="HEK293 瞬时表达与 CHO 稳定株：两条工艺路线"
      note="看左右两条时间轴：左边几天收样、产量 0.1–1 g/L；右边要建株、要驯化，但 fed-batch 可到 3–10 g/L。糖型差异决定能不能直接做人用产品。"
    >
      <svg viewBox="0 0 760 360" role="img" aria-label="HEK293 瞬时表达与 CHO 稳定株流程对照">
        <text x="36" y="30" fontSize="13" fill={INK}>HEK293　瞬时表达</text>
        <Box x={36} y={48} w={300} h={46} title="质粒 + 转染试剂" sub="PEI / 脂质体，60%–80% 汇合" />
        <Arrow x1={186} x2={186} y={110} />
        <Box x={36} y={116} w={300} h={46} title="48–72 h 收样" sub="细胞内或上清" />
        <Arrow x1={186} x2={186} y={178} />
        <Box x={36} y={184} w={300} h={46} title="0.1–1 g/L" sub="3–7 天一轮" tone="mark" />
        <text x="36" y="258" fontSize="10.5" fill={INK3}>适合快速验证、病毒包装；批次间差异大，放大难。</text>

        <line x1="380" y1="24" x2="380" y2="330" stroke={HAIR} strokeWidth="1" strokeDasharray="4 5" />

        <text x="414" y="30" fontSize="13" fill={INK}>CHO　稳定株</text>
        <Box x={414} y={48} w={300} h={46} title="转染 + 筛选 2–4 周" sub="抗体或营养缺陷标记" />
        <Arrow x1={564} x2={564} y={110} />
        <Box x={414} y={116} w={300} h={46} title="单克隆 + 无血清驯化" sub="悬浮、降温 30–35 ℃" />
        <Arrow x1={564} x2={564} y={178} />
        <Box x={414} y={184} w={300} h={46} title="fed-batch 约 14 d" sub="3–10 g/L" tone="mark" />
        <text x="414" y="258" fontSize="10.5" fill={INK3}>适合生产；糖型以复杂型为主，需人源化改造。</text>

        <text x="380" y="300" textAnchor="middle" fontSize="10.5" fill={INK3}>产量不能跨路线外推：瞬时滴度高，不等于稳定株也高。</text>
      </svg>
    </FigureFrame>
  );
}

function BevsCycle() {
  return (
    <FigureFrame
      id="bevs-cycle"
      title="杆状病毒生活史与 Bac-to-Bac 建株"
      note="左边是病毒在虫体内的两条出路：出芽病毒负责细胞间扩散，包涵体负责口服感染与环境存活。右边是实验室路线：先在大肠杆菌里转座，再转染昆虫细胞，省去空斑纯化。"
    >
      <svg viewBox="0 0 760 380" role="img" aria-label="杆状病毒生活史与 Bac-to-Bac 流程">
        <text x="30" y="30" fontSize="13" fill={INK}>病毒生活史</text>
        <Box x={30} y={48} w={160} h={54} title="出芽病毒 BV" sub="细胞间扩散" />
        <Arrow x1={194} x2={214} y={75} />
        <Box x={216} y={48} w={160} h={54} title="核内复制" sub="核衣壳装配" />
        <ArrowV x={296} y1={104} y2={114} />
        <Box x={216} y={114} w={160} h={54} title="包涵体 OB" sub="多角体蛋白包裹" />
        <Arrow x1={214} x2={194} y={141} />
        <Box x={30} y={114} w={160} h={54} title="幼虫口服感染" sub="碱解释放" />
        <ArrowV x={110} y1={112} y2={104} />
        <text x="30" y="196" fontSize="10.5" fill={INK3}>Sf9 / Sf21 / High Five，27 ℃，不需 CO₂。</text>

        <line x1="400" y1="24" x2="400" y2="350" stroke={HAIR} strokeWidth="1" strokeDasharray="4 5" />

        <text x="424" y="30" fontSize="13" fill={INK}>Bac-to-Bac</text>
        <Box x={424} y={48} w={300} h={44} title="pFastBac + 目的基因" sub="polyhedrin / p10 启动子" />
        <ArrowV x={574} y1={92} y2={104} />
        <Box x={424} y={104} w={300} h={44} title="DH10Bac 转座" sub="Tn7 定点插入 bacmid" />
        <ArrowV x={574} y1={148} y2={160} />
        <Box x={424} y={160} w={300} h={44} title="重组 bacmid" sub="蓝白斑筛选" />
        <ArrowV x={574} y1={204} y2={216} />
        <Box x={424} y={216} w={300} h={44} title="转染 Sf9 → P1" sub="空斑或 qPCR 测滴度" tone="mark" />
        <text x="424" y="286" fontSize="10.5" fill={INK3}>P1–P3 扩增，传代过多会降低滴度；MOI 0.1–10，48–96 h 收样。</text>
      </svg>
    </FigureFrame>
  );
}

function TransgeneRoutes() {
  return (
    <FigureFrame
      id="transgene-routes"
      title="转基因动物的三条路线"
      note="三列从左到右依次是：直接注射受精卵前核、在 ES 细胞里先做同源重组、把体细胞核移进去核卵。看每列底部的效率与「是否定点」，这决定后续要筛多少动物。"
    >
      <svg viewBox="0 0 760 400" role="img" aria-label="原核注射、ES 打靶与核移植三条路线">
        {[
          {
            x: 24,
            title: "原核显微注射",
            steps: ["受精卵前核", "注射 1–5 ng/μL", "随机整合", "移植代孕"],
            metric: "整合 1%–5%",
            note: "首代可筛；整合位点与拷贝数随机",
          },
          {
            x: 258,
            title: "ES 细胞打靶",
            steps: ["打靶载体", "同源重组 10⁻⁶–10⁻⁴", "筛选 ES 克隆", "注入囊胚 → 嵌合体"],
            metric: "定点整合",
            note: "需要 1–2 代交配才能得到纯合",
          },
          {
            x: 492,
            title: "体细胞核移植",
            steps: ["供体体细胞", "转入去核卵", "激活与培养", "移植代孕"],
            metric: "效率低、克隆",
            note: "核重编程不完全，发育异常多",
          },
        ].map((col) => (
          <g key={col.title}>
            <rect x={col.x} y="34" width="220" height="300" fill="none" stroke={HAIR} strokeWidth="1.1" />
            <text x={col.x + 110} y="58" textAnchor="middle" fontSize="12.5" fill={INK}>{col.title}</text>
            {col.steps.map((step, index) => (
              <g key={step}>
                <rect x={col.x + 20} y={76 + index * 56} width="180" height="40" fill="var(--paper-3)" stroke={INK} strokeWidth="1" />
                <text x={col.x + 110} y={101 + index * 56} textAnchor="middle" fontSize="10.5" fill={INK}>{step}</text>
              </g>
            ))}
            <text x={col.x + 110} y="318" textAnchor="middle" fontSize="11" fill={CINNABAR}>{col.metric}</text>
          </g>
        ))}
        <text x="380" y="364" textAnchor="middle" fontSize="10.5" fill={INK3}>Cre/loxP 条件敲除可加在任一路线上；先看「要不要定点」，再选路线。</text>
      </svg>
    </FigureFrame>
  );
}

function GeneTherapyVectors() {
  const rows = [
    { y: 74, name: "LNP", cap: "无硬上限", len: 330, flux: "瞬时", integ: "否", redose: "可" },
    { y: 150, name: "AAV", cap: "4.7 kb", len: 160, flux: "长期", integ: "多数不整合", redose: "难" },
    { y: 226, name: "慢病毒", cap: "8–10 kb", len: 300, flux: "长期", integ: "随机整合", redose: "一次" },
  ];
  return (
    <FigureFrame
      id="gene-therapy-vectors"
      title="三个递送平台的容量与表达特征"
      note="先看横向容量条：AAV 最小、慢病毒居中、LNP 没有硬性包装上限。再看右侧三列：表达是瞬时还是长期、是否整合、能不能重复给药，这三项决定适应证。"
    >
      <svg viewBox="0 0 760 340" role="img" aria-label="LNP、AAV 与慢病毒的容量、表达时长与整合特征">
        <text x="30" y="38" fontSize="13" fill={INK}>包装容量</text>
        <text x="540" y="38" fontSize="11" fill={INK3}>表达</text>
        <text x="610" y="38" fontSize="11" fill={INK3}>整合</text>
        <text x="690" y="38" fontSize="11" fill={INK3}>再给药</text>
        {rows.map((row) => (
          <g key={row.name}>
            <text x="30" y={row.y + 16} fontSize="12.5" fill={INK}>{row.name}</text>
            <rect x="100" y={row.y} width={row.len} height="22" fill="none" stroke={CINNABAR} strokeWidth="1.3" />
            <text x={108 + row.len} y={row.y + 16} fontSize="10.5" fill={row.name === "AAV" ? CINNABAR : INK3}>{row.cap}</text>
            <text x="540" y={row.y + 16} fontSize="10.5" fill={INK3}>{row.flux}</text>
            <text x="610" y={row.y + 16} fontSize="10.5" fill={INK3}>{row.integ}</text>
            <text x="690" y={row.y + 16} fontSize="10.5" fill={INK3}>{row.redose}</text>
            <line x1="24" y1={row.y + 38} x2="736" y2={row.y + 38} stroke={HAIR} strokeWidth="0.8" />
          </g>
        ))}
        <text x="30" y="300" fontSize="10.5" fill={INK3}>4.7 kb 是含两端 ITR 的总容量；Cas9 加 sgRNA 常已占去大半。</text>
        <text x="30" y="320" fontSize="10.5" fill={INK3}>再给药：AAV 受预存抗体限制，慢病毒以一次为主；LNP 可重复但有免疫。</text>
      </svg>
    </FigureFrame>
  );
}

const RARE_CODONS = new Set(["AGA", "AGG", "CGA", "CUA", "AUA", "CCC", "GGA", "UCG"]);
const CODON_ROWS = [
  ["UUU", "UUC", "UUA", "UUG", "UCU", "UCC", "UCA", "UCG", "UAU", "UAC", "UAA", "UAG", "UGU", "UGC", "UGA", "UGG"],
  ["CUU", "CUC", "CUA", "CUG", "CCU", "CCC", "CCA", "CCG", "CAU", "CAC", "CAA", "CAG", "CGU", "CGC", "CGA", "CGG"],
  ["AUU", "AUC", "AUA", "AUG", "ACU", "ACC", "ACA", "ACG", "AAU", "AAC", "AAA", "AAG", "AGU", "AGC", "AGA", "AGG"],
  ["GUU", "GUC", "GUA", "GUG", "GCU", "GCC", "GCA", "GCG", "GAU", "GAC", "GAA", "GAG", "GGU", "GGC", "GGA", "GGG"],
];

function CodonMap() {
  return (
    <FigureFrame
      id="codon-map"
      title="密码子表与大肠杆菌稀有密码子"
      note="64 个密码子里，朱色标出大肠杆菌中 tRNA 供给偏少的几个。连续出现这类密码子会让核糖体停顿，优化时优先换掉它们，而不是把所有密码子都换成最高频的。"
    >
      <svg viewBox="0 0 760 440" role="img" aria-label="密码子表与稀有密码子标记">
        {CODON_ROWS.map((row, rowIndex) =>
          row.map((codon, colIndex) => {
            const rare = RARE_CODONS.has(codon);
            return (
              <g key={codon}>
                <rect
                  x={30 + colIndex * 44}
                  y={36 + rowIndex * 34}
                  width="42"
                  height="30"
                  fill={rare ? "rgba(156,43,34,0.10)" : "var(--paper-3)"}
                  stroke={rare ? CINNABAR : HAIR}
                  strokeWidth={rare ? 1.2 : 0.8}
                />
                <text
                  x={51 + colIndex * 44}
                  y={56 + rowIndex * 34}
                  textAnchor="middle"
                  fontSize="10.5"
                  fill={rare ? CINNABAR : INK}
                >
                  {codon}
                </text>
              </g>
            );
          }),
        )}
        <text x="30" y="196" fontSize="10.5" fill={INK3}>朱色：AGA / AGG / CGA / CUA / AUA / CCC / GGA / UCG，大肠杆菌中对应 tRNA 偏少。</text>

        <text x="30" y="240" fontSize="12" fill={INK}>优化前</text>
        <rect x="120" y="226" width="300" height="20" fill="none" stroke={INK} strokeWidth="1" />
        <rect x="120" y="226" width="186" height="20" fill="rgba(156,43,34,0.16)" stroke={CINNABAR} strokeWidth="1" />
        <text x="430" y="241" fontSize="10.5" fill={INK3}>CAI 0.62 · GC 38%</text>

        <text x="30" y="296" fontSize="12" fill={INK}>优化后</text>
        <rect x="120" y="282" width="300" height="20" fill="none" stroke={INK} strokeWidth="1" />
        <rect x="120" y="282" width="255" height="20" fill="rgba(156,43,34,0.16)" stroke={CINNABAR} strokeWidth="1" />
        <text x="430" y="297" fontSize="10.5" fill={INK3}>CAI 0.85 · GC 52%</text>

        <text x="30" y="346" fontSize="10.5" fill={INK3}>同义替换只改密码子分布，不改氨基酸序列；CAI 目标 0.8–0.9，GC 控制在 40%–60%。</text>
        <text x="30" y="368" fontSize="10.5" fill={INK3}>5′ 端二级结构、起始区与剪接位点也要一起看，单看 CAI 会改出新问题。</text>
        <text x="30" y="404" fontSize="10" fill={INK3}>读法：横排按第一碱基分组，U / C / A / G 各一行。</text>
      </svg>
    </FigureFrame>
  );
}

function DoubleCrossover() {
  return (
    <FigureFrame
      id="double-crossover"
      title="双交换把标记换进受体，两侧序列不动"
      note="看两个交叉点：它们把供体中间的一段换到受体上，而两个交叉点外侧的序列保持原样。单交换会切开分子、产生共整合，只有双交换才得到干净的替换。"
    >
      <svg viewBox="0 0 760 380" role="img" aria-label="双交换同源重组示意">
        <text x="30" y="52" fontSize="12" fill={INK}>供体</text>
        <line x1="100" y1="72" x2="700" y2="72" stroke={INK} strokeWidth="2.2" />
        <line x1="100" y1="90" x2="700" y2="90" stroke={INK} strokeWidth="2.2" />
        <rect x="330" y="64" width="90" height="34" fill="rgba(156,43,34,0.14)" stroke={CINNABAR} strokeWidth="1.3" />
        <text x="375" y="86" textAnchor="middle" fontSize="10.5" fill={CINNABAR}>标记</text>

        <text x="30" y="180" fontSize="12" fill={INK}>受体</text>
        <line x1="100" y1="200" x2="700" y2="200" stroke={INK} strokeWidth="2.2" />
        <line x1="100" y1="218" x2="700" y2="218" stroke={INK} strokeWidth="2.2" />

        {[290, 460].map((x, index) => (
          <g key={x}>
            <path d={`M ${x - 16} 96 L ${x + 16} 194`} stroke={CINNABAR} strokeWidth="1.4" />
            <path d={`M ${x + 16} 96 L ${x - 16} 194`} stroke={CINNABAR} strokeWidth="1.4" />
            <text
              x={index === 0 ? x - 24 : x + 24}
              y="156"
              textAnchor={index === 0 ? "end" : "start"}
              fontSize="10"
              fill={CINNABAR}
            >
              交换
            </text>
          </g>
        ))}

        <path d="M 290 250 C 290 276, 360 286, 380 292" fill="none" stroke={INK3} strokeWidth="1.2" />
        <path d="M 380 292 l -10 -3 v 7 z" fill={INK3} />
        <path d="M 460 250 C 460 276, 400 286, 380 292" fill="none" stroke={INK3} strokeWidth="1.2" />

        <text x="30" y="322" fontSize="12" fill={INK}>产物</text>
        <line x1="100" y1="336" x2="700" y2="336" stroke={INK} strokeWidth="2.2" />
        <rect x="330" y="322" width="90" height="28" fill="rgba(156,43,34,0.14)" stroke={CINNABAR} strokeWidth="1.3" />
        <text x="375" y="341" textAnchor="middle" fontSize="10" fill={CINNABAR}>标记</text>
        <text x="620" y="330" fontSize="10.5" fill={INK3}>两侧不变</text>
      </svg>
    </FigureFrame>
  );
}

function CrisprScreen() {
  return (
    <FigureFrame
      id="crispr-screen"
      title="全基因组 sgRNA 文库筛选"
      note="关键是低 MOI：多数细胞只进一个 sgRNA，表型才能归因到单个基因。最后一步不是看「有没有条带」，而是比对照与处理组的 sgRNA 计数：掉下去的是必需基因，升上来的是耐药或促生长。"
    >
      <svg viewBox="0 0 760 380" role="img" aria-label="sgRNA 文库筛选流程与富集缺失判读">
        {[
          { x: 24, t: "文库", s: "10⁴–10⁵ sgRNA" },
          { x: 172, t: "低 MOI 转导", s: "MOI < 0.3" },
          { x: 320, t: "药筛 3–7 d", s: "嘌呤霉素" },
          { x: 468, t: "分组处理", s: "对照 / 药物" },
          { x: 616, t: "测序计数", s: "NGS 读 sgRNA" },
        ].map((step) => (
          <g key={step.t}>
            <rect x={step.x} y="56" width="120" height="58" fill="var(--paper-3)" stroke={INK} strokeWidth="1.1" />
            <text x={step.x + 60} y="80" textAnchor="middle" fontSize="11" fill={INK}>{step.t}</text>
            <text x={step.x + 60} y="98" textAnchor="middle" fontSize="10" fill={INK3}>{step.s}</text>
          </g>
        ))}
        {[146, 294, 442, 590].map((x) => (
          <Arrow key={x} x1={x} x2={x + 22} y={85} />
        ))}

        <text x="60" y="170" fontSize="11.5" fill={INK}>缺失（dropout）</text>
        <line x1="60" y1="300" x2="330" y2="300" stroke={INK} strokeWidth="1.2" />
        {[46, 40, 33, 24, 14, 7].map((h, i) => (
          <rect key={i} x={70 + i * 40} y={300 - h * 2.2} width="20" height={h * 2.2} fill="rgba(156,43,34,0.22)" stroke={CINNABAR} strokeWidth="0.9" />
        ))}
        <text x="195" y="322" textAnchor="middle" fontSize="10" fill={INK3}>处理组 sgRNA 减少</text>

        <text x="430" y="170" fontSize="11.5" fill={INK}>富集（enrichment）</text>
        <line x1="430" y1="300" x2="700" y2="300" stroke={INK} strokeWidth="1.2" />
        {[7, 14, 24, 33, 40, 46].map((h, i) => (
          <rect key={i} x={440 + i * 40} y={300 - h * 2.2} width="20" height={h * 2.2} fill="rgba(156,43,34,0.22)" stroke={CINNABAR} strokeWidth="0.9" />
        ))}
        <text x="565" y="322" textAnchor="middle" fontSize="10" fill={INK3}>处理组 sgRNA 增加</text>

        <text x="380" y="356" textAnchor="middle" fontSize="10.5" fill={INK3}>先看文库覆盖度与对照相关性，再谈基因排序；两次独立筛选重复不上的不要报。</text>
      </svg>
    </FigureFrame>
  );
}

function WesternFlow() {
  return (
    <FigureFrame
      id="western-flow"
      title="Western blot 全流程与读膜要点"
      note="上半是七步流程，下半是膜上真正看到的东西：左侧分子量梯、中间目标带、底部内参。判断表达差异前先确认三件事——转膜均匀、曝光未饱和、内参同膜。"
    >
      <svg viewBox="0 0 760 400" role="img" aria-label="Western blot 流程与膜上条带判读">
        {[
          { x: 20, t: "样品裂解", s: "加还原剂" },
          { x: 138, t: "SDS-PAGE", s: "按分子量" },
          { x: 256, t: "转膜", s: "湿转 / 半干" },
          { x: 374, t: "封闭", s: "5% 脱脂奶" },
          { x: 492, t: "一抗", s: "4 ℃ 过夜" },
          { x: 610, t: "二抗-HRP", s: "室温 1 h" },
        ].map((step) => (
          <g key={step.t}>
            <rect x={step.x} y="40" width="110" height="52" fill="var(--paper-3)" stroke={INK} strokeWidth="1.1" />
            <text x={step.x + 55} y="62" textAnchor="middle" fontSize="10.5" fill={INK}>{step.t}</text>
            <text x={step.x + 55} y="80" textAnchor="middle" fontSize="10" fill={INK3}>{step.s}</text>
          </g>
        ))}
        <Arrow x1={130} x2={138} y={66} />
        <Arrow x1={248} x2={256} y={66} />
        <Arrow x1={366} x2={374} y={66} />
        <Arrow x1={484} x2={492} y={66} />
        <Arrow x1={602} x2={610} y={66} />

        <rect x="120" y="140" width="300" height="180" fill="var(--paper-3)" stroke={INK} strokeWidth="1.2" />
        <text x="130" y="132" fontSize="10.5" fill={INK3}>膜</text>
        {[
          { y: 170, label: "100", w: 18 },
          { y: 200, label: "70", w: 60 },
          { y: 230, label: "55", w: 40 },
          { y: 260, label: "40", w: 22 },
        ].map((band) => (
          <g key={band.label}>
            <text x="112" y={band.y + 4} textAnchor="end" fontSize="9.5" fill={INK3}>{band.label}</text>
            <rect x="140" y={band.y - 4} width={band.w} height="8" fill="rgba(34,26,17,0.55)" />
            <rect x="240" y={band.y - 4} width={band.w * 1.8} height="8" fill="rgba(34,26,17,0.72)" />
            <rect x="330" y={band.y - 4} width={band.w * 1.2} height="8" fill="rgba(34,26,17,0.62)" />
          </g>
        ))}
        <text x="270" y="292" textAnchor="middle" fontSize="10" fill={CINNABAR}>目标带</text>
        <text x="270" y="310" textAnchor="middle" fontSize="9.5" fill={INK3}>三泳道：对照 / 处理 / 处理</text>

        <text x="450" y="150" fontSize="11.5" fill={INK}>读膜三件事</text>
        <text x="450" y="178" fontSize="10.5" fill={INK3}>1. 内参同膜：GAPDH / β-actin</text>
        <text x="450" y="204" fontSize="10.5" fill={INK3}>2. 曝光未饱和：强带不发白</text>
        <text x="450" y="230" fontSize="10.5" fill={INK3}>3. 转膜均匀：梯带不歪</text>
        <text x="450" y="262" fontSize="10.5" fill={CINNABAR}>条带强弱 ≠ 蛋白量绝对值</text>
        <text x="450" y="288" fontSize="10" fill={INK3}>定量需标准曲线与同批对照</text>
      </svg>
    </FigureFrame>
  );
}

function QpcrMelt() {
  return (
    <FigureFrame
      id="qpcr-melt"
      title="扩增曲线与熔解曲线：产物到底特不特异"
      note="左图看 Ct：曲线越早越线，起始模板越多。右图看熔解峰：单一尖峰说明产物一致；低温小峰多是引物二聚体，双峰说明有非特异产物。熔解曲线不能替代测序。"
    >
      <svg viewBox="0 0 760 380" role="img" aria-label="qPCR 扩增曲线与熔解曲线判读">
        <text x="48" y="34" fontSize="12.5" fill={INK}>扩增曲线</text>
        <line x1="60" y1="310" x2="360" y2="310" stroke={INK} strokeWidth="1.3" />
        <line x1="60" y1="310" x2="60" y2="60" stroke={INK} strokeWidth="1.3" />
        <line x1="60" y1="170" x2="360" y2="170" stroke={HAIR} strokeWidth="1.2" strokeDasharray="5 4" />
        <text x="66" y="164" fontSize="9.5" fill={INK3}>阈值</text>
        {[
          { d: 0, color: INK, label: "Ct 22" },
          { d: 30, color: INK3, label: "Ct 26" },
          { d: 60, color: HAIR, label: "Ct 30" },
        ].map((curve) => (
          <path
            key={curve.label}
            d={`M 60 306 C ${100 + curve.d} 306, ${120 + curve.d} 300, ${150 + curve.d} 250 C ${180 + curve.d} 200, ${210 + curve.d} 130, ${300 + curve.d} 92`}
            fill="none"
            stroke={curve.color}
            strokeWidth="1.8"
          />
        ))}
        <text x="300" y="86" fontSize="9.5" fill={INK3}>Ct 22 / 26 / 30</text>
        <text x="210" y="334" textAnchor="middle" fontSize="10.5" fill={INK3}>循环数 →</text>
        <text x="34" y="190" textAnchor="middle" fontSize="10.5" fill={INK3} transform="rotate(-90 34 190)">荧光</text>

        <text x="430" y="34" fontSize="12.5" fill={INK}>熔解曲线（导数）</text>
        <line x1="440" y1="310" x2="730" y2="310" stroke={INK} strokeWidth="1.3" />
        <line x1="440" y1="310" x2="440" y2="60" stroke={INK} strokeWidth="1.3" />
        <path d="M 450 306 C 500 306, 530 300, 545 210 C 555 150, 565 120, 585 118 C 605 116, 615 150, 622 200 C 628 250, 640 300, 680 306" fill="none" stroke={CINNABAR} strokeWidth="1.8" />
        <path d="M 560 306 C 590 306, 600 292, 612 274 C 620 262, 630 262, 638 276 C 646 292, 656 306, 680 306" fill="none" stroke={INK3} strokeWidth="1.4" strokeDasharray="5 4" />
        <text x="585" y="104" textAnchor="middle" fontSize="9.5" fill={CINNABAR}>主峰（特异产物）</text>
        <text x="654" y="262" textAnchor="start" fontSize="9.5" fill={INK3}>低温小峰（二聚体）</text>
        <text x="585" y="334" textAnchor="middle" fontSize="10.5" fill={INK3}>温度 →</text>
        <text x="414" y="190" textAnchor="middle" fontSize="10.5" fill={INK3} transform="rotate(-90 414 190)">−dF/dT</text>

        <text x="60" y="364" fontSize="10" fill={INK3}>判读顺序：先看 NTC 有没有峰，再看单峰是否尖锐，最后看熔解温度是否与预期产物一致。</text>
      </svg>
    </FigureFrame>
  );
}

function OmicsLayers() {
  const rows = [
    {
      y: 44,
      left: "DNA",
      leftSub: "基因组",
      mid: "测序 / 芯片",
      midSub: "FASTQ → BAM → VCF",
      right: "有哪些序列与变异",
      rightSub: "位点、拷贝数、结构变异",
    },
    {
      y: 132,
      left: "RNA",
      leftSub: "转录组",
      mid: "RNA-seq / 芯片",
      midSub: "counts / TPM",
      right: "此刻哪些转录本、各多少",
      rightSub: "差异表达、剪接、融合",
    },
    {
      y: 220,
      left: "蛋白",
      leftSub: "蛋白组",
      mid: "LC-MS/MS / 抗体",
      midSub: "谱图 / 肽段",
      right: "实际有多少蛋白",
      rightSub: "丰度与翻译后修饰",
    },
  ];
  return (
    <FigureFrame
      id="omics-layers"
      title="三层组学：各答一个问题"
      note="从上到下是 DNA、RNA、蛋白三层：每层有自己的平台与数据形态。层与层之间可以不一致，mRNA 多不代表蛋白多；判断表达要回到具体那一层。"
    >
      <svg viewBox="0 0 760 330" role="img" aria-label="基因组、转录组、蛋白组三层对照">
        {rows.map((row) => (
          <g key={row.left}>
            <Box x={28} y={row.y} w={150} h={56} title={row.left} sub={row.leftSub} />
            <Arrow x1={178} x2={210} y={row.y + 28} />
            <Box x={210} y={row.y} w={230} h={56} title={row.mid} sub={row.midSub} />
            <Arrow x1={440} x2={470} y={row.y + 28} />
            <Box x={470} y={row.y} w={262} h={56} title={row.right} sub={row.rightSub} tone="mark" />
          </g>
        ))}
        <ArrowV x={103} y1={100} y2={132} />
        <text x="112" y="122" fontSize="10" fill={INK3}>转录</text>
        <ArrowV x={103} y1={188} y2={220} />
        <text x="112" y="210" fontSize="10" fill={INK3}>翻译</text>
        <text x="28" y="308" fontSize="10.5" fill={INK3}>同一基因在三层可以不一致；组学是「同时测很多」，不是「测得更准」。</text>
      </svg>
    </FigureFrame>
  );
}

function CellFreeFlow() {
  return (
    <FigureFrame
      id="cell-free-flow"
      title="无细胞表达：模板、反应与能量再生"
      note="模板进入裂解液后同时转录与翻译；能量再生决定反应能持续多久。批式靠初始底物，底物耗尽即停；连续交换用膜补底物、移除抑制物。"
    >
      <svg viewBox="0 0 760 330" role="img" aria-label="无细胞表达的模板、反应与能量再生流程">
        <Box x={30} y={50} w={150} h={64} title="模板" sub="质粒 / 线性 DNA" />
        <Arrow x1={180} x2={206} y={82} />
        <Box x={206} y={36} w={250} h={92} title="转录 + 翻译" sub="裂解液或纯化组分" tone="mark" />
        <Arrow x1={456} x2={486} y={82} />
        <Box x={486} y={50} w={200} h={64} title="目标蛋白" sub="可溶或带标签" />
        <ArrowV x={331} y1={128} y2={168} />
        <Box x={206} y={168} w={250} h={54} title="ATP / GTP 再生" sub="能量与氨基酸供给" />
        <text x="486" y="182" fontSize="10.5" fill={INK}>批式：底物耗尽即停</text>
        <text x="486" y="208" fontSize="10.5" fill={INK}>补料：延长反应时间</text>
        <text x="486" y="234" fontSize="10.5" fill={CINNABAR}>连续交换：膜补液 + 去抑制物</text>
        <text x="30" y="284" fontSize="10.5" fill={INK3}>放大靠膜面积与交换速率，不靠罐体积；模板稳定性与单位成本是主要瓶颈。</text>
      </svg>
    </FigureFrame>
  );
}

function PlantRegeneration() {
  const stages = [
    { x: 20, title: "外植体", sub: "无菌取材" },
    { x: 165, title: "愈伤", sub: "脱分化" },
    { x: 310, title: "芽", sub: "细胞分裂素偏高" },
    { x: 455, title: "根", sub: "生长素偏高" },
    { x: 600, title: "炼苗", sub: "降湿、减糖" },
  ];
  return (
    <FigureFrame
      id="plant-regeneration"
      title="植物再生：四段培养基与两次转换"
      note="从左到右：外植体先脱分化成愈伤，再在细胞分裂素偏高的条件下出芽，转到生长素偏高的条件生根，最后降湿减糖炼苗。选择剂要贯穿芽与根两段，逃逸芽仍需分子鉴定。"
    >
      <svg viewBox="0 0 760 300" role="img" aria-label="植物从外植体到炼苗的再生流程">
        {stages.map((stage, index) => (
          <g key={stage.title}>
            <Box x={stage.x} y={64} w={130} h={70} title={stage.title} sub={stage.sub} tone={index === 2 || index === 3 ? "mark" : "plain"} />
            {index < stages.length - 1 ? (
              <Arrow x1={stage.x + 130} x2={stages[index + 1].x} y={99} />
            ) : null}
          </g>
        ))}
        <text x="165" y="48" fontSize="10.5" fill={INK3}>脱分化</text>
        <text x="310" y="48" fontSize="10.5" fill={CINNABAR}>再分化（芽 → 根）</text>
        <rect x="310" y="160" width="275" height="24" fill="none" stroke={CINNABAR} strokeWidth="1.1" strokeDasharray="5 4" />
        <text x="447" y="176" textAnchor="middle" fontSize="10" fill={CINNABAR}>选择剂：芽与根两段持续筛选</text>
        <text x="20" y="222" fontSize="10.5" fill={INK3}>再生率由基因型与外植体类型决定；没有通用激素配方，只有可复现的记录。</text>
        <text x="20" y="248" fontSize="10.5" fill={INK3}>T0 可能是嵌合体，后代分离比会偏离；选择剂下长出的芽不等于已转化。</text>
      </svg>
    </FigureFrame>
  );
}

export function Figure({ id }: { id: FigureId }) {
  switch (id) {
    case "plasmid-puc18":
      return <PlasmidMap data={PLASMID_PUC18} />;
    case "plasmid-pbr322":
      return <PlasmidMap data={PLASMID_PBR322} />;
    case "lambda-genome":
      return <LambdaMap />;
    case "vector-capacity":
      return <CapacityChart />;
    case "plate-blue-white":
      return <BlueWhitePlate />;
    case "gel-migration":
      return <GelMigration />;
    case "restriction-site":
      return <RestrictionSite />;
    case "dna-ends":
      return <DnaEnds />;
    case "plasmid-general":
      return <PlasmidGeneral />;
    case "pcr-cycles":
      return <PcrCycles />;
    case "ligation-ends":
      return <LigationEnds />;
    case "overlap-assembly":
      return <OverlapAssembly />;
    case "ni-nta":
      return <NiNta />;
    case "yeast-factory":
      return <YeastFactory />;
    case "blot-transfer":
      return <BlotTransfer />;
    case "qpcr-curve":
      return <QpcrCurve />;
    case "sanger-ladder":
      return <SangerLadder />;
    case "illumina-sbs":
      return <IlluminaSbs />;
    case "nanopore":
      return <Nanopore />;
    case "yeast-two-hybrid":
      return <YeastTwoHybrid />;
    case "delivery-methods":
      return <DeliveryMethods />;
    case "ti-plasmid":
      return <TiPlasmid />;
    case "alpha-complement":
      return <AlphaComplement />;
    case "ssh-suppression":
      return <SshSuppression />;
    case "sec-tat":
      return <SecTat />;
    case "inclusion-refold":
      return <InclusionRefold />;
    case "struct-cas9":
      return <Cas9Structure />;
    case "struct-taq":
      return <TaqStructure />;
    case "struct-gfp":
      return <GfpStructure />;
    case "plasmid-pet28a":
      return <PlasmidMap data={PLASMID_PET28A} />;
    case "plasmid-px459":
      return <PlasmidMap data={PLASMID_PX459} />;
    case "edit-paths":
      return <EditPaths />;
    case "rnai-pathway":
      return <RnaiPathway />;
    case "chromatography":
      return <Chromatography />;
    case "mammalian-culture":
      return <MammalianCulture />;
    case "bevs-cycle":
      return <BevsCycle />;
    case "transgene-routes":
      return <TransgeneRoutes />;
    case "gene-therapy-vectors":
      return <GeneTherapyVectors />;
    case "codon-map":
      return <CodonMap />;
    case "double-crossover":
      return <DoubleCrossover />;
    case "crispr-screen":
      return <CrisprScreen />;
    case "western-flow":
      return <WesternFlow />;
    case "qpcr-melt":
      return <QpcrMelt />;
    case "omics-layers":
      return <OmicsLayers />;
    case "cell-free-flow":
      return <CellFreeFlow />;
    case "plant-regeneration":
      return <PlantRegeneration />;
  }
}
