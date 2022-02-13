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
    Entity: () => Entity2,
    draw: () => draw,
    keyPressed: () => keyPressed,
    keyReleased: () => keyReleased,
    mousePressed: () => mousePressed,
    mouseReleased: () => mouseReleased,
    root: () => root,
    setup: () => setup
  });

  // src/lib/entity.ts
  var _Entity = class {
    constructor() {
      this._isSetup = false;
      this._children = new Set();
      this._listeners = [];
      this._stopPoints = {
        setup: false,
        draw: false,
        update: false,
        teardown: false,
        mousePressed: false,
        mouseReleased: false
      };
    }
    static schema(indentation = 2) {
      return console.log(this.root.schema(indentation < 1 ? 2 : indentation));
    }
    static setup() {
      this.root.setup();
    }
    static draw() {
      this.root.draw();
    }
    static update() {
      this.root.update();
    }
    static teardown() {
      this.root.teardown();
    }
    static mouseReleased() {
      this.root.mouseReleased();
    }
    static mousePressed() {
      this.root.mousePressed();
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
    mouseReleased() {
      if (this.isSetup) {
        this.onMouseReleased();
        this.transmit("mouseReleased");
      } else {
        console.warn("mousePressed is called before setup");
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
      let children = name === "mouseReleased" || name === "mousePressed" ? this.children.sort((a, b) => a.zIndex - b.zIndex) : this.children.sort((a, b) => b.zIndex - a.zIndex);
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
    schema(indentation, depth = 0, index = null) {
      return `${" ".repeat(indentation).repeat(depth)}${index === null ? "" : `${index} - `}${this.constructor.name} [${this.isSetup ? "on" : "off"}]${this._children.size > 0 ? `:
${this.children.map((child, index2) => `${child.schema(indentation, depth + 1, index2)}`).join("\n")}` : ""}`;
    }
  };
  var Entity = _Entity;
  Entity.root = new _Entity();

  // src/lib/drawable.ts
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

  // src/lib/shape.ts
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

  // src/app/cursor.ts
  var HISTORY_LENGTH = 100;
  var Cursor = class extends Circle {
    constructor() {
      super(0, 0, 15);
      this.history = [];
      Cursor.root.addChild(this);
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

  // src/app/game.ts
  var Game = class {
  };
  var game = new Game();

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
      Balloons.root.addChild(this);
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
    Entity.setup();
    Entity.schema(2);
  }
  function draw() {
    background(20);
    Entity.draw();
    Entity.update();
  }
  function keyPressed() {
  }
  function keyReleased() {
  }
  function mousePressed() {
    Entity.mousePressed();
  }
  function mouseReleased() {
    Entity.mouseReleased();
  }
  var root = Entity.root;
  var Entity2 = Entity;
  return src_exports;
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2luZGV4LnRzIiwgInNyYy9saWIvZW50aXR5LnRzIiwgInNyYy9saWIvZHJhd2FibGUudHMiLCAic3JjL2xpYi9zaGFwZS50cyIsICJzcmMvYXBwL2N1cnNvci50cyIsICJzcmMvYXBwL2dhbWUudHMiLCAic3JjL2FwcC9iYWxsb29uLnRzIiwgInNyYy9hcHAvYmFsbG9vbnMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vLyBAdHMtY2hlY2tcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvQHR5cGVzL3A1L2dsb2JhbC5kLnRzXCIgLz5cblxuaW1wb3J0ICogYXMgZW50aXR5IGZyb20gXCIuL2xpYi9lbnRpdHlcIlxuXG5pbXBvcnQgeyBDdXJzb3IgfSBmcm9tIFwiLi9hcHAvY3Vyc29yXCJcbmltcG9ydCB7IEJhbGxvb25zIH0gZnJvbSBcIi4vYXBwL2JhbGxvb25zXCJcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIChldmVudCkgPT4gZXZlbnQucHJldmVudERlZmF1bHQoKSlcblxuZXhwb3J0IGZ1bmN0aW9uIHNldHVwKCkge1xuICBjcmVhdGVDYW52YXMoXG4gICAgTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKSxcbiAgICBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0LCB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgMClcbiAgKVxuXG4gIG5ldyBCYWxsb29ucygxKVxuICBuZXcgQ3Vyc29yKClcblxuICBlbnRpdHkuRW50aXR5LnNldHVwKClcbiAgZW50aXR5LkVudGl0eS5zY2hlbWEoMilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRyYXcoKSB7XG4gIGJhY2tncm91bmQoMjApXG5cbiAgZW50aXR5LkVudGl0eS5kcmF3KClcbiAgZW50aXR5LkVudGl0eS51cGRhdGUoKVxufVxuXG4vLyB0b2RvOiBhZGQgZnJhbWVyYXRlIGxpbWl0IHNldHRpbmcgKHVzaW5nIERhdGEubm93KCkpXG4vLyBmaXhtZTogbm90IGNhbGxlZCBvbiB1cGRhdGVcbi8vIGZ1bmN0aW9uIHRpY2soKSB7XG4vLyAgIGVudGl0eS5yb290RW50aXR5LnVwZGF0ZSgpXG4vL1xuLy8gICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGljaylcbi8vIH1cblxuZXhwb3J0IGZ1bmN0aW9uIGtleVByZXNzZWQoKSB7fVxuZXhwb3J0IGZ1bmN0aW9uIGtleVJlbGVhc2VkKCkge31cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZVByZXNzZWQoKSB7XG4gIGVudGl0eS5FbnRpdHkubW91c2VQcmVzc2VkKClcbn1cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZVJlbGVhc2VkKCkge1xuICBlbnRpdHkuRW50aXR5Lm1vdXNlUmVsZWFzZWQoKVxufVxuXG5leHBvcnQgY29uc3Qgcm9vdCA9IGVudGl0eS5FbnRpdHkucm9vdFxuZXhwb3J0IGNvbnN0IEVudGl0eSA9IGVudGl0eS5FbnRpdHlcbiIsICJleHBvcnQgdHlwZSBFbnRpdHlFdmVudE5hbWUgPVxuICB8IFwic2V0dXBcIlxuICB8IFwiZHJhd1wiXG4gIHwgXCJ1cGRhdGVcIlxuICB8IFwidGVhcmRvd25cIlxuICB8IFwibW91c2VQcmVzc2VkXCJcbiAgfCBcIm1vdXNlUmVsZWFzZWRcIlxuXG5leHBvcnQgdHlwZSBFbnRpdHlMaXN0ZW5lcjxUaGlzIGV4dGVuZHMgRW50aXR5PiA9IChcbiAgdGhpczogVGhpcyxcbiAgaXQ6IFRoaXNcbikgPT4gdW5rbm93blxuXG5leHBvcnQgY2xhc3MgRW50aXR5IHtcbiAgLyoqXG4gICAqIFJvb3QgZW50aXR5IChqdXN0IG9uZSBwZXIgcHJvamVjdClcbiAgICovXG4gIHN0YXRpYyByb290ID0gbmV3IEVudGl0eSgpXG5cbiAgc3RhdGljIHNjaGVtYShpbmRlbnRhdGlvbiA9IDIpIHtcbiAgICByZXR1cm4gY29uc29sZS5sb2codGhpcy5yb290LnNjaGVtYShpbmRlbnRhdGlvbiA8IDEgPyAyIDogaW5kZW50YXRpb24pKVxuICB9XG5cbiAgc3RhdGljIHNldHVwKCkge1xuICAgIHRoaXMucm9vdC5zZXR1cCgpXG4gIH1cblxuICBzdGF0aWMgZHJhdygpIHtcbiAgICB0aGlzLnJvb3QuZHJhdygpXG4gIH1cblxuICBzdGF0aWMgdXBkYXRlKCkge1xuICAgIHRoaXMucm9vdC51cGRhdGUoKVxuICB9XG5cbiAgc3RhdGljIHRlYXJkb3duKCkge1xuICAgIHRoaXMucm9vdC50ZWFyZG93bigpXG4gIH1cblxuICBzdGF0aWMgbW91c2VSZWxlYXNlZCgpIHtcbiAgICB0aGlzLnJvb3QubW91c2VSZWxlYXNlZCgpXG4gIH1cblxuICBzdGF0aWMgbW91c2VQcmVzc2VkKCkge1xuICAgIHRoaXMucm9vdC5tb3VzZVByZXNzZWQoKVxuICB9XG5cbiAgcHJvdGVjdGVkIF9pc1NldHVwID0gZmFsc2VcbiAgcHJvdGVjdGVkIF9jaGlsZHJlbiA9IG5ldyBTZXQ8RW50aXR5PigpXG4gIHByb3RlY3RlZCBfekluZGV4PzogbnVtYmVyXG4gIHByb3RlY3RlZCBfcGFyZW50PzogRW50aXR5XG4gIHByb3RlY3RlZCBfbGlzdGVuZXJzOiBFbnRpdHlMaXN0ZW5lcjx0aGlzPltdID0gW11cbiAgcHJvdGVjdGVkIF9zdG9wUG9pbnRzOiBSZWNvcmQ8RW50aXR5RXZlbnROYW1lLCBib29sZWFuPiA9IHtcbiAgICBzZXR1cDogZmFsc2UsXG4gICAgZHJhdzogZmFsc2UsXG4gICAgdXBkYXRlOiBmYWxzZSxcbiAgICB0ZWFyZG93bjogZmFsc2UsXG4gICAgbW91c2VQcmVzc2VkOiBmYWxzZSxcbiAgICBtb3VzZVJlbGVhc2VkOiBmYWxzZSxcbiAgfVxuXG4gIGdldCBpc1NldHVwKCkge1xuICAgIHJldHVybiB0aGlzLl9pc1NldHVwXG4gIH1cblxuICBnZXQgY2hpbGRyZW4oKTogQXJyYXk8RW50aXR5PiB7XG4gICAgcmV0dXJuIFsuLi50aGlzLl9jaGlsZHJlbl1cbiAgfVxuXG4gIGdldCB6SW5kZXgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fekluZGV4ID8/IHRoaXMucGFyZW50Py5jaGlsZHJlbi5pbmRleE9mKHRoaXMpID8/IDBcbiAgfVxuXG4gIGdldCBwYXJlbnQoKTogRW50aXR5IHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyZW50XG4gIH1cblxuICAvKipcbiAgICogUmVwcmVzZW50IGFueSBzdGF0ZS1iYXNlZCBlbnRpdHlcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25TZXR1cCgpIHt9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcbiAgICovXG4gIG9uRHJhdygpIHt9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcbiAgICovXG4gIG9uVXBkYXRlKCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25UZWFyZG93bigpIHt9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcbiAgICovXG4gIG9uTW91c2VSZWxlYXNlZCgpIHt9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcbiAgICovXG4gIG9uTW91c2VQcmVzc2VkKCkge31cblxuICAvKipcbiAgICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjdXJyZW50IGVudGl0eSBpcyBhIHJvb3QuXG4gICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXG4gICAqL1xuICBwdWJsaWMgc2V0dXAoKSB7XG4gICAgaWYgKCF0aGlzLmlzU2V0dXApIHtcbiAgICAgIHRoaXMub25TZXR1cCgpXG4gICAgICB0aGlzLnRyYW5zbWl0KFwic2V0dXBcIilcbiAgICAgIHRoaXMuX2lzU2V0dXAgPSB0cnVlXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkVudGl0eSBpcyBhbHJlYWR5IHNldHVwXCIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxuICAgKi9cbiAgcHVibGljIGRyYXcoKSB7XG4gICAgaWYgKHRoaXMuaXNTZXR1cCkge1xuICAgICAgdGhpcy5vbkRyYXcoKVxuICAgICAgdGhpcy50cmFuc21pdChcImRyYXdcIilcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKFwiRHJhdyBpcyBjYWxsZWQgYmVmb3JlIHNldHVwXCIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxuICAgKi9cbiAgcHVibGljIHVwZGF0ZSgpIHtcbiAgICBpZiAodGhpcy5pc1NldHVwKSB7XG4gICAgICB0aGlzLm9uVXBkYXRlKClcbiAgICAgIHRoaXMudHJhbnNtaXQoXCJ1cGRhdGVcIilcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKFwidXBkYXRlIGlzIGNhbGxlZCBiZWZvcmUgc2V0dXBcIilcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjdXJyZW50IGVudGl0eSBpcyBhIHJvb3QuXG4gICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXG4gICAqL1xuICBwdWJsaWMgdGVhcmRvd24oKSB7XG4gICAgaWYgKHRoaXMuaXNTZXR1cCkge1xuICAgICAgdGhpcy5faXNTZXR1cCA9IGZhbHNlXG4gICAgICB0aGlzLm9uVGVhcmRvd24oKVxuICAgICAgdGhpcy5fcGFyZW50Py5yZW1vdmVDaGlsZCh0aGlzKVxuICAgICAgdGhpcy50cmFuc21pdChcInRlYXJkb3duXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkVudGl0eSBtdXN0IGJlIHNldHVwIGJlZm9yZVwiKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cbiAgICogU2hvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiFcbiAgICovXG4gIHB1YmxpYyBtb3VzZVJlbGVhc2VkKCkge1xuICAgIGlmICh0aGlzLmlzU2V0dXApIHtcbiAgICAgIHRoaXMub25Nb3VzZVJlbGVhc2VkKClcbiAgICAgIHRoaXMudHJhbnNtaXQoXCJtb3VzZVJlbGVhc2VkXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybihcIm1vdXNlUHJlc3NlZCBpcyBjYWxsZWQgYmVmb3JlIHNldHVwXCIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxuICAgKi9cbiAgcHVibGljIG1vdXNlUHJlc3NlZCgpIHtcbiAgICBpZiAodGhpcy5pc1NldHVwKSB7XG4gICAgICB0aGlzLm9uTW91c2VQcmVzc2VkKClcbiAgICAgIHRoaXMudHJhbnNtaXQoXCJtb3VzZVByZXNzZWRcIilcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKFwibW91c2VQcmVzc2VkIGlzIGNhbGxlZCBiZWZvcmUgc2V0dXBcIilcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb24obmFtZTogRW50aXR5RXZlbnROYW1lLCBsaXN0ZW5lcjogRW50aXR5TGlzdGVuZXI8dGhpcz4pIHtcbiAgICB0aGlzLl9saXN0ZW5lcnMucHVzaChcbiAgICAgIHtcbiAgICAgICAgW25hbWVdKCkge1xuICAgICAgICAgIGxpc3RlbmVyLmJpbmQodGhpcykodGhpcylcbiAgICAgICAgfSxcbiAgICAgIH1bbmFtZV0uYmluZCh0aGlzKVxuICAgIClcbiAgfVxuXG4gIHB1YmxpYyBhZGRDaGlsZCguLi5jaGlsZHJlbjogRW50aXR5W10pIHtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgICBjaGlsZC5fcGFyZW50ID0gdGhpc1xuICAgICAgdGhpcy5fY2hpbGRyZW4uYWRkKGNoaWxkKVxuICAgICAgaWYgKHRoaXMuaXNTZXR1cCkgY2hpbGQuc2V0dXAoKVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyByZW1vdmVDaGlsZCguLi5jaGlsZHJlbjogRW50aXR5W10pIHtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgICBpZiAoY2hpbGQuaXNTZXR1cCkgY2hpbGQudGVhcmRvd24oKVxuICAgICAgZWxzZSB0aGlzLl9jaGlsZHJlbi5kZWxldGUoY2hpbGQpXG4gICAgfVxuICB9XG5cbiAgcHVibGljIHN0b3BUcmFuc21pc3Npb24obmFtZTogRW50aXR5RXZlbnROYW1lKSB7XG4gICAgdGhpcy5fc3RvcFBvaW50c1tuYW1lXSA9IHRydWVcbiAgfVxuXG4gIHByaXZhdGUgdHJhbnNtaXQobmFtZTogRW50aXR5RXZlbnROYW1lKSB7XG4gICAgZm9yIChjb25zdCBsaXN0ZW5lciBvZiB0aGlzLmdldExpc3RlbmVyc0J5TmFtZShuYW1lKSlcbiAgICAgIGxpc3RlbmVyLmJpbmQodGhpcykodGhpcylcblxuICAgIGxldCBjaGlsZHJlbiA9XG4gICAgICBuYW1lID09PSBcIm1vdXNlUmVsZWFzZWRcIiB8fCBuYW1lID09PSBcIm1vdXNlUHJlc3NlZFwiXG4gICAgICAgID8gdGhpcy5jaGlsZHJlbi5zb3J0KChhLCBiKSA9PiBhLnpJbmRleCAtIGIuekluZGV4KVxuICAgICAgICA6IHRoaXMuY2hpbGRyZW4uc29ydCgoYSwgYikgPT4gYi56SW5kZXggLSBhLnpJbmRleClcblxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgIGlmICh0aGlzLl9zdG9wUG9pbnRzW25hbWVdKSB7XG4gICAgICAgIHRoaXMuX3N0b3BQb2ludHNbbmFtZV0gPSBmYWxzZVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY2hpbGRbbmFtZV0oKVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0TGlzdGVuZXJzQnlOYW1lKG5hbWU6IEVudGl0eUV2ZW50TmFtZSkge1xuICAgIHJldHVybiB0aGlzLl9saXN0ZW5lcnMuZmlsdGVyKChsaXN0ZW5lcikgPT4ge1xuICAgICAgcmV0dXJuIGxpc3RlbmVyLm5hbWUgPT09IG5hbWVcbiAgICB9KVxuICB9XG5cbiAgcHVibGljIHNjaGVtYShcbiAgICBpbmRlbnRhdGlvbjogbnVtYmVyLFxuICAgIGRlcHRoID0gMCxcbiAgICBpbmRleDogbnVtYmVyIHwgbnVsbCA9IG51bGxcbiAgKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCR7XCIgXCIucmVwZWF0KGluZGVudGF0aW9uKS5yZXBlYXQoZGVwdGgpfSR7XG4gICAgICBpbmRleCA9PT0gbnVsbCA/IFwiXCIgOiBgJHtpbmRleH0gLSBgXG4gICAgfSR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSBbJHt0aGlzLmlzU2V0dXAgPyBcIm9uXCIgOiBcIm9mZlwifV0ke1xuICAgICAgdGhpcy5fY2hpbGRyZW4uc2l6ZSA+IDBcbiAgICAgICAgPyBgOlxcbiR7dGhpcy5jaGlsZHJlblxuICAgICAgICAgICAgLm1hcChcbiAgICAgICAgICAgICAgKGNoaWxkLCBpbmRleCkgPT4gYCR7Y2hpbGQuc2NoZW1hKGluZGVudGF0aW9uLCBkZXB0aCArIDEsIGluZGV4KX1gXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuam9pbihcIlxcblwiKX1gXG4gICAgICAgIDogXCJcIlxuICAgIH1gXG4gIH1cbn1cbiIsICJpbXBvcnQgKiBhcyBlbnRpdHkgZnJvbSBcIi4vZW50aXR5XCJcblxuZXhwb3J0IGludGVyZmFjZSBEcmF3YWJsZVNldHRpbmdzIHtcbiAgZmlsbDogZmFsc2UgfCBGaWxsT3B0aW9uc1xuICBzdHJva2U6IGZhbHNlIHwgU3Ryb2tlT3B0aW9uc1xufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRHJhd2FibGUgZXh0ZW5kcyBlbnRpdHkuRW50aXR5IHtcbiAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzZXR0aW5ncz86IERyYXdhYmxlU2V0dGluZ3MpIHtcbiAgICBzdXBlcigpXG4gIH1cblxuICBvbkRyYXcoKSB7XG4gICAgaWYgKCF0aGlzLnNldHRpbmdzKSByZXR1cm5cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmZpbGwpIHtcbiAgICAgIGlmIChcImNvbG9yXCIgaW4gdGhpcy5zZXR0aW5ncy5maWxsKSB7XG4gICAgICAgIGZpbGwodGhpcy5zZXR0aW5ncy5maWxsLmNvbG9yKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmlsbCh0aGlzLnNldHRpbmdzLmZpbGwpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3Muc3Ryb2tlKSB7XG4gICAgICBzdHJva2VXZWlnaHQodGhpcy5zZXR0aW5ncy5zdHJva2Uud2VpZ2h0KVxuICAgICAgc3Ryb2tlKHRoaXMuc2V0dGluZ3Muc3Ryb2tlLmNvbG9yKVxuICAgIH0gZWxzZSB7XG4gICAgICBub1N0cm9rZSgpXG4gICAgfVxuICB9XG59XG4iLCAiaW1wb3J0IHsgRHJhd2FibGUsIERyYXdhYmxlU2V0dGluZ3MgfSBmcm9tIFwiLi9kcmF3YWJsZVwiXG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTaGFwZVxuICBleHRlbmRzIERyYXdhYmxlXG4gIGltcGxlbWVudHMgUG9zaXRpb25hYmxlLCBSZXNpemFibGVcbntcbiAgYWJzdHJhY3QgeDogbnVtYmVyXG4gIGFic3RyYWN0IHk6IG51bWJlclxuICBhYnN0cmFjdCB3aWR0aDogbnVtYmVyXG4gIGFic3RyYWN0IGhlaWdodDogbnVtYmVyXG4gIGFic3RyYWN0IHJlYWRvbmx5IGNlbnRlclg6IG51bWJlclxuICBhYnN0cmFjdCByZWFkb25seSBjZW50ZXJZOiBudW1iZXJcblxuICBnZXQgY2VudGVyKCk6IFt4OiBudW1iZXIsIHk6IG51bWJlcl0ge1xuICAgIHJldHVybiBbdGhpcy5jZW50ZXJYLCB0aGlzLmNlbnRlclldXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJlY3QgZXh0ZW5kcyBTaGFwZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyB4ID0gMCxcbiAgICBwdWJsaWMgeSA9IDAsXG4gICAgcHVibGljIHdpZHRoID0gMCxcbiAgICBwdWJsaWMgaGVpZ2h0ID0gMCxcbiAgICBvcHRpb25zPzogRHJhd2FibGVTZXR0aW5nc1xuICApIHtcbiAgICBzdXBlcihvcHRpb25zKVxuICB9XG5cbiAgZ2V0IGNlbnRlclgoKSB7XG4gICAgcmV0dXJuIHRoaXMueCArIHRoaXMud2lkdGggLyAyXG4gIH1cblxuICBnZXQgY2VudGVyWSgpIHtcbiAgICByZXR1cm4gdGhpcy55ICsgdGhpcy5oZWlnaHQgLyAyXG4gIH1cblxuICBnZXQgaXNIb3ZlcmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICBtb3VzZVggPiB0aGlzLnggJiZcbiAgICAgIG1vdXNlWCA8IHRoaXMueCArIHRoaXMud2lkdGggJiZcbiAgICAgIG1vdXNlWSA+IHRoaXMueSAmJlxuICAgICAgbW91c2VZIDwgdGhpcy55ICsgdGhpcy5oZWlnaHRcbiAgICApXG4gIH1cblxuICBvbkRyYXcoKSB7XG4gICAgc3VwZXIub25EcmF3KClcbiAgICByZWN0KHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ2lyY2xlIGV4dGVuZHMgU2hhcGUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgeCA9IDAsXG4gICAgcHVibGljIHkgPSAwLFxuICAgIHB1YmxpYyBkaWFtZXRlciA9IDAsXG4gICAgb3B0aW9ucz86IERyYXdhYmxlU2V0dGluZ3NcbiAgKSB7XG4gICAgc3VwZXIob3B0aW9ucylcbiAgfVxuXG4gIGdldCB3aWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5kaWFtZXRlclxuICB9XG5cbiAgZ2V0IGhlaWdodCgpIHtcbiAgICByZXR1cm4gdGhpcy5kaWFtZXRlclxuICB9XG5cbiAgZ2V0IGNlbnRlclgoKSB7XG4gICAgcmV0dXJuIHRoaXMueFxuICB9XG5cbiAgZ2V0IGNlbnRlclkoKSB7XG4gICAgcmV0dXJuIHRoaXMueVxuICB9XG5cbiAgZ2V0IGlzSG92ZXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZGlzdChtb3VzZVgsIG1vdXNlWSwgdGhpcy54LCB0aGlzLnkpIDwgdGhpcy5kaWFtZXRlciAvIDJcbiAgfVxuXG4gIG9uRHJhdygpIHtcbiAgICBzdXBlci5vbkRyYXcoKVxuICAgIGNpcmNsZSh0aGlzLngsIHRoaXMueSwgdGhpcy5kaWFtZXRlcilcbiAgfVxufVxuIiwgImltcG9ydCB7IENpcmNsZSB9IGZyb20gXCIuLi9saWIvc2hhcGVcIlxuXG5jb25zdCBISVNUT1JZX0xFTkdUSCA9IDEwMFxuXG5leHBvcnQgY2xhc3MgQ3Vyc29yIGV4dGVuZHMgQ2lyY2xlIHtcbiAgcHVibGljIGhpc3Rvcnk6IFt4OiBudW1iZXIsIHk6IG51bWJlcl1bXSA9IFtdXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoMCwgMCwgMTUpXG4gICAgQ3Vyc29yLnJvb3QuYWRkQ2hpbGQodGhpcylcbiAgfVxuXG4gIG9uVXBkYXRlKCkge1xuICAgIHRoaXMuaGlzdG9yeS5wdXNoKFt0aGlzLngsIHRoaXMueV0pXG4gICAgdGhpcy54ID0gbW91c2VYXG4gICAgdGhpcy55ID0gbW91c2VZXG4gICAgd2hpbGUgKHRoaXMuaGlzdG9yeS5sZW5ndGggPiBISVNUT1JZX0xFTkdUSCkgdGhpcy5oaXN0b3J5LnNoaWZ0KClcbiAgfVxuXG4gIG9uRHJhdygpIHtcbiAgICBsZXQgbGFzdCA9IHRoaXMuaGlzdG9yeVswXVxuICAgIGZvciAoY29uc3QgcG9zIG9mIHRoaXMuaGlzdG9yeSkge1xuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmhpc3RvcnkuaW5kZXhPZihwb3MpXG4gICAgICBzdHJva2UoZmxvb3IobWFwKGluZGV4LCB0aGlzLmhpc3RvcnkubGVuZ3RoLCAwLCAyNTUsIDApKSlcbiAgICAgIHN0cm9rZVdlaWdodChmbG9vcihtYXAoaW5kZXgsIHRoaXMuaGlzdG9yeS5sZW5ndGgsIDAsIHRoaXMuZGlhbWV0ZXIsIDApKSlcbiAgICAgIGxpbmUoLi4ubGFzdCwgLi4ucG9zKVxuICAgICAgbGFzdCA9IHBvc1xuICAgIH1cbiAgfVxufVxuIiwgImV4cG9ydCBjbGFzcyBHYW1lIHtcbiAgc2NvcmU6IG51bWJlclxufVxuXG5leHBvcnQgY29uc3QgZ2FtZSA9IG5ldyBHYW1lKClcbiIsICJpbXBvcnQgeyBDaXJjbGUgfSBmcm9tIFwiLi4vbGliL3NoYXBlXCJcbmltcG9ydCB7IGdhbWUgfSBmcm9tIFwiLi9nYW1lXCJcblxuZXhwb3J0IGNsYXNzIEJhbGxvb24gZXh0ZW5kcyBDaXJjbGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihyYW5kb20oMCwgd2lkdGgpLCByYW5kb20oMCwgaGVpZ2h0KSwgcmFuZG9tKDQwLCA2MCksIHtcbiAgICAgIGZpbGw6IGNvbG9yKHJhbmRvbSgxMDAsIDIwMCksIHJhbmRvbSgxMDAsIDIwMCksIHJhbmRvbSgxMDAsIDIwMCkpLFxuICAgICAgc3Ryb2tlOiBmYWxzZSxcbiAgICB9KVxuICB9XG5cbiAgb25VcGRhdGUoKSB7XG4gICAgaWYgKHRoaXMuaXNIb3ZlcmVkKSB7XG4gICAgICB0aGlzLnNldHRpbmdzLnN0cm9rZSA9IHtcbiAgICAgICAgY29sb3I6IGNvbG9yKDI1NSksXG4gICAgICAgIHdlaWdodDogNSxcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXR0aW5ncy5zdHJva2UgPSBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIG9uVGVhcmRvd24oKSB7XG4gICAgZ2FtZS5zY29yZSsrXG4gIH1cblxuICBvbk1vdXNlUmVsZWFzZWQoKSB7XG4gICAgaWYgKHRoaXMuaXNIb3ZlcmVkKSB7XG4gICAgICBpZiAodGhpcy5wYXJlbnQuY2hpbGRyZW4ubGVuZ3RoID4gMSlcbiAgICAgICAgdGhpcy5wYXJlbnQuc3RvcFRyYW5zbWlzc2lvbihcIm1vdXNlUmVsZWFzZWRcIilcblxuICAgICAgdGhpcy5wYXJlbnQuYWRkQ2hpbGQobmV3IEJhbGxvb24oKSlcbiAgICAgIHRoaXMudGVhcmRvd24oKVxuICAgIH1cbiAgfVxufVxuIiwgImltcG9ydCB7IEJhbGxvb24gfSBmcm9tIFwiLi9iYWxsb29uXCJcbmltcG9ydCB7IEVudGl0eSB9IGZyb20gXCIuLi9saWIvZW50aXR5XCJcblxuZXhwb3J0IGNsYXNzIEJhbGxvb25zIGV4dGVuZHMgRW50aXR5IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjb3VudDogbnVtYmVyKSB7XG4gICAgc3VwZXIoKVxuICAgIEJhbGxvb25zLnJvb3QuYWRkQ2hpbGQodGhpcylcbiAgfVxuXG4gIG9uU2V0dXAoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNvdW50OyBpKyspIHtcbiAgICAgIHRoaXMuYWRkQ2hpbGQobmV3IEJhbGxvb24oKSlcbiAgICB9XG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7QUNhTyxzQkFBYTtBQUFBLElBbUVsQixjQUFjO0FBakNKLHNCQUFXO0FBQ1gsdUJBQVksSUFBSTtBQUdoQix3QkFBcUM7QUFDckMseUJBQWdEO0FBQUEsUUFDeEQsT0FBTztBQUFBLFFBQ1As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
