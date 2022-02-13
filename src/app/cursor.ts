import { Circle } from "../lib/shape"

const HISTORY_LENGTH = 100

export class Cursor extends Circle {
  public history: [x: number, y: number][] = []

  constructor() {
    super(0, 0, 15)
    Cursor.root.addChild(this)
  }

  onUpdate() {
    this.history.push([this.x, this.y])
    this.x = mouseX
    this.y = mouseY
    while (this.history.length > HISTORY_LENGTH) this.history.shift()
  }

  onDraw() {
    let last = this.history[0]
    for (const pos of this.history) {
      const index = this.history.indexOf(pos)
      stroke(floor(map(index, this.history.length, 0, 255, 0)))
      strokeWeight(floor(map(index, this.history.length, 0, this.diameter, 0)))
      line(...last, ...pos)
      last = pos
    }
  }
}
