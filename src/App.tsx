import { Suspense, lazy } from "react"

import SyntheticHero from './components/SyntheticHero'
import { AppleLiquidGlassNav } from './components/AppleNav'
import { BlurFade } from "./components/ui/blur-fade"

// 👇 Lazy-loaded heavy components
const Skiper17 = lazy(() => import("./components/cardscroll"))
const SplineScene = lazy(() => import("./components/SplineScene"))
function SectionLoader() {
  return (
    <div className="h-40 flex items-center justify-center text-white opacity-60">
      Loading experience...
    </div>
  )
}

function SplineLoader() {
  return (
    <div className="h-screen flex items-center justify-center text-white opacity-60">
      Loading 3D scene...
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <AppleLiquidGlassNav />

      {/* Hero Section (loads instantly) */}
      <div className="relative">
        <BlurFade>
          <SyntheticHero
            title="WHERE TOP ENGINEERS RISE"
            description="A national-level technical event by DKTE."
          />
        </BlurFade>
      </div>

      {/* Sticky Card Scroll (lazy) */}
      <div className="relative mt-40 py-20">
        <Suspense fallback={<SectionLoader />}>
          <Skiper17 />
        </Suspense>
      </div>

      {/* Spline 3D Scene (lazy) */}
      <div className="h-screen relative">
        <Suspense fallback={<SplineLoader />}>
          <SplineScene />
        </Suspense>
      </div>
    </div>
  )
}

export default App
