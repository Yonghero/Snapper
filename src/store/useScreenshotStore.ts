import { defineStore } from 'pinia'
import type { PresetValue } from '~/utils/types'

// 图片默认样式
export const imgInsetDefaultValue = {
  borderRadius: 0,
  boxShadow: 10,
  padding: 0,
  backgroundColor: '#cccccc',
}

// 图片容器默认样式
export const imgWrapperDefaultValue = {
  backgroundImage: 'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)',
  padding: 25,
}

// 默认预设值
export const defaultPreset = {
  imgInsetStyle: imgInsetDefaultValue,
  imgWrapperStyle: imgWrapperDefaultValue,
  ratioSize: 'auto',
  showWatermark: true,
  watermarkText: 'Beautify by Snapper',
}

export const DEFAULT_PRESET = 'Default Preset'

// 持久化存储 保持刷新后保持不变
export const useScreenshotStore = defineStore('screenshot', () => {
  const imgInsetStyled = useSessionStorage('imgInsetStyled', imgInsetDefaultValue)

  // 图片容器样式
  const imgWrapperStyled = useSessionStorage('imgWrapperStyled', imgWrapperDefaultValue)

  // 是否展示水印
  const showWatermark = useSessionStorage('showWatermark', true)
  // 水印内容
  const watermarkText = useSessionStorage('watermarkText', 'Beautify by Snapper')

  // 预设值
  const presetKey = useLocalStorage('presetKey', DEFAULT_PRESET)

  // 预设字典
  const presetMap = useLocalStorage<Record<string, PresetValue>>('presetMap', { [DEFAULT_PRESET]: defaultPreset }, {
    mergeDefaults: true,
  })

  const ratioSize = useSessionStorage('ratioSize', 'auto')

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
  async function restoreDefaultPreset() {
    delete presetMap.value[DEFAULT_PRESET]

    await nextTick()

    addNewPreset(DEFAULT_PRESET, defaultPreset)

    await nextTick()

    changeToOnePreset(DEFAULT_PRESET)
  }

  // 切换预设
  function changeToOnePreset(key: string) {
    presetKey.value = key

    const result = presetMap.value[key]

    imgWrapperStyled.value = { ...result.imgWrapperStyle }
    imgInsetStyled.value = { ...result.imgInsetStyle }
    ratioSize.value = result.ratioSize
    showWatermark.value = result.showWatermark
    watermarkText.value = result.watermarkText
  }

  return { imgInsetStyled, imgWrapperStyled, watermarkText, showWatermark, presetKey, presetMap, ratioSize, addNewPreset, removeOnePreset, restoreDefaultPreset, changeToOnePreset }
})
