<script setup>
import { useScreenshotStore } from '~/store/useScreenshotStore'

const colorSet = [
  { color: 'linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)', desc: 'Shville' },
  { color: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)', desc: 'Sunny' },
  { color: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)', desc: 'Winter' },
  { color: 'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)', desc: 'Grass' },
  { color: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)', desc: 'Azure' },
  { color: 'none', desc: 'None' },
]

const model = ref({})

function onChangeBackground({ color }) {
  useScreenshotStore().imgWrapperStyled.backgroundImage = color
}
</script>

<template>
  <div
    class="basis-[30%]"
    flex="~ col gap-y-2"
    pl-4
  >
    <a-select :style="{ width: '320px' }" placeholder="Please select ...">
      <a-option>Default Preset</a-option>
      <a-option>Shanghai</a-option>
      <a-option>Guangzhou</a-option>
      <a-option disabled>
        New Preset...
      </a-option>
    </a-select>
    <a-divider orientation="left">
      Preset
    </a-divider>
    <a-form :model="model" layout="vertical">
      <a-form-item label="Padding">
        <template #label>
          Padding <ValueTip> {{ useScreenshotStore().imgWrapperStyled.padding }}</ValueTip>
        </template>
        <a-slider
          v-model="useScreenshotStore().imgWrapperStyled.padding"
          :max="100"
        />
      </a-form-item>
      <div w-full flex items-center justify-center gap-x-1>
        <a-form-item label="Inset">
          <template #label>
            Inset <ValueTip> {{ useScreenshotStore().imgInsetStyled.padding }}</ValueTip>
          </template>
          <a-slider
            v-model="useScreenshotStore().imgInsetStyled.padding"
            :max="100"
          />
        </a-form-item>
        <div class="mr-1 mt-[5px]" flex="~ items-center gap-x-2">
          <div
            class="h-[24px] w-[60px] b-2 border-[#a9aeb8] rounded-[2px]"
            :style="{ background: useScreenshotStore().imgInsetStyled.backgroundColor }"
          >
            <input
              v-model="useScreenshotStore().imgInsetStyled.backgroundColor"
              type="color"
              class="opacity-0"
            >
          </div>
        </div>
      </div>
      <div class="mr-1 mt-[5px]" flex="~ items-center gap-x-3">
        <a-form-item label="Rounded">
          <template #label>
            Rounded <ValueTip> {{ useScreenshotStore().imgInsetStyled.borderRadius }}</ValueTip>
          </template>
          <a-slider v-model="useScreenshotStore().imgInsetStyled.borderRadius" />
        </a-form-item>
        <a-form-item label="Shadow">
          <template #label>
            Shadow <ValueTip> {{ useScreenshotStore().imgInsetStyled.boxShadow }}</ValueTip>
          </template>
          <a-slider
            v-model="useScreenshotStore().imgInsetStyled.boxShadow"
            :max="50"
          />
        </a-form-item>
      </div>
      <a-form-item label="Background">
        <div w-full flex="~ wrap gap-x-3 gap-y-2">
          <Background
            v-for="i in colorSet"
            :key="i.color"
            :color="i.color"
            :desc="i.desc"
            @click="onChangeBackground(i)"
          />
        </div>
      </a-form-item>

      <a-form-item label="Ratio/Size" />

      <div flex="~ col gap-y-2">
        <a-checkbox v-model="useScreenshotStore().showWatermark">
          Show watermark text
        </a-checkbox>
        <a-input
          v-model="useScreenshotStore().watermarkText"
          placeholder="Please enter watermark" allow-clear
        />
      </div>
    </a-form>
  </div>
</template>
