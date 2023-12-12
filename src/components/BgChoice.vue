<script setup lang='ts'>
import { useScreenshotStore } from '~/store/useScreenshotStore'

const colorSet = [
  { color: 'linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)', desc: 'Shville' },
  { color: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)', desc: 'Sunny' },
  { color: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)', desc: 'Winter' },
  { color: 'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)', desc: 'Grass' },
  { color: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)', desc: 'Azure' },
  { color: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)', desc: 'Cloudy' },
  { color: 'linear-gradient(to top, #30cfd0 0%, #330867 100%)', desc: 'pheus' },
  { color: 'linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%)', desc: 'bow' },
  { color: 'linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.15) 100%)', desc: 'Crest' },
  { color: 'linear-gradient(to top, #cc208e 0%, #6713d2 100%)', desc: 'Bath' },
  { color: 'linear-gradient(to right, #243949 0%, #517fa4 100%)', desc: 'Stone' },
  { color: 'none', desc: 'None' },
]

function onChangeBackground({ color }: { color: string }) {
  useScreenshotStore().imgWrapperStyled.backgroundImage = color
}
</script>

<template>
  <div w-full flex="~ wrap gap-x-3 gap-y-2">
    <Background
      v-for="i in colorSet"
      :key="i.color"
      :color="i.color"
      :desc="i.desc"
      @click="onChangeBackground(i)"
    />
  </div>
</template>
