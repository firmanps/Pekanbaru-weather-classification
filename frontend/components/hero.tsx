"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  ChartColumn,
  CloudRain,
  Droplets,
  Wind,
} from "lucide-react";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/img/background.png')",
      }}
    >
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/45 to-transparent" />

      {/* Additional soft overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Decorative blur */}
      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

      {/* Main content */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-6 py-20 lg:px-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
          className="max-w-3xl"
        >
          {/* Badge */}
          <motion.div
            variants={{
              hidden: {
                opacity: 0,
                y: 20,
                filter: "blur(6px)",
              },
              show: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              },
            }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-md"
          >
            <Brain size={17} className="text-cyan-300" />
            Weather Classification System
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={{
              hidden: {
                opacity: 0,
                y: 25,
                filter: "blur(6px)",
              },
              show: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              },
            }}
            className="text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Weather Classification
            <br />
            System for{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              Pekanbaru
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={{
              hidden: {
                opacity: 0,
                y: 20,
              },
              show: {
                opacity: 1,
                y: 0,
              },
            }}
            className="mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg"
          >
            This application classifies daily weather conditions using a
            machine learning model based on meteorological parameters such as
            temperature, humidity, rainfall, sunshine duration, and wind speed.
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={{
              hidden: {
                opacity: 0,
                y: 20,
              },
              show: {
                opacity: 1,
                y: 0,
              },
            }}
            className="mt-8 flex flex-wrap gap-4"
          >
            {/* Primary Button */}
            <motion.div
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                onClick={() => scrollToSection("#prediction")}
                className="h-12 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-xl shadow-blue-900/30 transition-all hover:bg-blue-500 hover:shadow-blue-500/30"
              >
                Classify Weather
                <ArrowRight
                  size={18}
                  className="ml-2 transition-transform group-hover:translate-x-1"
                />
              </Button>
            </motion.div>

            {/* Secondary Button */}
            <motion.div
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                variant="outline"
                onClick={() => scrollToSection("#petacuaca")}
                className="h-12 rounded-xl border-white/40 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 hover:text-white"
              >
                <ChartColumn size={18} className="mr-2" />
                View Map
              </Button>
            </motion.div>
          </motion.div>

          {/* Feature cards */}
          <motion.div
            variants={{
              hidden: {
                opacity: 0,
                y: 25,
              },
              show: {
                opacity: 1,
                y: 0,
              },
            }}
            className="mt-10 flex flex-wrap gap-3"
          >
            {/* Temperature */}
            <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-white backdrop-blur-md">
              <div className="rounded-lg bg-orange-400/20 p-2">
                <CloudRain size={17} className="text-orange-300" />
              </div>

              <div>
                <p className="text-xs text-slate-300">Weather</p>
                <p className="text-sm font-semibold">Daily Analysis</p>
              </div>
            </div>

            {/* Humidity */}
            <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-white backdrop-blur-md">
              <div className="rounded-lg bg-cyan-400/20 p-2">
                <Droplets size={17} className="text-cyan-300" />
              </div>

              <div>
                <p className="text-xs text-slate-300">Data</p>
                <p className="text-sm font-semibold">Meteorological</p>
              </div>
            </div>

            {/* Wind */}
            <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-white backdrop-blur-md">
              <div className="rounded-lg bg-blue-400/20 p-2">
                <Wind size={17} className="text-blue-300" />
              </div>

              <div>
                <p className="text-xs text-slate-300">Model</p>
                <p className="text-sm font-semibold">Machine Learning</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent" />
    </section>
  );
}