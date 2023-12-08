import { defineStore } from 'pinia'

export const useScreenshotStore = defineStore('screenshot', () => {
  // 图片样式
  const imgInsetStyled = ref({
    borderRadius: 0,
    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
    padding: 0 as number | string,
    backgroundColor: '#ccc',
  })

  // 图片容器样式
  const imgWrapperStyled = ref({
    backgroundImage: 'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)',
    padding: 50,
  })

  const showWatermark = ref(true)
  const watermarkText = ref('Beautify by Snapper')

  return { imgInsetStyled, imgWrapperStyled, watermarkText, showWatermark }
})
