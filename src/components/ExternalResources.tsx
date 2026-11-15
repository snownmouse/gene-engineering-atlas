import { RESOURCES } from "../data/resources";

/**
 * 模块底部的延伸资源区：只做外链，不内嵌播放器。
 * 离线或域名不可达时，退化成普通链接列表，不会留下空白块。
 */
export function ExternalResources({ moduleId }: { moduleId: string }) {
  const set = RESOURCES[moduleId];
  if (!set) return null;

  return (
    <section className="k-ext" aria-label="延伸资源">
      <header className="k-ext-head">
        <span className="k-ext-kicker">延伸资源</span>
        <p>外部链接在新窗口打开；内容由各机构自行维护，与站内口径无关。</p>
      </header>

      <ul className="k-ext-links">
        {set.links.map((link) => (
          <li key={link.href}>
            <a href={link.href} target="_blank" rel="noopener noreferrer">
              <span className="k-ext-org">{link.org}</span>
              <strong>{link.name}</strong>
              <span className="k-ext-note">{link.note}</span>
            </a>
          </li>
        ))}
      </ul>

      {set.videos && set.videos.length > 0 ? (
        <div className="k-ext-videos">
          <h3>视频与公开课</h3>
          <div className="k-ext-video-grid">
            {set.videos.map((video) => (
              <a
                className="k-ext-video"
                key={`${video.org}-${video.title}`}
                href={video.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="k-ext-video-meta">
                  {video.org} · {video.length}
                </span>
                <strong>{video.title}</strong>
                <span className="k-ext-note">{video.note}</span>
                <span className="k-ext-go">新窗口打开 ↗</span>
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
