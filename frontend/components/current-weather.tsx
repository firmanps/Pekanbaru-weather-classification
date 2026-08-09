"use client";

import { useWeather } from "@/lib/weather-context";
import {
  Cloud,
  Droplets,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react";

/* ============================================================
   TIPE PARAMETER MODEL
   ============================================================ */

type MlWeatherParams = {
  T2M_MAX: number;
  T2M_MIN: number;
  T2M: number;
  RH2M: number;
  WS2M: number;
  ALLSKY_SFC_SW_DWN: number;
  CLRSKY_SFC_SW_DWN: number;
  QV2M: number;
};


/* ============================================================
   TIPE RESPONSE OPEN-METEO
   ============================================================ */

type OpenMeteoWeather = {
  current?: {
    temperature_2m?: number;
    relativehumidity_2m?: number;
    windspeed_10m?: number;
    precipitation?: number;
    shortwave_radiation?: number;
    direct_radiation?: number;
    cloud_cover?: number;
    surface_pressure?: number;
  };

  daily?: {
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    temperature_2m_mean?: number[];
    relative_humidity_2m_mean?: number[];
    shortwave_radiation_sum?: number[];
  };

  timezone?: string;
};


/* ============================================================
   VALIDASI DATA OPEN-METEO
   ============================================================ */

function isValidOpenMeteoWeather(
  weather: any
): weather is OpenMeteoWeather {

  return (
    weather &&
    typeof weather === "object" &&
    weather.current &&
    typeof weather.current === "object" &&
    weather.daily &&
    typeof weather.daily === "object"
  );
}


/* ============================================================
   ESTIMASI QV2M
   ============================================================ */

function estimateQv2m(
  tempC: number,
  rhPercent: number,
  pressureHpa: number
): number {

  if (
    !Number.isFinite(tempC) ||
    !Number.isFinite(rhPercent) ||
    !Number.isFinite(pressureHpa) ||
    pressureHpa <= 0
  ) {
    return 0;
  }

  const es =
    6.112 *
    Math.exp(
      (17.67 * tempC) /
      (tempC + 243.5)
    );

  const e =
    (rhPercent / 100) * es;

  const qv =
    (622 * e) /
    (pressureHpa - e);

  return Number.isFinite(qv) ? qv : 0;
}


/* ============================================================
   KONVERSI WIND SPEED
   Open-Meteo:
   windspeed_10m = km/h

   Model:
   WS2M = m/s

   Konversi:
   km/h → m/s
   kemudian pendekatan 10 m → 2 m
   ============================================================ */

function convertWind10mTo2m(
  windKmh: number
): number {

  if (
    !Number.isFinite(windKmh) ||
    windKmh < 0
  ) {
    return 0;
  }

  const windMs =
    windKmh / 3.6;

  const wind2m =
    windMs *
    Math.pow(2 / 10, 0.143);

  return wind2m;
}


/* ============================================================
   MEMBENTUK 8 PARAMETER MODEL
   ============================================================ */

function buildMlParams(
  weather: OpenMeteoWeather
): MlWeatherParams {

  const current =
    weather?.current ?? {};

  const daily =
    weather?.daily ?? {};


  /* ==========================================================
     T2M
     ========================================================== */

  const t2m =
    Number(
      daily.temperature_2m_mean?.[0] ??
      current.temperature_2m ??
      0
    );


  /* ==========================================================
     T2M MIN
     ========================================================== */

  const t2mMin =
    Number(
      daily.temperature_2m_min?.[0] ??
      0
    );


  /* ==========================================================
     T2M MAX
     ========================================================== */

  const t2mMax =
    Number(
      daily.temperature_2m_max?.[0] ??
      0
    );


  /* ==========================================================
     RH2M
     ========================================================== */

  const rh2m =
    Number(
      daily.relative_humidity_2m_mean?.[0] ??
      current.relativehumidity_2m ??
      0
    );


  /* ==========================================================
     WS2M
     ========================================================== */

  const ws2m =
    convertWind10mTo2m(
      Number(
        current.windspeed_10m ?? 0
      )
    );


  /* ==========================================================
     ALLSKY SFC SW DWN

     Open-Meteo:
     shortwave_radiation_sum
     MJ/m²/day
     ========================================================== */

  const allskySw =
    Number(
      daily.shortwave_radiation_sum?.[0] ??
      0
    );


  /* ==========================================================
     CLOUD COVER

     Open-Meteo memberikan cloud_cover
     dalam persen.

     Digunakan untuk mengestimasi
     clear-sky radiation.
     ========================================================== */

  const cloudCoverPercent =
    Number(
      current.cloud_cover ?? 0
    );

  const cloudFraction =
    Math.min(
      Math.max(
        cloudCoverPercent / 100,
        0
      ),
      0.95
    );


  /* ==========================================================
     CLEAR SKY RADIATION

     Karena endpoint forecast Open-Meteo yang digunakan
     belum memberikan clear-sky radiation secara langsung,
     nilainya diturunkan dari ALLSKY dan cloud cover.
     ========================================================== */

  const clearSkyRatio =
    Math.max(
      1 - cloudFraction,
      0.05
    );


  const clrskySw =
    allskySw / clearSkyRatio;


  /* ==========================================================
     QV2M
     ========================================================== */

  const pressure =
    Number(
      current.surface_pressure ?? 1013.25
    );


  const qv2m =
    estimateQv2m(
      t2m,
      rh2m,
      pressure
    );


  /* ==========================================================
     RETURN 8 FITUR
     ========================================================== */

  return {

    T2M_MAX:
      Number(t2mMax.toFixed(2)),

    T2M_MIN:
      Number(t2mMin.toFixed(2)),

    T2M:
      Number(t2m.toFixed(2)),

    RH2M:
      Number(rh2m.toFixed(2)),

    WS2M:
      Number(ws2m.toFixed(2)),

    ALLSKY_SFC_SW_DWN:
      Number(allskySw.toFixed(2)),

    CLRSKY_SFC_SW_DWN:
      Number(clrskySw.toFixed(2)),

    QV2M:
      Number(qv2m.toFixed(2)),
  };
}


/* ============================================================
   METADATA PARAMETER
   ============================================================ */

const paramMeta: {
  key: keyof MlWeatherParams;
  label: string;
  unit: string;
  icon: React.ReactNode;
  estimated?: boolean;
}[] = [

  {
    key: "T2M_MIN",
    label: "T2M_MIN",
    unit: "°C",
    icon: (
      <Thermometer
        className="text-blue-500"
        size={22}
      />
    ),
  },

  {
    key: "T2M_MAX",
    label: "T2M_MAX",
    unit: "°C",
    icon: (
      <Thermometer
        className="text-red-500"
        size={22}
      />
    ),
  },

  {
    key: "T2M",
    label: "T2M",
    unit: "°C",
    icon: (
      <Thermometer
        className="text-orange-500"
        size={22}
      />
    ),
  },

  {
    key: "RH2M",
    label: "RH2M",
    unit: "%",
    icon: (
      <Droplets
        className="text-blue-500"
        size={22}
      />
    ),
  },

  {
    key: "WS2M",
    label: "WS2M",
    unit: "m/s",
    icon: (
      <Wind
        className="text-gray-500"
        size={22}
      />
    ),
    estimated: true,
  },

  {
    key: "ALLSKY_SFC_SW_DWN",
    label: "ALLSKY_SFC_SW_DWN",
    unit: "MJ/m²/day",
    icon: (
      <Sun
        className="text-yellow-500"
        size={22}
      />
    ),
  },

  {
    key: "CLRSKY_SFC_SW_DWN",
    label: "CLRSKY_SFC_SW_DWN",
    unit: "MJ/m²/day",
    icon: (
      <Sun
        className="text-amber-500"
        size={22}
      />
    ),
    estimated: true,
  },

  {
    key: "QV2M",
    label: "QV2M",
    unit: "g/kg",
    icon: (
      <Cloud
        className="text-sky-500"
        size={22}
      />
    ),
    estimated: true,
  },
];


/* ============================================================
   COMPONENT
   ============================================================ */

export default function CurrentWeather() {

  const weather =
    useWeather();


  /* ==========================================================
     LOADING / DATA BELUM VALID
     ========================================================== */

  if (
    !weather ||
    !isValidOpenMeteoWeather(weather)
  ) {

    return (

      <section className="max-w-6xl mx-auto py-10 px-4 animate-pulse">

        <div className="h-6 w-72 bg-gray-200 mx-auto rounded mb-3" />

        <div className="h-4 w-48 bg-gray-200 mx-auto rounded mb-10" />

        <div className="border rounded-xl p-6 bg-gray-50">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            {Array.from({
              length: 8
            }).map((_, i) => (

              <div
                key={i}
                className="bg-gray-100 rounded-xl p-5 flex flex-col items-center gap-3"
              >

                <div className="w-6 h-6 bg-gray-300 rounded" />

                <div className="h-6 w-16 bg-gray-300 rounded" />

                <div className="h-3 w-20 bg-gray-200 rounded" />

              </div>

            ))}

          </div>

        </div>

      </section>

    );
  }


  /* ==========================================================
     BUILD PARAMETER
     ========================================================== */

  const params =
    buildMlParams(weather);


  /* ==========================================================
     LAST UPDATE
     ========================================================== */

  let lastUpdate = "";


  if (
    typeof window !== "undefined"
  ) {

    const cached =
      localStorage.getItem(
        "weatherData"
      );


    if (cached) {

      try {

        const parsed =
          JSON.parse(cached);


        const timestamp =
          parsed?.timestamp;


        if (timestamp) {

          lastUpdate =
            new Date(
              timestamp
            ).toLocaleString(
              "id-ID",
              {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            );

        }

      } catch {

        lastUpdate = "";

      }

    }

  }


  /* ==========================================================
     RENDER
     ========================================================== */

  return (

    <section className="max-w-6xl mx-auto py-10 px-4">

      <h2 className="text-center text-2xl font-semibold">
        Data Cuaca Terkini — Pekanbaru
      </h2>


      {lastUpdate && (

        <p className="text-center text-gray-400 text-sm mt-2">
          Pembaruan terakhir: {lastUpdate}
        </p>

      )}


      <p className="text-center text-gray-500 mb-2 mt-1">
        Sumber: Open-Meteo
      </p>


      <p className="text-center text-gray-400 text-sm mb-8">
        Parameter di bawah dapat digunakan sebagai
        referensi input klasifikasi cuaca.
      </p>


      <div className="border rounded-xl p-6 bg-gray-50">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {paramMeta.map(
            ({
              key,
              label,
              unit,
              icon,
              estimated,
            }) => (

              <div
                key={key}
                className="bg-white rounded-xl p-5 flex flex-col items-center gap-2 hover:shadow-md hover:-translate-y-0.5 transition"
              >

                {icon}


                <p className="text-2xl font-bold">
                  {params[key]}
                </p>


                <p className="text-gray-500 text-xs text-center font-medium">
                  {label}
                </p>


                <p className="text-gray-400 text-xs">
                  {unit}
                </p>

{/* 
                {estimated && (

                  <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    estimasi
                  </span>

                )} */}

              </div>

            )
          )}

        </div>

      </div>

    </section>

  );
}