import { Circle } from "../lib/shape"
import { game } from "./game"

export class Balloon extends Circle {
  constructor() {
    super(random(0, width), random(0, height), random(40, 60), {
      fill: color(random(100, 200), random(100, 200), random(100, 200)),
      stroke: false,
    })
  }

  onUpdate() {
    if (this.isHovered) {
      this.settings.stroke = {
        color: color(255),
        weight: 5,
      }
    } else {
      this.settings.stroke = false
    }
  }

  onTeardown() {
    game.score++
  }

  onMouseReleased() {
    if (this.isHovered) {
      if (this.parent.children.length > 1)
        this.parent.stopTransmission("mouseReleased")

      this.parent.addChild(new Balloon())
      this.teardown()
    }
  }
}
