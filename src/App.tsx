/// <reference types="dom-chromium-ai" />

import { useEffect, useRef, useState } from "react";

import FooterSection from "./components/FooterSection";
import Header from "./components/Header";

const TOPIC = "JavaScript (no basic syntax, only advanced concepts)";

function App() {
  const fetchingRef = useRef(false);
  const [knownItems, setKnownItems] = useState<string[]>([]);
  const [unfamiliarItems, setUnfamiliarItems] = useState<string[]>([]);
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    void (async () => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;

      setFetching(true);
      setQuestion("");
      setContext("");

      const knownString = knownItems.length > 0 ? knownItems.join(", ") : "None yet";
      const unfamiliarString = unfamiliarItems.length > 0 ? unfamiliarItems.join(", ") : "None yet";

      const dynamicPrompt = `
        You are the backend engine for a "Tinder-like" flashcard app.
        Topic: ${TOPIC}

        Current Progress:
        - Known items: [${knownString}]
        - Not Familiar items: [${unfamiliarString}]

        Return exactly ONE new term or concept related to the topic that is NOT in the lists above.
        EXAMPLE OF EXACT ALLOWED OUTPUT FORMAT (EXACTLY TWO LINES):
        Closures
        A function that remembers its outer variables

        Your response:
      `;

      try {
        const session = await LanguageModel.create();
        const stream = session.promptStreaming(dynamicPrompt);
        let accumulatedText = "";

        for await (const chunk of stream) {
          accumulatedText += chunk;

          const lines = accumulatedText.trim().split("\n");
          if (lines[0]) setQuestion(lines[0].trim());
          if (lines[1]) setContext(lines[1].trim());
        }
      } catch (error) {
        console.error("Failed to generate card:", error);
      } finally {
        setFetching(false);
        fetchingRef.current = false;
      }
    })();
  }, [knownItems, unfamiliarItems]);

  const handleSwipe = (knows: boolean, item: string) => {
    if (!item || fetching) return;
    if (knows) {
      setKnownItems((prev) => [...prev, item]);
    } else {
      setUnfamiliarItems((prev) => [...prev, item]);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-[#09090b] p-6 font-sans text-[#edf2f7] selection:bg-[#10b981]/30">
      <Header topic={TOPIC} />

      <main className="my-8 flex w-full max-w-md flex-1 flex-col items-center justify-center">
        <div className="group relative flex aspect-3/4 max-h-105 w-full flex-col justify-between overflow-hidden rounded-2xl border border-[#27272a] bg-[#121214] p-8 shadow-[0_0_50px_-12px_rgba(16,185,129,0.1)] transition-all duration-300 hover:border-[#3f3f46]">
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#10b981]/5 blur-3xl transition-all duration-300 group-hover:bg-[#10b981]/10" />

          {fetching && !question ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#10b981] border-t-transparent" />
              <p className="animate-pulse font-mono text-xs tracking-wider text-gray-500 uppercase">
                Generating Next Concept...
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <span className="rounded-md bg-[#10b981]/10 px-2.5 py-1 font-mono text-xs font-semibold tracking-widest text-[#10b981] uppercase">
                  Advanced Concept
                </span>
                <h2 className="pt-2 text-2xl font-bold tracking-tight wrap-break-word text-white">
                  {question || "Waiting for stream..."}
                </h2>
              </div>

              <div className="mt-4 flex flex-1 items-center">
                <p className="border-l-2 border-zinc-800 py-1 pl-4 text-sm leading-relaxed text-gray-400 italic">
                  {context || "..."}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex w-full gap-4">
          <button
            disabled={fetching || !question}
            onClick={() => handleSwipe(false, question)}
            className="flex-1 cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-3.5 text-center text-sm font-semibold transition-all duration-200 hover:border-red-500/40 hover:bg-red-950/20 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-zinc-800 disabled:hover:bg-zinc-900 disabled:hover:text-gray-400"
          >
            Don't Know ✕
          </button>
          <button
            disabled={fetching || !question}
            onClick={() => handleSwipe(true, question)}
            className="flex-1 cursor-pointer rounded-xl bg-[#10b981] px-6 py-3.5 text-center text-sm font-bold text-zinc-950 transition-all duration-200 hover:bg-[#059669] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[#10b981] disabled:hover:shadow-none"
          >
            Know It ✓
          </button>
        </div>
      </main>

      <footer className="grid w-full max-w-md grid-cols-2 gap-4 border-t border-[#1f2937] pt-4 font-mono text-xs text-gray-500">
        <FooterSection label="Mastered" items={knownItems} type="known" />
        <FooterSection label="Review Later" items={unfamiliarItems} type="unfamiliar" />
      </footer>
    </div>
  );
}

export default App;
