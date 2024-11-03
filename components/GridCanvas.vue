<template>
  <div class="flex flex-col h-screen">
    <div class="flex items-center justify-between w-full p-4 bg-gray-100 shadow-md">
      <div class="flex items-center space-x-4">
        <label class="flex items-center">
          <span class="mr-2">Spalten:</span>
          <input v-model.number="columns" type="number" min="1" max="24" class="w-16 p-1 border rounded" @change="updateGridSize" />
        </label>
        <label class="flex items-center">
          <span class="mr-2">Zeilen:</span>
          <input v-model.number="rows" type="number" min="1" max="24" class="w-16 p-1 border rounded" @change="updateGridSize" />
        </label>
      </div>
      <div class="flex items-center space-x-4">
        <button @click="undo" class="btn-primary">Rückgängig (STRG+Z)</button>
        <button @click="zoomIn" class="btn-icon">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </button>
        <button @click="zoomOut" class="btn-icon">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM5 10h14" />
          </svg>
        </button>
        <button @click="clearGrid" class="btn-danger">Grid leeren</button>
        <button @click="undo" class="btn-primary">Rückgängig</button>
      </div>
    </div>

    <div class="flex-grow overflow-hidden">
      <div class="w-full h-full relative border border-gray-300" :style="containerStyle">
        <div class="grid-container absolute inset-0" ref="gridContainer"
          @mousedown="startDrawing" @mousemove="drawBox" 
          @mouseup="finishDrawing" @mouseleave="finishDrawing"
          :style="gridContainerStyle">
          <div class="absolute inset-0" :style="backgroundGridStyle"></div>
          <GridBox v-for="box in gridStore.boxes" :key="box.id" 
            :box="box" :gridSize="{ columns, rows }"
            @remove="removeBox(box.id)" />
          <div v-if="previewBox" :style="previewBoxStyle" class="preview-box"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useGridStore } from '~/stores/grid'
import GridBox from './GridBox.vue'

const gridStore = useGridStore()
const columns = ref(12)
const rows = ref(6)
const zoom = ref(1)
const gridContainer = ref(null)
const isDrawing = ref(false)
const startX = ref(0)
const startY = ref(0)
const previewBox = ref(null)

const containerStyle = computed(() => ({ overflow: 'hidden' }))

const gridContainerStyle = computed(() => ({
  width: `${100 * zoom.value}%`,
  height: `${100 * zoom.value}%`,
  transform: `scale(${1 / zoom.value})`,
  transformOrigin: 'top left',
  backgroundColor: '#f9f9f9',
}))

const backgroundGridStyle = computed(() => ({
  backgroundImage: `linear-gradient(to right, #e0e0e0 1px, transparent 1px),
                    linear-gradient(to bottom, #e0e0e0 1px, transparent 1px)`,
  backgroundSize: `${100 / columns.value}% ${100 / rows.value}%`,
}))

const previewBoxStyle = computed(() => {
  if (!previewBox.value) return {}
  return {
    left: `${previewBox.value.startX * 100}%`,
    top: `${previewBox.value.startY * 100}%`,
    width: `${previewBox.value.width * 100}%`,
    height: `${previewBox.value.height * 100}%`,
  }
})

function startDrawing(event) {
  if (event.button !== 0) return
  isDrawing.value = true
  const rect = gridContainer.value.getBoundingClientRect()
  startX.value = Math.floor((event.clientX - rect.left) / rect.width * columns.value) / columns.value
  startY.value = Math.floor((event.clientY - rect.top) / rect.height * rows.value) / rows.value
}

function drawBox(event) {
  if (!isDrawing.value) return
  
  const rect = gridContainer.value.getBoundingClientRect()
  const currentX = Math.ceil((event.clientX - rect.left) / rect.width * columns.value) / columns.value
  const currentY = Math.ceil((event.clientY - rect.top) / rect.height * rows.value) / rows.value

  previewBox.value = {
    startX: Math.min(startX.value, currentX),
    startY: Math.min(startY.value, currentY),
    width: Math.abs(currentX - startX.value),
    height: Math.abs(currentY - startY.value)
  }
}

function finishDrawing() {
  if (!isDrawing.value) return
  isDrawing.value = false
  
  if (previewBox.value?.width > 0 && previewBox.value?.height > 0) {
    gridStore.addBox({ ...previewBox.value, id: Date.now() })
  }
  previewBox.value = null
}

const clearGrid = () => gridStore.clear()
const removeBox = (id) => gridStore.removeBox(id)
const undo = () => gridStore.undo()
const updateGridSize = () => gridStore.setGridSize({ columns: columns.value, rows: rows.value })

const zoomIn = () => zoom.value = Math.min(zoom.value + 0.1, 2)
const zoomOut = () => zoom.value = Math.max(zoom.value - 0.1, 0.5)

onMounted(() => {
  window.addEventListener('mouseup', finishDrawing)
  updateGridSize()
})

onUnmounted(() => {
  window.removeEventListener('mouseup', finishDrawing)
})

watch([columns, rows], updateGridSize)
</script>

<style>
.btn-primary {
  @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50;
}

.btn-danger {
  @apply px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50;
}

.btn-icon {
  @apply p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50;
}

.grid-container {
  position: relative;
}

.preview-box {
  @apply absolute border-2 border-dashed border-blue-500 bg-blue-500 bg-opacity-20;
}
</style>