<script setup lang='ts'>
defineProps({
  active: {
    type: Boolean,
    default: true,
  },
  color: {
    type: String,
    default: 'linear-gradient(to right, #ff8177 0%, #ff867a 0%, #ff8c7f 21%, #f99185 52%, #cf556c 78%, #b12a5b 100%)',
  },
  desc: {
    type: String,
    default: 'Young',
  },
})
</script>

<template>
  <div flex="~ col gap-y-1">
    <div
      h-10 w-10 rounded
      :style="{
        background: color,
        border: active ? '1px solid #dbd8e3' : '0px',
      }"
    />
    <label for="" text-xs text-gray>{{ desc }}</label>
  </div>
</template>
