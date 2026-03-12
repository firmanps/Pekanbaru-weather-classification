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
    // Deteksi jika sudah terinstall sebagai PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      localStorage.setItem(STORAGE_KEY, "true");
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      // Selalu simpan prompt, apapun kondisinya
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Popup otomatis hanya jika belum pernah dismiss
      const alreadyDismissed = localStorage.getItem(STORAGE_KEY);
      if (!alreadyDismissed) {
        setShowPopup(true);
      }
    };

    const openHandler = () => {
      setManuallyOpened(true);
      setShowPopup(true);
      // deferredPrompt sudah tersimpan dari handler sebelumnya ✅
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
      // Hanya set storage jika bukan manual open
      localStorage.setItem(STORAGE_KEY, "true");
    }
    setShowPopup(false);
    setManuallyOpened(false);
  };

  if (!showPopup) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-9999 w-[calc(100%-2rem)] max-w-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-center gap-4">
        {/* Icon */}
        <div className="shrink-0 w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
          <svg
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
            />
          </svg>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            Install Weather App
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {deferredPrompt
              ? "Akses lebih cepat, bisa offline!"
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
