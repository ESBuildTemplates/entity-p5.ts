import * as hitbox from "./hitbox"

const HISTORY_LENGTH = 100

class Cursor extends hitbox.HitEllipse {
  public history: [x: number, y: number][] = []

  constructor() {
    super(0, 0, 15)
  }

  update() {
    this.history.push([this.x, this.y])
    this.x = mouseX
    this.y = mouseY
    while (this.history.length > HISTORY_LENGTH) this.history.shift()
  }

  draw() {
    let last = this.history[0]
    for (const pos of this.history) {
      const index = this.history.indexOf(pos)
      stroke(floor(map(index, this.history.length, 0, 255, 0)))
      strokeWeight(
        floor(map(index, this.history.length, 0, this.diameter / 2, 0))
      )
      line(...last, ...pos)
      last = pos
    }
    fill(255)
    noStroke()
    circle(mouseX, mouseY, this.diameter)
  }
}

export const cursor = new Cursor()
