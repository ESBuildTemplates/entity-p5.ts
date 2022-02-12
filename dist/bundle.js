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
      this.zIndex = 0;
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
        if (this.isSetup)
          child.setup();
      }
    }
    childrenCalling(name) {
      for (const listener of this.getListenersByName(name)) {
        listener.callback(this.data);
      }
      for (const child of [...this.children].sort((a, b) => a.zIndex - b.zIndex))
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
      super({ color: null });
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
          circle(this.x + this.width / 2, this.y + this.height / 2, this.width);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2luZGV4LnRzIiwgInNyYy9lbnRpdHkudHMiLCAic3JjL2N1cnNvci50cyIsICJzcmMvaGl0Ym94LnRzIiwgInNyYy9nYW1lLnRzIiwgInNyYy9iYWxsb29uLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLy8gQHRzLWNoZWNrXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL0B0eXBlcy9wNS9nbG9iYWwuZC50c1wiIC8+XG5cbmltcG9ydCAqIGFzIGVudGl0eSBmcm9tIFwiLi9lbnRpdHlcIlxuXG5pbXBvcnQgXCIuL2N1cnNvclwiXG5pbXBvcnQgXCIuL2JhbGxvb25cIlxuXG4vL2NvbnN0IFNLSVBQRURfRlJBTUVTID0gMlxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgKGV2ZW50KSA9PiBldmVudC5wcmV2ZW50RGVmYXVsdCgpKVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0dXAoKSB7XG4gIGNyZWF0ZUNhbnZhcyhcbiAgICBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsIHdpbmRvdy5pbm5lcldpZHRoIHx8IDApLFxuICAgIE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKVxuICApXG5cbiAgZW50aXR5LnJvb3RFbnRpdHkuc2V0dXAoKVxufVxuXG4vL2xldCBmcmFtZUluZGV4ID0gMFxuXG5leHBvcnQgZnVuY3Rpb24gZHJhdygpIHtcbiAgLy9mcmFtZUluZGV4KytcblxuICBiYWNrZ3JvdW5kKDIwKVxuXG4gIGVudGl0eS5yb290RW50aXR5LmRyYXcoKVxuICBlbnRpdHkucm9vdEVudGl0eS51cGRhdGUoKVxuICAvL2lmIChTS0lQUEVEX0ZSQU1FUyAlIGZyYW1lSW5kZXgpIGVudGl0eS5yb290RW50aXR5LnVwZGF0ZSgpXG59XG5cbi8vIHRvZG86IGFkZCBmcmFtZXJhdGUgbGltaXQgc2V0dGluZyAodXNpbmcgRGF0YS5ub3coKSlcbi8vIGZpeG1lOiBub3QgY2FsbGVkIG9uIHVwZGF0ZVxuLy8gZnVuY3Rpb24gdGljaygpIHtcbi8vICAgZW50aXR5LnJvb3RFbnRpdHkudXBkYXRlKClcbi8vXG4vLyAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKVxuLy8gfVxuXG5leHBvcnQgZnVuY3Rpb24ga2V5UHJlc3NlZCgpIHt9XG5leHBvcnQgZnVuY3Rpb24ga2V5UmVsZWFzZWQoKSB7fVxuZXhwb3J0IGZ1bmN0aW9uIG1vdXNlUHJlc3NlZCgpIHtcbiAgZW50aXR5LnJvb3RFbnRpdHkubW91c2VQcmVzc2VkKClcbn1cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZVJlbGVhc2VkKCkge1xuICBlbnRpdHkucm9vdEVudGl0eS5tb3VzZVJlbGVhc2VkKClcbn1cbiIsICJleHBvcnQgdHlwZSBFbnRpdHlFdmVudE5hbWU8RGF0YSBleHRlbmRzIGFueT4gPSBrZXlvZiBFbnRpdHlFdmVudHM8RGF0YT5cblxuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlMaXN0ZW5lcjxcbiAgRGF0YSBleHRlbmRzIGFueSxcbiAgTmFtZSBleHRlbmRzIEVudGl0eUV2ZW50TmFtZTxEYXRhPlxuPiB7XG4gIG5hbWU6IE5hbWVcbiAgY2FsbGJhY2s6IEVudGl0eUxpc3RlbmVyQ2FsbGJhY2s8RGF0YSwgTmFtZT5cbn1cblxuZXhwb3J0IHR5cGUgRW50aXR5TGlzdGVuZXJDYWxsYmFjazxcbiAgRGF0YSBleHRlbmRzIGFueSxcbiAgTmFtZSBleHRlbmRzIEVudGl0eUV2ZW50TmFtZTxEYXRhPlxuPiA9IEVudGl0eUV2ZW50czxEYXRhPltOYW1lXVxuXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eUV2ZW50czxEYXRhIGV4dGVuZHMgYW55PiB7XG4gIHNldHVwOiAoZGF0YTogRGF0YSkgPT4gdW5rbm93blxuICBkcmF3OiAoZGF0YTogRGF0YSkgPT4gdW5rbm93blxuICB1cGRhdGU6IChkYXRhOiBEYXRhKSA9PiB1bmtub3duXG4gIHRlYXJkb3duOiAoZGF0YTogRGF0YSkgPT4gdW5rbm93blxuICBtb3VzZVByZXNzZWQ6IChkYXRhOiBEYXRhKSA9PiB1bmtub3duXG4gIG1vdXNlUmVsZWFzZWQ6IChkYXRhOiBEYXRhKSA9PiB1bmtub3duXG59XG5cbmV4cG9ydCBjbGFzcyBFbnRpdHk8RGF0YSBleHRlbmRzIGFueT4ge1xuICBwcml2YXRlIF9pc1NldHVwID0gZmFsc2VcbiAgcHJpdmF0ZSB6SW5kZXggPSAwXG4gIHByaXZhdGUgcGFyZW50PzogRW50aXR5PGFueT5cbiAgcHJpdmF0ZSBjaGlsZHJlbiA9IG5ldyBTZXQ8RW50aXR5PGFueT4+KClcbiAgcHJpdmF0ZSBsaXN0ZW5lcnM6IEVudGl0eUxpc3RlbmVyPERhdGEsIEVudGl0eUV2ZW50TmFtZTxEYXRhPj5bXSA9IFtdXG5cbiAgY29uc3RydWN0b3IocHVibGljIGRhdGE6IERhdGEpIHt9XG5cbiAgZ2V0IGlzU2V0dXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lzU2V0dXBcbiAgfVxuXG4gIHNldHVwKCkge1xuICAgIGlmICh0aGlzLmlzU2V0dXApIHRocm93IG5ldyBFcnJvcihcIkVudGl0eSBpcyBhbHJlYWR5IHNldHVwXCIpXG4gICAgdGhpcy5jaGlsZHJlbkNhbGxpbmcoXCJzZXR1cFwiKVxuICAgIHRoaXMuX2lzU2V0dXAgPSB0cnVlXG4gIH1cblxuICBkcmF3KCkge1xuICAgIGlmICh0aGlzLmlzU2V0dXApIHRoaXMuY2hpbGRyZW5DYWxsaW5nKFwiZHJhd1wiKVxuICB9XG5cbiAgdXBkYXRlKCkge1xuICAgIGlmICh0aGlzLmlzU2V0dXApIHRoaXMuY2hpbGRyZW5DYWxsaW5nKFwidXBkYXRlXCIpXG4gIH1cblxuICB0ZWFyZG93bigpIHtcbiAgICBpZiAoIXRoaXMuaXNTZXR1cCkgdGhyb3cgbmV3IEVycm9yKFwiRW50aXR5IG11c3QgYmUgc2V0dXAgYmVmb3JlXCIpXG4gICAgaWYgKHRoaXMucGFyZW50KSB0aGlzLnBhcmVudC5jaGlsZHJlbi5kZWxldGUodGhpcylcbiAgICB0aGlzLmNoaWxkcmVuQ2FsbGluZyhcInRlYXJkb3duXCIpXG4gICAgdGhpcy5faXNTZXR1cCA9IGZhbHNlXG4gIH1cblxuICBtb3VzZVJlbGVhc2VkKCkge1xuICAgIHRoaXMuY2hpbGRyZW5DYWxsaW5nKFwibW91c2VSZWxlYXNlZFwiKVxuICB9XG5cbiAgbW91c2VQcmVzc2VkKCkge1xuICAgIHRoaXMuY2hpbGRyZW5DYWxsaW5nKFwibW91c2VQcmVzc2VkXCIpXG4gIH1cblxuICBvbjxOYW1lIGV4dGVuZHMgRW50aXR5RXZlbnROYW1lPERhdGE+PihsaXN0ZW5lcjogRW50aXR5TGlzdGVuZXI8RGF0YSwgTmFtZT4pIHtcbiAgICB0aGlzLmxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKVxuICB9XG5cbiAgYWRkQ2hpbGQoLi4uY2hpbGRyZW46IEVudGl0eTxhbnk+W10pIHtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzXG4gICAgICB0aGlzLmNoaWxkcmVuLmFkZChjaGlsZClcbiAgICAgIGlmICh0aGlzLmlzU2V0dXApIGNoaWxkLnNldHVwKClcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNoaWxkcmVuQ2FsbGluZyhuYW1lOiBFbnRpdHlFdmVudE5hbWU8RGF0YT4pIHtcbiAgICBmb3IgKGNvbnN0IGxpc3RlbmVyIG9mIHRoaXMuZ2V0TGlzdGVuZXJzQnlOYW1lKG5hbWUpKSB7XG4gICAgICBsaXN0ZW5lci5jYWxsYmFjayh0aGlzLmRhdGEpXG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBbLi4udGhpcy5jaGlsZHJlbl0uc29ydCgoYSwgYikgPT4gYS56SW5kZXggLSBiLnpJbmRleCkpXG4gICAgICBjaGlsZFtuYW1lXSgpXG4gIH1cblxuICBwcml2YXRlIGdldExpc3RlbmVyc0J5TmFtZTxOYW1lIGV4dGVuZHMgRW50aXR5RXZlbnROYW1lPERhdGE+PihuYW1lOiBOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMubGlzdGVuZXJzLmZpbHRlcihcbiAgICAgIChsaXN0ZW5lcik6IGxpc3RlbmVyIGlzIEVudGl0eUxpc3RlbmVyPERhdGEsIE5hbWU+ID0+IHtcbiAgICAgICAgcmV0dXJuIGxpc3RlbmVyLm5hbWUgPT09IG5hbWVcbiAgICAgIH1cbiAgICApXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHJvb3RFbnRpdHkgPSBuZXcgRW50aXR5PHVuZGVmaW5lZD4odW5kZWZpbmVkKVxuIiwgImltcG9ydCAqIGFzIHZlY3RvciBmcm9tIFwiLi92ZWN0b3JcIlxuaW1wb3J0ICogYXMgZW50aXR5IGZyb20gXCIuL2VudGl0eVwiXG5cbmNvbnN0IFRBSUxfTEVOR1RIID0gMTAwXG5jb25zdCBDVVJTT1JfUkFESVVTID0gMTVcblxuZXhwb3J0IGNvbnN0IGN1cnNvciA9IG5ldyBlbnRpdHkuRW50aXR5PHZlY3Rvci5WZWN0b3JbXT4oW10pXG5cbmN1cnNvci5vbih7XG4gIG5hbWU6IFwidXBkYXRlXCIsXG4gIGNhbGxiYWNrOiAob2xkUG9zKSA9PiB7XG4gICAgb2xkUG9zLnB1c2goe1xuICAgICAgeDogbW91c2VYLFxuICAgICAgeTogbW91c2VZLFxuICAgIH0pXG4gICAgd2hpbGUgKG9sZFBvcy5sZW5ndGggPiBUQUlMX0xFTkdUSCkgb2xkUG9zLnNoaWZ0KClcbiAgfSxcbn0pXG5cbmN1cnNvci5vbih7XG4gIG5hbWU6IFwiZHJhd1wiLFxuICBjYWxsYmFjazogKG9sZFBvcykgPT4ge1xuICAgIGxldCBsYXN0UG9zID0gb2xkUG9zWzBdXG4gICAgZm9yIChjb25zdCBwb3Mgb2Ygb2xkUG9zKSB7XG4gICAgICBjb25zdCBpbmRleCA9IG9sZFBvcy5pbmRleE9mKHBvcylcbiAgICAgIHN0cm9rZShmbG9vcihtYXAoaW5kZXgsIG9sZFBvcy5sZW5ndGgsIDAsIDI1NSwgMCkpKVxuICAgICAgc3Ryb2tlV2VpZ2h0KGZsb29yKG1hcChpbmRleCwgb2xkUG9zLmxlbmd0aCwgMCwgQ1VSU09SX1JBRElVUyAvIDIsIDApKSlcbiAgICAgIGxpbmUobGFzdFBvcy54LCBsYXN0UG9zLnksIHBvcy54LCBwb3MueSlcbiAgICAgIGxhc3RQb3MgPSBwb3NcbiAgICB9XG4gICAgZmlsbCgyNTUpXG4gICAgbm9TdHJva2UoKVxuICAgIGNpcmNsZShtb3VzZVgsIG1vdXNlWSwgQ1VSU09SX1JBRElVUylcbiAgfSxcbn0pXG5cbmVudGl0eS5yb290RW50aXR5LmFkZENoaWxkKGN1cnNvcilcbiIsICJpbXBvcnQgKiBhcyBlbnRpdHkgZnJvbSBcIi4vZW50aXR5XCJcbmltcG9ydCAqIGFzIHZlY3RvciBmcm9tIFwiLi92ZWN0b3JcIlxuXG5leHBvcnQgaW50ZXJmYWNlIEhpdEJveE9wdGlvbnMge1xuICBwb3NpdGlvbjogdmVjdG9yLlZlY3RvclxuICBzaXplOiB2ZWN0b3IuVmVjdG9yXG59XG5cbmV4cG9ydCBjbGFzcyBIaXRCb3g8RGF0YSBleHRlbmRzIG9iamVjdD4gZXh0ZW5kcyBlbnRpdHkuRW50aXR5PFxuICBEYXRhICYgSGl0Qm94T3B0aW9uc1xuPiB7XG4gIGNvbnN0cnVjdG9yKGRhdGE6IERhdGEpIHtcbiAgICBzdXBlcih7XG4gICAgICBwb3NpdGlvbjogbnVsbCxcbiAgICAgIHNpemU6IG51bGwsXG4gICAgICAuLi5kYXRhLFxuICAgIH0pXG5cbiAgICB0aGlzLm9uKHtcbiAgICAgIG5hbWU6IFwic2V0dXBcIixcbiAgICAgIGNhbGxiYWNrOiAoZGF0YSkgPT4ge1xuICAgICAgICBkYXRhLnBvc2l0aW9uID0gY3JlYXRlVmVjdG9yKClcbiAgICAgICAgZGF0YS5zaXplID0gY3JlYXRlVmVjdG9yKClcbiAgICAgIH0sXG4gICAgfSlcbiAgfVxuXG4gIGdldCB4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YS5wb3NpdGlvbi54XG4gIH1cblxuICBnZXQgeSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmRhdGEucG9zaXRpb24ueVxuICB9XG5cbiAgZ2V0IHdpZHRoKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGEuc2l6ZS54XG4gIH1cblxuICBnZXQgaGVpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLmRhdGEuc2l6ZS55XG4gIH1cblxuICBpc0hvdmVyZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChcbiAgICAgIG1vdXNlWCA+IHRoaXMueCAmJlxuICAgICAgbW91c2VYIDwgdGhpcy54ICsgdGhpcy53aWR0aCAmJlxuICAgICAgbW91c2VZID4gdGhpcy55ICYmXG4gICAgICBtb3VzZVkgPCB0aGlzLnkgKyB0aGlzLmhlaWdodFxuICAgIClcbiAgfVxufVxuIiwgImV4cG9ydCBjb25zdCBjb250ZXh0ID0ge1xuICBzY29yZTogMCxcbn1cbiIsICJpbXBvcnQgKiBhcyBwNSBmcm9tIFwicDVcIlxuaW1wb3J0ICogYXMgZW50aXR5IGZyb20gXCIuL2VudGl0eVwiXG5pbXBvcnQgKiBhcyBoaXRib3ggZnJvbSBcIi4vaGl0Ym94XCJcbmltcG9ydCAqIGFzIGdhbWUgZnJvbSBcIi4vZ2FtZVwiXG5cbmNvbnN0IEJBTExPT05fQ09VTlQgPSA1XG5cbmV4cG9ydCBjbGFzcyBCYWxsb29uIGV4dGVuZHMgaGl0Ym94LkhpdEJveDx7IGNvbG9yOiBwNS5Db2xvciB9PiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHsgY29sb3I6IG51bGwgfSlcblxuICAgIHRoaXMub24oe1xuICAgICAgbmFtZTogXCJzZXR1cFwiLFxuICAgICAgY2FsbGJhY2s6IChkYXRhKSA9PiB7XG4gICAgICAgIGRhdGEuY29sb3IgPSBjb2xvcihyYW5kb20oMTAwLCAyMDApLCByYW5kb20oMTAwLCAyMDApLCByYW5kb20oMTAwLCAyMDApKVxuXG4gICAgICAgIGRhdGEucG9zaXRpb24gPSB7XG4gICAgICAgICAgeDogcmFuZG9tKDAsIHdpZHRoKSxcbiAgICAgICAgICB5OiByYW5kb20oMCwgaGVpZ2h0KSxcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJhZGl1cyA9IHJhbmRvbSg0MCwgNjApXG5cbiAgICAgICAgZGF0YS5zaXplID0ge1xuICAgICAgICAgIHg6IHJhZGl1cyxcbiAgICAgICAgICB5OiByYWRpdXMsXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSlcblxuICAgIHRoaXMub24oe1xuICAgICAgbmFtZTogXCJtb3VzZVJlbGVhc2VkXCIsXG4gICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pc0hvdmVyZWQoKSkge1xuICAgICAgICAgIHRoaXMudGVhcmRvd24oKVxuICAgICAgICAgIGNvbnN0IG5ld0JhbGxvb24gPSBuZXcgQmFsbG9vbigpXG4gICAgICAgICAgYmFsbG9vbnMuYWRkKG5ld0JhbGxvb24pXG4gICAgICAgICAgZW50aXR5LnJvb3RFbnRpdHkuYWRkQ2hpbGQobmV3QmFsbG9vbilcbiAgICAgICAgICBnYW1lLmNvbnRleHQuc2NvcmUrK1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pXG5cbiAgICB0aGlzLm9uKHtcbiAgICAgIG5hbWU6IFwiZHJhd1wiLFxuICAgICAgY2FsbGJhY2s6IChkYXRhKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmlzSG92ZXJlZCgpKSB7XG4gICAgICAgICAgc3Ryb2tlKDI1NSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBub1N0cm9rZSgpXG4gICAgICAgIH1cbiAgICAgICAgZmlsbChkYXRhLmNvbG9yKVxuICAgICAgICBjaXJjbGUodGhpcy54ICsgdGhpcy53aWR0aCAvIDIsIHRoaXMueSArIHRoaXMuaGVpZ2h0IC8gMiwgdGhpcy53aWR0aClcbiAgICAgIH0sXG4gICAgfSlcblxuICAgIHRoaXMub24oe1xuICAgICAgbmFtZTogXCJ0ZWFyZG93blwiLFxuICAgICAgY2FsbGJhY2s6IChkYXRhKSA9PiB7XG4gICAgICAgIGJhbGxvb25zLmRlbGV0ZSh0aGlzKVxuICAgICAgfSxcbiAgICB9KVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBiYWxsb29ucyA9IG5ldyBTZXQ8QmFsbG9vbj4oKVxuXG5mb3IgKGxldCBpID0gMDsgaSA8IEJBTExPT05fQ09VTlQ7IGkrKykge1xuICBiYWxsb29ucy5hZGQobmV3IEJhbGxvb24oKSlcbn1cblxuZW50aXR5LnJvb3RFbnRpdHkuYWRkQ2hpbGQoLi4uYmFsbG9vbnMpXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7QUN3Qk8scUJBQStCO0FBQUEsSUFPcEMsWUFBbUIsTUFBWTtBQUFaO0FBTlgsc0JBQVc7QUFDWCxvQkFBUztBQUVULHNCQUFXLElBQUk7QUFDZix1QkFBMkQ7QUFBQTtBQUFBLFFBSS9ELFVBQVU7QUFDWixhQUFPLEtBQUs7QUFBQTtBQUFBLElBR2QsUUFBUTtBQUNOLFVBQUksS0FBSztBQUFTLGNBQU0sSUFBSSxNQUFNO0FBQ2xDLFdBQUssZ0JBQWdCO0FBQ3JCLFdBQUssV0FBVztBQUFBO0FBQUEsSUFHbEIsT0FBTztBQUNMLFVBQUksS0FBSztBQUFTLGFBQUssZ0JBQWdCO0FBQUE7QUFBQSxJQUd6QyxTQUFTO0FBQ1AsVUFBSSxLQUFLO0FBQVMsYUFBSyxnQkFBZ0I7QUFBQTtBQUFBLElBR3pDLFdBQVc7QUFDVCxVQUFJLENBQUMsS0FBSztBQUFTLGNBQU0sSUFBSSxNQUFNO0FBQ25DLFVBQUksS0FBSztBQUFRLGFBQUssT0FBTyxTQUFTLE9BQU87QUFDN0MsV0FBSyxnQkFBZ0I7QUFDckIsV0FBSyxXQUFXO0FBQUE7QUFBQSxJQUdsQixnQkFBZ0I7QUFDZCxXQUFLLGdCQUFnQjtBQUFBO0FBQUEsSUFHdkIsZUFBZTtBQUNiLFdBQUssZ0JBQWdCO0FBQUE7QUFBQSxJQUd2QixHQUF1QyxVQUFzQztBQUMzRSxXQUFLLFVBQVUsS0FBSztBQUFBO0FBQUEsSUFHdEIsWUFBWSxVQUF5QjtBQUNuQyxpQkFBVyxTQUFTLFVBQVU7QUFDNUIsY0FBTSxTQUFTO0FBQ2YsYUFBSyxTQUFTLElBQUk7QUFDbEIsWUFB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
