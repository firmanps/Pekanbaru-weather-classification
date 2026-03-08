import { CloudRain, Sun } from "lucide-react"

export default function Forecast() {
  return (
    <section className="max-w-6xl mx-auto py-12 px-4">

      <h2 className="text-center text-2xl font-semibold">
        Weather Forecast
      </h2>

      <p className="text-center text-gray-500 mb-8">
        Upcoming weather conditions
      </p>

      {/* Forecast Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {/* Today */}
        <div className="group border rounded-xl p-6 flex items-center gap-4 bg-gray-50 
        transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-white">

          <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center
          transition-transform duration-300 group-hover:scale-110">
            <Sun className="text-yellow-500"/>
          </div>

          <div>
            <p className="text-sm text-gray-500">Today</p>
            <p className="font-semibold text-lg">24°C – 34°C</p>
            <p className="text-gray-500 text-sm">Sunny</p>
          </div>

        </div>


        {/* Tomorrow */}
        <div className="group border rounded-xl p-6 flex items-center gap-4 bg-gray-50
        transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-white">

          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center
          transition-transform duration-300 group-hover:scale-110">
            <CloudRain className="text-blue-500"/>
          </div>

          <div>
            <p className="text-sm text-gray-500">Tomorrow</p>
            <p className="font-semibold text-lg">23°C – 31°C</p>
            <p className="text-gray-500 text-sm">Rainy</p>
          </div>

        </div>

      </div>

    </section>
  )
}