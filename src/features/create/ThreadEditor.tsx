import { useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import Textarea from "../../components/ui/Textarea";
import Select from "../../components/ui/Select";
import type { ThreadData } from "./threadTypes";

type ThreadEditorProps = {
  initialData: ThreadData;
  onBack: (data: ThreadData) => void;
};

type ThreadPreset = {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  numeralColor: string;
  fontFamily: string;
  fontWeight: string;
};

type AspectId = "square" | "portrait" | "story";

const ASPECTS: Record<AspectId, { label: string; ratio: string; maxWidth: number }> = {
  square: { label: "Square", ratio: "1 / 1", maxWidth: 440 },
  portrait: { label: "Portrait", ratio: "4 / 5", maxWidth: 400 },
  story: { label: "Story", ratio: "9 / 16", maxWidth: 300 },
};

// Six cohesive quote-card themes — each one sets background, text, the
// numeral accent, font and weight together so nothing clashes the way
// mixed-and-matched presets used to.
const presets: ThreadPreset[] = [
  {
    id: "clean",
    name: "Clean",
    backgroundColor: "#ffffff",
    textColor: "#171717",
    numeralColor: "rgba(23,23,23,0.08)",
    fontFamily: "Arial",
    fontWeight: "500",
  },
  {
    id: "ink",
    name: "Ink",
    backgroundColor: "#161616",
    textColor: "#f5f5f5",
    numeralColor: "rgba(245,245,245,0.1)",
    fontFamily: "Arial",
    fontWeight: "500",
  },
  {
    id: "paper",
    name: "Paper",
    backgroundColor: "#f3ead9",
    textColor: "#3b2f24",
    numeralColor: "rgba(59,47,36,0.12)",
    fontFamily: "Georgia",
    fontWeight: "400",
  },
  {
    id: "sunset",
    name: "Sunset",
    backgroundColor: "#ffe3c2",
    textColor: "#7c2d12",
    numeralColor: "rgba(124,45,18,0.14)",
    fontFamily: "Georgia",
    fontWeight: "400",
  },
  {
    id: "mono",
    name: "Mono",
    backgroundColor: "#f2f2f0",
    textColor: "#1f1f1d",
    numeralColor: "rgba(31,31,29,0.1)",
    fontFamily: "Courier New",
    fontWeight: "400",
  },
  {
    id: "bold",
    name: "Bold",
    backgroundColor: "#eef14c",
    textColor: "#111111",
    numeralColor: "rgba(17,17,17,0.14)",
    fontFamily: "Arial",
    fontWeight: "700",
  },
];

function splitIntoFrames(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

// Estimates a font size that fills the frame without overflowing, given
// the card's design-pixel dimensions. Heuristic, not pixel-perfect, but
// it means every frame reads as intentionally sized instead of using one
// fixed 16px value regardless of how much text it holds.
function estimateFitFontSize(text: string, aspect: AspectId) {
  const width = ASPECTS[aspect].maxWidth;
  const [rw, rh] = ASPECTS[aspect].ratio.split(" / ").map(Number);
  const height = (width * rh) / rw;

  const paddingX = 96;
  const paddingY = 140;
  const availableW = Math.max(width - paddingX, 120);
  const availableH = Math.max(height - paddingY, 120);

  const len = Math.max(text.length, 1);
  const raw = Math.sqrt((availableW * availableH * 0.8) / (0.72 * len));

  return Math.min(56, Math.max(17, Math.round(raw)));
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M15 5 8 12l7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M9 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ThreadEditor({ initialData, onBack }: ThreadEditorProps) {
  const [text, setText] = useState(initialData.text);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontWeight, setFontWeight] = useState("500");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#171717");
  const [numeralColor, setNumeralColor] = useState("rgba(23,23,23,0.08)");
  const [activePreset, setActivePreset] = useState("clean");

  const [aspect, setAspect] = useState<AspectId>("square");
  const [currentFrame, setCurrentFrame] = useState(0);
  const [autoFit, setAutoFit] = useState(true);
  const [fontSize, setFontSize] = useState(28);
  const [isDownloading, setIsDownloading] = useState(false);

  const frameRef = useRef<HTMLDivElement>(null);

const frames = useMemo(() => splitIntoFrames(text), [text]);

const safeCurrentFrame = Math.min(currentFrame, Math.max(0, frames.length - 1));

const activeFrame = frames[safeCurrentFrame] ?? "";

  const fitFontSize = useMemo(
    () => estimateFitFontSize(activeFrame || "Your text will appear here.", aspect),
    [activeFrame, aspect],
  );
  const displayedFontSize = autoFit ? fitFontSize : fontSize;

  const handleBack = () => {
    onBack({ text: text.trim() });
  };

  const applyPreset = (preset: ThreadPreset) => {
    setActivePreset(preset.id);
    setFontFamily(preset.fontFamily);
    setFontWeight(preset.fontWeight);
    setBackgroundColor(preset.backgroundColor);
    setTextColor(preset.textColor);
    setNumeralColor(preset.numeralColor);
  };

  const clearPreset = () => setActivePreset("");

  const goTo = (index: number) => {
    setCurrentFrame(Math.min(Math.max(index, 0), frames.length - 1));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") goTo(currentFrame - 1);
    if (event.key === "ArrowRight") goTo(currentFrame + 1);
  };

  const handleDownload = async () => {
    if (isDownloading || frames.length === 0) return;

    setIsDownloading(true);

    try {
      const zip = new JSZip();
      const originalFrame = currentFrame;

      for (let index = 0; index < frames.length; index += 1) {
        setCurrentFrame(index);

        await new Promise((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(resolve);
          });
        });

        if (!frameRef.current) continue;

        const dataUrl = await toPng(frameRef.current, {
          pixelRatio: 2,
          backgroundColor,
        });

        const base64 = dataUrl.split(",")[1];
        zip.file(`postframe-thread-${index + 1}.png`, base64, { base64: true });
      }

      setCurrentFrame(originalFrame);

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "postframe-thread.zip";
      link.click();

      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

  const aspectMeta = ASPECTS[aspect];
 const frameNumberLabel = String(safeCurrentFrame + 1).padStart(2, "0");

  return (
    <section className="py-6 md:py-8">
      <div className="mb-6">
        <button
          type="button"
          onClick={handleBack}
          className="mb-4 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Edit thread
        </h1>

        <p className="mt-1 text-sm text-gray-600">
          Turn your text into a series of shareable frames.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,540px)]">
        <div className="space-y-8">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Content</h2>

            <div className="mt-4">
              <label
                htmlFor="thread-editor-text"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Text
              </label>

              <Textarea
                id="thread-editor-text"
                value={text}
                onChange={(event) => {
                  setText(event.target.value);
                  setCurrentFrame(0);
                }}
                rows={14}
                placeholder="Write your thread here..."
              />

              <p className="mt-2 text-xs text-gray-500">
                Separate paragraphs with a blank line. Each paragraph becomes a
                frame — {frames.length || 0} so far.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-900">Format</h2>
            <p className="mt-1 text-xs text-gray-500">
              Applies to every frame, so the set stays consistent.
            </p>

            <div className="mt-3 inline-flex rounded-lg border border-gray-200 p-1">
              {(Object.keys(ASPECTS) as AspectId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setAspect(id)}
                  className={[
                    "rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors",
                    aspect === id
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:text-gray-900",
                  ].join(" ")}
                >
                  {ASPECTS[id].label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-900">Style</h2>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {presets.map((preset) => {
                const isActive = activePreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className={[
                      "overflow-hidden rounded-lg border text-left transition-all",
                      isActive
                        ? "border-gray-900 ring-1 ring-gray-900"
                        : "border-gray-200 hover:border-gray-400",
                    ].join(" ")}
                  >
                    <div
                      className="flex h-14 items-center justify-center px-3 text-sm"
                      style={{
                        backgroundColor: preset.backgroundColor,
                        color: preset.textColor,
                        fontFamily: preset.fontFamily,
                        fontWeight: preset.fontWeight,
                      }}
                    >
                      Aa
                    </div>

                    <div className="flex items-center justify-between bg-white px-3 py-2">
                      <span className="text-sm font-medium text-gray-800">
                        {preset.name}
                      </span>
                      {isActive && (
                        <span className="text-[11px] font-medium text-gray-500">
                          Selected
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-900">Typography</h2>

            <div className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="thread-font-family"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Font
                </label>

                <Select
                  id="thread-font-family"
                  value={fontFamily}
                  onChange={(event) => {
                    setFontFamily(event.target.value);
                    clearPreset();
                  }}
                >
                  <option value="Arial">Arial</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Verdana">Verdana</option>
                </Select>
              </div>

              <div>
                <label
                  htmlFor="thread-font-weight"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Weight
                </label>

                <Select
                  id="thread-font-weight"
                  value={fontWeight}
                  onChange={(event) => {
                    setFontWeight(event.target.value);
                    clearPreset();
                  }}
                >
                  <option value="400">Regular</option>
                  <option value="500">Medium</option>
                  <option value="600">Semibold</option>
                  <option value="700">Bold</option>
                </Select>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="thread-font-size"
                    className="text-sm font-medium text-gray-900"
                  >
                    Text size
                  </label>

                  <div className="flex items-center gap-2">
                    <span className="text-xs tabular-nums text-gray-500">
                      {displayedFontSize}px
                    </span>
                    {!autoFit && (
                      <button
                        type="button"
                        onClick={() => setAutoFit(true)}
                        className="text-xs font-medium text-gray-500 underline underline-offset-2 hover:text-gray-900"
                      >
                        Reset to auto-fit
                      </button>
                    )}
                  </div>
                </div>

                <input
                  id="thread-font-size"
                  type="range"
                  min="14"
                  max="64"
                  step="1"
                  value={displayedFontSize}
                  onChange={(event) => {
                    setAutoFit(false);
                    setFontSize(Number(event.target.value));
                  }}
                  className="w-full cursor-pointer accent-gray-900"
                />

                <div className="mt-1 flex justify-between text-xs text-gray-400">
                  <span>14px</span>
                  <span>
                    {autoFit
                      ? "Auto-fit — sized per frame so text never overflows"
                      : "64px"}
                  </span>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="thread-background-color"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    Background
                  </label>

                  <div className="flex items-center gap-2">
                    <input
                      id="thread-background-color"
                      type="color"
                      value={backgroundColor}
                      onChange={(event) => {
                        setBackgroundColor(event.target.value);
                        clearPreset();
                      }}
                      className="h-10 w-12 cursor-pointer rounded-md border border-gray-200 bg-white p-1"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="thread-text-color"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    Text
                  </label>

                  <div className="flex items-center gap-2">
                    <input
                      id="thread-text-color"
                      type="color"
                      value={textColor}
                      onChange={(event) => {
                        setTextColor(event.target.value);
                        clearPreset();
                      }}
                      className="h-10 w-12 cursor-pointer rounded-md border border-gray-200 bg-white p-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <div
            className="mx-auto"
            style={{ maxWidth: aspectMeta.maxWidth }}
            tabIndex={0}
            onKeyDown={handleKeyDown}
          >
            {frames.length === 0 ? (
              <div
                className="flex w-full items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-sm text-gray-500"
                style={{ aspectRatio: aspectMeta.ratio }}
              >
                Add a blank line between paragraphs to create your first
                frame.
              </div>
            ) : (
              <div
                ref={frameRef}
                className="relative w-full overflow-hidden rounded-md border border-gray-200"
                style={{
                  backgroundColor,
                  color: textColor,
                  fontFamily,
                  aspectRatio: aspectMeta.ratio,
                }}
              >
                {/* Numbered-frame device: the thread's position in its own
                    sequence, used as the card's one bold visual element. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-3 -right-1 select-none font-bold leading-none"
                  style={{
                    fontSize: aspect === "story" ? "7rem" : "9rem",
                    color: numeralColor,
                    fontFamily,
                  }}
                >
                  {frameNumberLabel}
                </div>

                <div className="relative flex h-full w-full flex-col justify-between p-8 md:p-10">
                  <div
                    className="text-xs font-medium tracking-widest opacity-40"
                    style={{ fontFamily }}
                  >
                    {frameNumberLabel} / {String(frames.length).padStart(2, "0")}
                  </div>

                  <div className="flex flex-1 items-center py-4">
                    <p
                      className="whitespace-pre-wrap break-all leading-snug"
                      style={{
                        fontSize: `${displayedFontSize}px`,
                        fontWeight,
                      }}
                    >
                      {activeFrame || "Your text will appear here."}
                    </p>
                  </div>

                  <div className="text-sm opacity-40">Postframe</div>
                </div>
              </div>
            )}
          </div>

          {frames.length > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              {frames.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Go to frame ${index + 1}`}
                  className={[
                    "h-1.5 rounded-full transition-all",
                    index === safeCurrentFrame
                      ? "w-6 bg-gray-900"
                      : "w-1.5 bg-gray-300 hover:bg-gray-400",
                  ].join(" ")}
                />
              ))}
            </div>
          )}

          {frames.length > 0 && (
            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                disabled={currentFrame === 0}
                onClick={() => goTo(currentFrame - 1)}
                className="inline-flex size-9 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition-colors hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Previous frame"
              >
                <ChevronLeft />
              </button>

              <span className="text-sm text-gray-500">
                Frame {safeCurrentFrame + 1} of {frames.length}
              </span>

              <button
                type="button"
                disabled={currentFrame === frames.length - 1}
                onClick={() => goTo(currentFrame + 1)}
                className="inline-flex size-9 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition-colors hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Next frame"
              >
                <ChevronRight />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading || frames.length === 0}
            className="mt-3 min-h-10 w-full rounded-md bg-gray-900 px-5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
          >
            {isDownloading ? "Preparing download..." : "Download thread"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default ThreadEditor;
