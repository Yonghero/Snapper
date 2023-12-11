import { defineStore } from 'pinia'
import type { PresetValue } from '~/utils/types'

// 图片默认样式
export const imgInsetDefaultValue = {
  borderRadius: 0,
  boxShadow: 10,
  padding: 0,
  backgroundColor: '#ccc',
}

// 图片容器默认样式
export const imgWrapperDefaultValue = {
  backgroundImage: 'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)',
  padding: 25,
}

export const DEFAULT_PRESET = 'Default Preset'

// 持久化存储 保持刷新后保持不变
export const useScreenshotStore = defineStore('screenshot', () => {
  const imgInsetStyled = useSessionStorage('imgInsetStyled', imgInsetDefaultValue)

  // 图片容器样式
  const imgWrapperStyled = useSessionStorage('imgWrapperStyled', imgWrapperDefaultValue)

  // 恢复默认样式
  function restStyled() {
    imgInsetStyled.value = { ...imgInsetDefaultValue }
    imgWrapperStyled.value = { ...imgWrapperDefaultValue }
  }

  // 是否展示水印
  const showWatermark = useSessionStorage('showWatermark', true)
  // 水印内容
  const watermarkText = useSessionStorage('watermarkText', 'Beautify by Snapper')

  // 预设值
  const presetKey = useLocalStorage('presetKey', DEFAULT_PRESET)

  // 预设字典
  const presetMap = useLocalStorage<Record<string, PresetValue>>('presetMap', { [DEFAULT_PRESET]: {
    imgInsetStyle: imgInsetDefaultValue,
    imgWrapperStyle: imgWrapperDefaultValue,
  } }, {
    mergeDefaults: true,
  })

  // 添加一个预设
  function addNewPreset(key: string, value: PresetValue) {
    presetMap.value = { ...presetMap.value, [key]: value }
  }

  // 移除一个预设
  function removeOnePreset(key: string) {
    if (key in presetMap.value)
      delete presetMap.value[key]
    presetMap.value = { ...presetMap.value }
  }

  // 恢复默认预设
  function restoreDefaultPreset() {
    presetKey.value = DEFAULT_PRESET
    addNewPreset(DEFAULT_PRESET, {
      imgInsetStyle: imgInsetDefaultValue,
      imgWrapperStyle: imgWrapperDefaultValue,
    })
  }

  return { imgInsetStyled, imgWrapperStyled, watermarkText, showWatermark, presetKey, presetMap, restStyled, addNewPreset, removeOnePreset, restoreDefaultPreset }
})
