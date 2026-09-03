import { useRef, useState } from "react";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Select from "../../components/ui/Select";
import type { SocialPostData } from "./socialPostTypes";
import { toPng } from "html-to-image";

type SocialPostPreset = {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
};

type SocialPostEditorProps = {
  initialData: SocialPostData;
  onBack: (currentData: SocialPostData) => void;
};

const presets: SocialPostPreset[] = [
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
    id: "soft",
    name: "Soft",
    backgroundColor: "#f4f4f0",
    textColor: "#30302e",
    fontFamily: "Arial",
  },
  {
    id: "cream",
    name: "Cream",
    backgroundColor: "#fff8ed",
    textColor: "#3b2f24",
    fontFamily: "Georgia",
  },
  {
    id: "mono",
    name: "Mono",
    backgroundColor: "#f5f5f5",
    textColor: "#262626",
    fontFamily: "Courier New",
  },
];

function SocialPostEditor({
  initialData,
  onBack,
}: SocialPostEditorProps) {
  const [text, setText] = useState(initialData.text);
  const [displayName, setDisplayName] = useState(
    initialData.displayName,
  );
  const [username, setUsername] = useState(initialData.username);
  const [avatar, setAvatar] = useState(initialData.avatar ?? "");

  const getDefaultFontSize = () => {
    if (window.innerWidth < 640) return 20; // Mobile
    if (window.innerWidth < 1024) return 24; // Tablet
    return 28; // Desktop
  };

  const [fontSize, setFontSize] = useState(getDefaultFontSize);

  const [fontFamily, setFontFamily] = useState("Inter");
  const [fontWeight, setFontWeight] = useState("500");

  const [backgroundColor, setBackgroundColor] =
    useState("#ffffff");

  const [textColor, setTextColor] =
    useState("#171717");

  const [activePreset, setActivePreset] =
    useState("clean");

  const applyPreset = (preset: SocialPostPreset) => {
    setActivePreset(preset.id);

    setFontFamily(preset.fontFamily);
    setBackgroundColor(preset.backgroundColor);
    setTextColor(preset.textColor);

    // Intentionally do NOT change font size or weight.
  };

  const clearPreset = () => {
    setActivePreset("");
  };

  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!previewRef.current) return;

    try {
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        imagePlaceholder:
          "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
      });

      const link = document.createElement("a");
      link.download = "social-post.png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to download social post:", error);
    }
  };
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setAvatar(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  return (
    <section className="py-6 md:py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          type="button"
          onClick={() => onBack({ text, displayName, username, avatar })}
          className="mb-4 inline-flex items-center text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
        >
          <span className="mr-1.5 text-base">←</span>
          Back
        </button>

        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Edit social post
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Customize your post and see the result as you edit.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(400px,560px)]">
        {/* =====================================================
            PREVIEW
        ====================================================== */}
        <div className="">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Preview</h2>

              <p className="mt-0.5 text-xs text-gray-500">1:1 social post</p>
            </div>

            <span className="text-xs text-gray-400">Live preview</span>
          </div>

          {/* Outer preview area */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-2 sm:p-5">
            {/* Generated image */}
            <div
              ref={previewRef}
              className="aspect-square w-full overflow-hidden"
              style={{
                backgroundColor,
                color: textColor,
              }}
            >
              <div
                className="flex h-full w-full flex-col p-5 sm:p-8 md:p-10"
                style={{
                  fontFamily,
                }}
              >
                {/* PROFILE HEADER */}
                <div className="flex items-center gap-3">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt=""
                      crossOrigin="anonymous"
                      onLoad={() => console.log("Avatar loaded")}
                      onError={(e) => {
                        console.error("Avatar failed to load", avatar, e);
                      }}
                      className="size-10 shrink-0 rounded-full object-cover sm:size-11"
                    />
                  ) : (
                    <div
                      className="flex size-10 shrink-0 items-center justify-center rounded-full border border-current/15 text-sm font-semibold sm:size-11"
                      aria-hidden="true"
                    >
                      {displayName ? displayName.charAt(0).toUpperCase() : "D"}
                    </div>
                  )}

                  <div className="min-w-0 leading-tight">
                    <p className="truncate text-sm font-semibold">
                      {displayName || "Display Name"}
                    </p>

                    <p className="mt-0.5 truncate text-xs opacity-55">
                      @{username.replace(/^@/, "") || "username"}
                    </p>
                  </div>
                </div>

                {/* POST CONTENT */}
                <div className="flex flex-1">
                  <p
                    className="w-full whitespace-pre-wrap wrap-break-word leading-[1.3] tracking-[-0.015em]"
                    style={{
                      fontSize: `${fontSize}px`,
                      fontWeight,
                    }}
                  >
                    {text || "Your post text will appear here."}
                  </p>
                </div>

                {/* SMALL FOOTER */}
                <div className="text-xs opacity-40">Post</div>
              </div>
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Download
          </button>
        </div>
        {/* =====================================================
            CONTROLS
        ====================================================== */}
        <div className="space-y-8">
          {/* CONTENT */}
          <div>
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-sm font-semibold text-gray-900">Content</h2>
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <label
                  htmlFor="editor-post-text"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Post text
                </label>

                <Textarea
                  id="editor-post-text"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  rows={7}
                  placeholder="Write something worth sharing..."
                />

                <div className="mt-2 flex justify-end">
                  <span className="text-xs tabular-nums text-gray-400">
                    {text.length} characters
                  </span>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="editor-display-name"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    Display name
                  </label>

                  <Input
                    id="editor-display-name"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    placeholder="Display Name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="editor-username"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    Username
                  </label>

                  <Input
                    id="editor-username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="username"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="editor-avatar"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Avatar
                </label>

                <div className="flex items-center gap-4">
                  {/* Preview */}
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Avatar preview"
                      className="h-12 w-12 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-sm font-semibold text-gray-500">
                      {displayName ? displayName.charAt(0).toUpperCase() : "D"}
                    </div>
                  )}

                  {/* Upload */}
                  <div className="flex-1">
                    <input
                      id="editor-avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="block w-full text-sm text-gray-600
                        file:mr-4
                        file:rounded-lg
                        file:border-0
                        file:bg-gray-900
                        file:px-4
                        file:py-2
                        file:text-sm
                        file:font-medium
                        file:text-white
                        hover:file:bg-gray-700"
                    />

                    <p className="mt-2 text-xs text-gray-500">
                      JPG, PNG or WebP. Used in the preview and downloaded
                      image.
                    </p>
                  </div>
                </div>

                {avatar && (
                  <button
                    type="button"
                    onClick={() => setAvatar("")}
                    className="mt-3 text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Remove avatar
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* STYLE */}
          <div>
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-sm font-semibold text-gray-900">Style</h2>

              <p className="mt-1 text-xs text-gray-500">
                Choose a starting point, then customize it.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
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
                      className="flex h-16 items-center px-3"
                      style={{
                        backgroundColor: preset.backgroundColor,
                        color: preset.textColor,
                        fontFamily: preset.fontFamily,
                      }}
                    >
                      <div className="w-full">
                        <div className="mb-1 flex items-center gap-1.5">
                          <div className="size-3 rounded-full border border-current/20" />

                          <span className="text-[8px] font-semibold">
                            Display Name
                          </span>
                        </div>

                        <span className="block truncate text-[10px] font-medium leading-tight">
                          A simple post preview...
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-white px-3 py-2.5">
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

          {/* TYPOGRAPHY */}
          <div>
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-sm font-semibold text-gray-900">
                Typography
              </h2>
            </div>

            <div className="mt-5 space-y-6">
              {/* Text size */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="social-font-size"
                    className="text-sm font-medium text-gray-900"
                  >
                    Text size
                  </label>

                  <span className="text-sm tabular-nums text-gray-500">
                    {fontSize}px
                  </span>
                </div>

                <input
                  id="social-font-size"
                  type="range"
                  min={16}
                  max={48}
                  step={1}
                  value={fontSize}
                  onChange={(event) => {
                    setFontSize(Number(event.target.value));
                    clearPreset();
                  }}
                  className="w-full cursor-pointer accent-gray-900"
                />

                <div className="mt-1 flex justify-between text-xs text-gray-400">
                  <span>16px</span>
                  <span>48px</span>
                </div>
              </div>

              {/* Font */}
              <div>
                <label
                  htmlFor="social-font-family"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Font
                </label>

                <Select
                  id="social-font-family"
                  value={fontFamily}
                  onChange={(event) => {
                    setFontFamily(event.target.value);
                    clearPreset();
                  }}
                >
                  <option value="Inter">Inter</option>

                  <option value="Arial">Arial</option>

                  <option value="Georgia">Georgia</option>

                  <option value="Courier New">Courier New</option>
                </Select>
              </div>

              {/* Weight */}
              <div>
                <label
                  htmlFor="social-font-weight"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Weight
                </label>

                <Select
                  id="social-font-weight"
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
            </div>
          </div>

          {/* COLORS */}
          <div>
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-sm font-semibold text-gray-900">Colors</h2>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {/* Background */}
              <div>
                <label
                  htmlFor="social-background-color"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Background
                </label>

                <div className="flex items-center gap-2">
                  <input
                    id="social-background-color"
                    type="color"
                    value={backgroundColor}
                    onChange={(event) => {
                      setBackgroundColor(event.target.value);
                      clearPreset();
                    }}
                    className="h-12 w-16 rounded-xl border-2 border-gray-300 cursor-pointer"
                  />

                  <Input
                    value={backgroundColor}
                    onChange={(event) => {
                      setBackgroundColor(event.target.value);
                      clearPreset();
                    }}
                    aria-label="Background color"
                  />
                </div>
              </div>

              {/* Text */}
              <div>
                <label
                  htmlFor="social-text-color"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Text
                </label>

                <div className="flex items-center gap-2">
                  <input
                    id="social-text-color"
                    type="color"
                    value={textColor}
                    onChange={(event) => {
                      setTextColor(event.target.value);
                      clearPreset();
                    }}
                    className="h-10 w-12 cursor-pointer rounded-md border border-gray-200 bg-white p-1"
                  />

                  <Input
                    value={textColor}
                    onChange={(event) => {
                      setTextColor(event.target.value);
                      clearPreset();
                    }}
                    aria-label="Text color"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SocialPostEditor;
