import { useState } from "react";
import type { CreateType } from "./types";
import QuoteSetup from "./QuoteSetup";
import QuoteEditor from "./QuoteEditor";
import SocialPostSetup from "./SocialPostSetup";
import SocialPostEditor from "./SocialPostEditor";
import type { SocialPostData } from "./socialPostTypes";
import ThreadSetup from "./ThreadSetup";
import ThreadEditor from "./ThreadEditor";
import type { ThreadData } from "./threadTypes";
import { CreateTypeSelection } from "./CreateTypeSelection";

type CreateStep = "select" | "setup" | "editor";

function CreateFlow() {
  const [step, setStep] = useState<CreateStep>("select");
  const [selectedType, setSelectedType] = useState<CreateType | null>(null);
  const [confirmedType, setConfirmedType] = useState<CreateType | null>(null);

  const [quoteData, setQuoteData] = useState({
    quote: "",
    author: "",
  });

  const [socialPostData, setSocialPostData] = useState<SocialPostData | null>(
    null,
  );

  const [threadData, setThreadData] = useState<ThreadData | null>(null);

  const handleBackToSelection = () => {
    setStep("select");
    setConfirmedType(null);
  };

  const handleContinue = () => {
    if (!selectedType) {
      return;
    }

    setConfirmedType(selectedType);
    setStep("setup");
  };

  /*
   * --------------------------------------------------
   * QUOTE
   * --------------------------------------------------
   */

  if (step === "editor" && confirmedType === "quote") {
    return (
      <QuoteEditor
        initialQuote={quoteData.quote}
        initialAuthor={quoteData.author}
        onBack={() => setStep("setup")}
      />
    );
  }

  if (step === "setup" && confirmedType === "quote") {
    return (
      <QuoteSetup
        initialQuote={quoteData.quote}
        initialAuthor={quoteData.author}
        onBack={handleBackToSelection}
        onQuoteContinue={(quote, author) => {
          setQuoteData({
            quote,
            author,
          });

          setStep("editor");
        }}
      />
    );
  }

  /*
   * --------------------------------------------------
   * SOCIAL POST
   * --------------------------------------------------
   */

  if (step === "editor" && confirmedType === "social-post") {
    return (
      <SocialPostEditor
        initialData={socialPostData!}
        onBack={(data) => {
          setSocialPostData(data);
          setStep("setup");
        }}
      />
    );
  }

  if (step === "setup" && confirmedType === "social-post") {
    return (
      <SocialPostSetup
        initialData={socialPostData ?? undefined}
        onBack={handleBackToSelection}
        onContinue={(data) => {
          setSocialPostData(data);
          setStep("editor");
        }}
      />
    );
  }

  /*
   * --------------------------------------------------
   * THREAD
   * --------------------------------------------------
   */

  if (step === "editor" && confirmedType === "thread") {
    return (
      <ThreadEditor
        initialData={threadData!}
        onBack={(data) => {
          setThreadData(data);
          setStep("setup");
        }}
      />
    );
  }

  if (step === "setup" && confirmedType === "thread") {
    return (
      <ThreadSetup
        initialData={threadData ?? undefined}
        onBack={handleBackToSelection}
        onContinue={(data) => {
          setThreadData(data);
          setStep("editor");
        }}
      />
    );
  }

  /*
   * --------------------------------------------------
   * TYPE SELECTION
   * --------------------------------------------------
   */

  return (
    <CreateTypeSelection
      selectedType={selectedType}
      setSelectedType={setSelectedType}
      handleContinue={handleContinue}
    />
  );
}

export default CreateFlow;
