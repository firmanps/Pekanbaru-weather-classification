"use client";

import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useEffect, useMemo, useRef, useState } from "react";

/* ============================================================
   TIPE DATA
   ============================================================ */

type Kecamatan = {
  id: number;
  nama: string;
  latitude: number;
  longitude: number;
};

type WeatherData = {
  latitude: number;
  longitude: number;

  current: {
    temperature_2m: number;
    relativehumidity_2m: number;
    windspeed_10m: number;
    shortwave_radiation: number;
    cloud_cover: number;
    surface_pressure: number;
  };

  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    temperature_2m_mean: number[];
    relative_humidity_2m_mean: number[];
    shortwave_radiation_sum: number[];
  };
};

type PredictionResult = {
  cuaca: string;
  confidence: number;
  probabilitas: {
    Cerah: number;
    Berawan: number;
    "Hujan Ringan": number;
    "Hujan Lebat": number;
  };
};

type KecamatanWeather = Kecamatan & {
  weather?: WeatherData;
  prediction?: PredictionResult;
  loading?: boolean;
  error?: string;
};

/* ============================================================
   DATA KECAMATAN PEKANBARU
   ============================================================ */

const KECAMATAN: Kecamatan[] = [
  { id: 1, nama: "Pekanbaru Kota", latitude: 0.5212, longitude: 101.4473 },
  { id: 2, nama: "Sukajadi", latitude: 0.5138, longitude: 101.4339 },
  { id: 3, nama: "Senapelan", latitude: 0.5377, longitude: 101.4367 },
  { id: 4, nama: "Lima Puluh", latitude: 0.5282, longitude: 101.4564 },
  { id: 5, nama: "Sail", latitude: 0.5125, longitude: 101.4542 },
  { id: 6, nama: "Bukit Raya", latitude: 0.4697, longitude: 101.4554 },
  { id: 7, nama: "Marpoyan Damai", latitude: 0.4721, longitude: 101.4286 },
  { id: 8, nama: "Tenayan Raya", latitude: 0.4912, longitude: 101.5124 },
  { id: 9, nama: "Kulim", latitude: 0.4578, longitude: 101.5312 },
  { id: 10, nama: "Payung Sekaki", latitude: 0.5354, longitude: 101.4038 },
  { id: 11, nama: "Bina Widya", latitude: 0.4792, longitude: 101.3789 },
  { id: 12, nama: "Tuah Madani", latitude: 0.4621, longitude: 101.3541 },
  { id: 13, nama: "Rumbai", latitude: 0.5732, longitude: 101.4212 },
  { id: 14, nama: "Rumbai Barat", latitude: 0.6124, longitude: 101.3654 },
  { id: 15, nama: "Rumbai Timur", latitude: 0.5841, longitude: 101.4682 },
];

/* ============================================================
   KONFIGURASI MAP
   ============================================================ */

const MAP_CENTER = { lat: 0.5212, lng: 101.4473 };

/* ============================================================
   ICON & WARNA CUACA
   ============================================================ */

const WEATHER_ICON: Record<string, string> = {
  Cerah: "☀️",
  Berawan: "☁️",
  "Hujan Ringan": "🌦️",
  "Hujan Lebat": "🌧️",
};

const WEATHER_COLOR: Record<string, string> = {
  Cerah: "#f59e0b",
  Berawan: "#64748b",
  "Hujan Ringan": "#3b82f6",
  "Hujan Lebat": "#2563eb",
};

/* ============================================================
   HITUNG QV2M
   ============================================================ */

function estimateQv2m(
  tempC: number,
  rhPercent: number,
  pressureHpa: number,
): number {
  if (
    !Number.isFinite(tempC) ||
    !Number.isFinite(rhPercent) ||
    !Number.isFinite(pressureHpa) ||
    pressureHpa <= 0
  )
    return 0;

  const es = 6.112 * Math.exp((17.67 * tempC) / (tempC + 243.5));
  const e = (rhPercent / 100) * es;
  const qv = (622 * e) / (pressureHpa - e);
  return Number(qv.toFixed(2));
}

/* ============================================================
   KONVERSI WIND 10M → 2M
   ============================================================ */

function convertWind10mTo2m(windMs: number): number {
  if (!Number.isFinite(windMs) || windMs < 0) return 0;
  return windMs * Math.pow(2 / 10, 0.143);
}

/* ============================================================
   MEMBENTUK INPUT MODEL
   ============================================================ */

function buildModelInput(weather: WeatherData) {
  const t2m = Number(
    weather.daily.temperature_2m_mean?.[0] ?? weather.current.temperature_2m,
  );
  const t2mMin = Number(weather.daily.temperature_2m_min?.[0] ?? 0);
  const t2mMax = Number(weather.daily.temperature_2m_max?.[0] ?? 0);
  const rh2m = Number(
    weather.daily.relative_humidity_2m_mean?.[0] ??
      weather.current.relativehumidity_2m,
  );

  const ws2m = convertWind10mTo2m(Number(weather.current.windspeed_10m));
  const allsky = Number(weather.daily.shortwave_radiation_sum?.[0] ?? 0);

  const cloudFraction = Math.min(
    Math.max(Number(weather.current.cloud_cover ?? 0) / 100, 0),
    0.95,
  );
  const clearSkyRatio = Math.max(1 - cloudFraction, 0.05);
  const clrsky = allsky / clearSkyRatio;
  const qv2m = estimateQv2m(
    t2m,
    rh2m,
    Number(weather.current.surface_pressure),
  );

  return {
    T2M_MAX: Number(t2mMax.toFixed(2)),
    T2M_MIN: Number(t2mMin.toFixed(2)),
    T2M: Number(t2m.toFixed(2)),
    RH2M: Number(rh2m.toFixed(2)),
    WS2M: Number(ws2m.toFixed(2)),
    ALLSKY_SFC_SW_DWN: Number(allsky.toFixed(2)),
    CLRSKY_SFC_SW_DWN: Number(clrsky.toFixed(2)),
    QV2M: Number(qv2m.toFixed(2)),
  };
}

/* ============================================================
   COMPONENT UTAMA
   ============================================================ */

export default function WeatherMap() {
  const [locations, setLocations] = useState<KecamatanWeather[]>(
    KECAMATAN.map((kec) => ({ ...kec, loading: true })),
  );
  const [selected, setSelected] = useState<KecamatanWeather | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const openMeteoUrl = useMemo(() => {
    const latitudes = KECAMATAN.map((kec) => kec.latitude).join(",");
    const longitudes = KECAMATAN.map((kec) => kec.longitude).join(",");
    return (
      "https://api.open-meteo.com/v1/forecast" +
      `?latitude=${latitudes}` +
      `&longitude=${longitudes}` +
      "&timezone=Asia%2FJakarta" +
      "&forecast_days=1" +
      "&wind_speed_unit=ms" +
      "&current=temperature_2m,relativehumidity_2m,windspeed_10m,shortwave_radiation,cloud_cover,surface_pressure" +
      "&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,relative_humidity_2m_mean,shortwave_radiation_sum"
    );
  }, []);

  const fetchAllWeather = async () => {
    try {
      const weatherResponse = await fetch(openMeteoUrl, { cache: "no-store" });
      if (!weatherResponse.ok)
        throw new Error(`Open-Meteo error: ${weatherResponse.status}`);
      const weatherData = await weatherResponse.json();
      const weatherList = Array.isArray(weatherData)
        ? weatherData
        : [weatherData];

      const results = await Promise.all(
        KECAMATAN.map(async (kecamatan, index) => {
          const weather = weatherList[index];
          if (!weather)
            return {
              ...kecamatan,
              error: "Data cuaca tidak tersedia",
              loading: false,
            };

          try {
            const modelInput = buildModelInput(weather);
            const mlApi =
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const predictionResponse = await fetch(`${mlApi}/prediksi`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(modelInput),
            });
            if (!predictionResponse.ok)
              throw new Error(`ML API error: ${predictionResponse.status}`);
            const prediction = await predictionResponse.json();

            return {
              ...kecamatan,
              weather,
              prediction: {
                cuaca: prediction.cuaca,
                confidence: Number(prediction.confidence),
                probabilitas: prediction.probabilitas,
              },
              loading: false,
            };
          } catch (error) {
            console.error(`Gagal prediksi ${kecamatan.nama}:`, error);
            return {
              ...kecamatan,
              weather,
              error: "Prediksi gagal",
              loading: false,
            };
          }
        }),
      );

      setLocations(results);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Gagal mengambil data cuaca:", error);
      setLocations(
        KECAMATAN.map((kec) => ({
          ...kec,
          error: "Gagal mengambil data",
          loading: false,
        })),
      );
    }
  };

  useEffect(() => {
    fetchAllWeather();
    const interval = setInterval(fetchAllWeather, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [openMeteoUrl]);

  useEffect(() => {
    if (selected && mapRef.current) {
      mapRef.current.panTo({ lat: selected.latitude, lng: selected.longitude });
      mapRef.current.setZoom(14);
    }
  }, [selected]);

  if (!isLoaded) {
    return (
      <div className="max-w-6xl mx-auto px-4">
        <div className="w-full h-[80vh] md:h-150 rounded-xl bg-gray-100 animate-pulse flex items-center justify-center">
          <p className="text-gray-500">Memuat peta Pekanbaru...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="petacuaca" className="max-w-6xl mx-auto px-4 mt-10">
      <div className="mb-5">
        <h2 className="text-center text-2xl font-semibold">
          Peta Cuaca Kecamatan Pekanbaru
        </h2>
        <p className="text-center text-gray-400 text-sm mt-2">
          Kondisi cuaca terkini di setiap kecamatan
        </p>
      </div>
      <div className="bg-gray-100 p-4 rounded-xl">
        <div className="flex flex-col md:flex-row h-[80vh] md:h-150 bg-white rounded-xl shadow-sm overflow-hidden">
          {/* PETA */}
          <div className="h-[50vh] md:h-full w-full md:flex-1 relative bg-white">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={MAP_CENTER}
              zoom={12}
              onLoad={(map) => {
                mapRef.current = map;
              }}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true,
                gestureHandling: "greedy",
              }}
            >
              {locations.map((location) => {
                const prediction = location.prediction;
                const cuaca = prediction?.cuaca || "Berawan";
                const icon = WEATHER_ICON[cuaca] || "🌤️";
                const color = WEATHER_COLOR[cuaca] || "#3b82f6";

                return (
                  <MarkerF
                    key={location.id}
                    position={{
                      lat: location.latitude,
                      lng: location.longitude,
                    }}
                    onClick={() => setSelected(location)}
                    icon={{
                      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52">
                          <circle cx="26" cy="26" r="23" fill="white" stroke="${color}" stroke-width="3" />
                          <text x="26" y="34" text-anchor="middle" font-size="25">${icon}</text>
                        </svg>
                      `)}`,
                      scaledSize: new google.maps.Size(52, 52),
                      anchor: new google.maps.Point(26, 26),
                    }}
                  />
                );
              })}

              {selected && (
                <InfoWindowF
                  position={{ lat: selected.latitude, lng: selected.longitude }}
                  onCloseClick={() => setSelected(null)}
                >
                  <div className="p-2 max-w-55 text-sm">
                    <h3 className="font-bold text-base mb-2 text-gray-900">
                      {selected.nama}
                    </h3>
                    {selected.prediction ? (
                      <>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">
                            {WEATHER_ICON[selected.prediction.cuaca]}
                          </span>
                          <div>
                            <p className="font-semibold">
                              {selected.prediction.cuaca}
                            </p>
                            <p className="text-xs text-gray-500">
                              Confidence: {selected.prediction.confidence}%
                            </p>
                          </div>
                        </div>
                        {selected.weather && (
                          <div className="text-xs text-gray-600 space-y-1">
                            <p>
                              Suhu: {selected.weather.current.temperature_2m} °C
                            </p>
                            <p>
                              Kelembapan:{" "}
                              {selected.weather.current.relativehumidity_2m}%
                            </p>
                            <p>
                              Angin: {selected.weather.current.windspeed_10m}{" "}
                              m/s
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">
                        {selected.error || "Menunggu data..."}
                      </p>
                    )}
                  </div>
                </InfoWindowF>
              )}
            </GoogleMap>
          </div>

          {/* SIDEBAR KANAN - bg-gray-50 */}
          <div className="w-full md:w-85 lg:w-95 flex-1 md:flex-none flex flex-col bg-white overflow-hidden">
            {/* LEGENDA */}
            <div className="p-4 pb-2 shrink-0">
              <div className="flex items-center gap-2 mb-2 text-blue-600 font-semibold text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
                Legenda
              </div>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-700">
                {Object.entries(WEATHER_ICON).map(([label, icon]) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-lg w-6 text-center">{icon}</span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* JUDUL RINGKASAN KECAMATAN */}
            <div className="px-4 pt-3 pb-1 border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center ">
                Ringkasan Kecamatan
              </h3>
            </div>

            {/* DAFTAR KECAMATAN */}
            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
              {locations.map((location) => {
                const isSelected = selected?.id === location.id;
                const cuaca = location.prediction?.cuaca || "Berawan";
                const icon = WEATHER_ICON[cuaca] || "🌤️";
                const color = WEATHER_COLOR[cuaca] || "#3b82f6";

                return (
                  <div
                    key={location.id}
                    onClick={() => setSelected(location)}
                    className={`flex justify-between items-center px-4 py-3 cursor-pointer transition-colors border-gray-200 ${
                      isSelected
                        ? "bg-blue-50 border-l-4 border-l-blue-500"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {location.loading ? (
                        <span className="inline-block w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                      ) : location.error ? (
                        <span className="text-red-500 text-xs">⚠️</span>
                      ) : null}
                      <span className="text-sm font-medium text-gray-800 truncate">
                        {location.nama}
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-1.5 text-xs font-medium ml-2 shrink-0"
                      style={{ color }}
                    >
                      <span className="text-base">{icon}</span>
                      <span>{cuaca}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FOOTER */}
            <div className="p-3 shrink-0 text-[10px] text-gray-400 border-gray-200 bg-white">
              {lastUpdate ? (
                <p>
                  Terakhir diperbarui:{" "}
                  {lastUpdate.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              ) : (
                <p>Memperbarui data...</p>
              )}
              <p className="mt-0.5">Sumber: Open-Meteo & Model Random Forest</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
