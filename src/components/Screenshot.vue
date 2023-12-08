<script setup lang='ts'>
import type { FileItem } from '@arco-design/web-vue'
import { IconDelete, IconSave } from '@arco-design/web-vue/es/icon'
import html2canvas from 'html2canvas'
import { useScreenshotStore } from '~/store/useScreenshotStore'

const { imgInsetStyled, imgWrapperStyled } = useScreenshotStore()
const { formClipboard, formPasteEvent, formUpload } = getImageFileWays()

const screenshotBg = ref<HTMLElement>()
const screenshotImg = ref<HTMLElement>()
const previewImage = ref<string>()
const showing = computed(() => previewImage.value && previewImage.value?.length > 0)

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
      previewImage.value = e.target.result as string

    await nextTick()
    await nextTick()

    const imgSize = screenshotImg.value?.getBoundingClientRect()
    if (!imgSize || !screenshotBg.value)
      return

    const width = `${imgSize?.width + imgWrapperStyled.padding}px`
    const height = `${imgSize?.height + imgWrapperStyled.padding}px`

    screenshotBg.value.style.width = width
    screenshotBg.value.style.height = height
  }

  reader.readAsDataURL(file)
}

function removeScreenshot() {
  previewImage.value = ''
}

function exportAsImage() {
  if (!screenshotBg.value)
    return

  html2canvas(screenshotBg.value).then((canvas) => {
    // Convert canvas to data URL
    const dataUrl = canvas.toDataURL('image/png')

    // Create a link element and trigger a download
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = 'exported_image.png'
    link.click()
  })
}

function dragStart(event: any) {
  // Store the offset between mouse position and element position
  event.dataTransfer.setData('text/plain', null)
  event.dataTransfer.setDragImage(new Image(), 0, 0) // Hide default drag image
}

document.body.addEventListener('dragend', async () => {
  exportAsImage()
})

onMounted(() => {
  document.addEventListener('paste', async (event) => {
    const file = await formPasteEvent(event)
    displayImage(file)
  })
})
</script>

<template>
  <div class="basis-[70%]" flex="~ items-center justify-center col gap-y-10" relative overflow-auto>
    <div
      absolute right-0 top-1 z-2 w-full flex-self-end
      flex="~ items-center gap-x-2 justify-between"
    >
      <IconDelete
        style="font-size: 25px;stroke-width: 2;color: red;cursor: pointer;"
        @click="removeScreenshot"
      />
      <IconSave
        style="font-size: 25px;stroke-width: 2;cursor: pointer;"
        @click="exportAsImage"
      />
    </div>
    <a-button
      v-if="!showing"
      @click="pasteFromClipboard"
    >
      Paste image from the clipboard
    </a-button>
    <!-- 截图容器 -->
    <div
      v-if="showing"
      id="screenshot-wrapper"
      flex="~ items-center justify-center"
      border-box relative h-full w-full cursor-grab overflow-auto p-5
    >
      <div
        ref="screenshotBg"
        class="screenshot-bg relative"
        draggable="true"
        flex="~ justify-center items-center"
        :style="imgWrapperStyled"
        @dragstart="dragStart"
      >
        <h3 absolute bottom-1 right-1>
          Beautify by Snapper
        </h3>
        <div
          :style="imgInsetStyled"
          class="transform-scale-[0.9]"
        >
          <img
            ref="screenshotImg"
            :style="{
              borderRadius: (imgInsetStyled.padding === 0 || imgInsetStyled.padding === '0px') ? imgInsetStyled.borderRadius : 0,
            }"
            :src="previewImage"
            object-scale-down
          >
        </div>
      </div>
    </div>
    <!-- 上传容器 -->
    <a-upload
      v-else
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
            Drag the file here or
            <span style="color: #3370FF">Click to upload</span>
          </div>
        </div>
      </template>
    </a-upload>
  </div>
</template>
