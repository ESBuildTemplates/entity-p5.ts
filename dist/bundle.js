var app = (() => {
  var __defProp = Object.defineProperty;
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
    root: () => root,
    setup: () => setup,
    update: () => update
  });

  // node_modules/entity-p5/src/app/entity.ts
  var Entity = class {
    constructor() {
      this._isSetup = false;
      this._children = new Set();
      this._listeners = [];
      this._stopPoints = {
        setup: false,
        draw: false,
        update: false,
        teardown: false,
        keyPressed: false,
        keyReleased: false,
        mousePressed: false,
        mouseReleased: false
      };
    }
    get isSetup() {
      return this._isSetup;
    }
    get children() {
      return [...this._children];
    }
    get zIndex() {
      var _a, _b, _c;
      return (_c = (_b = this._zIndex) != null ? _b : (_a = this.parent) == null ? void 0 : _a.children.indexOf(this)) != null ? _c : 0;
    }
    get parent() {
      return this._parent;
    }
    onSetup() {
    }
    onDraw() {
    }
    onUpdate() {
    }
    onTeardown() {
    }
    onMouseReleased() {
    }
    onMousePressed() {
    }
    onKeyReleased() {
    }
    onKeyPressed() {
    }
    setup() {
      if (!this.isSetup) {
        this.onSetup();
        this.transmit("setup");
        this._isSetup = true;
      } else {
        throw new Error("Entity is already setup");
      }
    }
    draw() {
      if (this.isSetup) {
        this.onDraw();
        this.transmit("draw");
      } else {
        console.warn("Draw is called before setup");
      }
    }
    update() {
      if (this.isSetup) {
        this.onUpdate();
        this.transmit("update");
      } else {
        console.warn("update is called before setup");
      }
    }
    teardown() {
      var _a;
      if (this.isSetup) {
        this._isSetup = false;
        this.onTeardown();
        (_a = this._parent) == null ? void 0 : _a.removeChild(this);
        this.transmit("teardown");
      } else {
        throw new Error("Entity must be setup before");
      }
    }
    mousePressed() {
      if (this.isSetup) {
        this.onMousePressed();
        this.transmit("mousePressed");
      } else {
        console.warn("mousePressed is called before setup");
      }
    }
    mouseReleased() {
      if (this.isSetup) {
        this.onMouseReleased();
        this.transmit("mouseReleased");
      } else {
        console.warn("mousePressed is called before setup");
      }
    }
    keyPressed() {
      if (this.isSetup) {
        this.onKeyPressed();
        this.transmit("keyPressed");
      } else {
        console.warn("keyPressed is called before setup");
      }
    }
    keyReleased() {
      if (this.isSetup) {
        this.onKeyReleased();
        this.transmit("keyReleased");
      } else {
        console.warn("keyReleased is called before setup");
      }
    }
    on(name, listener) {
      this._listeners.push({
        [name]() {
          listener.bind(this)(this);
        }
      }[name].bind(this));
    }
    addChild(...children) {
      for (const child of children) {
        child._parent = this;
        this._children.add(child);
        if (this.isSetup)
          child.setup();
      }
    }
    removeChild(...children) {
      for (const child of children) {
        if (child.isSetup)
          child.teardown();
        else
          this._children.delete(child);
      }
    }
    stopTransmission(name) {
      this._stopPoints[name] = true;
    }
    transmit(name) {
      for (const listener of this.getListenersByName(name))
        listener.bind(this)(this);
      let children = name === "mouseReleased" || name === "mousePressed" || name === "keyPressed" || name === "keyReleased" ? this.children.sort((a, b) => a.zIndex - b.zIndex) : this.children.sort((a, b) => b.zIndex - a.zIndex);
      for (const child of children) {
        if (this._stopPoints[name]) {
          this._stopPoints[name] = false;
          return;
        }
        child[name]();
      }
    }
    getListenersByName(name) {
      return this._listeners.filter((listener) => {
        return listener.name === name;
      });
    }
    schema(indentation = 2, depth = 0, index = null) {
      return `${" ".repeat(indentation).repeat(depth)}${index === null ? "" : `${index} - `}${this.constructor.name} [${this.isSetup ? "on" : "off"}]${this._children.size > 0 ? `:
${this.children.map((child, index2) => `${child.schema(indentation, depth + 1, index2)}`).join("\n")}` : ""}`;
    }
  };

  // node_modules/entity-p5/src/app/drawable.ts
  var Drawable = class extends Entity {
    constructor(settings) {
      super();
      this.settings = settings;
    }
    onDraw() {
      if (!this.settings)
        return;
      if (this.settings.fill) {
        if ("color" in this.settings.fill) {
          fill(this.settings.fill.color);
        } else {
          fill(this.settings.fill);
        }
      }
      if (this.settings.stroke) {
        strokeWeight(this.settings.stroke.weight);
        stroke(this.settings.stroke.color);
      } else {
        noStroke();
      }
    }
  };

  // node_modules/entity-p5/src/app/shape.ts
  var Shape = class extends Drawable {
    get center() {
      return [this.centerX, this.centerY];
    }
  };
  var Circle = class extends Shape {
    constructor(x = 0, y = 0, diameter = 0, options) {
      super(options);
      this.x = x;
      this.y = y;
      this.diameter = diameter;
    }
    get width() {
      return this.diameter;
    }
    get height() {
      return this.diameter;
    }
    get centerX() {
      return this.x;
    }
    get centerY() {
      return this.y;
    }
    get isHovered() {
      return dist(mouseX, mouseY, this.x, this.y) < this.diameter / 2;
    }
    onDraw() {
      super.onDraw();
      circle(this.x, this.y, this.diameter);
    }
  };

  // src/app/game.ts
  var Game = class extends Entity {
  };
  var game = new Game();

  // src/app/cursor.ts
  var HISTORY_LENGTH = 100;
  var Cursor = class extends Circle {
    constructor() {
      super(0, 0, 15);
      this.history = [];
      game.addChild(this);
    }
    onUpdate() {
      this.history.push([this.x, this.y]);
      this.x = mouseX;
      this.y = mouseY;
      while (this.history.length > HISTORY_LENGTH)
        this.history.shift();
    }
    onDraw() {
      let last = this.history[0];
      for (const pos of this.history) {
        const index = this.history.indexOf(pos);
        stroke(floor(map(index, this.history.length, 0, 255, 0)));
        strokeWeight(floor(map(index, this.history.length, 0, this.diameter, 0)));
        line(...last, ...pos);
        last = pos;
      }
    }
  };

  // src/app/balloon.ts
  var Balloon = class extends Circle {
    constructor() {
      super(random(0, width), random(0, height), random(40, 60), {
        fill: color(random(100, 200), random(100, 200), random(100, 200)),
        stroke: false
      });
    }
    onUpdate() {
      if (this.isHovered) {
        this.settings.stroke = {
          color: color(255),
          weight: 5
        };
      } else {
        this.settings.stroke = false;
      }
    }
    onTeardown() {
      game.score++;
    }
    onMouseReleased() {
      if (this.isHovered) {
        if (this.parent.children.length > 1)
          this.parent.stopTransmission("mouseReleased");
        this.parent.addChild(new Balloon());
        this.teardown();
      }
    }
  };

  // src/app/balloons.ts
  var Balloons = class extends Entity {
    constructor(count) {
      super();
      this.count = count;
      game.addChild(this);
    }
    onSetup() {
      for (let i = 0; i < this.count; i++) {
        this.addChild(new Balloon());
      }
    }
  };

  // src/index.ts
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  function setup() {
    createCanvas(Math.max(document.documentElement.clientWidth, window.innerWidth || 0), Math.max(document.documentElement.clientHeight, window.innerHeight || 0));
    new Balloons(1);
    new Cursor();
    game.setup();
    game.schema(2);
  }
  function draw() {
    background(20);
    game.draw();
  }
  function update(timestamp) {
    game.update();
  }
  function keyPressed() {
  }
  function keyReleased() {
  }
  function mousePressed() {
    game.mousePressed();
  }
  function mouseReleased() {
    game.mouseReleased();
  }
  var root = game;
  return src_exports;
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2luZGV4LnRzIiwgIm5vZGVfbW9kdWxlcy9lbnRpdHktcDUvc3JjL2FwcC9lbnRpdHkudHMiLCAibm9kZV9tb2R1bGVzL2VudGl0eS1wNS9zcmMvYXBwL2RyYXdhYmxlLnRzIiwgIm5vZGVfbW9kdWxlcy9lbnRpdHktcDUvc3JjL2FwcC9zaGFwZS50cyIsICJzcmMvYXBwL2dhbWUudHMiLCAic3JjL2FwcC9jdXJzb3IudHMiLCAic3JjL2FwcC9iYWxsb29uLnRzIiwgInNyYy9hcHAvYmFsbG9vbnMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vLyBAdHMtY2hlY2tcclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9AdHlwZXMvcDUvZ2xvYmFsLmQudHNcIiAvPlxyXG5cclxuaW1wb3J0IHsgZ2FtZSB9IGZyb20gXCIuL2FwcC9nYW1lXCJcclxuaW1wb3J0IHsgQ3Vyc29yIH0gZnJvbSBcIi4vYXBwL2N1cnNvclwiXHJcbmltcG9ydCB7IEJhbGxvb25zIH0gZnJvbSBcIi4vYXBwL2JhbGxvb25zXCJcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCAoZXZlbnQpID0+IGV2ZW50LnByZXZlbnREZWZhdWx0KCkpXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0dXAoKSB7XHJcbiAgY3JlYXRlQ2FudmFzKFxyXG4gICAgTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKSxcclxuICAgIE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKVxyXG4gIClcclxuXHJcbiAgbmV3IEJhbGxvb25zKDEpXHJcbiAgbmV3IEN1cnNvcigpXHJcblxyXG4gIGdhbWUuc2V0dXAoKVxyXG4gIGdhbWUuc2NoZW1hKDIpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkcmF3KCkge1xyXG4gIGJhY2tncm91bmQoMjApXHJcblxyXG4gIGdhbWUuZHJhdygpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGUodGltZXN0YW1wOiBudW1iZXIpIHtcclxuICBnYW1lLnVwZGF0ZSgpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBrZXlQcmVzc2VkKCkge31cclxuZXhwb3J0IGZ1bmN0aW9uIGtleVJlbGVhc2VkKCkge31cclxuZXhwb3J0IGZ1bmN0aW9uIG1vdXNlUHJlc3NlZCgpIHtcclxuICBnYW1lLm1vdXNlUHJlc3NlZCgpXHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIG1vdXNlUmVsZWFzZWQoKSB7XHJcbiAgZ2FtZS5tb3VzZVJlbGVhc2VkKClcclxufVxyXG5cclxuLyoqXHJcbiAqIGRlYnVnIGltcG9ydHMgKGFjY2Vzc2libGUgZnJvbSBmcm9udGVuZCBjb25zb2xlIHdpdGggYGFwcC5yb290YClcclxuICovXHJcbmV4cG9ydCBjb25zdCByb290ID0gZ2FtZVxyXG4iLCAiZXhwb3J0IHR5cGUgRW50aXR5RXZlbnROYW1lID1cbiAgfCBcInNldHVwXCJcbiAgfCBcImRyYXdcIlxuICB8IFwidXBkYXRlXCJcbiAgfCBcInRlYXJkb3duXCJcbiAgfCBcIm1vdXNlUHJlc3NlZFwiXG4gIHwgXCJtb3VzZVJlbGVhc2VkXCJcbiAgfCBcImtleVByZXNzZWRcIlxuICB8IFwia2V5UmVsZWFzZWRcIlxuXG5leHBvcnQgdHlwZSBFbnRpdHlMaXN0ZW5lcjxUaGlzIGV4dGVuZHMgRW50aXR5PiA9IChcbiAgdGhpczogVGhpcyxcbiAgaXQ6IFRoaXNcbikgPT4gdW5rbm93blxuXG5leHBvcnQgY2xhc3MgRW50aXR5IHtcbiAgcHJvdGVjdGVkIF9pc1NldHVwID0gZmFsc2VcbiAgcHJvdGVjdGVkIF9jaGlsZHJlbiA9IG5ldyBTZXQ8RW50aXR5PigpXG4gIHByb3RlY3RlZCBfekluZGV4PzogbnVtYmVyXG4gIHByb3RlY3RlZCBfcGFyZW50PzogRW50aXR5XG4gIHByb3RlY3RlZCBfbGlzdGVuZXJzOiBFbnRpdHlMaXN0ZW5lcjx0aGlzPltdID0gW11cbiAgcHJvdGVjdGVkIF9zdG9wUG9pbnRzOiBSZWNvcmQ8RW50aXR5RXZlbnROYW1lLCBib29sZWFuPiA9IHtcbiAgICBzZXR1cDogZmFsc2UsXG4gICAgZHJhdzogZmFsc2UsXG4gICAgdXBkYXRlOiBmYWxzZSxcbiAgICB0ZWFyZG93bjogZmFsc2UsXG4gICAga2V5UHJlc3NlZDogZmFsc2UsXG4gICAga2V5UmVsZWFzZWQ6IGZhbHNlLFxuICAgIG1vdXNlUHJlc3NlZDogZmFsc2UsXG4gICAgbW91c2VSZWxlYXNlZDogZmFsc2UsXG4gIH1cblxuICBnZXQgaXNTZXR1cCgpIHtcbiAgICByZXR1cm4gdGhpcy5faXNTZXR1cFxuICB9XG5cbiAgZ2V0IGNoaWxkcmVuKCk6IEFycmF5PEVudGl0eT4ge1xuICAgIHJldHVybiBbLi4udGhpcy5fY2hpbGRyZW5dXG4gIH1cblxuICBnZXQgekluZGV4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3pJbmRleCA/PyB0aGlzLnBhcmVudD8uY2hpbGRyZW4uaW5kZXhPZih0aGlzKSA/PyAwXG4gIH1cblxuICBnZXQgcGFyZW50KCk6IEVudGl0eSB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX3BhcmVudFxuICB9XG5cbiAgLyoqXG4gICAqIFJlcHJlc2VudCBhbnkgc3RhdGUtYmFzZWQgZW50aXR5XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcbiAgICovXG4gIG9uU2V0dXAoKSB7fVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIGJlIG92ZXJ3cml0dGVuIGJ5IHlvdXIgb3duIHdvcmtpbmdzXG4gICAqL1xuICBvbkRyYXcoKSB7fVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIGJlIG92ZXJ3cml0dGVuIGJ5IHlvdXIgb3duIHdvcmtpbmdzXG4gICAqL1xuICBvblVwZGF0ZSgpIHt9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcbiAgICovXG4gIG9uVGVhcmRvd24oKSB7fVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIGJlIG92ZXJ3cml0dGVuIGJ5IHlvdXIgb3duIHdvcmtpbmdzXG4gICAqL1xuICBvbk1vdXNlUmVsZWFzZWQoKSB7fVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIGJlIG92ZXJ3cml0dGVuIGJ5IHlvdXIgb3duIHdvcmtpbmdzXG4gICAqL1xuICBvbk1vdXNlUHJlc3NlZCgpIHt9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcbiAgICovXG4gIG9uS2V5UmVsZWFzZWQoKSB7fVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIGJlIG92ZXJ3cml0dGVuIGJ5IHlvdXIgb3duIHdvcmtpbmdzXG4gICAqL1xuICBvbktleVByZXNzZWQoKSB7fVxuXG4gIC8qKlxuICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cbiAgICogU2hvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiFcbiAgICovXG4gIHB1YmxpYyBzZXR1cCgpIHtcbiAgICBpZiAoIXRoaXMuaXNTZXR1cCkge1xuICAgICAgdGhpcy5vblNldHVwKClcbiAgICAgIHRoaXMudHJhbnNtaXQoXCJzZXR1cFwiKVxuICAgICAgdGhpcy5faXNTZXR1cCA9IHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRW50aXR5IGlzIGFscmVhZHkgc2V0dXBcIilcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjdXJyZW50IGVudGl0eSBpcyBhIHJvb3QuXG4gICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXG4gICAqL1xuICBwdWJsaWMgZHJhdygpIHtcbiAgICBpZiAodGhpcy5pc1NldHVwKSB7XG4gICAgICB0aGlzLm9uRHJhdygpXG4gICAgICB0aGlzLnRyYW5zbWl0KFwiZHJhd1wiKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJEcmF3IGlzIGNhbGxlZCBiZWZvcmUgc2V0dXBcIilcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjdXJyZW50IGVudGl0eSBpcyBhIHJvb3QuXG4gICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXG4gICAqL1xuICBwdWJsaWMgdXBkYXRlKCkge1xuICAgIGlmICh0aGlzLmlzU2V0dXApIHtcbiAgICAgIHRoaXMub25VcGRhdGUoKVxuICAgICAgdGhpcy50cmFuc21pdChcInVwZGF0ZVwiKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJ1cGRhdGUgaXMgY2FsbGVkIGJlZm9yZSBzZXR1cFwiKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cbiAgICogU2hvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiFcbiAgICovXG4gIHB1YmxpYyB0ZWFyZG93bigpIHtcbiAgICBpZiAodGhpcy5pc1NldHVwKSB7XG4gICAgICB0aGlzLl9pc1NldHVwID0gZmFsc2VcbiAgICAgIHRoaXMub25UZWFyZG93bigpXG4gICAgICB0aGlzLl9wYXJlbnQ/LnJlbW92ZUNoaWxkKHRoaXMpXG4gICAgICB0aGlzLnRyYW5zbWl0KFwidGVhcmRvd25cIilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRW50aXR5IG11c3QgYmUgc2V0dXAgYmVmb3JlXCIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxuICAgKi9cbiAgcHVibGljIG1vdXNlUHJlc3NlZCgpIHtcbiAgICBpZiAodGhpcy5pc1NldHVwKSB7XG4gICAgICB0aGlzLm9uTW91c2VQcmVzc2VkKClcbiAgICAgIHRoaXMudHJhbnNtaXQoXCJtb3VzZVByZXNzZWRcIilcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKFwibW91c2VQcmVzc2VkIGlzIGNhbGxlZCBiZWZvcmUgc2V0dXBcIilcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjdXJyZW50IGVudGl0eSBpcyBhIHJvb3QuXG4gICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXG4gICAqL1xuICBwdWJsaWMgbW91c2VSZWxlYXNlZCgpIHtcbiAgICBpZiAodGhpcy5pc1NldHVwKSB7XG4gICAgICB0aGlzLm9uTW91c2VSZWxlYXNlZCgpXG4gICAgICB0aGlzLnRyYW5zbWl0KFwibW91c2VSZWxlYXNlZFwiKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJtb3VzZVByZXNzZWQgaXMgY2FsbGVkIGJlZm9yZSBzZXR1cFwiKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cbiAgICogU2hvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiFcbiAgICovXG4gIHB1YmxpYyBrZXlQcmVzc2VkKCkge1xuICAgIGlmICh0aGlzLmlzU2V0dXApIHtcbiAgICAgIHRoaXMub25LZXlQcmVzc2VkKClcbiAgICAgIHRoaXMudHJhbnNtaXQoXCJrZXlQcmVzc2VkXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybihcImtleVByZXNzZWQgaXMgY2FsbGVkIGJlZm9yZSBzZXR1cFwiKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cbiAgICogU2hvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiFcbiAgICovXG4gIHB1YmxpYyBrZXlSZWxlYXNlZCgpIHtcbiAgICBpZiAodGhpcy5pc1NldHVwKSB7XG4gICAgICB0aGlzLm9uS2V5UmVsZWFzZWQoKVxuICAgICAgdGhpcy50cmFuc21pdChcImtleVJlbGVhc2VkXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybihcImtleVJlbGVhc2VkIGlzIGNhbGxlZCBiZWZvcmUgc2V0dXBcIilcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb24obmFtZTogRW50aXR5RXZlbnROYW1lLCBsaXN0ZW5lcjogRW50aXR5TGlzdGVuZXI8dGhpcz4pIHtcbiAgICB0aGlzLl9saXN0ZW5lcnMucHVzaChcbiAgICAgIHtcbiAgICAgICAgW25hbWVdKCkge1xuICAgICAgICAgIGxpc3RlbmVyLmJpbmQodGhpcykodGhpcylcbiAgICAgICAgfSxcbiAgICAgIH1bbmFtZV0uYmluZCh0aGlzKVxuICAgIClcbiAgfVxuXG4gIHB1YmxpYyBhZGRDaGlsZCguLi5jaGlsZHJlbjogRW50aXR5W10pIHtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgICBjaGlsZC5fcGFyZW50ID0gdGhpc1xuICAgICAgdGhpcy5fY2hpbGRyZW4uYWRkKGNoaWxkKVxuICAgICAgaWYgKHRoaXMuaXNTZXR1cCkgY2hpbGQuc2V0dXAoKVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyByZW1vdmVDaGlsZCguLi5jaGlsZHJlbjogRW50aXR5W10pIHtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgICBpZiAoY2hpbGQuaXNTZXR1cCkgY2hpbGQudGVhcmRvd24oKVxuICAgICAgZWxzZSB0aGlzLl9jaGlsZHJlbi5kZWxldGUoY2hpbGQpXG4gICAgfVxuICB9XG5cbiAgcHVibGljIHN0b3BUcmFuc21pc3Npb24obmFtZTogRW50aXR5RXZlbnROYW1lKSB7XG4gICAgdGhpcy5fc3RvcFBvaW50c1tuYW1lXSA9IHRydWVcbiAgfVxuXG4gIHByaXZhdGUgdHJhbnNtaXQobmFtZTogRW50aXR5RXZlbnROYW1lKSB7XG4gICAgZm9yIChjb25zdCBsaXN0ZW5lciBvZiB0aGlzLmdldExpc3RlbmVyc0J5TmFtZShuYW1lKSlcbiAgICAgIGxpc3RlbmVyLmJpbmQodGhpcykodGhpcylcblxuICAgIGxldCBjaGlsZHJlbiA9XG4gICAgICBuYW1lID09PSBcIm1vdXNlUmVsZWFzZWRcIiB8fFxuICAgICAgbmFtZSA9PT0gXCJtb3VzZVByZXNzZWRcIiB8fFxuICAgICAgbmFtZSA9PT0gXCJrZXlQcmVzc2VkXCIgfHxcbiAgICAgIG5hbWUgPT09IFwia2V5UmVsZWFzZWRcIlxuICAgICAgICA/IHRoaXMuY2hpbGRyZW4uc29ydCgoYSwgYikgPT4gYS56SW5kZXggLSBiLnpJbmRleClcbiAgICAgICAgOiB0aGlzLmNoaWxkcmVuLnNvcnQoKGEsIGIpID0+IGIuekluZGV4IC0gYS56SW5kZXgpXG5cbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgICBpZiAodGhpcy5fc3RvcFBvaW50c1tuYW1lXSkge1xuICAgICAgICB0aGlzLl9zdG9wUG9pbnRzW25hbWVdID0gZmFsc2VcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNoaWxkW25hbWVdKClcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldExpc3RlbmVyc0J5TmFtZShuYW1lOiBFbnRpdHlFdmVudE5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fbGlzdGVuZXJzLmZpbHRlcigobGlzdGVuZXIpID0+IHtcbiAgICAgIHJldHVybiBsaXN0ZW5lci5uYW1lID09PSBuYW1lXG4gICAgfSlcbiAgfVxuXG4gIHB1YmxpYyBzY2hlbWEoXG4gICAgaW5kZW50YXRpb24gPSAyLFxuICAgIGRlcHRoID0gMCxcbiAgICBpbmRleDogbnVtYmVyIHwgbnVsbCA9IG51bGxcbiAgKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCR7XCIgXCIucmVwZWF0KGluZGVudGF0aW9uKS5yZXBlYXQoZGVwdGgpfSR7XG4gICAgICBpbmRleCA9PT0gbnVsbCA/IFwiXCIgOiBgJHtpbmRleH0gLSBgXG4gICAgfSR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSBbJHt0aGlzLmlzU2V0dXAgPyBcIm9uXCIgOiBcIm9mZlwifV0ke1xuICAgICAgdGhpcy5fY2hpbGRyZW4uc2l6ZSA+IDBcbiAgICAgICAgPyBgOlxcbiR7dGhpcy5jaGlsZHJlblxuICAgICAgICAgICAgLm1hcChcbiAgICAgICAgICAgICAgKGNoaWxkLCBpbmRleCkgPT4gYCR7Y2hpbGQuc2NoZW1hKGluZGVudGF0aW9uLCBkZXB0aCArIDEsIGluZGV4KX1gXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuam9pbihcIlxcblwiKX1gXG4gICAgICAgIDogXCJcIlxuICAgIH1gXG4gIH1cbn1cbiIsICJpbXBvcnQgKiBhcyBlbnRpdHkgZnJvbSBcIi4vZW50aXR5XCJcblxuZXhwb3J0IGludGVyZmFjZSBEcmF3YWJsZVNldHRpbmdzIHtcbiAgZmlsbDogZmFsc2UgfCBGaWxsT3B0aW9uc1xuICBzdHJva2U6IGZhbHNlIHwgU3Ryb2tlT3B0aW9uc1xufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRHJhd2FibGUgZXh0ZW5kcyBlbnRpdHkuRW50aXR5IHtcbiAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzZXR0aW5ncz86IERyYXdhYmxlU2V0dGluZ3MpIHtcbiAgICBzdXBlcigpXG4gIH1cblxuICBvbkRyYXcoKSB7XG4gICAgaWYgKCF0aGlzLnNldHRpbmdzKSByZXR1cm5cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmZpbGwpIHtcbiAgICAgIGlmIChcImNvbG9yXCIgaW4gdGhpcy5zZXR0aW5ncy5maWxsKSB7XG4gICAgICAgIGZpbGwodGhpcy5zZXR0aW5ncy5maWxsLmNvbG9yKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmlsbCh0aGlzLnNldHRpbmdzLmZpbGwpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3Muc3Ryb2tlKSB7XG4gICAgICBzdHJva2VXZWlnaHQodGhpcy5zZXR0aW5ncy5zdHJva2Uud2VpZ2h0KVxuICAgICAgc3Ryb2tlKHRoaXMuc2V0dGluZ3Muc3Ryb2tlLmNvbG9yKVxuICAgIH0gZWxzZSB7XG4gICAgICBub1N0cm9rZSgpXG4gICAgfVxuICB9XG59XG4iLCAiaW1wb3J0IHsgRHJhd2FibGUsIERyYXdhYmxlU2V0dGluZ3MgfSBmcm9tIFwiLi9kcmF3YWJsZVwiXG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTaGFwZVxuICBleHRlbmRzIERyYXdhYmxlXG4gIGltcGxlbWVudHMgUG9zaXRpb25hYmxlLCBSZXNpemFibGVcbntcbiAgYWJzdHJhY3QgeDogbnVtYmVyXG4gIGFic3RyYWN0IHk6IG51bWJlclxuICBhYnN0cmFjdCB3aWR0aDogbnVtYmVyXG4gIGFic3RyYWN0IGhlaWdodDogbnVtYmVyXG4gIGFic3RyYWN0IHJlYWRvbmx5IGNlbnRlclg6IG51bWJlclxuICBhYnN0cmFjdCByZWFkb25seSBjZW50ZXJZOiBudW1iZXJcblxuICBnZXQgY2VudGVyKCk6IFt4OiBudW1iZXIsIHk6IG51bWJlcl0ge1xuICAgIHJldHVybiBbdGhpcy5jZW50ZXJYLCB0aGlzLmNlbnRlclldXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJlY3QgZXh0ZW5kcyBTaGFwZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyB4ID0gMCxcbiAgICBwdWJsaWMgeSA9IDAsXG4gICAgcHVibGljIHdpZHRoID0gMCxcbiAgICBwdWJsaWMgaGVpZ2h0ID0gMCxcbiAgICBvcHRpb25zPzogRHJhd2FibGVTZXR0aW5nc1xuICApIHtcbiAgICBzdXBlcihvcHRpb25zKVxuICB9XG5cbiAgZ2V0IGNlbnRlclgoKSB7XG4gICAgcmV0dXJuIHRoaXMueCArIHRoaXMud2lkdGggLyAyXG4gIH1cblxuICBnZXQgY2VudGVyWSgpIHtcbiAgICByZXR1cm4gdGhpcy55ICsgdGhpcy5oZWlnaHQgLyAyXG4gIH1cblxuICBnZXQgaXNIb3ZlcmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICBtb3VzZVggPiB0aGlzLnggJiZcbiAgICAgIG1vdXNlWCA8IHRoaXMueCArIHRoaXMud2lkdGggJiZcbiAgICAgIG1vdXNlWSA+IHRoaXMueSAmJlxuICAgICAgbW91c2VZIDwgdGhpcy55ICsgdGhpcy5oZWlnaHRcbiAgICApXG4gIH1cblxuICBvbkRyYXcoKSB7XG4gICAgc3VwZXIub25EcmF3KClcbiAgICByZWN0KHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ2lyY2xlIGV4dGVuZHMgU2hhcGUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgeCA9IDAsXG4gICAgcHVibGljIHkgPSAwLFxuICAgIHB1YmxpYyBkaWFtZXRlciA9IDAsXG4gICAgb3B0aW9ucz86IERyYXdhYmxlU2V0dGluZ3NcbiAgKSB7XG4gICAgc3VwZXIob3B0aW9ucylcbiAgfVxuXG4gIGdldCB3aWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5kaWFtZXRlclxuICB9XG5cbiAgZ2V0IGhlaWdodCgpIHtcbiAgICByZXR1cm4gdGhpcy5kaWFtZXRlclxuICB9XG5cbiAgZ2V0IGNlbnRlclgoKSB7XG4gICAgcmV0dXJuIHRoaXMueFxuICB9XG5cbiAgZ2V0IGNlbnRlclkoKSB7XG4gICAgcmV0dXJuIHRoaXMueVxuICB9XG5cbiAgZ2V0IGlzSG92ZXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZGlzdChtb3VzZVgsIG1vdXNlWSwgdGhpcy54LCB0aGlzLnkpIDwgdGhpcy5kaWFtZXRlciAvIDJcbiAgfVxuXG4gIG9uRHJhdygpIHtcbiAgICBzdXBlci5vbkRyYXcoKVxuICAgIGNpcmNsZSh0aGlzLngsIHRoaXMueSwgdGhpcy5kaWFtZXRlcilcbiAgfVxufVxuIiwgImltcG9ydCB7IEVudGl0eSB9IGZyb20gXCJlbnRpdHktcDVcIlxyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWUgZXh0ZW5kcyBFbnRpdHkge1xyXG4gIHNjb3JlOiBudW1iZXJcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdhbWUgPSBuZXcgR2FtZSgpXHJcbiIsICJpbXBvcnQgeyBnYW1lIH0gZnJvbSBcIi4vZ2FtZVwiXHJcbmltcG9ydCB7IENpcmNsZSB9IGZyb20gXCJlbnRpdHktcDVcIlxyXG5cclxuY29uc3QgSElTVE9SWV9MRU5HVEggPSAxMDBcclxuXHJcbmV4cG9ydCBjbGFzcyBDdXJzb3IgZXh0ZW5kcyBDaXJjbGUge1xyXG4gIHB1YmxpYyBoaXN0b3J5OiBbeDogbnVtYmVyLCB5OiBudW1iZXJdW10gPSBbXVxyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKDAsIDAsIDE1KVxyXG4gICAgZ2FtZS5hZGRDaGlsZCh0aGlzKVxyXG4gIH1cclxuXHJcbiAgb25VcGRhdGUoKSB7XHJcbiAgICB0aGlzLmhpc3RvcnkucHVzaChbdGhpcy54LCB0aGlzLnldKVxyXG4gICAgdGhpcy54ID0gbW91c2VYXHJcbiAgICB0aGlzLnkgPSBtb3VzZVlcclxuICAgIHdoaWxlICh0aGlzLmhpc3RvcnkubGVuZ3RoID4gSElTVE9SWV9MRU5HVEgpIHRoaXMuaGlzdG9yeS5zaGlmdCgpXHJcbiAgfVxyXG5cclxuICBvbkRyYXcoKSB7XHJcbiAgICBsZXQgbGFzdCA9IHRoaXMuaGlzdG9yeVswXVxyXG4gICAgZm9yIChjb25zdCBwb3Mgb2YgdGhpcy5oaXN0b3J5KSB7XHJcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5oaXN0b3J5LmluZGV4T2YocG9zKVxyXG4gICAgICBzdHJva2UoZmxvb3IobWFwKGluZGV4LCB0aGlzLmhpc3RvcnkubGVuZ3RoLCAwLCAyNTUsIDApKSlcclxuICAgICAgc3Ryb2tlV2VpZ2h0KGZsb29yKG1hcChpbmRleCwgdGhpcy5oaXN0b3J5Lmxlbmd0aCwgMCwgdGhpcy5kaWFtZXRlciwgMCkpKVxyXG4gICAgICBsaW5lKC4uLmxhc3QsIC4uLnBvcylcclxuICAgICAgbGFzdCA9IHBvc1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCAiaW1wb3J0IHsgQ2lyY2xlIH0gZnJvbSBcImVudGl0eS1wNVwiXHJcbmltcG9ydCB7IGdhbWUgfSBmcm9tIFwiLi9nYW1lXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBCYWxsb29uIGV4dGVuZHMgQ2lyY2xlIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKHJhbmRvbSgwLCB3aWR0aCksIHJhbmRvbSgwLCBoZWlnaHQpLCByYW5kb20oNDAsIDYwKSwge1xyXG4gICAgICBmaWxsOiBjb2xvcihyYW5kb20oMTAwLCAyMDApLCByYW5kb20oMTAwLCAyMDApLCByYW5kb20oMTAwLCAyMDApKSxcclxuICAgICAgc3Ryb2tlOiBmYWxzZSxcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBvblVwZGF0ZSgpIHtcclxuICAgIGlmICh0aGlzLmlzSG92ZXJlZCkge1xyXG4gICAgICB0aGlzLnNldHRpbmdzLnN0cm9rZSA9IHtcclxuICAgICAgICBjb2xvcjogY29sb3IoMjU1KSxcclxuICAgICAgICB3ZWlnaHQ6IDUsXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc2V0dGluZ3Muc3Ryb2tlID0gZmFsc2VcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uVGVhcmRvd24oKSB7XHJcbiAgICBnYW1lLnNjb3JlKytcclxuICB9XHJcblxyXG4gIG9uTW91c2VSZWxlYXNlZCgpIHtcclxuICAgIGlmICh0aGlzLmlzSG92ZXJlZCkge1xyXG4gICAgICBpZiAodGhpcy5wYXJlbnQuY2hpbGRyZW4ubGVuZ3RoID4gMSlcclxuICAgICAgICB0aGlzLnBhcmVudC5zdG9wVHJhbnNtaXNzaW9uKFwibW91c2VSZWxlYXNlZFwiKVxyXG5cclxuICAgICAgdGhpcy5wYXJlbnQuYWRkQ2hpbGQobmV3IEJhbGxvb24oKSlcclxuICAgICAgdGhpcy50ZWFyZG93bigpXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsICJpbXBvcnQgeyBnYW1lIH0gZnJvbSBcIi4vZ2FtZVwiXHJcbmltcG9ydCB7IEJhbGxvb24gfSBmcm9tIFwiLi9iYWxsb29uXCJcclxuaW1wb3J0IHsgRW50aXR5IH0gZnJvbSBcImVudGl0eS1wNVwiXHJcblxyXG5leHBvcnQgY2xhc3MgQmFsbG9vbnMgZXh0ZW5kcyBFbnRpdHkge1xyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY291bnQ6IG51bWJlcikge1xyXG4gICAgc3VwZXIoKVxyXG4gICAgZ2FtZS5hZGRDaGlsZCh0aGlzKVxyXG4gIH1cclxuXHJcbiAgb25TZXR1cCgpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jb3VudDsgaSsrKSB7XHJcbiAgICAgIHRoaXMuYWRkQ2hpbGQobmV3IEJhbGxvb24oKSlcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7OztBQ2VPLHFCQUFhO0FBQUEsSUFvQ2xCLGNBQWM7QUFuQ0osc0JBQVc7QUFDWCx1QkFBWSxJQUFJO0FBR2hCLHdCQUFxQztBQUNyQyx5QkFBZ0Q7QUFBQSxRQUN4RCxPQUFPO0FBQUEsUUFDUCxNQUFNO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixVQUFVO0FBQUEsUUFDVixZQUFZO0FBQUEsUUFDWixhQUFhO0FBQUEsUUFDYixjQUFjO0FBQUEsUUFDZCxlQUFlO0FBQUE7QUFBQTtBQUFBLFFBR2IsVUFBVTtBQUNaLGFBQU8sS0FBSztBQUFBO0FBQUEsUUFHVixXQUEwQjtBQUM1QixhQUFPLENBQUMsR0FBRyxLQUFLO0FBQUE7QUFBQSxRQUdkLFNBQWlCO0FBeEN2QjtBQXlDSSxhQUFPLGlC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
