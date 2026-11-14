import type { ReactNode } from "react";
import { Link } from "react-router-dom";

/**
 * 行内标记解析：支持 **加粗**、`等宽` 与 [文字](站内路径) 链接，不注入 HTML。
 * 数据层用这些标记标注术语、基因名与自测题回链，渲染层负责落到样式。
 */
export function Inline({ text }: { text: string }) {
  const parts = text
    .split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g)
    .filter(Boolean);
  return (
    <>
      {parts.map((part, index): ReactNode => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code className="inline-code" key={index}>
              {part.slice(1, -1)}
            </code>
          );
        }
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          const [, label, href] = link;
          if (href.startsWith("/")) {
            return (
              <Link className="inline-link" to={href} key={index}>
                {label}
              </Link>
            );
          }
          return (
            <a className="inline-link" href={href} target="_blank" rel="noreferrer" key={index}>
              {label}
            </a>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}
