import { Link } from "react-router-dom";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { Woodcut } from "../components/Woodcut";
import { DEMOS } from "../data/demos";
import {
  STATIONS,
  countModules,
  flowStats,
  modulesFor,
  processForStation,
} from "../data/flow";

export function HomePage() {
  const stats = flowStats();

  return (
    <div className="ke">
      <div className="ke-paper">
        <SiteHeader />

        <main className="scroll-viewport">
          <div className="scroll-track">
            <section className="scroll-intro">
              <p className="ke-eyebrow">天工开物 · 基因工程卷</p>
              <h1>
                一次基因工程的
                <br />
                <em>最短路线</em>
              </h1>
              <p className="ke-lead">
                六站只回答「最少要经过什么」。工具、载体、宿主、标记不是站点，是挂在某站上的知识。
              </p>

              <dl className="ke-stats">
                <div>
                  <dt>站点</dt>
                  <dd>{stats.stations}</dd>
                </div>
                <div>
                  <dt>演示</dt>
                  <dd>{DEMOS.length}</dd>
                </div>
                <div>
                  <dt>知识</dt>
                  <dd>{stats.modules}</dd>
                </div>
              </dl>

              <div className="layers-note" data-layer-key>
                <div className="row">
                  <b>骨</b>
                  <p>六站，只回答「最少要经过什么」。横着读完，就是一条完整链路。</p>
                </div>
                <div className="row">
                  <b>知</b>
                  <p>载体、质粒、工具酶不是站点，是挂在某一站上的展开；从主轴向上下分叉。</p>
                </div>
                <div className="row">
                  <b>密</b>
                  <p>每站三档：必需走不通就停；展开讲原理与判据；边缘记失败、例外与未定论。</p>
                </div>
                <div className="row">
                  <b>序</b>
                  <p>切、接、转、增、检、养；站点只有这六个，卷上不再另标编号。</p>
                </div>
                <div className="row">
                  <b>考</b>
                  <p>先「序」立骨架，再「必」的关节，最后自测回查。</p>
                </div>
                <div className="row">
                  <b>实</b>
                  <p>先「切、接」操作与排查，再补「转、增」判据。</p>
                </div>
                <div className="row">
                  <b>产</b>
                  <p>先「养」量本，再「检」质控法规，最后看放大。</p>
                </div>
              </div>
            </section>

            {STATIONS.map((station) => {
              const modules = modulesFor(station.id);
              const process = processForStation(station.id);
              return (
                <Link
                  key={station.id}
                  to={`/station/${station.id}`}
                  className="scroll-step"
                  data-flow-step={station.id}
                  data-flow-station={station.id}
                  data-flow-ready="true"
                  data-flow-knowledge={countModules(modules)}
                  data-station-link="true"
                >
                  <span className="fish" aria-hidden="true" />
                  <div className="step-head">
                    <span className="step-no">{String(station.no).padStart(2, "0")}</span>
                    <span className="step-en">{station.en}</span>
                  </div>
                  <h2>
                    <span className="step-char">{station.char}</span>
                    {station.title}
                  </h2>
                  <p className="one-line">{process?.gloss ?? station.summary}</p>
                  <Woodcut step={station.steps[0]} />
                  <div className="step-foot">
                    <span>知识 {countModules(modules)} 则</span>
                    <span className="go">入站 →</span>
                  </div>
                </Link>
              );
            })}

            <section className="scroll-end">
              <span className="fish" aria-hidden="true" />
              <p>
                卷末 · 六站横向读完，是一条最短可执行的路。
                <br />
                每一站向下展开的，才是解释、变体、失败与争议。
              </p>
              <p>
                纸用宣纸暖米，字用文津宋体，夹注用霞鹜文楷；
                朱色只做印章与圈点。
              </p>
            </section>
          </div>
        </main>

        <SiteFooter
          title="基因工程 · 骨架与知识"
          note="骨架恒在，知识挂在站点上。横读是流程，上下分叉是解释。"
          meta={["刻本风格", "文津宋体 / 霞鹜文楷 · OFL", "六站 · 六序"]}
        />
      </div>
    </div>
  );
}
