import { Button } from "@/components/ui/button"
import { ArrowRight, ChartColumn, CloudSun } from "lucide-react"

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 py-16 items-center mt-10 px-4">

      {/* LEFT CONTENT */}
      <div>

        <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm">
          Weather Classification System
        </span>

        <h1 className="text-4xl md:text-5xl font-bold mt-4 leading-tight">
          Weather Prediction <br />
          System for <span className="text-blue-600">Pekanbaru</span>
        </h1>

        <p className="text-gray-500 mt-4 max-w-xl">
          This application predicts daily weather conditions using a machine learning model based on meteorological parameters such as temperature, humidity, rainfall, sunshine duration, and wind speed.
        </p>

        <div className="flex flex-wrap gap-4 mt-6">
          <Button className="bg-blue-600 hover:bg-blue-500">
            Predict Weather
            <span><ArrowRight/></span>
          </Button>

          <Button variant="outline">
            <span><ChartColumn/></span>
            View Forecast
          </Button>
        </div>

      </div>


      {/* RIGHT WEATHER ICON */}
        <div className="flex justify-center">

        {/* wrapper */}
        <div className="relative w-64 h-64 md:w-80 md:h-80">

          {/* main circle */}
          <div className="w-full h-full bg-linear-to-br from-[#D2E3F2] to-[#F0E8D8] rounded-full flex items-center justify-center">

            <CloudSun size={90} className="text-blue-500 md:size-[110px]" />

          </div>

          {/* temperature bubble */}
          <div className="absolute top-3 right-0 bg-yellow-100 text-yellow-500 font-semibold px-4 py-2 rounded-full shadow text-sm md:text-base">
            30°
          </div>

          {/* humidity bubble */}
          <div className="absolute bottom-4 -left-2 bg-blue-100 text-blue-600 text-sm px-4 py-2 rounded-full shadow">
            75% RH
          </div>

        </div>

        </div>

    </section>
  )
}