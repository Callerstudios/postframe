import { useState } from "react";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import type { SocialPostData } from "./socialPostTypes";

type SocialPostSetupProps = {
  initialData?: SocialPostData;
  onBack: () => void;
  onContinue: (data: SocialPostData) => void;
};

function SocialPostSetup({
  initialData,
  onBack,
  onContinue,
}: SocialPostSetupProps) {
  const [text, setText] = useState(initialData?.text ?? "");
  const [displayName, setDisplayName] = useState(
    initialData?.displayName ?? "",
  );
  const [username, setUsername] = useState(initialData?.username ?? "");
//   const [avatar, setAvatar] = useState(initialData?.avatar ?? "");

  const canContinue = text.trim() && displayName.trim();

  const handleContinue = () => {
    if (!canContinue) {
      return;
    }

    onContinue({
      text: text.trim(),
      displayName: displayName.trim(),
      username: username.trim(),
      avatar: undefined,
    });
  };

  return (
    <section className="mx-auto max-w-2xl py-8 md:py-16">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
      >
        ← Back
      </button>

      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-gray-500">Social post</p>

        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          Create a social post
        </h1>

        <p className="mt-2 text-base text-gray-600">
          Add the content and profile details for your post.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label
            htmlFor="social-post-text"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Post text
          </label>

          <Textarea
            id="social-post-text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="What do you want to say?"
            rows={6}
          />
        </div>

        <div>
          <label
            htmlFor="social-post-display-name"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Display name
          </label>

          <Input
            id="social-post-display-name"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="e.g. Postframe"
          />
        </div>

        <div>
          <label
            htmlFor="social-post-username"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Username
          </label>

          <Input
            id="social-post-username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="e.g. postframe"
          />
        </div>

        {/* <div>
          <label
            htmlFor="social-post-avatar"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Avatar URL
          </label>

          <Input
            id="social-post-avatar"
            type="url"
            value={avatar}
            onChange={(event) => setAvatar(event.target.value)}
            placeholder="https://..."
          />
        </div> */}

        <div className="flex justify-end pt-2">
          <button
            type="button"
            disabled={!canContinue}
            onClick={handleContinue}
            className="min-h-10 rounded-md bg-gray-900 px-5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
          >
            Continue
          </button>
        </div>
      </div>
    </section>
  );
}

export default SocialPostSetup;
