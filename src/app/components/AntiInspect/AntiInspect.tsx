
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function AntiInspect() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState(
    "Please respect our digital space."
  );

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showMessage = useCallback((text: string) => {
    setMessage(text);
    setVisible(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setVisible(false);
    }, 3000);
  }, []);

  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();

      showMessage("Right-click is disabled on this website.");
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      const isDevToolsShortcut =
        event.key === "F12" ||
        (event.ctrlKey &&
          event.shiftKey &&
          ["i", "j", "c"].includes(key)) ||
        (event.ctrlKey && key === "u") ||
        (event.metaKey &&
          event.altKey &&
          ["i", "j", "c"].includes(key));

      if (isDevToolsShortcut) {
        event.preventDefault();

        showMessage("Developer tools access is restricted.");
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown, true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [showMessage]);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={`fixed bottom-6 left-1/2 z-[99999] w-[calc(100%-32px)] max-w-sm -translate-x-1/2 transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-5 opacity-0"
      }`}
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111114]/95 p-4 text-white shadow-2xl shadow-black/30 backdrop-blur-xl">
        {/* Top accent */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        <div className="flex items-start gap-3">
          {/* Lock icon */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-amber-400"
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <path d="M12 15v3" />
            </svg>
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            <h3 className="text-sm font-semibold tracking-wide">
              Access Restricted
            </h3>

            <p className="mt-1 text-sm leading-5 text-white/65">
              {message}
            </p>

            <p className="mt-2 text-[11px] tracking-wide text-amber-400/90">
              Thank you for respecting our digital space.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setVisible(false)}
            aria-label="Dismiss notification"
            className="rounded-md p-1 text-white/40 transition hover:bg-white/10 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="m18 6-12 12M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Auto-dismiss progress bar */}
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/5">
          <div
            key={visible ? message : "hidden"}
            className={`h-full bg-amber-400 ${
              visible ? "animate-toast-progress" : "w-0"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
