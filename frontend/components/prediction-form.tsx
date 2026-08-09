"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/lib/axios";
import type { ChangeEvent, FormEvent } from "react";
import { useMemo, useState } from "react";

import {
  Cloud,
  Droplets,
  RotateCcw,
  Send,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react";

type PredictionPayload = {
  T2M_MAX: number;
  T2M_MIN: number;
  T2M: number;
  RH2M: number;
  WS2M: number;
  ALLSKY_SFC_SW_DWN: number;
  CLRSKY_SFC_SW_DWN: number;
  QV2M: number;
};

type FormState = {
  T2M_MAX: string;
  T2M_MIN: string;
  T2M: string;
  RH2M: string;
  WS2M: string;
  ALLSKY_SFC_SW_DWN: string;
  CLRSKY_SFC_SW_DWN: string;
  QV2M: string;
};

type PredictionResult = {
  cuaca: string;
  icon: string;
  confidence?: number;
  probabilitas?: Record<string, number>;
  cloud_cover?: number;
};

const initialState: FormState = {
  T2M_MAX: "",
  T2M_MIN: "",
  T2M: "",
  RH2M: "",
  WS2M: "",
  ALLSKY_SFC_SW_DWN: "",
  CLRSKY_SFC_SW_DWN: "",
  QV2M: "",
};

const formFields: (keyof FormState)[] = [
  "T2M_MAX",
  "T2M_MIN",
  "T2M",
  "RH2M",
  "WS2M",
  "ALLSKY_SFC_SW_DWN",
  "CLRSKY_SFC_SW_DWN",
  "QV2M",
];

export default function PredictionForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
    T2M_MAX: false,
    T2M_MIN: false,
    T2M: false,
    RH2M: false,
    WS2M: false,
    ALLSKY_SFC_SW_DWN: false,
    CLRSKY_SFC_SW_DWN: false,
    QV2M: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const errors = useMemo(() => {
    const next: Partial<Record<keyof FormState, string>> = {};

    formFields.forEach((key) => {
      const raw = values[key].trim();

      if (raw.length === 0) {
        next[key] = "Wajib diisi";
        return;
      }

      const n = Number(raw);

      if (!Number.isFinite(n)) {
        next[key] = "Harus berupa angka";
        return;
      }

      if (key === "CLRSKY_SFC_SW_DWN" && n === 0) {
        next[key] = "Tidak boleh 0";
      }
    });

    return next;
  }, [values]);

  const isValid = Object.keys(errors).length === 0;

  const showError = (key: keyof FormState) => touched[key] && errors[key];

  function setField<K extends keyof FormState>(key: K, value: string) {
    setValues((prev: FormState) => ({ ...prev, [key]: value }));
  }

  function onFieldChange<K extends keyof FormState>(key: K) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setField(key, e.target.value);
      if (!touched[key]) {
        setTouched((prev: Record<keyof FormState, boolean>) => ({
          ...prev,
          [key]: true,
        }));
      }
    };
  }

  function onClear() {
    setValues(initialState);
    setTouched({
      T2M_MAX: false,
      T2M_MIN: false,
      T2M: false,
      RH2M: false,
      WS2M: false,
      ALLSKY_SFC_SW_DWN: false,
      CLRSKY_SFC_SW_DWN: false,
      QV2M: false,
    });
    setApiError(null);
    setResult(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    setTouched({
      T2M_MAX: true,
      T2M_MIN: true,
      T2M: true,
      RH2M: true,
      WS2M: true,
      ALLSKY_SFC_SW_DWN: true,
      CLRSKY_SFC_SW_DWN: true,
      QV2M: true,
    });

    setApiError(null);
    setResult(null);

    if (!isValid) return;

    const payload: PredictionPayload = {
      T2M_MAX: Number(values.T2M_MAX),
      T2M_MIN: Number(values.T2M_MIN),
      T2M: Number(values.T2M),
      RH2M: Number(values.RH2M),
      WS2M: Number(values.WS2M),
      ALLSKY_SFC_SW_DWN: Number(values.ALLSKY_SFC_SW_DWN),
      CLRSKY_SFC_SW_DWN: Number(values.CLRSKY_SFC_SW_DWN),
      QV2M: Number(values.QV2M),
    };

    setIsSubmitting(true);

    try {
      const res = await axiosInstance.post("/prediksi", payload);
      const data = res.data;

      if (data.status !== "success") {
        setApiError(data.message || data.pesan || "Prediksi gagal.");
        return;
      }

      setResult({
        cuaca: data.cuaca,
        icon: data.icon,
        confidence: data.confidence,
        probabilitas: data.probabilitas,
        cloud_cover: data.cloud_cover,
      });
    } catch (err: unknown) {
      const error = err as {
        response?: {
          data?: {
            message?: string;
            error?: string;
            pesan?: string;
          };
        };
        message?: string;
      };
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.pesan ||
        error?.message ||
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
    <section id="prediction" className="max-w-4xl mx-auto py-16 px-4">
      <h2 className="text-center text-2xl font-semibold">
        Machine Learning Weather Classification
      </h2>

      <p className="text-center text-gray-500 mb-8">
        Masukkan parameter meteorologi NASA POWER untuk klasifikasi cuaca
      </p>

      <Card className="p-8 space-y-6">
        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Thermometer size={16} />
                T2M_MIN — Suhu Minimum (°C)
              </Label>
              <Input
                type="number"
                step="any"
                placeholder="22.98"
                value={values.T2M_MIN}
                onChange={onFieldChange("T2M_MIN")}
              />
              {showError("T2M_MIN") && (
                <p className="text-xs text-red-600">{errors.T2M_MIN}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Thermometer size={16} />
                T2M_MAX — Suhu Maksimum (°C)
              </Label>
              <Input
                type="number"
                step="any"
                placeholder="27.87"
                value={values.T2M_MAX}
                onChange={onFieldChange("T2M_MAX")}
              />
              {showError("T2M_MAX") && (
                <p className="text-xs text-red-600">{errors.T2M_MAX}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Thermometer size={16} />
                T2M — Suhu Rata-rata (°C)
              </Label>
              <Input
                type="number"
                step="any"
                placeholder="24.94"
                value={values.T2M}
                onChange={onFieldChange("T2M")}
              />
              {showError("T2M") && (
                <p className="text-xs text-red-600">{errors.T2M}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Droplets size={16} />
                RH2M — Kelembapan Relatif (%)
              </Label>
              <Input
                type="number"
                step="any"
                placeholder="91.61"
                value={values.RH2M}
                onChange={onFieldChange("RH2M")}
              />
              {showError("RH2M") && (
                <p className="text-xs text-red-600">{errors.RH2M}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Sun size={16} />
                ALLSKY_SFC_SW_DWN — Radiasi Matahari (MJ/m²/day)
              </Label>
              <Input
                type="number"
                step="any"
                placeholder="10.57"
                value={values.ALLSKY_SFC_SW_DWN}
                onChange={onFieldChange("ALLSKY_SFC_SW_DWN")}
              />
              {showError("ALLSKY_SFC_SW_DWN") && (
                <p className="text-xs text-red-600">
                  {errors.ALLSKY_SFC_SW_DWN}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Sun size={16} />
                CLRSKY_SFC_SW_DWN — Radiasi Langit Cerah (MJ/m²/day)
              </Label>
              <Input
                type="number"
                step="any"
                placeholder="23.24"
                value={values.CLRSKY_SFC_SW_DWN}
                onChange={onFieldChange("CLRSKY_SFC_SW_DWN")}
              />
              {showError("CLRSKY_SFC_SW_DWN") && (
                <p className="text-xs text-red-600">
                  {errors.CLRSKY_SFC_SW_DWN}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Wind size={16} />
                WS2M — Kecepatan Angin (m/s)
              </Label>
              <Input
                type="number"
                step="any"
                placeholder="0.16"
                value={values.WS2M}
                onChange={onFieldChange("WS2M")}
              />
              {showError("WS2M") && (
                <p className="text-xs text-red-600">{errors.WS2M}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Cloud size={16} />
                QV2M — Kelembapan Spesifik (g/kg)
              </Label>
              <Input
                type="number"
                step="any"
                placeholder="18"
                value={values.QV2M}
                onChange={onFieldChange("QV2M")}
              />
              {showError("QV2M") && (
                <p className="text-xs text-red-600">{errors.QV2M}</p>
              )}
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
              {isSubmitting ? "Memproses..." : "Klasifikasi Cuaca"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onClear}
              className="flex items-center justify-center gap-2 w-full sm:w-35 transition duration-300 hover:bg-gray-100 hover:scale-[1.02]"
            >
              <RotateCcw size={18} />
              Reset
            </Button>
          </div>
        </form>
      </Card>

      {result && (
        <Card className="mt-8 p-10 text-center bg-[#e8dfd2] border-none animate-in fade-in slide-in-from-bottom-6 duration-700 hover:scale-[1.02] transition-transform">
          <p className="text-sm tracking-widest text-gray-500">
            HASIL KLASIFIKASI
          </p>

          <div className="flex justify-center my-6">
            <div className="bg-white rounded-full p-7 shadow-lg hover:scale-110 transition">
              <img
                src={getWeatherGif(result.cuaca)}
                alt={result.cuaca}
                className="w-24 h-24 object-contain transition duration-300 hover:scale-110"
              />
            </div>
          </div>

          <p className="text-5xl mb-2">{result.icon}</p>
          <p className="text-gray-500">Cuaca</p>
          <h2 className="text-4xl font-bold">{result.cuaca}</h2>

          {result.confidence != null && (
            <>
              <p className="text-gray-500 mt-4">Confidence</p>
              <p className="text-blue-600 text-2xl font-semibold">
                {Math.round(result.confidence)}%
              </p>
            </>
          )}

          {result.cloud_cover != null && (
            <p className="text-sm text-gray-600 mt-2">
              Cloud Cover: {(result.cloud_cover * 100).toFixed(1)}%
            </p>
          )}

          {result.probabilitas && (
            <div className="mt-6 grid grid-cols-2 gap-2 text-sm text-left max-w-sm mx-auto">
              {Object.entries(result.probabilitas).map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between bg-white/60 rounded px-3 py-2"
                >
                  <span>{label}</span>
                  <span className="font-medium">{value}%</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </section>
  );
}
