import { useEffect, useRef, useState } from 'react'
import { IMAGE_BASE_PATH, MAX_RATING, MIN_RATING } from '../constants'

/**
 * Preloads images 0..IMAGE_COUNT and returns a ref to the array of Image objects.
 * imagesVersion increments each time an image loads, so consumers can re-run effects (e.g. redraw canvas).
 */
export function usePreloadImages(): {
  imagesRef: React.MutableRefObject<(HTMLImageElement | null)[]>
  imagesVersion: number
} {
  const imagesRef = useRef<(HTMLImageElement | null)[]>([])
  const [imagesVersion, setImagesVersion] = useState(0)

  useEffect(() => {
    const imgs = imagesRef.current
    for (let i = MIN_RATING; i <= MAX_RATING; i++) {
      const img = new Image()
      img.onload = () => setImagesVersion((v) => v + 1)
      img.src = `${IMAGE_BASE_PATH}/${i}.png`
      imgs[i] = img
    }
    return () => {
      imgs.length = 0
    }
  }, [])

  return { imagesRef, imagesVersion }
}
