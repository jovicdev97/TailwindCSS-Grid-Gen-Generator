<template>
  <div :style="boxStyle" class="grid-box">
    {{ boxDimensions }}
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGridStore } from '~/stores/grid'

const props = defineProps({
  box: {
    type: Object,
    required: true
  }
})

const store = useGridStore()

const boxStyle = computed(() => ({
  width: `${props.box.width}px`,
  height: `${props.box.height}px`,
  left: `${props.box.startX}px`,
  top: `${props.box.startY}px`,
  backgroundColor: 'rgba(59, 130, 246, 0.5)',
  border: '2px solid #3B82F6',
}))

const boxDimensions = computed(() => 
  `${Math.round(props.box.width / store.cellSize.width)}x${Math.round(props.box.height / store.cellSize.height)}`
)
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
}
</style>
