<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Responsive Grid Builder</h1>
    <div class="mb-4 flex space-x-4">
      <button @click="undo" class="bg-blue-500 text-white px-4 py-2 rounded">Undo (CTRL+Z)</button>
    </div>
    <GridCanvas />
    <CodeOutput />
    <GridPreview />
  </div>
</template>

<script setup>
import { inject, onMounted, onUnmounted } from 'vue'
import { useGridStore } from '~/stores/grid'
import GridCanvas from '~/components/GridCanvas.vue'
import CodeOutput from '~/components/CodeOutput.vue'
import GridPreview from '~/components/GridPreview.vue'

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