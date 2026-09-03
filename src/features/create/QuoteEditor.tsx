import { useEffect, useRef, useState } from "react";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Select from "../../components/ui/Select";
import { toPng } from "html-to-image";

type QuoteEditorProps = {
  initialQuote: string;
  initialAuthor: string;
  onBack: () => void;
};

type TextAlign = "left" | "center" | "right";

type StylePreset = {
  id: string;
  name: string;
  fontFamily: string;
  textAlign: TextAlign;
  backgroundColor: string;
  textColor: string;
};

const STYLE_PRESETS: StylePreset[] = [
  {
    id: "classic",
    name: "Classic",
    fontFamily: "Georgia",
    textAlign: "center",
    backgroundColor: "#ffffff",
    textColor: "#171717",
  },
  {
    id: "minimal",
    name: "Minimal",
    fontFamily: "Inter",
    textAlign: "left",
    backgroundColor: "#f5f5f5",
    textColor: "#171717",
  },
  {
    id: "elegant",
    name: "Elegant",
    fontFamily: "Georgia",
    textAlign: "center",
    backgroundColor: "#faf7f2",
    textColor: "#3f3f46",
  },
  {
    id: "bold",
    name: "Bold",
    fontFamily: "Arial",
    textAlign: "left",
    backgroundColor: "#fef3c7",
    textColor: "#18181b",
  },
  {
    id: "dark",
    name: "Dark",
    fontFamily: "Inter",
    textAlign: "center",
    backgroundColor: "#18181b",
    textColor: "#ffffff",
  },
  {
    id: "typewriter",
    name: "Typewriter",
    fontFamily: "Courier New",
    textAlign: "left",
    backgroundColor: "#f5f5f4",
    textColor: "#292524",
  },
];

function QuoteEditor({ initialQuote, initialAuthor, onBack }: QuoteEditorProps) {
  const [quote, setQuote] = useState(initialQuote);
  const [author, setAuthor] = useState(initialAuthor);

  const [fontSize, setFontSize] = useState(48);
  const [fontFamily, setFontFamily] = useState("Inter");
  const [textAlign, setTextAlign] = useState<TextAlign>("center");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#171717");

  const [activePreset, setActivePreset] = useState("classic");
  const [showCustomize, setShowCustomize] = useState(false);
  const [showContentEditor, setShowContentEditor] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);

  /*
   * Initial font-size calculation.
   *
   * Runs ONLY once.
   */
  useEffect(() => {
    const content = contentRef.current;
    const quoteElement = quoteRef.current;

    if (!content || !quoteElement) {
      return;
    }

    const availableWidth = content.clientWidth;

    if (!availableWidth) {
      return;
    }

    const maximumSize = 96;
    const minimumSize = 16;

    let initialSize = Math.min(availableWidth * 0.08, maximumSize);
    initialSize = Math.max(initialSize, minimumSize);

    quoteElement.style.fontSize = `${initialSize}px`;

    while (
      (quoteElement.scrollHeight > content.clientHeight ||
        quoteElement.scrollWidth > content.clientWidth) &&
      initialSize > minimumSize
    ) {
      initialSize -= 1;
      quoteElement.style.fontSize = `${initialSize}px`;
    }

    setFontSize(initialSize);
  }, []);

  const handleDownload = async () => {
    if (!previewRef.current) {
      return;
    }

    const dataUrl = await toPng(previewRef.current, {
      pixelRatio: 2,
    });

    const link = document.createElement("a");
    link.download = "postframe-quote.png";
    link.href = dataUrl;
    link.click();
  };

  /*
   * Apply a preset.
   *
   * The preset controls the visual design.
   * Font size is still calculated against the CURRENT preview size.
   */
  const applyPreset = (preset: StylePreset) => {
    setActivePreset(preset.id);

    setFontFamily(preset.fontFamily);
    setTextAlign(preset.textAlign);
    setBackgroundColor(preset.backgroundColor);
    setTextColor(preset.textColor);
  };

  const markAsCustom = () => {
    setActivePreset("");
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 md:py-10">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
      >
        ← Back
      </button>
      {/* Header */}
      <div className="mb-6">
        <p className="mb-2 text-sm font-medium text-gray-500">Quote</p>

        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Your quote
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Choose a style or customize your design.
        </p>
      </div>

      {/* Preview */}
      <div className="">
        <div className="flex min-w-0 items-center justify-center rounded-xl bg-gray-100 p-3 sm:p-6">
          <div
            ref={previewRef}
            className="relative flex aspect-square w-full max-w-140 items-center justify-center overflow-hidden p-6 shadow-lg sm:p-10 md:p-12"
            style={{
              backgroundColor,
            }}
          >
            <div
              ref={contentRef}
              className="flex h-full w-full min-w-0 flex-col justify-center"
              style={{
                textAlign,
              }}
            >
              <p
                ref={quoteRef}
                className="max-w-full wrap-break-word font-semibold leading-tight"
                style={{
                  fontSize: `${fontSize}px`,
                  fontFamily,
                  color: textColor,
                }}
              >
                {quote || "Your quote will appear here."}
              </p>

              {author && (
                <p
                  className="mt-4 max-w-full wrap-break-word text-base opacity-70 sm:mt-6"
                  style={{
                    color: textColor,
                  }}
                >
                  — {author}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Download */}
        <button
          type="button"
          className="mt-4 flex h-12 w-full items-center justify-center rounded-lg bg-gray-900 px-5 text-sm font-medium text-white transition hover:bg-gray-800"
          onClick={handleDownload}
        >
          Download quote
        </button>
      </div>

      {/* Controls */}
      <div className="mt-10 border-t border-gray-200 pt-8">
        {/* Content */}
        <div className="border-b border-gray-200 pb-6">
          <button
            type="button"
            onClick={() => setShowContentEditor((value) => !value)}
            className="flex w-full items-center justify-between text-left"
            aria-expanded={showContentEditor}
          >
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Quote content
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Change the quote or author.
              </p>
            </div>

            <span className="text-lg text-gray-400">
              {showContentEditor ? "−" : "+"}
            </span>
          </button>

          {showContentEditor && (
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="editor-quote"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Quote
                </label>

                <Textarea
                  id="editor-quote"
                  value={quote}
                  onChange={(event) => setQuote(event.target.value)}
                  rows={5}
                  className="w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="editor-author"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Author
                </label>

                <Input
                  id="editor-author"
                  value={author}
                  onChange={(event) => setAuthor(event.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Style presets */}
        <div className="py-6">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Style</h2>

            <p className="mt-1 text-xs text-gray-500">
              Pick a style to instantly change the look of your quote.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {STYLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`rounded-lg border p-2 text-left transition ${
                  activePreset === preset.id
                    ? "border-gray-900 ring-1 ring-gray-900"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <div
                  className="flex aspect-[1.4] items-center justify-center overflow-hidden rounded-md px-3"
                  style={{
                    backgroundColor: preset.backgroundColor,
                    color: preset.textColor,
                  }}
                >
                  <span
                    className="line-clamp-3 text-center text-sm font-semibold leading-tight"
                    style={{
                      fontFamily: preset.fontFamily,
                    }}
                  >
                    A beautiful quote
                  </span>
                </div>

                <p className="mt-2 text-xs font-medium text-gray-900">
                  {preset.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Customize */}
        <div className="border-t border-gray-200 pt-6">
          <button
            type="button"
            onClick={() => setShowCustomize((value) => !value)}
            className="flex w-full items-center justify-between text-left"
            aria-expanded={showCustomize}
          >
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Customize</h2>

              <p className="mt-1 text-xs text-gray-500">
                Fine-tune the font, size, colors, and alignment.
              </p>
            </div>

            <span className="text-lg text-gray-400">
              {showCustomize ? "−" : "+"}
            </span>
          </button>

          {showCustomize && (
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {/* Font */}
              <div>
                <label
                  htmlFor="font-family"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Font
                </label>

                <Select
                  id="font-family"
                  value={fontFamily}
                  onChange={(event) => {
                    setFontFamily(event.target.value);
                    markAsCustom();
                  }}
                >
                  <option value="Inter">Inter</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Arial">Arial</option>
                  <option value="Courier New">Courier New</option>
                </Select>
              </div>

              {/* Font size */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="font-size"
                    className="text-sm font-medium text-gray-900"
                  >
                    Font size
                  </label>

                  <span className="text-sm text-gray-500">{fontSize}px</span>
                </div>

                <input
                  id="font-size"
                  type="range"
                  min="16"
                  max="96"
                  value={fontSize}
                  onChange={(event) => {
                    setFontSize(Number(event.target.value));
                    markAsCustom();
                  }}
                  className="w-full"
                />
              </div>

              {/* Alignment */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Alignment
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {(["left", "center", "right"] as const).map((alignment) => (
                    <button
                      key={alignment}
                      type="button"
                      onClick={() => {
                        setTextAlign(alignment);
                        markAsCustom();
                      }}
                      className={`min-h-10 rounded-md border px-3 text-sm capitalize transition ${
                        textAlign === alignment
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {alignment}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background */}
              <div>
                <label
                  htmlFor="background-color"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Background
                </label>

                <div className="flex items-center gap-3">
                  <input
                    id="background-color"
                    type="color"
                    value={backgroundColor}
                    onChange={(event) => {
                      setBackgroundColor(event.target.value);
                      markAsCustom();
                    }}
                    className="h-10 w-12 shrink-0 cursor-pointer rounded-md border border-gray-200 bg-white p-1"
                  />

                  <Input
                    value={backgroundColor}
                    onChange={(event) => {
                      setBackgroundColor(event.target.value);
                      markAsCustom();
                    }}
                    aria-label="Background color"
                  />
                </div>
              </div>

              {/* Text color */}
              <div>
                <label
                  htmlFor="text-color"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Text color
                </label>

                <div className="flex items-center gap-3">
                  <input
                    id="text-color"
                    type="color"
                    value={textColor}
                    onChange={(event) => {
                      setTextColor(event.target.value);
                      markAsCustom();
                    }}
                    className="h-10 w-12 shrink-0 cursor-pointer rounded-md border border-gray-200 bg-white p-1"
                  />

                  <Input
                    value={textColor}
                    onChange={(event) => {
                      setTextColor(event.target.value);
                      markAsCustom();
                    }}
                    aria-label="Text color"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default QuoteEditor;
