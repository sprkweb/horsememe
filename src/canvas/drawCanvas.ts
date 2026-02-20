import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  TOP_TEXT_AREA_HEIGHT,
  DIVIDER_WIDTH,
} from '../constants'
import { getFontSizeToFit, drawTextWithStroke } from './textUtils'

export interface DrawCanvasParams {
  imageNums: number[]
  texts: string[]
  topText: string
  showDividers: boolean
  getImages: () => (HTMLImageElement | null)[]
}

/**
 * Draws the top text area (white band with centered text) if topText is non-empty.
 */
function drawTopTextArea(
  ctx: CanvasRenderingContext2D,
  topText: string
): void {
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, CANVAS_WIDTH, TOP_TEXT_AREA_HEIGHT)

  ctx.fillStyle = 'black'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const padding = 20
  const availableWidth = CANVAS_WIDTH - padding * 2
  const fontSize = getFontSizeToFit(ctx, topText, availableWidth)
  ctx.font = `bold ${fontSize}px Arial`

  const textX = CANVAS_WIDTH / 2
  const textY = TOP_TEXT_AREA_HEIGHT / 2
  ctx.fillText(topText, textX, textY)
}

/**
 * Draws a single segment's image clipped to the segment rect.
 */
function drawSegmentImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  sliceWidth: number,
  imageOffsetY: number
): void {
  ctx.save()
  ctx.beginPath()
  ctx.rect(x, imageOffsetY, sliceWidth, CANVAS_HEIGHT)
  ctx.clip()
  ctx.drawImage(
    img,
    0,
    0,
    img.naturalWidth,
    img.naturalHeight,
    0,
    imageOffsetY,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  )
  ctx.restore()
}

/**
 * Draws the segment label (text with stroke) in the top part of the segment.
 */
function drawSegmentLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  sliceWidth: number,
  imageOffsetY: number
): void {
  const padding = 16
  const availableWidth = sliceWidth - padding
  const fontSize = getFontSizeToFit(ctx, text, availableWidth)
  ctx.font = `bold ${fontSize}px Arial`
  ctx.lineWidth = Math.max(1, fontSize / 16)

  const textX = x + sliceWidth / 2
  const textY = imageOffsetY + 20
  drawTextWithStroke(ctx, text, textX, textY)
}

/**
 * Draws vertical black divider lines between segments.
 */
function drawDividers(
  ctx: CanvasRenderingContext2D,
  count: number,
  sliceWidth: number,
  imageOffsetY: number
): void {
  ctx.fillStyle = 'black'
  for (let i = 1; i < count; i++) {
    const lineX = sliceWidth * i - DIVIDER_WIDTH / 2
    ctx.fillRect(lineX, imageOffsetY, DIVIDER_WIDTH, CANVAS_HEIGHT)
  }
}

/**
 * Main draw: fills the canvas with the current composition (top text, segment images, labels, dividers).
 */
export function drawCanvas(
  canvas: HTMLCanvasElement,
  params: DrawCanvasParams
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const { imageNums, texts, topText, showDividers, getImages } = params
  const count = imageNums.length
  const sliceWidth = CANVAS_WIDTH / count
  const hasTopText = topText.trim().length > 0
  const totalHeight = hasTopText
    ? CANVAS_HEIGHT + TOP_TEXT_AREA_HEIGHT
    : CANVAS_HEIGHT
  const imageOffsetY = hasTopText ? TOP_TEXT_AREA_HEIGHT : 0

  canvas.width = CANVAS_WIDTH
  canvas.height = totalHeight

  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, CANVAS_WIDTH, totalHeight)

  if (hasTopText) {
    drawTopTextArea(ctx, topText)
  }

  const imgs = getImages()
  for (let i = 0; i < count; i++) {
    const img = imgs[imageNums[i]]
    if (!img?.complete) continue

    const x = sliceWidth * i
    drawSegmentImage(ctx, img, x, sliceWidth, imageOffsetY)

    if (texts[i]) {
      ctx.save()
      drawSegmentLabel(ctx, texts[i], x, sliceWidth, imageOffsetY)
      ctx.restore()
    }
  }

  if (showDividers && count > 1) {
    drawDividers(ctx, count, sliceWidth, imageOffsetY)
  }
}
