import {
  Circle,
  Animation,
  easingSet,
  Parallel,
  Sequence,
} from "@ghom/entity-p5"

const HISTORY_LENGTH = 100

export class Cursor extends Circle {
  public history: [x: number, y: number][] = []

  constructor() {
    super(0, 0, 15)
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

  onMouseReleased() {
    const stroke = {
      color: color(255),
      weight: this.diameter / 4,
    }
    const halo = new Circle(mouseX, mouseY, 0, {
      fill: false,
      stroke,
    })

    this.addChild(
      new Animation({
        from: 0,
        to: this.diameter * 5,
        duration: 200,
        easing: easingSet.easeOutQuart,
        onSetup: () => this.addChild(halo),
        onUpdate: (value) => {
          halo.diameter = value
          stroke.color = color(
            255,
            ((this.diameter * 5 - value) / (this.diameter * 5)) * 255
          )
        },
        onTeardown: () => this.removeChild(halo),
      })
    )
  }
}
