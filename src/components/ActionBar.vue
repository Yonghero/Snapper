<script setup>
import { Message } from '@arco-design/web-vue'
import { IconDelete } from '@arco-design/web-vue/es/icon'
import { DEFAULT_PRESET, useScreenshotStore } from '~/store/useScreenshotStore'

const model = ref({})

const presetConfirmVisible = ref(false)
const form = ref({ name: '' })

function onPresetSelectChange(key) {
  if (key === DEFAULT_PRESET)
    useScreenshotStore().restoreDefaultPreset()

  else
    useScreenshotStore().changeToOnePreset(key)
}

function onNewPreset() {
  presetConfirmVisible.value = true
}

function handleCancel() {
  presetConfirmVisible.value = false
}
function handleBeforeOk(done) {
  useScreenshotStore().addNewPreset(
    form.value.name,
    { imgInsetStyle: useScreenshotStore().imgInsetStyled, imgWrapperStyle: useScreenshotStore().imgWrapperStyled, ratioSize: useScreenshotStore().ratioSize },
  )
  Message.success('New Preset Success')

  useScreenshotStore().changeToOnePreset(form.value.name)
  done()
}
</script>

<template>
  <div
    class="basis-[20%]"
    flex="~ col gap-y-2"
    pl-4
  >
    <div flex="~ items-center gap-x-2">
      <a-select
        v-model="useScreenshotStore().presetKey"
        :style="{ width: '320px' }"
        placeholder="Please select ..."
        @change="onPresetSelectChange"
      >
        <a-option
          v-for="(preset, i) in Object.keys(useScreenshotStore().presetMap)"
          :key="i"
        >
          {{ preset }}
        </a-option>
        <template #footer>
          <div py-2 text-center flex="~ gap-x-2 justify-center">
            <a-button
              @click="useScreenshotStore().restoreDefaultPreset"
            >
              Restore default preset
            </a-button>
            <a-button @click="onNewPreset">
              New preset ...
            </a-button>
          </div>
        </template>
      </a-select>

      <a-popconfirm
        :content="`Are you sure you want to delete ${useScreenshotStore().presetKey} Preset`"
        ok-text="Yes"
        cancel-text="Cancel"
        @ok="() => {
          useScreenshotStore().removeOnePreset(useScreenshotStore().presetKey)
          Message.success(`Remove ${useScreenshotStore().presetKey} Preset success`)
          // 删除当前预设恢复为默认预设
          useScreenshotStore().restoreDefaultPreset()
        }"
      >
        <IconDelete
          v-if="useScreenshotStore().presetKey !== DEFAULT_PRESET"
          style="stroke-width: 2;cursor: pointer;"
          size="20"
        />
      </a-popconfirm>
    </div>

    <a-divider orientation="left">
      Preset
    </a-divider>
    <a-form :model="model" layout="vertical">
      <a-form-item label="Padding" :label-col-style="{ margin: 0 }">
        <template #label>
          Padding <ValueTip> {{ useScreenshotStore().imgWrapperStyled.padding }}</ValueTip>
        </template>
        <a-slider
          v-model="useScreenshotStore().imgWrapperStyled.padding"
          :max="100"
        />
      </a-form-item>
      <div w-full flex items-center justify-center gap-x-1>
        <a-form-item label="Inset" :label-col-style="{ margin: 0 }">
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
      <div class="mr-1 mt-[2px]" flex="~ items-center gap-x-3">
        <a-form-item label="Rounded" :label-col-style="{ margin: 0 }">
          <template #label>
            Rounded <ValueTip> {{ useScreenshotStore().imgInsetStyled.borderRadius }}</ValueTip>
          </template>
          <a-slider v-model="useScreenshotStore().imgInsetStyled.borderRadius" />
        </a-form-item>
        <a-form-item label="Shadow" :label-col-style="{ margin: 0 }">
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
        <BgChoice />
      </a-form-item>

      <a-form-item label="Ratio" :label-col-style="{ margin: 0 }">
        <RatioChoice />
      </a-form-item>

      <div flex="~ col gap-y-2">
        <a-checkbox v-model="useScreenshotStore().showWatermark">
          Show watermark text
        </a-checkbox>
        <a-input
          v-model="useScreenshotStore().watermarkText"
          :disabled="!useScreenshotStore().showWatermark"
          placeholder="Please enter watermark" allow-clear
        />
      </div>
    </a-form>
  </div>
  <a-modal
    v-model:visible="presetConfirmVisible"
    title="New Preset"
    ok-text="Confirm"
    cancel-text="Exit"
    @cancel="handleCancel" @before-ok="handleBeforeOk"
  >
    <a-form :model="form">
      <a-form-item field="name" label="Perset name">
        <a-input v-model="form.name" placeholder="Please enter preset name" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
