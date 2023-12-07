import { defineStore } from 'pinia'

export const useScreenshotStore = defineStore('screenshot', () => {
  // 图片样式
  const imgStyled = ref({
    borderRadius: 0,
    boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
  })

  // 图片容器样式
  const imgWrapperStyled = ref({
    backgroundImage: 'linear-gradient(rgba(0, 0, 255, 0.5), rgba(255, 255, 0, 0.5))',
    padding: 50,
  })

  return { imgStyled, imgWrapperStyled }
})
