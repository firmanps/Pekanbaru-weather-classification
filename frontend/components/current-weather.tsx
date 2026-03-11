// "use client";

// import { CloudRain, Droplets, Thermometer, Wind } from "lucide-react";
// import { useWeather } from "@/lib/weather-context";

// export default function CurrentWeather() {
//   const weather = useWeather();

//   // =========================
//   // LOADING
//   // =========================

//   if (!weather) {
//     return (
//       <section className="max-w-6xl mx-auto py-10 px-4 animate-pulse">
//         <div className="h-6 w-64 bg-gray-200 mx-auto rounded mb-3"></div>
//         <div className="h-4 w-40 bg-gray-200 mx-auto rounded mb-10"></div>

//         <div className="border rounded-xl p-6 bg-gray-50">
//           <div className="grid lg:grid-cols-3 gap-6 items-center">
//             <div className="flex flex-col items-center gap-4">
//               <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
//               <div className="h-4 w-20 bg-gray-200 rounded"></div>
//             </div>

//             <div className="lg:col-span-2 grid grid-cols-2 gap-6">
//               {[1, 2, 3, 4].map((i) => (
//                 <div
//                   key={i}
//                   className="bg-gray-100 rounded-xl p-6 flex flex-col items-center gap-3"
//                 >
//                   <div className="w-6 h-6 bg-gray-300 rounded"></div>
//                   <div className="h-6 w-12 bg-gray-300 rounded"></div>
//                   <div className="h-3 w-16 bg-gray-200 rounded"></div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   // =========================
//   // MAP WEATHER
//   // =========================

//   function mapWeather(main: string) {
//     switch (main) {
//       case "Clear":
//         return "Cerah";

//       case "Clouds":
//         return "Berawan";

//       case "Rain":
//       case "Drizzle":
//         return "Hujan Ringan";

//       case "Thunderstorm":
//         return "Hujan Lebat";

//       default:
//         return "Cerah";
//     }
//   }

//   // =========================
//   // GIF ICON
//   // =========================

//   function getWeatherGif(cuaca: string) {
//     switch (cuaca) {
//       case "Cerah":
//         return "/weather/sunny.gif";

//       case "Berawan":
//         return "/weather/cloudy.gif";

//       case "Hujan Ringan":
//         return "/weather/light-rain.gif";

//       case "Hujan Lebat":
//         return "/weather/heavy-rain.gif";

//       default:
//         return "/weather/sunny.gif";
//     }
//   }

//   const temp = weather.main.temp;
//   const humidity = weather.main.humidity;
//   const wind = weather.wind.speed;
//   const rainfall = weather.rain ? weather.rain["1h"] : 0;

//   const cuaca = mapWeather(weather.weather[0].main);
//   const gif = getWeatherGif(cuaca);

//   return (
//     <section className="max-w-6xl mx-auto py-10 px-4">
//       <h2 className="text-center text-2xl font-semibold">
//         Current Weather – Pekanbaru
//       </h2>

//       <p className="text-center text-gray-500 mb-8">
//         Live weather overview
//       </p>

//       <div className="border rounded-xl p-6 bg-gray-50">
//         <div className="grid lg:grid-cols-3 gap-6 items-center">

//           {/* WEATHER ICON */}

//           <div className="flex flex-col items-center justify-center text-center gap-3">
//             <div className="w-24 h-24 bg-linear-to-br from-[#D2E3F2] to-[#F0E8D8] rounded-full flex items-center justify-center transition transform hover:scale-110">
//               <img
//                 src={gif}
//                 alt={cuaca}
//                 className="w-16 h-16 object-contain rounded-full"
//               />
//             </div>

//             <p className="font-semibold text-lg">{cuaca}</p>
//           </div>

//           {/* WEATHER STATS */}

//           <div className="lg:col-span-2 grid grid-cols-2 gap-6">

//             <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center gap-2 hover:shadow-lg hover:-translate-y-1 hover:bg-white transition">
//               <Thermometer className="text-red-500" size={26} />

//               <p className="text-2xl font-bold">{temp}°C</p>

//               <p className="text-gray-500 text-sm">Temperature</p>
//             </div>

//             <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center gap-2 hover:shadow-lg hover:-translate-y-1 hover:bg-white transition">
//               <Droplets className="text-blue-500" size={26} />

//               <p className="text-2xl font-bold">{humidity}%</p>

//               <p className="text-gray-500 text-sm">Humidity</p>
//             </div>

//             <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center gap-2 hover:shadow-lg hover:-translate-y-1 hover:bg-white transition">
//               <Wind className="text-gray-500" size={26} />

//               <p className="text-2xl font-bold">{wind} m/s</p>

//               <p className="text-gray-500 text-sm">Wind Speed</p>
//             </div>

//             <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center gap-2 hover:shadow-lg hover:-translate-y-1 hover:bg-white transition">
//               <CloudRain className="text-blue-400" size={26} />

//               <p className="text-2xl font-bold">{rainfall} mm</p>

//               <p className="text-gray-500 text-sm">Rainfall</p>
//             </div>

//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { useWeather } from "@/lib/weather-context";
import { CloudRain, Droplets, Thermometer, Wind } from "lucide-react";

export default function CurrentWeather() {
  const weather = useWeather();

  // =========================
  // LOADING
  // =========================
  if (!weather) {
    return (
      <section className="max-w-6xl mx-auto py-10 px-4 animate-pulse">
        <div className="h-6 w-64 bg-gray-200 mx-auto rounded mb-3"></div>
        <div className="h-4 w-40 bg-gray-200 mx-auto rounded mb-10"></div>
        <div className="border rounded-xl p-6 bg-gray-50">
          <div className="grid lg:grid-cols-3 gap-6 items-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>
            <div className="lg:col-span-2 grid grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-xl p-6 flex flex-col items-center gap-3"
                >
                  <div className="w-6 h-6 bg-gray-300 rounded"></div>
                  <div className="h-6 w-12 bg-gray-300 rounded"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // =========================
  // MAP WEATHER
  // =========================
  function mapWeather(main: string) {
    switch (main) {
      case "Clear":
        return "Cerah";
      case "Clouds":
        return "Berawan";
      case "Rain":
      case "Drizzle":
        return "Hujan Ringan";
      case "Thunderstorm":
        return "Hujan Lebat";
      default:
        return "Cerah";
    }
  }

  // =========================
  // GIF ICON
  // =========================
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

  const temp = weather.main.temp;
  const humidity = weather.main.humidity;
  const wind = weather.wind.speed;
  const rainfall = weather.rain ? weather.rain["1h"] : 0;
  const cuaca = mapWeather(weather.weather[0].main);
  const gif = getWeatherGif(cuaca);

  // =========================
  // LAST UPDATE
  // =========================
  const cached = localStorage.getItem("weatherData");
  let lastUpdate = "";
  if (cached) {
    const { timestamp } = JSON.parse(cached);
    const date = new Date(timestamp);
    lastUpdate = date.toLocaleString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <section className="max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-center text-2xl font-semibold">
        Current Weather – Pekanbaru
      </h2>
      {lastUpdate && (
        <p className="text-center text-gray-400 text-sm mb-2">
          Last update: {lastUpdate}
        </p>
      )}

      <p className="text-center text-gray-500 mb-8">Live weather overview</p>

      <div className="border rounded-xl p-6 bg-gray-50">
        <div className="grid lg:grid-cols-3 gap-6 items-center">
          {/* WEATHER ICON */}
          <div className="flex flex-col items-center justify-center text-center gap-3">
            <div className="w-24 h-24 bg-linear-to-br from-[#D2E3F2] to-[#F0E8D8] rounded-full flex items-center justify-center transition transform hover:scale-110">
              <img
                src={gif}
                alt={cuaca}
                className="w-16 h-16 object-contain rounded-full"
              />
            </div>
            <p className="font-semibold text-lg">{cuaca}</p>
          </div>

          {/* WEATHER STATS */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-6">
            <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center gap-2 hover:shadow-lg hover:-translate-y-1 hover:bg-white transition">
              <Thermometer className="text-red-500" size={26} />
              <p className="text-2xl font-bold">{temp}°C</p>
              <p className="text-gray-500 text-sm">Temperature</p>
            </div>

            <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center gap-2 hover:shadow-lg hover:-translate-y-1 hover:bg-white transition">
              <Droplets className="text-blue-500" size={26} />
              <p className="text-2xl font-bold">{humidity}%</p>
              <p className="text-gray-500 text-sm">Humidity</p>
            </div>

            <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center gap-2 hover:shadow-lg hover:-translate-y-1 hover:bg-white transition">
              <Wind className="text-gray-500" size={26} />
              <p className="text-2xl font-bold">{wind} m/s</p>
              <p className="text-gray-500 text-sm">Wind Speed</p>
            </div>

            <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center gap-2 hover:shadow-lg hover:-translate-y-1 hover:bg-white transition">
              <CloudRain className="text-blue-400" size={26} />
              <p className="text-2xl font-bold">{rainfall} mm</p>
              <p className="text-gray-500 text-sm">Rainfall</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
