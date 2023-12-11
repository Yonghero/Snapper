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
