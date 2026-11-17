"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

export interface TranslationState {
  word: string;
  rect: { left: number; top: number; bottom: number };
  translation?: string;
  error?: string;
}

export default function TranslationTooltip({
  state,
  onClose,
}: {
  state: TranslationState;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);

  useLayoutEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const { width, height } = element.getBoundingClientRect();
    const left = Math.max(12, Math.min(state.rect.left, window.innerWidth - width - 12));
    const top =
      state.rect.bottom + height + 12 < window.innerHeight
        ? state.rect.bottom + 8
        : Math.max(12, state.rect.top - height - 8);

    element.style.left = `${left}px`;
    element.style.top = `${Math.min(top, Math.max(12, window.innerHeight - height - 12))}px`;
  }, [state]);

  return (
    <div
      ref={ref}
      tabIndex={-1}
      className="translation-tooltip"
      role="dialog"
      aria-label={`Tradução de ${state.word}`}
      lang="pt-BR"
    >
      <button
        type="button"
        className="translation-close"
        onClick={onClose}
        aria-label="Fechar tradução"
      >
        ×
      </button>
      <strong lang="en">{state.word}</strong>
      <p role="status" aria-live="polite">
        {state.error || state.translation || "Traduzindo…"}
      </p>
    </div>
  );
}
