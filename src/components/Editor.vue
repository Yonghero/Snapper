<script setup lang='ts'>
const emit = defineEmits(['open:editableText', 'change:objectColor'])

const objectsColor = ref<string>('#e66465')
</script>

<template>
  <a-button-group>
    <a-button
      @click="emit('open:editableText')"
    >
      <template #icon>
        <icon-edit />
      </template>

      Text 1
    </a-button>
    <a-button>
      <template #icon>
        <icon-arrow-rise />
      </template>
      arrow 2
    </a-button>
    <a-button class="w-[50px]">
      <div
        class="h-[20px] w-[40px] b-2 border-[#a9aeb8] rounded-[2px]"
        :style="{
          background: objectsColor,
        }"
      >
        <input
          v-model="objectsColor"
          type="color"
          class="opacity-0"
          @change="e => emit('change:objectColor', e)"
        >
      </div>
    </a-button>
  </a-button-group>
</template>
