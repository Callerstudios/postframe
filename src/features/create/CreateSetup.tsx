import { useState } from "react";
import type { CreateType } from "./types";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";

type CreateSetupProps = {
  type: CreateType;
  initialQuote: string;
  initialAuthor: string;
  onBack: () => void;
  onQuoteContinue: (quote: string, author: string) => void;
};


function CreateSetup({ type, initialQuote, initialAuthor, onBack, onQuoteContinue }: CreateSetupProps) {
  const [quote, setQuote] = useState(initialQuote);
  const [author, setAuthor] = useState(initialAuthor);

  if (type !== "quote") {
    return (
      <section className="mx-auto max-w-3xl py-8 md:py-16">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          Create
        </h1>

        <p className="mt-2 text-base text-gray-600">
          Setup for this creation type is coming next.
        </p>
      </section>
    );
  }

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
        <p className="mb-2 text-sm font-medium text-gray-500">Quote</p>

        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          Create a quote
        </h1>

        <p className="mt-2 text-base text-gray-600">
          Add the quote and attribution for your visual.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label
            htmlFor="quote"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Quote
          </label>

          <Textarea
            id="quote"
            value={quote}
            onChange={(event) => setQuote(event.target.value)}
            placeholder="Enter your quote..."
            rows={5}
          />
        </div>

        <div>
          <label
            htmlFor="author"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Author
          </label>

          <Input
            id="author"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            placeholder="Who said it?"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            disabled={!quote.trim()}
            onClick={() => {
              console.log("Quote:", quote, "Author:", author);
              onQuoteContinue(quote, author);
            }}
            className="min-h-10 rounded-md bg-gray-900 px-5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
          >
            Continue
          </button>
        </div>
      </div>
    </section>
  );
}

export default CreateSetup;
