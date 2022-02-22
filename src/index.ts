/// @ts-check
/// <reference path="../node_modules/@types/p5/global.d.ts" />

import { game } from "./app/game"
import { Cursor } from "./app/cursor"
import { Balloons } from "./app/balloons"

document.addEventListener("contextmenu", (event) => event.preventDefault())

export function setup() {
  createCanvas(
    Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  )

  game.addChild(new Balloons(1))
  game.addChild(new Cursor())

  game.setup()
}

export function draw() {
  if (!game.isSetup) {
    frameRate(0)
    return
  }

  background(20)

  game.draw()
}

export function update() {
  if (game.isSetup) game.update(true)
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
