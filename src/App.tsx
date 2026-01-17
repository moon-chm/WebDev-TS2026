import { Suspense, lazy, useEffect, useRef, useState } from "react"
import Lenis from "@studio-freight/lenis"
import { PerformanceMonitor } from './components/PerformanceMonitor' 
import SyntheticHero from './components/SyntheticHero'
import { AppleLiquidGlassNav } from './components/AppleNav'
import { BlurFade } from "./components/ui/blur-fade"
{import.meta.env.DEV && <PerformanceMonitor />}
// Lazy-loaded heavy components
const SplineScene = lazy(() => import("./components/SplineScene"))

function SplineLoader() {
  return (
    <div className="h-screen flex items-center justify-center text-white opacity-60">
      Loading 3D scene...
    </div>
  )
}

// Wrapper to handle load state
function SplineWrapper() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const splineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only load Spline when it's about to come into view
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      {
        rootMargin: '200px', // Start loading 200px before it comes into view
        threshold: 0
      }
    )

    if (splineRef.current) {
      observer.observe(splineRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={splineRef} className="h-screen relative will-change-transform">
      {isInView ? (
        <Suspense fallback={<SplineLoader />}>
          <SplineScene onLoad={() => setIsLoaded(true)} />
        </Suspense>
      ) : (
        <SplineLoader />
      )}
    </div>
  )
}

function App() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.6,
      touchMultiplier: 1.5,
      infinite: false,
    })

    lenisRef.current = lenis

    let rafId: number
    let scrollTimeout: NodeJS.Timeout

    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    // Add/remove scrolling class for performance
    lenis.on('scroll', () => {
      document.body.classList.add('is-scrolling')
      
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        document.body.classList.remove('is-scrolling')
      }, 150)
    })

    // Force Lenis to recalculate scroll on resize/content changes
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize()
    })

    const appElement = document.querySelector('.scroll-container')
    if (appElement) {
      resizeObserver.observe(appElement)
    }

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(scrollTimeout)
      lenis.destroy()
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div className="min-h-screen bg-black scroll-container">
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

      {/* Spline 3D Scene with fixed height to prevent layout shift */}
      <SplineWrapper />
    </div>
  )
}

export default App