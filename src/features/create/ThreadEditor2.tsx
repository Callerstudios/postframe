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
  fontFamily: string;
};

const presets: ThreadPreset[] = [
  {
    id: "clean",
    name: "Clean",
    backgroundColor: "#ffffff",
    textColor: "#171717",
    fontFamily: "Inter",
  },
  {
    id: "paper",
    name: "Paper",
    backgroundColor: "#f5f1e8",
    textColor: "#292524",
    fontFamily: "Georgia",
  },
  {
    id: "dark",
    name: "Dark",
    backgroundColor: "#171717",
    textColor: "#ffffff",
    fontFamily: "Inter",
  },
  {
    id: "minimal",
    name: "Minimal",
    backgroundColor: "#fafafa",
    textColor: "#404040",
    fontFamily: "Arial",
  },
  {
    id: "bold",
    name: "Bold",
    backgroundColor: "#ffffff",
    textColor: "#000000",
    fontFamily: "Arial",
  },
  {
    id: "mono",
    name: "Mono",
    backgroundColor: "#f5f5f5",
    textColor: "#262626",
    fontFamily: "Courier New",
  },
];

function splitIntoFrames(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function ThreadEditor2({ initialData, onBack }: ThreadEditorProps) {
  const [text, setText] = useState(initialData.text);
  const [fontFamily, setFontFamily] = useState("Inter");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#171717");
  const [currentFrame, setCurrentFrame] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [isDownloading, setIsDownloading] = useState(false);

  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLParagraphElement>(null);

  const frames = useMemo(() => {
    return splitIntoFrames(text);
  }, [text]);

  const activeFrame = frames[currentFrame] ?? "";

  const handleBack = () => {
    onBack({
      text: text.trim(),
    });
  };

  const applyPreset = (preset: ThreadPreset) => {
    setFontFamily(preset.fontFamily);
    setBackgroundColor(preset.backgroundColor);
    setTextColor(preset.textColor);
  };

  const handleDownload = async () => {
    if (isDownloading || frames.length === 0) {
      return;
    }

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

        if (!frameRef.current) {
          continue;
        }

        const dataUrl = await toPng(frameRef.current, {
          pixelRatio: 2,
        });

        const base64 = dataUrl.split(",")[1];

        zip.file(`postframe-thread-${index + 1}.png`, base64, { base64: true });
      }

      setCurrentFrame(originalFrame);

      const zipBlob = await zip.generateAsync({
        type: "blob",
      });

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
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-medium text-gray-900">Content</h2>

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
                frame.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-900">Style</h2>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="min-h-10 rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-900">Customization</h2>

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
                  onChange={(event) => setFontFamily(event.target.value)}
                >
                  <option value="Inter">Inter</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Arial">Arial</option>
                  <option value="Courier New">Courier New</option>
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

                  <span className="text-xs text-gray-500">{fontSize}px</span>
                </div>

                <input
                  id="thread-font-size"
                  type="range"
                  min="12"
                  max="48"
                  step="1"
                  value={fontSize}
                  onChange={(event) => setFontSize(Number(event.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="thread-background-color"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Background
                </label>

                <input
                  id="thread-background-color"
                  type="color"
                  value={backgroundColor}
                  onChange={(event) => setBackgroundColor(event.target.value)}
                  className="h-10 w-12 cursor-pointer rounded-md border border-gray-200 bg-white p-1"
                />
              </div>

              <div>
                <label
                  htmlFor="thread-text-color"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Text
                </label>

                <input
                  id="thread-text-color"
                  type="color"
                  value={textColor}
                  onChange={(event) => setTextColor(event.target.value)}
                  className="h-10 w-12 cursor-pointer rounded-md border border-gray-200 bg-white p-1"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <div
            ref={frameRef}
            className="aspect-square w-full overflow-hidden rounded-md border border-gray-200"
            style={{
              backgroundColor,
              color: textColor,
              fontFamily,
            }}
          >
            <div className="flex h-full w-full flex-col justify-between p-8 md:p-12">
              <div className="text-xs font-medium uppercase tracking-widest opacity-40">
                {currentFrame + 1} / {frames.length}
              </div>

              <div className="flex flex-1 items-center">
                <p
                  ref={contentRef}
                  className="whitespace-pre-wrap wrap-break-word font-medium leading-snug"
                  style={{
                    fontSize: `${fontSize}px`,
                  }}
                >
                  {activeFrame || "Your text will appear here."}
                </p>
              </div>

              <div className="text-sm opacity-40">Postframe</div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              disabled={currentFrame === 0}
              onClick={() => setCurrentFrame((frame) => frame - 1)}
              className="min-h-10 rounded-md border border-gray-200 px-4 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm text-gray-500">
              Frame {currentFrame + 1} of {frames.length}
            </span>

            <button
              type="button"
              disabled={currentFrame === frames.length - 1}
              onClick={() => setCurrentFrame((frame) => frame + 1)}
              className="min-h-10 rounded-md border border-gray-200 px-4 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>

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

export default ThreadEditor2;
