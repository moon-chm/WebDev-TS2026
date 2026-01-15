import SyntheticHero from './components/SyntheticHero'
import { AppleLiquidGlassNav } from './components/AppleNav'
import { BlurFade } from "./components/ui/blur-fade"
import { Skiper17 } from "./components/cardscroll"
import SplineScene from "./components/SplineScene"
import { SpeedInsights } from "@vercel/speed-insights/next"

function App() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <AppleLiquidGlassNav />

      {/* Hero Section */}
      <div className="relative">
        <BlurFade>
          <SyntheticHero
            title="WHERE TOP ENGINEERS RISE"
            description="A national-level technical event by DKTE."
          />
        </BlurFade>
      </div>

      {/* Sticky Card Scroll Section */}
      <div className="relative mt-40 py-20">
        <Skiper17 />
      </div>

      {/* Spline Section */}
      <div className="h-screen relative">
        <SplineScene />
      </div>

      {/* Vercel Speed Insights */}
      <SpeedInsights />
    </div>
  )
}

export default App
