import { game } from "./game"
import { Balloon } from "./balloon"
import { Entity } from "entity-p5"

export class Balloons extends Entity {
  constructor(private count: number) {
    super()
    game.addChild(this)
  }

  onSetup() {
    for (let i = 0; i < this.count; i++) {
      this.addChild(new Balloon())
    }
  }
}
