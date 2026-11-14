import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";
import { SiteHeader } from "./SiteHeader";

/** 根路由兜底：渲染或数据出错时先给一张能回退的纸，不落 React Router 默认错误页。 */
export function RouteError() {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : 0;
  const missing = status === 404;

  return (
    <div className="ke">
      <div className="ke-paper">
        <SiteHeader />
        <main className="ke-empty">
          <p className="ke-eyebrow">{missing ? "404 · 此页未刻" : "页面出错"}</p>
          <h1>{missing ? "这一页不在培养皿里" : "这一页没能刻出来"}</h1>
          <p className="ke-lead">
            {missing
              ? "链接可能写错了，或者这一站还没有铺。回到长卷重新选一步。"
              : "内容是本地渲染的，刷新一次通常就好；还不行就回到骨架重新选一步。"}
          </p>
          <div className="ke-empty-links">
            <Link className="ke-back" to="/">
              回到骨架
            </Link>
            <button type="button" className="ke-back" onClick={() => window.location.reload()}>
              重新加载
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
