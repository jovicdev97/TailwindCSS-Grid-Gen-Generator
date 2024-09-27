import { defineStore } from 'pinia'

export const useGridStore = defineStore('grid', {
  state: () => ({
    boxes: [],
    history: [],
    gridSize: { columns: 12, rows: 6 },
  }),
  actions: {
    addBox(box) {
      this.saveState()
      this.boxes.push(box)
    },
    removeBox(id) {
      this.saveState()
      this.boxes = this.boxes.filter(box => box.id !== id)
    },
    clear() {
      this.saveState()
      this.boxes = []
    },
    setGridSize(size) {
      this.gridSize = size
    },
    saveState() {
      this.history.push(JSON.stringify(this.boxes))
      if (this.history.length > 20) this.history.shift()
    },
    undo() {
      if (this.history.length > 0) {
        this.boxes = JSON.parse(this.history.pop())
      }
    },
    export() {
      const gridClasses = `grid grid-cols-${this.gridSize.columns} grid-rows-${this.gridSize.rows} gap-4 border-2`
      return `
<div class="${gridClasses} w-full h-full">
  ${this.boxes.map(box => `  <div class="${this.generateTailwindClasses(box)}">
    <!-- Inhalt hier -->
  </div>`).join('\n')}
</div>`.trim()
    },
    generateTailwindClasses(box) {
      const colSpan = Math.round(box.width * this.gridSize.columns)
      const rowSpan = Math.round(box.height * this.gridSize.rows)
      const colStart = Math.round(box.startX * this.gridSize.columns) + 1
      const rowStart = Math.round(box.startY * this.gridSize.rows) + 1

      return `col-span-${colSpan} row-span-${rowSpan} col-start-${colStart} row-start-${rowStart} border-2`
    }
  }
})