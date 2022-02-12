var app = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __export = (target, all) => {
    __markAsModule(target);
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    draw: () => draw,
    keyPressed: () => keyPressed,
    keyReleased: () => keyReleased,
    mousePressed: () => mousePressed,
    mouseReleased: () => mouseReleased,
    setup: () => setup
  });

  // src/entity.ts
  var Entity = class {
    constructor(data) {
      this.data = data;
      this._isSetup = false;
      this.children = new Set();
      this.listeners = [];
    }
    get isSetup() {
      return this._isSetup;
    }
    setup() {
      if (this.isSetup)
        throw new Error("Entity is already setup");
      this.childrenCalling("setup");
      this._isSetup = true;
    }
    draw() {
      if (this.isSetup)
        this.childrenCalling("draw");
    }
    update() {
      if (this.isSetup)
        this.childrenCalling("update");
    }
    teardown() {
      if (!this.isSetup)
        throw new Error("Entity must be setup before");
      if (this.parent)
        this.parent.children.delete(this);
      this.childrenCalling("teardown");
      this._isSetup = false;
    }
    mouseReleased() {
      this.childrenCalling("mouseReleased");
    }
    mousePressed() {
      this.childrenCalling("mousePressed");
    }
    on(listener) {
      this.listeners.push(listener);
    }
    addChild(...children) {
      for (const child of children) {
        child.parent = this;
        this.children.add(child);
      }
    }
    childrenCalling(name) {
      for (const listener of this.getListenersByName(name)) {
        listener.callback(this.data);
      }
      for (const child of this.children)
        child[name]();
    }
    getListenersByName(name) {
      return this.listeners.filter((listener) => {
        return listener.name === name;
      });
    }
  };
  var rootEntity = new Entity(void 0);

  // src/cursor.ts
  var TAIL_LENGTH = 100;
  var CURSOR_RADIUS = 15;
  var cursor = new Entity([]);
  cursor.on({
    name: "update",
    callback: (oldPos) => {
      oldPos.push({
        x: mouseX,
        y: mouseY
      });
      while (oldPos.length > TAIL_LENGTH)
        oldPos.shift();
    }
  });
  cursor.on({
    name: "draw",
    callback: (oldPos) => {
      let lastPos = oldPos[0];
      for (const pos of oldPos) {
        const index = oldPos.indexOf(pos);
        stroke(floor(map(index, oldPos.length, 0, 255, 0)));
        strokeWeight(floor(map(index, oldPos.length, 0, CURSOR_RADIUS / 2, 0)));
        line(lastPos.x, lastPos.y, pos.x, pos.y);
        lastPos = pos;
      }
      fill(255);
      noStroke();
      circle(mouseX, mouseY, CURSOR_RADIUS);
    }
  });
  rootEntity.addChild(cursor);

  // src/hitbox.ts
  var HitBox = class extends Entity {
    constructor(data) {
      super(__spreadValues({
        position: null,
        size: null
      }, data));
      this.on({
        name: "setup",
        callback: (data2) => {
          data2.position = createVector();
          data2.size = createVector();
        }
      });
    }
    get x() {
      return this.data.position.x;
    }
    get y() {
      return this.data.position.y;
    }
    get width() {
      return this.data.size.x;
    }
    get height() {
      return this.data.size.y;
    }
    isHovered() {
      return mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height;
    }
  };

  // src/game.ts
  var context = {
    score: 0
  };

  // src/balloon.ts
  var BALLOON_COUNT = 5;
  var Balloon = class extends HitBox {
    constructor() {
      super({
        color: null
      });
      this.on({
        name: "setup",
        callback: (data) => {
          data.color = color(random(100, 200), random(100, 200), random(100, 200));
          data.position = {
            x: random(0, width),
            y: random(0, height)
          };
          const radius = random(40, 60);
          data.size = {
            x: radius,
            y: radius
          };
        }
      });
      this.on({
        name: "mouseReleased",
        callback: () => {
          if (this.isHovered()) {
            this.teardown();
            const newBalloon = new Balloon();
            balloons.add(newBalloon);
            rootEntity.addChild(newBalloon);
            context.score++;
          }
        }
      });
      this.on({
        name: "draw",
        callback: (data) => {
          if (this.isHovered()) {
            stroke(255);
          } else {
            noStroke();
          }
          fill(data.color);
          circle(this.x, this.y, this.data.size.x);
        }
      });
      this.on({
        name: "teardown",
        callback: (data) => {
          balloons.delete(this);
        }
      });
    }
  };
  var balloons = new Set();
  for (let i = 0; i < BALLOON_COUNT; i++) {
    balloons.add(new Balloon());
  }
  rootEntity.addChild(...balloons);

  // src/index.ts
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  function setup() {
    createCanvas(Math.max(document.documentElement.clientWidth, window.innerWidth || 0), Math.max(document.documentElement.clientHeight, window.innerHeight || 0));
    rootEntity.setup();
  }
  function draw() {
    background(20);
    rootEntity.draw();
    rootEntity.update();
  }
  function keyPressed() {
  }
  function keyReleased() {
  }
  function mousePressed() {
    rootEntity.mousePressed();
  }
  function mouseReleased() {
    rootEntity.mouseReleased();
  }
  return src_exports;
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2luZGV4LnRzIiwgInNyYy9lbnRpdHkudHMiLCAic3JjL2N1cnNvci50cyIsICJzcmMvaGl0Ym94LnRzIiwgInNyYy9nYW1lLnRzIiwgInNyYy9iYWxsb29uLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLy8gQHRzLWNoZWNrXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL0B0eXBlcy9wNS9nbG9iYWwuZC50c1wiIC8+XG5cbmltcG9ydCAqIGFzIGVudGl0eSBmcm9tIFwiLi9lbnRpdHlcIlxuXG5pbXBvcnQgXCIuL2N1cnNvclwiXG5pbXBvcnQgXCIuL2JhbGxvb25cIlxuXG4vL2NvbnN0IFNLSVBQRURfRlJBTUVTID0gMlxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgKGV2ZW50KSA9PiBldmVudC5wcmV2ZW50RGVmYXVsdCgpKVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0dXAoKSB7XG4gIGNyZWF0ZUNhbnZhcyhcbiAgICBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsIHdpbmRvdy5pbm5lcldpZHRoIHx8IDApLFxuICAgIE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKVxuICApXG5cbiAgZW50aXR5LnJvb3RFbnRpdHkuc2V0dXAoKVxufVxuXG4vL2xldCBmcmFtZUluZGV4ID0gMFxuXG5leHBvcnQgZnVuY3Rpb24gZHJhdygpIHtcbiAgLy9mcmFtZUluZGV4KytcblxuICBiYWNrZ3JvdW5kKDIwKVxuXG4gIGVudGl0eS5yb290RW50aXR5LmRyYXcoKVxuICBlbnRpdHkucm9vdEVudGl0eS51cGRhdGUoKVxuICAvL2lmIChTS0lQUEVEX0ZSQU1FUyAlIGZyYW1lSW5kZXgpIGVudGl0eS5yb290RW50aXR5LnVwZGF0ZSgpXG59XG5cbi8vIHRvZG86IGFkZCBmcmFtZXJhdGUgbGltaXQgc2V0dGluZyAodXNpbmcgRGF0YS5ub3coKSlcbi8vIGZpeG1lOiBub3QgY2FsbGVkIG9uIHVwZGF0ZVxuLy8gZnVuY3Rpb24gdGljaygpIHtcbi8vICAgZW50aXR5LnJvb3RFbnRpdHkudXBkYXRlKClcbi8vXG4vLyAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKVxuLy8gfVxuXG5leHBvcnQgZnVuY3Rpb24ga2V5UHJlc3NlZCgpIHt9XG5leHBvcnQgZnVuY3Rpb24ga2V5UmVsZWFzZWQoKSB7fVxuZXhwb3J0IGZ1bmN0aW9uIG1vdXNlUHJlc3NlZCgpIHtcbiAgZW50aXR5LnJvb3RFbnRpdHkubW91c2VQcmVzc2VkKClcbn1cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZVJlbGVhc2VkKCkge1xuICBlbnRpdHkucm9vdEVudGl0eS5tb3VzZVJlbGVhc2VkKClcbn1cbiIsICJleHBvcnQgdHlwZSBFbnRpdHlFdmVudE5hbWU8RGF0YSBleHRlbmRzIGFueT4gPSBrZXlvZiBFbnRpdHlFdmVudHM8RGF0YT5cblxuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlMaXN0ZW5lcjxcbiAgRGF0YSBleHRlbmRzIGFueSxcbiAgTmFtZSBleHRlbmRzIEVudGl0eUV2ZW50TmFtZTxEYXRhPlxuPiB7XG4gIG5hbWU6IE5hbWVcbiAgY2FsbGJhY2s6IEVudGl0eUxpc3RlbmVyQ2FsbGJhY2s8RGF0YSwgTmFtZT5cbn1cblxuZXhwb3J0IHR5cGUgRW50aXR5TGlzdGVuZXJDYWxsYmFjazxcbiAgRGF0YSBleHRlbmRzIGFueSxcbiAgTmFtZSBleHRlbmRzIEVudGl0eUV2ZW50TmFtZTxEYXRhPlxuPiA9IEVudGl0eUV2ZW50czxEYXRhPltOYW1lXVxuXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eUV2ZW50czxEYXRhIGV4dGVuZHMgYW55PiB7XG4gIHNldHVwOiAoZGF0YTogRGF0YSkgPT4gdW5rbm93blxuICBkcmF3OiAoZGF0YTogRGF0YSkgPT4gdW5rbm93blxuICB1cGRhdGU6IChkYXRhOiBEYXRhKSA9PiB1bmtub3duXG4gIHRlYXJkb3duOiAoZGF0YTogRGF0YSkgPT4gdW5rbm93blxuICBtb3VzZVByZXNzZWQ6IChkYXRhOiBEYXRhKSA9PiB1bmtub3duXG4gIG1vdXNlUmVsZWFzZWQ6IChkYXRhOiBEYXRhKSA9PiB1bmtub3duXG59XG5cbmV4cG9ydCBjbGFzcyBFbnRpdHk8RGF0YSBleHRlbmRzIGFueT4ge1xuICBwcml2YXRlIF9pc1NldHVwID0gZmFsc2VcbiAgcHJpdmF0ZSBwYXJlbnQ/OiBFbnRpdHk8YW55PlxuICBwcml2YXRlIGNoaWxkcmVuID0gbmV3IFNldDxFbnRpdHk8YW55Pj4oKVxuICBwcml2YXRlIGxpc3RlbmVyczogRW50aXR5TGlzdGVuZXI8RGF0YSwgRW50aXR5RXZlbnROYW1lPERhdGE+PltdID0gW11cblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZGF0YTogRGF0YSkge31cblxuICBnZXQgaXNTZXR1cCgpIHtcbiAgICByZXR1cm4gdGhpcy5faXNTZXR1cFxuICB9XG5cbiAgc2V0dXAoKSB7XG4gICAgaWYgKHRoaXMuaXNTZXR1cCkgdGhyb3cgbmV3IEVycm9yKFwiRW50aXR5IGlzIGFscmVhZHkgc2V0dXBcIilcbiAgICB0aGlzLmNoaWxkcmVuQ2FsbGluZyhcInNldHVwXCIpXG4gICAgdGhpcy5faXNTZXR1cCA9IHRydWVcbiAgfVxuXG4gIGRyYXcoKSB7XG4gICAgaWYgKHRoaXMuaXNTZXR1cCkgdGhpcy5jaGlsZHJlbkNhbGxpbmcoXCJkcmF3XCIpXG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgaWYgKHRoaXMuaXNTZXR1cCkgdGhpcy5jaGlsZHJlbkNhbGxpbmcoXCJ1cGRhdGVcIilcbiAgfVxuXG4gIHRlYXJkb3duKCkge1xuICAgIGlmICghdGhpcy5pc1NldHVwKSB0aHJvdyBuZXcgRXJyb3IoXCJFbnRpdHkgbXVzdCBiZSBzZXR1cCBiZWZvcmVcIilcbiAgICBpZiAodGhpcy5wYXJlbnQpIHRoaXMucGFyZW50LmNoaWxkcmVuLmRlbGV0ZSh0aGlzKVxuICAgIHRoaXMuY2hpbGRyZW5DYWxsaW5nKFwidGVhcmRvd25cIilcbiAgICB0aGlzLl9pc1NldHVwID0gZmFsc2VcbiAgfVxuXG4gIG1vdXNlUmVsZWFzZWQoKSB7XG4gICAgdGhpcy5jaGlsZHJlbkNhbGxpbmcoXCJtb3VzZVJlbGVhc2VkXCIpXG4gIH1cblxuICBtb3VzZVByZXNzZWQoKSB7XG4gICAgdGhpcy5jaGlsZHJlbkNhbGxpbmcoXCJtb3VzZVByZXNzZWRcIilcbiAgfVxuXG4gIG9uPE5hbWUgZXh0ZW5kcyBFbnRpdHlFdmVudE5hbWU8RGF0YT4+KGxpc3RlbmVyOiBFbnRpdHlMaXN0ZW5lcjxEYXRhLCBOYW1lPikge1xuICAgIHRoaXMubGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpXG4gIH1cblxuICBhZGRDaGlsZCguLi5jaGlsZHJlbjogRW50aXR5PGFueT5bXSkge1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgIGNoaWxkLnBhcmVudCA9IHRoaXNcbiAgICAgIHRoaXMuY2hpbGRyZW4uYWRkKGNoaWxkKVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2hpbGRyZW5DYWxsaW5nKG5hbWU6IEVudGl0eUV2ZW50TmFtZTxEYXRhPikge1xuICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgdGhpcy5nZXRMaXN0ZW5lcnNCeU5hbWUobmFtZSkpIHtcbiAgICAgIGxpc3RlbmVyLmNhbGxiYWNrKHRoaXMuZGF0YSlcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pIGNoaWxkW25hbWVdKClcbiAgfVxuXG4gIHByaXZhdGUgZ2V0TGlzdGVuZXJzQnlOYW1lPE5hbWUgZXh0ZW5kcyBFbnRpdHlFdmVudE5hbWU8RGF0YT4+KG5hbWU6IE5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5saXN0ZW5lcnMuZmlsdGVyKFxuICAgICAgKGxpc3RlbmVyKTogbGlzdGVuZXIgaXMgRW50aXR5TGlzdGVuZXI8RGF0YSwgTmFtZT4gPT4ge1xuICAgICAgICByZXR1cm4gbGlzdGVuZXIubmFtZSA9PT0gbmFtZVxuICAgICAgfVxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgY29uc3Qgcm9vdEVudGl0eSA9IG5ldyBFbnRpdHk8dW5kZWZpbmVkPih1bmRlZmluZWQpXG4iLCAiaW1wb3J0ICogYXMgdmVjdG9yIGZyb20gXCIuL3ZlY3RvclwiXG5pbXBvcnQgKiBhcyBlbnRpdHkgZnJvbSBcIi4vZW50aXR5XCJcblxuY29uc3QgVEFJTF9MRU5HVEggPSAxMDBcbmNvbnN0IENVUlNPUl9SQURJVVMgPSAxNVxuXG5leHBvcnQgY29uc3QgY3Vyc29yID0gbmV3IGVudGl0eS5FbnRpdHk8dmVjdG9yLlZlY3RvcltdPihbXSlcblxuY3Vyc29yLm9uKHtcbiAgbmFtZTogXCJ1cGRhdGVcIixcbiAgY2FsbGJhY2s6IChvbGRQb3MpID0+IHtcbiAgICBvbGRQb3MucHVzaCh7XG4gICAgICB4OiBtb3VzZVgsXG4gICAgICB5OiBtb3VzZVksXG4gICAgfSlcbiAgICB3aGlsZSAob2xkUG9zLmxlbmd0aCA+IFRBSUxfTEVOR1RIKSBvbGRQb3Muc2hpZnQoKVxuICB9LFxufSlcblxuY3Vyc29yLm9uKHtcbiAgbmFtZTogXCJkcmF3XCIsXG4gIGNhbGxiYWNrOiAob2xkUG9zKSA9PiB7XG4gICAgbGV0IGxhc3RQb3MgPSBvbGRQb3NbMF1cbiAgICBmb3IgKGNvbnN0IHBvcyBvZiBvbGRQb3MpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gb2xkUG9zLmluZGV4T2YocG9zKVxuICAgICAgc3Ryb2tlKGZsb29yKG1hcChpbmRleCwgb2xkUG9zLmxlbmd0aCwgMCwgMjU1LCAwKSkpXG4gICAgICBzdHJva2VXZWlnaHQoZmxvb3IobWFwKGluZGV4LCBvbGRQb3MubGVuZ3RoLCAwLCBDVVJTT1JfUkFESVVTIC8gMiwgMCkpKVxuICAgICAgbGluZShsYXN0UG9zLngsIGxhc3RQb3MueSwgcG9zLngsIHBvcy55KVxuICAgICAgbGFzdFBvcyA9IHBvc1xuICAgIH1cbiAgICBmaWxsKDI1NSlcbiAgICBub1N0cm9rZSgpXG4gICAgY2lyY2xlKG1vdXNlWCwgbW91c2VZLCBDVVJTT1JfUkFESVVTKVxuICB9LFxufSlcblxuZW50aXR5LnJvb3RFbnRpdHkuYWRkQ2hpbGQoY3Vyc29yKVxuIiwgImltcG9ydCAqIGFzIGVudGl0eSBmcm9tIFwiLi9lbnRpdHlcIlxuaW1wb3J0ICogYXMgdmVjdG9yIGZyb20gXCIuL3ZlY3RvclwiXG5cbmV4cG9ydCBpbnRlcmZhY2UgSGl0Qm94T3B0aW9ucyB7XG4gIHBvc2l0aW9uOiB2ZWN0b3IuVmVjdG9yXG4gIHNpemU6IHZlY3Rvci5WZWN0b3Jcbn1cblxuZXhwb3J0IGNsYXNzIEhpdEJveDxEYXRhIGV4dGVuZHMgb2JqZWN0PiBleHRlbmRzIGVudGl0eS5FbnRpdHk8XG4gIERhdGEgJiBIaXRCb3hPcHRpb25zXG4+IHtcbiAgY29uc3RydWN0b3IoZGF0YTogRGF0YSkge1xuICAgIHN1cGVyKHtcbiAgICAgIHBvc2l0aW9uOiBudWxsLFxuICAgICAgc2l6ZTogbnVsbCxcbiAgICAgIC4uLmRhdGEsXG4gICAgfSlcblxuICAgIHRoaXMub24oe1xuICAgICAgbmFtZTogXCJzZXR1cFwiLFxuICAgICAgY2FsbGJhY2s6IChkYXRhKSA9PiB7XG4gICAgICAgIGRhdGEucG9zaXRpb24gPSBjcmVhdGVWZWN0b3IoKVxuICAgICAgICBkYXRhLnNpemUgPSBjcmVhdGVWZWN0b3IoKVxuICAgICAgfSxcbiAgICB9KVxuICB9XG5cbiAgZ2V0IHgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhLnBvc2l0aW9uLnhcbiAgfVxuXG4gIGdldCB5KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YS5wb3NpdGlvbi55XG4gIH1cblxuICBnZXQgd2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YS5zaXplLnhcbiAgfVxuXG4gIGdldCBoZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YS5zaXplLnlcbiAgfVxuXG4gIGlzSG92ZXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgbW91c2VYID4gdGhpcy54ICYmXG4gICAgICBtb3VzZVggPCB0aGlzLnggKyB0aGlzLndpZHRoICYmXG4gICAgICBtb3VzZVkgPiB0aGlzLnkgJiZcbiAgICAgIG1vdXNlWSA8IHRoaXMueSArIHRoaXMuaGVpZ2h0XG4gICAgKVxuICB9XG59XG4iLCAiZXhwb3J0IGNvbnN0IGNvbnRleHQgPSB7XG4gIHNjb3JlOiAwLFxufVxuIiwgImltcG9ydCAqIGFzIHA1IGZyb20gXCJwNVwiXG5pbXBvcnQgKiBhcyBlbnRpdHkgZnJvbSBcIi4vZW50aXR5XCJcbmltcG9ydCAqIGFzIGhpdGJveCBmcm9tIFwiLi9oaXRib3hcIlxuaW1wb3J0ICogYXMgZ2FtZSBmcm9tIFwiLi9nYW1lXCJcblxuY29uc3QgQkFMTE9PTl9DT1VOVCA9IDVcblxuZXhwb3J0IGNsYXNzIEJhbGxvb24gZXh0ZW5kcyBoaXRib3guSGl0Qm94PHsgY29sb3I6IHA1LkNvbG9yIH0+IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoe1xuICAgICAgY29sb3I6IG51bGwsXG4gICAgfSlcblxuICAgIHRoaXMub24oe1xuICAgICAgbmFtZTogXCJzZXR1cFwiLFxuICAgICAgY2FsbGJhY2s6IChkYXRhKSA9PiB7XG4gICAgICAgIGRhdGEuY29sb3IgPSBjb2xvcihyYW5kb20oMTAwLCAyMDApLCByYW5kb20oMTAwLCAyMDApLCByYW5kb20oMTAwLCAyMDApKVxuXG4gICAgICAgIGRhdGEucG9zaXRpb24gPSB7XG4gICAgICAgICAgeDogcmFuZG9tKDAsIHdpZHRoKSxcbiAgICAgICAgICB5OiByYW5kb20oMCwgaGVpZ2h0KSxcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJhZGl1cyA9IHJhbmRvbSg0MCwgNjApXG5cbiAgICAgICAgZGF0YS5zaXplID0ge1xuICAgICAgICAgIHg6IHJhZGl1cyxcbiAgICAgICAgICB5OiByYWRpdXMsXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSlcblxuICAgIHRoaXMub24oe1xuICAgICAgbmFtZTogXCJtb3VzZVJlbGVhc2VkXCIsXG4gICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pc0hvdmVyZWQoKSkge1xuICAgICAgICAgIHRoaXMudGVhcmRvd24oKVxuICAgICAgICAgIGNvbnN0IG5ld0JhbGxvb24gPSBuZXcgQmFsbG9vbigpXG4gICAgICAgICAgYmFsbG9vbnMuYWRkKG5ld0JhbGxvb24pXG4gICAgICAgICAgZW50aXR5LnJvb3RFbnRpdHkuYWRkQ2hpbGQobmV3QmFsbG9vbilcbiAgICAgICAgICBnYW1lLmNvbnRleHQuc2NvcmUrK1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pXG5cbiAgICB0aGlzLm9uKHtcbiAgICAgIG5hbWU6IFwiZHJhd1wiLFxuICAgICAgY2FsbGJhY2s6IChkYXRhKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmlzSG92ZXJlZCgpKSB7XG4gICAgICAgICAgc3Ryb2tlKDI1NSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBub1N0cm9rZSgpXG4gICAgICAgIH1cbiAgICAgICAgZmlsbChkYXRhLmNvbG9yKVxuICAgICAgICBjaXJjbGUodGhpcy54LCB0aGlzLnksIHRoaXMuZGF0YS5zaXplLngpXG4gICAgICB9LFxuICAgIH0pXG5cbiAgICB0aGlzLm9uKHtcbiAgICAgIG5hbWU6IFwidGVhcmRvd25cIixcbiAgICAgIGNhbGxiYWNrOiAoZGF0YSkgPT4ge1xuICAgICAgICBiYWxsb29ucy5kZWxldGUodGhpcylcbiAgICAgIH0sXG4gICAgfSlcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgYmFsbG9vbnMgPSBuZXcgU2V0PEJhbGxvb24+KClcblxuZm9yIChsZXQgaSA9IDA7IGkgPCBCQUxMT09OX0NPVU5UOyBpKyspIHtcbiAgYmFsbG9vbnMuYWRkKG5ldyBCYWxsb29uKCkpXG59XG5cbmVudGl0eS5yb290RW50aXR5LmFkZENoaWxkKC4uLmJhbGxv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
