import { useState } from 'react'
import './App.css'

const SVG_WIDTH = 1344
const SVG_HEIGHT = 768

function renderSplitImages(imageNums: number[], opts?: { idPrefix?: string }) {
  const count = imageNums.length
  if (count === 0) return null

  const sliceWidth = SVG_WIDTH / count
  const idPrefix = opts?.idPrefix ?? 'mask'

  return imageNums.map((num, i) => {
    const maskId = `${idPrefix}-${i}`
    const x = sliceWidth * i

    return (
      <g key={`${num}-${i}`}>
        <mask id={maskId}>
          <rect x={x} y={0} width={sliceWidth} height={SVG_HEIGHT} fill="white" />
        </mask>
        <image
          href={`pics/${num}.png`}
          x={0}
          y={0}
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          mask={`url(#${maskId})`}
        />
      </g>
    )
  })
}

function App() {
  const [partCount, setPartCount] = useState(2)
  const [imageNums, setImageNums] = useState<number[]>([1, 2])

  const handlePartCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value) || 1
    const clampedCount = Math.max(1, Math.min(count, 11))
    setPartCount(clampedCount)
    
    // Обновляем массив номеров картинок, добавляя или удаляя элементы
    const newImageNums = [...imageNums]
    while (newImageNums.length < clampedCount) {
      newImageNums.push(0)
    }
    while (newImageNums.length > clampedCount) {
      newImageNums.pop()
    }
    setImageNums(newImageNums)
  }

  const handleImageNumChange = (index: number, value: string) => {
    const num = parseInt(value) || 0
    const clampedNum = Math.max(0, Math.min(num, 10))
    const newImageNums = [...imageNums]
    newImageNums[index] = clampedNum
    setImageNums(newImageNums)
  }

  return (
    <>
      <div className="wrap">
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <label>
            Количество частей:{' '}
            <input
              type="number"
              min="1"
              max="11"
              value={partCount}
              onChange={handlePartCountChange}
              style={{ width: '80px', padding: '5px' }}
            />
          </label>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            {imageNums.map((num, index) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ marginBottom: '5px', fontSize: '12px' }}>
                  Часть {index + 1}:
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={num}
                  onChange={(e) => handleImageNumChange(index, e.target.value)}
                  style={{ 
                    width: '60px', 
                    padding: '5px',
                    textAlign: 'center'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <svg 
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          style={{ display: 'block', marginBottom: '20px' }}>
          <rect x={0} y={0} width={SVG_WIDTH} height={SVG_HEIGHT} fill="white" />
          {renderSplitImages(imageNums, { idPrefix: 'horseMask' })}
        </svg>
      </div>
    </>
  )
}

export default App
