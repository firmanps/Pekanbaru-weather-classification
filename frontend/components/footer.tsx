import { Brain, CloudSun } from "lucide-react"
export default function Footer() {
    return (
      <footer className="bg-slate-900 text-white mt-10">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left */}
          <div className="flex items-center gap-3">
            <CloudSun size={28} className="text-blue-400"/>
            <div>
              <h2 className="font-semibold text-lg">
                Weather Prediction System
              </h2>
              <p className="text-sm text-gray-400">
                Machine Learning Project
              </p>
            </div>
          </div>
  
          {/* Right */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Brain size={18}/>
            <span>Powered by Random Forest Model</span>
          </div>
  
        </div>
  
        {/* Bottom */}
        <div className="border-t border-slate-700 text-center py-4 text-sm text-gray-400">
          © 2026 Weather Prediction System • Machine Learning Project
        </div>
      </footer>
    )
  }