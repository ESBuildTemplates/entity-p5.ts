/// @ts-check
/// <reference path="../node_modules/@types/p5/global.d.ts" />

import * as entity from "./lib/entity"

import "./app/cursor"
import "./app/balloon"
import "./app/balloons"

document.addEventListener("contextmenu", (event) => event.preventDefault())

export function setup() {
  createCanvas(
    Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  )

  entity.Entity.setup()
  entity.Entity.schema(2)
}

export function draw() {
  background(20)

  entity.Entity.draw()
  entity.Entity.update()
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
  entity.Entity.mousePressed()
}
export function mouseReleased() {
  entity.Entity.mouseReleased()
}

export const root = entity.Entity.root
export const Entity = entity.Entity
