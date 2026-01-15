import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import ReactLenis from 'lenis/react'

ReactDOM.createRoot(document.getElementById('root')!).render(
  
  <React.StrictMode>
    <ReactLenis 
      root
      options={{
        duration: 1.01, // Only 1% more than instant (0.1% smoothing)
        easing: (t) => t, // Linear easing for minimal smoothing
        wheelMultiplier: 1.5,
        touchMultiplier: 0.2,
        infinite: false,
      }}
    >
      <App />
    </ReactLenis>
  </React.StrictMode>,
  

)

