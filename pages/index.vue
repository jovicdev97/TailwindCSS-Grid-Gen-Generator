<template>
  <div class="container mx-auto">
    <GridCanvas />
    <CodeOutput />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useGridStore } from '~/stores/grid'
import GridCanvas from '~/components/GridCanvas.vue'
import CodeOutput from '~/components/CodeOutput.vue'

const gridStore = useGridStore()

const undo = () => {
  gridStore.undo()
}

const handleKeyDown = (event) => {
  if (event.ctrlKey && event.key === 'z') {
    undo()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>