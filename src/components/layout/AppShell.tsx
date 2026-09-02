import type { ReactNode } from "react";
import Header from "./Header";
type AppShellProps = { children: ReactNode };
function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {" "}
      <Header />{" "}
      <main className="mx-auto w-full max-w-content px-4 py-6">
        {" "}
        {children}{" "}
      </main>{" "}
    </div>
  );
}
export default AppShell;
