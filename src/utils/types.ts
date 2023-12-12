import type { imgInsetDefaultValue, imgWrapperDefaultValue } from '../store/useScreenshotStore'

export type anyToString<T extends Record<string, any>> = {
  [key in keyof T]: string
}

export interface PresetValue {
  imgInsetStyle: typeof imgInsetDefaultValue
  imgWrapperStyle: typeof imgWrapperDefaultValue
  ratioSize: string
  showWatermark: boolean
  watermarkText: string
}

export interface RationChild { label: string, value: string }
