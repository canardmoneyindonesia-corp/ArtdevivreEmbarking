import { jsPDF } from "jspdf";
import { Answers, FormSchema, Question } from "./form-schema";
import { Block, QuestionLeafBlock, Step as BriefStep } from "./brief-schema";
import { UseBriefState } from "./use-brief-state";

const PAGE_MARGIN_X = 60;
const PAGE_MARGIN_TOP = 70;
const PAGE_MARGIN_BOTTOM = 60;
const LINE_HEIGHT = 16;

function formatAnswer(question: Question, value: Answers[string]): string {
  if (value === undefined || value === null || value === "") {
    return "—";
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return "—";
    const labels = value.map((v) => {
      const opt = question.options?.find((o) => o.value === v);
      return opt ? opt.label : v;
    });
    return labels.join(", ");
  }
  if (question.type === "single-select" && question.options) {
    const opt = question.options.find((o) => o.value === value);
    return opt ? opt.label : String(value);
  }
  return String(value);
}

function getMaisonName(answers: Answers): string {
  const v = answers["maison_name"];
  if (typeof v === "string" && v.trim().length > 0) {
    return v.trim();
  }
  return "Sans-nom";
}

function buildFilename(answers: Answers): string {
  const name = getMaisonName(answers)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `Discovery-${name || "Sans-nom"}-${yyyy}-${mm}-${dd}.pdf`;
}

export function generatePdf(schema: FormSchema, answers: Answers) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - PAGE_MARGIN_X * 2;
  let y = PAGE_MARGIN_TOP;

  function ensureSpace(needed: number) {
    if (y + needed > pageHeight - PAGE_MARGIN_BOTTOM) {
      doc.addPage();
      y = PAGE_MARGIN_TOP;
    }
  }

  // Title
  doc.setFont("times", "normal");
  doc.setFontSize(22);
  doc.text("Formulaire de découverte", PAGE_MARGIN_X, y);
  y += 26;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(110);
  const dateStr = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  doc.text(`Récapitulatif — ${dateStr}`, PAGE_MARGIN_X, y);
  y += 24;
  doc.setTextColor(0);

  // Group questions by sectionLabel preserving order
  const groups: { label: string; questions: Question[] }[] = [];
  for (const q of schema.questions) {
    let g = groups.find((x) => x.label === q.sectionLabel);
    if (!g) {
      g = { label: q.sectionLabel, questions: [] };
      groups.push(g);
    }
    g.questions.push(q);
  }

  for (const group of groups) {
    ensureSpace(40);
    // Section header
    doc.setFont("times", "bold");
    doc.setFontSize(13);
    doc.text(group.label.toUpperCase(), PAGE_MARGIN_X, y);
    y += 6;
    doc.setDrawColor(180);
    doc.line(PAGE_MARGIN_X, y, PAGE_MARGIN_X + contentWidth, y);
    y += 18;

    for (const q of group.questions) {
      // Question text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(60);
      const qLines = doc.splitTextToSize(q.question, contentWidth);
      ensureSpace(qLines.length * LINE_HEIGHT + 8);
      doc.text(qLines, PAGE_MARGIN_X, y);
      y += qLines.length * LINE_HEIGHT * 0.9;

      // Answer text
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(20);
      const answerText = formatAnswer(q, answers[q.id]);
      const aLines = doc.splitTextToSize(answerText, contentWidth);
      ensureSpace(aLines.length * LINE_HEIGHT + 12);
      doc.text(aLines, PAGE_MARGIN_X, y);
      y += aLines.length * LINE_HEIGHT + 10;
    }

    y += 12;
  }

  doc.save(buildFilename(answers));
}

export function generateBriefPdf(steps: BriefStep[], state: UseBriefState) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - PAGE_MARGIN_X * 2;
  let y = PAGE_MARGIN_TOP;

  function ensureSpace(needed: number) {
    if (y + needed > pageHeight - PAGE_MARGIN_BOTTOM) {
      doc.addPage();
      y = PAGE_MARGIN_TOP;
    }
  }

  function writeLines(text: string, indent = 0) {
    const lines = doc.splitTextToSize(text, contentWidth - indent);
    ensureSpace(lines.length * LINE_HEIGHT + 6);
    doc.text(lines, PAGE_MARGIN_X + indent, y);
    y += lines.length * LINE_HEIGHT + 4;
  }

  function renderLeaf(block: QuestionLeafBlock, indent = 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(20);

    if (block.type === "multi-select") {
      const a = state.getAnswer(block.id);
      writeLines(
        a.checked.length > 0 ? a.checked.map((c) => `• ${c}`).join("\n") : "—",
        indent
      );
      if (a.freeText.trim()) writeLines(`Autre — ${a.freeText.trim()}`, indent);
    } else if (block.type === "single-select") {
      const v = state.getSingleChoice(block.id);
      const a = state.getAnswer(block.id);
      writeLines(v || "—", indent);
      if (a.freeText.trim()) writeLines(`Autre — ${a.freeText.trim()}`, indent);
    } else if (block.type === "grouped-select") {
      const a = state.getAnswer(block.id);
      for (const g of block.groups) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(80);
        writeLines(g.label, indent);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(20);
        const v =
          g.selectionMode === "single"
            ? state.getGroupedSingle(block.id, g.label)
            : state.getGroupedMulti(block.id, g.label);
        const display = Array.isArray(v)
          ? v.length
            ? v.map((x) => `• ${x}`).join("\n")
            : "—"
          : v || "—";
        writeLines(display, indent);
      }
      if (a.freeText.trim()) writeLines(a.freeText.trim(), indent);
    } else if (block.type === "free-text") {
      for (const f of block.fields) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(80);
        writeLines(f.label, indent);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(20);
        const v = state.getFieldValue(block.id, f.id);
        writeLines(v.trim() ? v : "—", indent);
      }
    } else {
      // notes
      const a = state.getAnswer(block.id);
      writeLines(a.freeText.trim() ? a.freeText : "—", indent);
    }
  }

  function renderBlock(block: Block) {
    const heading =
      "heading" in block && block.heading ? block.heading : block.id;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(60);
    const hLines = doc.splitTextToSize(heading, contentWidth);
    ensureSpace(hLines.length * LINE_HEIGHT + 8);
    doc.text(hLines, PAGE_MARGIN_X, y);
    y += hLines.length * LINE_HEIGHT * 0.9;

    if (block.type === "text") {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(20);
      writeLines(state.getContent(block.id) || "—");
    } else if (block.type === "composite") {
      for (const sub of block.blocks) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(110);
        writeLines(sub.prompt, 12);
        renderLeaf(sub, 12);
      }
    } else {
      if ("prompt" in block && block.prompt) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(110);
        writeLines(block.prompt);
      }
      renderLeaf(block);
    }
    y += 6;
  }

  doc.setFont("times", "normal");
  doc.setFontSize(22);
  doc.text("Brief", PAGE_MARGIN_X, y);
  y += 26;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(110);
  const dateStr = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  doc.text(`Récapitulatif — ${dateStr}`, PAGE_MARGIN_X, y);
  y += 24;
  doc.setTextColor(0);

  for (const step of steps) {
    ensureSpace(40);
    doc.setFont("times", "bold");
    doc.setFontSize(13);
    doc.text(step.label.toUpperCase(), PAGE_MARGIN_X, y);
    y += 6;
    doc.setDrawColor(180);
    doc.line(PAGE_MARGIN_X, y, PAGE_MARGIN_X + contentWidth, y);
    y += 18;

    for (const block of step.blocks) {
      renderBlock(block);
    }

    y += 12;
  }

  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  doc.save(`Brief-${yyyy}-${mm}-${dd}.pdf`);
}
