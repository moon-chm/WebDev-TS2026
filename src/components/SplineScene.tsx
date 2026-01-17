import Spline from '@splinetool/react-spline'
import { useRef, useEffect, useState } from 'react'

interface SplineSceneProps {
  onLoad?: () => void
}

export default function SplineScene({ onLoad }: SplineSceneProps) {
  const splineRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)

  function onSplineLoad(spline: any) {
    splineRef.current = spline

    if (spline && spline._scene) {
      const renderer = spline._renderer

      const isMobile = window.innerWidth < 768
      const isSlowDevice = navigator.hardwareConcurrency <= 4

      if (renderer) {
        renderer.setPixelRatio(
          isMobile || isSlowDevice
            ? 1
            : Math.min(window.devicePixelRatio, 2)
        )

        if (isSlowDevice) {
          renderer.antialias = false
        }
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting)

          if (!entry.isIntersecting && spline.pause) {
            spline.pause()
          } else if (entry.isIntersecting && spline.play) {
            spline.play()
          }
        },
        { threshold: 0.1 }
      )

      if (containerRef.current) {
        observer.observe(containerRef.current)
      }
    }

    onLoad?.()
  }

  useEffect(() => {
    let mouseMoveTimeout: number

    const handleMouseMove = () => {
      clearTimeout(mouseMoveTimeout)
      mouseMoveTimeout = window.setTimeout(() => {}, 100)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(mouseMoveTimeout)
    }
  }, [])

 return (
  <div
    ref={containerRef}
    className="relative w-full min-h-[100dvh] overflow-hidden"
    style={{
      opacity: isVisible ? 1 : 0.5,
      pointerEvents: isVisible ? 'auto' : 'none',
    }}
  >
    <Spline
      scene="https://prod.spline.design/cZ2GGUq2CYKw0X8m/scene.splinecode"
      onLoad={onSplineLoad}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        background: 'transparent',
      }}
    />
  </div>
)

}
