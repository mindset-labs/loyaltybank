import { onLCP, onINP, onCLS, onFCP, onTTFB } from 'web-vitals/attribution'

const reportWebVitals = () => {
  onCLS(console.log)
  onFCP(console.log)
  onLCP(console.log)
  onINP(console.log)
  onTTFB(console.log)
}

export default reportWebVitals
