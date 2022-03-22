import { Animation, easingSet, Parallel, Sequence, Base } from "@ghom/entity-p5"

const HISTORY_LENGTH = 100

export class Cursor extends Base {
  x = 0
  y = 0
  diameter = 15

  public history: [x: number, y: number][] = []

  onUpdate() {
    this.history.push([this.x, this.y])
    this.x = mouseX
    this.y = mouseY
    while (this.history.length > HISTORY_LENGTH) this.history.shift()
    this.draw()
  }

  draw() {
    let last = this.history[0]
    for (const pos of this.history) {
      const index = this.history.indexOf(pos)
      stroke(floor(map(index, this.history.length, 0, 255, 0)))
      strokeWeight(floor(map(index, this.history.length, 0, this.diameter, 0)))
      line(...last, ...pos)
      last = pos
    }
  }

  onMouseReleased() {
    let x = mouseX
    let y = mouseY

    this.addChild(
      new Animation({
        from: 0,
        to: this.diameter * 5,
        duration: 200,
        easing: easingSet.easeOutQuart,
        onUpdate: (value) => {
          noFill()
          stroke(255, ((this.diameter * 5 - value) / (this.diameter * 5)) * 255)
          strokeWeight(this.diameter / 4)
          circle(x, y, value)
        },
      })
    )
  }
}
