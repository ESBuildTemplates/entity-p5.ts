import * as p5 from "p5"
import * as entity from "./entity"
import * as hitbox from "./hitbox"
import * as game from "./game"

const BALLOON_COUNT = 5

export class Balloon extends hitbox.HitBox<{ color: p5.Color }> {
  constructor() {
    super({
      color: null,
    })

    this.on({
      name: "setup",
      callback: (data) => {
        data.color = color(random(100, 200), random(100, 200), random(100, 200))

        data.position = {
          x: random(0, width),
          y: random(0, height),
        }

        const radius = random(40, 60)

        data.size = {
          x: radius,
          y: radius,
        }
      },
    })

    this.on({
      name: "mouseReleased",
      callback: () => {
        if (this.isHovered()) {
          this.teardown()
          const newBalloon = new Balloon()
          balloons.add(newBalloon)
          entity.rootEntity.addChild(newBalloon)
          game.context.score++
        }
      },
    })

    this.on({
      name: "draw",
      callback: (data) => {
        if (this.isHovered()) {
          stroke(255)
        } else {
          noStroke()
        }
        fill(data.color)
        circle(this.x, this.y, this.data.size.x)
      },
    })

    this.on({
      name: "teardown",
      callback: (data) => {
        balloons.delete(this)
      },
    })
  }
}

export const balloons = new Set<Balloon>()

for (let i = 0; i < BALLOON_COUNT; i++) {
  balloons.add(new Balloon())
}

entity.rootEntity.addChild(...balloons)
