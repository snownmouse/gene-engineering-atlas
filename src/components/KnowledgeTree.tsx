import { Link } from "react-router-dom";
import { blocksForModule, countModules } from "../data/flow";
import type { KnowledgeModule } from "../data/flow/types";

type Props = {
  modules: KnowledgeModule[];
  stationId: string;
  depth?: number;
};

/** 知识树的目录形态：父模块下挂子节点，缩进与引线都保留，不并成平铺。 */
export function KnowledgeTree({ modules, stationId, depth = 0 }: Props) {
  return (
    <ol className={`k-tree${depth > 0 ? " is-child" : ""}`}>
      {modules.map((module, index) => (
        <KnowledgeTreeNode
          key={module.id}
          module={module}
          stationId={stationId}
          depth={depth}
          index={index}
        />
      ))}
    </ol>
  );
}

function KnowledgeTreeNode({
  module,
  stationId,
  depth,
  index,
}: {
  module: KnowledgeModule;
  stationId: string;
  depth: number;
  index: number;
}) {
  const children = module.children ?? [];
  const total = countModules(children);

  return (
    <li className="k-tree-node" data-k-node={module.id} data-k-depth={depth}>
      <Link className="k-node-link" to={`/station/${stationId}/k/${module.id}`}>
        <span className="k-node-no">{depth === 0 ? String(index + 1).padStart(2, "0") : "·"}</span>
        <span className="k-node-main">
          <span className="k-node-en">{module.en}</span>
          <span className="k-node-title">{module.title}</span>
          <span className="k-node-summary">{module.summary}</span>
        </span>
        <span className="k-node-meta">
          {children.length > 0 ? `子模块 ${total} 则` : `${blocksForModule(module).length} 段`}
        </span>
      </Link>

      {children.length > 0 && (
        <KnowledgeTree modules={children} stationId={stationId} depth={depth + 1} />
      )}
    </li>
  );
}
