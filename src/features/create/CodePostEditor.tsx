import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import Textarea from "../../components/ui/Textarea";
import Select from "../../components/ui/Select";
import type { Block, CodeBlock, CodePostData, TextBlock } from "./codePostTypes";
import { LANGUAGES, tokenize } from "./codeHighlight";

type CodePostEditorProps = {
  initialData: CodePostData;
  onBack: (data: CodePostData) => void;
};

type CodeTheme = {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  mutedColor: string;
  codeBackground: string;
  codeBorder: string;
  codeText: string;
  keywordColor: string;
  stringColor: string;
  commentColor: string;
  fontFamily: string;
};

// Four coordinated themes rather than a color picker grab-bag — each one
// sets prose color, code panel color, and the (deliberately narrow,
// two-hue) token palette together, so nothing reads as mismatched.
const THEMES: CodeTheme[] = [
  {
    id: "editorial",
    name: "Editorial",
    backgroundColor: "#ffffff",
    textColor: "#171717",
    mutedColor: "#8a8a8a",
    codeBackground: "#f7f7f5",
    codeBorder: "#e5e5e0",
    codeText: "#262626",
    keywordColor: "#3454b4",
    stringColor: "#1a7f5a",
    commentColor: "#9ca3af",
    fontFamily: "Arial",
  },
  {
    id: "terminal",
    name: "Terminal",
    backgroundColor: "#0d1117",
    textColor: "#e6edf3",
    mutedColor: "#8b949e",
    codeBackground: "#161b22",
    codeBorder: "#30363d",
    codeText: "#c9d1d9",
    keywordColor: "#79c0ff",
    stringColor: "#7ee787",
    commentColor: "#8b949e",
    fontFamily: "Arial",
  },
  {
    id: "paper",
    name: "Paper",
    backgroundColor: "#f6f1e7",
    textColor: "#3b2f24",
    mutedColor: "#a08a6a",
    codeBackground: "#efe6d3",
    codeBorder: "#ddcfb0",
    codeText: "#3b2f24",
    keywordColor: "#8a4b08",
    stringColor: "#3f6b4f",
    commentColor: "#a08a6a",
    fontFamily: "Georgia",
  },
  {
    id: "slate",
    name: "Slate",
    backgroundColor: "#1c2331",
    textColor: "#e2e8f0",
    mutedColor: "#7c8aa5",
    codeBackground: "#161c28",
    codeBorder: "#2d3748",
    codeText: "#cbd5e1",
    keywordColor: "#c4b5fd",
    stringColor: "#67e8f9",
    commentColor: "#7c8aa5",
    fontFamily: "Verdana",
  },
];

const CODE_FONT = "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Courier New', monospace";

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `block-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function makeTextBlock(content = ""): TextBlock {
  return { id: makeId(), type: "text", content };
}

function makeCodeBlock(content = "", language = "javascript"): CodeBlock {
  return { id: makeId(), type: "code", language, content };
}

// A starter example so a new editor isn't a blank page — it's the exact
// text/code/text/code pattern this tool is built for.
function defaultBlocks(): Block[] {
  return [
    makeTextBlock("Here's why this query is slow."),
    makeCodeBlock("SELECT *\nFROM users\nWHERE email = 'example@email.com';", "sql"),
    makeTextBlock(
      "The problem is that email isn't indexed, so the database may need to scan the table.",
    ),
    makeCodeBlock("CREATE INDEX idx_users_email\nON users(email);", "sql"),
    makeTextBlock("Now the database can efficiently find the matching record."),
  ];
}

function ChevronUp() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
      <path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
      <path
        d="M4 6h16M9 6V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V6m2 0-.6 13.2a2 2 0 0 1-2 1.8H9.6a2 2 0 0 1-2-1.8L7 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CodePostEditor({ initialData, onBack }: CodePostEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(
    initialData.blocks.length ? initialData.blocks : defaultBlocks(),
  );
  const [themeId, setThemeId] = useState("editorial");
  const theme = THEMES.find((candidate) => candidate.id === themeId) ?? THEMES[0];

  const previewRef = useRef<HTMLDivElement>(null);

  const handleBack = () => onBack({ blocks });

  const updateBlock = (id: string, patch: Partial<TextBlock> | Partial<CodeBlock>) => {
    setBlocks((current) =>
      current.map((block) => (block.id === id ? ({ ...block, ...patch } as Block) : block)),
    );
  };

  const deleteBlock = (id: string) => {
    setBlocks((current) => current.filter((block) => block.id !== id));
  };

  const moveBlock = (id: string, direction: -1 | 1) => {
    setBlocks((current) => {
      const index = current.findIndex((block) => block.id === id);
      const target = index + direction;
      if (index === -1 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const addTextBlock = () => setBlocks((current) => [...current, makeTextBlock()]);
  const addCodeBlock = () => setBlocks((current) => [...current, makeCodeBlock()]);

  // Preserves tab-as-indentation instead of losing focus to the next field.
  const handleCodeKeyDown = (id: string) => (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Tab") return;
    event.preventDefault();
    const target = event.currentTarget;
    const { selectionStart, selectionEnd, value } = target;
    const nextValue = `${value.slice(0, selectionStart)}  ${value.slice(selectionEnd)}`;
    updateBlock(id, { content: nextValue });
    requestAnimationFrame(() => {
      target.selectionStart = target.selectionEnd = selectionStart + 2;
    });
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    try {
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: theme.backgroundColor,
      });
      const link = document.createElement("a");
      link.download = "postframe-code-post.png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to download code post:", error);
    }
  };

  return (
    <section className="py-6 md:py-8">
      <div className="mb-8">
        <button
          type="button"
          onClick={handleBack}
          className="mb-4 inline-flex items-center text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
        >
          <span className="mr-1.5 text-base">←</span>
          Back
        </button>

        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Edit technical post
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Mix prose and code blocks, then preview the finished visual.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(400px,560px)]">
        {/* =====================================================
            EDITOR
        ====================================================== */}
        <div className="space-y-8">
          <div>
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-sm font-semibold text-gray-900">Content</h2>
              <p className="mt-1 text-xs text-gray-500">
                Add, edit, reorder, or remove text and code blocks.
              </p>
            </div>

            <div className="mt-5 space-y-4">
              {blocks.length === 0 && (
                <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                  No blocks yet. Add a text or code block to get started.
                </div>
              )}

              {blocks.map((block, index) => (
                <div key={block.id} className="rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-3 py-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {block.type === "text" ? "Text" : "Code"}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveBlock(block.id, -1)}
                        disabled={index === 0}
                        className="inline-flex size-7 items-center justify-center rounded text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="Move block up"
                      >
                        <ChevronUp />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(block.id, 1)}
                        disabled={index === blocks.length - 1}
                        className="inline-flex size-7 items-center justify-center rounded text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="Move block down"
                      >
                        <ChevronDown />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteBlock(block.id)}
                        className="inline-flex size-7 items-center justify-center rounded text-gray-500 hover:bg-red-50 hover:text-red-600"
                        aria-label="Delete block"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>

                  <div className="p-3">
                    {block.type === "text" ? (
                      <Textarea
                        value={block.content}
                        onChange={(event) => updateBlock(block.id, { content: event.target.value })}
                        rows={3}
                        placeholder="Write a line of explanation..."
                      />
                    ) : (
                      <div className="space-y-2">
                        <Select
                          value={block.language}
                          onChange={(event) => updateBlock(block.id, { language: event.target.value })}
                        >
                          {LANGUAGES.map((lang) => (
                            <option key={lang.id} value={lang.id}>
                              {lang.label}
                            </option>
                          ))}
                        </Select>

                        <textarea
                          value={block.content}
                          onChange={(event) => updateBlock(block.id, { content: event.target.value })}
                          onKeyDown={handleCodeKeyDown(block.id)}
                          wrap="off"
                          spellCheck={false}
                          rows={6}
                          placeholder="Paste or write your code..."
                          className="w-full overflow-x-auto whitespace-pre rounded-md border border-gray-200 bg-gray-50 p-3 text-[13px] leading-relaxed text-gray-800 outline-none focus:border-gray-400"
                          style={{ fontFamily: CODE_FONT, tabSize: 2 }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={addTextBlock}
                className="min-h-9 rounded-md border border-dashed border-gray-300 px-3.5 text-sm font-medium text-gray-600 transition-colors hover:border-gray-500 hover:text-gray-900"
              >
                + Add text
              </button>
              <button
                type="button"
                onClick={addCodeBlock}
                className="min-h-9 rounded-md border border-dashed border-gray-300 px-3.5 text-sm font-medium text-gray-600 transition-colors hover:border-gray-500 hover:text-gray-900"
              >
                + Add code
              </button>
            </div>
          </div>

          {/* STYLE */}
          <div>
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-sm font-semibold text-gray-900">Style</h2>
              <p className="mt-1 text-xs text-gray-500">
                One coordinated theme for prose, code, and accents.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {THEMES.map((candidate) => {
                const isActive = candidate.id === themeId;
                return (
                  <button
                    key={candidate.id}
                    type="button"
                    onClick={() => setThemeId(candidate.id)}
                    className={[
                      "overflow-hidden rounded-lg border text-left transition-all",
                      isActive
                        ? "border-gray-900 ring-1 ring-gray-900"
                        : "border-gray-200 hover:border-gray-400",
                    ].join(" ")}
                  >
                    <div
                      className="flex h-14 flex-col justify-center gap-1 px-3"
                      style={{ backgroundColor: candidate.backgroundColor }}
                    >
                      <span
                        className="text-[10px] font-semibold"
                        style={{ color: candidate.textColor, fontFamily: candidate.fontFamily }}
                      >
                        Aa
                      </span>
                      <span
                        className="text-[9px]"
                        style={{ color: candidate.keywordColor, fontFamily: CODE_FONT }}
                      >
                        const x
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-white px-3 py-2">
                      <span className="text-sm font-medium text-gray-800">{candidate.name}</span>
                      {isActive && (
                        <span className="text-[11px] font-medium text-gray-500">Selected</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* =====================================================
            PREVIEW
        ====================================================== */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Preview</h2>
              <p className="mt-0.5 text-xs text-gray-500">What gets downloaded</p>
            </div>
            <span className="text-xs text-gray-400">Live preview</span>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-8">
            <div
              ref={previewRef}
              className="mx-auto w-full max-w-150 overflow-hidden rounded-2xl"
              style={{ backgroundColor: theme.backgroundColor, color: theme.textColor, fontFamily: theme.fontFamily }}
            >
              <div className="flex flex-col gap-5 p-8 sm:p-10">
                {blocks.length === 0 ? (
                  <p className="text-sm" style={{ color: theme.mutedColor }}>
                    Your post will appear here as you add blocks.
                  </p>
                ) : (
                  blocks.map((block) =>
                    block.type === "text" ? (
                      <p
                        key={block.id}
                        className="whitespace-pre-wrap wrap-break-word text-[17px] leading-relaxed"
                      >
                        {block.content || " "}
                      </p>
                    ) : (
                      <div key={block.id}>
                        <div
                          className="mb-1.5 text-[11px] font-medium uppercase tracking-wide"
                          style={{ color: theme.mutedColor }}
                        >
                          {LANGUAGES.find((l) => l.id === block.language)?.label ?? block.language}
                        </div>
                        <pre
                          className="overflow-hidden whitespace-pre-wrap wrap-break-word rounded-lg border p-4 text-[14px] leading-[1.6]"
                          style={{
                            backgroundColor: theme.codeBackground,
                            borderColor: theme.codeBorder,
                            color: theme.codeText,
                            fontFamily: CODE_FONT,
                          }}
                        >
                          <code>
                            {tokenize(block.content, block.language).map((token, index) => {
                              if (token.type === "plain") return token.text;
                              const color =
                                token.type === "keyword"
                                  ? theme.keywordColor
                                  : token.type === "string"
                                    ? theme.stringColor
                                    : token.type === "comment"
                                      ? theme.commentColor
                                      : theme.codeText;
                              return (
                                <span
                                  key={index}
                                  style={{
                                    color,
                                    fontStyle: token.type === "comment" ? "italic" : "normal",
                                  }}
                                >
                                  {token.text}
                                </span>
                              );
                            })}
                          </code>
                        </pre>
                      </div>
                    ),
                  )
                )}

                <div className="pt-1 text-xs opacity-40" style={{ fontFamily: "Arial" }}>
                  Postframe
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={blocks.length === 0}
            className="mt-4 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
          >
            Download
          </button>
        </div>
      </div>
    </section>
  );
}

export default CodePostEditor;
