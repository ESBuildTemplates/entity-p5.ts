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
      return `${" ".repeat(indentation).repeat(depth)}${index === null ? "" : `${index} - `}${this.constructor.name}${this._children.size > 0 ? ` (children: ${this.children.length})${this._listeners.length > 0 ? ` (listeners: ${this._listeners.length})` : ""}
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
      } else {
        noFill();
      }
      if (this.settings.stroke) {
        strokeWeight(this.settings.stroke.weight);
        stroke(this.settings.stroke.color);
      } else {
        noStroke();
      }
      if (this.settings.textAlign) {
        textAlign(this.settings.textAlign.x, this.settings.textAlign.y);
      } else {
        textAlign(CENTER, CENTER);
      }
      if (this.settings.textSize) {
        textSize(this.settings.textSize);
      } else {
        textSize(height * 0.1);
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
    onDraw() {
      var _a, _b;
      (_b = (_a = this.settings).onDraw) == null ? void 0 : _b.call(_a, map(this.easing((frameCount - this.startedAt) / this.settings.duration), 0, 1, this.settings.from, this.settings.to));
    }
    onUpdate() {
      var _a, _b;
      if (frameCount - this.startedAt >= this.settings.duration) {
        this.teardown();
      } else {
        (_b = (_a = this.settings).onUpdate) == null ? void 0 : _b.call(_a, map(this.easing((frameCount - this.startedAt) / this.settings.duration), 0, 1, this.settings.from, this.settings.to));
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
  var Text = class extends Shape {
    constructor(text2 = "", x = 0, y = 0, _width, _height, options) {
      super(options);
      this.text = text2;
      this.x = x;
      this.y = y;
      this._width = _width;
      this._height = _height;
    }
    get width() {
      var _a;
      return (_a = this._width) != null ? _a : Infinity;
    }
    get height() {
      var _a;
      return (_a = this._height) != null ? _a : Infinity;
    }
    get centerX() {
      return this.settings.textAlign.x === CENTER ? this.x : this.x + this.width / 2;
    }
    get centerY() {
      return this.settings.textAlign.y === CENTER ? this.y : this.y + this.height / 2;
    }
    get isHovered() {
      return mouseX > this.centerX - width / 10 && mouseX < this.centerX + width / 10 && mouseY > this.centerY - height / 10 && mouseY < this.centerX + height / 10;
    }
    onDraw() {
      super.onDraw();
      text(this.text, this.x, this.y, this._width, this._height);
    }
  };

  // src/app/game.ts
  var Game = class extends Entity {
    constructor() {
      super();
      this._score = 0;
    }
    get score() {
      return this._score;
    }
    set score(score) {
      if (this._score !== score) {
        const baseTextSize = height * 0.05;
        const options = {
          stroke: false,
          fill: color(170),
          textSize: baseTextSize,
          textAlign: {
            x: CENTER,
            y: CENTER
          }
        };
        const text2 = new Text(`Score: ${this.score}`, width / 2, height * 0.1, void 0, void 0, options);
        if (this._score < score) {
          this.addChild(new Animation({
            from: 0,
            to: 1,
            duration: 20,
            onSetup: () => {
              this.addChild(text2);
            },
            onUpdate: (value) => {
              options.textSize = baseTextSize * Math.max(1, value + 0.5);
              options.fill = color(100, 255, 255, (1 - value) * 255);
            },
            onTeardown: () => {
              this.removeChild(text2);
            }
          }));
        } else if (this._score > score) {
          this.addChild(new Animation({
            from: 0,
            to: 1,
            duration: 20,
            onSetup: () => {
              this.addChild(text2);
            },
            onUpdate: (value) => {
              options.textSize = baseTextSize * Math.max(1, value + 0.5);
              options.fill = color(255, 100, 100, (1 - value) * 255);
            },
            onTeardown: () => {
              this.removeChild(text2);
            }
          }));
        }
        this._score = score;
      }
    }
    onDraw() {
      this.drawScore();
      this.drawSchema();
    }
    drawScore() {
      noStroke();
      fill(170);
      textSize(height * 0.05);
      textAlign(CENTER, CENTER);
      text(`Score: ${this.score}`, width / 2, height * 0.1);
    }
    drawSchema() {
      noStroke();
      fill(90);
      textSize(height * 0.02);
      textAlign(LEFT, TOP);
      text(this.schema(5), 20, 20);
    }
  };
  var game = new Game();

  // src/app/cursor.ts
  var HISTORY_LENGTH = 100;
  var Cursor = class extends Circle {
    constructor() {
      super(0, 0, 15);
      this.history = [];
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
      const stroke2 = {
        color: color(255),
        weight: this.diameter / 4
      };
      const halo = new Circle(mouseX, mouseY, 0, {
        fill: false,
        stroke: stroke2
      });
      this.addChild(new Animation({
        from: 0,
        to: this.diameter * 5,
        duration: 100,
        easing: easingSet.easeOutQuart,
        onSetup: () => this.addChild(halo),
        onDraw: (value) => {
          halo.diameter = value;
          stroke2.color = color(255, (this.diameter * 5 - value) / (this.diameter * 5) * 255);
        },
        onTeardown: () => this.removeChild(halo)
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
    game.addChild(new Balloons(1));
    game.addChild(new Cursor());
    game.setup();
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2luZGV4LnRzIiwgIm5vZGVfbW9kdWxlcy9AZ2hvbS9lbnRpdHktYmFzZS9zcmMvYXBwL2Jhc2UudHMiLCAibm9kZV9tb2R1bGVzL0BnaG9tL2VudGl0eS1wNS9zcmMvYXBwL2VudGl0eS50cyIsICJub2RlX21vZHVsZXMvQGdob20vZW50aXR5LXA1L3NyYy9hcHAvZHJhd2FibGUudHMiLCAibm9kZV9tb2R1bGVzL0BnaG9tL2VudGl0eS1wNS9zcmMvYXBwL2Vhc2luZy50cyIsICJub2RlX21vZHVsZXMvQGdob20vZW50aXR5LXA1L3NyYy9hcHAvdGltZS50cyIsICJub2RlX21vZHVsZXMvQGdob20vZW50aXR5LXA1L3NyYy9hcHAvYW5pbWF0aW9uLnRzIiwgIm5vZGVfbW9kdWxlcy9AZ2hvbS9lbnRpdHktcDUvc3JjL2FwcC9zaGFwZS50cyIsICJzcmMvYXBwL2dhbWUudHMiLCAic3JjL2FwcC9jdXJzb3IudHMiLCAic3JjL2FwcC9iYWxsb29uLnRzIiwgInNyYy9hcHAvYmFsbG9vbnMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vLyBAdHMtY2hlY2tcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvQHR5cGVzL3A1L2dsb2JhbC5kLnRzXCIgLz5cblxuaW1wb3J0IHsgZ2FtZSB9IGZyb20gXCIuL2FwcC9nYW1lXCJcbmltcG9ydCB7IEN1cnNvciB9IGZyb20gXCIuL2FwcC9jdXJzb3JcIlxuaW1wb3J0IHsgQmFsbG9vbnMgfSBmcm9tIFwiLi9hcHAvYmFsbG9vbnNcIlxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgKGV2ZW50KSA9PiBldmVudC5wcmV2ZW50RGVmYXVsdCgpKVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0dXAoKSB7XG4gIGNyZWF0ZUNhbnZhcyhcbiAgICBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsIHdpbmRvdy5pbm5lcldpZHRoIHx8IDApLFxuICAgIE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKVxuICApXG5cbiAgZ2FtZS5hZGRDaGlsZChuZXcgQmFsbG9vbnMoMSkpXG4gIGdhbWUuYWRkQ2hpbGQobmV3IEN1cnNvcigpKVxuXG4gIGdhbWUuc2V0dXAoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZHJhdygpIHtcbiAgYmFja2dyb3VuZCgyMClcblxuICBnYW1lLmRyYXcoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlKHRpbWVzdGFtcDogbnVtYmVyKSB7XG4gIGdhbWUudXBkYXRlKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGtleVByZXNzZWQoKSB7fVxuZXhwb3J0IGZ1bmN0aW9uIGtleVJlbGVhc2VkKCkge31cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZVByZXNzZWQoKSB7XG4gIGdhbWUubW91c2VQcmVzc2VkKClcbn1cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZVJlbGVhc2VkKCkge1xuICBnYW1lLm1vdXNlUmVsZWFzZWQoKVxufVxuXG4vKipcbiAqIGRlYnVnIGltcG9ydHMgKGFjY2Vzc2libGUgZnJvbSBmcm9udGVuZCBjb25zb2xlIHdpdGggYGFwcC5yb290YClcbiAqL1xuZXhwb3J0IGNvbnN0IHJvb3QgPSBnYW1lXG4iLCAiZXhwb3J0IHR5cGUgRW50aXR5RXZlbnROYW1lID0gXCJzZXR1cFwiIHwgXCJ1cGRhdGVcIiB8IFwidGVhcmRvd25cIlxuXG5leHBvcnQgdHlwZSBFbnRpdHlMaXN0ZW5lcjxcbiAgRXZlbnROYW1lIGV4dGVuZHMgc3RyaW5nLFxuICBUaGlzIGV4dGVuZHMgQmFzZTxFdmVudE5hbWU+XG4+ID0gKHRoaXM6IFRoaXMsIGl0OiBUaGlzKSA9PiB1bmtub3duXG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCYXNlPEV2ZW50TmFtZSBleHRlbmRzIHN0cmluZz4ge1xuICBwcm90ZWN0ZWQgX2lzU2V0dXAgPSBmYWxzZVxuICBwcm90ZWN0ZWQgX2NoaWxkcmVuID0gbmV3IFNldDxCYXNlPEV2ZW50TmFtZSB8IEVudGl0eUV2ZW50TmFtZT4+KClcbiAgcHJvdGVjdGVkIF9wYXJlbnQ/OiBCYXNlPEV2ZW50TmFtZSB8IEVudGl0eUV2ZW50TmFtZT5cbiAgcHJvdGVjdGVkIF9saXN0ZW5lcnM6IEVudGl0eUxpc3RlbmVyPEV2ZW50TmFtZSB8IEVudGl0eUV2ZW50TmFtZSwgdGhpcz5bXSA9IFtdXG4gIHByb3RlY3RlZCBfc3RvcFBvaW50czogUGFydGlhbDxSZWNvcmQ8RXZlbnROYW1lIHwgRW50aXR5RXZlbnROYW1lLCBib29sZWFuPj4gPVxuICAgIHt9XG5cbiAgZ2V0IGlzU2V0dXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lzU2V0dXBcbiAgfVxuXG4gIGdldCBjaGlsZHJlbigpOiBBcnJheTxCYXNlPEV2ZW50TmFtZSB8IEVudGl0eUV2ZW50TmFtZT4+IHtcbiAgICByZXR1cm4gWy4uLnRoaXMuX2NoaWxkcmVuXVxuICB9XG5cbiAgZ2V0IHBhcmVudCgpOiBCYXNlPEV2ZW50TmFtZSB8IEVudGl0eUV2ZW50TmFtZT4gfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnRcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXByZXNlbnQgYW55IHN0YXRlLWJhc2VkIGVudGl0eVxuICAgKi9cbiAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25TZXR1cCgpIHt9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcbiAgICovXG4gIG9uVXBkYXRlKCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25UZWFyZG93bigpIHt9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxuICAgKi9cbiAgcHVibGljIHNldHVwKCkge1xuICAgIGlmICghdGhpcy5pc1NldHVwKSB7XG4gICAgICB0aGlzLm9uU2V0dXAoKVxuICAgICAgdGhpcy50cmFuc21pdChcInNldHVwXCIpXG4gICAgICB0aGlzLl9pc1NldHVwID0gdHJ1ZVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbnRpdHkgaXMgYWxyZWFkeSBzZXR1cFwiKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cbiAgICogU2hvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiFcbiAgICovXG4gIHB1YmxpYyB1cGRhdGUoKSB7XG4gICAgaWYgKHRoaXMuaXNTZXR1cCkge1xuICAgICAgdGhpcy5vblVwZGF0ZSgpXG4gICAgICB0aGlzLnRyYW5zbWl0KFwidXBkYXRlXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybihcInVwZGF0ZSBpcyBjYWxsZWQgYmVmb3JlIHNldHVwXCIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxuICAgKi9cbiAgcHVibGljIHRlYXJkb3duKCkge1xuICAgIGlmICh0aGlzLmlzU2V0dXApIHtcbiAgICAgIHRoaXMuX2lzU2V0dXAgPSBmYWxzZVxuICAgICAgdGhpcy5vblRlYXJkb3duKClcbiAgICAgIHRoaXMuX3BhcmVudD8ucmVtb3ZlQ2hpbGQodGhpcylcbiAgICAgIHRoaXMudHJhbnNtaXQoXCJ0ZWFyZG93blwiKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbnRpdHkgbXVzdCBiZSBzZXR1cCBiZWZvcmVcIilcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb24obmFtZTogRXZlbnROYW1lLCBsaXN0ZW5lcjogRW50aXR5TGlzdGVuZXI8RXZlbnROYW1lLCB0aGlzPikge1xuICAgIHRoaXMuX2xpc3RlbmVycy5wdXNoKFxuICAgICAge1xuICAgICAgICBbbmFtZV0oKSB7XG4gICAgICAgICAgbGlzdGVuZXIuYmluZCh0aGlzKSh0aGlzKVxuICAgICAgICB9LFxuICAgICAgfVtuYW1lXS5iaW5kKHRoaXMpXG4gICAgKVxuICB9XG5cbiAgcHVibGljIGFkZENoaWxkKC4uLmNoaWxkcmVuOiBCYXNlPEV2ZW50TmFtZT5bXSkge1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgIGNoaWxkLl9wYXJlbnQgPSB0aGlzXG4gICAgICB0aGlzLl9jaGlsZHJlbi5hZGQoY2hpbGQpXG4gICAgICBpZiAodGhpcy5pc1NldHVwKSBjaGlsZC5zZXR1cCgpXG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlbW92ZUNoaWxkKC4uLmNoaWxkcmVuOiBCYXNlPEV2ZW50TmFtZT5bXSkge1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgIGlmIChjaGlsZC5pc1NldHVwKSBjaGlsZC50ZWFyZG93bigpXG4gICAgICBlbHNlIHRoaXMuX2NoaWxkcmVuLmRlbGV0ZShjaGlsZClcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc3RvcFRyYW5zbWlzc2lvbihuYW1lOiBFdmVudE5hbWUgfCBFbnRpdHlFdmVudE5hbWUpIHtcbiAgICB0aGlzLl9zdG9wUG9pbnRzW25hbWVdID0gdHJ1ZVxuICB9XG5cbiAgcHVibGljIHRyYW5zbWl0KG5hbWU6IEV2ZW50TmFtZSB8IEVudGl0eUV2ZW50TmFtZSkge1xuICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgdGhpcy5nZXRMaXN0ZW5lcnNCeU5hbWUobmFtZSkpXG4gICAgICBsaXN0ZW5lci5iaW5kKHRoaXMpKHRoaXMpXG5cbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pIHtcbiAgICAgIGlmICh0aGlzLl9zdG9wUG9pbnRzW25hbWVdKSB7XG4gICAgICAgIHRoaXMuX3N0b3BQb2ludHNbbmFtZV0gPSBmYWxzZVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgY2hpbGRbbmFtZV0oKVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRMaXN0ZW5lcnNCeU5hbWUobmFtZTogRXZlbnROYW1lIHwgRW50aXR5RXZlbnROYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xpc3RlbmVycy5maWx0ZXIoKGxpc3RlbmVyKSA9PiB7XG4gICAgICByZXR1cm4gbGlzdGVuZXIubmFtZSA9PT0gbmFtZVxuICAgIH0pXG4gIH1cblxuICBwdWJsaWMgc2NoZW1hKFxuICAgIGluZGVudGF0aW9uID0gMixcbiAgICBkZXB0aCA9IDAsXG4gICAgaW5kZXg6IG51bWJlciB8IG51bGwgPSBudWxsXG4gICk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAke1wiIFwiLnJlcGVhdChpbmRlbnRhdGlvbikucmVwZWF0KGRlcHRoKX0ke1xuICAgICAgaW5kZXggPT09IG51bGwgPyBcIlwiIDogYCR7aW5kZXh9IC0gYFxuICAgIH0ke3RoaXMuY29uc3RydWN0b3IubmFtZX0ke1xuICAgICAgdGhpcy5fY2hpbGRyZW4uc2l6ZSA+IDBcbiAgICAgICAgPyBgIChjaGlsZHJlbjogJHt0aGlzLmNoaWxkcmVuLmxlbmd0aH0pJHtcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVycy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgID8gYCAobGlzdGVuZXJzOiAke3RoaXMuX2xpc3RlbmVycy5sZW5ndGh9KWBcbiAgICAgICAgICAgICAgOiBcIlwiXG4gICAgICAgICAgfVxcbiR7dGhpcy5jaGlsZHJlblxuICAgICAgICAgICAgLm1hcChcbiAgICAgICAgICAgICAgKGNoaWxkLCBpbmRleCkgPT4gYCR7Y2hpbGQuc2NoZW1hKGluZGVudGF0aW9uLCBkZXB0aCArIDEsIGluZGV4KX1gXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuam9pbihcIlxcblwiKX1gXG4gICAgICAgIDogXCJcIlxuICAgIH1gXG4gIH1cbn1cbiIsICJpbXBvcnQgeyBCYXNlIH0gZnJvbSBcIkBnaG9tL2VudGl0eS1iYXNlXCJcblxuZXhwb3J0IHR5cGUgRW50aXR5RXZlbnROYW1lID1cbiAgfCBcInNldHVwXCJcbiAgfCBcInVwZGF0ZVwiXG4gIHwgXCJ0ZWFyZG93blwiXG4gIHwgXCJkcmF3XCJcbiAgfCBcIm1vdXNlUHJlc3NlZFwiXG4gIHwgXCJtb3VzZVJlbGVhc2VkXCJcbiAgfCBcImtleVByZXNzZWRcIlxuICB8IFwia2V5UmVsZWFzZWRcIlxuXG5leHBvcnQgY2xhc3MgRW50aXR5IGV4dGVuZHMgQmFzZTxFbnRpdHlFdmVudE5hbWU+IHtcbiAgcHJvdGVjdGVkIF9jaGlsZHJlbiA9IG5ldyBTZXQ8RW50aXR5PigpXG4gIHByb3RlY3RlZCBfekluZGV4PzogbnVtYmVyXG5cbiAgZ2V0IHpJbmRleCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl96SW5kZXggPz8gdGhpcy5wYXJlbnQ/LmNoaWxkcmVuLmluZGV4T2YodGhpcykgPz8gMFxuICB9XG5cbiAgZ2V0IGNoaWxkcmVuKCk6IEFycmF5PEVudGl0eT4ge1xuICAgIHJldHVybiBbLi4udGhpcy5fY2hpbGRyZW5dXG4gIH1cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25EcmF3KCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25Nb3VzZVJlbGVhc2VkKCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25Nb3VzZVByZXNzZWQoKSB7fVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIGJlIG92ZXJ3cml0dGVuIGJ5IHlvdXIgb3duIHdvcmtpbmdzXG4gICAqL1xuICBvbktleVJlbGVhc2VkKCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25LZXlQcmVzc2VkKCkge31cblxuICAvKipcbiAgICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjdXJyZW50IGVudGl0eSBpcyBhIHJvb3QuXG4gICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXG4gICAqL1xuICBwdWJsaWMgZHJhdygpIHtcbiAgICBpZiAodGhpcy5pc1NldHVwKSB7XG4gICAgICB0aGlzLm9uRHJhdygpXG4gICAgICB0aGlzLnRyYW5zbWl0KFwiZHJhd1wiKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJEcmF3IGlzIGNhbGxlZCBiZWZvcmUgc2V0dXBcIilcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjdXJyZW50IGVudGl0eSBpcyBhIHJvb3QuXG4gICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXG4gICAqL1xuICBwdWJsaWMgbW91c2VQcmVzc2VkKCkge1xuICAgIGlmICh0aGlzLmlzU2V0dXApIHtcbiAgICAgIHRoaXMub25Nb3VzZVByZXNzZWQoKVxuICAgICAgdGhpcy50cmFuc21pdChcIm1vdXNlUHJlc3NlZFwiKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJtb3VzZVByZXNzZWQgaXMgY2FsbGVkIGJlZm9yZSBzZXR1cFwiKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cbiAgICogU2hvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiFcbiAgICovXG4gIHB1YmxpYyBtb3VzZVJlbGVhc2VkKCkge1xuICAgIGlmICh0aGlzLmlzU2V0dXApIHtcbiAgICAgIHRoaXMub25Nb3VzZVJlbGVhc2VkKClcbiAgICAgIHRoaXMudHJhbnNtaXQoXCJtb3VzZVJlbGVhc2VkXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybihcIm1vdXNlUHJlc3NlZCBpcyBjYWxsZWQgYmVmb3JlIHNldHVwXCIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxuICAgKi9cbiAgcHVibGljIGtleVByZXNzZWQoKSB7XG4gICAgaWYgKHRoaXMuaXNTZXR1cCkge1xuICAgICAgdGhpcy5vbktleVByZXNzZWQoKVxuICAgICAgdGhpcy50cmFuc21pdChcImtleVByZXNzZWRcIilcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKFwia2V5UHJlc3NlZCBpcyBjYWxsZWQgYmVmb3JlIHNldHVwXCIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxuICAgKi9cbiAgcHVibGljIGtleVJlbGVhc2VkKCkge1xuICAgIGlmICh0aGlzLmlzU2V0dXApIHtcbiAgICAgIHRoaXMub25LZXlSZWxlYXNlZCgpXG4gICAgICB0aGlzLnRyYW5zbWl0KFwia2V5UmVsZWFzZWRcIilcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKFwia2V5UmVsZWFzZWQgaXMgY2FsbGVkIGJlZm9yZSBzZXR1cFwiKVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB0cmFuc21pdChuYW1lOiBFbnRpdHlFdmVudE5hbWUpIHtcbiAgICBmb3IgKGNvbnN0IGxpc3RlbmVyIG9mIHRoaXMuZ2V0TGlzdGVuZXJzQnlOYW1lKG5hbWUpKVxuICAgICAgbGlzdGVuZXIuYmluZCh0aGlzKSh0aGlzKVxuXG4gICAgbGV0IGNoaWxkcmVuID1cbiAgICAgIG5hbWUgPT09IFwibW91c2VSZWxlYXNlZFwiIHx8XG4gICAgICBuYW1lID09PSBcIm1vdXNlUHJlc3NlZFwiIHx8XG4gICAgICBuYW1lID09PSBcImtleVByZXNzZWRcIiB8fFxuICAgICAgbmFtZSA9PT0gXCJrZXlSZWxlYXNlZFwiXG4gICAgICAgID8gdGhpcy5jaGlsZHJlbi5zb3J0KChhLCBiKSA9PiBhLnpJbmRleCAtIGIuekluZGV4KVxuICAgICAgICA6IHRoaXMuY2hpbGRyZW4uc29ydCgoYSwgYikgPT4gYi56SW5kZXggLSBhLnpJbmRleClcblxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgIGlmICh0aGlzLl9zdG9wUG9pbnRzW25hbWVdKSB7XG4gICAgICAgIHRoaXMuX3N0b3BQb2ludHNbbmFtZV0gPSBmYWxzZVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY2hpbGRbbmFtZV0oKVxuICAgIH1cbiAgfVxufVxuIiwgImltcG9ydCAqIGFzIHA1IGZyb20gXCJwNVwiXG5pbXBvcnQgeyBFbnRpdHkgfSBmcm9tIFwiLi9lbnRpdHlcIlxuXG5leHBvcnQgaW50ZXJmYWNlIERyYXdhYmxlU2V0dGluZ3Mge1xuICBmaWxsOiBmYWxzZSB8IEZpbGxPcHRpb25zXG4gIHN0cm9rZTogZmFsc2UgfCBTdHJva2VPcHRpb25zXG4gIHRleHRTaXplPzogbnVtYmVyXG4gIHRleHRBbGlnbj86IHtcbiAgICB4PzogcDUuSE9SSVpfQUxJR05cbiAgICB5PzogcDUuVkVSVF9BTElHTlxuICB9XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBEcmF3YWJsZSBleHRlbmRzIEVudGl0eSB7XG4gIHByb3RlY3RlZCBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc2V0dGluZ3M/OiBEcmF3YWJsZVNldHRpbmdzKSB7XG4gICAgc3VwZXIoKVxuICB9XG5cbiAgb25EcmF3KCkge1xuICAgIGlmICghdGhpcy5zZXR0aW5ncykgcmV0dXJuXG5cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5maWxsKSB7XG4gICAgICBpZiAoXCJjb2xvclwiIGluIHRoaXMuc2V0dGluZ3MuZmlsbCkge1xuICAgICAgICBmaWxsKHRoaXMuc2V0dGluZ3MuZmlsbC5jb2xvcilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbGwodGhpcy5zZXR0aW5ncy5maWxsKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBub0ZpbGwoKVxuICAgIH1cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLnN0cm9rZSkge1xuICAgICAgc3Ryb2tlV2VpZ2h0KHRoaXMuc2V0dGluZ3Muc3Ryb2tlLndlaWdodClcbiAgICAgIHN0cm9rZSh0aGlzLnNldHRpbmdzLnN0cm9rZS5jb2xvcilcbiAgICB9IGVsc2Uge1xuICAgICAgbm9TdHJva2UoKVxuICAgIH1cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLnRleHRBbGlnbikge1xuICAgICAgdGV4dEFsaWduKHRoaXMuc2V0dGluZ3MudGV4dEFsaWduLngsIHRoaXMuc2V0dGluZ3MudGV4dEFsaWduLnkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRleHRBbGlnbihDRU5URVIsIENFTlRFUilcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zZXR0aW5ncy50ZXh0U2l6ZSkge1xuICAgICAgdGV4dFNpemUodGhpcy5zZXR0aW5ncy50ZXh0U2l6ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGV4dFNpemUoaGVpZ2h0ICogMC4xKVxuICAgIH1cbiAgfVxufVxuIiwgIi8vIHNvdXJjZTogaHR0cHM6Ly9naXRodWIuY29tL2FpL2Vhc2luZ3MubmV0L2Jsb2IvbWFzdGVyL3NyYy9lYXNpbmdzL2Vhc2luZ3NGdW5jdGlvbnMudHNcblxuZXhwb3J0IHR5cGUgRWFzaW5nRnVuY3Rpb24gPSAocHJvZ3Jlc3M6IG51bWJlcikgPT4gbnVtYmVyXG5cbmV4cG9ydCB0eXBlIEVhc2luZ05hbWUgPVxuICB8IFwibGluZWFyXCJcbiAgfCBcImVhc2VJblF1YWRcIlxuICB8IFwiZWFzZU91dFF1YWRcIlxuICB8IFwiZWFzZUluT3V0UXVhZFwiXG4gIHwgXCJlYXNlSW5DdWJpY1wiXG4gIHwgXCJlYXNlT3V0Q3ViaWNcIlxuICB8IFwiZWFzZUluT3V0Q3ViaWNcIlxuICB8IFwiZWFzZUluUXVhcnRcIlxuICB8IFwiZWFzZU91dFF1YXJ0XCJcbiAgfCBcImVhc2VJbk91dFF1YXJ0XCJcbiAgfCBcImVhc2VJblF1aW50XCJcbiAgfCBcImVhc2VPdXRRdWludFwiXG4gIHwgXCJlYXNlSW5PdXRRdWludFwiXG4gIHwgXCJlYXNlSW5TaW5lXCJcbiAgfCBcImVhc2VPdXRTaW5lXCJcbiAgfCBcImVhc2VJbk91dFNpbmVcIlxuICB8IFwiZWFzZUluRXhwb1wiXG4gIHwgXCJlYXNlT3V0RXhwb1wiXG4gIHwgXCJlYXNlSW5PdXRFeHBvXCJcbiAgfCBcImVhc2VJbkNpcmNcIlxuICB8IFwiZWFzZU91dENpcmNcIlxuICB8IFwiZWFzZUluT3V0Q2lyY1wiXG4gIHwgXCJlYXNlSW5CYWNrXCJcbiAgfCBcImVhc2VPdXRCYWNrXCJcbiAgfCBcImVhc2VJbk91dEJhY2tcIlxuICB8IFwiZWFzZUluRWxhc3RpY1wiXG4gIHwgXCJlYXNlT3V0RWxhc3RpY1wiXG4gIHwgXCJlYXNlSW5PdXRFbGFzdGljXCJcbiAgfCBcImVhc2VJbkJvdW5jZVwiXG4gIHwgXCJlYXNlT3V0Qm91bmNlXCJcbiAgfCBcImVhc2VJbk91dEJvdW5jZVwiXG5cbmNvbnN0IFBJID0gTWF0aC5QSVxuY29uc3QgYzEgPSAxLjcwMTU4XG5jb25zdCBjMiA9IGMxICogMS41MjVcbmNvbnN0IGMzID0gYzEgKyAxXG5jb25zdCBjNCA9ICgyICogUEkpIC8gM1xuY29uc3QgYzUgPSAoMiAqIFBJKSAvIDQuNVxuXG5jb25zdCBib3VuY2VPdXQ6IEVhc2luZ0Z1bmN0aW9uID0gZnVuY3Rpb24gKHgpIHtcbiAgY29uc3QgbjEgPSA3LjU2MjVcbiAgY29uc3QgZDEgPSAyLjc1XG5cbiAgaWYgKHggPCAxIC8gZDEpIHtcbiAgICByZXR1cm4gbjEgKiB4ICogeFxuICB9IGVsc2UgaWYgKHggPCAyIC8gZDEpIHtcbiAgICByZXR1cm4gbjEgKiAoeCAtPSAxLjUgLyBkMSkgKiB4ICsgMC43NVxuICB9IGVsc2UgaWYgKHggPCAyLjUgLyBkMSkge1xuICAgIHJldHVybiBuMSAqICh4IC09IDIuMjUgLyBkMSkgKiB4ICsgMC45Mzc1XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG4xICogKHggLT0gMi42MjUgLyBkMSkgKiB4ICsgMC45ODQzNzVcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZWFzaW5nU2V0OiBSZWNvcmQ8RWFzaW5nTmFtZSwgRWFzaW5nRnVuY3Rpb24+ID0ge1xuICBsaW5lYXI6ICh4KSA9PiB4LFxuICBlYXNlSW5RdWFkOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4ICogeFxuICB9LFxuICBlYXNlT3V0UXVhZDogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gMSAtICgxIC0geCkgKiAoMSAtIHgpXG4gIH0sXG4gIGVhc2VJbk91dFF1YWQ6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggPCAwLjUgPyAyICogeCAqIHggOiAxIC0gcG93KC0yICogeCArIDIsIDIpIC8gMlxuICB9LFxuICBlYXNlSW5DdWJpYzogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4geCAqIHggKiB4XG4gIH0sXG4gIGVhc2VPdXRDdWJpYzogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gMSAtIHBvdygxIC0geCwgMylcbiAgfSxcbiAgZWFzZUluT3V0Q3ViaWM6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggPCAwLjUgPyA0ICogeCAqIHggKiB4IDogMSAtIHBvdygtMiAqIHggKyAyLCAzKSAvIDJcbiAgfSxcbiAgZWFzZUluUXVhcnQ6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggKiB4ICogeCAqIHhcbiAgfSxcbiAgZWFzZU91dFF1YXJ0OiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiAxIC0gcG93KDEgLSB4LCA0KVxuICB9LFxuICBlYXNlSW5PdXRRdWFydDogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4geCA8IDAuNSA/IDggKiB4ICogeCAqIHggKiB4IDogMSAtIHBvdygtMiAqIHggKyAyLCA0KSAvIDJcbiAgfSxcbiAgZWFzZUluUXVpbnQ6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggKiB4ICogeCAqIHggKiB4XG4gIH0sXG4gIGVhc2VPdXRRdWludDogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gMSAtIHBvdygxIC0geCwgNSlcbiAgfSxcbiAgZWFzZUluT3V0UXVpbnQ6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggPCAwLjUgPyAxNiAqIHggKiB4ICogeCAqIHggKiB4IDogMSAtIHBvdygtMiAqIHggKyAyLCA1KSAvIDJcbiAgfSxcbiAgZWFzZUluU2luZTogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gMSAtIGNvcygoeCAqIFBJKSAvIDIpXG4gIH0sXG4gIGVhc2VPdXRTaW5lOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiBzaW4oKHggKiBQSSkgLyAyKVxuICB9LFxuICBlYXNlSW5PdXRTaW5lOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiAtKGNvcyhQSSAqIHgpIC0gMSkgLyAyXG4gIH0sXG4gIGVhc2VJbkV4cG86IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggPT09IDAgPyAwIDogcG93KDIsIDEwICogeCAtIDEwKVxuICB9LFxuICBlYXNlT3V0RXhwbzogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4geCA9PT0gMSA/IDEgOiAxIC0gcG93KDIsIC0xMCAqIHgpXG4gIH0sXG4gIGVhc2VJbk91dEV4cG86IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggPT09IDBcbiAgICAgID8gMFxuICAgICAgOiB4ID09PSAxXG4gICAgICA/IDFcbiAgICAgIDogeCA8IDAuNVxuICAgICAgPyBwb3coMiwgMjAgKiB4IC0gMTApIC8gMlxuICAgICAgOiAoMiAtIHBvdygyLCAtMjAgKiB4ICsgMTApKSAvIDJcbiAgfSxcbiAgZWFzZUluQ2lyYzogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gMSAtIHNxcnQoMSAtIHBvdyh4LCAyKSlcbiAgfSxcbiAgZWFzZU91dENpcmM6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHNxcnQoMSAtIHBvdyh4IC0gMSwgMikpXG4gIH0sXG4gIGVhc2VJbk91dENpcmM6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggPCAwLjVcbiAgICAgID8gKDEgLSBzcXJ0KDEgLSBwb3coMiAqIHgsIDIpKSkgLyAyXG4gICAgICA6IChzcXJ0KDEgLSBwb3coLTIgKiB4ICsgMiwgMikpICsgMSkgLyAyXG4gIH0sXG4gIGVhc2VJbkJhY2s6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIGMzICogeCAqIHggKiB4IC0gYzEgKiB4ICogeFxuICB9LFxuICBlYXNlT3V0QmFjazogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gMSArIGMzICogcG93KHggLSAxLCAzKSArIGMxICogcG93KHggLSAxLCAyKVxuICB9LFxuICBlYXNlSW5PdXRCYWNrOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4IDwgMC41XG4gICAgICA/IChwb3coMiAqIHgsIDIpICogKChjMiArIDEpICogMiAqIHggLSBjMikpIC8gMlxuICAgICAgOiAocG93KDIgKiB4IC0gMiwgMikgKiAoKGMyICsgMSkgKiAoeCAqIDIgLSAyKSArIGMyKSArIDIpIC8gMlxuICB9LFxuICBlYXNlSW5FbGFzdGljOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4ID09PSAwXG4gICAgICA/IDBcbiAgICAgIDogeCA9PT0gMVxuICAgICAgPyAxXG4gICAgICA6IC1wb3coMiwgMTAgKiB4IC0gMTApICogc2luKCh4ICogMTAgLSAxMC43NSkgKiBjNClcbiAgfSxcbiAgZWFzZU91dEVsYXN0aWM6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggPT09IDBcbiAgICAgID8gMFxuICAgICAgOiB4ID09PSAxXG4gICAgICA/IDFcbiAgICAgIDogcG93KDIsIC0xMCAqIHgpICogc2luKCh4ICogMTAgLSAwLjc1KSAqIGM0KSArIDFcbiAgfSxcbiAgZWFzZUluT3V0RWxhc3RpYzogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4geCA9PT0gMFxuICAgICAgPyAwXG4gICAgICA6IHggPT09IDFcbiAgICAgID8gMVxuICAgICAgOiB4IDwgMC41XG4gICAgICA/IC0ocG93KDIsIDIwICogeCAtIDEwKSAqIHNpbigoMjAgKiB4IC0gMTEuMTI1KSAqIGM1KSkgLyAyXG4gICAgICA6IChwb3coMiwgLTIwICogeCArIDEwKSAqIHNpbigoMjAgKiB4IC0gMTEuMTI1KSAqIGM1KSkgLyAyICsgMVxuICB9LFxuICBlYXNlSW5Cb3VuY2U6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIDEgLSBib3VuY2VPdXQoMSAtIHgpXG4gIH0sXG4gIGVhc2VPdXRCb3VuY2U6IGJvdW5jZU91dCxcbiAgZWFzZUluT3V0Qm91bmNlOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4IDwgMC41XG4gICAgICA/ICgxIC0gYm91bmNlT3V0KDEgLSAyICogeCkpIC8gMlxuICAgICAgOiAoMSArIGJvdW5jZU91dCgyICogeCAtIDEpKSAvIDJcbiAgfSxcbn1cbiIsICJpbXBvcnQgeyBFbnRpdHkgfSBmcm9tIFwiLi9lbnRpdHlcIlxuXG5leHBvcnQgY2xhc3MgVGltZSBleHRlbmRzIEVudGl0eSB7XG4gIHByb3RlY3RlZCBzdGFydGVkQXQgPSAwXG5cbiAgb25TZXR1cCgpIHtcbiAgICB0aGlzLnN0YXJ0ZWRBdCA9IGZyYW1lQ291bnRcbiAgfVxufVxuIiwgImltcG9ydCB7IEVhc2luZ0Z1bmN0aW9uLCBlYXNpbmdTZXQgfSBmcm9tIFwiLi9lYXNpbmdcIlxuaW1wb3J0IHsgVGltZSB9IGZyb20gXCIuL3RpbWVcIlxuXG5leHBvcnQgaW50ZXJmYWNlIEFuaW1hdGlvblNldHRpbmdzIHtcbiAgZnJvbTogbnVtYmVyXG4gIHRvOiBudW1iZXJcbiAgLyoqXG4gICAqIEFuaW1hdGlvbiBkdXJhdGlvbiBpbiAqKmZyYW1lIGNvdW50KiohXG4gICAqL1xuICBkdXJhdGlvbjogbnVtYmVyXG4gIGVhc2luZz86IEVhc2luZ0Z1bmN0aW9uXG4gIG9uU2V0dXA/OiAoKSA9PiB1bmtub3duXG4gIG9uRHJhdz86ICh2YWx1ZTogbnVtYmVyKSA9PiB1bmtub3duXG4gIG9uVXBkYXRlPzogKHZhbHVlOiBudW1iZXIpID0+IHVua25vd25cbiAgb25UZWFyZG93bj86ICgpID0+IHVua25vd25cbn1cblxuLyoqXG4gKiBFcXVpdmFsZW50IG9mIFR3ZWVuXG4gKi9cbmV4cG9ydCBjbGFzcyBBbmltYXRpb24gZXh0ZW5kcyBUaW1lIHtcbiAgcHJpdmF0ZSByZWFkb25seSBlYXNpbmc6IEVhc2luZ0Z1bmN0aW9uXG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzZXR0aW5nczogQW5pbWF0aW9uU2V0dGluZ3MpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5lYXNpbmcgPSBzZXR0aW5ncy5lYXNpbmcgPz8gZWFzaW5nU2V0LmxpbmVhclxuICB9XG5cbiAgb25TZXR1cCgpIHtcbiAgICB0aGlzLnNldHRpbmdzLm9uU2V0dXA/LigpXG4gICAgc3VwZXIub25TZXR1cCgpXG4gICAgdGhpcy5zZXR0aW5ncy5vblVwZGF0ZT8uKHRoaXMuc2V0dGluZ3MuZnJvbSlcbiAgfVxuXG4gIG9uRHJhdygpIHtcbiAgICB0aGlzLnNldHRpbmdzLm9uRHJhdz8uKFxuICAgICAgbWFwKFxuICAgICAgICB0aGlzLmVhc2luZygoZnJhbWVDb3VudCAtIHRoaXMuc3RhcnRlZEF0KSAvIHRoaXMuc2V0dGluZ3MuZHVyYXRpb24pLFxuICAgICAgICAwLFxuICAgICAgICAxLFxuICAgICAgICB0aGlzLnNldHRpbmdzLmZyb20sXG4gICAgICAgIHRoaXMuc2V0dGluZ3MudG9cbiAgICAgIClcbiAgICApXG4gIH1cblxuICBvblVwZGF0ZSgpIHtcbiAgICBpZiAoZnJhbWVDb3VudCAtIHRoaXMuc3RhcnRlZEF0ID49IHRoaXMuc2V0dGluZ3MuZHVyYXRpb24pIHtcbiAgICAgIHRoaXMudGVhcmRvd24oKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldHRpbmdzLm9uVXBkYXRlPy4oXG4gICAgICAgIG1hcChcbiAgICAgICAgICB0aGlzLmVhc2luZygoZnJhbWVDb3VudCAtIHRoaXMuc3RhcnRlZEF0KSAvIHRoaXMuc2V0dGluZ3MuZHVyYXRpb24pLFxuICAgICAgICAgIDAsXG4gICAgICAgICAgMSxcbiAgICAgICAgICB0aGlzLnNldHRpbmdzLmZyb20sXG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy50b1xuICAgICAgICApXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgb25UZWFyZG93bigpIHtcbiAgICB0aGlzLnNldHRpbmdzLm9uVXBkYXRlPy4odGhpcy5zZXR0aW5ncy50bylcbiAgICB0aGlzLnNldHRpbmdzLm9uVGVhcmRvd24/LigpXG4gIH1cbn1cbiIsICJpbXBvcnQgKiBhcyBwNSBmcm9tIFwicDVcIlxuaW1wb3J0IHsgRHJhd2FibGUsIERyYXdhYmxlU2V0dGluZ3MgfSBmcm9tIFwiLi9kcmF3YWJsZVwiXG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTaGFwZVxuICBleHRlbmRzIERyYXdhYmxlXG4gIGltcGxlbWVudHMgUG9zaXRpb25hYmxlLCBSZXNpemFibGVcbntcbiAgYWJzdHJhY3QgeDogbnVtYmVyXG4gIGFic3RyYWN0IHk6IG51bWJlclxuICBhYnN0cmFjdCB3aWR0aDogbnVtYmVyXG4gIGFic3RyYWN0IGhlaWdodDogbnVtYmVyXG4gIGFic3RyYWN0IHJlYWRvbmx5IGNlbnRlclg6IG51bWJlclxuICBhYnN0cmFjdCByZWFkb25seSBjZW50ZXJZOiBudW1iZXJcblxuICBnZXQgY2VudGVyKCk6IFt4OiBudW1iZXIsIHk6IG51bWJlcl0ge1xuICAgIHJldHVybiBbdGhpcy5jZW50ZXJYLCB0aGlzLmNlbnRlclldXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJlY3QgZXh0ZW5kcyBTaGFwZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyB4ID0gMCxcbiAgICBwdWJsaWMgeSA9IDAsXG4gICAgcHVibGljIHdpZHRoID0gMCxcbiAgICBwdWJsaWMgaGVpZ2h0ID0gMCxcbiAgICBvcHRpb25zPzogRHJhd2FibGVTZXR0aW5nc1xuICApIHtcbiAgICBzdXBlcihvcHRpb25zKVxuICB9XG5cbiAgZ2V0IGNlbnRlclgoKSB7XG4gICAgcmV0dXJuIHRoaXMueCArIHRoaXMud2lkdGggLyAyXG4gIH1cblxuICBnZXQgY2VudGVyWSgpIHtcbiAgICByZXR1cm4gdGhpcy55ICsgdGhpcy5oZWlnaHQgLyAyXG4gIH1cblxuICBnZXQgaXNIb3ZlcmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICBtb3VzZVggPiB0aGlzLnggJiZcbiAgICAgIG1vdXNlWCA8IHRoaXMueCArIHRoaXMud2lkdGggJiZcbiAgICAgIG1vdXNlWSA+IHRoaXMueSAmJlxuICAgICAgbW91c2VZIDwgdGhpcy55ICsgdGhpcy5oZWlnaHRcbiAgICApXG4gIH1cblxuICBvbkRyYXcoKSB7XG4gICAgc3VwZXIub25EcmF3KClcbiAgICByZWN0KHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ2lyY2xlIGV4dGVuZHMgU2hhcGUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgeCA9IDAsXG4gICAgcHVibGljIHkgPSAwLFxuICAgIHB1YmxpYyBkaWFtZXRlciA9IDAsXG4gICAgb3B0aW9ucz86IERyYXdhYmxlU2V0dGluZ3NcbiAgKSB7XG4gICAgc3VwZXIob3B0aW9ucylcbiAgfVxuXG4gIGdldCB3aWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5kaWFtZXRlclxuICB9XG5cbiAgZ2V0IGhlaWdodCgpIHtcbiAgICByZXR1cm4gdGhpcy5kaWFtZXRlclxuICB9XG5cbiAgZ2V0IGNlbnRlclgoKSB7XG4gICAgcmV0dXJuIHRoaXMueFxuICB9XG5cbiAgZ2V0IGNlbnRlclkoKSB7XG4gICAgcmV0dXJuIHRoaXMueVxuICB9XG5cbiAgZ2V0IGlzSG92ZXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZGlzdChtb3VzZVgsIG1vdXNlWSwgdGhpcy54LCB0aGlzLnkpIDwgdGhpcy5kaWFtZXRlciAvIDJcbiAgfVxuXG4gIG9uRHJhdygpIHtcbiAgICBzdXBlci5vbkRyYXcoKVxuICAgIGNpcmNsZSh0aGlzLngsIHRoaXMueSwgdGhpcy5kaWFtZXRlcilcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRWxsaXBzZSBleHRlbmRzIFJlY3Qge1xuICBnZXQgY2VudGVyWCgpIHtcbiAgICByZXR1cm4gdGhpcy54XG4gIH1cblxuICBnZXQgY2VudGVyWSgpIHtcbiAgICByZXR1cm4gdGhpcy55XG4gIH1cblxuICBnZXQgaXNIb3ZlcmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICBNYXRoLnBvdyhtb3VzZVggLSB0aGlzLngsIDIpIC8gTWF0aC5wb3codGhpcy53aWR0aCAvIDIsIDIpICtcbiAgICAgICAgTWF0aC5wb3cobW91c2VZIC0gdGhpcy55LCAyKSAvIE1hdGgucG93KHRoaXMuaGVpZ2h0IC8gMiwgMikgPD1cbiAgICAgIDFcbiAgICApXG4gIH1cblxuICBvbkRyYXcoKSB7XG4gICAgc3VwZXIub25EcmF3KClcbiAgICBlbGxpcHNlKHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTGluZSBleHRlbmRzIFNoYXBlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHggPSAwLFxuICAgIHB1YmxpYyB5ID0gMCxcbiAgICBwdWJsaWMgeDIgPSAwLFxuICAgIHB1YmxpYyB5MiA9IDAsXG4gICAgb3B0aW9ucz86IERyYXdhYmxlU2V0dGluZ3NcbiAgKSB7XG4gICAgc3VwZXIob3B0aW9ucylcbiAgfVxuXG4gIGdldCB3aWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy54MiAtIHRoaXMueFxuICB9XG5cbiAgZ2V0IGhlaWdodCgpIHtcbiAgICByZXR1cm4gdGhpcy55MiAtIHRoaXMueVxuICB9XG5cbiAgZ2V0IHNpemUoKSB7XG4gICAgcmV0dXJuIGRpc3QodGhpcy54LCB0aGlzLnksIHRoaXMueDIsIHRoaXMueTIpXG4gIH1cblxuICBnZXQgY2VudGVyWCgpIHtcbiAgICByZXR1cm4gdGhpcy54ICsgdGhpcy53aWR0aCAvIDJcbiAgfVxuXG4gIGdldCBjZW50ZXJZKCkge1xuICAgIHJldHVybiB0aGlzLnkgKyB0aGlzLmhlaWdodCAvIDJcbiAgfVxuXG4gIGdldCBpc0hvdmVyZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChcbiAgICAgIGRpc3QodGhpcy54LCB0aGlzLnksIG1vdXNlWCwgbW91c2VZKSArXG4gICAgICAgIGRpc3QobW91c2VYLCBtb3VzZVksIHRoaXMueDIsIHRoaXMueTIpIDw9XG4gICAgICB0aGlzLnNpemVcbiAgICApXG4gIH1cblxuICBvbkRyYXcoKSB7XG4gICAgc3VwZXIub25EcmF3KClcbiAgICBsaW5lKHRoaXMueCwgdGhpcy55LCB0aGlzLngyLCB0aGlzLnkyKVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJbWFnZSBleHRlbmRzIFJlY3Qge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgaW1nOiBwNS5JbWFnZSxcbiAgICBwdWJsaWMgeCA9IDAsXG4gICAgcHVibGljIHkgPSAwLFxuICAgIHdpZHRoPzogbnVtYmVyLFxuICAgIGhlaWdodD86IG51bWJlcixcbiAgICBvcHRpb25zPzogRHJhd2FibGVTZXR0aW5nc1xuICApIHtcbiAgICBzdXBlcih4LCB5LCB3aWR0aCA/PyBpbWcud2lkdGgsIGhlaWdodCA/PyBpbWcuaGVpZ2h0LCBvcHRpb25zKVxuICB9XG5cbiAgb25EcmF3KCkge1xuICAgIHN1cGVyLm9uRHJhdygpXG4gICAgaW1hZ2UodGhpcy5pbWcsIHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGV4dCBleHRlbmRzIFNoYXBlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHRleHQgPSBcIlwiLFxuICAgIHB1YmxpYyB4ID0gMCxcbiAgICBwdWJsaWMgeSA9IDAsXG4gICAgcHVibGljIF93aWR0aD86IG51bWJlcixcbiAgICBwdWJsaWMgX2hlaWdodD86IG51bWJlcixcbiAgICBvcHRpb25zPzogRHJhd2FibGVTZXR0aW5nc1xuICApIHtcbiAgICBzdXBlcihvcHRpb25zKVxuICB9XG5cbiAgZ2V0IHdpZHRoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3dpZHRoID8/IEluZmluaXR5XG4gIH1cblxuICBnZXQgaGVpZ2h0KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2hlaWdodCA/PyBJbmZpbml0eVxuICB9XG5cbiAgZ2V0IGNlbnRlclgoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0dGluZ3MudGV4dEFsaWduLnggPT09IENFTlRFUlxuICAgICAgPyB0aGlzLnhcbiAgICAgIDogdGhpcy54ICsgdGhpcy53aWR0aCAvIDJcbiAgfVxuXG4gIGdldCBjZW50ZXJZKCkge1xuICAgIHJldHVybiB0aGlzLnNldHRpbmdzLnRleHRBbGlnbi55ID09PSBDRU5URVJcbiAgICAgID8gdGhpcy55XG4gICAgICA6IHRoaXMueSArIHRoaXMuaGVpZ2h0IC8gMlxuICB9XG5cbiAgZ2V0IGlzSG92ZXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgbW91c2VYID4gdGhpcy5jZW50ZXJYIC0gd2lkdGggLyAxMCAmJlxuICAgICAgbW91c2VYIDwgdGhpcy5jZW50ZXJYICsgd2lkdGggLyAxMCAmJlxuICAgICAgbW91c2VZID4gdGhpcy5jZW50ZXJZIC0gaGVpZ2h0IC8gMTAgJiZcbiAgICAgIG1vdXNlWSA8IHRoaXMuY2VudGVyWCArIGhlaWdodCAvIDEwXG4gICAgKVxuICB9XG5cbiAgb25EcmF3KCkge1xuICAgIHN1cGVyLm9uRHJhdygpXG4gICAgdGV4dCh0aGlzLnRleHQsIHRoaXMueCwgdGhpcy55LCB0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0KVxuICB9XG59XG4iLCAiaW1wb3J0IHsgRW50aXR5LCBUZXh0LCBBbmltYXRpb24sIERyYXdhYmxlU2V0dGluZ3MgfSBmcm9tIFwiQGdob20vZW50aXR5LXA1XCJcblxuZXhwb3J0IGNsYXNzIEdhbWUgZXh0ZW5kcyBFbnRpdHkge1xuICBwcml2YXRlIF9zY29yZSA9IDBcblxuICBnZXQgc2NvcmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Njb3JlXG4gIH1cblxuICBzZXQgc2NvcmUoc2NvcmUpIHtcbiAgICBpZiAodGhpcy5fc2NvcmUgIT09IHNjb3JlKSB7XG4gICAgICBjb25zdCBiYXNlVGV4dFNpemUgPSBoZWlnaHQgKiAwLjA1XG5cbiAgICAgIGNvbnN0IG9wdGlvbnM6IERyYXdhYmxlU2V0dGluZ3MgPSB7XG4gICAgICAgIHN0cm9rZTogZmFsc2UsXG4gICAgICAgIGZpbGw6IGNvbG9yKDE3MCksXG4gICAgICAgIHRleHRTaXplOiBiYXNlVGV4dFNpemUsXG4gICAgICAgIHRleHRBbGlnbjoge1xuICAgICAgICAgIHg6IENFTlRFUixcbiAgICAgICAgICB5OiBDRU5URVIsXG4gICAgICAgIH0sXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRleHQgPSBuZXcgVGV4dChcbiAgICAgICAgYFNjb3JlOiAke3RoaXMuc2NvcmV9YCxcbiAgICAgICAgd2lkdGggLyAyLFxuICAgICAgICBoZWlnaHQgKiAwLjEsXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICBvcHRpb25zXG4gICAgICApXG5cbiAgICAgIGlmICh0aGlzLl9zY29yZSA8IHNjb3JlKSB7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQoXG4gICAgICAgICAgbmV3IEFuaW1hdGlvbih7XG4gICAgICAgICAgICBmcm9tOiAwLFxuICAgICAgICAgICAgdG86IDEsXG4gICAgICAgICAgICBkdXJhdGlvbjogMjAsXG4gICAgICAgICAgICBvblNldHVwOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQodGV4dClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvblVwZGF0ZTogKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgIG9wdGlvbnMudGV4dFNpemUgPSBiYXNlVGV4dFNpemUgKiBNYXRoLm1heCgxLCB2YWx1ZSArIDAuNSlcbiAgICAgICAgICAgICAgb3B0aW9ucy5maWxsID0gY29sb3IoMTAwLCAyNTUsIDI1NSwgKDEgLSB2YWx1ZSkgKiAyNTUpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25UZWFyZG93bjogKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnJlbW92ZUNoaWxkKHRleHQpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pXG4gICAgICAgIClcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fc2NvcmUgPiBzY29yZSkge1xuICAgICAgICB0aGlzLmFkZENoaWxkKFxuICAgICAgICAgIG5ldyBBbmltYXRpb24oe1xuICAgICAgICAgICAgZnJvbTogMCxcbiAgICAgICAgICAgIHRvOiAxLFxuICAgICAgICAgICAgZHVyYXRpb246IDIwLFxuICAgICAgICAgICAgb25TZXR1cDogKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmFkZENoaWxkKHRleHQpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25VcGRhdGU6ICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICBvcHRpb25zLnRleHRTaXplID0gYmFzZVRleHRTaXplICogTWF0aC5tYXgoMSwgdmFsdWUgKyAwLjUpXG4gICAgICAgICAgICAgIG9wdGlvbnMuZmlsbCA9IGNvbG9yKDI1NSwgMTAwLCAxMDAsICgxIC0gdmFsdWUpICogMjU1KVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uVGVhcmRvd246ICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5yZW1vdmVDaGlsZCh0ZXh0KVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3Njb3JlID0gc2NvcmVcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpXG4gIH1cblxuICBvbkRyYXcoKSB7XG4gICAgdGhpcy5kcmF3U2NvcmUoKVxuICAgIHRoaXMuZHJhd1NjaGVtYSgpXG4gIH1cblxuICBkcmF3U2NvcmUoKSB7XG4gICAgbm9TdHJva2UoKVxuICAgIGZpbGwoMTcwKVxuICAgIHRleHRTaXplKGhlaWdodCAqIDAuMDUpXG4gICAgdGV4dEFsaWduKENFTlRFUiwgQ0VOVEVSKVxuICAgIHRleHQoYFNjb3JlOiAke3RoaXMuc2NvcmV9YCwgd2lkdGggLyAyLCBoZWlnaHQgKiAwLjEpXG4gIH1cblxuICBkcmF3U2NoZW1hKCkge1xuICAgIG5vU3Ryb2tlKClcbiAgICBmaWxsKDkwKVxuICAgIHRleHRTaXplKGhlaWdodCAqIDAuMDIpXG4gICAgdGV4dEFsaWduKExFRlQsIFRPUClcbiAgICB0ZXh0KHRoaXMuc2NoZW1hKDUpLCAyMCwgMjApXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGdhbWUgPSBuZXcgR2FtZSgpXG4iLCAiaW1wb3J0IHsgQ2lyY2xlLCBBbmltYXRpb24sIGVhc2luZ1NldCB9IGZyb20gXCJAZ2hvbS9lbnRpdHktcDVcIlxuXG5jb25zdCBISVNUT1JZX0xFTkdUSCA9IDEwMFxuXG5leHBvcnQgY2xhc3MgQ3Vyc29yIGV4dGVuZHMgQ2lyY2xlIHtcbiAgcHVibGljIGhpc3Rvcnk6IFt4OiBudW1iZXIsIHk6IG51bWJlcl1bXSA9IFtdXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoMCwgMCwgMTUpXG4gIH1cblxuICBvblVwZGF0ZSgpIHtcbiAgICB0aGlzLmhpc3RvcnkucHVzaChbdGhpcy54LCB0aGlzLnldKVxuICAgIHRoaXMueCA9IG1vdXNlWFxuICAgIHRoaXMueSA9IG1vdXNlWVxuICAgIHdoaWxlICh0aGlzLmhpc3RvcnkubGVuZ3RoID4gSElTVE9SWV9MRU5HVEgpIHRoaXMuaGlzdG9yeS5zaGlmdCgpXG4gIH1cblxuICBvbkRyYXcoKSB7XG4gICAgbGV0IGxhc3QgPSB0aGlzLmhpc3RvcnlbMF1cbiAgICBmb3IgKGNvbnN0IHBvcyBvZiB0aGlzLmhpc3RvcnkpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5oaXN0b3J5LmluZGV4T2YocG9zKVxuICAgICAgc3Ryb2tlKGZsb29yKG1hcChpbmRleCwgdGhpcy5oaXN0b3J5Lmxlbmd0aCwgMCwgMjU1LCAwKSkpXG4gICAgICBzdHJva2VXZWlnaHQoZmxvb3IobWFwKGluZGV4LCB0aGlzLmhpc3RvcnkubGVuZ3RoLCAwLCB0aGlzLmRpYW1ldGVyLCAwKSkpXG4gICAgICBsaW5lKC4uLmxhc3QsIC4uLnBvcylcbiAgICAgIGxhc3QgPSBwb3NcbiAgICB9XG4gIH1cblxuICBvbk1vdXNlUmVsZWFzZWQoKSB7XG4gICAgY29uc3Qgc3Ryb2tlID0ge1xuICAgICAgY29sb3I6IGNvbG9yKDI1NSksXG4gICAgICB3ZWlnaHQ6IHRoaXMuZGlhbWV0ZXIgLyA0LFxuICAgIH1cbiAgICBjb25zdCBoYWxvID0gbmV3IENpcmNsZShtb3VzZVgsIG1vdXNlWSwgMCwge1xuICAgICAgZmlsbDogZmFsc2UsXG4gICAgICBzdHJva2UsXG4gICAgfSlcblxuICAgIHRoaXMuYWRkQ2hpbGQoXG4gICAgICBuZXcgQW5pbWF0aW9uKHtcbiAgICAgICAgZnJvbTogMCxcbiAgICAgICAgdG86IHRoaXMuZGlhbWV0ZXIgKiA1LFxuICAgICAgICBkdXJhdGlvbjogMTAwLFxuICAgICAgICBlYXNpbmc6IGVhc2luZ1NldC5lYXNlT3V0UXVhcnQsXG4gICAgICAgIG9uU2V0dXA6ICgpID0+IHRoaXMuYWRkQ2hpbGQoaGFsbyksXG4gICAgICAgIG9uRHJhdzogKHZhbHVlKSA9PiB7XG4gICAgICAgICAgaGFsby5kaWFtZXRlciA9IHZhbHVlXG4gICAgICAgICAgc3Ryb2tlLmNvbG9yID0gY29sb3IoXG4gICAgICAgICAgICAyNTUsXG4gICAgICAgICAgICAoKHRoaXMuZGlhbWV0ZXIgKiA1IC0gdmFsdWUpIC8gKHRoaXMuZGlhbWV0ZXIgKiA1KSkgKiAyNTVcbiAgICAgICAgICApXG4gICAgICAgIH0sXG4gICAgICAgIG9uVGVhcmRvd246ICgpID0+IHRoaXMucmVtb3ZlQ2hpbGQoaGFsbyksXG4gICAgICB9KVxuICAgIClcbiAgfVxufVxuIiwgImltcG9ydCB7IENpcmNsZSB9IGZyb20gXCJAZ2hvbS9lbnRpdHktcDVcIlxuaW1wb3J0IHsgZ2FtZSB9IGZyb20gXCIuL2dhbWVcIlxuXG5leHBvcnQgY2xhc3MgQmFsbG9vbiBleHRlbmRzIENpcmNsZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHJhbmRvbSgwLCB3aWR0aCksIHJhbmRvbSgwLCBoZWlnaHQpLCByYW5kb20oNDAsIDYwKSwge1xuICAgICAgZmlsbDogY29sb3IocmFuZG9tKDEwMCwgMjAwKSwgcmFuZG9tKDEwMCwgMjAwKSwgcmFuZG9tKDEwMCwgMjAwKSksXG4gICAgICBzdHJva2U6IGZhbHNlLFxuICAgIH0pXG4gIH1cblxuICBvblVwZGF0ZSgpIHtcbiAgICBpZiAodGhpcy5pc0hvdmVyZWQpIHtcbiAgICAgIHRoaXMuc2V0dGluZ3Muc3Ryb2tlID0ge1xuICAgICAgICBjb2xvcjogY29sb3IoMjU1KSxcbiAgICAgICAgd2VpZ2h0OiA1LFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldHRpbmdzLnN0cm9rZSA9IGZhbHNlXG4gICAgfVxuICB9XG5cbiAgb25UZWFyZG93bigpIHtcbiAgICBnYW1lLnNjb3JlKytcbiAgfVxuXG4gIG9uTW91c2VSZWxlYXNlZCgpIHtcbiAgICBpZiAodGhpcy5pc0hvdmVyZWQpIHtcbiAgICAgIGlmICh0aGlzLnBhcmVudC5jaGlsZHJlbi5sZW5ndGggPiAxKVxuICAgICAgICB0aGlzLnBhcmVudC5zdG9wVHJhbnNtaXNzaW9uKFwibW91c2VSZWxlYXNlZFwiKVxuXG4gICAgICB0aGlzLnBhcmVudC5hZGRDaGlsZChuZXcgQmFsbG9vbigpKVxuICAgICAgdGhpcy50ZWFyZG93bigpXG4gICAgfVxuICB9XG59XG4iLCAiaW1wb3J0IHsgQmFsbG9vbiB9IGZyb20gXCIuL2JhbGxvb25cIlxuaW1wb3J0IHsgRW50aXR5IH0gZnJvbSBcIkBnaG9tL2VudGl0eS1wNVwiXG5cbmV4cG9ydCBjbGFzcyBCYWxsb29ucyBleHRlbmRzIEVudGl0eSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY291bnQ6IG51bWJlcikge1xuICAgIHN1cGVyKClcbiAgfVxuXG4gIG9uU2V0dXAoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNvdW50OyBpKyspIHtcbiAgICAgIHRoaXMuYWRkQ2hpbGQobmV3IEJhbGxvb24oKSlcbiAgICB9XG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7QUNPTyxtQkFBOEM7QUFBQSxJQXVCekMsY0FBYztBQXRCZCxzQkFBVztBQUNYLHVCQUFZLG9CQUFJO0FBRWhCLHdCQUFrRTtBQUNsRSx5QkFDUjtBQUFBO0FBQUEsUUFFRSxVQUFVO0FBQ1osYUFBTyxLQUFLO0FBQUE7QUFBQSxRQUdWLFdBQXFEO0FBQ3ZELGFBQU8sQ0FBQyxHQUFHLEtBQUs7QUFBQTtBQUFBLFFBR2QsU0FBd0Q7QUFDMUQsYUFBTyxLQUFLO0FBQUE7QUFBQSxJQVdkLFVBQVU7QUFBQTtBQUFBLElB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
