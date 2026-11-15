#!/usr/bin/env node
/**
 * 两层模型的单一事实源校验。
 * 数据：src/data/flow/steps.json（内部八步骨架）+ six-process.json（对外六站口径）
 *      + knowledge.json（挂在步骤上的知识）+ stations/*.json（六站站内必需/边缘）
 * 规则：内部骨架 6–8 步；对外恰好六站，站 id = 工序 id，站点 steps 与工序 steps 一致；
 *      知识模块必须声明 hook（内部步骤 id），且 hook 落在某一站；载体知识不得单独成站。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FLOW_DIR = path.join(ROOT, "src", "data", "flow");
const STATION_DIR = path.join(FLOW_DIR, "stations");
const NODE_DIR = path.join(ROOT, "src", "data", "map", "nodes");

const BLOCK_TYPES = new Set([
  "p",
  "lead",
  "list",
  "table",
  "note",
  "definition",
  "figure",
  "confusion",
  "terms",
  "demo",
  "photo",
]);
const DEMO_IDS = new Set(["pcr", "digest", "ligase", "transform", "sbs", "western", "crispr"]);
const NOTE_TONES = new Set(["memory", "caution", "verify", "exam"]);
const FIGURES = new Set([
  "plasmid-puc18",
  "plasmid-pbr322",
  "lambda-genome",
  "vector-capacity",
  "plate-blue-white",
  "gel-migration",
  "restriction-site",
  "dna-ends",
  "plasmid-general",
  "pcr-cycles",
  "ligation-ends",
  "overlap-assembly",
  "ni-nta",
  "yeast-factory",
  "blot-transfer",
  "qpcr-curve",
  "sanger-ladder",
  "illumina-sbs",
  "nanopore",
  "yeast-two-hybrid",
  "delivery-methods",
  "ti-plasmid",
  "alpha-complement",
  "ssh-suppression",
  "sec-tat",
  "inclusion-refold",
]);
const STEP_NO = /^\d{2}$/;
const KNOWLEDGE_IN_TITLE = /载体|质粒|工具酶|元件|标记基因/;

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
let photoUsage = new Map();
const isText = (value, min = 1) => typeof value === "string" && value.trim().length >= min;
const clone = (value) => {
  if (value instanceof Map) {
    return new Map([...value].map(([key, entry]) => [key, clone(entry)]));
  }
  if (Array.isArray(value)) return value.map(clone);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, clone(entry)]));
  }
  return value;
};

function loadData() {
  const flow = readJson(path.join(FLOW_DIR, "steps.json"));
  const knowledge = readJson(path.join(FLOW_DIR, "knowledge.json"));
  const processFile = readJson(path.join(FLOW_DIR, "six-process.json"));
  const stations = fs
    .readdirSync(STATION_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) => ({ file, data: readJson(path.join(STATION_DIR, file)) }));
  const nodes = new Map(
    fs
      .readdirSync(NODE_DIR)
      .filter((file) => file.endsWith(".json"))
      .map((file) => {
        const node = readJson(path.join(NODE_DIR, file));
        return [node.id, node];
      })
  );
  return { flow, knowledge, stations, nodes, processFile };
}

function checkPhoto(block, at, errors) {
  if (!isText(block.src, 8) || !block.src.startsWith("/assets/figures/")) {
    errors.push(`${at}: 图片路径须以 /assets/figures/ 开头（${block.src}）`);
    return;
  }
  if (!fs.existsSync(path.join(ROOT, "public", block.src))) {
    errors.push(`${at}: 图片文件不存在 ${block.src}`);
  }
  if (!isText(block.alt, 4)) errors.push(`${at}: 缺少替代文本`);
  if (!isText(block.caption, 8)) errors.push(`${at}: 缺少图注`);
  if (!isText(block.credit, 4)) errors.push(`${at}: 缺少出处`);
  if (!isText(block.href, 8) || !block.href.startsWith("https://")) {
    errors.push(`${at}: 出处链接须为 https 绝对地址`);
  }
  if (block.only !== undefined && !isText(block.only, 2)) {
    errors.push(`${at}: only 须为站 id`);
  }
  const seen = photoUsage.get(block.src);
  if (seen) errors.push(`${at}: 同一张图已用于 ${seen}，不得重复贴 ${block.src}`);
  else photoUsage.set(block.src, at);
}

function checkBlocks(blocks, where, errors) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    errors.push(`${where}: 正文块为空`);
    return;
  }
  blocks.forEach((block, index) => {
    const at = `${where} 第 ${index + 1} 块`;
    if (!block || !BLOCK_TYPES.has(block.type)) {
      errors.push(`${at}: 未知块类型 ${block?.type}`);
      return;
    }
    if ((block.type === "p" || block.type === "lead") && !isText(block.text, 4)) {
      errors.push(`${at}: 段落为空`);
    }
    if (block.type === "list" && (!Array.isArray(block.items) || block.items.length < 2)) {
      errors.push(`${at}: 列表少于 2 项`);
    }
    if (block.type === "table") {
      if (!Array.isArray(block.head) || block.head.length < 2) errors.push(`${at}: 表头不完整`);
      if (!Array.isArray(block.rows) || block.rows.length < 1) errors.push(`${at}: 表格无数据行`);
    }
    if (block.type === "note") {
      if (!NOTE_TONES.has(block.tone)) errors.push(`${at}: 非法提示卡语气 ${block.tone}`);
      if (!isText(block.title, 2)) errors.push(`${at}: 提示卡缺少标题`);
      if (!Array.isArray(block.lines) || block.lines.length < 1) errors.push(`${at}: 提示卡无内容`);
    }
    if (block.type === "definition" && (!isText(block.term, 1) || !isText(block.text, 6))) {
      errors.push(`${at}: 术语定义不完整`);
    }
    if (block.type === "figure" && !FIGURES.has(block.figure)) {
      errors.push(`${at}: 未注册的图谱 ${block.figure}`);
    }
    if (block.type === "terms" && (!Array.isArray(block.items) || block.items.length < 2)) {
      errors.push(`${at}: 术语卡少于 2 项`);
    }
    if (block.type === "confusion" && (!Array.isArray(block.items) || block.items.length < 1)) {
      errors.push(`${at}: 易混对照为空`);
    }
    if (block.type === "demo" && !DEMO_IDS.has(block.demo)) {
      errors.push(`${at}: 未注册的演示 ${block.demo}`);
    }
    if (block.type === "photo") checkPhoto(block, at, errors);
  });
}

function validate({ flow, knowledge, stations, nodes, processFile }) {
  const errors = [];
  photoUsage = new Map();
  const steps = Array.isArray(flow?.steps) ? flow.steps : [];
  const stepIds = new Set();

  if (!isText(flow?.title, 4)) errors.push("骨架缺少标题");
  if (steps.length < 6 || steps.length > 8) {
    errors.push(`骨架应有 6–8 步，实际 ${steps.length}`);
  }

  steps.forEach((step, index) => {
    const where = `骨架第 ${index + 1} 步`;
    if (!isText(step.id, 2)) errors.push(`${where}: 缺少 id`);
    if (stepIds.has(step.id)) errors.push(`${where}: 步骤 id 重复 ${step.id}`);
    stepIds.add(step.id);
    if (step.no !== index + 1) errors.push(`${where}: 序号应连续，实际 ${step.no}`);
    if (!isText(step.title, 2)) errors.push(`${where}: 缺少标题`);
    if (KNOWLEDGE_IN_TITLE.test(step.title ?? "")) {
      errors.push(`${where}: 步骤标题不得是知识分类（${step.title}）`);
    }
    if (!isText(step.en, 2)) errors.push(`${where}: 缺少英文标记`);
    if (!isText(step.oneLine, 8)) errors.push(`${where}: 缺少一句话说明`);
  });

  // 对外六站：正好六条工序，且把内部八步恰好归一次；这是站点/导航的唯一口径。
  const processes = Array.isArray(processFile?.processes) ? processFile.processes : [];
  if (processes.length !== 6) errors.push(`六站应有 6 条工序，实际 ${processes.length}`);
  const processIds = new Set();
  const mappedSteps = new Set();
  processes.forEach((process, index) => {
    const where = `工序第 ${index + 1} 条`;
    if (!isText(process.id, 2)) errors.push(`${where}: 缺少 id`);
    if (processIds.has(process.id)) errors.push(`${where}: 工序 id 重复 ${process.id}`);
    processIds.add(process.id);
    ["char", "title", "en", "gloss"].forEach((key) => {
      if (!isText(process[key], 1)) errors.push(`${where}: 字段 ${key} 缺失`);
    });
    if (isText(process.char, 1) && [...process.char].length !== 1) {
      errors.push(`${where}: 工序字应为单字（${process.char}）`);
    }
    const list = Array.isArray(process.steps) ? process.steps : [];
    if (list.length === 0) errors.push(`${where}: 没有归入任何步骤`);
    list.forEach((stepId) => {
      if (!stepIds.has(stepId)) errors.push(`${where}: 引用了未注册的步骤 ${stepId}`);
      if (mappedSteps.has(stepId)) errors.push(`${where}: 步骤 ${stepId} 被重复归工序`);
      mappedSteps.add(stepId);
    });
  });
  stepIds.forEach((stepId) => {
    if (!mappedSteps.has(stepId)) errors.push(`步骤 ${stepId}: 没有归入任何工序`);
  });

  // 用户定案的口径：05 与 08 同属「增」，06 单属「养」。
  const processOfStep = new Map();
  processes.forEach((process) => {
    (process.steps ?? []).forEach((stepId) => processOfStep.set(stepId, process.id));
  });
  if (processOfStep.get("select") !== processOfStep.get("apply")) {
    errors.push("工序口径：挑重组子(05)与用起来(08)应同属「增」");
  }
  if (processOfStep.get("express") === processOfStep.get("select")) {
    errors.push("工序口径：表达(06)应单属「养」，不能并入「增」");
  }

  // 对外只认六站；旧八站文件不允许再出现。
  const RETIRED_STATIONS = ["target", "cut", "ligate", "deliver", "select", "express", "verify", "apply"];
  RETIRED_STATIONS.forEach((id) => {
    if (fs.existsSync(path.join(STATION_DIR, `${id}.json`))) {
      errors.push(`旧八站文件 stations/${id}.json 应删除，内容已并入六站`);
    }
  });

  const stationStepIds = new Set();
  const stationIds = new Set();
  stations.forEach(({ file, data: station }) => {
    const where = `站 ${station.id ?? file}`;
    if (`${station.id}.json` !== file) errors.push(`${where}: 文件名与站 id 不一致`);
    if (stationIds.has(station.id)) errors.push(`${where}: 站 id 重复`);
    stationIds.add(station.id);

    const processIndex = processes.findIndex((process) => process.id === station.id);
    if (processIndex < 0) {
      errors.push(`${where}: 站 id 必须是六站之一（qie/jie/zhuan/zeng/jian/yang）`);
    } else {
      const process = processes[processIndex];
      if (station.no !== processIndex + 1) {
        errors.push(`${where}: 站号与工序不一致（${station.no} ≠ ${processIndex + 1}）`);
      }
      if (station.char !== process.char) {
        errors.push(`${where}: 站字与工序不一致（${station.char} ≠ ${process.char}）`);
      }
      const mine = Array.isArray(station.steps) ? station.steps : [];
      if (mine.length === 0) errors.push(`${where}: 缺少 steps，答不出归并了内部哪几步`);
      const expect = [...(process.steps ?? [])].sort().join(",");
      if ([...mine].sort().join(",") !== expect) {
        errors.push(`${where}: steps 与工序归并不一致（${mine.join("+")} ≠ ${expect.replace(/,/g, "+")}）`);
      }
      mine.forEach((stepId) => {
        if (!stepIds.has(stepId)) errors.push(`${where}: steps 引用了未注册的步骤 ${stepId}`);
        stationStepIds.add(stepId);
      });
    }

    [
      ["title", 2],
      ["en", 2],
      ["kicker", 6],
      ["question", 8],
      ["summary", 20],
      ["position", 30],
      ["source", 6],
    ].forEach(([key, min]) => {
      if (!isText(station[key], min)) errors.push(`${where}: 字段 ${key} 缺失或过短`);
    });

    const mustSteps = station.must?.steps;
    if (!Array.isArray(mustSteps) || mustSteps.length < 3) {
      errors.push(`${where}: 必需档至少 3 个动作`);
    } else {
      const nos = new Set();
      mustSteps.forEach((item) => {
        const at = `${where} 必需 ${item.no}`;
        if (!STEP_NO.test(item.no ?? "")) errors.push(`${at}: 动作号必须是两位数字`);
        if (nos.has(item.no)) errors.push(`${at}: 动作号重复`);
        nos.add(item.no);
        if (!isText(item.title, 2)) errors.push(`${at}: 缺少动作标题`);
        if (!isText(item.body, 10)) errors.push(`${at}: 缺少动作说明`);
        if (!isText(item.check, 6)) errors.push(`${at}: 缺少判断`);
      });
    }
    if (!isText(station.must?.lead, 10)) errors.push(`${where}: 必需档缺少导读`);
    if (!isText(station.must?.gate, 10)) errors.push(`${where}: 必需档缺少门槛`);

    const edgeItems = station.edge?.items;
    if (!Array.isArray(edgeItems) || edgeItems.length < 5) {
      errors.push(`${where}: 边缘档至少 5 条`);
    } else {
      edgeItems.forEach((item) => {
        const at = `${where} 边缘「${item.title ?? "无标题"}」`;
        if (!isText(item.label, 2)) errors.push(`${at}: 缺少分类标签`);
        if (!isText(item.title, 2)) errors.push(`${at}: 缺少标题`);
        if (!isText(item.text, 12)) errors.push(`${at}: 缺少说明`);
        if (item.pending && item.pendingNote !== "待核对") {
          errors.push(`${at}: 待核对条目必须标「待核对」`);
        }
      });
    }
    if (!isText(station.edge?.lead, 10)) errors.push(`${where}: 边缘档缺少导读`);
    if (!isText(station.bridge?.from, 8)) errors.push(`${where}: 缺少承上`);
    if (!isText(station.bridge?.to, 8)) errors.push(`${where}: 缺少启下`);
  });

  const moduleIds = new Set();
  const allModules = [];
  const usedNodeIds = new Set();

  function walk(modules, depth, label) {
    if (!Array.isArray(modules)) return;
    if (depth > 4) {
      errors.push(`${label}: 知识嵌套超过 4 层`);
      return;
    }
    modules.forEach((module) => {
      const where = `${label}模块 ${module.id ?? "（无 id）"}`;
      if (!isText(module.id, 2)) errors.push(`${where}: 缺少 id`);
      if (moduleIds.has(module.id)) errors.push(`${where}: 模块 id 重复`);
      moduleIds.add(module.id);
      allModules.push(module);

      if (!isText(module.title, 2)) errors.push(`${where}: 缺少标题`);
      if (!isText(module.en, 2)) errors.push(`${where}: 缺少英文标记`);
      if (!isText(module.summary, 10)) errors.push(`${where}: 缺少摘要`);
      if (!isText(module.note, 10)) errors.push(`${where}: 缺少补位说明（补的是哪一步）`);
      if (!Array.isArray(module.hooks) || module.hooks.length === 0) {
        errors.push(`${where}: 没有 hook，答不出补的是哪一步`);
      } else {
        module.hooks.forEach((hook) => {
          if (!stepIds.has(hook)) errors.push(`${where}: 引用了未注册的步骤 ${hook}`);
        });
        if (!module.hooks.some((hook) => stationStepIds.has(hook))) {
          errors.push(`${where}: 所有 hook 都没有已铺的站，知识无处展开`);
        }
      }

      const nodeList = Array.isArray(module.nodes) ? module.nodes : [];
      nodeList.forEach((nodeId) => {
        if (!nodes.has(nodeId)) errors.push(`${where}: 引用了不存在的节点 ${nodeId}`);
      });
      const hasInline = Array.isArray(module.blocks) && module.blocks.length > 0;
      if (nodeList.length === 0 && !hasInline) errors.push(`${where}: 模块没有正文`);

      // 位图的 only 必须是本模块挂的站之一，否则永远不显示
      nodeList.forEach((nodeId) => {
        const node = nodes.get(nodeId);
        (node?.blocks ?? []).forEach((block, index) => {
          if (block?.type !== "photo" || block.only === undefined) return;
          if (!stepIds.has(block.only)) {
            errors.push(`节点 ${nodeId} 第 ${index + 1} 块: only 引用了未注册的站 ${block.only}`);
          } else if (!module.hooks?.includes(block.only)) {
            errors.push(
              `节点 ${nodeId} 第 ${index + 1} 块: only=${block.only} 不在模块 ${module.id} 的 hook 里，图不会显示`
            );
          }
        });
      });
      nodeList.forEach((nodeId) => usedNodeIds.add(nodeId));

      if (hasInline) checkBlocks(module.blocks, `${where} 正文`, errors);
      if (Array.isArray(module.children) && module.children.length > 0) {
        walk(module.children, depth + 1, `${where} › `);
      }
    });
  }

  walk(knowledge.modules, 1, "");

  const topModules = Array.isArray(knowledge.modules) ? knowledge.modules : [];
  const vector = topModules.find((module) => module.id === "vector");
  if (!vector) {
    errors.push("缺少载体总论模块：载体知识必须挂在步骤上");
  } else {
    ["ligate", "deliver"].forEach((hook) => {
      if (!vector.hooks?.includes(hook)) {
        errors.push(`载体知识必须同时挂「接起来」和「送进宿主」，缺少 ${hook}`);
      }
    });
    const plasmid = vector.children?.find((module) => module.id === "plasmid");
    if (!plasmid) errors.push("载体总论下缺少质粒模块");
    else {
      ["pbr322", "puc18"].forEach((id) => {
        const child = plasmid.children?.find((module) => module.id === id);
        if (!child) errors.push(`质粒模块下缺少 ${id}`);
        else if (!child.hooks?.includes("ligate") || !child.hooks?.includes("deliver")) {
          errors.push(`${id} 必须同时挂「接起来」和「送进宿主」`);
        }
      });
    }
  }

  const stationHooks = new Set();
  const collectHooks = (modules) => {
    modules.forEach((module) => {
      (module.hooks ?? []).forEach((hook) => stationHooks.add(hook));
      if (Array.isArray(module.children)) collectHooks(module.children);
    });
  };
  collectHooks(allModules);
  stations.forEach(({ data: station }) => {
    const stepsOfStation = Array.isArray(station.steps) ? station.steps : [];
    const visible = stepsOfStation.some((stepId) => stationHooks.has(stepId));
    if (!visible) errors.push(`站 ${station.id}: 没有任何知识模块挂在这一站`);
  });

  // 节点正文里的位图：路径、图注、出处与「一张图只贴一处」
  nodes.forEach((node) => {
    const blocks = Array.isArray(node.blocks) ? node.blocks : [];
    const hasPhoto = blocks.some((block) => block?.type === "photo");
    if (hasPhoto && !usedNodeIds.has(node.id)) {
      errors.push(`节点 ${node.id}: 没有模块引用，里面的图不会显示`);
    }
    blocks.forEach((block, index) => {
      if (block?.type === "photo") {
        checkPhoto(block, `节点 ${node.id} 第 ${index + 1} 块`, errors);
      }
    });
  });

  return errors;
}

const data = loadData();
const errors = validate(data);

if (errors.length) {
  console.error(`validate 失败，共 ${errors.length} 项：`);
  errors.forEach((message) => console.error(`  ✗ ${message}`));
  process.exit(1);
}

const cases = [];
const addCase = (name, mutate, expect) => cases.push({ name, mutate, expect });

addCase("步骤写成知识分类", (d) => { d.flow.steps[2].title = "载体总览"; }, "不得是知识分类");
addCase("骨架超过八步", (d) => { d.flow.steps.push(clone(d.flow.steps[0])); }, "6–8");
addCase("必需档为空", (d) => { d.stations[0].data.must.steps = []; }, "至少 3 个动作");
addCase("模块没有 hook", (d) => { d.knowledge.modules[0].hooks = []; }, "没有 hook");
addCase("hook 未注册", (d) => { d.knowledge.modules[0].hooks = ["ghost"]; }, "未注册的步骤");
addCase("引用不存在的节点", (d) => { d.knowledge.modules.find((m) => m.id === "vector").nodes.push("ghost-node"); }, "不存在的节点");
addCase("模块 id 重复", (d) => { d.knowledge.modules.push(clone(d.knowledge.modules[0])); }, "模块 id 重复");
addCase("边缘条数不足", (d) => { d.stations[0].data.edge.items = d.stations[0].data.edge.items.slice(0, 4); }, "至少 5 条");
addCase("待核对未标记", (d) => {
  const item = d.stations[0].data.edge.items[0];
  item.pending = true;
  item.pendingNote = "";
}, "必须标「待核对」");
addCase("载体只挂一站", (d) => { d.knowledge.modules.find((m) => m.id === "vector").hooks = ["ligate"]; }, "必须同时挂");
addCase("站号与工序不一致", (d) => { d.stations[0].data.no = 9; }, "站号与工序不一致");
addCase("站点归并口径不符", (d) => {
  const qie = d.stations.find(({ data }) => data.id === "qie");
  qie.data.steps = ["target"];
}, "steps 与工序归并不一致");
addCase("旧八站文件残留", (d) => {
  d.stations.push({ file: "cut.json", data: clone(d.stations[0].data) });
  d.stations[d.stations.length - 1].data.id = "cut";
}, "站 id 必须是六站之一");
addCase("模块没有正文", (d) => {
  const module = d.knowledge.modules.find((m) => m.id === "ligation");
  module.blocks = [];
}, "模块没有正文");
addCase("缺少补位说明", (d) => { delete d.knowledge.modules[0].note; }, "补位说明");
addCase("步骤被重复归工序", (d) => { d.processFile.processes[1].steps.push("target"); }, "被重复归工序");
addCase("步骤漏归工序", (d) => { d.processFile.processes[0].steps = ["target"]; }, "没有归入任何工序");
addCase("工序字不是单字", (d) => { d.processFile.processes[0].char = "切开"; }, "单字");
addCase("挑重组子与用起来分属两序", (d) => {
  const zeng = d.processFile.processes.find((p) => p.id === "zeng");
  const yang = d.processFile.processes.find((p) => p.id === "yang");
  zeng.steps = zeng.steps.filter((id) => id !== "apply");
  yang.steps.push("apply");
}, "同属「增」");
addCase("表达并入增", (d) => {
  const zeng = d.processFile.processes.find((p) => p.id === "zeng");
  const yang = d.processFile.processes.find((p) => p.id === "yang");
  yang.steps = yang.steps.filter((id) => id !== "express");
  zeng.steps.push("express");
}, "不能并入「增」");
const selfPhoto = () => ({
  type: "photo",
  src: "/assets/figures/pdb-ecori.webp",
  alt: "负向自测占位图",
  caption: "负向自测占位图，不参与正式数据",
  credit: "自测",
  href: "https://example.com",
});
addCase("图片文件不存在", (d) => {
  const node = d.nodes.get("deliver-physical");
  const photo = node.blocks.find((block) => block.type === "photo") ?? selfPhoto();
  if (!node.blocks.includes(photo)) node.blocks.push(photo);
  photo.src = "/assets/figures/ghost.webp";
}, "图片文件不存在");
addCase("同一张图重复贴", (d) => {
  const node = d.nodes.get("deliver-physical");
  const photo = node.blocks.find((block) => block.type === "photo") ?? selfPhoto();
  if (!node.blocks.includes(photo)) node.blocks.push(photo);
  node.blocks.push(clone(photo));
}, "不得重复贴");
addCase("only 与 hook 不符", (d) => {
  const node = d.nodes.get("part-host");
  const photo = node.blocks.find((block) => block.type === "photo") ?? selfPhoto();
  if (!node.blocks.includes(photo)) node.blocks.push(photo);
  photo.only = "target";
}, "图不会显示");

const failures = [];
console.log("负向自测：");
cases.forEach((item) => {
  const mutated = clone(data);
  item.mutate(mutated);
  const found = validate(mutated).some((message) => message.includes(item.expect));
  if (found) console.log(`  ✓ ${item.name}`);
  else {
    console.log(`  ✗ ${item.name}（应报「${item.expect}」）`);
    failures.push(item.name);
  }
});

const stationCount = data.stations.length;
const mustCount = data.stations.reduce((total, { data: station }) => total + station.must.steps.length, 0);
const edgeCount = data.stations.reduce((total, { data: station }) => total + station.edge.items.length, 0);
const topCount = data.knowledge.modules.length;
const allCount = (() => {
  let count = 0;
  const walk = (modules) => {
    modules.forEach((module) => {
      count += 1;
      walk(module.children ?? []);
    });
  };
  walk(data.knowledge.modules);
  return count;
})();

console.log(
  `\n✓ validate 通过：骨架 ${data.flow.steps.length} 步 · 已铺 ${stationCount} 站 · 必需 ${mustCount} 个动作 · 知识 ${topCount} 组 / ${allCount} 个模块 · 边缘 ${edgeCount} 条 · 节点库 ${data.nodes.size} 个 · 工序 ${data.processFile.processes.length} 条`
);
console.log(`✓ 负向自测 ${cases.length - failures.length} / ${cases.length} 条按预期报错`);

if (failures.length) process.exit(1);
