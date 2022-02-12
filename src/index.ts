/// @ts-check
/// <reference path="../node_modules/@types/p5/global.d.ts" />

import * as entity from "./entity"

import "./cursor"
import "./balloon"

//const SKIPPED_FRAMES = 2

document.addEventListener("contextmenu", (event) => event.preventDefault())

export function setup() {
  createCanvas(
    Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  )

  entity.Entity.root._setup()
}

//let frameIndex = 0

export function draw() {
  //frameIndex++

  background(20)

  entity.Entity.root._draw()
  entity.Entity.root._update()
  //if (SKIPPED_FRAMES % frameIndex) entity.rootEntity.update()
}

// todo: add framerate limit setting (using Data.now())
// fixme: not called on update
// function tick() {
//   entity.rootEntity.update()
//
//   requestAnimationFrame(tick)
// }

export function keyPressed() {}
export function keyReleased() {}
export function mousePressed() {
  entity.Entity.root._mousePressed()
}
export function mouseReleased() {
  entity.Entity.root._mouseReleased()
}
