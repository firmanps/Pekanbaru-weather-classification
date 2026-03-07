import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  CloudRain,
  Droplets,
  RotateCcw,
  Send,
  Sun,
  Thermometer,
  Wind
} from "lucide-react"

export default function PredictionForm() {
  return (
    <section className="max-w-4xl mx-auto py-16 px-4">

      <h2 className="text-center text-2xl font-semibold">
        Machine Learning Weather Prediction
      </h2>

      <p className="text-center text-gray-500 mb-8">
        Enter meteorological parameters to predict weather conditions
      </p>

      <Card className="p-8 space-y-6">

        {/* FORM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* TN */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Thermometer size={16}/>
              TN Min Temperature (°C)
            </Label>
            <Input placeholder="24.2"/>
          </div>

          {/* TX */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Thermometer size={16}/>
              TX Max Temperature (°C)
            </Label>
            <Input placeholder="34.3"/>
          </div>

          {/* TAVG */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Thermometer size={16}/>
              TAVG Avg Temperature (°C)
            </Label>
            <Input placeholder="28.5"/>
          </div>

          {/* HUMIDITY */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Droplets size={16}/>
              RH_AVG Avg Humidity (%)
            </Label>
            <Input placeholder="75"/>
          </div>

          {/* RAINFALL */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <CloudRain size={16}/>
              RR Rainfall (mm)
            </Label>
            <Input placeholder="0"/>
          </div>

          {/* SUNSHINE */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Sun size={16}/>
              SS Sunshine Duration (hrs)
            </Label>
            <Input placeholder="6.5"/>
          </div>

          {/* WIND */}
          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2">
              <Wind size={16}/>
              FF_AVG Avg Wind Speed (m/s)
            </Label>
            <Input placeholder="3.2"/>
          </div>

        </div>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-2">

        <Button className="w-full sm:flex-1 bg-blue-600">
          <span><Send/></span>
          Predict Weather
        </Button>

        <Button
          variant="outline"
          className="w-full sm:w-auto sm:min-w-[120px]"
          >
          <span><RotateCcw/></span>
          Clear
        </Button>

      </div>

      </Card>

    </section>
  )
}