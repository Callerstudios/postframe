type DividerProps = { className?: string };
function Divider({ className = "" }: DividerProps) {
  return (
    <div role="separator" className={`h-px w-full bg-gray-200 ${className}`} />
  );
}
export default Divider;
