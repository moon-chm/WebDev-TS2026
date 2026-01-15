import { lazy, Suspense } from "react"

const Spline = lazy(() => import("@splinetool/react-spline"))

export default function SplineScene() {
  return (
    <div className="w-full h-screen">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
          <div className="text-white text-xl">Loading...</div>
        </div>
      }>
        <Spline 
          scene="https://prod.spline.design/Br2ec4uzQFipXomJ/scene.splinecode"
          className="w-full h-full touch-none"
          style={{ touchAction: 'none' }}
        />
      </Suspense>
    </div>
  )
}