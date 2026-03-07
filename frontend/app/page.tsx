import CurrentWeather from "@/components/current-weather"
import Footer from "@/components/footer"
import Forecast from "@/components/forecast"
import Hero from "@/components/hero"
import Navbar from "@/components/navbar"
import PredictionForm from "@/components/prediction-form"

export default function Home() {
  return (
    <main>
      <Navbar/>
      <Hero/>
      <CurrentWeather/>
      <Forecast/>
      <PredictionForm/>
      <Footer/>
    </main>
  )
}