import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import {
  GROUP_LABELS,
  SEARCH_COUNT,
  TERM_COUNT,
  searchIndex,
  type SearchGroup,
} from "../lib/search-index";

const OVERLAY_LIMIT = 6;
const PAGE_LIMIT = 40;

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function Highlight({ text, tokens }: { text: string; tokens: string[] }) {
  if (!tokens.length) return <>{text}</>;
  const pattern = tokens.map(escapeRegExp).join("|");
  const parts = text.split(new RegExp(`(${pattern})`, "gi"));
  const set = new Set(tokens.map((token) => token.toLowerCase()));
  return (
    <>
      {parts.map((part, index) =>
        set.has(part.toLowerCase()) ? <mark key={index}>{part}</mark> : <span key={index}>{part}</span>,
      )}
    </>
  );
}

const GROUP_CHAR: Record<SearchGroup, string> = {
  station: "站",
  term: "典",
};

export function SiteSearch({ mode }: { mode: "overlay" | "page" }) {
  const overlay = mode === "overlay";
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  // 列表滚动会把别的条目送到静止的指针底下，浏览器照样发 mousemove；
  // 记下坐标，坐标没变就不抢键盘光标。
  const pointerRef = useRef({ x: -1, y: -1 });
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const limit = overlay ? OVERLAY_LIMIT : PAGE_LIMIT;
  const groups = useMemo(() => searchIndex(query), [query]);
  const flat = useMemo(
    () =>
      groups.flatMap((group) =>
        (expanded[group.group] ? group.hits : group.hits.slice(0, limit)).map((hit) => ({
          group: group.group,
          hit,
        })),
      ),
    [groups, expanded, limit],
  );
  const total = useMemo(() => groups.reduce((sum, group) => sum + group.total, 0), [groups]);

  useEffect(() => {
    setActive(0);
    setExpanded({});
  }, [query]);

  useEffect(() => {
    if (!overlay) return;
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
        return;
      }
      if (event.key === "/" && !isTypingTarget(event.target)) {
        event.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overlay]);

  useEffect(() => {
    if (!overlay || !open) return;
    inputRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [overlay, open]);

  useEffect(() => {
    if (!overlay) return;
    const target = document.getElementById(`search-hit-${active}`);
    target?.scrollIntoView({ block: "nearest" });
  }, [active, overlay, flat.length]);

  function close() {
    setOpen(false);
  }

  function go(path: string) {
    close();
    // 落点由站点页（锚点）与术语抽屉各自处理，这里不再二次滚动，避免两处抢滚动。
    navigate(path);
  }

  /** 只有指针真的动了才跟随 hover，避免键盘上下移动时被滚动带来的假 hover 打断。 */
  function onHover(event: ReactMouseEvent, index: number) {
    const { clientX, clientY } = event;
    if (pointerRef.current.x === clientX && pointerRef.current.y === clientY) return;
    pointerRef.current = { x: clientX, y: clientY };
    setActive(index);
  }

  function onKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!flat.length) return;
      setActive((value) => (value + 1) % flat.length);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!flat.length) return;
      setActive((value) => (value - 1 + flat.length) % flat.length);
      return;
    }
    if (event.key === "Enter") {
      const item = flat[active];
      if (item) go(item.hit.entry.to);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      // 先收全量，再关面板：Esc 是逐层回退。
      if (Object.values(expanded).some(Boolean)) {
        setExpanded({});
        setActive(0);
        return;
      }
      close();
    }
  }

  /** 展开某组全量：把光标挪到该组第一条，展开后键盘可继续往下走。 */
  function toggleGroup(group: string, offset: number) {
    setExpanded((prev) => ({ ...prev, [group]: !prev[group] }));
    setActive(offset);
    inputRef.current?.focus();
  }

  if (overlay && !open) {
    return (
      <button type="button" className="ke-search-trigger" onClick={() => setOpen(true)}>
        检索
        <span aria-hidden="true">/</span>
      </button>
    );
  }

  let cursor = 0;

  const panel = (
    <div
      className={overlay ? "px-search-panel" : "px-search-panel px-search-panel--page"}
      role="dialog"
      aria-modal={overlay}
      aria-label="全站检索"
    >
      <div className="px-search-bar">
        <span>检索</span>
        <input
          ref={inputRef}
          type="search"
          value={query}
          placeholder="站 / 知识 / 术语"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={onKeyDown}
          aria-label="检索关键词"
        />
        <span className="px-search-key">{overlay ? "Esc 关闭" : `${SEARCH_COUNT} 条`}</span>
      </div>

      <div className="px-search-body">
        {query.trim() ? (
          groups.length ? (
            groups.map((group) => {
              const isOpen = Boolean(expanded[group.group]);
              const visible = isOpen ? group.hits : group.hits.slice(0, limit);
              const offset = cursor;
              cursor += visible.length;
              return (
                <section className="px-search-group" key={group.group} data-group-open={isOpen}>
                  <div className="px-search-group-head">
                    <span>{GROUP_LABELS[group.group]}</span>
                    <em>
                      {group.total} 页
                      {isOpen ? " · 全部" : group.total > visible.length ? ` · 显示前 ${visible.length}` : ""}
                    </em>
                    {group.total > limit ? (
                      <button
                        type="button"
                        className="px-search-more"
                        aria-expanded={isOpen}
                        onClick={() => toggleGroup(group.group, offset)}
                      >
                        {isOpen ? "收起" : `查看全部 ${group.total} 页`}
                      </button>
                    ) : null}
                  </div>
                  {visible.map((hit, index) => {
                    const flatIndex = offset + index;
                    return (
                      <Link
                        id={`search-hit-${flatIndex}`}
                        key={hit.entry.key}
                        to={hit.entry.to}
                        className={`px-search-hit${flatIndex === active ? " is-on" : ""}`}
                        onMouseMove={(event) => onHover(event, flatIndex)}
                        onClick={() => close()}
                      >
                        <span className="px-search-hit-char">{hit.entry.char || GROUP_CHAR[group.group]}</span>
                        <span className="px-search-hit-title">
                          {hit.entry.title}
                          <span>{hit.entry.meta}</span>
                        </span>
                        <span className="px-search-hit-snippet">
                          <Highlight text={hit.snippet} tokens={hit.tokens} />
                        </span>
                      </Link>
                    );
                  })}
                </section>
              );
            })
          ) : (
            <p className="px-search-empty">没有匹配。换一个词，或减少关键词再搜。</p>
          )
        ) : (
          <div className="px-search-hint">
            共 {SEARCH_COUNT} 条索引，覆盖六站正文、必需动作与判据、边缘条目、知识块与 {TERM_COUNT} 条术语。
            <br />
            试试：<b>Sanger</b>、<b>洗膜</b>、<b>感受态</b>、<b>酶切</b>、<b>蓝白斑</b>。
          </div>
        )}
      </div>

      <div className="px-search-foot">
        <span>{query.trim() ? `命中 ${total} 页` : `${SEARCH_COUNT} 条索引`}</span>
        <span>↑↓ 选择 · Enter 打开 · Esc 回退</span>
        {overlay ? <span>Ctrl / ⌘ + K 唤起 · Esc 关闭</span> : null}
      </div>
    </div>
  );

  if (!overlay) return panel;

  // 浮层挂到 body：页眉自身是一个层叠上下文，留在里面会被正文盖住。
  return createPortal(
    <div
      className="px-search-veil"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      {panel}
    </div>,
    document.body,
  );
}
