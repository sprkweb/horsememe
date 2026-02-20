/**
 * Finds a font size so that the text fits within maxWidth when drawn with the given font family.
 * Returns a value between minFontSize and maxFontSize.
 */
export function getFontSizeToFit(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  options: { maxFontSize?: number; minFontSize?: number; fontFamily?: string } = {}
): number {
  const { maxFontSize = 48, minFontSize = 12, fontFamily = 'Arial' } = options
  let fontSize = Math.min(maxFontSize, maxWidth / (text.length * 0.6))
  ctx.font = `bold ${fontSize}px ${fontFamily}`
  let textWidth = ctx.measureText(text).width

  while (textWidth > maxWidth && fontSize > minFontSize) {
    fontSize -= 2
    ctx.font = `bold ${fontSize}px ${fontFamily}`
    textWidth = ctx.measureText(text).width
  }

  return Math.min(fontSize, maxFontSize)
}

/**
 * Draws text with a stroke outline.
 */
export function drawTextWithStroke(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  options: {
    fillStyle?: string
    strokeStyle?: string
    lineWidth?: number
    textAlign?: CanvasTextAlign
    textBaseline?: CanvasTextBaseline
  } = {}
): void {
  const {
    fillStyle = 'white',
    strokeStyle = 'black',
    lineWidth = 2,
    textAlign = 'center',
    textBaseline = 'top',
  } = options

  ctx.fillStyle = fillStyle
  ctx.strokeStyle = strokeStyle
  ctx.lineWidth = lineWidth
  ctx.textAlign = textAlign
  ctx.textBaseline = textBaseline

  ctx.strokeText(text, x, y)
  ctx.fillText(text, x, y)
}
