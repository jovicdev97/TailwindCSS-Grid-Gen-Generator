<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Tailwind Grid Generator</h1>
    <div class="mb-4 flex space-x-4">
      <button @click="undo" class="bg-blue-500 text-white px-4 py-2 rounded">Rückgängig (STRG+Z)</button>
    </div>
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