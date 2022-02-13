import { Balloon } from "./balloon"
import { Entity } from "../lib/entity"

export class Balloons extends Entity {
  constructor(private count: number) {
    super()
    Balloons.root.addChild(this)
  }

  onSetup() {
    for (let i = 0; i < this.count; i++) {
      this.addChild(new Balloon())
    }
  }
}
