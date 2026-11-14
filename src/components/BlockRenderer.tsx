import type { Block } from "../data/types";
import { Inline } from "./Inline";
import { Figure } from "./figures/Figure";
import { DemoEmbed } from "./ProcessDemo";

const NOTE_LABEL: Record<string, string> = {
  memory: "MEMO",
  caution: "注意",
  verify: "口径",
  exam: "考点",
};

function Note({ block }: { block: Extract<Block, { type: "note" }> }) {
  return (
    <aside className={`note note-${block.tone}`} data-note={block.tone}>
      <div className="note-head">
        <span className="note-tag">{NOTE_LABEL[block.tone]}</span>
        <span className="note-title">{block.title}</span>
      </div>
      <ul>
        {block.lines.map((line) => (
          <li key={line}>
            <Inline text={line} />
          </li>
        ))}
      </ul>
    </aside>
  );
}

function Table({ block }: { block: Extract<Block, { type: "table" }> }) {
  return (
    <div className="table-block">
      <div className="table-scroll">
        <table className="k-table">
          <thead>
            <tr>
              {block.head.map((cell) => (
                <th key={cell}>{cell}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} data-label={block.head[cellIndex] ?? ""}>
                    <Inline text={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {block.caption ? <p className="table-caption">{block.caption}</p> : null}
    </div>
  );
}

export function BlockRenderer({ block, stationId }: { block: Block; stationId?: string }) {
  switch (block.type) {
    case "lead":
      return (
        <p className="lead">
          <Inline text={block.text} />
        </p>
      );
    case "p":
      return (
        <p className="body-p">
          <Inline text={block.text} />
        </p>
      );
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag className={block.ordered ? "body-list ordered" : "body-list"}>
          {block.items.map((item) => (
            <li key={item}>
              <Inline text={item} />
            </li>
          ))}
        </Tag>
      );
    }
    case "table":
      return <Table block={block} />;
    case "note":
      return <Note block={block} />;
    case "definition":
      return (
        <div className="definition">
          <div className="definition-head">
            <span className="definition-term">{block.term}</span>
            {block.en ? <span className="definition-en">{block.en}</span> : null}
          </div>
          <p>
            <Inline text={block.text} />
          </p>
        </div>
      );
    case "figure":
      return (
        <figure className="figure-block">
          <Figure id={block.figure} />
          <figcaption>{block.caption}</figcaption>
        </figure>
      );
    case "photo":
      // 模块同时挂两站时，only 指定只在这一站渲染，避免同一张图出现在两页
      if (block.only && block.only !== stationId) return null;
      return (
        <figure className="photo-block">
          <img src={block.src} alt={block.alt} loading="lazy" decoding="async" />
          <figcaption>
            <span className="photo-caption">
              <Inline text={block.caption} />
            </span>
            <a
              className="photo-credit"
              href={block.href}
              target="_blank"
              rel="noreferrer noopener"
            >
              {block.credit}
            </a>
          </figcaption>
        </figure>
      );
    case "confusion":
      return (
        <div className="confusion">
          {block.items.map((item, index) => (
            <div className="confusion-row" key={`${item.left}-${item.right}`}>
              <span className="confusion-no">{String(index + 1).padStart(2, "0")}</span>
              <div className="confusion-pair">
                <span className="confusion-a">{item.left}</span>
                <span className="confusion-vs">VS</span>
                <span className="confusion-b">{item.right}</span>
              </div>
              <p className="confusion-note">
                <Inline text={item.note} />
              </p>
            </div>
          ))}
        </div>
      );
    case "demo":
      return <DemoEmbed id={block.demo} />;
    case "terms":
      return (
        <dl className="terms">
          {block.items.map((item) => (
            <div className="term-card" key={item.term}>
              <dt>
                {item.term}
                {item.en ? <span className="term-en">{item.en}</span> : null}
              </dt>
              <dd>{item.def}</dd>
            </div>
          ))}
        </dl>
      );
  }
}
