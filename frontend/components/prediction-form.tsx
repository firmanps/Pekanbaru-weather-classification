"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/lib/axios";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";

import {
  CloudRain,
  Droplets,
  RotateCcw,
  Send,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react";

type PredictionPayload = {
  TN: number;
  TX: number;
  TAVG: number;
  RH_AVG: number;
  RR: number;
  SS: number;
  FF_AVG: number;
};

type FormState = {
  TN: string;
  TX: string;
  TAVG: string;
  RH_AVG: string;
  RR: string;
  SS: string;
  FF_AVG: string;
};

type PredictionResult = {
  cuaca: string;
  icon: string;
  confidence?: number;
};

const initialState: FormState = {
  TN: "",
  TX: "",
  TAVG: "",
  RH_AVG: "",
  RR: "",
  SS: "",
  FF_AVG: "",
};

export default function PredictionForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
    TN: false,
    TX: false,
    TAVG: false,
    RH_AVG: false,
    RR: false,
    SS: false,
    FF_AVG: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const errors = useMemo(() => {
    const next: Partial<Record<keyof FormState, string>> = {};

    (Object.keys(values) as (keyof FormState)[]).forEach((key) => {
      const raw = values[key].trim();

      if (raw.length === 0) {
        next[key] = "Wajib diisi";
        return;
      }

      const n = Number(raw);

      if (!Number.isFinite(n)) {
        next[key] = "Harus berupa angka";
      }
    });

    return next;
  }, [values]);

  const isValid = Object.keys(errors).length === 0;

  function setField<K extends keyof FormState>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function onClear() {
    setValues(initialState);

    setTouched({
      TN: false,
      TX: false,
      TAVG: false,
      RH_AVG: false,
      RR: false,
      SS: false,
      FF_AVG: false,
    });

    setApiError(null);
    setResult(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    setTouched({
      TN: true,
      TX: true,
      TAVG: true,
      RH_AVG: true,
      RR: true,
      SS: true,
      FF_AVG: true,
    });

    setApiError(null);
    setResult(null);

    if (!isValid) return;

    const payload: PredictionPayload = {
      TN: Number(values.TN),
      TX: Number(values.TX),
      TAVG: Number(values.TAVG),
      RH_AVG: Number(values.RH_AVG),
      RR: Number(values.RR),
      SS: Number(values.SS),
      FF_AVG: Number(values.FF_AVG),
    };

    setIsSubmitting(true);

    try {
      const res = await axiosInstance.post("/prediksi", payload);
      const data = res.data;

      setResult({
        cuaca: data.cuaca,
        icon: data.icon,
        confidence: data.confidence,
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Terjadi kesalahan saat memanggil API.";

      setApiError(String(msg));
    } finally {
      setIsSubmitting(false);
    }
  }

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

  return (
    <section className="max-w-4xl mx-auto py-16 px-4">
      <h2 className="text-center text-2xl font-semibold">
        Machine Learning Weather Prediction
      </h2>

      <p className="text-center text-gray-500 mb-8">
        Enter meteorological parameters to predict weather conditions
      </p>

      <Card className="p-8 space-y-6">
        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TN */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Thermometer size={16} />
                TN Min Temperature (°C)
              </Label>
              <Input
                type="number"
                step="any"
                placeholder="24"
                value={values.TN}
                onChange={(e) => setField("TN", e.target.value)}
              />
            </div>

            {/* TX */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Thermometer size={16} />
                TX Max Temperature (°C)
              </Label>
              <Input
                type="number"
                step="any"
                placeholder="31.9"
                value={values.TX}
                onChange={(e) => setField("TX", e.target.value)}
              />
            </div>

            {/* TAVG */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Thermometer size={16} />
                TAVG Avg Temperature (°C)
              </Label>
              <Input
                type="number"
                step="any"
                placeholder="27.6"
                value={values.TAVG}
                onChange={(e) => setField("TAVG", e.target.value)}
              />
            </div>

            {/* RH */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Droplets size={16} />
                RH_AVG Avg Humidity (%)
              </Label>
              <Input
                type="number"
                step="any"
                placeholder="76"
                value={values.RH_AVG}
                onChange={(e) => setField("RH_AVG", e.target.value)}
              />
            </div>

            {/* RR */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CloudRain size={16} />
                RR Rainfall (mm)
              </Label>
              <Input
                type="number"
                step="any"
                placeholder="1.3"
                value={values.RR}
                onChange={(e) => setField("RR", e.target.value)}
              />
            </div>

            {/* SS */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Sun size={16} />
                SS Sunshine Duration (hrs)
              </Label>
              <Input
                type="number"
                step="any"
                placeholder="6.7"
                value={values.SS}
                onChange={(e) => setField("SS", e.target.value)}
              />
            </div>

            {/* WIND */}
            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-2">
                <Wind size={16} />
                FF_AVG Avg Wind Speed (m/s)
              </Label>
              <Input
                type="number"
                step="any"
                placeholder="3"
                value={values.FF_AVG}
                onChange={(e) => setField("FF_AVG", e.target.value)}
              />
            </div>
          </div>

          {apiError && <div className="text-red-600 text-sm">{apiError}</div>}

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 w-full sm:flex-1 bg-blue-600 hover:bg-blue-500 transition duration-300 hover:scale-[1.02]"
            >
              <Send size={18} />
              {isSubmitting ? "Predicting..." : "Predict Weather"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onClear}
              className="flex items-center justify-center gap-2 w-full sm:w-[140px] transition duration-300 hover:bg-gray-100 hover:scale-[1.02]"
            >
              <RotateCcw size={18} />
              Clear
            </Button>
          </div>
        </form>
      </Card>

      {/* RESULT */}

      {result && (
        <Card className="mt-8 p-10 text-center bg-[#e8dfd2] border-none animate-in fade-in slide-in-from-bottom-6 duration-700 hover:scale-[1.02] transition-transform">
          <p className="text-sm tracking-widest text-gray-500">
            PREDICTION RESULT
          </p>

          <div className="flex justify-center my-6">
            <div className="bg-white rounded-full p-7 shadow-lg hover:scale-110 transition">
              <img
                src={getWeatherGif(result.cuaca)}
                alt={result.cuaca}
                className="
                w-24 h-24
                object-contain
                transition
                duration-300
                hover:scale-110"
              />
            </div>
          </div>

          <p className="text-gray-500">Weather</p>

          <h2 className="text-4xl font-bold">{result.cuaca}</h2>

          {result.confidence && (
            <>
              <p className="text-gray-500 mt-4">Confidence</p>
              <p className="text-blue-600 text-2xl font-semibold">
                {Math.round(result.confidence * 100)}%
              </p>
            </>
          )}
        </Card>
      )}
    </section>
  );
}
