import { useEffect } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { BlockRenderer } from "../components/BlockRenderer";
import { ItemReader } from "../components/ItemReader";
import { ExternalResources } from "../components/ExternalResources";
import { KnowledgeTree } from "../components/KnowledgeTree";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { TermDrawer } from "../components/TermDrawer";
import {
  blocksForModule,
  canonicalStationId,
  countModules,
  findModule,
  flattenModules,
  getStation,
  modulesFor,
  stationForStep,
} from "../data/flow";
import { itemsForModule } from "../data/flow/items";
import { MIXED_VIEWS } from "../data/flow/mixed";

/** 单模块正文：纵排、从顶部开始；父级路径在上，子节点在下。 */
export function ModulePage() {
  const { stationId, moduleId } = useParams();
  const location = useLocation();
  const canonical = canonicalStationId(stationId);
  const station = getStation(canonical);
  const found = station && moduleId ? findModule(station.id, moduleId) : undefined;
  const current = found?.module;
  const items = current ? itemsForModule(current.id) : undefined;
  const mixed = current ? MIXED_VIEWS[current.id] : undefined;

  // 从检索或旧锚点带着 #b-N 进来时，等正文渲染完再落位。
  useEffect(() => {
    if (!current) return;
    const jump = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash || hash.startsWith("term-")) return;
      // 条目视图里 #item- 由 ItemReader 自己接管；#b- 要等自测块展开后再落位。
      if (hash.startsWith("item-")) return;
      if (items && hash.startsWith("b-") && !mixed) return;
      const target = document.getElementById(hash);
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY - 92;
      window.scrollTo(0, Math.max(0, top));
    };
    const frame = requestAnimationFrame(() => requestAnimationFrame(jump));
    window.addEventListener("hashchange", jump);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", jump);
    };
  }, [current?.id, location.hash, items]);

  if (!station) {
    return <Navigate to={stationId ? `/station/${stationId}` : "/"} replace />;
  }
  if (stationId && canonical && canonical !== stationId) {
    return (
      <Navigate to={`/station/${canonical}/k/${moduleId ?? ""}${location.hash}`} replace />
    );
  }
  if (!current) {
    return (
      <div className="ke">
        <div className="ke-paper">
          <SiteHeader />
          <main className="ke-empty">
            <p className="ke-eyebrow">此页未刻</p>
            <h1>这一页不存在或已移动</h1>
            <p className="ke-lead">
              地址里的知识页可能改过名，或者没有挂在「{String(station.no).padStart(2, "0")} · {station.char} · {station.title}」这一站。
            </p>
            <div className="ke-empty-links">
              <Link className="ke-back" to={`/station/${station.id}/k`}>
                回知识目录
              </Link>
              <Link to={`/station/${station.id}`}>回站页封面</Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const no = String(station.no).padStart(2, "0");
  const blocks = blocksForModule(current);
  const mixedTail = mixed
    ? blocks
        .map((block, index) => ({ block, index }))
        .filter(({ block }) => mixed.keep(block))
    : [];
  const examIndex = items
    ? blocks.findIndex((block) => block.type === "note" && block.tone === "exam")
    : -1;
  const exam = examIndex >= 0 ? blocks[examIndex] : undefined;
  const children = current.children ?? [];
  // 条目视图下，已经被某条「展开细读」收进去的子模块不再重复列；剩下的仍给入口。
  const covered = new Set(
    (items ?? []).map((item) => item.moduleId).filter((id): id is string => Boolean(id)),
  );
  const looseChildren = items ? children.filter((child) => !covered.has(child.id)) : children;
  const tree = flattenModules(modulesFor(station.id));
  const at = tree.findIndex((module) => module.id === current.id);
  const prev = at > 0 ? tree[at - 1] : undefined;
  const next = at >= 0 && at < tree.length - 1 ? tree[at + 1] : undefined;

  return (
    <div className="ke">
      <div className="ke-paper">
        <SiteHeader />

        <main className={items ? "k-page is-itemized" : "k-page"} data-k-page>
          <nav className="k-crumb" aria-label="当前位置">
            <Link to="/">骨架</Link>
            <span aria-hidden="true">/</span>
            <Link to={`/station/${station.id}`}>
              {no} · {station.char} · {station.title}
            </Link>
            <span aria-hidden="true">/</span>
            <Link to={`/station/${station.id}/k`}>知识目录</Link>
            {found?.ancestors.map((ancestor) => (
              <span className="k-crumb-seg" key={ancestor.id}>
                <span aria-hidden="true">/</span>
                <Link to={`/station/${station.id}/k/${ancestor.id}`}>{ancestor.title}</Link>
              </span>
            ))}
            <span aria-hidden="true">/</span>
            <span className="is-current">{current.title}</span>
          </nav>

          <header className="k-module-head">
            <p className="ke-eyebrow k-module-eyebrow">
              <span>{current.en}</span>
              <span>
                ·{" "}
                {items
                  ? mixedTail.length
                    ? `${items.length} 页 · 操作段 ${mixedTail.length} 段`
                    : `${items.length} 页`
                  : `${blocks.length} 段`}
              </span>
              {looseChildren.length > 0 ? (
                <span>
                  ·{" "}
                  {items
                    ? `子主题 ${countModules(looseChildren)} 则`
                    : `子模块 ${countModules(looseChildren)} 则`}
                </span>
              ) : null}
            </p>
            <h1>{current.title}</h1>
            <p className="k-module-summary">{current.summary}</p>
            <div className="k-module-actions">
              <TermDrawer stationId={station.id} />
              {current.hooks.map((hook) => {
                const host = stationForStep(hook);
                return (
                  <span className="hook-chip" key={hook} data-hook={hook}>
                    {host ? `${host.char} · ${host.title}` : hook}
                    {host?.id === station.id ? " · 本站" : " · 另挂"}
                  </span>
                );
              })}
            </div>
          </header>

          {items ? (
            <>
              <ItemReader
                key={current.id}
                stationId={station.id}
                items={items}
                volume={no}
                stable={Boolean(mixed && mixedTail.length)}
                exam={exam ? { block: exam, index: examIndex } : undefined}
              />
              {mixed && mixedTail.length > 0 ? (
                <section className="k-mixed-tail" id="mixed-tail" aria-label={mixed.title}>
                  <header className="k-mixed-head">
                    <span className="k-mixed-kicker">流程与配方</span>
                    <h2>{mixed.title}</h2>
                    <p className="k-mixed-hint">{mixed.hint}</p>
                  </header>
                  <article className="k-module-body k-mixed-body" data-k-mixed-body>
                    {mixedTail.map(({ block, index }) => (
                      <section
                        className="k-block"
                        id={`b-${index}`}
                        data-k-block={index}
                        key={`${current.id}-tail-${index}`}
                      >
                        <BlockRenderer block={block} stationId={station.id} />
                      </section>
                    ))}
                  </article>
                </section>
              ) : null}
            </>
          ) : (
            <article className="k-module-body" data-k-module-body>
              {blocks.length > 0 ? (
                blocks.map((block, index) => (
                  <section className="k-block" id={`b-${index}`} data-k-block={index} key={`${current.id}-${index}`}>
                    <BlockRenderer block={block} stationId={station.id} />
                  </section>
                ))
              ) : (
                <p className="k-empty-note">本模块只作目录，正文分在下面的子模块里。</p>
              )}
            </article>
          )}

          {looseChildren.length > 0 && (
            <section className="k-module-children">
              <h2>
                {items ? "子主题" : "子模块"} · {countModules(looseChildren)} 则
              </h2>
              <KnowledgeTree modules={looseChildren} stationId={station.id} depth={1} />
            </section>
          )}

          <ExternalResources moduleId={current.id} />

          <nav className="k-module-nav" aria-label="前后一则">
            {prev ? (
              <Link to={`/station/${station.id}/k/${prev.id}`}>
                <small>← 上一则</small>
                <strong>{prev.title}</strong>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link to={`/station/${station.id}/k/${next.id}`}>
                <small>下一则 →</small>
                <strong>{next.title}</strong>
              </Link>
            ) : (
              <span />
            )}
          </nav>

          <div className="k-page-foot">
            <Link to={`/station/${station.id}/k`}>← 返回知识目录</Link>
            <Link to={`/station/${station.id}`}>
              {no} · {station.char} · {station.title} · 封面
            </Link>
          </div>
        </main>

        <SiteFooter
          title={`第 ${no} 站 · ${current.title}`}
          note={station.source}
          meta={
            items
              ? [
                  "页面",
                  mixedTail.length
                    ? `${items.length} 页 · 操作段 ${mixedTail.length} 段`
                    : `${items.length} 页 · 正文 ${blocks.length} 段`,
                  children.length ? `子模块 ${countModules(children)} 则` : "末级模块",
                ]
              : ["知识正文", `${blocks.length} 段`, children.length ? `子模块 ${countModules(children)} 则` : "末级模块"]
          }
        />
      </div>
    </div>
  );
}
