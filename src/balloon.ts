import * as p5 from "p5"
import * as hitbox from "./hitbox"
import * as game from "./game"

const BALLOON_COUNT = 5

export class Balloon extends hitbox.HitEllipse {
  public color: p5.Color

  setup() {
    this.color = color(random(100, 200), random(100, 200), random(100, 200))
    this.x = random(0, width)
    this.y = random(0, height)
    this.diameter = random(40, 60)
  }

  draw() {
    if (this.isHovered) {
      stroke(255)
    } else {
      noStroke()
    }
    fill(this.color)
    circle(...this.center, this.diameter)
  }

  teardown() {
    balloons.delete(this)
  }

  mousePressed() {
    if (this.isHovered) {
      this.teardown()
      const newBalloon = new Balloon()
      balloons.add(newBalloon)
      game.context.score++
    }
  }
}

export const balloons = new Set<Balloon>()

for (let i = 0; i < BALLOON_COUNT; i++) {
  balloons.add(new Balloon())
}
