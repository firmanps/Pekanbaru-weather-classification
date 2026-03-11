"use client";

import { Button } from "@/components/ui/button";
import { useWeather } from "@/lib/weather-context";
import { ArrowRight, Brain, ChartColumn } from "lucide-react";

export default function Hero() {
  const weather = useWeather();

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

  function getWeatherGif() {
    const condition = weather?.weather?.[0]?.main;
    switch (condition) {
      case "Clear":
        return "/weather/sunny.gif";
      case "Clouds":
        return "/weather/cloudy.gif";
      case "Rain":
      case "Drizzle":
        return "/weather/light-rain.gif";
      case "Thunderstorm":
        return "/weather/heavy-rain.gif";
      default:
        return "/weather/sunny.gif";
    }
  }

  return (
    <section id="home" className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 py-16 items-center mt-10 px-4">
      {/* LEFT CONTENT */}
      <div>
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium transition hover:scale-105">
          <Brain size={16} />
          Weather Classification System
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mt-4 leading-tight">
          Weather Prediction <br />
          System for <span className="text-blue-600">Pekanbaru</span>
        </h1>

        <p className="text-gray-500 mt-4 max-w-xl">
          This application predicts daily weather conditions using a machine
          learning model based on meteorological parameters such as temperature,
          humidity, rainfall, sunshine duration, and wind speed.
        </p>

        <div className="flex flex-wrap gap-4 mt-6">
          {/* BUTTON 1: PREDICTION */}
          <Button
            onClick={() => scrollToSection("#prediction")}
            className="bg-blue-600 hover:bg-blue-500 flex items-center gap-2 transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            Predict Weather
            <ArrowRight size={18} />
          </Button>

          {/* BUTTON 2: FORECAST */}
          <Button
            variant="outline"
            onClick={() => scrollToSection("#forecast")}
            className="flex items-center gap-2 transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <ChartColumn size={18} />
            View Forecast
          </Button>
        </div>
      </div>

      {/* RIGHT WEATHER ICON */}
      <div className="hidden md:flex justify-center">
        <div className="relative w-64 h-64 md:w-80 md:h-80 group">
          {/* MAIN CIRCLE */}
          <div className="w-full h-full bg-linear-to-br from-[#D2E3F2] to-[#F0E8D8] rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105">
            <img
              src={getWeatherGif()}
              alt="weather icon"
              className="w-52 h-52 object-contain animate-float-weather rounded-full"
            />
          </div>

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
        </div>
      </div>
    </section>
  );
}
