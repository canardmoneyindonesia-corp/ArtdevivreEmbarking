export type InputType =
  | "short-text"
  | "long-text"
  | "number"
  | "single-select"
  | "multi-select";

export type Option = {
  value: string;
  label: string;
};

export type Question = {
  id: string;
  step: number;
  sectionLabel: string;
  question: string;
  hint?: string;
  type: InputType;
  placeholder?: string;
  options?: Option[];
  required?: boolean;
};

export type Step = {
  number: number;
  label: string;
};

export type FormSchema = {
  steps: Step[];
  questions: Question[];
};

export type AnswerValue = string | number | string[] | undefined;
export type Answers = Record<string, AnswerValue>;

const LOREM_SHORT = "Lorem ipsum dolor sit amet";
const LOREM_HINT = "Consectetur adipiscing elit, sed do eiusmod tempor.";

export const formSchema: FormSchema = {
  steps: [
    { number: 1, label: "Lorem ipsum" },
    { number: 2, label: "Dolor sit amet" },
  ],
  questions: [
    {
      id: "maison_name",
      step: 1,
      sectionLabel: "Lorem ipsum dolor",
      question: "Lorem ipsum dolor sit amet consectetur ?",
      hint: LOREM_HINT,
      type: "short-text",
      placeholder: LOREM_SHORT,
      required: true,
    },
    {
      id: "lorem_description",
      step: 1,
      sectionLabel: "Lorem ipsum dolor",
      question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit ?",
      hint: LOREM_HINT,
      type: "long-text",
      placeholder: LOREM_SHORT,
    },
    {
      id: "lorem_count",
      step: 1,
      sectionLabel: "Lorem ipsum dolor",
      question: "Lorem ipsum dolor sit amet ?",
      hint: LOREM_HINT,
      type: "number",
      placeholder: "0",
    },
    {
      id: "lorem_single",
      step: 1,
      sectionLabel: "Lorem ipsum dolor",
      question: "Lorem ipsum dolor sit amet consectetur ?",
      hint: LOREM_HINT,
      type: "single-select",
      options: [
        { value: "lorem_a", label: "Lorem" },
        { value: "lorem_b", label: "Ipsum" },
        { value: "lorem_c", label: "Dolor" },
        { value: "lorem_d", label: "Sit amet" },
      ],
    },
    {
      id: "lorem_multi",
      step: 1,
      sectionLabel: "Lorem ipsum dolor",
      question: "Lorem ipsum dolor sit amet consectetur adipiscing ?",
      hint: "Plusieurs réponses possibles.",
      type: "multi-select",
      options: [
        { value: "lorem_1", label: "Lorem ipsum" },
        { value: "lorem_2", label: "Dolor sit" },
        { value: "lorem_3", label: "Amet consectetur" },
        { value: "lorem_4", label: "Adipiscing elit" },
        { value: "lorem_5", label: "Sed do eiusmod" },
      ],
    },
    {
      id: "etape2_contact_name",
      step: 2,
      sectionLabel: "Dolor sit amet",
      question: "Lorem ipsum dolor sit amet consectetur ?",
      hint: LOREM_HINT,
      type: "short-text",
      placeholder: LOREM_SHORT,
      required: true,
    },
    {
      id: "etape2_context",
      step: 2,
      sectionLabel: "Dolor sit amet",
      question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit ?",
      hint: LOREM_HINT,
      type: "long-text",
      placeholder: LOREM_SHORT,
    },
    {
      id: "etape2_budget",
      step: 2,
      sectionLabel: "Dolor sit amet",
      question: "Lorem ipsum dolor sit amet ?",
      hint: LOREM_HINT,
      type: "number",
      placeholder: "0",
    },
    {
      id: "etape2_preference",
      step: 2,
      sectionLabel: "Dolor sit amet",
      question: "Lorem ipsum dolor sit amet consectetur ?",
      hint: LOREM_HINT,
      type: "single-select",
      options: [
        { value: "etape2_a", label: "Lorem" },
        { value: "etape2_b", label: "Ipsum" },
        { value: "etape2_c", label: "Dolor" },
        { value: "etape2_d", label: "Sit amet" },
      ],
    },
    {
      id: "etape2_options",
      step: 2,
      sectionLabel: "Dolor sit amet",
      question: "Lorem ipsum dolor sit amet consectetur adipiscing ?",
      hint: "Plusieurs réponses possibles.",
      type: "multi-select",
      options: [
        { value: "etape2_1", label: "Lorem ipsum" },
        { value: "etape2_2", label: "Dolor sit" },
        { value: "etape2_3", label: "Amet consectetur" },
        { value: "etape2_4", label: "Adipiscing elit" },
        { value: "etape2_5", label: "Sed do eiusmod" },
      ],
    },
  ],
};

export function getQuestionStep(question: Question): number {
  return question.step;
}

export function questionsInStep(schema: FormSchema, step: number): Question[] {
  return schema.questions.filter((q) => q.step === step);
}

export function isAnswered(question: Question, value: AnswerValue): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return !Number.isNaN(value);
  if (Array.isArray(value)) return value.length > 0;
  return false;
}
