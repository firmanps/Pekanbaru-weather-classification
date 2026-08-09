"use client";

import axiosInstance from "@/lib/axios";

const PREDICTION_CACHE_KEY = "weatherPrediction";
const ONE_HOUR_MS = 60 * 60 * 1000;
const DEFAULT_CLRsky_SW = 23.0;

let inFlightPrediction: Promise<string | null> | null = null;

type WeatherLike = {
  main: { temp: number; humidity: number };
  wind: { speed: number };
};

type ForecastItem = {
  dt_txt: string;
  main: { temp: number; humidity: number };
  wind: { speed: number };
  clouds: { all: number };
};

function estimateQv2m(tempC: number, rhPercent: number): number {
  const es = 6.112 * Math.exp((17.67 * tempC) / (tempC + 243.5));
  const e = (rhPercent / 100) * es;
  return (622 * e) / (1013.25 - e);
}

export async function getOrFetchPrediction(
  weather: WeatherLike,
  apiKey?: string
): Promise<string | null> {
  const cached = readPredictionCache();
  if (cached) return cached;

  if (inFlightPrediction) return inFlightPrediction;

  inFlightPrediction = (async () => {
    try {
      if (!apiKey) return null;

      const forecastRes = await axiosInstance.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=Pekanbaru&units=metric&appid=${apiKey}`
      );

      const list = (forecastRes.data?.list ?? []) as ForecastItem[];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDate = tomorrow.toISOString().split("T")[0];

      const tomorrowData = list.filter((item) =>
        item.dt_txt?.startsWith(tomorrowDate)
      );

      if (!tomorrowData.length) return null;

      const temps = tomorrowData.map((item) => item.main.temp);
      const humidities = tomorrowData.map((item) => item.main.humidity);
      const winds = tomorrowData.map((item) => item.main.wind.speed);
      const clouds = tomorrowData.map((item) => item.clouds.all);

      const t2mMin = Math.min(...temps);
      const t2mMax = Math.max(...temps);
      const t2m =
        temps.reduce((sum, value) => sum + value, 0) / Math.max(temps.length, 1);
      const rh2m =
        humidities.reduce((sum, value) => sum + value, 0) /
        Math.max(humidities.length, 1);
      const ws2m =
        winds.reduce((sum, value) => sum + value, 0) / Math.max(winds.length, 1);

      const cloudAvg =
        clouds.reduce((sum, value) => sum + value, 0) /
        Math.max(clouds.length, 1);
      const clearSkyRatio = Math.max(0.05, (100 - cloudAvg) / 100);
      const clrskySw = DEFAULT_CLRsky_SW;
      const allskySw = clrskySw * clearSkyRatio;
      const qv2m = estimateQv2m(t2m, rh2m);

      const payload = {
        T2M_MAX: t2mMax,
        T2M_MIN: t2mMin,
        T2M: t2m,
        RH2M: rh2m,
        WS2M: ws2m,
        ALLSKY_SFC_SW_DWN: allskySw,
        CLRSKY_SFC_SW_DWN: clrskySw,
        QV2M: qv2m,
      };

      const prediksiRes = await axiosInstance.post("/prediksi", payload);
      const prediction = prediksiRes.data?.cuaca ?? null;

      writePredictionCache(prediction);
      return prediction;
    } catch {
      return null;
    } finally {
      inFlightPrediction = null;
    }
  })();

  return inFlightPrediction;
}

function readPredictionCache(): string | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(PREDICTION_CACHE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as {
      timestamp?: number;
      cuaca?: string | null;
    };
    if (!parsed.timestamp) return null;
    if (Date.now() - parsed.timestamp >= ONE_HOUR_MS) return null;
    return parsed.cuaca ?? null;
  } catch {
    return null;
  }
}

function writePredictionCache(cuaca: string | null) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    PREDICTION_CACHE_KEY,
    JSON.stringify({ timestamp: Date.now(), cuaca })
  );
}
