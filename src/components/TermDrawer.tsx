import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { flattenModules, modulesFor, processForStation } from "../data/flow";
import { itemForTerm } from "../data/flow/items";
import { searchTerms, termProcessLabels, termsOfProcess } from "../data/terms";

type Props = {
  stationId: string;
};

/** 站内术语抽屉：词条按工序挂在站上，数据仍来自 glossary.ts。 */
export function TermDrawer({ stationId }: Props) {
  const process = processForStation(stationId);
  const terms = useMemo(() => termsOfProcess(stationId), [stationId]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("");

  const listRef = useRef<HTMLUListElement | null>(null);
  const lastStation = useRef(stationId);

  const filtered = useMemo(() => searchTerms(query).filter((term) => terms.includes(term)), [query, terms]);
  const moduleIds = useMemo(
    () => flattenModules(modulesFor(stationId)).map((module) => module.id),
    [stationId],
  );

  // 换站才重置抽屉；首次挂载不重置，否则会把下面 fromHash 打开的抽屉立刻关掉。
  useEffect(() => {
    if (lastStation.current === stationId) return;
    lastStation.current = stationId;
    setOpen(false);
    setQuery("");
    setActive("");
  }, [stationId]);

  useEffect(() => {
    function fromHash() {
      const match = window.location.hash.match(/^#term-(.+)$/);
      if (!match) return;
      const id = match[1];
      if (!terms.some((term) => term.id === id)) return;
      setOpen(true);
      setActive(id);
      setQuery("");
    }
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [terms]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open || !active) return;
    const node = listRef.current?.querySelector(`#term-${CSS.escape(active)}`);
    node?.scrollIntoView({ block: "center" });
  }, [open, active, filtered.length]);

  if (!process) return null;

  return (
    <>
      <button
        type="button"
        className="term-trigger"
        data-term-trigger
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        术语
        <b>{terms.length}</b>
      </button>

      {open &&
        createPortal(
          <div
            className="term-veil"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
          <aside className="term-drawer" role="dialog" aria-modal="true" aria-label="站内术语" data-term-drawer>
            <header className="term-drawer-head">
              <span className="term-drawer-char" aria-hidden="true">
                {process.char}
              </span>
              <div>
                <h2>术语 · {process.title}</h2>
                <p>{process.gloss}</p>
              </div>
              <button type="button" className="term-close" onClick={() => setOpen(false)}>
                关闭
              </button>
            </header>

            <div className="term-filter">
              <input
                type="search"
                value={query}
                placeholder="在本工序术语里找"
                aria-label="检索术语"
                onChange={(event) => setQuery(event.target.value)}
              />
              <span>
                {filtered.length} / {terms.length} 条
              </span>
            </div>

            {filtered.length ? (
              <ul className="term-list" ref={listRef}>
                {filtered.map((term) => (
                  <li
                    key={term.id}
                    id={`term-${term.id}`}
                    className={`term-item${term.id === active ? " is-on" : ""}`}
                    data-term={term.id}
                  >
                    <div className="term-head">
                      <b>{term.zh}</b>
                      <span className="term-en">
                        {term.en}
                        {term.abbr ? ` · ${term.abbr}` : ""}
                      </span>
                      <em>{termProcessLabels(term).join(" · ")}</em>
                    </div>
                    <p className="term-def">{term.def}</p>
                    {term.aliases?.length ? (
                      <p className="term-alias">又称 {term.aliases.join("、")}</p>
                    ) : null}
                    {(() => {
                      const link = itemForTerm(
                        term.id,
                        moduleIds,
                        `${term.zh} ${term.en} ${term.abbr ?? ""}`,
                      );
                      if (!link) return null;
                      return (
                        <Link
                          className="term-item-link"
                          to={`/station/${stationId}/k/${link.moduleId}#item-${link.item.id}`}
                          onClick={() => setOpen(false)}
                        >
                          页 · {link.item.title} →
                        </Link>
                      );
                    })()}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="term-empty">没有匹配。换一个词，或清空再找。</p>
            )}

            <footer className="term-drawer-foot">
              <span>共 {terms.length} 条 · 工序「{process.char}」</span>
              <span>Esc 关闭</span>
            </footer>
          </aside>
        </div>,
          document.body,
        )}
    </>
  );
}
