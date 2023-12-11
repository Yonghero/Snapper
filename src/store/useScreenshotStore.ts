import { defineStore } from 'pinia'

// 持久化存储 保持刷新后保持不变
export const useScreenshotStore = defineStore('screenshot', () => {
  // 图片默认样式
  const imgInsetDefaultValue = {
    borderRadius: 0,
    boxShadow: 10,
    padding: 0,
    backgroundColor: '#ccc',
  }
  const imgInsetStyled = useSessionStorage('imgInsetStyled', imgInsetDefaultValue)

  // 图片容器默认样式
  const imgWrapperDefaultValue = {
    backgroundImage: 'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)',
    padding: 25,
  }

  // 图片容器样式
  const imgWrapperStyled = useSessionStorage('imgWrapperStyled', imgWrapperDefaultValue)

  function restStyled() {
    imgInsetStyled.value = { ...imgInsetDefaultValue }
    imgWrapperStyled.value = { ...imgWrapperDefaultValue }
  }

  // 是否展示水印
  const showWatermark = useSessionStorage('showWatermark', true)
  // 水印内容
  const watermarkText = useSessionStorage('watermarkText', 'Beautify by Snapper')

  return { imgInsetStyled, imgWrapperStyled, watermarkText, showWatermark, restStyled }
})
