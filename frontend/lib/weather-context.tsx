"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const WeatherContext = createContext<any>(null);

const WEATHER_CACHE_KEY = "openMeteoWeatherData";

const OPEN_METEO_URL =
  "https://api.open-meteo.com/v1/forecast" +
  "?latitude=0.49" +
  "&longitude=101.46" +
  "&timezone=Asia%2FJakarta" +
  "&forecast_days=1" +
  "&current=" +
  "temperature_2m," +
  "relativehumidity_2m," +
  "windspeed_10m," +
  "precipitation," +
  "shortwave_radiation," +
  "direct_radiation," +
  "cloud_cover," +
  "surface_pressure" +
  "&daily=" +
  "temperature_2m_max," +
  "temperature_2m_min," +
  "temperature_2m_mean," +
  "relative_humidity_2m_mean," +
  "shortwave_radiation_sum";


export function WeatherProvider({
  children,
}: any) {

  const [weather, setWeather] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);


  /* ============================================================
     VALIDASI RESPONSE OPEN-METEO
     ============================================================ */

  const isValidWeather = (data: any) => {

    return (
      data &&
      data.current &&
      typeof data.current === "object" &&
      data.daily &&
      typeof data.daily === "object"
    );
  };


  /* ============================================================
     FETCH OPEN-METEO
     ============================================================ */

  const fetchWeather = async () => {

    try {

      setLoading(true);

      console.log(
        "Mengambil data Open-Meteo..."
      );


      const response =
        await fetch(
          OPEN_METEO_URL,
          {
            method: "GET",
            cache: "no-store",
          }
        );


      if (!response.ok) {

        throw new Error(
          `Open-Meteo HTTP error: ${response.status}`
        );

      }


      const data =
        await response.json();


      console.log(
        "Response Open-Meteo:",
        data
      );


      /* ========================================================
         VALIDASI
         ======================================================== */

      if (!isValidWeather(data)) {

        console.error(
          "Response Open-Meteo tidak sesuai:",
          data
        );

        throw new Error(
          "Struktur response Open-Meteo tidak valid"
        );

      }


      /* ========================================================
         SET STATE
         ======================================================== */

      setWeather(data);


      /* ========================================================
         CACHE
         ======================================================== */

      const cache = {
        timestamp: Date.now(),
        data,
      };


      localStorage.setItem(
        WEATHER_CACHE_KEY,
        JSON.stringify(cache)
      );


    } catch (error) {

      console.error(
        "Gagal mengambil data Open-Meteo:",
        error
      );


      /*
       * Kalau API gagal, jangan biarkan data
       * lama yang tidak valid tetap digunakan.
       */

      setWeather(null);

    } finally {

      setLoading(false);

    }
  };


  /* ============================================================
     INITIAL LOAD
     ============================================================ */

  useEffect(() => {

    let shouldFetch = true;


    try {

      const cached =
        localStorage.getItem(
          WEATHER_CACHE_KEY
        );


      if (cached) {

        const parsed =
          JSON.parse(cached);


        const timestamp =
          parsed?.timestamp;

        const data =
          parsed?.data;


        const oneHour =
          60 * 60 * 1000;


        /* ======================================================
           CACHE VALID
           ====================================================== */

        if (
          timestamp &&
          Date.now() - timestamp < oneHour &&
          isValidWeather(data)
        ) {

          console.log(
            "Menggunakan cache Open-Meteo"
          );


          setWeather(data);

          setLoading(false);

          shouldFetch = false;

        }

        /* ======================================================
           CACHE INVALID / EXPIRED
           ====================================================== */

        else {

          console.log(
            "Cache Open-Meteo sudah expired/tidak valid"
          );

          localStorage.removeItem(
            WEATHER_CACHE_KEY
          );

        }

      }

    } catch (error) {

      console.error(
        "Cache tidak valid:",
        error
      );

      localStorage.removeItem(
        WEATHER_CACHE_KEY
      );

    }


    /* ==========================================================
       FETCH JIKA TIDAK ADA CACHE VALID
       ========================================================== */

    if (shouldFetch) {

      fetchWeather();

    }


    /* ==========================================================
       UPDATE SETIAP 1 JAM
       ========================================================== */

    const interval =
      setInterval(
        fetchWeather,
        60 * 60 * 1000
      );


    return () => {

      clearInterval(interval);

    };

  }, []);


  /* ============================================================
     PROVIDER
     ============================================================ */

  return (

    <WeatherContext.Provider
      value={weather}
    >

      {children}

    </WeatherContext.Provider>

  );
}


/* ==============================================================
   HOOK
   ============================================================== */

export function useWeather() {

  return useContext(
    WeatherContext
  );

}