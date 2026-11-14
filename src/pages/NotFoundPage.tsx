import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";

export function NotFoundPage() {
  return (
    <div className="ke">
      <div className="ke-paper">
        <SiteHeader />
        <main className="ke-empty">
          <p className="ke-eyebrow">404 · 此页未刻</p>
          <h1>这一页不在培养皿里</h1>
          <p className="ke-lead">链接可能写错了，或者这一站还没有铺。回到长卷重新选一步。</p>
          <Link className="ke-back" to="/">
            回到骨架
          </Link>
        </main>
      </div>
    </div>
  );
}
