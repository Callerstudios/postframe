import type { CreateTypeOption } from "./createTypes";

type CreateTypeCardProps = {
  option: CreateTypeOption;
  selected?: boolean;
  onSelect?: (id: CreateTypeOption["id"]) => void;
};

function CreateTypeCard({
  option,
  selected = false,
  onSelect,
}: CreateTypeCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(option.id)}
      className={`flex min-h-32 w-full flex-col items-start justify-between rounded-md border bg-white p-5 text-left transition-colors focus-visible:outline-none ${
        selected ? "border-gray-900" : "border-gray-200 hover:border-gray-400"
      }`}
    >
      <span className="text-sm font-medium text-gray-900">{option.name}</span>

      <span className="text-sm text-gray-500">{option.description}</span>
    </button>
  );
}

export default CreateTypeCard;
