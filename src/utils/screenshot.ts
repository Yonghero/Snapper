import type { FileItem } from '@arco-design/web-vue'

export function getImageFileWays() {
  // 从剪切板拿取
  function formClipboard(): Promise<File> {
    return new Promise((resolve) => {
      navigator.clipboard.read().then((clipboardItems) => {
        const clipboard = clipboardItems[0]

        if (clipboard?.types.includes('image/png')) {
          clipboard.getType('image/png').then((blob) => {
            resolve(new File([blob], 'clipboard.png', { type: 'image/png' }))
          })
        }
      })
    })
  }

  // 键盘粘贴事件
  function formPasteEvent(event: ClipboardEvent): Promise<File> {
    return new Promise((resolve) => {
      if (!event.clipboardData || !event.clipboardData.items)
        return
      const items = event.clipboardData.items

      // @ts-expect-error anyway
      // 检查是否有图片数据
      for (const item of items) {
        if (item.type.indexOf('image') === 0) {
          const blob = item.getAsFile()
          resolve(new File([blob], 'clipboard.png', { type: 'image/png' }))
        }
      }
    })
  }

  // 用户上传
  function formUpload(currentFile: FileItem): Promise<File> {
    return new Promise((resolve) => {
      if (currentFile && currentFile.file)
        resolve(currentFile.file)
    })
  }

  return {
    formClipboard,
    formPasteEvent,
    formUpload,
  }
}
