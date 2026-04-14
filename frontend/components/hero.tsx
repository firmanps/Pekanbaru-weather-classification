"use client";

import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios";
import { useWeather } from "@/lib/weather-context";
import { motion } from "framer-motion";
import { ArrowRight, Brain, ChartColumn } from "lucide-react";
import { useEffect, useState } from "react";

export default function Hero() {
  const weather = useWeather();
  const [aiPrediction, setAiPrediction] = useState<string | null>(null);
  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  // Fungsi scroll universal - Paling reliable
  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    if (!weather) return;

    const fetchPrediction = async () => {
      try {
        const forecastRes = await axiosInstance.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=Pekanbaru&units=metric&appid=${API_KEY}`
        );

        const list = forecastRes.data.list;
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowDate = tomorrow.toISOString().split("T")[0];

        const tomorrowData = list.filter((item: any) =>
          item.dt_txt.startsWith(tomorrowDate)
        );
        if (!tomorrowData.length) return;

        const temps = tomorrowData.map((item: any) => item.main.temp);
        const TN = Math.min(...temps);
        const TX = Math.max(...temps);

        const dataset = {
          TN,
          TX,
          TAVG: weather.main.temp,
          RH_AVG: weather.main.humidity,
          SS: (100 - weather.clouds.all) / 10,
          FF_AVG: weather.wind.speed,
        };

        const prediksiRes = await axiosInstance.post("/prediksi", dataset);
        setAiPrediction(prediksiRes.data?.cuaca ?? null);
      } catch (error) {
        console.error("Gagal fetch prediksi cuaca hero:", error);
      }
    };

    fetchPrediction();
  }, [weather, API_KEY]);

  function getWeatherGif(cuaca: string | null) {
    switch (cuaca) {
      case "Cerah":
        return "/weather/sunny.gif";
      case "Berawan":
        return "/weather/cloudy.gif";
      case "Hujan Ringan":
        return "/weather/light-rain.gif";
      case "Hujan Lebat":
        return "/weather/heavy-rain.gif";
      default:
        return "/weather/sunny.gif";
    }
  }

  return (
    <section
      id="home"
      className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 py-16 items-center mt-10 px-4"
    >
      {/* LEFT CONTENT */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
        }}
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
            show: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium transition hover:scale-105"
        >
          <Brain size={16} />
          Weather Classification System
        </motion.div>

        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
            show: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          className="text-4xl md:text-5xl font-bold mt-4 leading-tight"
        >
          Weather Classification <br />
          System for <span className="text-blue-600">Pekanbaru</span>
        </motion.h1>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 14 },
            show: { opacity: 1, y: 0 },
          }}
          className="text-gray-500 mt-4 max-w-xl"
        >
          This application classifies daily weather conditions using a machine
          learning model based on meteorological parameters such as temperature,
          humidity, rainfall, sunshine duration, and wind speed.
        </motion.p>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 14 },
            show: { opacity: 1, y: 0 },
          }}
          className="flex flex-wrap gap-4 mt-6"
        >
          {/* BUTTON 1: CLASSIFICATION */}
          <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => scrollToSection("#prediction")}
              className="bg-blue-600 hover:bg-blue-500 flex items-center gap-2 transition-all hover:shadow-lg"
            >
              Classify Weather
              <ArrowRight size={18} />
            </Button>
          </motion.div>

          {/* BUTTON 2: FORECAST */}
          <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              onClick={() => scrollToSection("#forecast")}
              className="flex items-center gap-2 transition-all hover:shadow-md"
            >
              <ChartColumn size={18} />
              View Forecast
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* RIGHT WEATHER ICON */}
      <div className="hidden md:flex justify-center">
        <motion.div
          className="relative w-64 h-64 md:w-80 md:h-80 group"
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
        >
          {/* MAIN CIRCLE */}
          <motion.div
            className="w-full h-full bg-linear-to-br from-[#D2E3F2] to-[#F0E8D8] rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105"
            whileHover={{ rotate: 1.2 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            <motion.img
              src={getWeatherGif(aiPrediction)}
              alt="weather icon"
              className="w-52 h-52 object-contain animate-float-weather rounded-full"
              whileHover={{ scale: 1.04 }}
              transition={{ type: "spring", stiffness: 240, damping: 16 }}
            />
          </motion.div>

          {/* TEMPERATURE */}
          {/* {temp && (
            <div className="absolute top-3 right-0 bg-yellow-100 text-yellow-600 font-semibold px-4 py-2 rounded-full shadow text-sm">
              {Math.round(temp)}°
            </div>
          )} */}

          {/* HUMIDITY */}
          {/* {humidity && (
            <div className="absolute bottom-4 -left-2 bg-blue-100 text-blue-600 text-sm px-4 py-2 rounded-full shadow">
              {humidity}% RH
            </div>
          )} */}
        </motion.div>
      </div>
    </section>
  );
}
