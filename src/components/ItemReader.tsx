import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { KnowledgeItem } from "../data/flow/types";
import type { Block } from "../data/types";
import { blocksForModule, findModule } from "../data/flow";
import { BlockRenderer } from "./BlockRenderer";
import { Figure } from "./figures/Figure";
import { Inline } from "./Inline";

type Props = {
  stationId: string;
  items: KnowledgeItem[];
  /** 站号，用在页眉上：第 02 站 · N 页 */
  volume?: string;
  /** 模块自测块：深链 #b-N 时自动展开并落位 */
  exam?: { block: Block; index: number };
  /** 混排：把页面区高度固定为最高一页，翻页时下方操作段不移动 */
  stable?: boolean;
};

type Flip = { from: number; to: number; dir: 1 | -1 };

function hashIndex(items: KnowledgeItem[]) {
  const match = window.location.hash.match(/^#item-(.+)$/);
  if (!match) return 0;
  const index = items.findIndex((item) => item.id === match[1]);
  return index < 0 ? 0 : index;
}

function ItemTable({ table }: { table: NonNullable<KnowledgeItem["table"]> }) {
  return (
    <div className="table-block">
      <div className="table-scroll">
        <table className="k-table k-item-table">
          <thead>
            <tr>
              {table.head.map((cell) => (
                <th key={cell}>{cell}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} data-label={table.head[cellIndex] ?? ""}>
                    <Inline text={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.caption ? <p className="table-caption">{table.caption}</p> : null}
    </div>
  );
}

/** 知识点页面视图：一页一屏，可上一页/下一页翻，也可从右侧清单跳读。 */
export function ItemReader({ stationId, items, volume, exam, stable }: Props) {
  const [active, setActive] = useState(() => hashIndex(items));
  const [flip, setFlip] = useState<Flip | null>(null);
  const [stageH, setStageH] = useState<number | null>(null);
  const [stableH, setStableH] = useState<number | null>(null);
  const [indexOpen, setIndexOpen] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const inRef = useRef<HTMLDivElement | null>(null);
  const readerRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const examRef = useRef<HTMLDetailsElement | null>(null);
  const lockRef = useRef(false);
  const selfHash = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();

  const total = items.length;
  // 页码可能跨模块残留（组件实例被复用）；渲染前先夹到当前模块的页数里。
  const current = total > 0 ? Math.min(active, total - 1) : 0;

  // 混排页：先量出最高的一页（含底部翻页条），据此固定页面区高度。
  useLayoutEffect(() => {
    if (!stable) return;
    const box = measureRef.current;
    if (!box) return;
    const measure = () => {
      const cards = [...box.querySelectorAll<HTMLElement>(".k-item")];
      const max = cards.reduce((value, card) => Math.max(value, card.offsetHeight), 0);
      if (max > 0) setStableH(max);
    };
    measure();
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [items, stable]);

  // 地址栏 #item-x 是唯一真源：术语抽屉、检索、自测回看、前进后退都落到这里。
  useEffect(() => {
    setActive(hashIndex(items));
    if (selfHash.current) {
      selfHash.current = false;
      return;
    }
    // 外部跳进来的才把阅读区带到眼前；普通打开、自己翻页时一律不动页面。
    if (!window.location.hash.startsWith("#item-")) return;
    const node = readerRef.current;
    if (!node) return;
    const frame = requestAnimationFrame(() => {
      const box = node.getBoundingClientRect();
      if (box.top < 8 || box.top > window.innerHeight * 0.6) {
        node.scrollIntoView({ block: "start", behavior: "smooth" });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [items, location.hash]);

  // 换页：先锁住旧高度，新旧两层同时在场，横向一进一出；高度随后用过渡补齐。
  const go = (next: number) => {
    const target = Math.max(0, Math.min(total - 1, next));
    if (target === active || lockRef.current) return;
    const height = stageRef.current?.offsetHeight ?? 0;
    lockRef.current = true;
    if (!stable) setStageH(height);
    setFlip({ from: active, to: target, dir: target > active ? 1 : -1 });
    setActive(target);
    setIndexOpen(false);
    selfHash.current = true;
    navigate({ hash: `#item-${items[target].id}` }, { replace: true });
  };

  // 新卡挂上后量一次真实高度，下一帧起让容器高度平滑跟上。
  useLayoutEffect(() => {
    if (!flip || stable) return;
    const nextHeight = inRef.current?.offsetHeight ?? 0;
    const first = requestAnimationFrame(() => {
      requestAnimationFrame(() => setStageH(nextHeight));
    });
    return () => cancelAnimationFrame(first);
  }, [flip, stable]);

  useEffect(() => {
    if (!flip) return;
    const timer = window.setTimeout(() => {
      setFlip(null);
      if (!stable) setStageH(null);
      lockRef.current = false;
    }, 260);
    return () => window.clearTimeout(timer);
  }, [flip, stable]);

  // 深链 #b-N：自测块自动展开，再滚到标题下方。
  useEffect(() => {
    if (!exam || location.hash !== `#b-${exam.index}`) return;
    const node = examRef.current;
    if (!node) return;
    node.open = true;
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const top = node.getBoundingClientRect().top + window.scrollY - 92;
        window.scrollTo(0, Math.max(0, top));
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [exam, location.hash]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (target?.isContentEditable) return;
      const root = readerRef.current;
      if (!root) return;
      const focused = document.activeElement;
      const scope = root.closest(".k-items");
      if (focused && focused !== document.body && !scope?.contains(focused)) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(active + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(active - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, total]);

  const renderCard = (index: number, live: boolean, measure = false) => {
    const data = items[index];
    // 换模块时旧页码可能超出新模块的页数；宁可不画，也不让整页崩掉。
    if (!data) return null;
    const detail = data.moduleId ? findModule(stationId, data.moduleId) : undefined;
    const detailBlocks = detail ? blocksForModule(detail.module) : [];
    const child = detail?.module;
    const num = String(index + 1).padStart(2, "0");

    return (
      <article
        className="k-item"
        id={live ? `item-${data.id}` : undefined}
        key={data.id}
        aria-hidden={live || measure ? "true" : undefined}
      >
        <div className="k-item-top">
          <span className="k-item-no">第 {num} 页</span>
          <span className="k-item-kind">
            {data.kind}
            {data.examType ? ` · ${data.examType}` : ""}
          </span>
        </div>

        <h2>
          {data.title}
          {data.en ? <span className="k-item-en">{data.en}</span> : null}
        </h2>

        <p className="k-item-line">
          {data.kind === "考点" ? <b>考什么 </b> : null}
          <Inline text={data.line} />
        </p>

        {data.params?.length ? (
          <div className="k-item-params">
            <h3>{data.kind === "考点" ? "怎么答" : "关键参数 / 判据"}</h3>
            <ul>
              {data.params.map((line) => (
                <li key={line}>
                  <Inline text={line} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {data.figure ? (
          <div className="k-item-figure">
            <Figure id={data.figure} />
            {data.figureCaption ? (
              <p className="k-item-figure-note">
                <Inline text={data.figureCaption} />
              </p>
            ) : null}
          </div>
        ) : null}

        {data.image ? (
          <figure className="photo-block k-item-photo">
            <img src={data.image.src} alt={data.image.alt} loading="lazy" />
            {data.image.caption ? <figcaption>{data.image.caption}</figcaption> : null}
          </figure>
        ) : null}

        {data.table ? <ItemTable table={data.table} /> : null}

        {data.confuse ? (
          <p className="k-item-confuse">
            <b>{data.kind === "考点" ? "易错点" : "易混"}</b>
            <Inline text={data.confuse} />
          </p>
        ) : null}

        {data.dispute ? (
          <p className="k-item-dispute">
            <b>口径</b>
            <Inline text={data.dispute} />
          </p>
        ) : null}

        {child && detailBlocks.length ? (
          <details className="k-item-detail">
            <summary>
              展开细读 · {child.title}（{detailBlocks.length} 段）
            </summary>
            <div className="k-module-body k-item-detail-body">
              {detailBlocks.map((block, blockIndex) => (
                <section className="k-block" key={`${child.id}-${blockIndex}`}>
                  <BlockRenderer block={block} stationId={stationId} />
                </section>
              ))}
            </div>
            <Link className="k-item-open" to={`/station/${stationId}/k/${child.id}`}>
              单独打开这一页 →
            </Link>
          </details>
        ) : null}

        {live || measure ? (
          <nav className="k-item-nav" aria-label="页面翻页" aria-hidden={measure ? "true" : undefined}>
            <button
              type="button"
              disabled={measure || index === 0}
              onClick={measure ? undefined : () => go(index - 1)}
            >
              ← 上一页
            </button>
            <span className="k-item-count">
              {num} / {String(total).padStart(2, "0")}
            </span>
            <button
              type="button"
              disabled={measure || index === total - 1}
              onClick={measure ? undefined : () => go(index + 1)}
            >
              下一页 →
            </button>
          </nav>
        ) : null}
      </article>
    );
  };

  const no = String(current + 1).padStart(2, "0");

  return (
    <section className="k-items" data-items data-item-total={total}>
      <header className="k-items-head">
        <span className="k-items-kicker">
          {volume ? `第 ${volume} 站` : "知识点"} · {total} 页
        </span>
        <p className="k-items-hint">一页只讲一件事；点清单跳读，或用 ← → 翻页。</p>
        <span className="k-items-progress" aria-live="polite">
          {no} / {String(total).padStart(2, "0")}
        </span>
      </header>

      <div className="k-items-layout">
        <div className="k-item-reader" ref={readerRef} tabIndex={0}>
          <div className="k-item-frame">
            {stable ? (
              <div className="k-item-measure" ref={measureRef} aria-hidden="true">
                {items.map((entry, index) => (
                  <div className="k-item-measure-cell" key={entry.id}>
                    {renderCard(index, false, true)}
                  </div>
                ))}
              </div>
            ) : null}
            <div
              className={`k-item-stage${flip ? " is-flipping" : ""}${stable ? " is-stable" : ""}`}
              ref={stageRef}
              data-flip-dir={flip ? flip.dir : undefined}
              aria-busy={flip ? "true" : undefined}
              style={
                (stable ? stableH : stageH) !== null
                  ? {
                      height: `${stable ? stableH : stageH}px`,
                      ["--flip-in" as string]: flip?.dir === -1 ? "-36px" : "36px",
                      ["--flip-out" as string]: flip?.dir === -1 ? "36px" : "-36px",
                    }
                  : undefined
              }
            >
              {flip ? (
                <div className="k-item-layer is-out" aria-hidden="true">
                  {renderCard(flip.from, false)}
                </div>
              ) : null}
              <div className="k-item-layer is-in" ref={inRef}>
                {renderCard(current, true)}
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="k-item-index-toggle"
          aria-expanded={indexOpen}
          onClick={() => setIndexOpen((value) => !value)}
        >
          页面清单 · {total} 页 {indexOpen ? "收起" : "展开"}
        </button>

        <aside className={`k-item-index${indexOpen ? " is-open" : ""}`} aria-label="页面清单">
          <h3>页面清单</h3>
          <ol>
            {items.map((entry, index) => (
              <li key={entry.id}>
                <button
                  type="button"
                  className={index === current ? "is-on" : ""}
                  aria-current={index === current ? "true" : undefined}
                  onClick={() => {
                    go(index);
                    readerRef.current?.focus({ preventScroll: true });
                  }}
                >
                  <span className="no">{String(index + 1).padStart(2, "0")}</span>
                  <span className="title">{entry.title}</span>
                  <span className="kind">{entry.kind}</span>
                </button>
              </li>
            ))}
          </ol>
        </aside>
      </div>

      {exam ? (
        <details className="k-item-exam" id={`b-${exam.index}`} ref={examRef}>
          <summary>自测 · 5 题（点开看答案）</summary>
          <div className="k-module-body" data-k-block={exam.index}>
            <BlockRenderer block={exam.block} stationId={stationId} />
          </div>
        </details>
      ) : null}
    </section>
  );
}
