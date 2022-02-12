import * as vector from "./vector"
import * as entity from "./entity"

const TAIL_LENGTH = 100
const CURSOR_RADIUS = 15

export const cursor = new entity.Entity<vector.Vector[]>([])

cursor.on({
  name: "update",
  callback: (oldPos) => {
    oldPos.push({
      x: mouseX,
      y: mouseY,
    })
    while (oldPos.length > TAIL_LENGTH) oldPos.shift()
  },
})

cursor.on({
  name: "draw",
  callback: (oldPos) => {
    let lastPos = oldPos[0]
    for (const pos of oldPos) {
      const index = oldPos.indexOf(pos)
      stroke(floor(map(index, oldPos.length, 0, 255, 0)))
      strokeWeight(floor(map(index, oldPos.length, 0, CURSOR_RADIUS / 2, 0)))
      line(lastPos.x, lastPos.y, pos.x, pos.y)
      lastPos = pos
    }
    fill(255)
    noStroke()
    circle(mouseX, mouseY, CURSOR_RADIUS)
  },
})

entity.rootEntity.addChild(cursor)
