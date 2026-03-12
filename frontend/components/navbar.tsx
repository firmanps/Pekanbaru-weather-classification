"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Brain, CloudSun, Download, Home, Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [sheetOpen, setSheetOpen] = useState(false);

  // Fungsi scroll sama persis seperti Hero
  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const openInstallPopup = () => {
    setSheetOpen(false); // ← tutup sidebar dulu
    setTimeout(() => {
      window.dispatchEvent(new Event("open-pwa-install"));
    }, 300);
  };

  return (
    <header className="w-full border-b fixed top-0 left-0 z-50 bg-white/10 backdrop-blur-3xl">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4">
        {/* Logo */}
        <div className="flex items-center gap-2 font-semibold text-lg">
          <CloudSun className="text-blue-500" />
          Weather Prediction
        </div>

        {/* Desktop Menu - SEMUA DIPERBAIKI */}
        <nav className="hidden md:flex gap-8">
          <button
            onClick={() => scrollToSection("#home")}
            className="hover:text-blue-500 px-2 py-1 rounded transition-colors"
          >
            Home
          </button>

          <button
            onClick={() => scrollToSection("#forecast")}
            className="hover:text-blue-500 px-2 py-1 rounded transition-colors"
          >
            Forecast
          </button>

          <button
            onClick={() => scrollToSection("#prediction")}
            className="hover:text-blue-500 px-2 py-1 rounded transition-colors"
          >
            Prediction
          </button>

          <button
            onClick={openInstallPopup}
            className="hover:text-blue-500 px-2 py-1 rounded transition-colors"
          >
            Install APK
          </button>
        </nav>

        {/* Mobile Menu - SHEET */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-64">
              <div className="mt-8 flex flex-col gap-2 text-lg m-3">
                {/* MOBILE HOME */}
                <button
                  onClick={() => scrollToSection("#home")}
                  className="flex items-center gap-3 hover:text-blue-500 border-b py-3 w-full text-left"
                >
                  <Home size={20} />
                  Home
                </button>

                {/* MOBILE FORECAST */}
                <button
                  onClick={() => scrollToSection("#forecast")}
                  className="flex items-center gap-3 hover:text-blue-500 border-b py-3 w-full text-left"
                >
                  <CloudSun size={20} />
                  Forecast
                </button>

                {/* MOBILE PREDICTION */}
                <button
                  onClick={() => scrollToSection("#prediction")}
                  className="flex items-center gap-3 hover:text-blue-500 border-b py-3 w-full text-left"
                >
                  <Brain size={20} />
                  Prediction
                </button>

                <button
                  onClick={openInstallPopup}
                  className="flex items-center gap-3 hover:text-blue-500 border-b py-3 w-full text-left"
                >
                  <Download size={20} />
                  Install APK
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
