"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "./axios";

const WeatherContext = createContext<any>(null);

export function WeatherProvider({ children }: any) {
  const [weather, setWeather] = useState<any>(null);

  const API_KEY = process.env.WEATHER_API_KEY;

  const fetchWeather = async () => {
    try {
      const res = await axiosInstance.get(
        `https://api.openweathermap.org/data/2.5/weather?q=Pekanbaru&units=metric&appid=${API_KEY}`
      );

      const data = res.data;
      setWeather(data);

      // Simpan ke localStorage beserta timestamp
      const cache = {
        timestamp: Date.now(),
        data,
      };
      localStorage.setItem("weatherData", JSON.stringify(cache));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Cek localStorage dulu
    const cached = localStorage.getItem("weatherData");
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      const oneHour = 60 * 60 * 1000;
      if (Date.now() - timestamp < oneHour) {
        setWeather(data); // pakai data lama
      } else {
        fetchWeather(); // data lama sudah lebih dari 1 jam, fetch baru
      }
    } else {
      fetchWeather(); // belum ada data, fetch baru
    }

    // Interval untuk fetch otomatis setiap 1 jam
    const interval = setInterval(fetchWeather, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <WeatherContext.Provider value={weather}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  return useContext(WeatherContext);
}