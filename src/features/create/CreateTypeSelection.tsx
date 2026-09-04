import CreateTypeCard from "./CreateTypeCard";
import { createTypeOptions } from "./createTypes";
import type { CreateType } from "./types";

type CreateTypeSelectionProps = {
  selectedType: CreateType | null;
  setSelectedType: (type: CreateType) => void;
  handleContinue: () => void;
};

const FLOW_STEPS = ["Choose type", "Add content", "Customize", "Download"];

export function CreateTypeSelection({
  selectedType,
  setSelectedType,
  handleContinue,
}: CreateTypeSelectionProps) {
  return (
    <section className="mx-auto max-w-3xl py-8 md:py-16">
      {/* Step orientation — this is a 4-step flow and the user should
          always know where they are in it. */}
      <ol className="mb-8 flex items-center gap-2">
        {FLOW_STEPS.map((step, index) => (
          <li key={step} className="flex items-center gap-2">
            <span className="flex items-center gap-1.5">
              <span
                className={`size-1.5 rounded-full ${
                  index === 0 ? "bg-gray-900" : "bg-gray-300"
                }`}
                aria-hidden="true"
              />
              <span
                className={`text-xs font-medium ${
                  index === 0 ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {step}
              </span>
            </span>
            {index < FLOW_STEPS.length - 1 && (
              <span className="h-px w-6 bg-gray-200" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>

      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-gray-500">Create</p>

        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          What do you want to create?
        </h1>

        <p className="mt-2 max-w-xl text-base text-gray-600">
          Turn your content into a polished visual, ready to share.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {createTypeOptions.map((option) => (
          <CreateTypeCard
            key={option.id}
            option={option}
            selected={selectedType === option.id}
            onSelect={setSelectedType}
          />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
        <p className="text-sm text-gray-400">
          {selectedType
            ? "You can change the format later from the editor."
            : "Choose a format to continue."}
        </p>

        <button
          type="button"
          disabled={!selectedType}
          onClick={handleContinue}
          className="group inline-flex min-h-10 items-center gap-1.5 rounded-md bg-gray-900 px-5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
        >
          Continue
          <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            className="transition-transform group-hover:translate-x-0.5 group-disabled:translate-x-0"
            aria-hidden="true"
          >
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
