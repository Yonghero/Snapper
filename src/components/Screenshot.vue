<script setup lang='ts'>
import type { FileItem } from '@arco-design/web-vue'

const previewImage = ref<string>()

function handleFileSelect(_: FileItem[], currentFile: FileItem) {
  if (currentFile && currentFile.file)

    readerImage(currentFile.file)
}

function pasteFromClipboard() {
  navigator.clipboard.read().then((clipboardItems) => {
    const clipboard = clipboardItems[0]

    if (clipboard?.types.includes('image/png')) {
      clipboard.getType('image/png').then((blob) => {
        previewImage.value = URL.createObjectURL(blob)
        // const file = new File([blob], 'pasted-image.png', { type: 'image/png' })
        // readerImage(file)
      })
    }
  })
}

function readerImage(file: File) {
  const reader = new FileReader()

  reader.onload = function (e) {
    if (e.target?.result)
      previewImage.value = e.target.result as string
  }

  reader.readAsDataURL(file)
}

onMounted(() => {
  document.addEventListener('paste', (event) => {
    if (!event.clipboardData || !event.clipboardData.items)
      return
    const items = event.clipboardData.items

    // @ts-expect-error anyway
    // 检查是否有图片数据
    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        const blob = item.getAsFile()

        previewImage.value = URL.createObjectURL(blob)
      }
    }
  })
})
</script>

<template>
  <div class="basis-[70%]" flex="~ items-center justify-center col gap-y-10">
    <a-button @click="pasteFromClipboard">
      粘贴剪贴板中的图片
    </a-button>
    <img v-if="previewImage" :src="previewImage" alt="">
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
            <span style="color: #3370FF"> Click to upload</span>
          </div>
        </div>
      </template>
    </a-upload>
  </div>
</template>

<style scoped lang='scss'>
</style>
