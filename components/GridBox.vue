<template>
  <div :style="boxStyle" class="grid-box" @click="$emit('remove')">
    {{ boxDimensions }}
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  box: {
    type: Object,
    required: true
  },
  gridSize: {
    type: Object,
    required: true
  }
})

const boxStyle = computed(() => ({
  left: `${props.box.startX * 100}%`,
  top: `${props.box.startY * 100}%`,
  width: `${props.box.width * 100}%`,
  height: `${props.box.height * 100}%`,
  backgroundColor: 'rgba(59, 130, 246, 0.5)',
  border: '2px solid #3B82F6',
}))

const boxDimensions = computed(() => {
  const colSpan = Math.round(props.box.width * props.gridSize.columns)
  const rowSpan = Math.round(props.box.height * props.gridSize.rows)
  return `${colSpan}x${rowSpan}`
})
</script>

<style scoped>
.grid-box {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  user-select: none;
  cursor: pointer;
  transition: opacity 0.2s;
}

.grid-box:hover {
  opacity: 0.8;
}
</style>

