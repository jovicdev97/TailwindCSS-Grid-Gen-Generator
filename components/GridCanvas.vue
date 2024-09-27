<template>
  <div class="flex flex-col items-center w-full">
    <!-- Grid Controls -->
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
        <button @click="clearGrid" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
          Grid leeren
        </button>
        <button @click="undo" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          Rückgängig
        </button>
      </div>
    </div>

    <!-- Grid Area -->
    <div 
      class="grid-container relative mt-4 border border-gray-300"
      ref="gridContainer"
      @mousedown="startDrawing" 
      @mousemove="drawBox" 
      @mouseup="finishDrawing"
      @mouseleave="finishDrawing"
      :style="gridContainerStyle"
    >
      <!-- Grid Lines -->
      <div v-for="col in columns" :key="'col-' + col"
           :style="{ left: `${(col - 1) * 100 / columns}%` }"
           class="grid-line vertical"></div>
      <div v-for="row in rows" :key="'row-' + row"
           :style="{ top: `${(row - 1) * 100 / rows}%` }"
           class="grid-line horizontal"></div>

      <!-- Grid Boxes -->
      <GridBox 
        v-for="box in gridStore.boxes" 
        :key="box.id" 
        :box="box" 
        :gridSize="{ columns, rows }"
        @remove="removeBox(box.id)"
      />

      <!-- Preview Box -->
      <div v-if="previewBox" :style="previewBoxStyle" class="preview-box"></div>
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

const gridContainer = ref(null)

const isDrawing = ref(false)
const startX = ref(0)
const startY = ref(0)
const previewBox = ref(null)

const gridContainerStyle = computed(() => ({
  width: '100%',
  paddingTop: `${(rows.value / columns.value) * 100}%`,
  backgroundColor: '#f9f9f9'
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

  const width = Math.abs(currentX - startX.value)
  const height = Math.abs(currentY - startY.value)

  previewBox.value = {
    startX: Math.min(startX.value, currentX),
    startY: Math.min(startY.value, currentY),
    width,
    height
  }
}

function finishDrawing() {
  if (!isDrawing.value) return

  isDrawing.value = false
  if (previewBox.value && previewBox.value.width > 0 && previewBox.value.height > 0) {
    gridStore.addBox({
      ...previewBox.value,
      id: Date.now(),
    })
    previewBox.value = null
  }
}

function clearGrid() {
  gridStore.clear()
}

function removeBox(id) {
  gridStore.removeBox(id)
}

function undo() {
  gridStore.undo()
}

function updateGridSize() {
  gridStore.setGridSize({ columns: columns.value, rows: rows.value })
}

onMounted(() => {
  window.addEventListener('mouseup', finishDrawing)
  updateGridSize()
})

onUnmounted(() => {
  window.removeEventListener('mouseup', finishDrawing)
})

watch([columns, rows], updateGridSize)
</script>

<style scoped>
.grid-container {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.grid-line {
  position: absolute;
  background-color: #e0e0e0;
}

.grid-line.vertical {
  width: 1px;
  height: 100%;
}

.grid-line.horizontal {
  height: 1px;
  width: 100%;
}

.preview-box {
  position: absolute;
  border: 2px dashed #3B82F6;
  background-color: rgba(59, 130, 246, 0.2);
}
</style>