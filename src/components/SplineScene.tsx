import { lazy, Suspense } from "react"

const Spline = lazy(() => import("@splinetool/react-spline"))

export default function SplineScene() {
  return (
    <div className="h-[300px] md:h-[600px]">
      <Suspense
        fallback={
          <div className="w-full h-full bg-black/20 rounded-xl animate-pulse" />
        }
      >
        <Spline scene="https://prod.spline.design/cZ2GGUq2CYKw0X8m/scene.splinecode" />
      </Suspense>
    </div>
  )
}
