"use client";

import axiosInstance from "@/lib/axios";
import { useWeather } from "@/lib/weather-context";
import { useEffect, useState } from "react";

export default function Forecast() {
  const weather = useWeather();
  const [forecast, setForecast] = useState<any>(null);

  useEffect(() => {
    if (!weather) return;

    const fetchPrediction = async () => {
      try {
        const dataset = {
          TN: weather.main.temp_min,
          TX: weather.main.temp_max,
          TAVG: weather.main.temp,
          RH_AVG: weather.main.humidity,
          RR: weather.rain ? weather.rain["1h"] : 0,
          SS: (100 - weather.clouds.all) / 10,
          FF_AVG: weather.wind.speed,
        };

        const prediksi = await axiosInstance.post("/prediksi", dataset);

        setForecast({
          min: dataset.TN,
          max: dataset.TX,
          cuaca: prediksi.data.cuaca,
        });
      } catch (err) {
        console.error("Prediction error:", err);
      }
    };

    fetchPrediction();
  }, [weather]);

  function getWeatherGif(cuaca: string) {
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

  function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return tomorrow.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
  }

  if (!weather) {
    return (
      <section className="max-w-5xl mx-auto py-16 px-4 text-center">
        <p className="text-gray-500">Loading forecast...</p>
      </section>
    );
  }

  return (
    <section id="forecast" className="max-w-5xl mx-auto py-16 px-4">
      <h2 className="text-center text-2xl font-semibold">
        AI Weather Forecast
      </h2>

      <p className="text-center text-gray-500 mb-10">
        AI prediction for tomorrow based on weather data
      </p>

      <div className="flex justify-center">
        <div
          className="
          group
          border
          rounded-2xl
          p-8
          w-full
          max-w-md
          flex
          items-center
          gap-6
          bg-linear-to-br from-[#D2E3F2] to-[#F0E8D8]
          shadow-sm
          transition-all
          duration-300
          hover:shadow-xl
          hover:-translate-y-1
          "
        >
          {/* Icon */}
          <div
            className="
            w-20
            h-20
            flex
            items-center
            justify-center
            bg-white
            rounded-full
            transition
            duration-300
            group-hover:scale-110
            "
          >
            {forecast && (
              <img
                src={getWeatherGif(forecast.cuaca)}
                alt="weather icon"
                className="w-14 h-14"
              />
            )}
          </div>

          {/* Text */}
          <div>
            <p className="text-sm text-gray-500">Tomorrow</p>

            <p className="font-semibold text-lg">{getTomorrowDate()}</p>

            <p className="text-gray-500">
              {forecast?.cuaca || "Predicting..."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
