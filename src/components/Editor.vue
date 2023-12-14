<script setup lang='ts'>
import hotkeys from 'hotkeys-js'
import type { EditToolType } from '~/utils/types'

const props = defineProps({
  toolType: {
    type: String as PropType<EditToolType>,
  },
})

const emit = defineEmits(['switch:drawTool', 'change:objectColor', 'update:toolType'])

const objectsColor = ref<string>('#e66465')
const activeToolType = computed(() => props.toolType)

// 获取按钮类型判断是否为选中状态
function getType(type: EditToolType) {
  return activeToolType.value === type ? 'outline' : undefined
}

// 抛出切换工具类型事件
function emitDrawtool(type: EditToolType) {
  // eslint-disable-next-line vue/custom-event-name-casing
  emit('switch:drawTool', type)
  if (type !== props.toolType)
    emit('update:toolType', type)
}

function initHotkeys() {
  hotkeys('1', () => emitDrawtool('selection'))
  hotkeys('2', () => emitDrawtool('text'))
  hotkeys('3', () => emitDrawtool('arrow'))
}

initHotkeys()
</script>

<template>
  <a-button-group>
    <a-tooltip content="Selection Mode">
      <a-button
        :type="getType('selection')"
        @click="emitDrawtool('selection')"
      >
        <template #icon>
          <icon-launch />
        </template>

        <!-- Selection  -->
        1
      </a-button>
    </a-tooltip>

    <a-tooltip content="Add Text">
      <a-button
        :type="getType('text')"
        @click="emitDrawtool('text')"
      >
        <template #icon>
          <icon-edit />
        </template>

        <!-- Text -->
        2
      </a-button>
    </a-tooltip>

    <a-tooltip content="Add Arrow">
      <a-button
        :type="getType('arrow')"
        @click="emitDrawtool('arrow')"
      >
        <template #icon>
          <icon-arrow-rise />
        </template>
        <!-- Arrow -->
        3
      </a-button>
    </a-tooltip>

    <a-tooltip content="Change Objects Color">
      <a-button
        :type="getType('color-picker')"
      >
        <template #icon>
          <icon-bg-colors />
        </template>
        <div
          class="h-[20px] w-[40px] b-2 border-[#a9aeb8] rounded-[2px]"
          :style="{
            background: objectsColor,
          }"
          @click="emitDrawtool('color-picker')"
        >
          <input
            id="color-picker"
            v-model="objectsColor"
            type="color"
            class="opacity-0"
            @change="e => {
              emit('change:objectColor', e)
              emit('update:toolType', undefined)
            }"
          >
        </div>
      </a-button>
    </a-tooltip>
    <div ml-3>
      <a-trigger
        trigger="hover"
        show-arrow
      >
        <div cursor-pointer>
          <ValueTip bordered py-1 />
          Tip: use number keys (1, 2, 3)
        </div>
        <template #content>
          <div
            class="bg-[var(--color-bg-popup)]"
            rounded p-3 shadow
            flex="~ col  gap-y-3"
          >
            <div>
              Press "1" : Start to Selection mode
            </div>
            <div>
              Press "2" : Add text
            </div>
            <div>
              Press "3" : Add arrow
            </div>
          </div>
        </template>
      </a-trigger>
    </div>
  </a-button-group>
</template>
