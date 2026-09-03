import { useState } from "react";
import AppShell from "./components/layout/AppShell";
import CreateTypeCard from "./features/create/CreateTypeCard";
import { createTypeOptions } from "./features/create/createTypes";
import type { CreateType } from "./features/create/types";
import CreateSetup from "./features/create/CreateSetup";
import QuoteEditor from "./features/create/QuoteEditor";
import SocialPostSetup from "./features/create/SocialPostSetup";
import type { SocialPostData } from "./features/create/socialPostTypes";
import SocialPostEditor from "./features/create/SocialPostEditor";
import type { ThreadData } from "./features/create/threadTypes";
import ThreadSetup from "./features/create/ThreadSetup";
import ThreadEditor from "./features/create/ThreadEditor";

type CreateStep = "select" | "setup" | "editor";

function App() {
  const [selectedType, setSelectedType] = useState<CreateType | null>(null);
  const [confirmedType, setConfirmedType] = useState<CreateType | null>(null);

  const [step, setStep] = useState<CreateStep>("select");

  const [quoteData, setQuoteData] = useState({
    quote: "",
    author: "",
  });

  const [socialPostData, setSocialPostData] = useState<SocialPostData | null>(
    null,
  );
  const [threadData, setThreadData] = useState<ThreadData | null>(null);

  /*
   * --------------------------------------------------
   * QUOTE EDITOR
   * --------------------------------------------------
   */

  if (step === "editor" && confirmedType === "quote") {
    return (
      <AppShell>
        <QuoteEditor
          initialQuote={quoteData.quote}
          initialAuthor={quoteData.author}
          onBack={() => setStep("setup")}
        />
      </AppShell>
    );
  }

  /*
   * --------------------------------------------------
   * QUOTE SETUP
   * --------------------------------------------------
   */

  if (step === "setup" && confirmedType === "quote") {
    return (
      <AppShell>
        <CreateSetup
          type="quote"
          initialQuote={quoteData.quote}
          initialAuthor={quoteData.author}
          onBack={() => {
            setStep("select");
            setConfirmedType(null);
          }}
          onQuoteContinue={(quote, author) => {
            setQuoteData({
              quote,
              author,
            });

            setStep("editor");
          }}
        />
      </AppShell>
    );
  }

  /*
   * --------------------------------------------------
   * SOCIAL POST EDITOR
   * --------------------------------------------------
   */

  if (step === "editor" && confirmedType === "social-post") {
    return (
      <AppShell>
        <SocialPostEditor
          initialData={socialPostData!}
          onBack={(data) => {
            setSocialPostData(data);
            setStep("setup");
          }}
        />
      </AppShell>
    );
  }

  /*
   * --------------------------------------------------
   * SOCIAL POST SETUP
   * --------------------------------------------------
   */

  if (step === "setup" && confirmedType === "social-post") {
    return (
      <AppShell>
        <SocialPostSetup
          initialData={socialPostData ?? undefined}
          onBack={() => {
            setStep("select");
            setConfirmedType(null);
          }}
          onContinue={(data) => {
            setSocialPostData(data);
            setStep("editor");
          }}
        />
      </AppShell>
    );
  }
  /*
   * --------------------------------------------------
   * THREAD EDITOR
   * --------------------------------------------------
   */

  if (step === "editor" && confirmedType === "thread") {
    return (
      <AppShell>
        <ThreadEditor
          initialData={threadData!}
          onBack={(data) => {
            setThreadData(data);
            setStep("setup");
          }}
        />
      </AppShell>
    );
  }
  /*
   * --------------------------------------------------
   * THREAD SETUP
   * --------------------------------------------------
   */

  if (step === "setup" && confirmedType === "thread") {
    return (
      <AppShell>
        <ThreadSetup
          initialData={threadData ?? undefined}
          onBack={() => {
            setStep("select");
            setConfirmedType(null);
          }}
          onContinue={(data) => {
            setThreadData(data);
            setStep("editor");
          }}
        />
      </AppShell>
    );
  }

  /*
   * --------------------------------------------------
   * CREATE TYPE SELECTION
   * --------------------------------------------------
   */

  return (
    <AppShell>
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
            onClick={() => {
              if (!selectedType) {
                return;
              }

              setConfirmedType(selectedType);
              setStep("setup");
            }}
            className="min-h-10 rounded-md bg-gray-900 px-5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
          >
            Continue
          </button>
        </div>
      </section>
    </AppShell>
  );
}

export default App;
