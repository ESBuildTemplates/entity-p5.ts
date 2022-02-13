import * as p5 from "p5"
import * as hitbox from "./hitbox"
import * as game from "./game"

export class Balloon extends hitbox.HitEllipse {
  public color: p5.Color

  onSetup() {
    this.color = color(random(100, 200), random(100, 200), random(100, 200))
    this.x = random(0, width)
    this.y = random(0, height)
    this.diameter = random(40, 60)
  }

  onDraw() {
    if (this.isHovered) {
      stroke(255)
    } else {
      noStroke()
    }
    fill(this.color)
    circle(...this.center, this.diameter)
  }

  onTeardown() {
    game.context.score++
    if (this.parent.children.length > 2)
      this.parent.stopTransmission("mouseReleased")
  }

  onMouseReleased() {
    if (this.isHovered) {
      this.parent.addChild(new Balloon())
      this.teardown()
    }
  }
}
