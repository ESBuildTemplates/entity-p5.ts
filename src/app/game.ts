import { Entity } from "@ghom/entity-p5"

export class Game extends Entity {
  constructor() {
    super()
  }

  score: number
}

export const game = new Game()
