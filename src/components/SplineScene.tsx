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
    
    // Performance optimizations
    if (spline && spline._scene) {
      const scene = spline._scene
      const renderer = spline._renderer
      
      // Lower quality on mobile/slower devices
      const isMobile = window.innerWidth < 768
      const isSlowDevice = navigator.hardwareConcurrency <= 4
      
      if (renderer) {
        // Reduce pixel ratio for better performance
        renderer.setPixelRatio(isMobile || isSlowDevice ? 1 : Math.min(window.devicePixelRatio, 2))
        
        // Disable antialiasing on low-end devices
        if (isSlowDevice) {
          renderer.antialias = false
        }
      }
      
      // Throttle rendering when not visible
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting)
          
          if (spline.setZoom) {
            // Reduce quality when scrolled away
            if (!entry.isIntersecting && spline.pause) {
              spline.pause()
            } else if (entry.isIntersecting && spline.play) {
              spline.play()
            }
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

  // Throttle mouse interactions
  useEffect(() => {
    let mouseMoveTimeout: NodeJS.Timeout
    
    const handleMouseMove = () => {
      clearTimeout(mouseMoveTimeout)
      mouseMoveTimeout = setTimeout(() => {
        // Mouse stopped moving - can reduce update frequency
      }, 100)
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
      className="spline-container w-full h-full"
      style={{
        opacity: isVisible ? 1 : 0.5,
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
    >
      <Spline
        scene="https://prod.spline.design/cZ2GGUq2CYKw0X8m/scene.splinecode"
        onLoad={onSplineLoad}
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent'
        }}
      />
    </div>
  )
}