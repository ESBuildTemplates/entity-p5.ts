import * as entity from "../lib/entity"
import * as balloon from "./balloon"

export class Balloons extends entity.Entity {
  constructor(private count: number) {
    super()
    Balloons.root.addChild(this)
  }

  onSetup() {
    for (let i = 0; i < this.count; i++) {
      this.addChild(new balloon.Balloon())
    }
  }
}

export const balloons = new Balloons(1)
