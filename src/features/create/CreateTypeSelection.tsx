import CreateTypeCard from "./CreateTypeCard";
import { createTypeOptions } from "./createTypes";
import type { CreateType } from "./types";

type CreateTypeSelectionProps = {
  selectedType: CreateType | null;
  setSelectedType: (type: CreateType) => void;
  handleContinue: () => void;
};

export function CreateTypeSelection({
    selectedType,
    setSelectedType,
    handleContinue,
}: CreateTypeSelectionProps) {
      
    return(
<section className="mx-auto max-w-3xl py-8 md:py-16">
  <div className="mb-8">
    <p className="mb-2 text-sm font-medium text-gray-500">Create</p>

    <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
      What do you want to create?
    </h1>

    <p className="mt-2 max-w-xl text-base text-gray-600">
      Turn your content into a polished visual, ready to share.
    </p>
  </div>

  <div className="grid gap-3 sm:grid-cols-2">
    {createTypeOptions.map((option) => (
      <CreateTypeCard
        key={option.id}
        option={option}
        selected={selectedType === option.id}
        onSelect={setSelectedType}
      />
    ))}
  </div>

  <div className="mt-6 flex justify-end">
    <button
      type="button"
      disabled={!selectedType}
      onClick={handleContinue}
      className="min-h-10 rounded-md bg-gray-900 px-5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
    >
      Continue
    </button>
  </div>
</section>
    )
  }
