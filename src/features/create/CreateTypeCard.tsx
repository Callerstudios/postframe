import type { CreateTypeOption } from "./createTypes";

type CreateTypeCardProps = {
  option: CreateTypeOption;
  selected?: boolean;
  onSelect?: (id: CreateTypeOption["id"]) => void;
};

// Icons are matched by keyword against id/name rather than a hardcoded id
// map, so a renamed or newly added content type still gets a sensible
// icon instead of silently falling through. Extend the checks below (or
// add a new branch) as new create types are introduced.
function CreateTypeIcon({ option }: { option: CreateTypeOption }) {
  const key = `${option.id} ${option.name}`.toLowerCase();

  if (key.includes("code") || key.includes("technical")) {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
        <path
          d="M9 8 4.5 12 9 16M15 8l4.5 4-4.5 4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (key.includes("thread")) {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
        <rect x="4" y="4" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="8" y="8" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.7" fill="none" />
      </svg>
    );
  }

  if (key.includes("social") || key.includes("post") || key.includes("tweet")) {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
        <path
          d="M12 4c-4.97 0-9 3.58-9 8 0 2.49 1.28 4.71 3.3 6.17-.1.99-.5 2.62-1.7 4.13 1.75-.15 3.5-.94 4.78-1.9A10.9 10.9 0 0 0 12 20c4.97 0 9-3.58 9-8s-4.03-8-9-8Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 15l4.5-4.5 3 3L17.5 8 20 10.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CreateTypeCard({ option, selected = false, onSelect }: CreateTypeCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect?.(option.id)}
      className={`group relative flex min-h-40 w-full flex-col items-start justify-between rounded-xl border bg-white p-5 text-left shadow-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 ${
        selected
          ? "border-gray-900 bg-gray-50 shadow-none ring-1 ring-gray-900"
          : "border-gray-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
      }`}
    >
      {selected && (
        <span
          className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-gray-900 text-white"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" width="11" height="11" fill="none">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}

      <span
        className={`flex size-10 items-center justify-center rounded-lg border transition-colors ${
          selected
            ? "border-gray-900 bg-gray-900 text-white"
            : "border-gray-200 bg-gray-50 text-gray-500 group-hover:border-gray-300 group-hover:text-gray-700"
        }`}
      >
        <CreateTypeIcon option={option} />
      </span>

      <span>
        <span className="block text-sm font-semibold text-gray-900">{option.name}</span>
        <span className="mt-1 block text-sm leading-normal text-gray-500">
          {option.description}
        </span>
      </span>
    </button>
  );
}

export default CreateTypeCard;
