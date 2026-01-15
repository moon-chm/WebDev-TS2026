import { lazy, Suspense } from "react"

const Spline = lazy(() => import("@splinetool/react-spline"))

export default function SplineScene() {
  const isMobile = window.innerWidth < 768

  return (
    <div className="h-[300px] md:h-[600px]">
      {!isMobile && (
        <Suspense
          fallback={
            <div className="w-full h-full bg-black/20 animate-pulse rounded-xl" />
          }
        >
          <Spline scene="https://prod.spline.design/cZ2GGUq2CYKw0X8m/scene.splinecode" />
        </Suspense>
      )}
    </div>
  )
}
