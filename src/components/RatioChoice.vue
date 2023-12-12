<script setup lang='ts'>
import { useScreenshotStore } from '~/store/useScreenshotStore'
import type { RationChild } from '~/utils/types'

const ratioSizeSet = [
  { label: 'Auto', value: 'auto' },
  { label: '16:9', value: '16/9' },
  { label: '4:3', value: '4/3' },
  { label: '3:2', value: '3/2' },
  { label: '1:1', value: '1/1' },
]

const childrenRatioSet = [
  {
    label: 'Twitter',
    value: 'twitter',
    children: [
      { label: 'Single image Tweet', value: '1200/675' },
      { label: '2-images Tweet', value: '700/800' },
      { label: '3-images Tweet -first', value: '700/800' },
      { label: '3-images - 2nd and 3rd', value: '1200/686' },
      { label: '4-images Tweet', value: '1200/600' },
      { label: 'Shared link', value: '1200/628' },
      { label: 'Profile Header/Banner', value: '1500/500' },
    ],
  },
  {
    label: 'Facebook',
    value: 'facebook',
    children: [
      { label: 'Timeline image', value: '1200/630' },
      { label: 'Highlighted image', value: '1200/717' },
      { label: 'Shared link - rectangular', value: '1200/628' },
      { label: 'Shared link - square', value: '154/154' },
      { label: 'Event cover photo', value: '1920/1080' },

    ],
  },
  {
    label: 'Instagram',
    value: 'instragram',
    children: [
      { label: 'Picture -square', value: '1080/1080' },
      { label: 'Picture - rectangular', value: '1350/1080' },
      { label: 'Picture portrait', value: '1080/1350' },
      { label: 'Story', value: '1080/1920' },
    ],
  },
]

const customRatio = ref<string>()
const errorStatus = ref<boolean>(false)

function applyCustomRatio() {
  if (!customRatio.value)
    errorStatus.value = true

  if (customRatio.value) {
    const splitResult = customRatio.value.trim().split('/')
    const splitColonResult = customRatio.value.trim().split(':')

    if (!splitColonResult?.length || !splitResult?.length)
      errorStatus.value = true

    if (splitResult)
      useScreenshotStore().ratioSize = `${splitResult[0]}/${splitResult[1]}`

    else if (splitColonResult)
      useScreenshotStore().ratioSize = `${splitColonResult[0]}/${splitColonResult[1]}`
  }
}

function isChecked(tagValue: string, child?: RationChild[]) {
  // 如果子项被选择则自己也被选中
  if (child)
    return (child.some(i => i.value === useScreenshotStore().ratioSize))

  return useScreenshotStore().ratioSize === tagValue
}

function onCheck(tagValue: string) {
  useScreenshotStore().ratioSize = tagValue
}
</script>

<template>
  <div flex="~ wrap gap-y-3" relative mt-2 w-full>
    <a-trigger
      trigger="click"
      @hide="() => errorStatus = false"
    >
      <ValueTip
        class="-top-7"
        bordered absolute left-10 cursor-pointer
      >
        Custom...
      </ValueTip>
      <template #content>
        <div
          class="bg-[var(--color-bg-popup)]"
          w-70 rounded p-3 shadow
          flex="~ col items-center gap-y-3"
        >
          <a-input
            v-model="customRatio"
            :error="errorStatus"
            placeholder="Enter a valid ratio (e.g. 1/2, 4/3)"
          />
          <div v-if="errorStatus" text-red>
            Please enter valid values
          </div>
          <a-button @click="applyCustomRatio">
            apply
          </a-button>
        </div>
      </template>
    </a-trigger>

    <a-space size="medium">
      <a-tag
        v-for="(tag, i) in ratioSizeSet"
        :key="i"
        color="arcoblue"
        bordered
        checkable
        :checked="isChecked(tag.value)"
        @check="onCheck(tag.value)"
      >
        {{ tag.label }}
      </a-tag>
    </a-space>
    <a-space size="medium">
      <a-trigger
        v-for="(tag, i) in childrenRatioSet"
        :key="i"
        trigger="click"
        show-arrow
      >
        <a-tag
          checkable
          bordered
          :checked="isChecked(tag.value, tag.children)"
          color="arcoblue"
          @check="onCheck(tag.value)"
        >
          {{ tag.label }}
        </a-tag>
        <template #content>
          <div
            class="bg-[var(--color-bg-popup)]"
            rounded p-3 shadow
          >
            <div
              v-for="(child, idx) in tag.children"
              :key="idx"
              flex="~ items-center gap-x-3 justify-end" mb-2
            >
              {{ child.label }}
              <a-tag
                checkable
                color="arcoblue"
                bordered cursor-pointer
                :checked="isChecked(child.value)"
                @check="onCheck(child.value)"
              >
                {{ child.value }}
              </a-tag>
            </div>
          </div>
        </template>
      </a-trigger>
    </a-space>
  </div>
</template>
