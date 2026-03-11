"use client"

import { createContext, useContext, useEffect, useState } from "react"
import axiosInstance from "./axios"

const WeatherContext = createContext<any>(null)

export function WeatherProvider({ children }: any) {
  const [weather, setWeather] = useState<any>(null)

  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY

  const fetchWeather = async () => {
    try {
      const res = await axiosInstance.get(
        `https://api.openweathermap.org/data/2.5/weather?q=Pekanbaru&units=metric&appid=${API_KEY}`
      )

      setWeather(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchWeather()

    const interval = setInterval(fetchWeather, 3600000) // refresh 1 jam 

    return () => clearInterval(interval)
  }, [])

  return (
    <WeatherContext.Provider value={weather}>
      {children}
    </WeatherContext.Provider>
  )
}

export function useWeather() {
  return useContext(WeatherContext)
}