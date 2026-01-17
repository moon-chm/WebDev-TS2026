import { useEffect, useState } from 'react'

export function PerformanceMonitor() {
  const [fps, setFps] = useState(60)

  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()

    function measureFPS() {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime >= lastTime + 1000) {
        setFps(frameCount)
        frameCount = 0
        lastTime = currentTime
      }
      
      requestAnimationFrame(measureFPS)
    }

    measureFPS()
  }, [])

  return (
    <div className="fixed top-4 right-4 bg-black/50 text-white px-3 py-2 rounded text-sm font-mono z-50">
      FPS: {fps}
    </div>
  )
}