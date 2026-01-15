import { lazy, Suspense, useEffect, useState } from "react"

const LazySpline = lazy(() => import("@splinetool/react-spline"))

export default function SplineScene() {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    // runs only on client
    setMounted(true)
    setIsMobile(window.innerWidth < 768)
  }, [])

  // ⛔ Do NOT render Spline before mount or on mobile
  if (!mounted || isMobile) {
    return (
      <div className="h-[300px] md:h-[600px] bg-black/20 rounded-xl" />
    )
  }

  return (
    <div className="h-[600px]">
      <Suspense
        fallback={
          <div className="w-full h-full bg-black/30 animate-pulse rounded-xl" />
        }
      >
        <LazySpline scene="https://prod.spline.design/cZ2GGUq2CYKw0X8m/scene.splinecode" />
      </Suspense>
    </div>
  )
}
