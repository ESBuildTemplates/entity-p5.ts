import { Balloon } from "./balloon"
import { Entity } from "@ghom/entity-p5"

export class Balloons extends Entity {
  constructor(private count: number) {
    super()
  }

  onSetup() {
    for (let i = 0; i < this.count; i++) {
      this.addChild(new Balloon())
    }
  }
}
