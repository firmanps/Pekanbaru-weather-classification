"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Brain, CloudSun, Home, Menu } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header id="home" className="w-full border-b fixed top-0 left-0 z-50 bg-white/10 backdrop-blur-3xl">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4">
        {/* Logo */}
        <div className="flex items-center gap-2 font-semibold text-lg">
          <CloudSun className="text-blue-500" />
          Weather Prediction
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8">
          <Link href="#home" className="hover:text-blue-500">
            Home
          </Link>
          <Link href="#forecast" className="hover:text-blue-500">
            Forecast
          </Link>
          <Link href="#prediction" className="hover:text-blue-500">
            Prediction
          </Link>
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-64">
              <div className="mt-8 flex flex-col gap-2 text-lg m-3">
                <Link
                  href="#home"
                  className="flex items-center gap-3 hover:text-blue-500 border-b py-3"
                >
                  <Home size={20} />
                  Home
                </Link>

                <Link
                  href="#forecast"
                  className="flex items-center gap-3 hover:text-blue-500 border-b py-3"
                >
                  <CloudSun size={20} />
                  Forecast
                </Link>

                <Link
                  href="#prediction"
                  className="flex items-center gap-3 hover:text-blue-500 border-b py-3"
                >
                  <Brain size={20} />
                  Prediction
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
