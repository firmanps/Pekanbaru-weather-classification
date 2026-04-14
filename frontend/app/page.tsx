import CurrentWeather from "@/components/current-weather"
import Footer from "@/components/footer"
import Hero from "@/components/hero"
import Reveal from "@/components/motion/reveal"
import Navbar from "@/components/navbar"
import PredictionForm from "@/components/prediction-form"

export default function Home() {
  return (
    <main>
      <Navbar />

      <Reveal>
        <Hero />
      </Reveal>

      <Reveal delay={0.05}>
        <CurrentWeather />
      </Reveal>

      {/* <Reveal delay={0.05}>
        <Forecast />
      </Reveal> */}

      <Reveal delay={0.05}>
        <PredictionForm />
      </Reveal>

      <Reveal delay={0.05}>
        <Footer />
      </Reveal>
    </main>
  )
}
