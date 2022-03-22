import { Base } from "@ghom/entity-p5"

export class Background extends Base {
  private noiseScale = 0.5

  onUpdate() {
    background(0)
    for (let x = 0; x * 50 < width; x++) {
      for (let y = 0; y * 50 < height; y++) {
        fill(
          noise(
            x * this.noiseScale,
            y * this.noiseScale + this.frameCount / 100
          ) * 100
        )
        noStroke()
        rect(x * 50 + 2, y * 50 + 2, 46, 46, 5)
      }
    }
  }
}
