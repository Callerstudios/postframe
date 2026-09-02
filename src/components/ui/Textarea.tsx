import type { TextareaHTMLAttributes } from "react";
type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;
function Textarea({ className = "", ...props }: TextareaProps) {
  return (
    <textarea
      className={`min-h-24 w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 ${className}`}
      {...props}
    />
  );
}
export default Textarea;
