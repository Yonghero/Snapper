const maxImageSize = 800

function rgbToHex(r: number, g: number, b: number) {
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`
}

/**
 * 拿去一张图片中出现最多的颜色
 * @param image
 * @returns
 */
export async function getMaxColorFormImg(image: HTMLImageElement) {
  // 缩小大尺寸图片
  if (image.width > maxImageSize || image.height > maxImageSize) {
    const aspectRatio = image.width / image.height
    if (image.width > image.height) {
      image.width = maxImageSize
      image.height = maxImageSize / aspectRatio
    }
    else {
      image.height = maxImageSize
      image.width = maxImageSize * aspectRatio
    }
  }

  const colorCanvas = document.createElement('canvas')

  await nextTick()

  const ctx = colorCanvas.getContext('2d')

  if (!ctx)
    return

  colorCanvas.width = image.width
  colorCanvas.height = image.height

  // Draw the image on the canvas
  ctx.drawImage(image, 0, 0, image.width, image.height)

  // Get the image data
  const imageData = ctx.getImageData(0, 0, image.width, image.height)
  const pixelData = imageData.data

  // Analyze the colors
  const colorCounts = {} as Record<string, number>

  for (let i = 0; i < pixelData.length; i += 4) {
    const color = rgbToHex(pixelData[i], pixelData[i + 1], pixelData[i + 2])
    colorCounts[color] = (colorCounts[color] || 0) + 1
  }

  // Find the color with the highest count
  let maxColor = ''
  let maxCount = 0

  for (const color in colorCounts) {
    if (colorCounts[color] > maxCount) {
      maxColor = color
      maxCount = colorCounts[color]
    }
  }

  return maxColor
}
