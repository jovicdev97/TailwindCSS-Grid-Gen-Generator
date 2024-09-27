import { defineStore } from 'pinia'

export const useGridStore = defineStore('grid', {
  state: () => ({
    boxes: [],
    history: [],
    gridSize: { columns: 12, rows: 6 },
    cellSize: { width: 80, height: 60 },
    viewportSize: { width: 1920, height: 1080 }
  }),
  actions: {
    addBox(box) {
      this.saveState()
      this.boxes.push(box)
    },
    removeBox(index) {
      this.saveState()
      this.boxes.splice(index, 1)
    },
    clear() {
      this.saveState()
      this.boxes = []
    },
    setGridSize(size) {
      this.saveState()
      this.gridSize = size
    },
    setCellSize(size) {
      this.saveState()
      this.cellSize = size
    },
    setViewportSize(size) {
      this.saveState()
      this.viewportSize = size
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
      const classes = `grid grid-cols-${this.gridSize.columns} grid-rows-${this.gridSize.rows} gap-4 border-2`
      return `
        <div class="${classes}">
          ${this.boxes.map((box, index) => `
            <div class="${this.generateTailwindClasses(box)}">
              Box ${index + 1}
            </div>
          `).join('')}
        </div>
      `
    },
    generateTailwindClasses(box) {
      const colSpan = Math.ceil(box.width / this.cellSize.width)
      const rowSpan = Math.ceil(box.height / this.cellSize.height)
      const colStart = Math.floor(box.startX / this.cellSize.width) + 1
      const rowStart = Math.floor(box.startY / this.cellSize.height) + 1

      return `col-span-${colSpan} row-span-${rowSpan} col-start-${colStart} row-start-${rowStart} border-2`
    }
  }
})