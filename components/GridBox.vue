<template>
  <div
    :style="boxStyle"
    class="absolute flex items-center justify-center font-bold text-white cursor-pointer select-none transition-opacity duration-200 hover:opacity-80"
    @click="handleBoxRemove"
    @keydown.delete="handleBoxRemove"
    role="button"
    tabindex="0"
  >
    <span class="pointer-events-none">{{ boxDimensions }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  box: {
    type: Object,
    required: true,
    validator: (value) => {
      return ['startX', 'startY', 'width', 'height'].every(key => 
        typeof value[key] === 'number' && 
        value[key] >= 0 && 
        value[key] <= 1
      )
    }
  },
  gridSize: {
    type: Object,
    required: true,
    validator: (value) => {
      return ['rows', 'columns'].every(key => 
        Number.isInteger(value[key]) && 
        value[key] > 0
      )
    }
  }
})

const emit = defineEmits(['remove'])

const boxStyle = computed(() => ({
  left: `${Math.max(0, Math.min(100, props.box.startX * 100))}%`,
  top: `${Math.max(0, Math.min(100, props.box.startY * 100))}%`,
  width: `${Math.max(0, Math.min(100, props.box.width * 100))}%`,
  height: `${Math.max(0, Math.min(100, props.box.height * 100))}%`,
  backgroundColor: 'rgba(59, 130, 246, 0.5)',
  border: '2px solid rgb(59, 130, 246)'
}))

const boxDimensions = computed(() => {
  const colSpan = Math.max(1, Math.round(props.box.width * props.gridSize.columns))
  const rowSpan = Math.max(1, Math.round(props.box.height * props.gridSize.rows))
  return `${colSpan}×${rowSpan}`
})

const handleBoxRemove = () => emit('remove')
</script>