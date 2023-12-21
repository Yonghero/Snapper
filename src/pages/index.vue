<script setup lang="ts">
defineOptions({
  name: 'IndexPage',
})
</script>

<template>
  <main
    flex="~ gap-x-2"
    border-box m-auto max-h-3xl min-h-2xl w7xl rounded p-3
    class="glass-container"
  >
    <Screenshot />
    <a-divider direction="vertical" />
    <ActionBar />
  </main>
  <TheFooter />
</template>

<style lang="scss">
.glass-container {
  border: 1px solid var(--color-neutral-3);
  background: rgba(255, 255, 255, 0.1); /* 背景颜色和透明度，这里使用淡白色调 */
  backdrop-filter: blur(10px); /* 调整模糊效果的强度 */
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
  }
}
</style>
