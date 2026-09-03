import { useState } from "react";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea";
import type { CodePostData } from "./codePostTypes";

type CodePostSetupProps = {
  initialData: CodePostData;
  onBack: () => void;
  onContinue: (data: CodePostData) => void;
};

function CodePostSetup({
  initialData,
  onBack,
  onContinue,
}: CodePostSetupProps) {
  const [content, setContent] = useState(() => {
    const firstTextBlock = initialData.blocks.find(
      (block) => block.type === "text"
    );

    return firstTextBlock?.content ?? "";
  });

  function handleContinue() {
    const trimmedContent = content.trim();

    const data: CodePostData = {
      blocks: trimmedContent
        ? [
            {
              id: crypto.randomUUID(),
              type: "text",
              content: trimmedContent,
            },
          ]
        : [],
    };

    onContinue(data);
  }

  return (
    <section className="mx-auto max-w-2xl py-8 md:py-14">
      <button
        type="button"
        onClick={onBack}
        className="mb-8 text-sm font-medium text-gray-500 transition-colors duration-fast hover:text-gray-900"
      >
        ← Back
      </button>

      <div className="mb-10">
        <p className="mb-2 text-sm font-medium text-gray-500">Code post</p>

        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          Start your code post
        </h1>

        <p className="mt-2 max-w-lg text-base text-gray-600">
          Add some context to your code. You can add and arrange code and text
          blocks in the editor.
        </p>
      </div>

      <div className="space-y-7">
        <div>
          <label
            htmlFor="code-post-content"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Introduction
          </label>

          <Textarea
            id="code-post-content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="What are you trying to explain?"
            rows={7}
            autoFocus
          />

          <p className="mt-2 text-sm text-gray-500">
            You can add code blocks, explanations, and more in the next step.
          </p>
        </div>

        <div className="flex justify-end border-t border-gray-200 pt-5">
          <Button
            type="button"
            disabled={!content.trim()}
            onClick={handleContinue}
            className="bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-500"
          >
            Continue
          </Button>
        </div>
      </div>
    </section>
  );
}

export default CodePostSetup;
