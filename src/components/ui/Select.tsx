import type { SelectHTMLAttributes } from "react";
type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;
function Select({ className = "", ...props }: SelectProps) {
  return (
    <select
      className={`min-h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-gray-900 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 ${className}`}
      {...props}
    />
  );
}
export default Select;
