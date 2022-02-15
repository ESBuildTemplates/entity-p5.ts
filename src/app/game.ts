import { Entity, Text, Animation, DrawableSettings } from "@ghom/entity-p5"

export class Game extends Entity {
  private _score = 0

  get score() {
    return this._score
  }

  set score(score) {
    if (this._score !== score) {
      const baseTextSize = height * 0.05

      const options: DrawableSettings = {
        stroke: false,
        fill: color(170),
        textSize: baseTextSize,
        textAlign: {
          x: CENTER,
          y: CENTER,
        },
      }

      const text = new Text(
        `Score: ${score}`,
        width / 2,
        height * 0.1,
        undefined,
        undefined,
        options
      )

      if (this._score < score) {
        this.addChild(
          new Animation({
            from: 0,
            to: 1,
            duration: 20,
            onSetup: () => {
              this.addChild(text)
            },
            onUpdate: (value) => {
              options.textSize = baseTextSize * Math.max(1, value + 0.5)
              options.fill = color(100, 255, 255, (1 - value) * 255)
            },
            onTeardown: () => {
              this.removeChild(text)
            },
          })
        )
      } else if (this._score > score) {
        this.addChild(
          new Animation({
            from: 0,
            to: 1,
            duration: 20,
            onSetup: () => {
              this.addChild(text)
            },
            onUpdate: (value) => {
              options.textSize = baseTextSize * Math.max(1, value + 0.5)
              options.fill = color(255, 100, 100, (1 - value) * 255)
            },
            onTeardown: () => {
              this.removeChild(text)
            },
          })
        )
      }

      this._score = score
    }
  }

  constructor() {
    super()
  }

  onDraw() {
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
