<script setup lang='ts'>
import { useScreenshotStore } from '~/store/useScreenshotStore'

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
      { label: 'Single image Tweet', value: '1200:675' },
    ],
  },
]

function isChecked(tagValue: string) {
  return useScreenshotStore().ratioSize === tagValue
}

function onCheck(tagValue: string) {
  useScreenshotStore().ratioSize = tagValue
}
</script>

<template>
  <div w-full flex="~ wrap gap-y-3">
    <a-space class="w-full">
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
    <a-space>
      <a-trigger
        v-for="(tag, i) in childrenRatioSet"
        :key="i"
        trigger="click"
        show-arrow
      >
        <a-tag bordered :checked="false" color="arcoblue">
          {{ tag.label }}
        </a-tag>
        <template #content>
          <div class="demo-arrow">
            <div
              v-for="(child, idx) in tag.children"
              :key="idx"
              flex="~ items-center gap-x-3 justify-end"
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

<style scoped>
.demo-arrow {
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  padding: 10px;
  /* width: 200px; */
  background-color: var(--color-bg-popup);
  border-radius: 4px;
}
</style>
