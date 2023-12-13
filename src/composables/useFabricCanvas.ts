import { fabric } from 'fabric'
import type { IEvent } from 'fabric/fabric-impl'

// import FabricArrow from '~/utils/fabric-arrow'

export default function useFabricCanvas(containerDom: ComputedRef<DOMRect | undefined>) {
  let fabricCanvas: fabric.Canvas

  let objectsColor = '#e66465'

  // 创建提示框
  const tooltip = new fabric.Textbox('', {
    left: 0,
    top: 0,
    width: 200,
    fontSize: 25,
    fill: objectsColor,
    selectable: false,
    evented: false,
  })

  // // 计算角度函数
  // function calculateAngle(startPoint, endPoint) {
  //   const deltaX = endPoint.x - startPoint.x
  //   const deltaY = endPoint.y - startPoint.y
  //   return (Math.atan2(deltaY, deltaX) * 180) / Math.PI
  // }

  watchEffect(() => {
    if (containerDom.value) {
      fabricCanvas = new fabric.Canvas('canvas', {
        width: containerDom.value.width,
        height: containerDom.value.height,
      })
      fabricCanvas.add(tooltip)

      // let arrow, startPoint

      // // 监听鼠标按下事件
      // fabricCanvas.on('mouse:down', (event) => {
      // // 获取鼠标点击的坐标
      //   startPoint = new fabric.Point(event.pointer.x, event.pointer.y)

      //   arrow = new FabricArrow([startPoint.x, startPoint.y, startPoint.x, startPoint.y], {
      //     stroke: objectsColor,
      //     strokeWidth: 2,
      //     selectable: true,
      //   })

      //   // 将矩形箭头对象添加到画布
      //   fabricCanvas.add(arrow)
      // })

      // // 监听鼠标移动事件
      // fabricCanvas.on('mouse:move', (event) => {
      //   if (arrow) {
      //     // 更新矩形箭头的角度和位置
      //     const pointer = fabricCanvas.getPointer(event.e)
      //     arrow.set({
      //       angle: calculateAngle(startPoint, event.pointer),
      //       left: pointer.x,
      //       top: pointer.y,
      //     })
      //     fabricCanvas.requestRenderAll()
      //   }
      // })

      // // 监听鼠标释放事件
      // fabricCanvas.on('mouse:up', () => {
      // // 释放箭头对象
      //   arrow = null
      //   startPoint = null
      // })
    }
  })

  // 提示框
  function mouseMoveHandler(e: IEvent<Event>) {
    // 判断 tooltip 是否存在于 canvas 中
    const tooltipExists = fabricCanvas.getObjects().includes(tooltip)

    // 不存在则加入canvas当中
    if (!tooltipExists)
      fabricCanvas.add(tooltip)

    if (!fabricCanvas)
      return

    const pointer = fabricCanvas.getPointer(e.e)
    tooltip.set({
      left: pointer.x + 10, // 10像素的偏移量
      top: pointer.y + 10,
      text: `Text gose here (${pointer.x.toFixed(2)}, ${pointer.y.toFixed(2)})`,
    })
    fabricCanvas.setCursor('crosshair')

    fabricCanvas.renderAll()
  }

  // 编辑文字
  function editTextHandler(e: IEvent<Event>) {
    if (!e.pointer)
      return
    // 获取鼠标点击的位置
    const { x, y } = e.pointer

    const text = 'remark here'
    // 创建可编辑文本
    const editableText = new fabric.IText(text, {
      left: x,
      top: y,
      fontFamily: 'Arial',
      fontSize: 30,
      fill: objectsColor,
      selectable: true,
    })

    if (!fabricCanvas)
      return

    // 将文本添加到画布
    fabricCanvas.add(editableText)

    // 进入编辑模式
    editableText.enterEditing()

    editableText.setSelectionStart(text.length)
    editableText.setSelectionEnd(text.length)

    // 在文本对象中添加一个点击事件，用于退出编辑模式
    editableText.on('mousedown', () => {
      editableText.exitEditing()
    })

    closeEditableText()
  }

  // 打开可键入文字模式
  function openEditableText() {
    fabricCanvas.on('mouse:down', editTextHandler)
    fabricCanvas.on('mouse:move', mouseMoveHandler)
  }
  // 关闭文字键入模式
  function closeEditableText() {
    fabricCanvas.off('mouse:down', editTextHandler)
    fabricCanvas.off('mouse:move', mouseMoveHandler)
    fabricCanvas.remove(tooltip)
  }

  // 改变canvas内部的Objects的颜色
  function changeObjectsColor(e: any) {
    if (e.target?.value) {
      objectsColor = e.target.value

      fabricCanvas.getObjects().forEach((obj) => {
        if (obj.type === 'i-text') {
          obj.set({
            fill: objectsColor,
          })
        }
      })

      fabricCanvas.renderAll()
    }
  }

  // 在键盘按下事件中检查删除键
  document.addEventListener('keydown', (event) => {
    // 获取焦点的对象
    const activeObject = fabricCanvas.getActiveObject()

    // 检查是否按下了删除键 (Delete 或 Backspace)
    if (event.key === 'Delete' || event.key === 'Backspace') {
      // 检查焦点是否在文本对象上
      if (activeObject && activeObject.type === 'i-text') {
        // 删除文本对象
        fabricCanvas.remove(activeObject)
        fabricCanvas.renderAll() // 手动触发渲染
      }
    }
  })

  return {
    openEditableText,
    closeEditableText,
    changeObjectsColor,
  }
};
