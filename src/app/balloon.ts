import { Base } from "@ghom/entity-p5"
import { game } from "./game"

export class Balloon extends Base {
  color = color(random(100, 200), random(100, 200), random(100, 200))
  x = random(0, width)
  y = random(0, height)
  diameter = random(40, 60)

  onUpdate() {
    fill(this.color)
    if (this.isHovered) {
      stroke(255)
      strokeWeight(5)
    } else noStroke()
    circle(this.x, this.y, this.diameter)
  }

  onTeardown() {
    game.score++
  }

  onMousePressed() {
    if (this.isHovered) {
      if (this.parent.children.length > 1)
        this.parent.stopTransmission("mousePressed")

      this.parent.addChild(new Balloon())
      this.teardown()
    }
  }

  get isHovered() {
    return dist(mouseX, mouseY, this.x, this.y) < this.diameter / 2
  }
}
