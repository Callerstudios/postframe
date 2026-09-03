// A small, dependency-free tokenizer. It is intentionally not a full
// grammar — it recognizes comments, strings, numbers and a per-language
// keyword list, which is enough for a clean editorial post and keeps
// Postframe from taking on a heavyweight syntax-highlighting package.
//
// To support a new language: add an entry to LANGUAGES and LANG_CONFIG.
// Nothing else needs to change.

export type LanguageId =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "csharp"
  | "cpp"
  | "go"
  | "rust"
  | "html"
  | "css"
  | "sql"
  | "json"
  | "bash"
  | "plaintext";

export const LANGUAGES: { id: LanguageId; label: string }[] = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "csharp", label: "C#" },
  { id: "cpp", label: "C++" },
  { id: "go", label: "Go" },
  { id: "rust", label: "Rust" },
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "sql", label: "SQL" },
  { id: "json", label: "JSON" },
  { id: "bash", label: "Bash" },
  { id: "plaintext", label: "Plain Text" },
];

type LangConfig = {
  lineComment?: string;
  blockComment?: [string, string];
  keywords: string[];
  caseInsensitiveKeywords?: boolean;
};

const jsLikeKeywords = [
  "const", "let", "var", "function", "return", "if", "else", "for", "while",
  "switch", "case", "break", "continue", "class", "extends", "new", "this",
  "import", "export", "default", "from", "async", "await", "try", "catch",
  "finally", "throw", "typeof", "instanceof", "null", "undefined", "true",
  "false", "of", "in",
];

const LANG_CONFIG: Record<LanguageId, LangConfig> = {
  javascript: { lineComment: "//", blockComment: ["/*", "*/"], keywords: jsLikeKeywords },
  typescript: {
    lineComment: "//",
    blockComment: ["/*", "*/"],
    keywords: [
      ...jsLikeKeywords, "interface", "type", "enum", "implements", "private",
      "public", "protected", "readonly", "as", "namespace", "declare",
    ],
  },
  python: {
    lineComment: "#",
    keywords: [
      "def", "return", "if", "elif", "else", "for", "while", "break",
      "continue", "class", "import", "from", "as", "try", "except",
      "finally", "raise", "with", "pass", "lambda", "yield", "None", "True",
      "False", "and", "or", "not", "in", "is", "global", "nonlocal",
      "async", "await",
    ],
  },
  java: {
    lineComment: "//",
    blockComment: ["/*", "*/"],
    keywords: [
      "public", "private", "protected", "class", "interface", "extends",
      "implements", "static", "final", "void", "new", "return", "if",
      "else", "for", "while", "switch", "case", "break", "continue", "try",
      "catch", "finally", "throw", "throws", "import", "package", "this",
      "super", "null", "true", "false", "int", "long", "double", "float",
      "boolean", "char", "String",
    ],
  },
  csharp: {
    lineComment: "//",
    blockComment: ["/*", "*/"],
    keywords: [
      "public", "private", "protected", "internal", "class", "interface",
      "static", "void", "new", "return", "if", "else", "for", "foreach",
      "in", "while", "switch", "case", "break", "continue", "try", "catch",
      "finally", "throw", "using", "namespace", "this", "base", "null",
      "true", "false", "var", "int", "long", "double", "float", "bool",
      "string", "async", "await",
    ],
  },
  cpp: {
    lineComment: "//",
    blockComment: ["/*", "*/"],
    keywords: [
      "include", "using", "namespace", "class", "struct", "public",
      "private", "protected", "static", "void", "return", "if", "else",
      "for", "while", "switch", "case", "break", "continue", "try", "catch",
      "throw", "new", "delete", "const", "int", "long", "double", "float",
      "bool", "char", "true", "false", "nullptr", "template", "typename",
      "virtual", "override",
    ],
  },
  go: {
    lineComment: "//",
    blockComment: ["/*", "*/"],
    keywords: [
      "func", "package", "import", "return", "if", "else", "for", "range",
      "switch", "case", "break", "continue", "defer", "go", "chan",
      "select", "struct", "interface", "type", "var", "const", "map",
      "nil", "true", "false",
    ],
  },
  rust: {
    lineComment: "//",
    blockComment: ["/*", "*/"],
    keywords: [
      "fn", "let", "mut", "return", "if", "else", "for", "in", "while",
      "loop", "match", "struct", "enum", "impl", "trait", "pub", "use",
      "mod", "crate", "self", "Self", "true", "false", "None", "Some",
      "Ok", "Err", "async", "await",
    ],
  },
  html: { blockComment: ["<!--", "-->"], keywords: [] },
  css: { blockComment: ["/*", "*/"], keywords: [] },
  sql: {
    lineComment: "--",
    caseInsensitiveKeywords: true,
    keywords: [
      "SELECT", "FROM", "WHERE", "INSERT", "INTO", "VALUES", "UPDATE",
      "SET", "DELETE", "CREATE", "TABLE", "INDEX", "ALTER", "DROP", "JOIN",
      "INNER", "LEFT", "RIGHT", "ON", "GROUP", "BY", "ORDER", "HAVING",
      "LIMIT", "AND", "OR", "NOT", "NULL", "AS", "DISTINCT", "PRIMARY",
      "KEY", "FOREIGN", "REFERENCES", "DEFAULT",
    ],
  },
  json: { keywords: ["true", "false", "null"] },
  bash: {
    lineComment: "#",
    keywords: [
      "if", "then", "else", "elif", "fi", "for", "while", "do", "done",
      "case", "esac", "function", "return", "export", "echo", "local", "in",
    ],
  },
  plaintext: { keywords: [] },
};

export type Token = {
  type: "keyword" | "string" | "comment" | "number" | "plain";
  text: string;
};

function escapeForRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function tokenize(code: string, languageId: string): Token[] {
  const config = LANG_CONFIG[languageId as LanguageId] ?? LANG_CONFIG.plaintext;

  const matchers: { type: Token["type"]; regex: RegExp }[] = [];

  if (config.blockComment) {
    const [start, end] = config.blockComment;
    matchers.push({
      type: "comment",
      regex: new RegExp(`${escapeForRegex(start)}[\\s\\S]*?${escapeForRegex(end)}`, "g"),
    });
  }
  if (config.lineComment) {
    matchers.push({
      type: "comment",
      regex: new RegExp(`${escapeForRegex(config.lineComment)}[^\\n]*`, "g"),
    });
  }
  matchers.push({
    type: "string",
    regex: /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`/g,
  });
  matchers.push({ type: "number", regex: /\b\d+(?:\.\d+)?\b/g });
  if (config.keywords.length) {
    const escaped = [...config.keywords].sort((a, b) => b.length - a.length).map(escapeForRegex);
    matchers.push({
      type: "keyword",
      regex: new RegExp(`\\b(?:${escaped.join("|")})\\b`, config.caseInsensitiveKeywords ? "gi" : "g"),
    });
  }

  const tokens: Token[] = [];
  let cursor = 0;

  while (cursor < code.length) {
    let best: { start: number; end: number; type: Token["type"] } | null = null;

    for (const matcher of matchers) {
      matcher.regex.lastIndex = cursor;
      const match = matcher.regex.exec(code);
      if (match && (best === null || match.index < best.start)) {
        best = { start: match.index, end: match.index + match[0].length, type: matcher.type };
      }
    }

    if (!best) {
      tokens.push({ type: "plain", text: code.slice(cursor) });
      break;
    }

    if (best.start > cursor) {
      tokens.push({ type: "plain", text: code.slice(cursor, best.start) });
    }
    tokens.push({ type: best.type, text: code.slice(best.start, best.end) });
    cursor = best.end;
  }

  return tokens;
}
