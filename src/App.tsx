import SyntheticHero from './components/SyntheticHero'
import { AppleLiquidGlassNav } from './components/AppleNav'
import { BlurFade } from "./components/ui/blur-fade"
import { ProgressiveBlur } from "./components/progressiveblur"
import { Skiper17 } from "./components/cardscroll"
import SplineScene from "./components/SplineScene"

function App() {
  return (
    <div className="min-h-screen bg-black relative">
      <AppleLiquidGlassNav />

      <ProgressiveBlur
        position="top"
        backgroundColor="rgba(0,0,0,0.3)"
        height="100px"
        blurAmount="8px"
        className="z-10"
      />

      <BlurFade>
        <SyntheticHero
          title="WHERE TOP ENGINERS RISE"
          description="A national-level technical event by DKTE."
        />
      </BlurFade>
{/* Spline Section (AFTER Sticky Cards) */}
      <div className="h-screen relative">
        <SplineScene />
      </div>
      {/* Sticky Card Scroll Section */}
      <div className="h-screen relative bg-black">
        <Skiper17 />
      </div>

      

      <ProgressiveBlur
        position="bottom"
        backgroundColor="rgba(0,0,0,0.3)"
        height="100px"
        blurAmount="8px"
        className="z-10"
      />
    </div>
  )
}

export default App
