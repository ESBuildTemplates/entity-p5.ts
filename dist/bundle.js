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

  // node_modules/@ghom/entity-p5/src/app/easing.ts
  var PI = Math.PI;
  var c1 = 1.70158;
  var c2 = c1 * 1.525;
  var c3 = c1 + 1;
  var c4 = 2 * PI / 3;
  var c5 = 2 * PI / 4.5;
  var bounceOut = function(x) {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (x < 1 / d1) {
      return n1 * x * x;
    } else if (x < 2 / d1) {
      return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
      return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
      return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
  };
  var easingSet = {
    linear: (x) => x,
    easeInQuad: function(x) {
      return x * x;
    },
    easeOutQuad: function(x) {
      return 1 - (1 - x) * (1 - x);
    },
    easeInOutQuad: function(x) {
      return x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;
    },
    easeInCubic: function(x) {
      return x * x * x;
    },
    easeOutCubic: function(x) {
      return 1 - pow(1 - x, 3);
    },
    easeInOutCubic: function(x) {
      return x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2;
    },
    easeInQuart: function(x) {
      return x * x * x * x;
    },
    easeOutQuart: function(x) {
      return 1 - pow(1 - x, 4);
    },
    easeInOutQuart: function(x) {
      return x < 0.5 ? 8 * x * x * x * x : 1 - pow(-2 * x + 2, 4) / 2;
    },
    easeInQuint: function(x) {
      return x * x * x * x * x;
    },
    easeOutQuint: function(x) {
      return 1 - pow(1 - x, 5);
    },
    easeInOutQuint: function(x) {
      return x < 0.5 ? 16 * x * x * x * x * x : 1 - pow(-2 * x + 2, 5) / 2;
    },
    easeInSine: function(x) {
      return 1 - cos(x * PI / 2);
    },
    easeOutSine: function(x) {
      return sin(x * PI / 2);
    },
    easeInOutSine: function(x) {
      return -(cos(PI * x) - 1) / 2;
    },
    easeInExpo: function(x) {
      return x === 0 ? 0 : pow(2, 10 * x - 10);
    },
    easeOutExpo: function(x) {
      return x === 1 ? 1 : 1 - pow(2, -10 * x);
    },
    easeInOutExpo: function(x) {
      return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? pow(2, 20 * x - 10) / 2 : (2 - pow(2, -20 * x + 10)) / 2;
    },
    easeInCirc: function(x) {
      return 1 - sqrt(1 - pow(x, 2));
    },
    easeOutCirc: function(x) {
      return sqrt(1 - pow(x - 1, 2));
    },
    easeInOutCirc: function(x) {
      return x < 0.5 ? (1 - sqrt(1 - pow(2 * x, 2))) / 2 : (sqrt(1 - pow(-2 * x + 2, 2)) + 1) / 2;
    },
    easeInBack: function(x) {
      return c3 * x * x * x - c1 * x * x;
    },
    easeOutBack: function(x) {
      return 1 + c3 * pow(x - 1, 3) + c1 * pow(x - 1, 2);
    },
    easeInOutBack: function(x) {
      return x < 0.5 ? pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2) / 2 : (pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
    },
    easeInElastic: function(x) {
      return x === 0 ? 0 : x === 1 ? 1 : -pow(2, 10 * x - 10) * sin((x * 10 - 10.75) * c4);
    },
    easeOutElastic: function(x) {
      return x === 0 ? 0 : x === 1 ? 1 : pow(2, -10 * x) * sin((x * 10 - 0.75) * c4) + 1;
    },
    easeInOutElastic: function(x) {
      return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? -(pow(2, 20 * x - 10) * sin((20 * x - 11.125) * c5)) / 2 : pow(2, -20 * x + 10) * sin((20 * x - 11.125) * c5) / 2 + 1;
    },
    easeInBounce: function(x) {
      return 1 - bounceOut(1 - x);
    },
    easeOutBounce: bounceOut,
    easeInOutBounce: function(x) {
      return x < 0.5 ? (1 - bounceOut(1 - 2 * x)) / 2 : (1 + bounceOut(2 * x - 1)) / 2;
    }
  };

  // node_modules/@ghom/entity-p5/src/app/time.ts
  var Time = class extends Entity {
    constructor() {
      super(...arguments);
      this.startedAt = 0;
    }
    onSetup() {
      this.startedAt = frameCount;
    }
  };

  // node_modules/@ghom/entity-p5/src/app/animation.ts
  var Animation = class extends Time {
    constructor(settings) {
      super();
      this.settings = settings;
      var _a;
      this.easing = (_a = settings.easing) != null ? _a : easingSet.linear;
    }
    onSetup() {
      var _a, _b, _c, _d;
      (_b = (_a = this.settings).onSetup) == null ? void 0 : _b.call(_a);
      super.onSetup();
      (_d = (_c = this.settings).onUpdate) == null ? void 0 : _d.call(_c, this.settings.from);
    }
    onUpdate() {
      var _a, _b;
      if (frameCount - this.startedAt >= this.settings.duration) {
        this.teardown();
      } else {
        (_b = (_a = this.settings).onUpdate) == null ? void 0 : _b.call(_a, map(this.settings.easing((frameCount - this.startedAt) / this.settings.duration), 0, 1, this.settings.from, this.settings.to));
      }
    }
    onTeardown() {
      var _a, _b, _c, _d;
      (_b = (_a = this.settings).onUpdate) == null ? void 0 : _b.call(_a, this.settings.to);
      (_d = (_c = this.settings).onTeardown) == null ? void 0 : _d.call(_c);
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
    onMouseReleased() {
      this.addChild(new Animation({
        from: 0,
        to: this.diameter * 5,
        duration: 100,
        easing: easingSet.easeOutQuart,
        onDraw: (value) => {
          stroke(255);
          strokeWeight(this.diameter / 4);
          noFill();
          circle(mouseX, mouseY, value);
        }
      }));
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2luZGV4LnRzIiwgIm5vZGVfbW9kdWxlcy9AZ2hvbS9lbnRpdHktYmFzZS9zcmMvYXBwL2Jhc2UudHMiLCAibm9kZV9tb2R1bGVzL0BnaG9tL2VudGl0eS1wNS9zcmMvYXBwL2VudGl0eS50cyIsICJub2RlX21vZHVsZXMvQGdob20vZW50aXR5LXA1L3NyYy9hcHAvZHJhd2FibGUudHMiLCAibm9kZV9tb2R1bGVzL0BnaG9tL2VudGl0eS1wNS9zcmMvYXBwL2Vhc2luZy50cyIsICJub2RlX21vZHVsZXMvQGdob20vZW50aXR5LXA1L3NyYy9hcHAvdGltZS50cyIsICJub2RlX21vZHVsZXMvQGdob20vZW50aXR5LXA1L3NyYy9hcHAvYW5pbWF0aW9uLnRzIiwgIm5vZGVfbW9kdWxlcy9AZ2hvbS9lbnRpdHktcDUvc3JjL2FwcC9zaGFwZS50cyIsICJzcmMvYXBwL2dhbWUudHMiLCAic3JjL2FwcC9jdXJzb3IudHMiLCAic3JjL2FwcC9iYWxsb29uLnRzIiwgInNyYy9hcHAvYmFsbG9vbnMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vLyBAdHMtY2hlY2tcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvQHR5cGVzL3A1L2dsb2JhbC5kLnRzXCIgLz5cblxuaW1wb3J0IHsgZ2FtZSB9IGZyb20gXCIuL2FwcC9nYW1lXCJcbmltcG9ydCB7IEN1cnNvciB9IGZyb20gXCIuL2FwcC9jdXJzb3JcIlxuaW1wb3J0IHsgQmFsbG9vbnMgfSBmcm9tIFwiLi9hcHAvYmFsbG9vbnNcIlxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgKGV2ZW50KSA9PiBldmVudC5wcmV2ZW50RGVmYXVsdCgpKVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0dXAoKSB7XG4gIGNyZWF0ZUNhbnZhcyhcbiAgICBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsIHdpbmRvdy5pbm5lcldpZHRoIHx8IDApLFxuICAgIE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKVxuICApXG5cbiAgbmV3IEJhbGxvb25zKDEpXG4gIG5ldyBDdXJzb3IoKVxuXG4gIGdhbWUuc2V0dXAoKVxuICBnYW1lLnNjaGVtYSgyKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZHJhdygpIHtcbiAgYmFja2dyb3VuZCgyMClcblxuICBnYW1lLmRyYXcoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlKHRpbWVzdGFtcDogbnVtYmVyKSB7XG4gIGdhbWUudXBkYXRlKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGtleVByZXNzZWQoKSB7fVxuZXhwb3J0IGZ1bmN0aW9uIGtleVJlbGVhc2VkKCkge31cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZVByZXNzZWQoKSB7XG4gIGdhbWUubW91c2VQcmVzc2VkKClcbn1cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZVJlbGVhc2VkKCkge1xuICBnYW1lLm1vdXNlUmVsZWFzZWQoKVxufVxuXG4vKipcbiAqIGRlYnVnIGltcG9ydHMgKGFjY2Vzc2libGUgZnJvbSBmcm9udGVuZCBjb25zb2xlIHdpdGggYGFwcC5yb290YClcbiAqL1xuZXhwb3J0IGNvbnN0IHJvb3QgPSBnYW1lXG4iLCAiZXhwb3J0IHR5cGUgRW50aXR5RXZlbnROYW1lID0gXCJzZXR1cFwiIHwgXCJ1cGRhdGVcIiB8IFwidGVhcmRvd25cIlxuXG5leHBvcnQgdHlwZSBFbnRpdHlMaXN0ZW5lcjxcbiAgRXZlbnROYW1lIGV4dGVuZHMgc3RyaW5nLFxuICBUaGlzIGV4dGVuZHMgQmFzZTxFdmVudE5hbWU+XG4+ID0gKHRoaXM6IFRoaXMsIGl0OiBUaGlzKSA9PiB1bmtub3duXG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCYXNlPEV2ZW50TmFtZSBleHRlbmRzIHN0cmluZz4ge1xuICBwcm90ZWN0ZWQgX2lzU2V0dXAgPSBmYWxzZVxuICBwcm90ZWN0ZWQgX2NoaWxkcmVuID0gbmV3IFNldDxCYXNlPEV2ZW50TmFtZSB8IEVudGl0eUV2ZW50TmFtZT4+KClcbiAgcHJvdGVjdGVkIF9wYXJlbnQ/OiBCYXNlPEV2ZW50TmFtZSB8IEVudGl0eUV2ZW50TmFtZT5cbiAgcHJvdGVjdGVkIF9saXN0ZW5lcnM6IEVudGl0eUxpc3RlbmVyPEV2ZW50TmFtZSB8IEVudGl0eUV2ZW50TmFtZSwgdGhpcz5bXSA9IFtdXG4gIHByb3RlY3RlZCBfc3RvcFBvaW50czogUGFydGlhbDxSZWNvcmQ8RXZlbnROYW1lIHwgRW50aXR5RXZlbnROYW1lLCBib29sZWFuPj4gPVxuICAgIHt9XG5cbiAgZ2V0IGlzU2V0dXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lzU2V0dXBcbiAgfVxuXG4gIGdldCBjaGlsZHJlbigpOiBBcnJheTxCYXNlPEV2ZW50TmFtZSB8IEVudGl0eUV2ZW50TmFtZT4+IHtcbiAgICByZXR1cm4gWy4uLnRoaXMuX2NoaWxkcmVuXVxuICB9XG5cbiAgZ2V0IHBhcmVudCgpOiBCYXNlPEV2ZW50TmFtZSB8IEVudGl0eUV2ZW50TmFtZT4gfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnRcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXByZXNlbnQgYW55IHN0YXRlLWJhc2VkIGVudGl0eVxuICAgKi9cbiAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25TZXR1cCgpIHt9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcbiAgICovXG4gIG9uVXBkYXRlKCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25UZWFyZG93bigpIHt9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxuICAgKi9cbiAgcHVibGljIHNldHVwKCkge1xuICAgIGlmICghdGhpcy5pc1NldHVwKSB7XG4gICAgICB0aGlzLm9uU2V0dXAoKVxuICAgICAgdGhpcy50cmFuc21pdChcInNldHVwXCIpXG4gICAgICB0aGlzLl9pc1NldHVwID0gdHJ1ZVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbnRpdHkgaXMgYWxyZWFkeSBzZXR1cFwiKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cbiAgICogU2hvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiFcbiAgICovXG4gIHB1YmxpYyB1cGRhdGUoKSB7XG4gICAgaWYgKHRoaXMuaXNTZXR1cCkge1xuICAgICAgdGhpcy5vblVwZGF0ZSgpXG4gICAgICB0aGlzLnRyYW5zbWl0KFwidXBkYXRlXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybihcInVwZGF0ZSBpcyBjYWxsZWQgYmVmb3JlIHNldHVwXCIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxuICAgKi9cbiAgcHVibGljIHRlYXJkb3duKCkge1xuICAgIGlmICh0aGlzLmlzU2V0dXApIHtcbiAgICAgIHRoaXMuX2lzU2V0dXAgPSBmYWxzZVxuICAgICAgdGhpcy5vblRlYXJkb3duKClcbiAgICAgIHRoaXMuX3BhcmVudD8ucmVtb3ZlQ2hpbGQodGhpcylcbiAgICAgIHRoaXMudHJhbnNtaXQoXCJ0ZWFyZG93blwiKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbnRpdHkgbXVzdCBiZSBzZXR1cCBiZWZvcmVcIilcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb24obmFtZTogRXZlbnROYW1lLCBsaXN0ZW5lcjogRW50aXR5TGlzdGVuZXI8RXZlbnROYW1lLCB0aGlzPikge1xuICAgIHRoaXMuX2xpc3RlbmVycy5wdXNoKFxuICAgICAge1xuICAgICAgICBbbmFtZV0oKSB7XG4gICAgICAgICAgbGlzdGVuZXIuYmluZCh0aGlzKSh0aGlzKVxuICAgICAgICB9LFxuICAgICAgfVtuYW1lXS5iaW5kKHRoaXMpXG4gICAgKVxuICB9XG5cbiAgcHVibGljIGFkZENoaWxkKC4uLmNoaWxkcmVuOiBCYXNlPEV2ZW50TmFtZT5bXSkge1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgIGNoaWxkLl9wYXJlbnQgPSB0aGlzXG4gICAgICB0aGlzLl9jaGlsZHJlbi5hZGQoY2hpbGQpXG4gICAgICBpZiAodGhpcy5pc1NldHVwKSBjaGlsZC5zZXR1cCgpXG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlbW92ZUNoaWxkKC4uLmNoaWxkcmVuOiBCYXNlPEV2ZW50TmFtZT5bXSkge1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgIGlmIChjaGlsZC5pc1NldHVwKSBjaGlsZC50ZWFyZG93bigpXG4gICAgICBlbHNlIHRoaXMuX2NoaWxkcmVuLmRlbGV0ZShjaGlsZClcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc3RvcFRyYW5zbWlzc2lvbihuYW1lOiBFdmVudE5hbWUgfCBFbnRpdHlFdmVudE5hbWUpIHtcbiAgICB0aGlzLl9zdG9wUG9pbnRzW25hbWVdID0gdHJ1ZVxuICB9XG5cbiAgcHVibGljIHRyYW5zbWl0KG5hbWU6IEV2ZW50TmFtZSB8IEVudGl0eUV2ZW50TmFtZSkge1xuICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgdGhpcy5nZXRMaXN0ZW5lcnNCeU5hbWUobmFtZSkpXG4gICAgICBsaXN0ZW5lci5iaW5kKHRoaXMpKHRoaXMpXG5cbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pIHtcbiAgICAgIGlmICh0aGlzLl9zdG9wUG9pbnRzW25hbWVdKSB7XG4gICAgICAgIHRoaXMuX3N0b3BQb2ludHNbbmFtZV0gPSBmYWxzZVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgY2hpbGRbbmFtZV0oKVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRMaXN0ZW5lcnNCeU5hbWUobmFtZTogRXZlbnROYW1lIHwgRW50aXR5RXZlbnROYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xpc3RlbmVycy5maWx0ZXIoKGxpc3RlbmVyKSA9PiB7XG4gICAgICByZXR1cm4gbGlzdGVuZXIubmFtZSA9PT0gbmFtZVxuICAgIH0pXG4gIH1cblxuICBwdWJsaWMgc2NoZW1hKFxuICAgIGluZGVudGF0aW9uID0gMixcbiAgICBkZXB0aCA9IDAsXG4gICAgaW5kZXg6IG51bWJlciB8IG51bGwgPSBudWxsXG4gICk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAke1wiIFwiLnJlcGVhdChpbmRlbnRhdGlvbikucmVwZWF0KGRlcHRoKX0ke1xuICAgICAgaW5kZXggPT09IG51bGwgPyBcIlwiIDogYCR7aW5kZXh9IC0gYFxuICAgIH0ke3RoaXMuY29uc3RydWN0b3IubmFtZX0gWyR7dGhpcy5pc1NldHVwID8gXCJvblwiIDogXCJvZmZcIn1dJHtcbiAgICAgIHRoaXMuX2NoaWxkcmVuLnNpemUgPiAwXG4gICAgICAgID8gYDpcXG4ke3RoaXMuY2hpbGRyZW5cbiAgICAgICAgICAgIC5tYXAoXG4gICAgICAgICAgICAgIChjaGlsZCwgaW5kZXgpID0+IGAke2NoaWxkLnNjaGVtYShpbmRlbnRhdGlvbiwgZGVwdGggKyAxLCBpbmRleCl9YFxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmpvaW4oXCJcXG5cIil9YFxuICAgICAgICA6IFwiXCJcbiAgICB9YFxuICB9XG59XG4iLCAiaW1wb3J0IHsgQmFzZSB9IGZyb20gXCJAZ2hvbS9lbnRpdHktYmFzZVwiXG5cbmV4cG9ydCB0eXBlIEVudGl0eUV2ZW50TmFtZSA9XG4gIHwgXCJzZXR1cFwiXG4gIHwgXCJ1cGRhdGVcIlxuICB8IFwidGVhcmRvd25cIlxuICB8IFwiZHJhd1wiXG4gIHwgXCJtb3VzZVByZXNzZWRcIlxuICB8IFwibW91c2VSZWxlYXNlZFwiXG4gIHwgXCJrZXlQcmVzc2VkXCJcbiAgfCBcImtleVJlbGVhc2VkXCJcblxuZXhwb3J0IGNsYXNzIEVudGl0eSBleHRlbmRzIEJhc2U8RW50aXR5RXZlbnROYW1lPiB7XG4gIHByb3RlY3RlZCBfY2hpbGRyZW4gPSBuZXcgU2V0PEVudGl0eT4oKVxuICBwcm90ZWN0ZWQgX3pJbmRleD86IG51bWJlclxuXG4gIGdldCB6SW5kZXgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fekluZGV4ID8/IHRoaXMucGFyZW50Py5jaGlsZHJlbi5pbmRleE9mKHRoaXMpID8/IDBcbiAgfVxuXG4gIGdldCBjaGlsZHJlbigpOiBBcnJheTxFbnRpdHk+IHtcbiAgICByZXR1cm4gWy4uLnRoaXMuX2NoaWxkcmVuXVxuICB9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcbiAgICovXG4gIG9uRHJhdygpIHt9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcbiAgICovXG4gIG9uTW91c2VSZWxlYXNlZCgpIHt9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcbiAgICovXG4gIG9uTW91c2VQcmVzc2VkKCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25LZXlSZWxlYXNlZCgpIHt9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcbiAgICovXG4gIG9uS2V5UHJlc3NlZCgpIHt9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxuICAgKi9cbiAgcHVibGljIGRyYXcoKSB7XG4gICAgaWYgKHRoaXMuaXNTZXR1cCkge1xuICAgICAgdGhpcy5vbkRyYXcoKVxuICAgICAgdGhpcy50cmFuc21pdChcImRyYXdcIilcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKFwiRHJhdyBpcyBjYWxsZWQgYmVmb3JlIHNldHVwXCIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxuICAgKi9cbiAgcHVibGljIG1vdXNlUHJlc3NlZCgpIHtcbiAgICBpZiAodGhpcy5pc1NldHVwKSB7XG4gICAgICB0aGlzLm9uTW91c2VQcmVzc2VkKClcbiAgICAgIHRoaXMudHJhbnNtaXQoXCJtb3VzZVByZXNzZWRcIilcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKFwibW91c2VQcmVzc2VkIGlzIGNhbGxlZCBiZWZvcmUgc2V0dXBcIilcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjdXJyZW50IGVudGl0eSBpcyBhIHJvb3QuXG4gICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXG4gICAqL1xuICBwdWJsaWMgbW91c2VSZWxlYXNlZCgpIHtcbiAgICBpZiAodGhpcy5pc1NldHVwKSB7XG4gICAgICB0aGlzLm9uTW91c2VSZWxlYXNlZCgpXG4gICAgICB0aGlzLnRyYW5zbWl0KFwibW91c2VSZWxlYXNlZFwiKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJtb3VzZVByZXNzZWQgaXMgY2FsbGVkIGJlZm9yZSBzZXR1cFwiKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cbiAgICogU2hvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiFcbiAgICovXG4gIHB1YmxpYyBrZXlQcmVzc2VkKCkge1xuICAgIGlmICh0aGlzLmlzU2V0dXApIHtcbiAgICAgIHRoaXMub25LZXlQcmVzc2VkKClcbiAgICAgIHRoaXMudHJhbnNtaXQoXCJrZXlQcmVzc2VkXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybihcImtleVByZXNzZWQgaXMgY2FsbGVkIGJlZm9yZSBzZXR1cFwiKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cbiAgICogU2hvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiFcbiAgICovXG4gIHB1YmxpYyBrZXlSZWxlYXNlZCgpIHtcbiAgICBpZiAodGhpcy5pc1NldHVwKSB7XG4gICAgICB0aGlzLm9uS2V5UmVsZWFzZWQoKVxuICAgICAgdGhpcy50cmFuc21pdChcImtleVJlbGVhc2VkXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybihcImtleVJlbGVhc2VkIGlzIGNhbGxlZCBiZWZvcmUgc2V0dXBcIilcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdHJhbnNtaXQobmFtZTogRW50aXR5RXZlbnROYW1lKSB7XG4gICAgZm9yIChjb25zdCBsaXN0ZW5lciBvZiB0aGlzLmdldExpc3RlbmVyc0J5TmFtZShuYW1lKSlcbiAgICAgIGxpc3RlbmVyLmJpbmQodGhpcykodGhpcylcblxuICAgIGxldCBjaGlsZHJlbiA9XG4gICAgICBuYW1lID09PSBcIm1vdXNlUmVsZWFzZWRcIiB8fFxuICAgICAgbmFtZSA9PT0gXCJtb3VzZVByZXNzZWRcIiB8fFxuICAgICAgbmFtZSA9PT0gXCJrZXlQcmVzc2VkXCIgfHxcbiAgICAgIG5hbWUgPT09IFwia2V5UmVsZWFzZWRcIlxuICAgICAgICA/IHRoaXMuY2hpbGRyZW4uc29ydCgoYSwgYikgPT4gYS56SW5kZXggLSBiLnpJbmRleClcbiAgICAgICAgOiB0aGlzLmNoaWxkcmVuLnNvcnQoKGEsIGIpID0+IGIuekluZGV4IC0gYS56SW5kZXgpXG5cbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgICBpZiAodGhpcy5fc3RvcFBvaW50c1tuYW1lXSkge1xuICAgICAgICB0aGlzLl9zdG9wUG9pbnRzW25hbWVdID0gZmFsc2VcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNoaWxkW25hbWVdKClcbiAgICB9XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBFbnRpdHkgfSBmcm9tIFwiLi9lbnRpdHlcIlxuXG5leHBvcnQgaW50ZXJmYWNlIERyYXdhYmxlU2V0dGluZ3Mge1xuICBmaWxsOiBmYWxzZSB8IEZpbGxPcHRpb25zXG4gIHN0cm9rZTogZmFsc2UgfCBTdHJva2VPcHRpb25zXG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBEcmF3YWJsZSBleHRlbmRzIEVudGl0eSB7XG4gIHByb3RlY3RlZCBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc2V0dGluZ3M/OiBEcmF3YWJsZVNldHRpbmdzKSB7XG4gICAgc3VwZXIoKVxuICB9XG5cbiAgb25EcmF3KCkge1xuICAgIGlmICghdGhpcy5zZXR0aW5ncykgcmV0dXJuXG5cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5maWxsKSB7XG4gICAgICBpZiAoXCJjb2xvclwiIGluIHRoaXMuc2V0dGluZ3MuZmlsbCkge1xuICAgICAgICBmaWxsKHRoaXMuc2V0dGluZ3MuZmlsbC5jb2xvcilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbGwodGhpcy5zZXR0aW5ncy5maWxsKVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLnN0cm9rZSkge1xuICAgICAgc3Ryb2tlV2VpZ2h0KHRoaXMuc2V0dGluZ3Muc3Ryb2tlLndlaWdodClcbiAgICAgIHN0cm9rZSh0aGlzLnNldHRpbmdzLnN0cm9rZS5jb2xvcilcbiAgICB9IGVsc2Uge1xuICAgICAgbm9TdHJva2UoKVxuICAgIH1cbiAgfVxufVxuIiwgIi8vIHNvdXJjZTogaHR0cHM6Ly9naXRodWIuY29tL2FpL2Vhc2luZ3MubmV0L2Jsb2IvbWFzdGVyL3NyYy9lYXNpbmdzL2Vhc2luZ3NGdW5jdGlvbnMudHNcblxuZXhwb3J0IHR5cGUgRWFzaW5nRnVuY3Rpb24gPSAocHJvZ3Jlc3M6IG51bWJlcikgPT4gbnVtYmVyXG5cbmV4cG9ydCB0eXBlIEVhc2luZ05hbWUgPVxuICB8IFwibGluZWFyXCJcbiAgfCBcImVhc2VJblF1YWRcIlxuICB8IFwiZWFzZU91dFF1YWRcIlxuICB8IFwiZWFzZUluT3V0UXVhZFwiXG4gIHwgXCJlYXNlSW5DdWJpY1wiXG4gIHwgXCJlYXNlT3V0Q3ViaWNcIlxuICB8IFwiZWFzZUluT3V0Q3ViaWNcIlxuICB8IFwiZWFzZUluUXVhcnRcIlxuICB8IFwiZWFzZU91dFF1YXJ0XCJcbiAgfCBcImVhc2VJbk91dFF1YXJ0XCJcbiAgfCBcImVhc2VJblF1aW50XCJcbiAgfCBcImVhc2VPdXRRdWludFwiXG4gIHwgXCJlYXNlSW5PdXRRdWludFwiXG4gIHwgXCJlYXNlSW5TaW5lXCJcbiAgfCBcImVhc2VPdXRTaW5lXCJcbiAgfCBcImVhc2VJbk91dFNpbmVcIlxuICB8IFwiZWFzZUluRXhwb1wiXG4gIHwgXCJlYXNlT3V0RXhwb1wiXG4gIHwgXCJlYXNlSW5PdXRFeHBvXCJcbiAgfCBcImVhc2VJbkNpcmNcIlxuICB8IFwiZWFzZU91dENpcmNcIlxuICB8IFwiZWFzZUluT3V0Q2lyY1wiXG4gIHwgXCJlYXNlSW5CYWNrXCJcbiAgfCBcImVhc2VPdXRCYWNrXCJcbiAgfCBcImVhc2VJbk91dEJhY2tcIlxuICB8IFwiZWFzZUluRWxhc3RpY1wiXG4gIHwgXCJlYXNlT3V0RWxhc3RpY1wiXG4gIHwgXCJlYXNlSW5PdXRFbGFzdGljXCJcbiAgfCBcImVhc2VJbkJvdW5jZVwiXG4gIHwgXCJlYXNlT3V0Qm91bmNlXCJcbiAgfCBcImVhc2VJbk91dEJvdW5jZVwiXG5cbmNvbnN0IFBJID0gTWF0aC5QSVxuY29uc3QgYzEgPSAxLjcwMTU4XG5jb25zdCBjMiA9IGMxICogMS41MjVcbmNvbnN0IGMzID0gYzEgKyAxXG5jb25zdCBjNCA9ICgyICogUEkpIC8gM1xuY29uc3QgYzUgPSAoMiAqIFBJKSAvIDQuNVxuXG5jb25zdCBib3VuY2VPdXQ6IEVhc2luZ0Z1bmN0aW9uID0gZnVuY3Rpb24gKHgpIHtcbiAgY29uc3QgbjEgPSA3LjU2MjVcbiAgY29uc3QgZDEgPSAyLjc1XG5cbiAgaWYgKHggPCAxIC8gZDEpIHtcbiAgICByZXR1cm4gbjEgKiB4ICogeFxuICB9IGVsc2UgaWYgKHggPCAyIC8gZDEpIHtcbiAgICByZXR1cm4gbjEgKiAoeCAtPSAxLjUgLyBkMSkgKiB4ICsgMC43NVxuICB9IGVsc2UgaWYgKHggPCAyLjUgLyBkMSkge1xuICAgIHJldHVybiBuMSAqICh4IC09IDIuMjUgLyBkMSkgKiB4ICsgMC45Mzc1XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG4xICogKHggLT0gMi42MjUgLyBkMSkgKiB4ICsgMC45ODQzNzVcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZWFzaW5nU2V0OiBSZWNvcmQ8RWFzaW5nTmFtZSwgRWFzaW5nRnVuY3Rpb24+ID0ge1xuICBsaW5lYXI6ICh4KSA9PiB4LFxuICBlYXNlSW5RdWFkOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4ICogeFxuICB9LFxuICBlYXNlT3V0UXVhZDogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gMSAtICgxIC0geCkgKiAoMSAtIHgpXG4gIH0sXG4gIGVhc2VJbk91dFF1YWQ6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggPCAwLjUgPyAyICogeCAqIHggOiAxIC0gcG93KC0yICogeCArIDIsIDIpIC8gMlxuICB9LFxuICBlYXNlSW5DdWJpYzogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4geCAqIHggKiB4XG4gIH0sXG4gIGVhc2VPdXRDdWJpYzogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gMSAtIHBvdygxIC0geCwgMylcbiAgfSxcbiAgZWFzZUluT3V0Q3ViaWM6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggPCAwLjUgPyA0ICogeCAqIHggKiB4IDogMSAtIHBvdygtMiAqIHggKyAyLCAzKSAvIDJcbiAgfSxcbiAgZWFzZUluUXVhcnQ6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggKiB4ICogeCAqIHhcbiAgfSxcbiAgZWFzZU91dFF1YXJ0OiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiAxIC0gcG93KDEgLSB4LCA0KVxuICB9LFxuICBlYXNlSW5PdXRRdWFydDogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4geCA8IDAuNSA/IDggKiB4ICogeCAqIHggKiB4IDogMSAtIHBvdygtMiAqIHggKyAyLCA0KSAvIDJcbiAgfSxcbiAgZWFzZUluUXVpbnQ6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggKiB4ICogeCAqIHggKiB4XG4gIH0sXG4gIGVhc2VPdXRRdWludDogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gMSAtIHBvdygxIC0geCwgNSlcbiAgfSxcbiAgZWFzZUluT3V0UXVpbnQ6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggPCAwLjUgPyAxNiAqIHggKiB4ICogeCAqIHggKiB4IDogMSAtIHBvdygtMiAqIHggKyAyLCA1KSAvIDJcbiAgfSxcbiAgZWFzZUluU2luZTogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gMSAtIGNvcygoeCAqIFBJKSAvIDIpXG4gIH0sXG4gIGVhc2VPdXRTaW5lOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiBzaW4oKHggKiBQSSkgLyAyKVxuICB9LFxuICBlYXNlSW5PdXRTaW5lOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiAtKGNvcyhQSSAqIHgpIC0gMSkgLyAyXG4gIH0sXG4gIGVhc2VJbkV4cG86IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggPT09IDAgPyAwIDogcG93KDIsIDEwICogeCAtIDEwKVxuICB9LFxuICBlYXNlT3V0RXhwbzogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4geCA9PT0gMSA/IDEgOiAxIC0gcG93KDIsIC0xMCAqIHgpXG4gIH0sXG4gIGVhc2VJbk91dEV4cG86IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggPT09IDBcbiAgICAgID8gMFxuICAgICAgOiB4ID09PSAxXG4gICAgICA/IDFcbiAgICAgIDogeCA8IDAuNVxuICAgICAgPyBwb3coMiwgMjAgKiB4IC0gMTApIC8gMlxuICAgICAgOiAoMiAtIHBvdygyLCAtMjAgKiB4ICsgMTApKSAvIDJcbiAgfSxcbiAgZWFzZUluQ2lyYzogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gMSAtIHNxcnQoMSAtIHBvdyh4LCAyKSlcbiAgfSxcbiAgZWFzZU91dENpcmM6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHNxcnQoMSAtIHBvdyh4IC0gMSwgMikpXG4gIH0sXG4gIGVhc2VJbk91dENpcmM6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggPCAwLjVcbiAgICAgID8gKDEgLSBzcXJ0KDEgLSBwb3coMiAqIHgsIDIpKSkgLyAyXG4gICAgICA6IChzcXJ0KDEgLSBwb3coLTIgKiB4ICsgMiwgMikpICsgMSkgLyAyXG4gIH0sXG4gIGVhc2VJbkJhY2s6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIGMzICogeCAqIHggKiB4IC0gYzEgKiB4ICogeFxuICB9LFxuICBlYXNlT3V0QmFjazogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gMSArIGMzICogcG93KHggLSAxLCAzKSArIGMxICogcG93KHggLSAxLCAyKVxuICB9LFxuICBlYXNlSW5PdXRCYWNrOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4IDwgMC41XG4gICAgICA/IChwb3coMiAqIHgsIDIpICogKChjMiArIDEpICogMiAqIHggLSBjMikpIC8gMlxuICAgICAgOiAocG93KDIgKiB4IC0gMiwgMikgKiAoKGMyICsgMSkgKiAoeCAqIDIgLSAyKSArIGMyKSArIDIpIC8gMlxuICB9LFxuICBlYXNlSW5FbGFzdGljOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4ID09PSAwXG4gICAgICA/IDBcbiAgICAgIDogeCA9PT0gMVxuICAgICAgPyAxXG4gICAgICA6IC1wb3coMiwgMTAgKiB4IC0gMTApICogc2luKCh4ICogMTAgLSAxMC43NSkgKiBjNClcbiAgfSxcbiAgZWFzZU91dEVsYXN0aWM6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggPT09IDBcbiAgICAgID8gMFxuICAgICAgOiB4ID09PSAxXG4gICAgICA/IDFcbiAgICAgIDogcG93KDIsIC0xMCAqIHgpICogc2luKCh4ICogMTAgLSAwLjc1KSAqIGM0KSArIDFcbiAgfSxcbiAgZWFzZUluT3V0RWxhc3RpYzogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4geCA9PT0gMFxuICAgICAgPyAwXG4gICAgICA6IHggPT09IDFcbiAgICAgID8gMVxuICAgICAgOiB4IDwgMC41XG4gICAgICA/IC0ocG93KDIsIDIwICogeCAtIDEwKSAqIHNpbigoMjAgKiB4IC0gMTEuMTI1KSAqIGM1KSkgLyAyXG4gICAgICA6IChwb3coMiwgLTIwICogeCArIDEwKSAqIHNpbigoMjAgKiB4IC0gMTEuMTI1KSAqIGM1KSkgLyAyICsgMVxuICB9LFxuICBlYXNlSW5Cb3VuY2U6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIDEgLSBib3VuY2VPdXQoMSAtIHgpXG4gIH0sXG4gIGVhc2VPdXRCb3VuY2U6IGJvdW5jZU91dCxcbiAgZWFzZUluT3V0Qm91bmNlOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4IDwgMC41XG4gICAgICA/ICgxIC0gYm91bmNlT3V0KDEgLSAyICogeCkpIC8gMlxuICAgICAgOiAoMSArIGJvdW5jZU91dCgyICogeCAtIDEpKSAvIDJcbiAgfSxcbn1cbiIsICJpbXBvcnQgeyBFbnRpdHkgfSBmcm9tIFwiLi9lbnRpdHlcIlxuXG5leHBvcnQgY2xhc3MgVGltZSBleHRlbmRzIEVudGl0eSB7XG4gIHByb3RlY3RlZCBzdGFydGVkQXQgPSAwXG5cbiAgb25TZXR1cCgpIHtcbiAgICB0aGlzLnN0YXJ0ZWRBdCA9IGZyYW1lQ291bnRcbiAgfVxufVxuIiwgImltcG9ydCB7IEVhc2luZ0Z1bmN0aW9uLCBlYXNpbmdTZXQgfSBmcm9tIFwiLi9lYXNpbmdcIlxuaW1wb3J0IHsgVGltZSB9IGZyb20gXCIuL3RpbWVcIlxuXG5leHBvcnQgaW50ZXJmYWNlIEFuaW1hdGlvblNldHRpbmdzIHtcbiAgZnJvbTogbnVtYmVyXG4gIHRvOiBudW1iZXJcbiAgLyoqXG4gICAqIEFuaW1hdGlvbiBkdXJhdGlvbiBpbiAqKmZyYW1lIGNvdW50KiohXG4gICAqL1xuICBkdXJhdGlvbjogbnVtYmVyXG4gIGVhc2luZz86IEVhc2luZ0Z1bmN0aW9uXG4gIG9uU2V0dXA/OiAoKSA9PiB1bmtub3duXG4gIG9uVXBkYXRlPzogKHZhbHVlOiBudW1iZXIpID0+IHVua25vd25cbiAgb25UZWFyZG93bj86ICgpID0+IHVua25vd25cbn1cblxuLyoqXG4gKiBFcXVpdmFsZW50IG9mIFR3ZWVuXG4gKi9cbmV4cG9ydCBjbGFzcyBBbmltYXRpb24gZXh0ZW5kcyBUaW1lIHtcbiAgcHJpdmF0ZSBlYXNpbmc6IEVhc2luZ0Z1bmN0aW9uXG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzZXR0aW5nczogQW5pbWF0aW9uU2V0dGluZ3MpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5lYXNpbmcgPSBzZXR0aW5ncy5lYXNpbmcgPz8gZWFzaW5nU2V0LmxpbmVhclxuICB9XG5cbiAgb25TZXR1cCgpIHtcbiAgICB0aGlzLnNldHRpbmdzLm9uU2V0dXA/LigpXG4gICAgc3VwZXIub25TZXR1cCgpXG4gICAgdGhpcy5zZXR0aW5ncy5vblVwZGF0ZT8uKHRoaXMuc2V0dGluZ3MuZnJvbSlcbiAgfVxuXG4gIG9uVXBkYXRlKCkge1xuICAgIGlmIChmcmFtZUNvdW50IC0gdGhpcy5zdGFydGVkQXQgPj0gdGhpcy5zZXR0aW5ncy5kdXJhdGlvbikge1xuICAgICAgdGhpcy50ZWFyZG93bigpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0dGluZ3Mub25VcGRhdGU/LihcbiAgICAgICAgbWFwKFxuICAgICAgICAgIHRoaXMuc2V0dGluZ3MuZWFzaW5nKFxuICAgICAgICAgICAgKGZyYW1lQ291bnQgLSB0aGlzLnN0YXJ0ZWRBdCkgLyB0aGlzLnNldHRpbmdzLmR1cmF0aW9uXG4gICAgICAgICAgKSxcbiAgICAgICAgICAwLFxuICAgICAgICAgIDEsXG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy5mcm9tLFxuICAgICAgICAgIHRoaXMuc2V0dGluZ3MudG9cbiAgICAgICAgKVxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIG9uVGVhcmRvd24oKSB7XG4gICAgdGhpcy5zZXR0aW5ncy5vblVwZGF0ZT8uKHRoaXMuc2V0dGluZ3MudG8pXG4gICAgdGhpcy5zZXR0aW5ncy5vblRlYXJkb3duPy4oKVxuICB9XG59XG4iLCAiaW1wb3J0ICogYXMgcDUgZnJvbSBcInA1XCJcbmltcG9ydCB7IERyYXdhYmxlLCBEcmF3YWJsZVNldHRpbmdzIH0gZnJvbSBcIi4vZHJhd2FibGVcIlxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU2hhcGVcbiAgZXh0ZW5kcyBEcmF3YWJsZVxuICBpbXBsZW1lbnRzIFBvc2l0aW9uYWJsZSwgUmVzaXphYmxlXG57XG4gIGFic3RyYWN0IHg6IG51bWJlclxuICBhYnN0cmFjdCB5OiBudW1iZXJcbiAgYWJzdHJhY3Qgd2lkdGg6IG51bWJlclxuICBhYnN0cmFjdCBoZWlnaHQ6IG51bWJlclxuICBhYnN0cmFjdCByZWFkb25seSBjZW50ZXJYOiBudW1iZXJcbiAgYWJzdHJhY3QgcmVhZG9ubHkgY2VudGVyWTogbnVtYmVyXG5cbiAgZ2V0IGNlbnRlcigpOiBbeDogbnVtYmVyLCB5OiBudW1iZXJdIHtcbiAgICByZXR1cm4gW3RoaXMuY2VudGVyWCwgdGhpcy5jZW50ZXJZXVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSZWN0IGV4dGVuZHMgU2hhcGUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgeCA9IDAsXG4gICAgcHVibGljIHkgPSAwLFxuICAgIHB1YmxpYyB3aWR0aCA9IDAsXG4gICAgcHVibGljIGhlaWdodCA9IDAsXG4gICAgb3B0aW9ucz86IERyYXdhYmxlU2V0dGluZ3NcbiAgKSB7XG4gICAgc3VwZXIob3B0aW9ucylcbiAgfVxuXG4gIGdldCBjZW50ZXJYKCkge1xuICAgIHJldHVybiB0aGlzLnggKyB0aGlzLndpZHRoIC8gMlxuICB9XG5cbiAgZ2V0IGNlbnRlclkoKSB7XG4gICAgcmV0dXJuIHRoaXMueSArIHRoaXMuaGVpZ2h0IC8gMlxuICB9XG5cbiAgZ2V0IGlzSG92ZXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgbW91c2VYID4gdGhpcy54ICYmXG4gICAgICBtb3VzZVggPCB0aGlzLnggKyB0aGlzLndpZHRoICYmXG4gICAgICBtb3VzZVkgPiB0aGlzLnkgJiZcbiAgICAgIG1vdXNlWSA8IHRoaXMueSArIHRoaXMuaGVpZ2h0XG4gICAgKVxuICB9XG5cbiAgb25EcmF3KCkge1xuICAgIHN1cGVyLm9uRHJhdygpXG4gICAgcmVjdCh0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIENpcmNsZSBleHRlbmRzIFNoYXBlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHggPSAwLFxuICAgIHB1YmxpYyB5ID0gMCxcbiAgICBwdWJsaWMgZGlhbWV0ZXIgPSAwLFxuICAgIG9wdGlvbnM/OiBEcmF3YWJsZVNldHRpbmdzXG4gICkge1xuICAgIHN1cGVyKG9wdGlvbnMpXG4gIH1cblxuICBnZXQgd2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlhbWV0ZXJcbiAgfVxuXG4gIGdldCBoZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlhbWV0ZXJcbiAgfVxuXG4gIGdldCBjZW50ZXJYKCkge1xuICAgIHJldHVybiB0aGlzLnhcbiAgfVxuXG4gIGdldCBjZW50ZXJZKCkge1xuICAgIHJldHVybiB0aGlzLnlcbiAgfVxuXG4gIGdldCBpc0hvdmVyZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGRpc3QobW91c2VYLCBtb3VzZVksIHRoaXMueCwgdGhpcy55KSA8IHRoaXMuZGlhbWV0ZXIgLyAyXG4gIH1cblxuICBvbkRyYXcoKSB7XG4gICAgc3VwZXIub25EcmF3KClcbiAgICBjaXJjbGUodGhpcy54LCB0aGlzLnksIHRoaXMuZGlhbWV0ZXIpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEVsbGlwc2UgZXh0ZW5kcyBSZWN0IHtcbiAgZ2V0IGNlbnRlclgoKSB7XG4gICAgcmV0dXJuIHRoaXMueFxuICB9XG5cbiAgZ2V0IGNlbnRlclkoKSB7XG4gICAgcmV0dXJuIHRoaXMueVxuICB9XG5cbiAgZ2V0IGlzSG92ZXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgTWF0aC5wb3cobW91c2VYIC0gdGhpcy54LCAyKSAvIE1hdGgucG93KHRoaXMud2lkdGggLyAyLCAyKSArXG4gICAgICAgIE1hdGgucG93KG1vdXNlWSAtIHRoaXMueSwgMikgLyBNYXRoLnBvdyh0aGlzLmhlaWdodCAvIDIsIDIpIDw9XG4gICAgICAxXG4gICAgKVxuICB9XG5cbiAgb25EcmF3KCkge1xuICAgIHN1cGVyLm9uRHJhdygpXG4gICAgZWxsaXBzZSh0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIExpbmUgZXh0ZW5kcyBTaGFwZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyB4ID0gMCxcbiAgICBwdWJsaWMgeSA9IDAsXG4gICAgcHVibGljIHgyID0gMCxcbiAgICBwdWJsaWMgeTIgPSAwLFxuICAgIG9wdGlvbnM/OiBEcmF3YWJsZVNldHRpbmdzXG4gICkge1xuICAgIHN1cGVyKG9wdGlvbnMpXG4gIH1cblxuICBnZXQgd2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMueDIgLSB0aGlzLnhcbiAgfVxuXG4gIGdldCBoZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMueTIgLSB0aGlzLnlcbiAgfVxuXG4gIGdldCBzaXplKCkge1xuICAgIHJldHVybiBkaXN0KHRoaXMueCwgdGhpcy55LCB0aGlzLngyLCB0aGlzLnkyKVxuICB9XG5cbiAgZ2V0IGNlbnRlclgoKSB7XG4gICAgcmV0dXJuIHRoaXMueCArIHRoaXMud2lkdGggLyAyXG4gIH1cblxuICBnZXQgY2VudGVyWSgpIHtcbiAgICByZXR1cm4gdGhpcy55ICsgdGhpcy5oZWlnaHQgLyAyXG4gIH1cblxuICBnZXQgaXNIb3ZlcmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICBkaXN0KHRoaXMueCwgdGhpcy55LCBtb3VzZVgsIG1vdXNlWSkgK1xuICAgICAgICBkaXN0KG1vdXNlWCwgbW91c2VZLCB0aGlzLngyLCB0aGlzLnkyKSA8PVxuICAgICAgdGhpcy5zaXplXG4gICAgKVxuICB9XG5cbiAgb25EcmF3KCkge1xuICAgIHN1cGVyLm9uRHJhdygpXG4gICAgbGluZSh0aGlzLngsIHRoaXMueSwgdGhpcy54MiwgdGhpcy55MilcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW1hZ2UgZXh0ZW5kcyBSZWN0IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGltZzogcDUuSW1hZ2UsXG4gICAgcHVibGljIHggPSAwLFxuICAgIHB1YmxpYyB5ID0gMCxcbiAgICB3aWR0aD86IG51bWJlcixcbiAgICBoZWlnaHQ/OiBudW1iZXIsXG4gICAgb3B0aW9ucz86IERyYXdhYmxlU2V0dGluZ3NcbiAgKSB7XG4gICAgc3VwZXIoeCwgeSwgd2lkdGggPz8gaW1nLndpZHRoLCBoZWlnaHQgPz8gaW1nLmhlaWdodCwgb3B0aW9ucylcbiAgfVxuXG4gIG9uRHJhdygpIHtcbiAgICBzdXBlci5vbkRyYXcoKVxuICAgIGltYWdlKHRoaXMuaW1nLCB0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gIH1cbn1cbiIsICJpbXBvcnQgeyBFbnRpdHkgfSBmcm9tIFwiQGdob20vZW50aXR5LXA1XCJcblxuZXhwb3J0IGNsYXNzIEdhbWUgZXh0ZW5kcyBFbnRpdHkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpXG4gIH1cblxuICBzY29yZTogbnVtYmVyXG59XG5cbmV4cG9ydCBjb25zdCBnYW1lID0gbmV3IEdhbWUoKVxuIiwgImltcG9ydCB7IGdhbWUgfSBmcm9tIFwiLi9nYW1lXCJcbmltcG9ydCB7IENpcmNsZSwgQW5pbWF0aW9uLCBlYXNpbmdTZXQgfSBmcm9tIFwiQGdob20vZW50aXR5LXA1XCJcblxuY29uc3QgSElTVE9SWV9MRU5HVEggPSAxMDBcblxuZXhwb3J0IGNsYXNzIEN1cnNvciBleHRlbmRzIENpcmNsZSB7XG4gIHB1YmxpYyBoaXN0b3J5OiBbeDogbnVtYmVyLCB5OiBudW1iZXJdW10gPSBbXVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKDAsIDAsIDE1KVxuICAgIGdhbWUuYWRkQ2hpbGQodGhpcylcbiAgfVxuXG4gIG9uVXBkYXRlKCkge1xuICAgIHRoaXMuaGlzdG9yeS5wdXNoKFt0aGlzLngsIHRoaXMueV0pXG4gICAgdGhpcy54ID0gbW91c2VYXG4gICAgdGhpcy55ID0gbW91c2VZXG4gICAgd2hpbGUgKHRoaXMuaGlzdG9yeS5sZW5ndGggPiBISVNUT1JZX0xFTkdUSCkgdGhpcy5oaXN0b3J5LnNoaWZ0KClcbiAgfVxuXG4gIG9uRHJhdygpIHtcbiAgICBsZXQgbGFzdCA9IHRoaXMuaGlzdG9yeVswXVxuICAgIGZvciAoY29uc3QgcG9zIG9mIHRoaXMuaGlzdG9yeSkge1xuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmhpc3RvcnkuaW5kZXhPZihwb3MpXG4gICAgICBzdHJva2UoZmxvb3IobWFwKGluZGV4LCB0aGlzLmhpc3RvcnkubGVuZ3RoLCAwLCAyNTUsIDApKSlcbiAgICAgIHN0cm9rZVdlaWdodChmbG9vcihtYXAoaW5kZXgsIHRoaXMuaGlzdG9yeS5sZW5ndGgsIDAsIHRoaXMuZGlhbWV0ZXIsIDApKSlcbiAgICAgIGxpbmUoLi4ubGFzdCwgLi4ucG9zKVxuICAgICAgbGFzdCA9IHBvc1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VSZWxlYXNlZCgpIHtcbiAgICB0aGlzLmFkZENoaWxkKFxuICAgICAgbmV3IEFuaW1hdGlvbih7XG4gICAgICAgIGZyb206IDAsXG4gICAgICAgIHRvOiB0aGlzLmRpYW1ldGVyICogNSxcbiAgICAgICAgZHVyYXRpb246IDEwMCxcbiAgICAgICAgZWFzaW5nOiBlYXNpbmdTZXQuZWFzZU91dFF1YXJ0LFxuICAgICAgICBvbkRyYXc6ICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHN0cm9rZSgyNTUpXG4gICAgICAgICAgc3Ryb2tlV2VpZ2h0KHRoaXMuZGlhbWV0ZXIgLyA0KVxuICAgICAgICAgIG5vRmlsbCgpXG4gICAgICAgICAgY2lyY2xlKG1vdXNlWCwgbW91c2VZLCB2YWx1ZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApXG4gIH1cbn1cbiIsICJpbXBvcnQgeyBDaXJjbGUgfSBmcm9tIFwiQGdob20vZW50aXR5LXA1XCJcbmltcG9ydCB7IGdhbWUgfSBmcm9tIFwiLi9nYW1lXCJcblxuZXhwb3J0IGNsYXNzIEJhbGxvb24gZXh0ZW5kcyBDaXJjbGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihyYW5kb20oMCwgd2lkdGgpLCByYW5kb20oMCwgaGVpZ2h0KSwgcmFuZG9tKDQwLCA2MCksIHtcbiAgICAgIGZpbGw6IGNvbG9yKHJhbmRvbSgxMDAsIDIwMCksIHJhbmRvbSgxMDAsIDIwMCksIHJhbmRvbSgxMDAsIDIwMCkpLFxuICAgICAgc3Ryb2tlOiBmYWxzZSxcbiAgICB9KVxuICB9XG5cbiAgb25VcGRhdGUoKSB7XG4gICAgaWYgKHRoaXMuaXNIb3ZlcmVkKSB7XG4gICAgICB0aGlzLnNldHRpbmdzLnN0cm9rZSA9IHtcbiAgICAgICAgY29sb3I6IGNvbG9yKDI1NSksXG4gICAgICAgIHdlaWdodDogNSxcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXR0aW5ncy5zdHJva2UgPSBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIG9uVGVhcmRvd24oKSB7XG4gICAgZ2FtZS5zY29yZSsrXG4gIH1cblxuICBvbk1vdXNlUmVsZWFzZWQoKSB7XG4gICAgaWYgKHRoaXMuaXNIb3ZlcmVkKSB7XG4gICAgICBpZiAodGhpcy5wYXJlbnQuY2hpbGRyZW4ubGVuZ3RoID4gMSlcbiAgICAgICAgdGhpcy5wYXJlbnQuc3RvcFRyYW5zbWlzc2lvbihcIm1vdXNlUmVsZWFzZWRcIilcblxuICAgICAgdGhpcy5wYXJlbnQuYWRkQ2hpbGQobmV3IEJhbGxvb24oKSlcbiAgICAgIHRoaXMudGVhcmRvd24oKVxuICAgIH1cbiAgfVxufVxuIiwgImltcG9ydCB7IGdhbWUgfSBmcm9tIFwiLi9nYW1lXCJcbmltcG9ydCB7IEJhbGxvb24gfSBmcm9tIFwiLi9iYWxsb29uXCJcbmltcG9ydCB7IEVudGl0eSB9IGZyb20gXCJAZ2hvbS9lbnRpdHktcDVcIlxuXG5leHBvcnQgY2xhc3MgQmFsbG9vbnMgZXh0ZW5kcyBFbnRpdHkge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvdW50OiBudW1iZXIpIHtcbiAgICBzdXBlcigpXG4gICAgZ2FtZS5hZGRDaGlsZCh0aGlzKVxuICB9XG5cbiAgb25TZXR1cCgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY291bnQ7IGkrKykge1xuICAg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
