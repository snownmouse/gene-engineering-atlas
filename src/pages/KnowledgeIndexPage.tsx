import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { KnowledgeTree } from "../components/KnowledgeTree";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { TermDrawer } from "../components/TermDrawer";
import { canonicalStationId, countModules, getStation, modulesFor } from "../data/flow";

/** 本站知识目录：只列这一站挂着的模块，父模块与子节点按层级展开。 */
export function KnowledgeIndexPage() {
  const { stationId } = useParams();
  const location = useLocation();
  const canonical = canonicalStationId(stationId);
  const station = getStation(canonical);

  // 旧八站地址的 /k 目录一并落到六站。
  if (stationId && canonical && canonical !== stationId) {
    return <Navigate to={`/station/${canonical}/k${location.hash}`} replace />;
  }

  if (!station) {
    return <Navigate to={stationId ? `/station/${stationId}` : "/"} replace />;
  }

  const modules = modulesFor(station.id);
  const total = countModules(modules);
  const no = String(station.no).padStart(2, "0");

  return (
    <div className="ke">
      <div className="ke-paper">
        <SiteHeader />

        <main className="k-page" data-k-page>
          <nav className="k-crumb" aria-label="当前位置">
            <Link to="/">骨架</Link>
            <span aria-hidden="true">/</span>
            <Link to={`/station/${station.id}`}>
              {no} · {station.char} · {station.title}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="is-current">知识目录</span>
          </nav>

          <header className="k-index-head">
            <p className="ke-eyebrow">
              第 {no} 站 · {station.char} · {station.en}
            </p>
            <h1>本站知识 · {total} 则</h1>
            <p className="k-index-lead">{station.summary}</p>
            <p className="k-index-meta">{station.position}</p>
            <p className="k-index-meta">本站要回答：{station.question}</p>
            <p className="k-index-meta">
              父模块下挂子模块，层级按原样列出；点任意一则进入正文，正文页再往下走。
            </p>
            <div className="k-index-actions">
              <TermDrawer stationId={station.id} />
              <Link className="k-index-back" to={`/station/${station.id}`}>
                ← 回到站页封面
              </Link>
            </div>
          </header>

          <KnowledgeTree modules={modules} stationId={station.id} />

          <div className="k-page-foot">
            <Link to={`/station/${station.id}`}>← {station.title} · 封面</Link>
            <Link to="/">骨架六站</Link>
          </div>
        </main>

        <SiteFooter
          title={`第 ${no} 站 · ${station.title} · 知识目录`}
          note={station.source}
          meta={["知识目录", `共 ${total} 则`, "父模块 → 子模块"]}
        />
      </div>
    </div>
  );
}
