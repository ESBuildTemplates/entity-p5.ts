var app = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __reExport = (target, module, copyDefault, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toCommonJS = /* @__PURE__ */ ((cache) => {
    return (module, temp) => {
      return cache && cache.get(module) || (temp = __reExport(__markAsModule({}), module, 1), cache && cache.set(module, temp), temp);
    };
  })(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

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

  // node_modules/@ghom/entity-base/src/app/base.ts
  var Base = class {
    constructor() {
      this._isSetup = false;
      this._children = /* @__PURE__ */ new Set();
      this._listeners = [];
      this._stopPoints = {};
    }
    get isSetup() {
      return this._isSetup;
    }
    get children() {
      return [...this._children];
    }
    get parent() {
      return this._parent;
    }
    onSetup() {
    }
    onUpdate() {
    }
    onTeardown() {
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
      for (const child of this.children) {
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

  // node_modules/@ghom/entity-p5/src/app/entity.ts
  var Entity = class extends Base {
    constructor() {
      super(...arguments);
      this._children = /* @__PURE__ */ new Set();
    }
    get zIndex() {
      var _a, _b, _c;
      return (_c = (_b = this._zIndex) != null ? _b : (_a = this.parent) == null ? void 0 : _a.children.indexOf(this)) != null ? _c : 0;
    }
    get children() {
      return [...this._children];
    }
    onDraw() {
    }
    onMouseReleased() {
    }
    onMousePressed() {
    }
    onKeyReleased() {
    }
    onKeyPressed() {
    }
    draw() {
      if (this.isSetup) {
        this.onDraw();
        this.transmit("draw");
      } else {
        console.warn("Draw is called before setup");
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
  };

  // node_modules/@ghom/entity-p5/src/app/drawable.ts
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

  // node_modules/@ghom/entity-p5/src/app/shape.ts
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
    constructor() {
      super();
    }
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
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2luZGV4LnRzIiwgIm5vZGVfbW9kdWxlcy9AZ2hvbS9lbnRpdHktYmFzZS9zcmMvYXBwL2Jhc2UudHMiLCAibm9kZV9tb2R1bGVzL0BnaG9tL2VudGl0eS1wNS9zcmMvYXBwL2VudGl0eS50cyIsICJub2RlX21vZHVsZXMvQGdob20vZW50aXR5LXA1L3NyYy9hcHAvZHJhd2FibGUudHMiLCAibm9kZV9tb2R1bGVzL0BnaG9tL2VudGl0eS1wNS9zcmMvYXBwL3NoYXBlLnRzIiwgInNyYy9hcHAvZ2FtZS50cyIsICJzcmMvYXBwL2N1cnNvci50cyIsICJzcmMvYXBwL2JhbGxvb24udHMiLCAic3JjL2FwcC9iYWxsb29ucy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8vIEB0cy1jaGVja1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9AdHlwZXMvcDUvZ2xvYmFsLmQudHNcIiAvPlxuXG5pbXBvcnQgeyBnYW1lIH0gZnJvbSBcIi4vYXBwL2dhbWVcIlxuaW1wb3J0IHsgQ3Vyc29yIH0gZnJvbSBcIi4vYXBwL2N1cnNvclwiXG5pbXBvcnQgeyBCYWxsb29ucyB9IGZyb20gXCIuL2FwcC9iYWxsb29uc1wiXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCAoZXZlbnQpID0+IGV2ZW50LnByZXZlbnREZWZhdWx0KCkpXG5cbmV4cG9ydCBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgY3JlYXRlQ2FudmFzKFxuICAgIE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCwgd2luZG93LmlubmVyV2lkdGggfHwgMCksXG4gICAgTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCwgd2luZG93LmlubmVySGVpZ2h0IHx8IDApXG4gIClcblxuICBuZXcgQmFsbG9vbnMoMSlcbiAgbmV3IEN1cnNvcigpXG5cbiAgZ2FtZS5zZXR1cCgpXG4gIGdhbWUuc2NoZW1hKDIpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkcmF3KCkge1xuICBiYWNrZ3JvdW5kKDIwKVxuXG4gIGdhbWUuZHJhdygpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGUodGltZXN0YW1wOiBudW1iZXIpIHtcbiAgZ2FtZS51cGRhdGUoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24ga2V5UHJlc3NlZCgpIHt9XG5leHBvcnQgZnVuY3Rpb24ga2V5UmVsZWFzZWQoKSB7fVxuZXhwb3J0IGZ1bmN0aW9uIG1vdXNlUHJlc3NlZCgpIHtcbiAgZ2FtZS5tb3VzZVByZXNzZWQoKVxufVxuZXhwb3J0IGZ1bmN0aW9uIG1vdXNlUmVsZWFzZWQoKSB7XG4gIGdhbWUubW91c2VSZWxlYXNlZCgpXG59XG5cbi8qKlxuICogZGVidWcgaW1wb3J0cyAoYWNjZXNzaWJsZSBmcm9tIGZyb250ZW5kIGNvbnNvbGUgd2l0aCBgYXBwLnJvb3RgKVxuICovXG5leHBvcnQgY29uc3Qgcm9vdCA9IGdhbWVcbiIsICJleHBvcnQgdHlwZSBFbnRpdHlFdmVudE5hbWUgPSBcInNldHVwXCIgfCBcInVwZGF0ZVwiIHwgXCJ0ZWFyZG93blwiXG5cbmV4cG9ydCB0eXBlIEVudGl0eUxpc3RlbmVyPFxuICBFdmVudE5hbWUgZXh0ZW5kcyBzdHJpbmcsXG4gIFRoaXMgZXh0ZW5kcyBCYXNlPEV2ZW50TmFtZT5cbj4gPSAodGhpczogVGhpcywgaXQ6IFRoaXMpID0+IHVua25vd25cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJhc2U8RXZlbnROYW1lIGV4dGVuZHMgc3RyaW5nPiB7XG4gIHByb3RlY3RlZCBfaXNTZXR1cCA9IGZhbHNlXG4gIHByb3RlY3RlZCBfY2hpbGRyZW4gPSBuZXcgU2V0PEJhc2U8RXZlbnROYW1lIHwgRW50aXR5RXZlbnROYW1lPj4oKVxuICBwcm90ZWN0ZWQgX3BhcmVudD86IEJhc2U8RXZlbnROYW1lIHwgRW50aXR5RXZlbnROYW1lPlxuICBwcm90ZWN0ZWQgX2xpc3RlbmVyczogRW50aXR5TGlzdGVuZXI8RXZlbnROYW1lIHwgRW50aXR5RXZlbnROYW1lLCB0aGlzPltdID0gW11cbiAgcHJvdGVjdGVkIF9zdG9wUG9pbnRzOiBQYXJ0aWFsPFJlY29yZDxFdmVudE5hbWUgfCBFbnRpdHlFdmVudE5hbWUsIGJvb2xlYW4+PiA9XG4gICAge31cblxuICBnZXQgaXNTZXR1cCgpIHtcbiAgICByZXR1cm4gdGhpcy5faXNTZXR1cFxuICB9XG5cbiAgZ2V0IGNoaWxkcmVuKCk6IEFycmF5PEJhc2U8RXZlbnROYW1lIHwgRW50aXR5RXZlbnROYW1lPj4ge1xuICAgIHJldHVybiBbLi4udGhpcy5fY2hpbGRyZW5dXG4gIH1cblxuICBnZXQgcGFyZW50KCk6IEJhc2U8RXZlbnROYW1lIHwgRW50aXR5RXZlbnROYW1lPiB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX3BhcmVudFxuICB9XG5cbiAgLyoqXG4gICAqIFJlcHJlc2VudCBhbnkgc3RhdGUtYmFzZWQgZW50aXR5XG4gICAqL1xuICBwcm90ZWN0ZWQgY29uc3RydWN0b3IoKSB7fVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIGJlIG92ZXJ3cml0dGVuIGJ5IHlvdXIgb3duIHdvcmtpbmdzXG4gICAqL1xuICBvblNldHVwKCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25VcGRhdGUoKSB7fVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIGJlIG92ZXJ3cml0dGVuIGJ5IHlvdXIgb3duIHdvcmtpbmdzXG4gICAqL1xuICBvblRlYXJkb3duKCkge31cblxuICAvKipcbiAgICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjdXJyZW50IGVudGl0eSBpcyBhIHJvb3QuXG4gICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXG4gICAqL1xuICBwdWJsaWMgc2V0dXAoKSB7XG4gICAgaWYgKCF0aGlzLmlzU2V0dXApIHtcbiAgICAgIHRoaXMub25TZXR1cCgpXG4gICAgICB0aGlzLnRyYW5zbWl0KFwic2V0dXBcIilcbiAgICAgIHRoaXMuX2lzU2V0dXAgPSB0cnVlXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkVudGl0eSBpcyBhbHJlYWR5IHNldHVwXCIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxuICAgKi9cbiAgcHVibGljIHVwZGF0ZSgpIHtcbiAgICBpZiAodGhpcy5pc1NldHVwKSB7XG4gICAgICB0aGlzLm9uVXBkYXRlKClcbiAgICAgIHRoaXMudHJhbnNtaXQoXCJ1cGRhdGVcIilcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKFwidXBkYXRlIGlzIGNhbGxlZCBiZWZvcmUgc2V0dXBcIilcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjdXJyZW50IGVudGl0eSBpcyBhIHJvb3QuXG4gICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXG4gICAqL1xuICBwdWJsaWMgdGVhcmRvd24oKSB7XG4gICAgaWYgKHRoaXMuaXNTZXR1cCkge1xuICAgICAgdGhpcy5faXNTZXR1cCA9IGZhbHNlXG4gICAgICB0aGlzLm9uVGVhcmRvd24oKVxuICAgICAgdGhpcy5fcGFyZW50Py5yZW1vdmVDaGlsZCh0aGlzKVxuICAgICAgdGhpcy50cmFuc21pdChcInRlYXJkb3duXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkVudGl0eSBtdXN0IGJlIHNldHVwIGJlZm9yZVwiKVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbihuYW1lOiBFdmVudE5hbWUsIGxpc3RlbmVyOiBFbnRpdHlMaXN0ZW5lcjxFdmVudE5hbWUsIHRoaXM+KSB7XG4gICAgdGhpcy5fbGlzdGVuZXJzLnB1c2goXG4gICAgICB7XG4gICAgICAgIFtuYW1lXSgpIHtcbiAgICAgICAgICBsaXN0ZW5lci5iaW5kKHRoaXMpKHRoaXMpXG4gICAgICAgIH0sXG4gICAgICB9W25hbWVdLmJpbmQodGhpcylcbiAgICApXG4gIH1cblxuICBwdWJsaWMgYWRkQ2hpbGQoLi4uY2hpbGRyZW46IEJhc2U8RXZlbnROYW1lPltdKSB7XG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgICAgY2hpbGQuX3BhcmVudCA9IHRoaXNcbiAgICAgIHRoaXMuX2NoaWxkcmVuLmFkZChjaGlsZClcbiAgICAgIGlmICh0aGlzLmlzU2V0dXApIGNoaWxkLnNldHVwKClcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVtb3ZlQ2hpbGQoLi4uY2hpbGRyZW46IEJhc2U8RXZlbnROYW1lPltdKSB7XG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgICAgaWYgKGNoaWxkLmlzU2V0dXApIGNoaWxkLnRlYXJkb3duKClcbiAgICAgIGVsc2UgdGhpcy5fY2hpbGRyZW4uZGVsZXRlKGNoaWxkKVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzdG9wVHJhbnNtaXNzaW9uKG5hbWU6IEV2ZW50TmFtZSB8IEVudGl0eUV2ZW50TmFtZSkge1xuICAgIHRoaXMuX3N0b3BQb2ludHNbbmFtZV0gPSB0cnVlXG4gIH1cblxuICBwdWJsaWMgdHJhbnNtaXQobmFtZTogRXZlbnROYW1lIHwgRW50aXR5RXZlbnROYW1lKSB7XG4gICAgZm9yIChjb25zdCBsaXN0ZW5lciBvZiB0aGlzLmdldExpc3RlbmVyc0J5TmFtZShuYW1lKSlcbiAgICAgIGxpc3RlbmVyLmJpbmQodGhpcykodGhpcylcblxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikge1xuICAgICAgaWYgKHRoaXMuX3N0b3BQb2ludHNbbmFtZV0pIHtcbiAgICAgICAgdGhpcy5fc3RvcFBvaW50c1tuYW1lXSA9IGZhbHNlXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBjaGlsZFtuYW1lXSgpXG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldExpc3RlbmVyc0J5TmFtZShuYW1lOiBFdmVudE5hbWUgfCBFbnRpdHlFdmVudE5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fbGlzdGVuZXJzLmZpbHRlcigobGlzdGVuZXIpID0+IHtcbiAgICAgIHJldHVybiBsaXN0ZW5lci5uYW1lID09PSBuYW1lXG4gICAgfSlcbiAgfVxuXG4gIHB1YmxpYyBzY2hlbWEoXG4gICAgaW5kZW50YXRpb24gPSAyLFxuICAgIGRlcHRoID0gMCxcbiAgICBpbmRleDogbnVtYmVyIHwgbnVsbCA9IG51bGxcbiAgKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCR7XCIgXCIucmVwZWF0KGluZGVudGF0aW9uKS5yZXBlYXQoZGVwdGgpfSR7XG4gICAgICBpbmRleCA9PT0gbnVsbCA/IFwiXCIgOiBgJHtpbmRleH0gLSBgXG4gICAgfSR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSBbJHt0aGlzLmlzU2V0dXAgPyBcIm9uXCIgOiBcIm9mZlwifV0ke1xuICAgICAgdGhpcy5fY2hpbGRyZW4uc2l6ZSA+IDBcbiAgICAgICAgPyBgOlxcbiR7dGhpcy5jaGlsZHJlblxuICAgICAgICAgICAgLm1hcChcbiAgICAgICAgICAgICAgKGNoaWxkLCBpbmRleCkgPT4gYCR7Y2hpbGQuc2NoZW1hKGluZGVudGF0aW9uLCBkZXB0aCArIDEsIGluZGV4KX1gXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuam9pbihcIlxcblwiKX1gXG4gICAgICAgIDogXCJcIlxuICAgIH1gXG4gIH1cbn1cbiIsICJpbXBvcnQgeyBCYXNlIH0gZnJvbSBcIkBnaG9tL2VudGl0eS1iYXNlXCJcblxuZXhwb3J0IHR5cGUgRW50aXR5RXZlbnROYW1lID1cbiAgfCBcInNldHVwXCJcbiAgfCBcInVwZGF0ZVwiXG4gIHwgXCJ0ZWFyZG93blwiXG4gIHwgXCJkcmF3XCJcbiAgfCBcIm1vdXNlUHJlc3NlZFwiXG4gIHwgXCJtb3VzZVJlbGVhc2VkXCJcbiAgfCBcImtleVByZXNzZWRcIlxuICB8IFwia2V5UmVsZWFzZWRcIlxuXG5leHBvcnQgY2xhc3MgRW50aXR5IGV4dGVuZHMgQmFzZTxFbnRpdHlFdmVudE5hbWU+IHtcbiAgcHJvdGVjdGVkIF9jaGlsZHJlbiA9IG5ldyBTZXQ8RW50aXR5PigpXG4gIHByb3RlY3RlZCBfekluZGV4PzogbnVtYmVyXG5cbiAgZ2V0IHpJbmRleCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl96SW5kZXggPz8gdGhpcy5wYXJlbnQ/LmNoaWxkcmVuLmluZGV4T2YodGhpcykgPz8gMFxuICB9XG5cbiAgZ2V0IGNoaWxkcmVuKCk6IEFycmF5PEVudGl0eT4ge1xuICAgIHJldHVybiBbLi4udGhpcy5fY2hpbGRyZW5dXG4gIH1cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25EcmF3KCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25Nb3VzZVJlbGVhc2VkKCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25Nb3VzZVByZXNzZWQoKSB7fVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIGJlIG92ZXJ3cml0dGVuIGJ5IHlvdXIgb3duIHdvcmtpbmdzXG4gICAqL1xuICBvbktleVJlbGVhc2VkKCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25LZXlQcmVzc2VkKCkge31cblxuICAvKipcbiAgICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjdXJyZW50IGVudGl0eSBpcyBhIHJvb3QuXG4gICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXG4gICAqL1xuICBwdWJsaWMgZHJhdygpIHtcbiAgICBpZiAodGhpcy5pc1NldHVwKSB7XG4gICAgICB0aGlzLm9uRHJhdygpXG4gICAgICB0aGlzLnRyYW5zbWl0KFwiZHJhd1wiKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJEcmF3IGlzIGNhbGxlZCBiZWZvcmUgc2V0dXBcIilcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjdXJyZW50IGVudGl0eSBpcyBhIHJvb3QuXG4gICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXG4gICAqL1xuICBwdWJsaWMgbW91c2VQcmVzc2VkKCkge1xuICAgIGlmICh0aGlzLmlzU2V0dXApIHtcbiAgICAgIHRoaXMub25Nb3VzZVByZXNzZWQoKVxuICAgICAgdGhpcy50cmFuc21pdChcIm1vdXNlUHJlc3NlZFwiKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJtb3VzZVByZXNzZWQgaXMgY2FsbGVkIGJlZm9yZSBzZXR1cFwiKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cbiAgICogU2hvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiFcbiAgICovXG4gIHB1YmxpYyBtb3VzZVJlbGVhc2VkKCkge1xuICAgIGlmICh0aGlzLmlzU2V0dXApIHtcbiAgICAgIHRoaXMub25Nb3VzZVJlbGVhc2VkKClcbiAgICAgIHRoaXMudHJhbnNtaXQoXCJtb3VzZVJlbGVhc2VkXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybihcIm1vdXNlUHJlc3NlZCBpcyBjYWxsZWQgYmVmb3JlIHNldHVwXCIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxuICAgKi9cbiAgcHVibGljIGtleVByZXNzZWQoKSB7XG4gICAgaWYgKHRoaXMuaXNTZXR1cCkge1xuICAgICAgdGhpcy5vbktleVByZXNzZWQoKVxuICAgICAgdGhpcy50cmFuc21pdChcImtleVByZXNzZWRcIilcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKFwia2V5UHJlc3NlZCBpcyBjYWxsZWQgYmVmb3JlIHNldHVwXCIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxuICAgKi9cbiAgcHVibGljIGtleVJlbGVhc2VkKCkge1xuICAgIGlmICh0aGlzLmlzU2V0dXApIHtcbiAgICAgIHRoaXMub25LZXlSZWxlYXNlZCgpXG4gICAgICB0aGlzLnRyYW5zbWl0KFwia2V5UmVsZWFzZWRcIilcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKFwia2V5UmVsZWFzZWQgaXMgY2FsbGVkIGJlZm9yZSBzZXR1cFwiKVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB0cmFuc21pdChuYW1lOiBFbnRpdHlFdmVudE5hbWUpIHtcbiAgICBmb3IgKGNvbnN0IGxpc3RlbmVyIG9mIHRoaXMuZ2V0TGlzdGVuZXJzQnlOYW1lKG5hbWUpKVxuICAgICAgbGlzdGVuZXIuYmluZCh0aGlzKSh0aGlzKVxuXG4gICAgbGV0IGNoaWxkcmVuID1cbiAgICAgIG5hbWUgPT09IFwibW91c2VSZWxlYXNlZFwiIHx8XG4gICAgICBuYW1lID09PSBcIm1vdXNlUHJlc3NlZFwiIHx8XG4gICAgICBuYW1lID09PSBcImtleVByZXNzZWRcIiB8fFxuICAgICAgbmFtZSA9PT0gXCJrZXlSZWxlYXNlZFwiXG4gICAgICAgID8gdGhpcy5jaGlsZHJlbi5zb3J0KChhLCBiKSA9PiBhLnpJbmRleCAtIGIuekluZGV4KVxuICAgICAgICA6IHRoaXMuY2hpbGRyZW4uc29ydCgoYSwgYikgPT4gYi56SW5kZXggLSBhLnpJbmRleClcblxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgIGlmICh0aGlzLl9zdG9wUG9pbnRzW25hbWVdKSB7XG4gICAgICAgIHRoaXMuX3N0b3BQb2ludHNbbmFtZV0gPSBmYWxzZVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY2hpbGRbbmFtZV0oKVxuICAgIH1cbiAgfVxufVxuIiwgImltcG9ydCB7IEVudGl0eSB9IGZyb20gXCIuL2VudGl0eVwiXG5cbmV4cG9ydCBpbnRlcmZhY2UgRHJhd2FibGVTZXR0aW5ncyB7XG4gIGZpbGw6IGZhbHNlIHwgRmlsbE9wdGlvbnNcbiAgc3Ryb2tlOiBmYWxzZSB8IFN0cm9rZU9wdGlvbnNcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIERyYXdhYmxlIGV4dGVuZHMgRW50aXR5IHtcbiAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzZXR0aW5ncz86IERyYXdhYmxlU2V0dGluZ3MpIHtcbiAgICBzdXBlcigpXG4gIH1cblxuICBvbkRyYXcoKSB7XG4gICAgaWYgKCF0aGlzLnNldHRpbmdzKSByZXR1cm5cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmZpbGwpIHtcbiAgICAgIGlmIChcImNvbG9yXCIgaW4gdGhpcy5zZXR0aW5ncy5maWxsKSB7XG4gICAgICAgIGZpbGwodGhpcy5zZXR0aW5ncy5maWxsLmNvbG9yKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmlsbCh0aGlzLnNldHRpbmdzLmZpbGwpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3Muc3Ryb2tlKSB7XG4gICAgICBzdHJva2VXZWlnaHQodGhpcy5zZXR0aW5ncy5zdHJva2Uud2VpZ2h0KVxuICAgICAgc3Ryb2tlKHRoaXMuc2V0dGluZ3Muc3Ryb2tlLmNvbG9yKVxuICAgIH0gZWxzZSB7XG4gICAgICBub1N0cm9rZSgpXG4gICAgfVxuICB9XG59XG4iLCAiaW1wb3J0IHsgRHJhd2FibGUsIERyYXdhYmxlU2V0dGluZ3MgfSBmcm9tIFwiLi9kcmF3YWJsZVwiXG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTaGFwZVxuICBleHRlbmRzIERyYXdhYmxlXG4gIGltcGxlbWVudHMgUG9zaXRpb25hYmxlLCBSZXNpemFibGVcbntcbiAgYWJzdHJhY3QgeDogbnVtYmVyXG4gIGFic3RyYWN0IHk6IG51bWJlclxuICBhYnN0cmFjdCB3aWR0aDogbnVtYmVyXG4gIGFic3RyYWN0IGhlaWdodDogbnVtYmVyXG4gIGFic3RyYWN0IHJlYWRvbmx5IGNlbnRlclg6IG51bWJlclxuICBhYnN0cmFjdCByZWFkb25seSBjZW50ZXJZOiBudW1iZXJcblxuICBnZXQgY2VudGVyKCk6IFt4OiBudW1iZXIsIHk6IG51bWJlcl0ge1xuICAgIHJldHVybiBbdGhpcy5jZW50ZXJYLCB0aGlzLmNlbnRlclldXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJlY3QgZXh0ZW5kcyBTaGFwZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyB4ID0gMCxcbiAgICBwdWJsaWMgeSA9IDAsXG4gICAgcHVibGljIHdpZHRoID0gMCxcbiAgICBwdWJsaWMgaGVpZ2h0ID0gMCxcbiAgICBvcHRpb25zPzogRHJhd2FibGVTZXR0aW5nc1xuICApIHtcbiAgICBzdXBlcihvcHRpb25zKVxuICB9XG5cbiAgZ2V0IGNlbnRlclgoKSB7XG4gICAgcmV0dXJuIHRoaXMueCArIHRoaXMud2lkdGggLyAyXG4gIH1cblxuICBnZXQgY2VudGVyWSgpIHtcbiAgICByZXR1cm4gdGhpcy55ICsgdGhpcy5oZWlnaHQgLyAyXG4gIH1cblxuICBnZXQgaXNIb3ZlcmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICBtb3VzZVggPiB0aGlzLnggJiZcbiAgICAgIG1vdXNlWCA8IHRoaXMueCArIHRoaXMud2lkdGggJiZcbiAgICAgIG1vdXNlWSA+IHRoaXMueSAmJlxuICAgICAgbW91c2VZIDwgdGhpcy55ICsgdGhpcy5oZWlnaHRcbiAgICApXG4gIH1cblxuICBvbkRyYXcoKSB7XG4gICAgc3VwZXIub25EcmF3KClcbiAgICByZWN0KHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ2lyY2xlIGV4dGVuZHMgU2hhcGUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgeCA9IDAsXG4gICAgcHVibGljIHkgPSAwLFxuICAgIHB1YmxpYyBkaWFtZXRlciA9IDAsXG4gICAgb3B0aW9ucz86IERyYXdhYmxlU2V0dGluZ3NcbiAgKSB7XG4gICAgc3VwZXIob3B0aW9ucylcbiAgfVxuXG4gIGdldCB3aWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5kaWFtZXRlclxuICB9XG5cbiAgZ2V0IGhlaWdodCgpIHtcbiAgICByZXR1cm4gdGhpcy5kaWFtZXRlclxuICB9XG5cbiAgZ2V0IGNlbnRlclgoKSB7XG4gICAgcmV0dXJuIHRoaXMueFxuICB9XG5cbiAgZ2V0IGNlbnRlclkoKSB7XG4gICAgcmV0dXJuIHRoaXMueVxuICB9XG5cbiAgZ2V0IGlzSG92ZXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZGlzdChtb3VzZVgsIG1vdXNlWSwgdGhpcy54LCB0aGlzLnkpIDwgdGhpcy5kaWFtZXRlciAvIDJcbiAgfVxuXG4gIG9uRHJhdygpIHtcbiAgICBzdXBlci5vbkRyYXcoKVxuICAgIGNpcmNsZSh0aGlzLngsIHRoaXMueSwgdGhpcy5kaWFtZXRlcilcbiAgfVxufVxuIiwgImltcG9ydCB7IEVudGl0eSB9IGZyb20gXCJAZ2hvbS9lbnRpdHktcDVcIlxuXG5leHBvcnQgY2xhc3MgR2FtZSBleHRlbmRzIEVudGl0eSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKClcbiAgfVxuXG4gIHNjb3JlOiBudW1iZXJcbn1cblxuZXhwb3J0IGNvbnN0IGdhbWUgPSBuZXcgR2FtZSgpXG4iLCAiaW1wb3J0IHsgZ2FtZSB9IGZyb20gXCIuL2dhbWVcIlxuaW1wb3J0IHsgQ2lyY2xlIH0gZnJvbSBcIkBnaG9tL2VudGl0eS1wNVwiXG5cbmNvbnN0IEhJU1RPUllfTEVOR1RIID0gMTAwXG5cbmV4cG9ydCBjbGFzcyBDdXJzb3IgZXh0ZW5kcyBDaXJjbGUge1xuICBwdWJsaWMgaGlzdG9yeTogW3g6IG51bWJlciwgeTogbnVtYmVyXVtdID0gW11cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigwLCAwLCAxNSlcbiAgICBnYW1lLmFkZENoaWxkKHRoaXMpXG4gIH1cblxuICBvblVwZGF0ZSgpIHtcbiAgICB0aGlzLmhpc3RvcnkucHVzaChbdGhpcy54LCB0aGlzLnldKVxuICAgIHRoaXMueCA9IG1vdXNlWFxuICAgIHRoaXMueSA9IG1vdXNlWVxuICAgIHdoaWxlICh0aGlzLmhpc3RvcnkubGVuZ3RoID4gSElTVE9SWV9MRU5HVEgpIHRoaXMuaGlzdG9yeS5zaGlmdCgpXG4gIH1cblxuICBvbkRyYXcoKSB7XG4gICAgbGV0IGxhc3QgPSB0aGlzLmhpc3RvcnlbMF1cbiAgICBmb3IgKGNvbnN0IHBvcyBvZiB0aGlzLmhpc3RvcnkpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5oaXN0b3J5LmluZGV4T2YocG9zKVxuICAgICAgc3Ryb2tlKGZsb29yKG1hcChpbmRleCwgdGhpcy5oaXN0b3J5Lmxlbmd0aCwgMCwgMjU1LCAwKSkpXG4gICAgICBzdHJva2VXZWlnaHQoZmxvb3IobWFwKGluZGV4LCB0aGlzLmhpc3RvcnkubGVuZ3RoLCAwLCB0aGlzLmRpYW1ldGVyLCAwKSkpXG4gICAgICBsaW5lKC4uLmxhc3QsIC4uLnBvcylcbiAgICAgIGxhc3QgPSBwb3NcbiAgICB9XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBDaXJjbGUgfSBmcm9tIFwiQGdob20vZW50aXR5LXA1XCJcbmltcG9ydCB7IGdhbWUgfSBmcm9tIFwiLi9nYW1lXCJcblxuZXhwb3J0IGNsYXNzIEJhbGxvb24gZXh0ZW5kcyBDaXJjbGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihyYW5kb20oMCwgd2lkdGgpLCByYW5kb20oMCwgaGVpZ2h0KSwgcmFuZG9tKDQwLCA2MCksIHtcbiAgICAgIGZpbGw6IGNvbG9yKHJhbmRvbSgxMDAsIDIwMCksIHJhbmRvbSgxMDAsIDIwMCksIHJhbmRvbSgxMDAsIDIwMCkpLFxuICAgICAgc3Ryb2tlOiBmYWxzZSxcbiAgICB9KVxuICB9XG5cbiAgb25VcGRhdGUoKSB7XG4gICAgaWYgKHRoaXMuaXNIb3ZlcmVkKSB7XG4gICAgICB0aGlzLnNldHRpbmdzLnN0cm9rZSA9IHtcbiAgICAgICAgY29sb3I6IGNvbG9yKDI1NSksXG4gICAgICAgIHdlaWdodDogNSxcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXR0aW5ncy5zdHJva2UgPSBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIG9uVGVhcmRvd24oKSB7XG4gICAgZ2FtZS5zY29yZSsrXG4gIH1cblxuICBvbk1vdXNlUmVsZWFzZWQoKSB7XG4gICAgaWYgKHRoaXMuaXNIb3ZlcmVkKSB7XG4gICAgICBpZiAodGhpcy5wYXJlbnQuY2hpbGRyZW4ubGVuZ3RoID4gMSlcbiAgICAgICAgdGhpcy5wYXJlbnQuc3RvcFRyYW5zbWlzc2lvbihcIm1vdXNlUmVsZWFzZWRcIilcblxuICAgICAgdGhpcy5wYXJlbnQuYWRkQ2hpbGQobmV3IEJhbGxvb24oKSlcbiAgICAgIHRoaXMudGVhcmRvd24oKVxuICAgIH1cbiAgfVxufVxuIiwgImltcG9ydCB7IGdhbWUgfSBmcm9tIFwiLi9nYW1lXCJcbmltcG9ydCB7IEJhbGxvb24gfSBmcm9tIFwiLi9iYWxsb29uXCJcbmltcG9ydCB7IEVudGl0eSB9IGZyb20gXCJAZ2hvbS9lbnRpdHktcDVcIlxuXG5leHBvcnQgY2xhc3MgQmFsbG9vbnMgZXh0ZW5kcyBFbnRpdHkge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvdW50OiBudW1iZXIpIHtcbiAgICBzdXBlcigpXG4gICAgZ2FtZS5hZGRDaGlsZCh0aGlzKVxuICB9XG5cbiAgb25TZXR1cCgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY291bnQ7IGkrKykge1xuICAgICAgdGhpcy5hZGRDaGlsZChuZXcgQmFsbG9vbigpKVxuICAgIH1cbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7OztBQ09PLG1CQUE4QztBQUFBLElBdUJ6QyxjQUFjO0FBdEJkLHNCQUFXO0FBQ1gsdUJBQVksb0JBQUk7QUFFaEIsd0JBQWtFO0FBQ2xFLHlCQUNSO0FBQUE7QUFBQSxRQUVFLFVBQVU7QUFDWixhQUFPLEtBQUs7QUFBQTtBQUFBLFFBR1YsV0FBcUQ7QUFDdkQsYUFBTyxDQUFDLEdBQUcsS0FBSztBQUFBO0FBQUEsUUFHZCxTQUF3RDtBQUMxRCxhQUFPLEtBQUs7QUFBQTtBQUFBLElBV2QsVUFBVTtBQUFBO0FBQUEsSUFLVixXQUFXO0FBQUE7QUFBQSxJQUtYLGFBQWE7QUFBQTtBQUFBLElBTU4sUUFBUTtBQUNiLFVBQUksQ0FBQyxLQUFLLFNBQVM7QUFDakIsYUFBSztBQUNMLGFBQUssU0FBUztBQUNkLGFBQUssV0FBVztBQUFBLGFBQ1g7QUFDTCxjQUFNLElBQUksTUFBTTtBQUFBO0FBQUE7QUFBQSxJQVFiLFNBQVM7QUFDZCxVQUFJLEtBQUssU0FBUztBQUNoQixhQUFLO0FBQ0wsYUFBSyxTQUFTO0FBQUEsYUFDVDtBQUNMLGdCQUFRLEtBQUs7QUFBQTtBQUFBO0FBQUEsSUFRVixXQUFXO0FBOUVwQjtBQStFSSxVQUFJLEtBQUssU0FBUztBQUNoQixhQUFLLFdBQVc7QUFDaEIsYUFBSztBQUNMLG1CQUFLLFlBQUwsbUJBQWMsWUFBWTtBQUMxQixhQUFLLFNBQVM7QUFBQSxhQUNUO0FBQ0wsY0FBTSxJQUFJLE1BQU07QUFBQTtBQUFBO0FBQUEsSUFJYixHQUFHLE1BQWlCLFVBQTJDO0FBQ3BFLFdBQUssV0FBVyxLQUNkO0FBQUEsU0FDRyxRQUFRO0FBQ1AsbUJBQVMsS0FBSyxNQUFNO0FBQUE7QUFBQSxRQUV0QixNQUFNLEtBQUs7QUFBQTtBQUFBLElBSVYsWUFBWSxVQUE2QjtBQUM5QyxpQkFBVyxTQUFTLFVBQVU7QUFDNUIsY0FBTSxVQUFVO0FBQ2hCLGFBQUssVUFBVSxJQUFJO0FBQ25CLFlBQUksS0FBSztBQUFTLGdCQUFNO0FBQUE7QUFBQTtBQUFBLElBSXJCLGVBQWUsVUFBNkI7QUFDakQsaUJBQVcsU0FBUyxVQUFVO0FBQzVCLFlBQUksTUFBTTtBQUFTLGdCQUFNO0FBQUE7QUFDcEIsZUFBSyxVQUFVLE9BQU87QUFBQTtBQUFBO0FBQUEsSUFJeEIsaUJBQWlCLE1BQW1DO0FBQ3pELFdBQUssWUFBWSxRQUFRO0FBQUE7QUFBQSxJQUdwQixTQUFTLE1BQW1DO0FBQ2pELGlCQUFXLFlBQVksS0FBSyxtQkFBbUI7QUFDN0MsaUJBQVMsS0FBSyxNQUFNO0FBRXRCLGlCQUFXLFNBQVMsS0FBSyxVQUFVO0FBQ2pDLFlBQUksS0FBSyxZQUFZLE9BQU87QUFDMUIsZUFBSyxZQUFZLFFBQVE7QUFDekI7QUFBQTtBQUlGLGNBQU07QUFBQTtBQUFBO0FBQUEsSUFJSCxtQkFBbUIsTUFBbUM7QUFDM0QsYUFBTyxLQUFLLFdBQVcsT0FBTyxDQUFDLGFBQWE7QUFDMUMsZUFBTyxTQUFTLFNBQVM7QUFBQTtBQUFBO0FBQUEsSUFJdEIsT0FDTCxjQUFjLEdBQ2QsUUFBUSxHQUNSLFFBQXVCLE1BQ2Y7QUFDUixhQUFPLEdBQUcsSUFBSSxPQUFPLGFBQWEsT0FBTyxTQUN2QyxVQUFVLE9BQU8sS0FBSyxHQUFHLGFBQ3hCLEtBQUssWUFBWSxTQUFTLEtBQUssVUFBVSxPQUFPLFNBQ2pELEtBQUssVUFBVSxPQUFPLElBQ2xCO0FBQUEsRUFBTSxLQUFLLFNBQ1IsSUFDQyxDQUFDLE9BQU8sV0FBVSxHQUFHLE1BQU0sT0FBTyxhQUFhLFFBQVEsR0FBRyxXQUUzRCxLQUFLLFVBQ1I7QUFBQTtBQUFBOzs7QUM3SUgsNkJBQXFCLEtBQXNCO0FBQUEsSUFBM0MsY0FaUDtBQVlPO0FBQ0ssdUJBQVksb0JBQUk7QUFBQTtBQUFBLFFBR3RCLFNBQWlCO0FBaEJ2QjtBQWlCSSxhQUFPLGlCQUFLLFlBQUwsWUFBZ0IsV0FBSyxXQUFMLG1CQUFhLFNBQVMsUUFBUSxVQUE5QyxZQUF1RDtBQUFBO0FBQUEsUUFHNUQsV0FBMEI7QUFDNUIsYUFBTyxDQUFDLEdBQUcsS0FBSztBQUFBO0FBQUEsSUFNbEIsU0FBUztBQUFBO0FBQUEsSUFLVCxrQkFBa0I7QUFBQTtBQUFBLElBS2xCLGlCQUFpQjtBQUFBO0FBQUEsSUFLakIsZ0JBQWdCO0FBQUE7QUFBQSxJQUtoQixlQUFlO0FBQUE7QUFBQSxJQU1SLE9BQU87QUFDWixVQUFJLEtBQUssU0FBUztBQUNoQixhQUFLO0FBQ0wsYUFBSyxTQUFTO0FBQUEsYUFDVDtBQUNMLGdCQUFRLEtBQUs7QUFBQTtBQUFBO0FBQUEsSUFRVixlQUFlO0FBQ3BCLFVBQUksS0FBSyxTQUFTO0FBQ2hCLGFBQUs7QUFDTCxhQUFLLFNBQVM7QUFBQSxhQUNUO0FBQ0wsZ0JBQVEsS0FBSztBQUFBO0FBQUE7QUFBQSxJQVFWLGdCQUFnQjtBQUNyQixVQUFJLEtBQUssU0FBUztBQUNoQixhQUFLO0FBQ0wsYUFBSyxTQUFTO0FBQUEsYUFDVDtBQUNMLGdCQUFRLEtBQUs7QUFBQTtBQUFBO0FBQUEsSUFRVixhQUFhO0FBQ2xCLFVBQUksS0FBSyxTQUFTO0FBQ2hCLGFBQUs7QUFDTCxhQUFLLFNBQVM7QUFBQSxhQUNUO0FBQ0wsZ0JBQVEsS0FBSztBQUFBO0FBQUE7QUFBQSxJQVFWLGNBQWM7QUFDbkIsVUFBSSxLQUFLLFNBQVM7QUFDaEIsYUFBSztBQUNMLGFBQUssU0FBUztBQUFBLGFBQ1Q7QUFDTCxnQkFBUSxLQUFLO0FBQUE7QUFBQTtBQUFBLElBSVYsU0FBUyxNQUF1QjtBQUNyQyxpQkFBVyxZQUFZLEtBQUssbUJBQW1CO0FBQzdDLGlCQUFTLEtBQUssTUFBTTtBQUV0QixVQUFJLFdBQ0YsU0FBUyxtQkFDVCxTQUFTLGtCQUNULFNBQVMsZ0JBQ1QsU0FBUyxnQkFDTCxLQUFLLFNBQVMsS0FBSyxDQUFDLEdBQUcsTUFBTSxFQUFFLFNBQVMsRUFBRSxVQUMxQyxLQUFLLFNBQVMsS0FBSyxDQUFDLEdBQUcsTUFBTSxFQUFFLFNBQVMsRUFBRTtBQUVoRCxpQkFBVyxTQUFTLFVBQVU7QUFDNUIsWUFBSSxLQUFLLFlBQVksT0FBTztBQUMxQixlQUFLLFlBQVksUUFBUTtBQUN6QjtBQUFBO0FBR0YsY0FBTTtBQUFBO0FBQUE7QUFBQTs7O0FDN0hMLCtCQUFnQyxPQUFPO0FBQUEsSUFDbEMsWUFBc0IsVUFBNkI7QUFDM0Q7QUFEOEI7QUFBQTtBQUFBLElBSWhDLFNBQVM7QUFDUCxVQUFJLENBQUMsS0FBSztBQUFVO0FBRXBCLFVBQUksS0FBSyxTQUFTLE1BQU07QUFDdEIsWUFBSSxXQUFXLEtBQUssU0FBUyxNQUFNO0FBQ2pDLGVBQUssS0FBSyxTQUFTLEtBQUs7QUFBQSxlQUNuQjtBQUNMLGVBQUssS0FBSyxTQUFTO0FBQUE7QUFBQTtBQUl2QixVQUFJLEtBQUssU0FBUyxRQUFRO0FBQ3hCLHFCQUFhLEtBQUssU0FBUyxPQUFPO0FBQ2xDLGVBQU8sS0FBSyxTQUFTLE9BQU87QUFBQSxhQUN2QjtBQUNMO0FBQUE7QUFBQTtBQUFBOzs7QUN6QkMsNEJBQ0csU0FFVjtBQUFBLFFBUU0sU0FBaUM7QUFDbkMsYUFBTyxDQUFDLEtBQUssU0FBUyxLQUFLO0FBQUE7QUFBQTtBQXNDeEIsNkJBQXFCLE1BQU07QUFBQSxJQUNoQyxZQUNTLElBQUksR0FDSixJQUFJLEdBQ0osV0FBVyxHQUNsQixTQUNBO0FBQ0EsWUFBTTtBQUxDO0FBQ0E7QUFDQTtBQUFBO0FBQUEsUUFNTCxRQUFRO0FBQ1YsYUFBTyxLQUFLO0FBQUE7QUFBQSxRQUdWLFNBQVM7QUFDWCxhQUFPLEtBQUs7QUFBQTtBQUFBLFFBR1YsVUFBVTtBQUNaLGFBQU8sS0FBSztBQUFBO0FBQUEsUUFHVixVQUFVO0FBQ1osYUFBTyxLQUFLO0FBQUE7QUFBQSxRQUdWLFlBQXFCO0FBQ3ZCLGFBQU8sS0FBSyxRQUFRLFFBQVEsS0FBSyxHQUFHLEtBQUssS0FBSyxLQUFLLFdBQVc7QUFBQTtBQUFBLElBR2hFLFNBQVM7QUFDUCxZQUFNO0FBQ04sYUFBTyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUs7QUFBQTtBQUFBOzs7QUNsRnpCLDJCQUFtQixPQUFPO0FBQUEsSUFDL0IsY0FBYztBQUNaO0FBQUE7QUFBQTtBQU1HLE1BQU0sT0FBTyxJQUFJOzs7QUNQeEIsTUFBTSxpQkFBaUI7QUFFaEIsNkJBQXFCLE9BQU87QUFBQSxJQUdqQyxjQUFjO0FBQ1osWUFBTSxHQUFHLEdBQUc7QUFIUCxxQkFBb0M7QUFJekMsV0FBSyxTQUFTO0FBQUE7QUFBQSxJQUdoQixXQUFXO0FBQ1QsV0FBSyxRQUFRLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSztBQUNoQyxXQUFLLElBQUk7QUFDVCxXQUFLLElBQUk7QUFDVCxhQUFPLEtBQUssUUFBUSxTQUFTO0FBQWdCLGFBQUssUUFBUTtBQUFBO0FBQUEsSUFHNUQsU0FBUztBQUNQLFVBQUksT0FBTyxLQUFLLFFBQVE7QUFDeEIsaUJBQVcsT0FBTyxLQUFLLFNBQVM7QUFDOUIsY0FBTSxRQUFRLEtBQUssUUFBUSxRQUFRO0FBQ25DLGVBQU8sTUFBTSxJQUFJLE9BQU8sS0FBSyxRQUFRLFFBQVEsR0FBRyxLQUFLO0FBQ3JELHFCQUFhLE1BQU0sSUFBSSxPQUFPLEtBQUssUUFBUSxRQUFRLEdBQUcsS0FBSyxVQUFVO0FBQ3JFLGFBQUssR0FBRyxNQUFNLEdBQUc7QUFDakIsZUFBTztBQUFBO0FBQUE7QUFBQTs7O0FDeEJOLDhCQUFzQixPQUFPO0FBQUEsSUFDbEMsY0FBYztBQUNaLFlBQU0sT0FBTyxHQUFHLFFBQVEsT0FBTyxHQUFHLFNBQVMsT0FBTyxJQUFJLEtBQUs7QUFBQSxRQUN6RCxNQUFNLE1BQU0sT0FBTyxLQUFLLE1BQU0sT0FBTyxLQUFLLE1BQU0sT0FBTyxLQUFLO0FBQUEsUUFDNUQsUUFBUTtBQUFBO0FBQUE7QUFBQSxJQUlaLFdBQVc7QUFDVCxVQUFJLEtBQUssV0FBVztBQUNsQixhQUFLLFNBQVMsU0FBUztBQUFBLFVBQ3JCLE9BQU8sTUFBTTtBQUFBLFVBQ2IsUUFBUTtBQUFBO0FBQUEsYUFFTDtBQUNMLGFBQUssU0FBUyxTQUFTO0FBQUE7QUFBQTtBQUFBLElBSTNCLGFBQWE7QUFDWCxXQUFLO0FBQUE7QUFBQSxJQUdQLGtCQUFrQjtBQUNoQixVQUFJLEtBQUssV0FBVztBQUNsQixZQUFJLEtBQUssT0FBTyxTQUFTLFNBQVM7QUFDaEMsZUFBSyxPQUFPLGlCQUFpQjtBQUUvQixhQUFLLE9BQU8sU0FBUyxJQUFJO0FBQ3pCLGFBQUs7QUFBQTtBQUFBO0FBQUE7OztBQzVCSiwrQkFBdUIsT0FBTztBQUFBLElBQ25DLFlBQW9CLE9BQWU7QUFDakM7QUFEa0I7QUFFbEIsV0FBSyxTQUFTO0FBQUE7QUFBQSxJQUdoQixVQUFVO0FBQ1IsZUFBUyxJQUFJLEdBQUcsSUFBSSxLQUFLLE9BQU8sS0FBSztBQUNuQyxhQUFLLFNBQVMsSUFBSTtBQUFBO0FBQUE7QUFBQTs7O0FSTHhCLFdBQVMsaUJBQWlCLGVBQWUsQ0FBQyxVQUFVLE1BQU07QUFFbkQsbUJBQWlCO0FBQ3RCLGlCQUNFLEtBQUssSUFBSSxTQUFTLGdCQUFnQixhQUFhLE9BQU8sY0FBYyxJQUNwRSxLQUFLLElBQUksU0FBUyxnQkFBZ0IsY0FBYyxPQUFPLGVBQWU7QUFHeEUsUUFBSSxTQUFTO0FBQ2IsUUFBSTtBQUVKLFNBQUs7QUFDTCxTQUFLLE9BQU87QUFBQTtBQUdQLGtCQUFnQjtBQUNyQixlQUFXO0FBRVgsU0FBSztBQUFBO0FBR0Esa0JBQWdCLFdBQW1CO0FBQ3hDLFNBQUs7QUFBQTtBQUdBLHdCQUFzQjtBQUFBO0FBQ3RCLHlCQUF1QjtBQUFBO0FBQ3ZCLDBCQUF3QjtBQUM3QixTQUFLO0FBQUE7QUFFQSwyQkFBeUI7QUFDOUIsU0FBSztBQUFBO0FBTUEsTUFBTSxPQUFPOyIsCiAgIm5hbWVzIjogW10KfQo=
