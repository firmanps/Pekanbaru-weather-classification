// "use client";

// import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { CloudSun, Download, Home, Menu } from "lucide-react";
// import { useState } from "react";

// export default function Navbar() {
//   const [sheetOpen, setSheetOpen] = useState(false);

//   const scrollToSection = (sectionId: string) => {
//     const element = document.querySelector(sectionId);
//     if (element) {
//       element.scrollIntoView({ behavior: "smooth", block: "start" });
//     }
//   };

//   const openInstallPopup = () => {
//     if (sheetOpen) {
//       // Sheet masih terbuka — tutup dulu, dispatch setelah animasi selesai
//       setSheetOpen(false);
//       setTimeout(() => {
//         window.dispatchEvent(new Event("open-pwa-install"));
//       }, 150);
//     } else {
//       // Sheet sudah tutup / desktop — langsung dispatch
//       window.dispatchEvent(new Event("open-pwa-install"));
//     }
//   };

//   const handleSheetOpenChange = (open: boolean) => setSheetOpen(open);

//   return (
//     <header className="w-full border-b fixed top-0 left-0 z-50 bg-white/10 backdrop-blur-3xl">
//       <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4">
//         {/* Logo */}
//         <div className="flex items-center gap-2 font-semibold text-lg">
//           <CloudSun className="text-blue-500" />
//           Weather Classification
//         </div>

//         {/* Desktop Menu */}
//         <nav className="hidden md:flex gap-8">
//           <button
//             onClick={() => scrollToSection("#home")}
//             className="hover:text-blue-500 px-2 py-1 rounded transition-colors"
//           >
//             Home
//           </button>
//           {/* <button
//             onClick={() => scrollToSection("#forecast")}
//             className="hover:text-blue-500 px-2 py-1 rounded transition-colors"
//           >
//             Forecast
//           </button> */}
//           <button
//             onClick={() => scrollToSection("#prediction")}
//             className="hover:text-blue-500 px-2 py-1 rounded transition-colors"
//           >
//             Classification
//           </button>
//           <button
//             onClick={openInstallPopup}
//             className="hover:text-blue-500 px-2 py-1 rounded transition-colors"
//           >
//             Install APK
//           </button>
//         </nav>

//         {/* Mobile Menu */}
//         <div className="md:hidden">
//           {/* ↓ Sheet sekarang controlled */}
//           <Sheet open={sheetOpen} onOpenChange={handleSheetOpenChange}>
//             <SheetTrigger asChild>
//               <Button variant="ghost" size="icon">
//                 <Menu />
//               </Button>
//             </SheetTrigger>

//             <SheetContent side="right" className="w-64">
//               <div className="mt-8 flex flex-col gap-2 text-lg m-3">
//                 <button
//                   onClick={() => {
//                     setSheetOpen(false);
//                     scrollToSection("#home");
//                   }}
//                   className="flex items-center gap-3 hover:text-blue-500 border-b py-3 w-full text-left"
//                 >
//                   <Home size={20} />
//                   Home
//                 </button>
//                 <button
//                   onClick={() => {
//                     setSheetOpen(false);
//                     scrollToSection("#forecast");
//                   }}
//                   className="flex items-center gap-3 hover:text-blue-500 border-b py-3 w-full text-left"
//                 >
//                   <CloudSun size={20} />
//                   Forecast
//                 </button>
//                 {/* <button
//                   onClick={() => { setSheetOpen(false); scrollToSection("#prediction"); }}
//                   className="flex items-center gap-3 hover:text-blue-500 border-b py-3 w-full text-left"
//                 >
//                   <Brain size={20} />
//                   Prediction
//                 </button> */}
//                 <button
//                   onClick={openInstallPopup}
//                   className="flex items-center gap-3 hover:text-blue-500 border-b py-3 w-full text-left"
//                 >
//                   <Download size={20} />
//                   Install APK
//                 </button>
//               </div>
//             </SheetContent>
//           </Sheet>
//         </div>
//       </div>
//     </header>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Brain,
  CloudSun,
  Download,
  Home,
  Menu,
} from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [sheetOpen, setSheetOpen] = useState(false);

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
    if (sheetOpen) {
      // Tutup mobile menu terlebih dahulu
      setSheetOpen(false);

      // Tunggu animasi Sheet selesai
      setTimeout(() => {
        window.dispatchEvent(new Event("open-pwa-install"));
      }, 150);
    } else {
      window.dispatchEvent(new Event("open-pwa-install"));
    }
  };

  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open);
  };

  return (
    <header className="relative z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">

        {/* =========================
            LOGO
        ========================== */}
        <button
          onClick={() => scrollToSection("#home")}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
            <CloudSun
              size={22}
              className="text-blue-600"
            />
          </div>

          <span className="text-base font-bold tracking-tight text-gray-900 sm:text-lg">
            Weather Classification
          </span>
        </button>

        {/* =========================
            DESKTOP MENU
        ========================== */}
        <nav className="hidden items-center gap-2 md:flex">

          <button
            onClick={() => scrollToSection("#home")}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-blue-50 hover:text-blue-600"
          >
            Home
          </button>

          <button
            onClick={() => scrollToSection("#prediction")}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-blue-50 hover:text-blue-600"
          >
            Classification
          </button>

          <button
            onClick={openInstallPopup}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-blue-50 hover:text-blue-600"
          >
            Install APK
          </button>

        </nav>

        {/* =========================
            MOBILE MENU
        ========================== */}
        <div className="md:hidden">
          <Sheet
            open={sheetOpen}
            onOpenChange={handleSheetOpenChange}
          >
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              >
                <Menu size={22} />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-72 bg-white"
            >
              <div className="mt-8 px-2">

                {/* Mobile title */}
                <div className="mb-6 flex items-center gap-3 border-b pb-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                    <CloudSun
                      size={22}
                      className="text-blue-600"
                    />
                  </div>

                  <div>
                    <p className="font-bold text-gray-900">
                      Weather Classification
                    </p>
                    <p className="text-xs text-gray-500">
                      Pekanbaru
                    </p>
                  </div>
                </div>

                {/* Menu items */}
                <div className="flex flex-col">

                  {/* Home */}
                  <button
                    onClick={() => {
                      setSheetOpen(false);
                      scrollToSection("#home");
                    }}
                    className="flex w-full items-center gap-3 border-b py-4 text-left text-gray-700 transition-colors hover:text-blue-600"
                  >
                    <Home size={20} />
                    <span>Home</span>
                  </button>

                  {/* Classification */}
                  <button
                    onClick={() => {
                      setSheetOpen(false);
                      scrollToSection("#prediction");
                    }}
                    className="flex w-full items-center gap-3 border-b py-4 text-left text-gray-700 transition-colors hover:text-blue-600"
                  >
                    <Brain size={20} />
                    <span>Classification</span>
                  </button>

                  {/* Install APK */}
                  <button
                    onClick={openInstallPopup}
                    className="flex w-full items-center gap-3 border-b py-4 text-left text-gray-700 transition-colors hover:text-blue-600"
                  >
                    <Download size={20} />
                    <span>Install APK</span>
                  </button>

                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}