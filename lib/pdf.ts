import { jsPDF } from "jspdf";
import { Answers, FormSchema, Question } from "./form-schema";
import { Step as BriefStep } from "./brief-schema";
import { QuestionAnswer } from "./use-brief-state";

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

export function generateBriefPdf(
  steps: BriefStep[],
  getContent: (id: string) => string,
  getAnswer: (id: string) => QuestionAnswer
) {
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
      const heading =
        "heading" in block && block.heading ? block.heading : block.id;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(60);
      const hLines = doc.splitTextToSize(heading, contentWidth);
      ensureSpace(hLines.length * LINE_HEIGHT + 8);
      doc.text(hLines, PAGE_MARGIN_X, y);
      y += hLines.length * LINE_HEIGHT * 0.9;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(20);

      if (block.type === "text") {
        const text = getContent(block.id) || "—";
        const lines = doc.splitTextToSize(text, contentWidth);
        ensureSpace(lines.length * LINE_HEIGHT + 12);
        doc.text(lines, PAGE_MARGIN_X, y);
        y += lines.length * LINE_HEIGHT + 10;
      } else if (block.type === "multi-select") {
        const promptLines = doc.splitTextToSize(block.prompt, contentWidth);
        ensureSpace(promptLines.length * LINE_HEIGHT + 8);
        doc.setTextColor(80);
        doc.text(promptLines, PAGE_MARGIN_X, y);
        y += promptLines.length * LINE_HEIGHT + 6;
        doc.setTextColor(20);

        const answer = getAnswer(block.id);
        const items =
          answer.checked.length > 0
            ? answer.checked.map((c) => `• ${c}`).join("\n")
            : "—";
        const aLines = doc.splitTextToSize(items, contentWidth);
        ensureSpace(aLines.length * LINE_HEIGHT + 8);
        doc.text(aLines, PAGE_MARGIN_X, y);
        y += aLines.length * LINE_HEIGHT + 8;

        if (answer.freeText.trim()) {
          const free = `Autre — ${answer.freeText.trim()}`;
          const fLines = doc.splitTextToSize(free, contentWidth);
          ensureSpace(fLines.length * LINE_HEIGHT + 8);
          doc.text(fLines, PAGE_MARGIN_X, y);
          y += fLines.length * LINE_HEIGHT + 8;
        }
      } else {
        const placeholder = doc.splitTextToSize("—", contentWidth);
        ensureSpace(placeholder.length * LINE_HEIGHT + 8);
        doc.text(placeholder, PAGE_MARGIN_X, y);
        y += placeholder.length * LINE_HEIGHT + 8;
      }
    }

    y += 12;
  }

  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  doc.save(`Brief-${yyyy}-${mm}-${dd}.pdf`);
}
