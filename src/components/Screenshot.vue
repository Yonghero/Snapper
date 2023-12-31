<script setup lang='ts'>
import type { FileItem } from '@arco-design/web-vue'
import { IconDelete, IconSave } from '@arco-design/web-vue/es/icon'
import dayjs from 'dayjs'
import html2canvas from 'html2canvas'
import hotkeys from 'hotkeys-js'
import { Message } from '@arco-design/web-vue'
import { useScreenshotStore } from '~/store/useScreenshotStore'
import type { anyToString } from '~/utils/types'

const { imgInsetStyled, imgWrapperStyled, changeToOnePreset } = useScreenshotStore()
const { formClipboard, formPasteEvent, formUpload } = getImageFileWays()

const imgInsetStyledPx = computed(() => {
  return {
    ...addPxUnit(useScreenshotStore().imgInsetStyled),
    boxShadow: `rgba(0, 0, 0, 0.35) 0px 5px ${useScreenshotStore().imgInsetStyled.boxShadow}px`,
  } as anyToString<typeof imgInsetStyled>
})

const imgWrapperStyledPx = computed(() => {
  return {
    ...addPxUnit(useScreenshotStore().imgWrapperStyled, 'padding'),
  } as unknown as anyToString<typeof imgWrapperStyled>
})

const outermostLayer = ref<HTMLElement>()
const previewImageRef = ref<HTMLImageElement>()
// 持久化存储 刷新后也可恢复图片
const previewImageSrc = useSessionStorage('previewImageSrc', '')
const showing = computed(() => previewImageSrc.value && previewImageSrc.value?.length > 0)

// 导出状态
const exportLoading = ref(false)

const { changeObjectsColor, switchDrawtool, drawtoolType } = useFabricCanvas(computed(() => outermostLayer.value))

async function handleFileSelect(_: FileItem[], currentFile: FileItem) {
  const file = await formUpload(currentFile)
  displayImage(file)
}

async function pasteFromClipboard() {
  const file = await formClipboard()
  displayImage(file)
}

function displayImage(file: File) {
  const reader = new FileReader()

  reader.onload = async (e) => {
    if (e.target?.result)
      previewImageSrc.value = e.target.result as string

    await nextTick()
    await nextTick()

    const imgSize = previewImageRef.value?.getBoundingClientRect()
    if (!imgSize || !outermostLayer.value)
      return

    if (previewImageRef.value) {
      const maxColor = await getMaxColorFormImg(previewImageRef.value)
      if (maxColor)
        useScreenshotStore().imgInsetStyled.backgroundColor = maxColor
    }
  }

  reader.readAsDataURL(file)
}

watch(() => useScreenshotStore().ratioSize, (size) => {
  if (!outermostLayer.value)
    return
  // css 宽高比
  outermostLayer.value.style.aspectRatio = size
})

function exportAsImage() {
  if (!outermostLayer.value || !previewImageSrc.value) {
    Message.warning('Noting to export!')
    return
  }

  exportLoading.value = true

  html2canvas(outermostLayer.value).then((canvas) => {
    // Convert canvas to data URL
    const dataUrl = canvas.toDataURL('image/png')

    // Create a link element and trigger a download
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `Snapper_${dayjs().format('YYYY-MM-DD HH:mm')}.png`
    link.click()

    exportLoading.value = false
  })
}

document.addEventListener('paste', async (event) => {
  const file = await formPasteEvent(event)
  displayImage(file)
})

function removeScreenshot() {
  previewImageSrc.value = ''
  changeToOnePreset(useScreenshotStore().presetKey)
}

onMounted(() => {
  if (!previewImageSrc.value)
    removeScreenshot()

  hotkeys('ctrl+c, command+c', () => {
    exportAsImage()
  })

  hotkeys('ctrl+shift+d, command+shift+d', () => {
    removeScreenshot()
  })
})
</script>

<template>
  <div class="basis-[80%]" flex="~ col" relative overflow-auto>
    <div
      z-2 w-full flex-self-end
      flex="~ items-center gap-x-2 justify-between"
    >
      <Editor
        v-model:toolType="drawtoolType"
        @switch:draw-tool="switchDrawtool"
        @change:object-color="changeObjectsColor"
      />
      <div flex="~ gap-x-5">
        <a-tooltip :content="`${$t('Remove Image')} (${$t('hotkeys')}: ctrl/command+shift+d)`">
          <IconDelete
            style="font-size: 25px;stroke-width: 2;color: red;cursor: pointer;"
            @click="removeScreenshot"
          />
        </a-tooltip>

        <a-tooltip
          :content="`${$t('Export image')} (${$t('hotkeys')}: ctrl/command+c)`"
        >
          <IconSave
            style="font-size: 25px;stroke-width: 2;cursor: pointer;"
            @click="exportAsImage"
          />
        </a-tooltip>
      </div>
    </div>

    <!-- 截图容器 -->
    <div
      v-if="showing"
      id="screenshot-wrapper"
      flex="~ items-center justify-center"
      border-box relative h-full w-full cursor-grab overflow-auto p-6
    >
      <div
        ref="outermostLayer"
        class="screenshot-bg relative bg-cover"
        flex="~ justify-center items-center"
        :style="imgWrapperStyledPx"
      >
        <canvas id="canvas" absolute left-0 top-0 />
        <h3
          v-show="useScreenshotStore().showWatermark"
          absolute bottom-2 right-2 text-white
          style="text-shadow: 3px 4px 7px rgba(81,67,21,0.8)"
        >
          {{ useScreenshotStore().watermarkText }}
        </h3>
        <div
          :style="imgInsetStyledPx"
          class="transform-scale-[0.9]"
        >
          <img
            ref="previewImageRef"
            :style="{
              borderRadius: (useScreenshotStore().imgInsetStyled.padding === 0 || useScreenshotStore().imgInsetStyled.padding === 0) ? imgInsetStyledPx.borderRadius : 0,
            }"
            :src="previewImageSrc"
            object-scale-down
          >
        </div>
      </div>
    </div>
    <!-- 上传容器 -->
    <div v-else flex="~ col items-center justify-center gap-y-5" m-auto>
      <a-button
        @click="pasteFromClipboard"
      >
        {{ $t('Paste image from the clipboard') }}
      </a-button>
      <a-upload

        accept="image/*"
        :auto-upload="false"
        action="/"
        @change="handleFileSelect"
      >
        <template #upload-button>
          <div
            style="
            background-color: var(--color-fill-2);
            color: var(--color-text-1);
            border: 1px dashed var(--color-fill-4);
            height: 158px;
            width: 380px;
            border-radius: 2;
            line-height: 158px;
            text-align: center;"
          >
            <div>
              {{ $t('Drag the file here or') }}
              <span style="color: #3370FF">{{ $t('Click to upload') }}</span>
            </div>
          </div>
        </template>
      </a-upload>
    </div>
  </div>
  <Teleport to="body">
    <Transition
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <div
        v-if="exportLoading"
        class="overlay bg-black/[0.5] dark:bg-white/[0.5]"
      >
        <a-spin dot />
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.overlay {
  display: flex;
  justify-self: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
}

.canvas-container {
  position: absolute!important;
  left: 0!important;
  top: 0!important;
  z-index: 99!important;
}
</style>
