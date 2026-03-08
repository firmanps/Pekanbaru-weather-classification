import { CloudRain, Droplets, Sun, Thermometer, Wind } from "lucide-react"

export default function CurrentWeather() {
  return (
    <section className="max-w-6xl mx-auto py-10 px-4">

      <h2 className="text-center text-2xl font-semibold">
        Current Weather – Pekanbaru
      </h2>

      <p className="text-center text-gray-500 mb-8">
        Live weather overview
      </p>

      {/* MAIN CARD */}
      <div className="border rounded-xl p-6 bg-gray-50">

        <div className="grid lg:grid-cols-3 gap-6 items-center">

          {/* SUNNY SECTION */}
          <div className="flex flex-col items-center justify-center text-center gap-3">

            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center transition transform hover:scale-110">
              <Sun className="text-yellow-500" size={40} />
            </div>

            <p className="font-semibold text-lg">Sunny</p>

          </div>


          {/* WEATHER STATS */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-6">

            {/* Temperature */}
            <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center gap-2 
              transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-white">
              <Thermometer className="text-red-500" size={26} />
              <p className="text-2xl font-bold">30°C</p>
              <p className="text-gray-500 text-sm">Temperature</p>
            </div>

            {/* Humidity */}
            <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center gap-2 
              transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-white">
              <Droplets className="text-blue-500" size={26} />
              <p className="text-2xl font-bold">75%</p>
              <p className="text-gray-500 text-sm">Humidity</p>
            </div>

            {/* Wind */}
            <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center gap-2 
              transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-white">
              <Wind className="text-gray-500" size={26} />
              <p className="text-2xl font-bold">3 m/s</p>
              <p className="text-gray-500 text-sm">Wind Speed</p>
            </div>

            {/* Rainfall */}
            <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center gap-2 
              transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-white">
              <CloudRain className="text-blue-400" size={26} />
              <p className="text-2xl font-bold">0 mm</p>
              <p className="text-gray-500 text-sm">Rainfall</p>
            </div>

          </div>

        </div>

      </div>

    </section>
  )
}