import { Balloon } from "./balloon"
import { Base } from "@ghom/entity-p5"

export class Balloons extends Base {
  constructor(private count: number) {
    super()
  }

  onSetup() {
    for (let i = 0; i < this.count; i++) {
      this.addChild(new Balloon())
    }
  }
}
