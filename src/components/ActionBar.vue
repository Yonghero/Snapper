<script setup>
import { useScreenshotStore } from '~/store/useScreenshotStore'

const model = ref({})

const { imgStyled, imgWrapperStyled } = useScreenshotStore()

function onRoundedChange(v) {
  imgStyled.borderRadius = `${v}px`
}

function onSliderChange(v, prop) {
  imgWrapperStyled[prop] = `${v}px`
}
</script>

<template>
  <div
    class="basis-[30%]"
    flex="~ col gap-y-2"
    pl-4
  >
    <a-select :style="{ width: '320px' }" placeholder="Please select ...">
      <a-option>Beijing</a-option>
      <a-option>Shanghai</a-option>
      <a-option>Guangzhou</a-option>
      <a-option disabled>
        Disabled
      </a-option>
    </a-select>
    <a-divider orientation="left">
      Preset
    </a-divider>
    <a-form :model="model" layout="vertical">
      <a-form-item label="Padding">
        <a-slider
          :max="100"
          @change="(v) => onSliderChange(v, 'padding')"
        />
      </a-form-item>
      <div w-full flex="~ items-center gap-x-3">
        <a-form-item label="Width">
          <a-slider
            :max="200"
            @change="(v) => onSliderChange(v, 'increaseWidth')"
          />
        </a-form-item>
        <a-form-item label="Height">
          <a-slider
            :max="200"
            @change="(v) => onSliderChange(v, 'increaseHeight')"
          />
        </a-form-item>
      </div>
      <a-form-item label="Inset">
        <a-slider :max="100" />
      </a-form-item>
      <a-form-item label="Rounded">
        <a-slider @change="onRoundedChange" />
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped lang='scss'>

</style>
