/// @ts-check
/// <reference path="../node_modules/@types/p5/global.d.ts" />

import { game } from "./app/game"
import { Cursor } from "./app/cursor"
import { Balloons } from "./app/balloons"
import { Background } from "./app/background"

document.addEventListener("contextmenu", (event) => event.preventDefault())

const meter = new FPSMeter(undefined, {
  right: "3px",
  left: "inherit",
  graph: 1,
})

export function setup() {
  createCanvas(
    Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  )

  game.addChild(new Background())
  game.addChild(new Balloons(3))
  game.addChild(new Cursor())

  game.setup()
}

export function update() {
  meter.tickStart()
  if (game.isSetup) {
    game.update(true)
  } else {
    frameRate(0)
    return
  }
  meter.tick()
}

export function keyPressed() {}
export function keyReleased() {}
export function mousePressed() {
  game.mousePressed()
}
export function mouseReleased() {
  game.mouseReleased()
}

/**
 * debug imports (accessible from frontend console with `app.root`)
 */
export const root = game
