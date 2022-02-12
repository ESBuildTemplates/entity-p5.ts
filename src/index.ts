/// @ts-check
/// <reference path="../node_modules/@types/p5/global.d.ts" />

import * as entity from "./entity"
import * as vector from "./vector"

document.addEventListener("contextmenu", (event) => event.preventDefault())

export function setup() {
  createCanvas(
    Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  )

  entity.rootEntity.addChild(new entity.Entity<vector.Vector[]>([]))
  entity.rootEntity.setup()
}

export function draw() {
  background(20)
  textAlign(CENTER, CENTER)
  textSize(height / 10)
  fill(200)

  entity.rootEntity.draw()
}

// todo: add framerate limit setting (using Data.now())
function tick() {
  entity.rootEntity.update()

  requestAnimationFrame(tick)
}

export function keyPressed() {}
export function keyReleased() {}
