import { useMemo, useRef, useState } from "react";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Select from "../../components/ui/Select";
import type { SocialPostData } from "./socialPostTypes";
import { toPng } from "html-to-image";
import {presets, type SocialPostPreset} from "./SocialMediaPresets";
import { LikeIcon, ReplyIcon, RepostIcon, ShareIcon, VerifiedBadge } from "./icons";



type SocialPostEditorProps = {
  initialData: SocialPostData;
  onBack: (currentData: SocialPostData) => void;
};



function autoFontSize(text: string) {
  const len = text.length || 1;
  if (len <= 280) return 20;
  return 16;
}

function SocialPostEditor({ initialData, onBack }: SocialPostEditorProps) {
  const [text, setText] = useState(initialData.text);
  const [displayName, setDisplayName] = useState(initialData.displayName);
  const [username, setUsername] = useState(initialData.username);
  const [avatar, setAvatar] = useState(initialData.avatar ?? "");

  const [verified, setVerified] = useState(false);
  const [timestamp, setTimestamp] = useState("10:42 AM · Sep 3, 2026");
  const [showStats, setShowStats] = useState(true);
  const [replies, setReplies] = useState("128");
  const [reposts, setReposts] = useState("342");
  const [likes, setLikes] = useState("4.1K");
  const [views, setViews] = useState("212K");

  const [autoSize, setAutoSize] = useState(true);
  const [fontSize, setFontSize] = useState(() =>
    autoFontSize(initialData.text),
  );
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontWeight, setFontWeight] = useState("400");

  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#0f1419");
  const [secondaryColor, setSecondaryColor] = useState("rgba(15,20,25,0.5)");

  const [activePreset, setActivePreset] = useState("light");

  const displayedFontSize = useMemo(
    () => (autoSize ? autoFontSize(text) : fontSize),
    [autoSize, fontSize, text],
  );

  const applyPreset = (preset: SocialPostPreset) => {
    setActivePreset(preset.id);
    setFontFamily(preset.fontFamily);
    setFontWeight(preset.fontWeight);
    setBackgroundColor(preset.backgroundColor);
    setTextColor(preset.textColor);
    setSecondaryColor(preset.secondaryColor);
  };

  const clearPreset = () => setActivePreset("");

  const handleTextChange = (value: string) => {
    setText(value);
    if (autoSize) setFontSize(autoFontSize(value));
  };

  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!previewRef.current) return;

    try {
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor,
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
    reader.onload = () => setAvatar(reader.result as string);
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
        <div>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Preview</h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Sized to your post — no forced crop
              </p>
            </div>
            <span className="text-xs text-gray-400">Live preview</span>
          </div>

          {/* Outer preview area */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-8">
            {/* Generated image — width is fixed like a real post embed,
                height grows naturally with the content instead of being
                forced into a square. */}
            <div
              ref={previewRef}
              className="mx-auto w-full max-w-130 overflow-hidden rounded-2xl"
              style={{ backgroundColor, color: textColor, fontFamily }}
            >
              <div className="flex flex-col gap-3 p-6 sm:p-7">
                {/* PROFILE HEADER */}
                <div className="flex items-start gap-3">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt=""
                      className="size-11 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                      style={{
                        border: `1px solid ${secondaryColor}`,
                      }}
                      aria-hidden="true"
                    >
                      {displayName ? displayName.charAt(0).toUpperCase() : "D"}
                    </div>
                  )}

                  <div className="min-w-0 leading-tight">
                    <div className="flex items-center gap-1">
                      <p className="truncate text-[15px] font-bold">
                        {displayName || "Display Name"}
                      </p>
                      {verified && <VerifiedBadge color="#1d9bf0" />}
                    </div>
                    <p
                      className="mt-0.5 truncate text-[14px]"
                      style={{ color: secondaryColor }}
                    >
                      @{username.replace(/^@/, "") || "username"}
                    </p>
                  </div>
                </div>

                {/* POST CONTENT */}
                <p
                  className="whitespace-pre-wrap wrap-break-word leading-snug tracking-[-0.01em]"
                  style={{
                    fontSize: `${displayedFontSize}px`,
                    fontWeight,
                    color: textColor,
                  }}
                >
                  {text || "Your post text will appear here."}
                </p>

                {/* TIMESTAMP */}
                <p className="text-[14px]" style={{ color: secondaryColor }}>
                  {timestamp}
                  {views ? ` · ${views} Views` : ""}
                </p>

                {/* ENGAGEMENT BAR */}
                {showStats && (
                  <div
                    className="flex items-center justify-between pt-3 text-[13px]"
                    style={{
                      color: secondaryColor,
                      borderTop: `1px solid ${secondaryColor.replace(/[\d.]+\)$/, "0.15)")}`,
                    }}
                  >
                    <span className="flex items-center gap-1.5">
                      <ReplyIcon /> {replies}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <RepostIcon /> {reposts}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <LikeIcon /> {likes}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ShareIcon />
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="mt-4 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
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
                  onChange={(event) => handleTextChange(event.target.value)}
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

              <div className="flex items-center gap-2">
                <input
                  id="editor-verified"
                  type="checkbox"
                  checked={verified}
                  onChange={(event) => setVerified(event.target.checked)}
                  className="size-4 cursor-pointer accent-gray-900"
                />
                <label
                  htmlFor="editor-verified"
                  className="cursor-pointer text-sm font-medium text-gray-900"
                >
                  Verified badge
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="editor-timestamp"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    Timestamp
                  </label>
                  <Input
                    id="editor-timestamp"
                    value={timestamp}
                    onChange={(event) => setTimestamp(event.target.value)}
                    placeholder="10:42 AM · Sep 3, 2026"
                  />
                </div>

                <div>
                  <label
                    htmlFor="editor-views"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    Views
                  </label>
                  <Input
                    id="editor-views"
                    value={views}
                    onChange={(event) => setViews(event.target.value)}
                    placeholder="212K"
                  />
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <input
                    id="editor-show-stats"
                    type="checkbox"
                    checked={showStats}
                    onChange={(event) => setShowStats(event.target.checked)}
                    className="size-4 cursor-pointer accent-gray-900"
                  />
                  <label
                    htmlFor="editor-show-stats"
                    className="cursor-pointer text-sm font-medium text-gray-900"
                  >
                    Show engagement bar
                  </label>
                </div>

                {showStats && (
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label
                        htmlFor="editor-replies"
                        className="mb-1.5 block text-xs font-medium text-gray-500"
                      >
                        Replies
                      </label>
                      <Input
                        id="editor-replies"
                        value={replies}
                        onChange={(event) => setReplies(event.target.value)}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="editor-reposts"
                        className="mb-1.5 block text-xs font-medium text-gray-500"
                      >
                        Reposts
                      </label>
                      <Input
                        id="editor-reposts"
                        value={reposts}
                        onChange={(event) => setReposts(event.target.value)}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="editor-likes"
                        className="mb-1.5 block text-xs font-medium text-gray-500"
                      >
                        Likes
                      </label>
                      <Input
                        id="editor-likes"
                        value={likes}
                        onChange={(event) => setLikes(event.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="editor-avatar"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Avatar
                </label>
                <div className="flex items-center gap-4">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Avatar preview"
                      className="h-12 w-12 rounded-full border border-gray-200 object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-sm font-semibold text-gray-500">
                      {displayName ? displayName.charAt(0).toUpperCase() : "D"}
                    </div>
                  )}

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
                        fontWeight: preset.fontWeight,
                      }}
                    >
                      <div className="w-full">
                        <div className="mb-1 flex items-center gap-1.5">
                          <div
                            className="size-3 rounded-full"
                            style={{
                              border: `1px solid ${preset.secondaryColor}`,
                            }}
                          />
                          <span className="text-[8px] font-bold">
                            Display Name
                          </span>
                        </div>
                        <span className="block truncate text-[10px] leading-tight">
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
                  <div className="flex items-center gap-2">
                    <span className="text-sm tabular-nums text-gray-500">
                      {displayedFontSize}px
                    </span>
                    {!autoSize && (
                      <button
                        type="button"
                        onClick={() => setAutoSize(true)}
                        className="text-xs font-medium text-gray-500 underline underline-offset-2 hover:text-gray-900"
                      >
                        Reset to auto
                      </button>
                    )}
                  </div>
                </div>

                <input
                  id="social-font-size"
                  type="range"
                  min={14}
                  max={40}
                  step={1}
                  value={displayedFontSize}
                  onChange={(event) => {
                    setAutoSize(false);
                    setFontSize(Number(event.target.value));
                  }}
                  className="w-full cursor-pointer accent-gray-900"
                />

                <div className="mt-1 flex justify-between text-xs text-gray-400">
                  <span>14px</span>
                  <span>
                    {autoSize ? "Auto — scales with post length" : "40px"}
                  </span>
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
                  <option value="Arial">Arial</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Verdana">Verdana</option>
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
                    className="h-10 w-12 cursor-pointer rounded-md border border-gray-200 bg-white p-1"
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

            <div className="mt-5">
              <label
                htmlFor="social-secondary-color"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Secondary text (handle, timestamp, icons)
              </label>
              <Input
                id="social-secondary-color"
                value={secondaryColor}
                onChange={(event) => {
                  setSecondaryColor(event.target.value);
                  clearPreset();
                }}
                placeholder="rgba(15,20,25,0.5)"
                aria-label="Secondary color"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SocialPostEditor;
