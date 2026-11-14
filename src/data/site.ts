import { flowStats } from "./flow";

export const COURSE = {
  name: "基因工程（B）",
  provider: "中南民族大学",
  lecturer: "张莉",
  tagline: "先把最短的路走通，再把知识挂上去",
};

export function siteStats() {
  return flowStats();
}
