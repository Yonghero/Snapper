export * from './color'
export * from './screenshot'

export function addPxUnit(styleObj: Record<string, string | number>, key?: string) {
  const cloneObj = { ...styleObj }
  Object.keys(cloneObj).forEach((i) => {
    if (key) {
      if (key === i)
        cloneObj[key] = `${cloneObj[key]}px`
    }
    else {
      if (typeof cloneObj[i] === 'number')
        cloneObj[i] = `${cloneObj[i]}px`
    }
  })

  return cloneObj
}

// 计算角度函数
export function calculateAngle(startPoint: Record<string, any>, endPoint: Record<string, any>) {
  const deltaX = endPoint.x - startPoint.x
  const deltaY = endPoint.y - startPoint.y
  return (Math.atan2(deltaY, deltaX) * 180) / Math.PI
}
