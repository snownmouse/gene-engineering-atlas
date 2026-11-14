import { Link, useLocation } from "react-router-dom";
import { canonicalStationId, flowStats, stationForStep } from "../data/flow";
import { SiteSearch } from "./SiteSearch";

export function SiteHeader() {
  const stats = flowStats();
  const { pathname } = useLocation();
  const stationId = pathname.match(/^\/station\/([^/]+)/)?.[1];
  const current = stationForStep(canonicalStationId(stationId) ?? "");
  const label = current ? `当前站 · ${current.char} · ${current.title}` : "当前站 · 接";
  const to = current ? `/station/${current.id}` : "/station/jie";

  return (
    <header className="ke-head">
      <Link to="/" className="ke-brand" aria-label="返回骨架">
        <span className="ke-seal" aria-hidden="true">
          基因
          <br />
          工程
        </span>
        <span className="ke-brand-text">
          <strong>天工开物 · 基因工程卷</strong>
          <small>六站 · 知识挂在其上</small>
        </span>
      </Link>
      <nav className="ke-nav" aria-label="站点导航">
        <Link to="/">骨架</Link>
        <Link to={to}>{label}</Link>
        <SiteSearch mode="overlay" />
        <span className="ke-chip">
          <i aria-hidden="true" />
          {stats.stations} 站 · {stats.modules} 则知识
        </span>
      </nav>
    </header>
  );
}
