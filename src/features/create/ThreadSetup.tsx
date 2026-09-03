import { useState } from "react";
import Textarea from "../../components/ui/Textarea";
import type { ThreadData } from "./threadTypes";

type ThreadSetupProps = {
  initialData?: ThreadData;
  onBack: () => void;
  onContinue: (data: ThreadData) => void;
};

function ThreadSetup({ initialData, onBack, onContinue }: ThreadSetupProps) {
  const [text, setText] = useState(initialData?.text ?? "");

  const canContinue = text.trim().length > 0;

  const handleContinue = () => {
    if (!canContinue) {
      return;
    }

    onContinue({
      text: text.trim(),
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
        <p className="mb-2 text-sm font-medium text-gray-500">Thread / Text</p>

        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          Create a thread
        </h1>

        <p className="mt-2 text-base text-gray-600">
          Add your text and turn it into a series of shareable visuals.
        </p>
      </div>

      <div>
        <label
          htmlFor="thread-text"
          className="mb-2 block text-sm font-medium text-gray-900"
        >
          Text
        </label>

        <Textarea
          id="thread-text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste or write your thread..."
          rows={12}
        />
      </div>

      <div className="flex justify-end pt-5">
        <button
          type="button"
          disabled={!canContinue}
          onClick={handleContinue}
          className="min-h-10 rounded-md bg-gray-900 px-5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
        >
          Continue
        </button>
      </div>
    </section>
  );
}

export default ThreadSetup;
