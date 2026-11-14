import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { TermDrawer } from "../components/TermDrawer";
import { Woodcut } from "../components/Woodcut";
import {
  STATIONS,
  blocksForModule,
  canonicalStationId,
  countModules,
  findModule,
  getStation,
  modulesFor,
} from "../data/flow";

export function StationPage() {
  const { stationId } = useParams();
  const location = useLocation();
  const canonical = canonicalStationId(stationId);
  const station = getStation(canonical);

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const axisRef = useRef<HTMLDivElement | null>(null);
  const topRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const currentRef = useRef<HTMLElement | null>(null);

  const [anchor, setAnchor] = useState(0);
  const [padTop, setPadTop] = useState(160);
  const [padBottom, setPadBottom] = useState(160);
  const [axisH, setAxisH] = useState(300);

  const modules = station ? modulesFor(station.id) : [];
  const moduleCount = countModules(modules);
  const edges = station?.edge.items ?? [];
  const edgeRows = edges.map((item, index) => ({ item, index }));
  const edgeCols = [edgeRows.slice(0, 3), edgeRows.slice(3, 6), edgeRows.slice(6)];

  const index = station ? STATIONS.findIndex((item) => item.id === station.id) : -1;
  const prev = index > 0 ? STATIONS[index - 1] : undefined;
  const next = index >= 0 && index < STATIONS.length - 1 ? STATIONS[index + 1] : undefined;

  useLayoutEffect(() => {
    const measure = () => {
      const node = currentRef.current;
      const canvas = canvasRef.current;
      const axis = axisRef.current;
      const top = topRef.current;
      const bottom = bottomRef.current;
      if (!node || !canvas) return;
      setAnchor(node.offsetLeft + node.offsetWidth / 2);
      setAxisH((axis?.offsetHeight ?? 0) || 300);
      // 窄屏是纵向堆叠，上下枝干已回到文档流，不再需要画布留白。
      const narrow = window.innerWidth <= 900;
      if (narrow) {
        setPadTop(16);
        setPadBottom(28);
        return;
      }
      // 上下各自只留 120px 余量。知识区已经是固定高度的目录入口，不再随展开改写。
      setPadTop((top?.offsetHeight ?? 0) + 120);
      setPadBottom((bottom?.offsetHeight ?? 0) + 120);
    };

    measure();
    const frame = requestAnimationFrame(measure);
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
    };
  }, [station?.id]);

  // 进站 / 换站只做一次定位：横轴居中，纵向回到封面顶部。
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const node = currentRef.current;
    if (!stage || !node) return;
    stage.scrollLeft = Math.max(
      0,
      node.offsetLeft + node.offsetWidth / 2 - stage.clientWidth / 2,
    );
    stage.scrollTop = 0;
  }, [station?.id]);

  // 同页锚点：只跳一次，不做多次延时重排；被展开顶走的问题随展开一起消失。
  useEffect(() => {
    const jump = () => {
      const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      if (!hash || hash.startsWith("m-") || hash.startsWith("term-")) return;
      const stage = stageRef.current;
      const target = document.getElementById(hash);
      if (!stage || !target) return;
      const stageBox = stage.getBoundingClientRect();
      const targetBox = target.getBoundingClientRect();
      const top = stage.scrollTop + targetBox.top - stageBox.top - 24;
      const left = stage.scrollLeft + targetBox.left - stageBox.left - 24;
      stage.scrollTop = Math.max(0, Math.min(top, stage.scrollHeight - stage.clientHeight));
      stage.scrollLeft = Math.max(0, Math.min(left, stage.scrollWidth - stage.clientWidth));
    };
    const frame = requestAnimationFrame(() => requestAnimationFrame(jump));
    window.addEventListener("hashchange", jump);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", jump);
    };
  }, [station?.id]);

  // 旧锚点 #m-<moduleId> 兼容：直接改投单模块正文页。
  const legacyModuleId = location.hash.startsWith("#m-") ? location.hash.slice(3) : "";
  const legacy = station && legacyModuleId ? findModule(station.id, legacyModuleId) : undefined;

  // 旧八站地址落到六站，锚点一起带走；不能 404。
  if (stationId && canonical && canonical !== stationId) {
    return <Navigate to={`/station/${canonical}${location.hash}`} replace />;
  }

  if (!station) {
    return (
      <div className="ke">
        <div className="ke-paper">
          <SiteHeader />
          <main className="ke-empty">
            <p className="ke-eyebrow">此站未铺</p>
            <h1>这一站还没有内容</h1>
            <p className="ke-lead">骨架已就位，知识层尚未挂上。先回长卷看别的站。</p>
            <Link className="ke-back" to="/">
              回到骨架
            </Link>
          </main>
        </div>
      </div>
    );
  }

  if (legacy) {
    return <Navigate to={`/station/${station.id}/k/${legacy.module.id}`} replace />;
  }

  return (
    <div className="ke">
      <div className="ke-paper">
        <SiteHeader />

        <main>
          <div className="stage" ref={stageRef} data-spine>
          <div
            className="stage-canvas"
            ref={canvasRef}
            style={{
              paddingTop: padTop,
              paddingBottom: padBottom,
              ["--anchor-x" as string]: `${anchor}px`,
              ["--axis-top" as string]: `${padTop}px`,
              ["--axis-h" as string]: `${axisH}px`,
            }}
          >
            <div className="branch-layer is-top" data-tier="expand" ref={topRef}>
              <div className="k-entry" data-knowledge-total={moduleCount}>
                <div className="k-entry-head">
                  <span className="tier-label">
                    <b>展開</b> · 知识 {moduleCount} 则，挂在第{" "}
                    {String(station.no).padStart(2, "0")} 站
                  </span>
                  <Link className="k-entry-all" to={`/station/${station.id}/k`}>
                    知识目录 · 父 {modules.length} / 子 {moduleCount - modules.length} →
                  </Link>
                </div>
                <ul className="k-entry-list">
                  {modules.map((module, index) => (
                    <li key={module.id}>
                      <Link
                        className="k-entry-link"
                        to={`/station/${station.id}/k/${module.id}`}
                        data-module-link
                        data-module-id={module.id}
                      >
                        <span className="k-entry-no">{String(index + 1).padStart(2, "0")}</span>
                        <span className="k-entry-title">{module.title}</span>
                        <span className="k-entry-en">{module.en}</span>
                        <span className="k-entry-count">
                          {countModules([module])} 则 · {blocksForModule(module).length} 段
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="k-entry-hint">
                  点开进入子页；父模块下的子模块在子页里按层级展开，不并成平铺。
                </p>
              </div>
            </div>

            <div className="axis" ref={axisRef}>
              {STATIONS.map((item) => {
                if (item.id === station.id) {
                  return (
                    <article
                      key={item.id}
                      className="axis-node is-current"
                      data-spine-step={item.id}
                      data-spine-current="true"
                      ref={(node) => {
                        currentRef.current = node;
                      }}
                    >
                      <span className="node-dot" aria-hidden="true" />
                      <div className="station-title">
                        <span className="fish" aria-hidden="true" />
                        <h1>{station.title}</h1>
                        <span className="station-process" data-process={station.id}>
                          <b>{station.char}</b>
                        </span>
                        <span className="kicker">{station.kicker}</span>
                        <Link className="station-k-link" to={`/station/${station.id}/k`} data-k-index-link>
                          知识目录 · {moduleCount} 则
                        </Link>
                        <TermDrawer stationId={station.id} />
                      </div>
                      <p className="station-question" data-position>
                        {station.question}
                        <Woodcut step={station.steps[0]} className="station-woodcut" />
                      </p>

                      <div data-tier="must">
                        <span className="tier-label">
                          <b>必需</b> · 不走这条就走不通
                        </span>
                        <div className="must-grid">
                          {station.must.steps.map((item) => (
                            <div
                              className="must-card"
                              key={item.no}
                              id={`must-${item.no}`}
                              data-must-step={item.no}
                            >
                              <span className="must-no">{item.no}</span>
                              <h3>{item.title}</h3>
                              <p>{item.body}</p>
                              <p className="must-check">
                                <span>判</span>
                                {item.check}
                              </p>
                            </div>
                          ))}
                        </div>
                        <p className="must-gate" id="gate" data-must-gate>
                          <span>走通</span>
                          {station.must.gate.replace(/^走通的标准只有一个：/, "")}
                        </p>
                      </div>
                    </article>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    to={`/station/${item.id}`}
                    className="axis-node"
                    data-spine-step={item.id}
                  >
                    <span className="node-dot" aria-hidden="true" />
                    <span className="node-no">{String(item.no).padStart(2, "0")}</span>
                    <span className="node-name">{item.title}</span>
                    <span className="node-en">{item.en}</span>
                  </Link>
                );
              })}
            </div>

            <div className="branch-layer is-bottom" data-tier="edge" ref={bottomRef}>
              <span className="tier-label">
                <b>邊緣</b> · 失败、例外、历史与未定论
              </span>
              {edgeCols.map((col, colIndex) => (
                <div className="edge-col" key={`edge-col-${colIndex}`}>
                  <ul className="edge-list">
                    {col.map(({ item, index }) => (
                      <li
                        className="edge-item"
                        key={item.title}
                        id={`edge-${index}`}
                        data-edge-item
                        data-pending={item.pending ? "true" : "false"}
                      >
                        <span className="edge-label">{item.label}</span>
                        <div>
                          <h3>
                            {item.title}
                            {item.pending && (
                              <span className="edge-pending">{item.pendingNote ?? "口径未定"}</span>
                            )}
                          </h3>
                          <p>{item.text}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bridge-bar" data-bridge>
          <div className="bridge-cell">
            <span>承上</span>
            <p>{station.bridge.from}</p>
          </div>
          <div className="bridge-cell">
            <span>啟下</span>
            <p>{station.bridge.to}</p>
          </div>
        </div>

        <div className="station-nav">
          {prev ? (
            <Link className="station-step" to={`/station/${prev.id}`}>
              <small>← 前站</small>
              <strong>{prev.char} · {prev.title}</strong>
            </Link>
          ) : (
            <span className="station-step">
              <small>卷首</small>
              <strong>切 · 切出目的基因</strong>
            </span>
          )}
          {next ? (
            <Link className="station-step" to={`/station/${next.id}`}>
              <small>后站 →</small>
              <strong>{next.char} · {next.title}</strong>
            </Link>
          ) : (
            <span className="station-step">
              <small>卷末</small>
              <strong>养 · 表达并取产物</strong>
            </span>
          )}
        </div>
        </main>

        <SiteFooter
          title={`第 ${String(station.no).padStart(2, "0")} 站 · ${station.title}`}
          note={station.source}
          meta={["刻本风格", `知识 ${moduleCount} 则`, `边缘 ${edges.length} 条`]}
        />
      </div>
    </div>
  );
}
