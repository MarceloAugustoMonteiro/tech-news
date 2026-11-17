"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { normalizeWord, wordAtOffset } from "@/lib/translation-word";
import TranslationTooltip, { type TranslationState } from "./TranslationTooltip";
import "./translation.css";

const INTERACTIVE =
  "a,button,input,textarea,select,video,audio,[role=button],[contenteditable=true]";

export default function InteractiveArticle({ children }: { children: ReactNode }) {
  const inputId = useId();
  const input = useRef<HTMLInputElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const cache = useRef(new Map<string, string>());
  const controller = useRef<AbortController | null>(null);
  const activeWord = useRef<string | null>(null);
  const [state, setState] = useState<TranslationState | null>(null);

  function close() {
    controller.current?.abort();
    activeWord.current = null;

    if (document.activeElement?.closest(".translation-tooltip")) {
      root.current?.focus({ preventScroll: true });
    }

    setState(null);
  }

  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest(".translation-tooltip")) {
        close();
      }
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);

    return () => {
      controller.current?.abort();
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, []);

  async function translate(word: string, rect: DOMRect) {
    if (activeWord.current === word) {
      return;
    }

    controller.current?.abort();
    activeWord.current = word;

    const request = new AbortController();

    controller.current = request;

    const next = { word, rect: { left: rect.left, top: rect.top, bottom: rect.bottom } };
    const saved = cache.current.get(word);

    setState({ ...next, translation: saved });

    if (saved) {
      return;
    }

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word }),
        signal: request.signal,
      });
      const data = await response.json();

      if (!response.ok || typeof data.translation !== "string") {
        throw new Error(
          typeof data.error === "string" ? data.error : "Não foi possível traduzir agora.",
        );
      }

      if (request.signal.aborted) {
        return;
      }

      cache.current.set(word, data.translation);
      setState({ ...next, translation: data.translation });
    } catch (error) {
      if (!request.signal.aborted) {
        setState({
          ...next,
          error: error instanceof Error ? error.message : "Não foi possível traduzir agora.",
        });
      }
    }
  }

  function fromPoint(event: React.MouseEvent<HTMLDivElement>) {
    if (!(event.target instanceof Element) || event.target.closest(INTERACTIVE)) {
      return;
    }

    const walker = document.createTreeWalker(event.target, NodeFilter.SHOW_TEXT);
    let node: Node | null;

    while ((node = walker.nextNode())) {
      if (node.parentElement?.closest(INTERACTIVE)) {
        continue;
      }

      const text = node.textContent || "";

      for (const match of text.matchAll(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)?/gu)) {
        const found = wordAtOffset(text, match.index);

        if (!found) {
          continue;
        }

        const range = document.createRange();

        range.setStart(node, found.start);
        range.setEnd(node, found.end);

        for (const rect of range.getClientRects()) {
          if (
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom
          ) {
            void translate(found.word, rect);

            return;
          }
        }
      }
    }
  }

  return (
    <div className="interactive-article">
      <p className="translation-hint">
        Click or tap an English word to see its Portuguese translation.
      </p>
      <div ref={root} tabIndex={-1} aria-label="Article with word translation" onClick={fromPoint}>
        {children}
      </div>
      <details className="translation-keyboard">
        <summary>Translate a word using the keyboard</summary>
        <form
          onSubmit={(event) => {
            event.preventDefault();

            const word = normalizeWord(input.current?.value);

            if (word && input.current) {
              input.current.setCustomValidity("");
              void translate(word, input.current.getBoundingClientRect());
            } else {
              input.current?.setCustomValidity(
                "Enter a single English word, such as beautiful or don't.",
              );
              input.current?.reportValidity();
            }
          }}
        >
          <label htmlFor={inputId}>English word</label>
          <input
            ref={input}
            id={inputId}
            name="word"
            maxLength={60}
            required
            autoCapitalize="none"
            autoComplete="off"
            onInput={() => input.current?.setCustomValidity("")}
          />
          <button type="submit">Translate</button>
        </form>
      </details>
      {state && <TranslationTooltip state={state} onClose={close} />}
    </div>
  );
}
