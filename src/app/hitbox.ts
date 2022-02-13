import * as entity from "../lib/entity"

export class HitBox extends entity.Entity {
  constructor(public x = 0, public y = 0, public width = 0, public height = 0) {
    super()
  }

  get center(): [x: number, y: number] {
    return [this.x + this.width / 2, this.y + this.height / 2]
  }

  get isHovered(): boolean {
    return (
      mouseX > this.x &&
      mouseX < this.x + this.width &&
      mouseY > this.y &&
      mouseY < this.y + this.height
    )
  }
}

export class HitEllipse extends HitBox {
  constructor(x = 0, y = 0, public diameter = 0) {
    super(x, y, diameter, diameter)
  }

  get center(): [x: number, y: number] {
    return [this.x, this.y]
  }

  get isHovered(): boolean {
    return dist(mouseX, mouseY, this.x, this.y) < this.diameter / 2
  }
}
