import { lazy, Suspense, useEffect, useRef, useState } from "react"

// Lazy import Spline
const Spline = lazy(() => import("@splinetool/react-spline"))

export default function SplineScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loadSpline, setLoadSpline] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadSpline(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.25, // load when 25% visible
      }
    )

    if (containerRef.current) observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-screen flex items-center justify-center bg-black"
    >
      {loadSpline && (
        <Suspense fallback={<SplineLoader />}>
          <Spline scene="https://prod.spline.design/cZ2GGUq2CYKw0X8m/scene.splinecode" />
        </Suspense>
      )}
    </div>
  )
}

// Lightweight loader
function SplineLoader() {
  return (
    <div className="text-white opacity-60 text-sm">
      Loading 3D experience…
    </div>
  )
}
