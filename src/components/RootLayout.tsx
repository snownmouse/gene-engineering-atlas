import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

/** 所有页面共用的外壳。全站只保留骨架与站页两层。 */
export function RootLayout() {
  const { pathname } = useLocation();

  // 换路由回到页面顶部；带 #b-N 之类的锚点交给目标页自己落位。
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [pathname]);

  return <Outlet />;
}
