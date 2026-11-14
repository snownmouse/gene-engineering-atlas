import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { DemoId } from "../data/types";
import type { ProcessDemo } from "../data/demos";
import { DEMO_BY_ID } from "../data/demos";

const TEMP_STEPS = [
  { value: 94, y: 78, note: "变性" },
  { value: 55, y: 150, note: "退火" },
  { value: 72, y: 222, note: "延伸" },
];

function PcrScene({ step }: { step: number }) {
  const split = step >= 1;
  const anneal = step >= 2;
  const extend = step >= 3;
  const cycles = step >= 4;
  const activeTemp = step === 1 ? 94 : step === 2 ? 55 : step >= 3 ? 72 : 0;

  return (
    <svg viewBox="0 0 760 300" role="img" aria-label="PCR 三步循环示意：引物与模板反向互补退火，新链从引物 3′ 端延伸">
      <g className="dm-scale">
        <line x1="72" y1="54" x2="72" y2="246" />
        {TEMP_STEPS.map((item) => {
          const now = activeTemp === item.value;
          return (
            <g key={item.value} className={now ? "" : "dm-dim"}>
              <line
                x1="64"
                y1={item.y}
                x2="80"
                y2={item.y}
                className={now ? "dm-red" : ""}
              />
              <text
                x="54"
                y={item.y + 4}
                textAnchor="end"
                className={now ? "dm-label dm-label--red" : "dm-label"}
              >
                {item.value}℃
              </text>
              <text x="90" y={item.y + 4} className="dm-label dm-label--faint">
                {item.note}
              </text>
            </g>
          );
        })}
      </g>

      <rect
        x="316"
        y={split ? 82 : 128}
        width="228"
        height={split ? 140 : 48}
        className="dm-target"
      />
      <text x="430" y="286" textAnchor="middle" className="dm-label">
        目标区段
      </text>

      {/* 上链 5′→3′ 向右；引物与它反向互补，画在链内侧、与链平行错开。 */}
      <g
        className="dm-move"
        style={{ transform: split ? "translateY(-34px)" : "none" }}
      >
        <line x1="196" y1="140" x2="624" y2="140" className="dm-ink" />
        <text x="182" y="144" textAnchor="end" className="dm-label dm-label--faint">
          5′
        </text>
        <text x="638" y="144" className="dm-label dm-label--faint">
          3′
        </text>
      </g>
      {/* 下链 3′→5′ 向右，即 5′ 在右端。 */}
      <g
        className="dm-move"
        style={{ transform: split ? "translateY(34px)" : "none" }}
      >
        <line x1="196" y1="160" x2="624" y2="160" className="dm-ink" />
        <text x="182" y="164" textAnchor="end" className="dm-label dm-label--faint">
          3′
        </text>
        <text x="638" y="164" className="dm-label dm-label--faint">
          5′
        </text>
      </g>

      {!split ? (
        <line
          x1="200"
          y1="150"
          x2="620"
          y2="150"
          className="dm-faint"
          strokeDasharray="3 7"
        />
      ) : (
        <text x="640" y="150" className="dm-label dm-label--red">
          氢键断开
        </text>
      )}

      {anneal ? (
        <g className="dm-fade">
          {/* 反向引物：贴在上链内侧，5′ 在右、3′ 在左，延伸方向朝左。 */}
          <line x1="504" y1="114" x2="544" y2="114" className="dm-red dm-thick" />
          <path d="M 504 114 l 10 -5 v 10 z" className="dm-red-fill" />
          <text x="552" y="104" className="dm-label dm-label--red">
            引物
          </text>
          {/* 正向引物：贴在下链内侧，5′ 在左、3′ 在右，延伸方向朝右。 */}
          <line x1="316" y1="186" x2="356" y2="186" className="dm-red dm-thick" />
          <path d="M 356 186 l -10 -5 v 10 z" className="dm-red-fill" />
          <text x="308" y="202" textAnchor="end" className="dm-label dm-label--red">
            引物
          </text>
        </g>
      ) : null}

      {extend ? (
        <g className="dm-fade">
          {/* 新链与引物同一条水平线：从引物 3′ 端（504 / 356）向模板另一端延伸。 */}
          <line x1="200" y1="114" x2="504" y2="114" className="dm-blue dm-thick" />
          <path d="M 200 114 l 10 -5 v 10 z" className="dm-blue-fill" />
          <line x1="356" y1="186" x2="620" y2="186" className="dm-blue dm-thick" />
          <path d="M 620 186 l -10 -5 v 10 z" className="dm-blue-fill" />
          <text x="430" y="96" textAnchor="middle" className="dm-label dm-label--blue">
            新链（5′→3′）
          </text>
        </g>
      ) : null}

      {cycles ? (
        <g className="dm-fade">
          <text x="676" y="60" textAnchor="middle" className="dm-big">
            2ⁿ⁻²
          </text>
          <text x="676" y="80" textAnchor="middle" className="dm-label">
            第 3 轮起
          </text>
          <text x="676" y="96" textAnchor="middle" className="dm-label dm-label--faint">
            目标长度产物
          </text>
          {[0, 0, 1, 2, 4, 8].map((value, index) => {
            // 前两轮只有长度未限定的产物；目标长度产物从第 3 轮才开始按 2^(n−2) 累积。
            const height = (value / 8) * 62;
            return height === 0 ? (
              <line
                key={`bar-${index}`}
                x1={626 + index * 18}
                y1="252"
                x2={637 + index * 18}
                y2="252"
                className="dm-faint"
                strokeDasharray="2 3"
              />
            ) : (
              <rect
                key={`bar-${index}`}
                x={626 + index * 18}
                y={252 - height}
                width="11"
                height={height}
                className="dm-faint-fill"
              />
            );
          })}
          <line x1="620" y1="252" x2="744" y2="252" className="dm-ink" />
          <text x="682" y="270" textAnchor="middle" className="dm-label dm-label--faint">
            前两轮产物
          </text>
          <text x="682" y="284" textAnchor="middle" className="dm-label dm-label--faint">
            长度未限定
          </text>
        </g>
      ) : null}
    </svg>
  );
}

const TOP_SEQ = ["T", "C", "G", "A", "G", "A", "A", "T", "T", "C", "G", "T", "A", "C", "G", "A", "T", "C", "G", "A", "T", "C", "G", "T"];
const BOTTOM_SEQ = ["A", "G", "C", "T", "C", "T", "T", "A", "A", "G", "C", "A", "T", "G", "C", "T", "A", "G", "C", "T", "A", "G", "C", "A"];
const SEQ_X = 148;
const SEQ_STEP = 20;

function baseX(index: number) {
  return SEQ_X + index * SEQ_STEP + SEQ_STEP / 2;
}

function DigestScene({ step }: { step: number }) {
  const cut = step >= 1;
  const split = step >= 2;
  const ready = step >= 3;
  const sealed = step >= 4;
  const leftShift = split ? -18 : 0;
  const rightShift = split ? 18 : 0;

  return (
    <svg viewBox="0 0 760 300" role="img" aria-label="限制酶切出黏端示意">
      <text x="132" y="44" className="dm-label dm-label--faint">
        5′
      </text>
      <text x="662" y="44" className="dm-label dm-label--faint">
        3′
      </text>

      <rect x={baseX(4) - 10} y="82" width="120" height="22" className="dm-site" />
      <text x={baseX(7)} y="72" textAnchor="middle" className="dm-label dm-label--red">
        GAATTC
      </text>

      <g
        className="dm-move"
        style={{ transform: `translateX(${leftShift}px)` }}
      >
        {TOP_SEQ.slice(0, split ? 5 : 24).map((base, index) => (
          <text
            key={`lt-${index}`}
            x={baseX(index)}
            y="100"
            textAnchor="middle"
            className="dm-base"
          >
            {base}
          </text>
        ))}
        {BOTTOM_SEQ.slice(0, split ? 9 : 24).map((base, index) => (
          <text
            key={`lb-${index}`}
            x={baseX(index)}
            y="138"
            textAnchor="middle"
            className="dm-base"
          >
            {base}
          </text>
        ))}
      </g>

      {split ? (
        <g
          className="dm-move dm-fade"
          style={{ transform: `translateX(${rightShift}px)` }}
        >
          {TOP_SEQ.slice(5).map((base, index) => (
            <text
              key={`rt-${index}`}
              x={baseX(index + 5)}
              y="100"
              textAnchor="middle"
              className="dm-base"
            >
              {base}
            </text>
          ))}
          {BOTTOM_SEQ.slice(9).map((base, index) => (
            <text
              key={`rb-${index}`}
              x={baseX(index + 9)}
              y="138"
              textAnchor="middle"
              className="dm-base"
            >
              {base}
            </text>
          ))}
        </g>
      ) : null}

      {!split ? (
        <>
          <line x1="196" y1="108" x2="604" y2="108" className="dm-faint" />
          <line x1="196" y1="130" x2="604" y2="130" className="dm-faint" />
        </>
      ) : null}

      {cut ? (
        <g className="dm-fade">
          <line
            x1={baseX(4) + 10}
            y1="88"
            x2={baseX(4) + 10}
            y2="112"
            className="dm-red dm-dash"
          />
          <line
            x1={baseX(8) + 10}
            y1="126"
            x2={baseX(8) + 10}
            y2="150"
            className="dm-red dm-dash"
          />
        </g>
      ) : null}

      <g className={`dm-enzyme${step <= 1 ? " dm-focus" : ""}`}>
        <rect x={baseX(6) - 34} y="18" width="78" height="30" rx="4" />
        <text x={baseX(6)} y="38" textAnchor="middle" className="dm-label">
          EcoRI
        </text>
        <path
          d={`M ${baseX(4) - 4} 48 l 8 0 l -4 10 z M ${baseX(8) - 4} 48 l 8 0 l -4 10 z`}
        />
      </g>

      {split ? (
        <g className="dm-fade">
          <rect
            x={baseX(5) + leftShift}
            y="112"
            width="80"
            height="30"
            className="dm-overhang"
          />
          <text
            x={baseX(7) + leftShift}
            y="166"
            textAnchor="middle"
            className="dm-label dm-label--red"
          >
            5′ 突出端
          </text>
          <text
            x={baseX(10) + rightShift}
            y="78"
            textAnchor="middle"
            className="dm-label dm-label--red"
          >
            5′ 突出端
          </text>
        </g>
      ) : null}

      {ready && !sealed ? (
        <g className="dm-fade">
          <path
            d="M 430 196 q 26 -14 52 0"
            className="dm-red dm-thin"
            fill="none"
          />
          <path d="M 482 196 l -8 -4 v 8 z" className="dm-red-fill" />
          <text x="456" y="220" textAnchor="middle" className="dm-label dm-label--red">
            同酶切出的末端可互补
          </text>
          <text x="456" y="242" textAnchor="middle" className="dm-label dm-label--faint">
            方向由两端位点决定
          </text>
        </g>
      ) : null}

      {sealed ? (
        <g className="dm-fade">
          <circle cx="430" cy="204" r="46" className="dm-ink" fill="none" />
          <path d="M 430 158 A 46 46 0 0 1 476 204" className="dm-red dm-thick" fill="none" />
          <text x="430" y="200" textAnchor="middle" className="dm-label">
            T4 连接酶
          </text>
          <text x="430" y="218" textAnchor="middle" className="dm-label">
            封口成环
          </text>
          <text x="430" y="282" textAnchor="middle" className="dm-label dm-label--red">
            切 → 配 → 接，同一条线
          </text>
        </g>
      ) : null}
    </svg>
  );
}

const GAP_LEFT = 301;
const GAP_RIGHT = 359;
const GAP_Y = 80;

function LigaseScene({ step }: { step: number }) {
  const meet = step >= 1;
  const seal = step >= 2;
  const closed = step >= 3;
  const insertY = closed ? 0 : meet ? 34 : 0;

  return (
    <svg viewBox="0 0 760 300" role="img" aria-label="连接反应示意">
      <circle cx="330" cy="160" r="85" className="dm-ink dm-thick" fill="none" />
      <path
        d={`M ${GAP_LEFT} ${GAP_Y} A 85 85 0 0 1 ${GAP_RIGHT} ${GAP_Y}`}
        className="dm-gap"
        style={{ opacity: closed ? 0 : 1 }}
        fill="none"
      />

      {!closed ? (
        <g
          className="dm-move"
          style={{ transform: `translateY(${insertY}px)` }}
        >
          <line x1="300" y1="46" x2="360" y2="46" className="dm-blue dm-thick" />
          <path d="M 300 46 l 8 -7 l 0 14 l 8 -7" className="dm-blue dm-thin" fill="none" />
          <path d="M 360 46 l -8 -7 l 0 14 l -8 -7" className="dm-blue dm-thin" fill="none" />
          <text x="330" y="30" textAnchor="middle" className="dm-label dm-label--blue">
            插入片段
          </text>
        </g>
      ) : null}

      {meet && !closed ? (
        <g className="dm-fade">
          <path
            d={`M ${GAP_LEFT} ${GAP_Y} l 8 -7 l 0 14 l 8 -7`}
            className="dm-red dm-thin"
            fill="none"
          />
          <path
            d={`M ${GAP_RIGHT} ${GAP_Y} l -8 -7 l 0 14 l -8 -7`}
            className="dm-red dm-thin"
            fill="none"
          />
          <text x="330" y="118" textAnchor="middle" className="dm-label dm-label--red">
            黏端互补配对
          </text>
        </g>
      ) : null}

      {seal && !closed ? (
        <g className="dm-fade">
          <circle cx="500" cy="70" r="19" className="dm-enzyme-ring" />
          <text x="500" y="75" textAnchor="middle" className="dm-label">
            T4
          </text>
          <path d="M 476 96 l -16 18 M 524 96 l 16 18" className="dm-red dm-thin" />
          <circle cx={GAP_LEFT + 4} cy={GAP_Y - 4} r="3" className="dm-red-fill" />
          <circle cx={GAP_RIGHT - 4} cy={GAP_Y - 4} r="3" className="dm-red-fill" />
          <text x="500" y="140" textAnchor="middle" className="dm-label dm-label--red">
            封口
          </text>
        </g>
      ) : null}

      {closed ? (
        <g className="dm-fade">
          <text x="330" y="156" textAnchor="middle" className="dm-label">
            重组质粒
          </text>
          <text x="330" y="180" textAnchor="middle" className="dm-label dm-label--faint">
            可自主复制
          </text>
        </g>
      ) : null}

      <text x="330" y="282" textAnchor="middle" className="dm-label dm-label--faint">
        插入 : 载体 ≈ 3 : 1（摩尔比）
      </text>
    </svg>
  );
}

function TransformScene({ step }: { step: number }) {
  const plasmid = [
    { x: 118, y: 92 },
    { x: 186, y: 132 },
    { x: 248, y: 158 },
    { x: 248, y: 148 },
    { x: 248, y: 148 },
  ][step] ?? { x: 248, y: 148 };

  const labels = [
    "冰浴 30 min",
    "冰浴 · DNA 贴附",
    "42℃ 热激 90 s",
    "冰浴 5 min → 复苏 1 h",
    "37℃ 倒置培养 12–16 h",
  ];

  return (
    <svg viewBox="0 0 760 300" role="img" aria-label="转化导入示意">
      <text x="60" y="42" className="dm-label dm-label--red">
        {labels[step]}
      </text>

      <text x="300" y="268" textAnchor="middle" className="dm-label dm-label--faint">
        感受态大肠杆菌
      </text>
      <ellipse cx="300" cy="160" rx="120" ry="75" className="dm-ink dm-thick" fill="none" />
      <ellipse cx="300" cy="160" rx="112" ry="67" className="dm-faint" fill="none" />

      {step === 2 ? (
        <g className="dm-fade">
          <path d="M 220 64 q 22 -18 44 0" className="dm-red dm-thin" fill="none" />
          <path d="M 260 54 q 22 -18 44 0" className="dm-red dm-thin" fill="none" />
          <path d="M 300 64 q 22 -18 44 0" className="dm-red dm-thin" fill="none" />
        </g>
      ) : null}

      <g
        className="dm-move"
        style={{ transform: `translate(${plasmid.x}px, ${plasmid.y}px)` }}
      >
        <circle cx={0} cy={0} r="11" className="dm-red dm-thick" fill="none" />
        <path
          d="M -5 -5 q 10 4 0 10"
          className="dm-red dm-thin"
          fill="none"
        />
        <text x={0} y={-20} textAnchor="middle" className="dm-label dm-label--red">
          质粒
        </text>
      </g>

      {step === 0 ? (
        <path
          d="M 136 106 q 40 22 46 34"
          className="dm-faint dm-thin dm-fade"
          fill="none"
          markerEnd="url(#dm-arrow)"
        />
      ) : step === 1 ? (
        <path
          d="M 200 140 q 22 10 38 16"
          className="dm-faint dm-thin dm-fade"
          fill="none"
          markerEnd="url(#dm-arrow)"
        />
      ) : null}

      {step >= 3 ? (
        <g className="dm-fade">
          <circle cx="306" cy="184" r="9" className="dm-red dm-thin" fill="none" />
          <circle cx="340" cy="140" r="9" className="dm-red dm-thin" fill="none" />
          <text x="330" y="222" textAnchor="middle" className="dm-label dm-label--red">
            质粒复制
          </text>
        </g>
      ) : null}

      {step === 4 ? (
        <g className="dm-fade">
          <circle cx="566" cy="160" r="84" className="dm-ink dm-thick" fill="none" />
          <circle cx="566" cy="160" r="76" className="dm-faint" fill="none" />
          {[
            [530, 128],
            [566, 116],
            [602, 130],
            [520, 162],
            [556, 152],
            [594, 164],
            [536, 196],
            [574, 200],
            [610, 188],
            [566, 172],
          ].map(([x, y], index) => (
            <circle
              key={index}
              cx={x}
              cy={y}
              r={index % 3 === 0 ? 5 : 3.5}
              className="dm-colony"
            />
          ))}
          <text x="566" y="268" textAnchor="middle" className="dm-label">
            抗生素平板 · 转化子
          </text>
        </g>
      ) : null}

      <defs>
        <marker
          id="dm-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" className="dm-faint-fill" />
        </marker>
      </defs>
    </svg>
  );
}

function Scene({ id, step }: { id: DemoId; step: number }) {
  if (id === "pcr") return <PcrScene step={step} />;
  if (id === "digest") return <DigestScene step={step} />;
  if (id === "ligase") return <LigaseScene step={step} />;
  return <TransformScene step={step} />;
}

/**
 * 站内嵌演示：默认收起，点开才挂载内容。
 * 打印时由 beforeprint 同步展开到最终态；不支持 beforeprint 的浏览器
 * 仍会打印一段静态摘要，不会留下空白盒子。
 */
export function DemoEmbed({ id }: { id: DemoId }) {
  const demo = DEMO_BY_ID.get(id) as ProcessDemo | undefined;
  const [open, setOpen] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const stepRef = useRef(0);
  const openRef = useRef(false);
  const restoreStep = useRef(0);
  const restoreOpen = useRef(false);

  stepRef.current = step;
  openRef.current = open;

  const total = demo?.steps.length ?? 0;

  useEffect(() => {
    if (!demo) return;
    const last = demo.steps.length - 1;

    const enterPrint = () => {
      restoreStep.current = stepRef.current;
      restoreOpen.current = openRef.current;
      flushSync(() => {
        setPlaying(false);
        setPrinting(true);
        setOpen(true);
        setStep(last);
      });
    };

    const leavePrint = () => {
      flushSync(() => {
        setPrinting(false);
        setOpen(restoreOpen.current);
        setStep(restoreStep.current);
      });
    };

    const media = window.matchMedia("print");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) enterPrint();
      else leavePrint();
    };

    window.addEventListener("beforeprint", enterPrint);
    window.addEventListener("afterprint", leavePrint);
    media.addEventListener?.("change", onChange);
    return () => {
      window.removeEventListener("beforeprint", enterPrint);
      window.removeEventListener("afterprint", leavePrint);
      media.removeEventListener?.("change", onChange);
    };
  }, [demo]);

  // 自动播放：每步停 1.7 s，到末步停住不回绕
  useEffect(() => {
    if (!playing || total < 2) return;
    const timer = window.setInterval(() => {
      setStep((value) => Math.min(value + 1, total - 1));
    }, 1700);
    return () => window.clearInterval(timer);
  }, [playing, total]);

  useEffect(() => {
    if (playing && step >= total - 1) setPlaying(false);
  }, [playing, step, total]);

  if (!demo) return null;

  const current = demo.steps[step] ?? demo.steps[0];

  const pause = () => setPlaying(false);
  const atEnd = step >= total - 1;

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    // 末步不回绕：播到最后一页就停住，要重看请按「重置」。
    if (atEnd) return;
    setPlaying(true);
  };

  return (
    <>
      <details
        className="demo-embed"
        open={open}
        onToggle={(event) => {
          const next = event.currentTarget.open;
          setOpen(next);
          if (!next) setPlaying(false);
        }}
      >
        <summary>
          <span className="demo-embed-mark">演示</span>
          <span className="demo-embed-title">{demo.title}</span>
          <span className="demo-embed-hint">
            {open ? "收起" : `展开 · ${total} 步`}
          </span>
        </summary>

        {open || printing ? (
          <div className="demo-body">
            <div className="demo-head">
              <p>{demo.lead}</p>
            </div>

            <div className="demo-stage">
              <Scene id={demo.id} step={step} />
            </div>

            <div className="demo-caption" aria-live="polite">
              <div className="demo-caption-title">
                <span>
                  {String(step + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>
                <h3>{current.title}</h3>
                {atEnd ? <em className="demo-done">已完成</em> : null}
              </div>
              <p>{current.caption}</p>
              <p className="demo-param">参数 · {current.param}</p>
            </div>

            <div className="demo-controls">
              <div className="demo-buttons">
                <button
                  type="button"
                  className="is-play"
                  aria-pressed={playing}
                  disabled={!playing && atEnd}
                  onClick={togglePlay}
                >
                  {playing ? "❚❚ 暂停" : atEnd ? "已完成" : "▶ 播放"}
                </button>
                <button
                  type="button"
                  disabled={step === 0}
                  onClick={() => {
                    pause();
                    setStep((value) => Math.max(0, value - 1));
                  }}
                >
                  ← 上一步
                </button>
                <button
                  type="button"
                  disabled={atEnd}
                  onClick={() => {
                    pause();
                    setStep((value) => Math.min(total - 1, value + 1));
                  }}
                >
                  {atEnd ? "已到最后" : "下一步 →"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    pause();
                    setStep(0);
                  }}
                >
                  重置
                </button>
              </div>
              <div className="demo-dots" role="tablist" aria-label={`${demo.title}步骤`}>
                {demo.steps.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    className={`${index === step ? "is-on " : ""}${index < step ? "is-done" : ""}`.trim()}
                    aria-label={`第 ${index + 1} 步 ${item.title}`}
                    aria-current={index === step ? "step" : undefined}
                    onClick={() => {
                      pause();
                      setStep(index);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </details>

      {/* 打印兜底：收起状态下面板内容不挂载，用同级的静态全组补上，避免空盒 */}
      <div className="demo-print-fallback" aria-hidden="true">
        <p className="demo-fallback-lead">
          {demo.title}｜{demo.lead}
        </p>
        <ol>
          {demo.steps.map((item, index) => (
            <li key={item.title}>
              <span className="demo-fallback-no">
                {String(index + 1).padStart(2, "0")}
              </span>
              <strong>{item.title}</strong>
              <span>{item.caption}</span>
              <span className="demo-fallback-param">参数 · {item.param}</span>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
