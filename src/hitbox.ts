import * as entity from "./entity"
import * as vector from "./vector"

export interface HitBoxOptions {
  position: vector.Vector
  size: vector.Vector
}

export class HitBox<Data extends object> extends entity.Entity<
  Data & HitBoxOptions
> {
  constructor(data: Data) {
    super({
      position: null,
      size: null,
      ...data,
    })

    this.on({
      name: "setup",
      callback: (data) => {
        data.position = createVector()
        data.size = createVector()
      },
    })
  }

  get x(): number {
    return this.data.position.x
  }

  get y(): number {
    return this.data.position.y
  }

  get width() {
    return this.data.size.x
  }

  get height() {
    return this.data.size.y
  }

  isHovered(): boolean {
    return (
      mouseX > this.x &&
      mouseX < this.x + this.width &&
      mouseY > this.y &&
      mouseY < this.y + this.height
    )
  }
}
