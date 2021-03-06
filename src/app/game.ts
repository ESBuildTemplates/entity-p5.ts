import { Base, Animation } from "@ghom/entity-p5"

export class Game extends Base {
  private _score = 0

  get score() {
    return this._score
  }

  set score(score) {
    if (this._score !== score) {
      const scoreUp = score > this._score

      const baseTextSize = height * 0.05

      this.addChild(
        new Animation({
          from: 0,
          to: 1,
          duration: 100,
          afterUpdate: (value) => {
            noStroke()
            fill(
              scoreUp
                ? color(100, 255, 255, (1 - value) * 255)
                : color(255, 100, 100, (1 - value) * 255)
            )
            textAlign(CENTER, CENTER)
            textSize(baseTextSize * Math.max(1, value + 0.5))
            text(`Score: ${score}`, width / 2, height * 0.1)
          },
        })
      )

      this._score = score
    }
  }

  constructor() {
    super()
  }

  afterUpdate() {
    this.drawScore()
    this.drawSchema()
  }

  drawScore() {
    noStroke()
    fill(170)
    textSize(height * 0.05)
    textAlign(CENTER, CENTER)
    text(`Score: ${this.score}`, width / 2, height * 0.1)
  }

  drawSchema() {
    noStroke()
    fill(90)
    textSize(height * 0.02)
    textAlign(LEFT, TOP)
    text(this.schema(5), 20, 20)
  }
}

export const game = new Game()
