import { fabric } from 'fabric'
import type { IEvent, Point } from 'fabric/fabric-impl'
import hotkeys from 'hotkeys-js'
import { useScreenshotStore } from '~/store/useScreenshotStore'

import FabricArrow from '~/utils/fabric-arrow'
import type { DrawToolType } from '~/utils/types'

export default function useFabricCanvas(containerDom: ComputedRef<HTMLElement | undefined>) {
  let fabricCanvas: fabric.Canvas

  let objectsColor = '#e66465'

  const drawtoolType = ref<DrawToolType>()
  let mouseDownHandler: (event: IEvent<Event>) => void
  let mouseMoveHandler: (event: IEvent<Event>) => void
  let mouseUpHandler: (event: IEvent<Event>) => void

  let selectedObjects: fabric.Object[]

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

  watchEffect(async () => {
    if (containerDom.value) {
      await nextTick()
      // 初始化canvas
      fabricCanvas = new fabric.Canvas('canvas', {
        width: containerDom.value.getBoundingClientRect().width,
        height: containerDom.value.getBoundingClientRect().height,
        selection: true,
        defaultCursor: 'crosshair',
      })
      fabricCanvas.add(tooltip)
      initHotKeys()
      initBindEvents()
    }
  })

  // 图片容器比例变化
  // canvas也重新设置宽高
  watch(() =>
    [
      useScreenshotStore().imgInsetStyled,
      useScreenshotStore().ratioSize,
      useScreenshotStore().imgWrapperStyled,
    ], async () => {
    await nextTick()
    if (!containerDom.value)
      return
    const rect = containerDom.value.getBoundingClientRect()
    fabricCanvas.setWidth(rect.width)
    fabricCanvas.setHeight(rect.height)
  }, {
    deep: true,
  })

  async function switchDrawtool(toolType: DrawToolType) {
    unBindEvent()

    // 如果同样的toolType则取消当前绑定事件
    if (drawtoolType.value === toolType) {
      drawtoolType.value = undefined
      return
    }

    // 切换不同的toolType
    await nextTick()
    drawtoolType.value = toolType

    if (toolType === 'selection') {
      fabricCanvas.selection = true
    }
    else if (toolType === 'color-picker') {
      ;
    }
    else {
      fabricCanvas.selection = false
      bindEvents()
    }
  }

  function bindEvents() {
    switch (drawtoolType.value) {
      case 'arrow':
        bindArrowEvents()
        break
      case 'text':
        bindTextEvents()
    }

    fabricCanvas.on('mouse:down', mouseDownHandler)
    fabricCanvas.on('mouse:move', mouseMoveHandler)
    fabricCanvas.on('mouse:up', mouseUpHandler)
  }

  // 箭头绑定事件
  function bindArrowEvents() {
    let arrow: InstanceType<FabricArrow>, startPoint: Point | null

    mouseDownHandler = (e) => {
      if (!e.pointer)
        return
      // 获取鼠标点击的坐标
      startPoint = new fabric.Point(e.pointer.x, e.pointer.y)

      arrow = new FabricArrow([startPoint.x, startPoint.y, startPoint.x, startPoint.y], {
        stroke: objectsColor,
        strokeWidth: 5,
        selectable: true,
        editable: true,
      })

      // 将矩形箭头对象添加到画布
      fabricCanvas.add(arrow)
    }

    mouseMoveHandler = (e) => {
      if (arrow && e.pointer && startPoint) {
        // 更新矩形箭头的角度和位置
        const pointer = fabricCanvas.getPointer(e.e)
        arrow.set({
          left: pointer.x,
          top: pointer.y,
          x2: pointer.x,
          y2: pointer.y,
        })

        fabricCanvas.requestRenderAll()
      }
    }

    mouseUpHandler = () => {
      // 释放箭头对象
      arrow = null
      startPoint = null
      // drawtoolType.value = undefined
      // unBindEvent()
    }
  }

  // 文字编辑绑定事件
  function bindTextEvents() {
    mouseDownHandler = (e) => {
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
        // selectable: true,
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

      // unBindEvent()
    }

    mouseMoveHandler = (e) => {
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
        text: `Text goes here`,
      })

      fabricCanvas.renderAll()
    }

    mouseUpHandler = () => {
      // drawtoolType.value = undefined
    }
  }

  function unBindEvent() {
    switch (drawtoolType.value) {
      case 'arrow':
        break
      case 'text':
        break
    }
    if (!fabricCanvas)
      return
    fabricCanvas.remove(tooltip)
    fabricCanvas.off('mouse:down', mouseDownHandler)
    fabricCanvas.off('mouse:move', mouseMoveHandler)
    fabricCanvas.off('mouse:up', mouseUpHandler)
  }

  // 改变canvas内部的Objects的颜色
  function changeObjectsColor(e: any) {
    if (e.target?.value) {
      objectsColor = e.target.value

      fabricCanvas.getObjects().forEach((obj) => {
        obj.set({
          fill: objectsColor,
          stroke: objectsColor,
        })
      })

      fabricCanvas.renderAll()
    }
  }

  function initHotKeys() {
    hotkeys('Backspace', () => {
      if (selectedObjects.length) {
        selectedObjects.forEach((obj) => {
          fabricCanvas.remove(obj)
        })
        fabricCanvas.renderAll() // 手动触发渲染
      }
    })
  }

  function initBindEvents() {
  // 监听框选事件
    fabricCanvas.on('selection:created', (event) => {
    // 获取被框选中的对象
      if (event.selected)
        selectedObjects = event.selected
    })
  }

  return {
    changeObjectsColor,
    switchDrawtool,
    drawtoolType,
  }
};
