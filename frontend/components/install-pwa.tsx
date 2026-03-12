"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const STORAGE_KEY = "pwa-install-dismissed";
const OPEN_EVENT_NAME = "open-pwa-install";

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [manuallyOpened, setManuallyOpened] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      localStorage.setItem(STORAGE_KEY, "true");
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      const alreadyDismissed = localStorage.getItem(STORAGE_KEY);
      if (!alreadyDismissed) {
        setShowPopup(true);
      }
    };

    const openHandler = () => {
      setManuallyOpened(true);
      setShowPopup(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener(OPEN_EVENT_NAME, openHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener(OPEN_EVENT_NAME, openHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      localStorage.setItem(STORAGE_KEY, "true");
    }
    setShowPopup(false);
    setManuallyOpened(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    if (!manuallyOpened) {
      localStorage.setItem(STORAGE_KEY, "true");
    }
    setShowPopup(false);
    setManuallyOpened(false);
  };

  if (!showPopup) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-center gap-4">
        {/* Icon — pakai gambar kamu */}
        <div className="shrink-0 w-12 h-12 rounded-xl overflow-hidden">
          <img
            src="/img/web-app-manifest-192x192.png"
            alt="Weather App Icon"
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            Install Weather App
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {deferredPrompt
              ? "Akses lebih cepat!"
              : "Gunakan menu Install di browser kamu."}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDismiss}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors px-2 py-1"
          >
            Tutup
          </button>
          <button
            onClick={handleInstall}
            disabled={!deferredPrompt}
            className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}