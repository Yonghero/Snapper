import { defineStore } from 'pinia'

export const useScreenshotStore = defineStore('screenshot', () => {
  // 持久化存储 保持刷新后保持不变
  // 图片样式
  const imgInsetStyled = useSessionStorage('imgInsetStyled', {
    borderRadius: 0,
    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 0px',
    padding: 0 as number | string,
    backgroundColor: '#ccc',
  })

  // 图片容器样式
  const imgWrapperStyled = useSessionStorage('imgWrapperStyled', {
    backgroundImage: 'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)',
    padding: 50,
  })

  // 是否展示水印
  const showWatermark = useSessionStorage('showWatermark', true)
  // 水印内容
  const watermarkText = useSessionStorage('watermarkText', 'Beautify by Snapper')

  return { imgInsetStyled, imgWrapperStyled, watermarkText, showWatermark }
})
