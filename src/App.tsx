import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'

const CANVAS_WIDTH = 1344
const CANVAS_HEIGHT = 768

const MIN_PARTS = 1
const MAX_PARTS = 11

const MIN_RATING = 1
const MAX_RATING = 10
const DEFAULT_RATING = 10

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<(HTMLImageElement | null)[]>([])
  const [partCount, setPartCount] = useState(2)
  const [imageNums, setImageNums] = useState<number[]>([1, 2])
  const [, setImagesVersion] = useState(0)

  // Preload all images 0..10
  useEffect(() => {
    const imgs = imagesRef.current
    for (let i = 0; i <= 10; i++) {
      const img = new Image()
      img.onload = () => setImagesVersion((v) => v + 1)
      img.src = `pics/${i}.png`
      imgs[i] = img
    }
    return () => {
      imgs.length = 0
    }
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const count = imageNums.length
    const sliceWidth = CANVAS_WIDTH / count

    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    const imgs = imagesRef.current
    for (let i = 0; i < count; i++) {
      const img = imgs[imageNums[i]]
      if (!img?.complete) continue

      const x = sliceWidth * i
      ctx.save()
      ctx.beginPath()
      ctx.rect(x, 0, sliceWidth, CANVAS_HEIGHT)
      ctx.clip()
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      ctx.restore()
    }
  }, [imageNums])

  useEffect(() => {
    draw()
  }, [draw])

  const exportToPng = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'horse-meme.png'
      a.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  const handlePartCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value) || MIN_PARTS
    const clampedCount = Math.max(MIN_PARTS, Math.min(count, MAX_PARTS))
    setPartCount(clampedCount)
    const newImageNums = [...imageNums]
    while (newImageNums.length < clampedCount) newImageNums.push(DEFAULT_RATING)
    while (newImageNums.length > clampedCount) newImageNums.pop()
    setImageNums(newImageNums)
  }

  const handleImageNumChange = (index: number, value: string) => {
    const num = Math.max(MIN_RATING, Math.min(parseInt(value) || DEFAULT_RATING, MAX_RATING))
    const newImageNums = [...imageNums]
    newImageNums[index] = num
    setImageNums(newImageNums)
  }

  return (
    <div className="app">
      <div className="partsAmount">
        <label>
          Parts amount:{' '}
          <input
            type="number"
            min="1"
            max="11"
            value={partCount}
            onChange={handlePartCountChange}
          />
        </label>
      </div>

      <div className="ratings">
        {imageNums.map((num, index) => (
          <div className="ratingsPart" key={index}>
            <label>Part {index + 1}:</label>
            <input
              type="number"
              min="0"
              max="10"
              value={num}
              onChange={(e) => handleImageNumChange(index, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="horseImage">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
        />
      </div>

      <button type="button" onClick={exportToPng}>
        Download PNG
      </button>
    </div>
  )
}

export default App
