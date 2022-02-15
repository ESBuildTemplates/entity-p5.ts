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
      text(this.schema(3), 20, 20);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2luZGV4LnRzIiwgIm5vZGVfbW9kdWxlcy9AZ2hvbS9lbnRpdHktYmFzZS9zcmMvYXBwL2Jhc2UudHMiLCAibm9kZV9tb2R1bGVzL0BnaG9tL2VudGl0eS1wNS9zcmMvYXBwL2VudGl0eS50cyIsICJub2RlX21vZHVsZXMvQGdob20vZW50aXR5LXA1L3NyYy9hcHAvZHJhd2FibGUudHMiLCAibm9kZV9tb2R1bGVzL0BnaG9tL2VudGl0eS1wNS9zcmMvYXBwL2Vhc2luZy50cyIsICJub2RlX21vZHVsZXMvQGdob20vZW50aXR5LXA1L3NyYy9hcHAvdGltZS50cyIsICJub2RlX21vZHVsZXMvQGdob20vZW50aXR5LXA1L3NyYy9hcHAvYW5pbWF0aW9uLnRzIiwgIm5vZGVfbW9kdWxlcy9AZ2hvbS9lbnRpdHktcDUvc3JjL2FwcC9zaGFwZS50cyIsICJzcmMvYXBwL2dhbWUudHMiLCAic3JjL2FwcC9jdXJzb3IudHMiLCAic3JjL2FwcC9iYWxsb29uLnRzIiwgInNyYy9hcHAvYmFsbG9vbnMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vLyBAdHMtY2hlY2tcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvQHR5cGVzL3A1L2dsb2JhbC5kLnRzXCIgLz5cblxuaW1wb3J0IHsgZ2FtZSB9IGZyb20gXCIuL2FwcC9nYW1lXCJcbmltcG9ydCB7IEN1cnNvciB9IGZyb20gXCIuL2FwcC9jdXJzb3JcIlxuaW1wb3J0IHsgQmFsbG9vbnMgfSBmcm9tIFwiLi9hcHAvYmFsbG9vbnNcIlxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgKGV2ZW50KSA9PiBldmVudC5wcmV2ZW50RGVmYXVsdCgpKVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0dXAoKSB7XG4gIGNyZWF0ZUNhbnZhcyhcbiAgICBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsIHdpbmRvdy5pbm5lcldpZHRoIHx8IDApLFxuICAgIE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKVxuICApXG5cbiAgZ2FtZS5hZGRDaGlsZChuZXcgQmFsbG9vbnMoMSkpXG4gIGdhbWUuYWRkQ2hpbGQobmV3IEN1cnNvcigpKVxuXG4gIGdhbWUuc2V0dXAoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZHJhdygpIHtcbiAgYmFja2dyb3VuZCgyMClcblxuICBnYW1lLmRyYXcoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlKHRpbWVzdGFtcDogbnVtYmVyKSB7XG4gIGdhbWUudXBkYXRlKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGtleVByZXNzZWQoKSB7fVxuZXhwb3J0IGZ1bmN0aW9uIGtleVJlbGVhc2VkKCkge31cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZVByZXNzZWQoKSB7XG4gIGdhbWUubW91c2VQcmVzc2VkKClcbn1cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZVJlbGVhc2VkKCkge1xuICBnYW1lLm1vdXNlUmVsZWFzZWQoKVxufVxuXG4vKipcbiAqIGRlYnVnIGltcG9ydHMgKGFjY2Vzc2libGUgZnJvbSBmcm9udGVuZCBjb25zb2xlIHdpdGggYGFwcC5yb290YClcbiAqL1xuZXhwb3J0IGNvbnN0IHJvb3QgPSBnYW1lXG4iLCAiZXhwb3J0IHR5cGUgRW50aXR5RXZlbnROYW1lID0gXCJzZXR1cFwiIHwgXCJ1cGRhdGVcIiB8IFwidGVhcmRvd25cIlxuXG5leHBvcnQgdHlwZSBFbnRpdHlMaXN0ZW5lcjxcbiAgRXZlbnROYW1lIGV4dGVuZHMgc3RyaW5nLFxuICBUaGlzIGV4dGVuZHMgQmFzZTxFdmVudE5hbWU+XG4+ID0gKHRoaXM6IFRoaXMsIGl0OiBUaGlzKSA9PiB1bmtub3duXG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCYXNlPEV2ZW50TmFtZSBleHRlbmRzIHN0cmluZz4ge1xuICBwcm90ZWN0ZWQgX2lzU2V0dXAgPSBmYWxzZVxuICBwcm90ZWN0ZWQgX2NoaWxkcmVuID0gbmV3IFNldDxCYXNlPEV2ZW50TmFtZSB8IEVudGl0eUV2ZW50TmFtZT4+KClcbiAgcHJvdGVjdGVkIF9wYXJlbnQ/OiBCYXNlPEV2ZW50TmFtZSB8IEVudGl0eUV2ZW50TmFtZT5cbiAgcHJvdGVjdGVkIF9saXN0ZW5lcnM6IEVudGl0eUxpc3RlbmVyPEV2ZW50TmFtZSB8IEVudGl0eUV2ZW50TmFtZSwgdGhpcz5bXSA9IFtdXG4gIHByb3RlY3RlZCBfc3RvcFBvaW50czogUGFydGlhbDxSZWNvcmQ8RXZlbnROYW1lIHwgRW50aXR5RXZlbnROYW1lLCBib29sZWFuPj4gPVxuICAgIHt9XG5cbiAgZ2V0IGlzU2V0dXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lzU2V0dXBcbiAgfVxuXG4gIGdldCBjaGlsZHJlbigpOiBBcnJheTxCYXNlPEV2ZW50TmFtZSB8IEVudGl0eUV2ZW50TmFtZT4+IHtcbiAgICByZXR1cm4gWy4uLnRoaXMuX2NoaWxkcmVuXVxuICB9XG5cbiAgZ2V0IHBhcmVudCgpOiBCYXNlPEV2ZW50TmFtZSB8IEVudGl0eUV2ZW50TmFtZT4gfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnRcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXByZXNlbnQgYW55IHN0YXRlLWJhc2VkIGVudGl0eVxuICAgKi9cbiAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25TZXR1cCgpIHt9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcbiAgICovXG4gIG9uVXBkYXRlKCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25UZWFyZG93bigpIHt9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxuICAgKi9cbiAgcHVibGljIHNldHVwKCkge1xuICAgIGlmICghdGhpcy5pc1NldHVwKSB7XG4gICAgICB0aGlzLm9uU2V0dXAoKVxuICAgICAgdGhpcy50cmFuc21pdChcInNldHVwXCIpXG4gICAgICB0aGlzLl9pc1NldHVwID0gdHJ1ZVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbnRpdHkgaXMgYWxyZWFkeSBzZXR1cFwiKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cbiAgICogU2hvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiFcbiAgICovXG4gIHB1YmxpYyB1cGRhdGUoKSB7XG4gICAgaWYgKHRoaXMuaXNTZXR1cCkge1xuICAgICAgdGhpcy5vblVwZGF0ZSgpXG4gICAgICB0aGlzLnRyYW5zbWl0KFwidXBkYXRlXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybihcInVwZGF0ZSBpcyBjYWxsZWQgYmVmb3JlIHNldHVwXCIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxuICAgKi9cbiAgcHVibGljIHRlYXJkb3duKCkge1xuICAgIGlmICh0aGlzLmlzU2V0dXApIHtcbiAgICAgIHRoaXMuX2lzU2V0dXAgPSBmYWxzZVxuICAgICAgdGhpcy5vblRlYXJkb3duKClcbiAgICAgIHRoaXMuX3BhcmVudD8ucmVtb3ZlQ2hpbGQodGhpcylcbiAgICAgIHRoaXMudHJhbnNtaXQoXCJ0ZWFyZG93blwiKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbnRpdHkgbXVzdCBiZSBzZXR1cCBiZWZvcmVcIilcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb24obmFtZTogRXZlbnROYW1lLCBsaXN0ZW5lcjogRW50aXR5TGlzdGVuZXI8RXZlbnROYW1lLCB0aGlzPikge1xuICAgIHRoaXMuX2xpc3RlbmVycy5wdXNoKFxuICAgICAge1xuICAgICAgICBbbmFtZV0oKSB7XG4gICAgICAgICAgbGlzdGVuZXIuYmluZCh0aGlzKSh0aGlzKVxuICAgICAgICB9LFxuICAgICAgfVtuYW1lXS5iaW5kKHRoaXMpXG4gICAgKVxuICB9XG5cbiAgcHVibGljIGFkZENoaWxkKC4uLmNoaWxkcmVuOiBCYXNlPEV2ZW50TmFtZT5bXSkge1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgIGNoaWxkLl9wYXJlbnQgPSB0aGlzXG4gICAgICB0aGlzLl9jaGlsZHJlbi5hZGQoY2hpbGQpXG4gICAgICBpZiAodGhpcy5pc1NldHVwKSBjaGlsZC5zZXR1cCgpXG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlbW92ZUNoaWxkKC4uLmNoaWxkcmVuOiBCYXNlPEV2ZW50TmFtZT5bXSkge1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgIGlmIChjaGlsZC5pc1NldHVwKSBjaGlsZC50ZWFyZG93bigpXG4gICAgICBlbHNlIHRoaXMuX2NoaWxkcmVuLmRlbGV0ZShjaGlsZClcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc3RvcFRyYW5zbWlzc2lvbihuYW1lOiBFdmVudE5hbWUgfCBFbnRpdHlFdmVudE5hbWUpIHtcbiAgICB0aGlzLl9zdG9wUG9pbnRzW25hbWVdID0gdHJ1ZVxuICB9XG5cbiAgcHVibGljIHRyYW5zbWl0KG5hbWU6IEV2ZW50TmFtZSB8IEVudGl0eUV2ZW50TmFtZSkge1xuICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgdGhpcy5nZXRMaXN0ZW5lcnNCeU5hbWUobmFtZSkpXG4gICAgICBsaXN0ZW5lci5iaW5kKHRoaXMpKHRoaXMpXG5cbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pIHtcbiAgICAgIGlmICh0aGlzLl9zdG9wUG9pbnRzW25hbWVdKSB7XG4gICAgICAgIHRoaXMuX3N0b3BQb2ludHNbbmFtZV0gPSBmYWxzZVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgY2hpbGRbbmFtZV0oKVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRMaXN0ZW5lcnNCeU5hbWUobmFtZTogRXZlbnROYW1lIHwgRW50aXR5RXZlbnROYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xpc3RlbmVycy5maWx0ZXIoKGxpc3RlbmVyKSA9PiB7XG4gICAgICByZXR1cm4gbGlzdGVuZXIubmFtZSA9PT0gbmFtZVxuICAgIH0pXG4gIH1cblxuICBwdWJsaWMgc2NoZW1hKFxuICAgIGluZGVudGF0aW9uID0gMixcbiAgICBkZXB0aCA9IDAsXG4gICAgaW5kZXg6IG51bWJlciB8IG51bGwgPSBudWxsXG4gICk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAke1wiIFwiLnJlcGVhdChpbmRlbnRhdGlvbikucmVwZWF0KGRlcHRoKX0ke1xuICAgICAgaW5kZXggPT09IG51bGwgPyBcIlwiIDogYCR7aW5kZXh9IC0gYFxuICAgIH0ke3RoaXMuY29uc3RydWN0b3IubmFtZX0gWyR7dGhpcy5pc1NldHVwID8gXCJvblwiIDogXCJvZmZcIn1dJHtcbiAgICAgIHRoaXMuX2NoaWxkcmVuLnNpemUgPiAwXG4gICAgICAgID8gYDpcXG4ke3RoaXMuY2hpbGRyZW5cbiAgICAgICAgICAgIC5tYXAoXG4gICAgICAgICAgICAgIChjaGlsZCwgaW5kZXgpID0+IGAke2NoaWxkLnNjaGVtYShpbmRlbnRhdGlvbiwgZGVwdGggKyAxLCBpbmRleCl9YFxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmpvaW4oXCJcXG5cIil9YFxuICAgICAgICA6IFwiXCJcbiAgICB9YFxuICB9XG59XG4iLCAiaW1wb3J0IHsgQmFzZSB9IGZyb20gXCJAZ2hvbS9lbnRpdHktYmFzZVwiXG5cbmV4cG9ydCB0eXBlIEVudGl0eUV2ZW50TmFtZSA9XG4gIHwgXCJzZXR1cFwiXG4gIHwgXCJ1cGRhdGVcIlxuICB8IFwidGVhcmRvd25cIlxuICB8IFwiZHJhd1wiXG4gIHwgXCJtb3VzZVByZXNzZWRcIlxuICB8IFwibW91c2VSZWxlYXNlZFwiXG4gIHwgXCJrZXlQcmVzc2VkXCJcbiAgfCBcImtleVJlbGVhc2VkXCJcblxuZXhwb3J0IGNsYXNzIEVudGl0eSBleHRlbmRzIEJhc2U8RW50aXR5RXZlbnROYW1lPiB7XG4gIHByb3RlY3RlZCBfY2hpbGRyZW4gPSBuZXcgU2V0PEVudGl0eT4oKVxuICBwcm90ZWN0ZWQgX3pJbmRleD86IG51bWJlclxuXG4gIGdldCB6SW5kZXgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fekluZGV4ID8/IHRoaXMucGFyZW50Py5jaGlsZHJlbi5pbmRleE9mKHRoaXMpID8/IDBcbiAgfVxuXG4gIGdldCBjaGlsZHJlbigpOiBBcnJheTxFbnRpdHk+IHtcbiAgICByZXR1cm4gWy4uLnRoaXMuX2NoaWxkcmVuXVxuICB9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcbiAgICovXG4gIG9uRHJhdygpIHt9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcbiAgICovXG4gIG9uTW91c2VSZWxlYXNlZCgpIHt9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcbiAgICovXG4gIG9uTW91c2VQcmVzc2VkKCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25LZXlSZWxlYXNlZCgpIHt9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcbiAgICovXG4gIG9uS2V5UHJlc3NlZCgpIHt9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxuICAgKi9cbiAgcHVibGljIGRyYXcoKSB7XG4gICAgaWYgKHRoaXMuaXNTZXR1cCkge1xuICAgICAgdGhpcy5vbkRyYXcoKVxuICAgICAgdGhpcy50cmFuc21pdChcImRyYXdcIilcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKFwiRHJhdyBpcyBjYWxsZWQgYmVmb3JlIHNldHVwXCIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxuICAgKi9cbiAgcHVibGljIG1vdXNlUHJlc3NlZCgpIHtcbiAgICBpZiAodGhpcy5pc1NldHVwKSB7XG4gICAgICB0aGlzLm9uTW91c2VQcmVzc2VkKClcbiAgICAgIHRoaXMudHJhbnNtaXQoXCJtb3VzZVByZXNzZWRcIilcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKFwibW91c2VQcmVzc2VkIGlzIGNhbGxlZCBiZWZvcmUgc2V0dXBcIilcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjdXJyZW50IGVudGl0eSBpcyBhIHJvb3QuXG4gICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXG4gICAqL1xuICBwdWJsaWMgbW91c2VSZWxlYXNlZCgpIHtcbiAgICBpZiAodGhpcy5pc1NldHVwKSB7XG4gICAgICB0aGlzLm9uTW91c2VSZWxlYXNlZCgpXG4gICAgICB0aGlzLnRyYW5zbWl0KFwibW91c2VSZWxlYXNlZFwiKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJtb3VzZVByZXNzZWQgaXMgY2FsbGVkIGJlZm9yZSBzZXR1cFwiKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cbiAgICogU2hvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiFcbiAgICovXG4gIHB1YmxpYyBrZXlQcmVzc2VkKCkge1xuICAgIGlmICh0aGlzLmlzU2V0dXApIHtcbiAgICAgIHRoaXMub25LZXlQcmVzc2VkKClcbiAgICAgIHRoaXMudHJhbnNtaXQoXCJrZXlQcmVzc2VkXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybihcImtleVByZXNzZWQgaXMgY2FsbGVkIGJlZm9yZSBzZXR1cFwiKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cbiAgICogU2hvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiFcbiAgICovXG4gIHB1YmxpYyBrZXlSZWxlYXNlZCgpIHtcbiAgICBpZiAodGhpcy5pc1NldHVwKSB7XG4gICAgICB0aGlzLm9uS2V5UmVsZWFzZWQoKVxuICAgICAgdGhpcy50cmFuc21pdChcImtleVJlbGVhc2VkXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybihcImtleVJlbGVhc2VkIGlzIGNhbGxlZCBiZWZvcmUgc2V0dXBcIilcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdHJhbnNtaXQobmFtZTogRW50aXR5RXZlbnROYW1lKSB7XG4gICAgZm9yIChjb25zdCBsaXN0ZW5lciBvZiB0aGlzLmdldExpc3RlbmVyc0J5TmFtZShuYW1lKSlcbiAgICAgIGxpc3RlbmVyLmJpbmQodGhpcykodGhpcylcblxuICAgIGxldCBjaGlsZHJlbiA9XG4gICAgICBuYW1lID09PSBcIm1vdXNlUmVsZWFzZWRcIiB8fFxuICAgICAgbmFtZSA9PT0gXCJtb3VzZVByZXNzZWRcIiB8fFxuICAgICAgbmFtZSA9PT0gXCJrZXlQcmVzc2VkXCIgfHxcbiAgICAgIG5hbWUgPT09IFwia2V5UmVsZWFzZWRcIlxuICAgICAgICA/IHRoaXMuY2hpbGRyZW4uc29ydCgoYSwgYikgPT4gYS56SW5kZXggLSBiLnpJbmRleClcbiAgICAgICAgOiB0aGlzLmNoaWxkcmVuLnNvcnQoKGEsIGIpID0+IGIuekluZGV4IC0gYS56SW5kZXgpXG5cbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgICBpZiAodGhpcy5fc3RvcFBvaW50c1tuYW1lXSkge1xuICAgICAgICB0aGlzLl9zdG9wUG9pbnRzW25hbWVdID0gZmFsc2VcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNoaWxkW25hbWVdKClcbiAgICB9XG4gIH1cbn1cbiIsICJpbXBvcnQgKiBhcyBwNSBmcm9tIFwicDVcIlxuaW1wb3J0IHsgRW50aXR5IH0gZnJvbSBcIi4vZW50aXR5XCJcblxuZXhwb3J0IGludGVyZmFjZSBEcmF3YWJsZVNldHRpbmdzIHtcbiAgZmlsbDogZmFsc2UgfCBGaWxsT3B0aW9uc1xuICBzdHJva2U6IGZhbHNlIHwgU3Ryb2tlT3B0aW9uc1xuICB0ZXh0U2l6ZT86IG51bWJlclxuICB0ZXh0QWxpZ24/OiB7XG4gICAgeD86IHA1LkhPUklaX0FMSUdOXG4gICAgeT86IHA1LlZFUlRfQUxJR05cbiAgfVxufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRHJhd2FibGUgZXh0ZW5kcyBFbnRpdHkge1xuICBwcm90ZWN0ZWQgY29uc3RydWN0b3IocHJvdGVjdGVkIHNldHRpbmdzPzogRHJhd2FibGVTZXR0aW5ncykge1xuICAgIHN1cGVyKClcbiAgfVxuXG4gIG9uRHJhdygpIHtcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MpIHJldHVyblxuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuZmlsbCkge1xuICAgICAgaWYgKFwiY29sb3JcIiBpbiB0aGlzLnNldHRpbmdzLmZpbGwpIHtcbiAgICAgICAgZmlsbCh0aGlzLnNldHRpbmdzLmZpbGwuY29sb3IpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaWxsKHRoaXMuc2V0dGluZ3MuZmlsbClcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbm9GaWxsKClcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5zdHJva2UpIHtcbiAgICAgIHN0cm9rZVdlaWdodCh0aGlzLnNldHRpbmdzLnN0cm9rZS53ZWlnaHQpXG4gICAgICBzdHJva2UodGhpcy5zZXR0aW5ncy5zdHJva2UuY29sb3IpXG4gICAgfSBlbHNlIHtcbiAgICAgIG5vU3Ryb2tlKClcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zZXR0aW5ncy50ZXh0QWxpZ24pIHtcbiAgICAgIHRleHRBbGlnbih0aGlzLnNldHRpbmdzLnRleHRBbGlnbi54LCB0aGlzLnNldHRpbmdzLnRleHRBbGlnbi55KVxuICAgIH0gZWxzZSB7XG4gICAgICB0ZXh0QWxpZ24oQ0VOVEVSLCBDRU5URVIpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MudGV4dFNpemUpIHtcbiAgICAgIHRleHRTaXplKHRoaXMuc2V0dGluZ3MudGV4dFNpemUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRleHRTaXplKGhlaWdodCAqIDAuMSlcbiAgICB9XG4gIH1cbn1cbiIsICIvLyBzb3VyY2U6IGh0dHBzOi8vZ2l0aHViLmNvbS9haS9lYXNpbmdzLm5ldC9ibG9iL21hc3Rlci9zcmMvZWFzaW5ncy9lYXNpbmdzRnVuY3Rpb25zLnRzXG5cbmV4cG9ydCB0eXBlIEVhc2luZ0Z1bmN0aW9uID0gKHByb2dyZXNzOiBudW1iZXIpID0+IG51bWJlclxuXG5leHBvcnQgdHlwZSBFYXNpbmdOYW1lID1cbiAgfCBcImxpbmVhclwiXG4gIHwgXCJlYXNlSW5RdWFkXCJcbiAgfCBcImVhc2VPdXRRdWFkXCJcbiAgfCBcImVhc2VJbk91dFF1YWRcIlxuICB8IFwiZWFzZUluQ3ViaWNcIlxuICB8IFwiZWFzZU91dEN1YmljXCJcbiAgfCBcImVhc2VJbk91dEN1YmljXCJcbiAgfCBcImVhc2VJblF1YXJ0XCJcbiAgfCBcImVhc2VPdXRRdWFydFwiXG4gIHwgXCJlYXNlSW5PdXRRdWFydFwiXG4gIHwgXCJlYXNlSW5RdWludFwiXG4gIHwgXCJlYXNlT3V0UXVpbnRcIlxuICB8IFwiZWFzZUluT3V0UXVpbnRcIlxuICB8IFwiZWFzZUluU2luZVwiXG4gIHwgXCJlYXNlT3V0U2luZVwiXG4gIHwgXCJlYXNlSW5PdXRTaW5lXCJcbiAgfCBcImVhc2VJbkV4cG9cIlxuICB8IFwiZWFzZU91dEV4cG9cIlxuICB8IFwiZWFzZUluT3V0RXhwb1wiXG4gIHwgXCJlYXNlSW5DaXJjXCJcbiAgfCBcImVhc2VPdXRDaXJjXCJcbiAgfCBcImVhc2VJbk91dENpcmNcIlxuICB8IFwiZWFzZUluQmFja1wiXG4gIHwgXCJlYXNlT3V0QmFja1wiXG4gIHwgXCJlYXNlSW5PdXRCYWNrXCJcbiAgfCBcImVhc2VJbkVsYXN0aWNcIlxuICB8IFwiZWFzZU91dEVsYXN0aWNcIlxuICB8IFwiZWFzZUluT3V0RWxhc3RpY1wiXG4gIHwgXCJlYXNlSW5Cb3VuY2VcIlxuICB8IFwiZWFzZU91dEJvdW5jZVwiXG4gIHwgXCJlYXNlSW5PdXRCb3VuY2VcIlxuXG5jb25zdCBQSSA9IE1hdGguUElcbmNvbnN0IGMxID0gMS43MDE1OFxuY29uc3QgYzIgPSBjMSAqIDEuNTI1XG5jb25zdCBjMyA9IGMxICsgMVxuY29uc3QgYzQgPSAoMiAqIFBJKSAvIDNcbmNvbnN0IGM1ID0gKDIgKiBQSSkgLyA0LjVcblxuY29uc3QgYm91bmNlT3V0OiBFYXNpbmdGdW5jdGlvbiA9IGZ1bmN0aW9uICh4KSB7XG4gIGNvbnN0IG4xID0gNy41NjI1XG4gIGNvbnN0IGQxID0gMi43NVxuXG4gIGlmICh4IDwgMSAvIGQxKSB7XG4gICAgcmV0dXJuIG4xICogeCAqIHhcbiAgfSBlbHNlIGlmICh4IDwgMiAvIGQxKSB7XG4gICAgcmV0dXJuIG4xICogKHggLT0gMS41IC8gZDEpICogeCArIDAuNzVcbiAgfSBlbHNlIGlmICh4IDwgMi41IC8gZDEpIHtcbiAgICByZXR1cm4gbjEgKiAoeCAtPSAyLjI1IC8gZDEpICogeCArIDAuOTM3NVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBuMSAqICh4IC09IDIuNjI1IC8gZDEpICogeCArIDAuOTg0Mzc1XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGVhc2luZ1NldDogUmVjb3JkPEVhc2luZ05hbWUsIEVhc2luZ0Z1bmN0aW9uPiA9IHtcbiAgbGluZWFyOiAoeCkgPT4geCxcbiAgZWFzZUluUXVhZDogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4geCAqIHhcbiAgfSxcbiAgZWFzZU91dFF1YWQ6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIDEgLSAoMSAtIHgpICogKDEgLSB4KVxuICB9LFxuICBlYXNlSW5PdXRRdWFkOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4IDwgMC41ID8gMiAqIHggKiB4IDogMSAtIHBvdygtMiAqIHggKyAyLCAyKSAvIDJcbiAgfSxcbiAgZWFzZUluQ3ViaWM6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggKiB4ICogeFxuICB9LFxuICBlYXNlT3V0Q3ViaWM6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIDEgLSBwb3coMSAtIHgsIDMpXG4gIH0sXG4gIGVhc2VJbk91dEN1YmljOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4IDwgMC41ID8gNCAqIHggKiB4ICogeCA6IDEgLSBwb3coLTIgKiB4ICsgMiwgMykgLyAyXG4gIH0sXG4gIGVhc2VJblF1YXJ0OiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4ICogeCAqIHggKiB4XG4gIH0sXG4gIGVhc2VPdXRRdWFydDogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gMSAtIHBvdygxIC0geCwgNClcbiAgfSxcbiAgZWFzZUluT3V0UXVhcnQ6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggPCAwLjUgPyA4ICogeCAqIHggKiB4ICogeCA6IDEgLSBwb3coLTIgKiB4ICsgMiwgNCkgLyAyXG4gIH0sXG4gIGVhc2VJblF1aW50OiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4ICogeCAqIHggKiB4ICogeFxuICB9LFxuICBlYXNlT3V0UXVpbnQ6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIDEgLSBwb3coMSAtIHgsIDUpXG4gIH0sXG4gIGVhc2VJbk91dFF1aW50OiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4IDwgMC41ID8gMTYgKiB4ICogeCAqIHggKiB4ICogeCA6IDEgLSBwb3coLTIgKiB4ICsgMiwgNSkgLyAyXG4gIH0sXG4gIGVhc2VJblNpbmU6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIDEgLSBjb3MoKHggKiBQSSkgLyAyKVxuICB9LFxuICBlYXNlT3V0U2luZTogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gc2luKCh4ICogUEkpIC8gMilcbiAgfSxcbiAgZWFzZUluT3V0U2luZTogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gLShjb3MoUEkgKiB4KSAtIDEpIC8gMlxuICB9LFxuICBlYXNlSW5FeHBvOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4ID09PSAwID8gMCA6IHBvdygyLCAxMCAqIHggLSAxMClcbiAgfSxcbiAgZWFzZU91dEV4cG86IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggPT09IDEgPyAxIDogMSAtIHBvdygyLCAtMTAgKiB4KVxuICB9LFxuICBlYXNlSW5PdXRFeHBvOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4ID09PSAwXG4gICAgICA/IDBcbiAgICAgIDogeCA9PT0gMVxuICAgICAgPyAxXG4gICAgICA6IHggPCAwLjVcbiAgICAgID8gcG93KDIsIDIwICogeCAtIDEwKSAvIDJcbiAgICAgIDogKDIgLSBwb3coMiwgLTIwICogeCArIDEwKSkgLyAyXG4gIH0sXG4gIGVhc2VJbkNpcmM6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIDEgLSBzcXJ0KDEgLSBwb3coeCwgMikpXG4gIH0sXG4gIGVhc2VPdXRDaXJjOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiBzcXJ0KDEgLSBwb3coeCAtIDEsIDIpKVxuICB9LFxuICBlYXNlSW5PdXRDaXJjOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4IDwgMC41XG4gICAgICA/ICgxIC0gc3FydCgxIC0gcG93KDIgKiB4LCAyKSkpIC8gMlxuICAgICAgOiAoc3FydCgxIC0gcG93KC0yICogeCArIDIsIDIpKSArIDEpIC8gMlxuICB9LFxuICBlYXNlSW5CYWNrOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiBjMyAqIHggKiB4ICogeCAtIGMxICogeCAqIHhcbiAgfSxcbiAgZWFzZU91dEJhY2s6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIDEgKyBjMyAqIHBvdyh4IC0gMSwgMykgKyBjMSAqIHBvdyh4IC0gMSwgMilcbiAgfSxcbiAgZWFzZUluT3V0QmFjazogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4geCA8IDAuNVxuICAgICAgPyAocG93KDIgKiB4LCAyKSAqICgoYzIgKyAxKSAqIDIgKiB4IC0gYzIpKSAvIDJcbiAgICAgIDogKHBvdygyICogeCAtIDIsIDIpICogKChjMiArIDEpICogKHggKiAyIC0gMikgKyBjMikgKyAyKSAvIDJcbiAgfSxcbiAgZWFzZUluRWxhc3RpYzogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4geCA9PT0gMFxuICAgICAgPyAwXG4gICAgICA6IHggPT09IDFcbiAgICAgID8gMVxuICAgICAgOiAtcG93KDIsIDEwICogeCAtIDEwKSAqIHNpbigoeCAqIDEwIC0gMTAuNzUpICogYzQpXG4gIH0sXG4gIGVhc2VPdXRFbGFzdGljOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4ID09PSAwXG4gICAgICA/IDBcbiAgICAgIDogeCA9PT0gMVxuICAgICAgPyAxXG4gICAgICA6IHBvdygyLCAtMTAgKiB4KSAqIHNpbigoeCAqIDEwIC0gMC43NSkgKiBjNCkgKyAxXG4gIH0sXG4gIGVhc2VJbk91dEVsYXN0aWM6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggPT09IDBcbiAgICAgID8gMFxuICAgICAgOiB4ID09PSAxXG4gICAgICA/IDFcbiAgICAgIDogeCA8IDAuNVxuICAgICAgPyAtKHBvdygyLCAyMCAqIHggLSAxMCkgKiBzaW4oKDIwICogeCAtIDExLjEyNSkgKiBjNSkpIC8gMlxuICAgICAgOiAocG93KDIsIC0yMCAqIHggKyAxMCkgKiBzaW4oKDIwICogeCAtIDExLjEyNSkgKiBjNSkpIC8gMiArIDFcbiAgfSxcbiAgZWFzZUluQm91bmNlOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiAxIC0gYm91bmNlT3V0KDEgLSB4KVxuICB9LFxuICBlYXNlT3V0Qm91bmNlOiBib3VuY2VPdXQsXG4gIGVhc2VJbk91dEJvdW5jZTogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4geCA8IDAuNVxuICAgICAgPyAoMSAtIGJvdW5jZU91dCgxIC0gMiAqIHgpKSAvIDJcbiAgICAgIDogKDEgKyBib3VuY2VPdXQoMiAqIHggLSAxKSkgLyAyXG4gIH0sXG59XG4iLCAiaW1wb3J0IHsgRW50aXR5IH0gZnJvbSBcIi4vZW50aXR5XCJcblxuZXhwb3J0IGNsYXNzIFRpbWUgZXh0ZW5kcyBFbnRpdHkge1xuICBwcm90ZWN0ZWQgc3RhcnRlZEF0ID0gMFxuXG4gIG9uU2V0dXAoKSB7XG4gICAgdGhpcy5zdGFydGVkQXQgPSBmcmFtZUNvdW50XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBFYXNpbmdGdW5jdGlvbiwgZWFzaW5nU2V0IH0gZnJvbSBcIi4vZWFzaW5nXCJcbmltcG9ydCB7IFRpbWUgfSBmcm9tIFwiLi90aW1lXCJcblxuZXhwb3J0IGludGVyZmFjZSBBbmltYXRpb25TZXR0aW5ncyB7XG4gIGZyb206IG51bWJlclxuICB0bzogbnVtYmVyXG4gIC8qKlxuICAgKiBBbmltYXRpb24gZHVyYXRpb24gaW4gKipmcmFtZSBjb3VudCoqIVxuICAgKi9cbiAgZHVyYXRpb246IG51bWJlclxuICBlYXNpbmc/OiBFYXNpbmdGdW5jdGlvblxuICBvblNldHVwPzogKCkgPT4gdW5rbm93blxuICBvbkRyYXc/OiAodmFsdWU6IG51bWJlcikgPT4gdW5rbm93blxuICBvblVwZGF0ZT86ICh2YWx1ZTogbnVtYmVyKSA9PiB1bmtub3duXG4gIG9uVGVhcmRvd24/OiAoKSA9PiB1bmtub3duXG59XG5cbi8qKlxuICogRXF1aXZhbGVudCBvZiBUd2VlblxuICovXG5leHBvcnQgY2xhc3MgQW5pbWF0aW9uIGV4dGVuZHMgVGltZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgZWFzaW5nOiBFYXNpbmdGdW5jdGlvblxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc2V0dGluZ3M6IEFuaW1hdGlvblNldHRpbmdzKSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuZWFzaW5nID0gc2V0dGluZ3MuZWFzaW5nID8/IGVhc2luZ1NldC5saW5lYXJcbiAgfVxuXG4gIG9uU2V0dXAoKSB7XG4gICAgdGhpcy5zZXR0aW5ncy5vblNldHVwPy4oKVxuICAgIHN1cGVyLm9uU2V0dXAoKVxuICAgIHRoaXMuc2V0dGluZ3Mub25VcGRhdGU/Lih0aGlzLnNldHRpbmdzLmZyb20pXG4gIH1cblxuICBvbkRyYXcoKSB7XG4gICAgdGhpcy5zZXR0aW5ncy5vbkRyYXc/LihcbiAgICAgIG1hcChcbiAgICAgICAgdGhpcy5lYXNpbmcoKGZyYW1lQ291bnQgLSB0aGlzLnN0YXJ0ZWRBdCkgLyB0aGlzLnNldHRpbmdzLmR1cmF0aW9uKSxcbiAgICAgICAgMCxcbiAgICAgICAgMSxcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5mcm9tLFxuICAgICAgICB0aGlzLnNldHRpbmdzLnRvXG4gICAgICApXG4gICAgKVxuICB9XG5cbiAgb25VcGRhdGUoKSB7XG4gICAgaWYgKGZyYW1lQ291bnQgLSB0aGlzLnN0YXJ0ZWRBdCA+PSB0aGlzLnNldHRpbmdzLmR1cmF0aW9uKSB7XG4gICAgICB0aGlzLnRlYXJkb3duKClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXR0aW5ncy5vblVwZGF0ZT8uKFxuICAgICAgICBtYXAoXG4gICAgICAgICAgdGhpcy5lYXNpbmcoKGZyYW1lQ291bnQgLSB0aGlzLnN0YXJ0ZWRBdCkgLyB0aGlzLnNldHRpbmdzLmR1cmF0aW9uKSxcbiAgICAgICAgICAwLFxuICAgICAgICAgIDEsXG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy5mcm9tLFxuICAgICAgICAgIHRoaXMuc2V0dGluZ3MudG9cbiAgICAgICAgKVxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIG9uVGVhcmRvd24oKSB7XG4gICAgdGhpcy5zZXR0aW5ncy5vblVwZGF0ZT8uKHRoaXMuc2V0dGluZ3MudG8pXG4gICAgdGhpcy5zZXR0aW5ncy5vblRlYXJkb3duPy4oKVxuICB9XG59XG4iLCAiaW1wb3J0ICogYXMgcDUgZnJvbSBcInA1XCJcbmltcG9ydCB7IERyYXdhYmxlLCBEcmF3YWJsZVNldHRpbmdzIH0gZnJvbSBcIi4vZHJhd2FibGVcIlxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU2hhcGVcbiAgZXh0ZW5kcyBEcmF3YWJsZVxuICBpbXBsZW1lbnRzIFBvc2l0aW9uYWJsZSwgUmVzaXphYmxlXG57XG4gIGFic3RyYWN0IHg6IG51bWJlclxuICBhYnN0cmFjdCB5OiBudW1iZXJcbiAgYWJzdHJhY3Qgd2lkdGg6IG51bWJlclxuICBhYnN0cmFjdCBoZWlnaHQ6IG51bWJlclxuICBhYnN0cmFjdCByZWFkb25seSBjZW50ZXJYOiBudW1iZXJcbiAgYWJzdHJhY3QgcmVhZG9ubHkgY2VudGVyWTogbnVtYmVyXG5cbiAgZ2V0IGNlbnRlcigpOiBbeDogbnVtYmVyLCB5OiBudW1iZXJdIHtcbiAgICByZXR1cm4gW3RoaXMuY2VudGVyWCwgdGhpcy5jZW50ZXJZXVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSZWN0IGV4dGVuZHMgU2hhcGUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgeCA9IDAsXG4gICAgcHVibGljIHkgPSAwLFxuICAgIHB1YmxpYyB3aWR0aCA9IDAsXG4gICAgcHVibGljIGhlaWdodCA9IDAsXG4gICAgb3B0aW9ucz86IERyYXdhYmxlU2V0dGluZ3NcbiAgKSB7XG4gICAgc3VwZXIob3B0aW9ucylcbiAgfVxuXG4gIGdldCBjZW50ZXJYKCkge1xuICAgIHJldHVybiB0aGlzLnggKyB0aGlzLndpZHRoIC8gMlxuICB9XG5cbiAgZ2V0IGNlbnRlclkoKSB7XG4gICAgcmV0dXJuIHRoaXMueSArIHRoaXMuaGVpZ2h0IC8gMlxuICB9XG5cbiAgZ2V0IGlzSG92ZXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgbW91c2VYID4gdGhpcy54ICYmXG4gICAgICBtb3VzZVggPCB0aGlzLnggKyB0aGlzLndpZHRoICYmXG4gICAgICBtb3VzZVkgPiB0aGlzLnkgJiZcbiAgICAgIG1vdXNlWSA8IHRoaXMueSArIHRoaXMuaGVpZ2h0XG4gICAgKVxuICB9XG5cbiAgb25EcmF3KCkge1xuICAgIHN1cGVyLm9uRHJhdygpXG4gICAgcmVjdCh0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIENpcmNsZSBleHRlbmRzIFNoYXBlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHggPSAwLFxuICAgIHB1YmxpYyB5ID0gMCxcbiAgICBwdWJsaWMgZGlhbWV0ZXIgPSAwLFxuICAgIG9wdGlvbnM/OiBEcmF3YWJsZVNldHRpbmdzXG4gICkge1xuICAgIHN1cGVyKG9wdGlvbnMpXG4gIH1cblxuICBnZXQgd2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlhbWV0ZXJcbiAgfVxuXG4gIGdldCBoZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlhbWV0ZXJcbiAgfVxuXG4gIGdldCBjZW50ZXJYKCkge1xuICAgIHJldHVybiB0aGlzLnhcbiAgfVxuXG4gIGdldCBjZW50ZXJZKCkge1xuICAgIHJldHVybiB0aGlzLnlcbiAgfVxuXG4gIGdldCBpc0hvdmVyZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGRpc3QobW91c2VYLCBtb3VzZVksIHRoaXMueCwgdGhpcy55KSA8IHRoaXMuZGlhbWV0ZXIgLyAyXG4gIH1cblxuICBvbkRyYXcoKSB7XG4gICAgc3VwZXIub25EcmF3KClcbiAgICBjaXJjbGUodGhpcy54LCB0aGlzLnksIHRoaXMuZGlhbWV0ZXIpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEVsbGlwc2UgZXh0ZW5kcyBSZWN0IHtcbiAgZ2V0IGNlbnRlclgoKSB7XG4gICAgcmV0dXJuIHRoaXMueFxuICB9XG5cbiAgZ2V0IGNlbnRlclkoKSB7XG4gICAgcmV0dXJuIHRoaXMueVxuICB9XG5cbiAgZ2V0IGlzSG92ZXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgTWF0aC5wb3cobW91c2VYIC0gdGhpcy54LCAyKSAvIE1hdGgucG93KHRoaXMud2lkdGggLyAyLCAyKSArXG4gICAgICAgIE1hdGgucG93KG1vdXNlWSAtIHRoaXMueSwgMikgLyBNYXRoLnBvdyh0aGlzLmhlaWdodCAvIDIsIDIpIDw9XG4gICAgICAxXG4gICAgKVxuICB9XG5cbiAgb25EcmF3KCkge1xuICAgIHN1cGVyLm9uRHJhdygpXG4gICAgZWxsaXBzZSh0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIExpbmUgZXh0ZW5kcyBTaGFwZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyB4ID0gMCxcbiAgICBwdWJsaWMgeSA9IDAsXG4gICAgcHVibGljIHgyID0gMCxcbiAgICBwdWJsaWMgeTIgPSAwLFxuICAgIG9wdGlvbnM/OiBEcmF3YWJsZVNldHRpbmdzXG4gICkge1xuICAgIHN1cGVyKG9wdGlvbnMpXG4gIH1cblxuICBnZXQgd2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMueDIgLSB0aGlzLnhcbiAgfVxuXG4gIGdldCBoZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMueTIgLSB0aGlzLnlcbiAgfVxuXG4gIGdldCBzaXplKCkge1xuICAgIHJldHVybiBkaXN0KHRoaXMueCwgdGhpcy55LCB0aGlzLngyLCB0aGlzLnkyKVxuICB9XG5cbiAgZ2V0IGNlbnRlclgoKSB7XG4gICAgcmV0dXJuIHRoaXMueCArIHRoaXMud2lkdGggLyAyXG4gIH1cblxuICBnZXQgY2VudGVyWSgpIHtcbiAgICByZXR1cm4gdGhpcy55ICsgdGhpcy5oZWlnaHQgLyAyXG4gIH1cblxuICBnZXQgaXNIb3ZlcmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICBkaXN0KHRoaXMueCwgdGhpcy55LCBtb3VzZVgsIG1vdXNlWSkgK1xuICAgICAgICBkaXN0KG1vdXNlWCwgbW91c2VZLCB0aGlzLngyLCB0aGlzLnkyKSA8PVxuICAgICAgdGhpcy5zaXplXG4gICAgKVxuICB9XG5cbiAgb25EcmF3KCkge1xuICAgIHN1cGVyLm9uRHJhdygpXG4gICAgbGluZSh0aGlzLngsIHRoaXMueSwgdGhpcy54MiwgdGhpcy55MilcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW1hZ2UgZXh0ZW5kcyBSZWN0IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGltZzogcDUuSW1hZ2UsXG4gICAgcHVibGljIHggPSAwLFxuICAgIHB1YmxpYyB5ID0gMCxcbiAgICB3aWR0aD86IG51bWJlcixcbiAgICBoZWlnaHQ/OiBudW1iZXIsXG4gICAgb3B0aW9ucz86IERyYXdhYmxlU2V0dGluZ3NcbiAgKSB7XG4gICAgc3VwZXIoeCwgeSwgd2lkdGggPz8gaW1nLndpZHRoLCBoZWlnaHQgPz8gaW1nLmhlaWdodCwgb3B0aW9ucylcbiAgfVxuXG4gIG9uRHJhdygpIHtcbiAgICBzdXBlci5vbkRyYXcoKVxuICAgIGltYWdlKHRoaXMuaW1nLCB0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRleHQgZXh0ZW5kcyBTaGFwZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyB0ZXh0ID0gXCJcIixcbiAgICBwdWJsaWMgeCA9IDAsXG4gICAgcHVibGljIHkgPSAwLFxuICAgIHB1YmxpYyBfd2lkdGg/OiBudW1iZXIsXG4gICAgcHVibGljIF9oZWlnaHQ/OiBudW1iZXIsXG4gICAgb3B0aW9ucz86IERyYXdhYmxlU2V0dGluZ3NcbiAgKSB7XG4gICAgc3VwZXIob3B0aW9ucylcbiAgfVxuXG4gIGdldCB3aWR0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl93aWR0aCA/PyBJbmZpbml0eVxuICB9XG5cbiAgZ2V0IGhlaWdodCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9oZWlnaHQgPz8gSW5maW5pdHlcbiAgfVxuXG4gIGdldCBjZW50ZXJYKCkge1xuICAgIHJldHVybiB0aGlzLnNldHRpbmdzLnRleHRBbGlnbi54ID09PSBDRU5URVJcbiAgICAgID8gdGhpcy54XG4gICAgICA6IHRoaXMueCArIHRoaXMud2lkdGggLyAyXG4gIH1cblxuICBnZXQgY2VudGVyWSgpIHtcbiAgICByZXR1cm4gdGhpcy5zZXR0aW5ncy50ZXh0QWxpZ24ueSA9PT0gQ0VOVEVSXG4gICAgICA/IHRoaXMueVxuICAgICAgOiB0aGlzLnkgKyB0aGlzLmhlaWdodCAvIDJcbiAgfVxuXG4gIGdldCBpc0hvdmVyZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChcbiAgICAgIG1vdXNlWCA+IHRoaXMuY2VudGVyWCAtIHdpZHRoIC8gMTAgJiZcbiAgICAgIG1vdXNlWCA8IHRoaXMuY2VudGVyWCArIHdpZHRoIC8gMTAgJiZcbiAgICAgIG1vdXNlWSA+IHRoaXMuY2VudGVyWSAtIGhlaWdodCAvIDEwICYmXG4gICAgICBtb3VzZVkgPCB0aGlzLmNlbnRlclggKyBoZWlnaHQgLyAxMFxuICAgIClcbiAgfVxuXG4gIG9uRHJhdygpIHtcbiAgICBzdXBlci5vbkRyYXcoKVxuICAgIHRleHQodGhpcy50ZXh0LCB0aGlzLngsIHRoaXMueSwgdGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodClcbiAgfVxufVxuIiwgImltcG9ydCB7IEVudGl0eSwgVGV4dCwgQW5pbWF0aW9uLCBEcmF3YWJsZVNldHRpbmdzIH0gZnJvbSBcIkBnaG9tL2VudGl0eS1wNVwiXG5cbmV4cG9ydCBjbGFzcyBHYW1lIGV4dGVuZHMgRW50aXR5IHtcbiAgcHJpdmF0ZSBfc2NvcmUgPSAwXG5cbiAgZ2V0IHNjb3JlKCkge1xuICAgIHJldHVybiB0aGlzLl9zY29yZVxuICB9XG5cbiAgc2V0IHNjb3JlKHNjb3JlKSB7XG4gICAgaWYgKHRoaXMuX3Njb3JlICE9PSBzY29yZSkge1xuICAgICAgY29uc3QgYmFzZVRleHRTaXplID0gaGVpZ2h0ICogMC4wNVxuXG4gICAgICBjb25zdCBvcHRpb25zOiBEcmF3YWJsZVNldHRpbmdzID0ge1xuICAgICAgICBzdHJva2U6IGZhbHNlLFxuICAgICAgICBmaWxsOiBjb2xvcigxNzApLFxuICAgICAgICB0ZXh0U2l6ZTogYmFzZVRleHRTaXplLFxuICAgICAgICB0ZXh0QWxpZ246IHtcbiAgICAgICAgICB4OiBDRU5URVIsXG4gICAgICAgICAgeTogQ0VOVEVSLFxuICAgICAgICB9LFxuICAgICAgfVxuXG4gICAgICBjb25zdCB0ZXh0ID0gbmV3IFRleHQoXG4gICAgICAgIGBTY29yZTogJHt0aGlzLnNjb3JlfWAsXG4gICAgICAgIHdpZHRoIC8gMixcbiAgICAgICAgaGVpZ2h0ICogMC4xLFxuICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgb3B0aW9uc1xuICAgICAgKVxuXG4gICAgICBpZiAodGhpcy5fc2NvcmUgPCBzY29yZSkge1xuICAgICAgICB0aGlzLmFkZENoaWxkKFxuICAgICAgICAgIG5ldyBBbmltYXRpb24oe1xuICAgICAgICAgICAgZnJvbTogMCxcbiAgICAgICAgICAgIHRvOiAxLFxuICAgICAgICAgICAgZHVyYXRpb246IDIwLFxuICAgICAgICAgICAgb25TZXR1cDogKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmFkZENoaWxkKHRleHQpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25VcGRhdGU6ICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICBvcHRpb25zLnRleHRTaXplID0gYmFzZVRleHRTaXplICogTWF0aC5tYXgoMSwgdmFsdWUgKyAwLjUpXG4gICAgICAgICAgICAgIG9wdGlvbnMuZmlsbCA9IGNvbG9yKDEwMCwgMjU1LCAyNTUsICgxIC0gdmFsdWUpICogMjU1KVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uVGVhcmRvd246ICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5yZW1vdmVDaGlsZCh0ZXh0KVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX3Njb3JlID4gc2NvcmUpIHtcbiAgICAgICAgdGhpcy5hZGRDaGlsZChcbiAgICAgICAgICBuZXcgQW5pbWF0aW9uKHtcbiAgICAgICAgICAgIGZyb206IDAsXG4gICAgICAgICAgICB0bzogMSxcbiAgICAgICAgICAgIGR1cmF0aW9uOiAyMCxcbiAgICAgICAgICAgIG9uU2V0dXA6ICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5hZGRDaGlsZCh0ZXh0KVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uVXBkYXRlOiAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgb3B0aW9ucy50ZXh0U2l6ZSA9IGJhc2VUZXh0U2l6ZSAqIE1hdGgubWF4KDEsIHZhbHVlICsgMC41KVxuICAgICAgICAgICAgICBvcHRpb25zLmZpbGwgPSBjb2xvcigyNTUsIDEwMCwgMTAwLCAoMSAtIHZhbHVlKSAqIDI1NSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvblRlYXJkb3duOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMucmVtb3ZlQ2hpbGQodGV4dClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICB0aGlzLl9zY29yZSA9IHNjb3JlXG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKVxuICB9XG5cbiAgb25EcmF3KCkge1xuICAgIHRoaXMuZHJhd1Njb3JlKClcbiAgICB0aGlzLmRyYXdTY2hlbWEoKVxuICB9XG5cbiAgZHJhd1Njb3JlKCkge1xuICAgIG5vU3Ryb2tlKClcbiAgICBmaWxsKDE3MClcbiAgICB0ZXh0U2l6ZShoZWlnaHQgKiAwLjA1KVxuICAgIHRleHRBbGlnbihDRU5URVIsIENFTlRFUilcbiAgICB0ZXh0KGBTY29yZTogJHt0aGlzLnNjb3JlfWAsIHdpZHRoIC8gMiwgaGVpZ2h0ICogMC4xKVxuICB9XG5cbiAgZHJhd1NjaGVtYSgpIHtcbiAgICBub1N0cm9rZSgpXG4gICAgZmlsbCg5MClcbiAgICB0ZXh0U2l6ZShoZWlnaHQgKiAwLjAyKVxuICAgIHRleHRBbGlnbihMRUZULCBUT1ApXG4gICAgdGV4dCh0aGlzLnNjaGVtYSgzKSwgMjAsIDIwKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBnYW1lID0gbmV3IEdhbWUoKVxuIiwgImltcG9ydCB7IENpcmNsZSwgQW5pbWF0aW9uLCBlYXNpbmdTZXQgfSBmcm9tIFwiQGdob20vZW50aXR5LXA1XCJcblxuY29uc3QgSElTVE9SWV9MRU5HVEggPSAxMDBcblxuZXhwb3J0IGNsYXNzIEN1cnNvciBleHRlbmRzIENpcmNsZSB7XG4gIHB1YmxpYyBoaXN0b3J5OiBbeDogbnVtYmVyLCB5OiBudW1iZXJdW10gPSBbXVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKDAsIDAsIDE1KVxuICB9XG5cbiAgb25VcGRhdGUoKSB7XG4gICAgdGhpcy5oaXN0b3J5LnB1c2goW3RoaXMueCwgdGhpcy55XSlcbiAgICB0aGlzLnggPSBtb3VzZVhcbiAgICB0aGlzLnkgPSBtb3VzZVlcbiAgICB3aGlsZSAodGhpcy5oaXN0b3J5Lmxlbmd0aCA+IEhJU1RPUllfTEVOR1RIKSB0aGlzLmhpc3Rvcnkuc2hpZnQoKVxuICB9XG5cbiAgb25EcmF3KCkge1xuICAgIGxldCBsYXN0ID0gdGhpcy5oaXN0b3J5WzBdXG4gICAgZm9yIChjb25zdCBwb3Mgb2YgdGhpcy5oaXN0b3J5KSB7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuaGlzdG9yeS5pbmRleE9mKHBvcylcbiAgICAgIHN0cm9rZShmbG9vcihtYXAoaW5kZXgsIHRoaXMuaGlzdG9yeS5sZW5ndGgsIDAsIDI1NSwgMCkpKVxuICAgICAgc3Ryb2tlV2VpZ2h0KGZsb29yKG1hcChpbmRleCwgdGhpcy5oaXN0b3J5Lmxlbmd0aCwgMCwgdGhpcy5kaWFtZXRlciwgMCkpKVxuICAgICAgbGluZSguLi5sYXN0LCAuLi5wb3MpXG4gICAgICBsYXN0ID0gcG9zXG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZVJlbGVhc2VkKCkge1xuICAgIGNvbnN0IHN0cm9rZSA9IHtcbiAgICAgIGNvbG9yOiBjb2xvcigyNTUpLFxuICAgICAgd2VpZ2h0OiB0aGlzLmRpYW1ldGVyIC8gNCxcbiAgICB9XG4gICAgY29uc3QgaGFsbyA9IG5ldyBDaXJjbGUobW91c2VYLCBtb3VzZVksIDAsIHtcbiAgICAgIGZpbGw6IGZhbHNlLFxuICAgICAgc3Ryb2tlLFxuICAgIH0pXG5cbiAgICB0aGlzLmFkZENoaWxkKFxuICAgICAgbmV3IEFuaW1hdGlvbih7XG4gICAgICAgIGZyb206IDAsXG4gICAgICAgIHRvOiB0aGlzLmRpYW1ldGVyICogNSxcbiAgICAgICAgZHVyYXRpb246IDEwMCxcbiAgICAgICAgZWFzaW5nOiBlYXNpbmdTZXQuZWFzZU91dFF1YXJ0LFxuICAgICAgICBvblNldHVwOiAoKSA9PiB0aGlzLmFkZENoaWxkKGhhbG8pLFxuICAgICAgICBvbkRyYXc6ICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIGhhbG8uZGlhbWV0ZXIgPSB2YWx1ZVxuICAgICAgICAgIHN0cm9rZS5jb2xvciA9IGNvbG9yKFxuICAgICAgICAgICAgMjU1LFxuICAgICAgICAgICAgKCh0aGlzLmRpYW1ldGVyICogNSAtIHZhbHVlKSAvICh0aGlzLmRpYW1ldGVyICogNSkpICogMjU1XG4gICAgICAgICAgKVxuICAgICAgICB9LFxuICAgICAgICBvblRlYXJkb3duOiAoKSA9PiB0aGlzLnJlbW92ZUNoaWxkKGhhbG8pLFxuICAgICAgfSlcbiAgICApXG4gIH1cbn1cbiIsICJpbXBvcnQgeyBDaXJjbGUgfSBmcm9tIFwiQGdob20vZW50aXR5LXA1XCJcbmltcG9ydCB7IGdhbWUgfSBmcm9tIFwiLi9nYW1lXCJcblxuZXhwb3J0IGNsYXNzIEJhbGxvb24gZXh0ZW5kcyBDaXJjbGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihyYW5kb20oMCwgd2lkdGgpLCByYW5kb20oMCwgaGVpZ2h0KSwgcmFuZG9tKDQwLCA2MCksIHtcbiAgICAgIGZpbGw6IGNvbG9yKHJhbmRvbSgxMDAsIDIwMCksIHJhbmRvbSgxMDAsIDIwMCksIHJhbmRvbSgxMDAsIDIwMCkpLFxuICAgICAgc3Ryb2tlOiBmYWxzZSxcbiAgICB9KVxuICB9XG5cbiAgb25VcGRhdGUoKSB7XG4gICAgaWYgKHRoaXMuaXNIb3ZlcmVkKSB7XG4gICAgICB0aGlzLnNldHRpbmdzLnN0cm9rZSA9IHtcbiAgICAgICAgY29sb3I6IGNvbG9yKDI1NSksXG4gICAgICAgIHdlaWdodDogNSxcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXR0aW5ncy5zdHJva2UgPSBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIG9uVGVhcmRvd24oKSB7XG4gICAgZ2FtZS5zY29yZSsrXG4gIH1cblxuICBvbk1vdXNlUmVsZWFzZWQoKSB7XG4gICAgaWYgKHRoaXMuaXNIb3ZlcmVkKSB7XG4gICAgICBpZiAodGhpcy5wYXJlbnQuY2hpbGRyZW4ubGVuZ3RoID4gMSlcbiAgICAgICAgdGhpcy5wYXJlbnQuc3RvcFRyYW5zbWlzc2lvbihcIm1vdXNlUmVsZWFzZWRcIilcblxuICAgICAgdGhpcy5wYXJlbnQuYWRkQ2hpbGQobmV3IEJhbGxvb24oKSlcbiAgICAgIHRoaXMudGVhcmRvd24oKVxuICAgIH1cbiAgfVxufVxuIiwgImltcG9ydCB7IEJhbGxvb24gfSBmcm9tIFwiLi9iYWxsb29uXCJcbmltcG9ydCB7IEVudGl0eSB9IGZyb20gXCJAZ2hvbS9lbnRpdHktcDVcIlxuXG5leHBvcnQgY2xhc3MgQmFsbG9vbnMgZXh0ZW5kcyBFbnRpdHkge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvdW50OiBudW1iZXIpIHtcbiAgICBzdXBlcigpXG4gIH1cblxuICBvblNldHVwKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jb3VudDsgaSsrKSB7XG4gICAgICB0aGlzLmFkZENoaWxkKG5ldyBCYWxsb29uKCkpXG4gICAgfVxuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7O0FDT08sbUJBQThDO0FBQUEsSUF1QnpDLGNBQWM7QUF0QmQsc0JBQVc7QUFDWCx1QkFBWSxvQkFBSTtBQUVoQix3QkFBa0U7QUFDbEUseUJBQ1I7QUFBQTtBQUFBLFFBRUUsVUFBVTtBQUNaLGFBQU8sS0FBSztBQUFBO0FBQUEsUUFHVixXQUFxRDtBQUN2RCxhQUFPLENBQUMsR0FBRyxLQUFLO0FBQUE7QUFBQSxRQUdkLFNBQXdEO0FBQzFELGFBQU8sS0FBSztBQUFBO0FBQUEsSUFXZCxVQUFVO0FBQUE7QUFBQSxJQUtWLFdBQVc7QUFBQTtBQUFBLElBS1gsYUFBYTtBQUFBO0FBQUEsSUFNTixRQUFRO0FBQ2IsVUFBSSxDQUFDLEtBQUssU0FBUztBQUNqQixhQUFLO0FBQ0wsYUFBSyxTQUFTO0FBQ2QsYUFBSyxXQUFXO0FBQUEsYUFDWDtBQUNMLGNBQU0s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LE1BQU0sS0FBSyxZQUFZO0FBQUE7QUFBQTtBQUFBOzs7QUNsRHBDLDhCQUFzQixPQUFPO0FBQUEsSUFDbEMsY0FBYztBQUNaLFlBQU0sT0FBTyxHQUFHLFFBQVEsT0FBTyxHQUFHLFNBQVMsT0FBTyxJQUFJLEtBQUs7QUFBQSxRQUN6RCxNQUFNLE1BQU0sT0FBTyxLQUFLLE1BQU0sT0FBTyxLQUFLLE1BQU0sT0FBTyxLQUFLO0FBQUEsUUFDNUQsUUFBUTtBQUFBO0FBQUE7QUFBQSxJQUlaLFdBQVc7QUFDVCxVQUFJLEtBQUssV0FBVztBQUNsQixhQUFLLFNBQVMsU0FBUztBQUFBLFVBQ3JCLE9BQU8sTUFBTTtBQUFBLFVBQ2IsUUFBUTtBQUFBO0FBQUEsYUFFTDtBQUNMLGFBQUssU0FBUyxTQUFTO0FBQUE7QUFBQTtBQUFBLElBSTNCLGFBQWE7QUFDWCxXQUFLO0FBQUE7QUFBQSxJQUdQLGtCQUFrQjtBQUNoQixVQUFJLEtBQUssV0FBVztBQUNsQixZQUFJLEtBQUssT0FBTyxTQUFTLFNBQVM7QUFDaEMsZUFBSyxPQUFPLGlCQUFpQjtBQUUvQixhQUFLLE9BQU8sU0FBUyxJQUFJO0FBQ3pCLGFBQUs7QUFBQTtBQUFBO0FBQUE7OztBQzdCSiwrQkFBdUIsT0FBTztBQUFBLElBQ25DLFlBQW9CLE9BQWU7QUFDakM7QUFEa0I7QUFBQTtBQUFBLElBSXBCLFVBQVU7QUFDUixlQUFTLElBQUksR0FBRyxJQUFJLEtBQUssT0FBTyxLQUFLO0FBQ25DLGFBQUssU0FBUyxJQUFJO0FBQUE7QUFBQTtBQUFBOzs7QVhIeEIsV0FBUyxpQkFBaUIsZUFBZSxDQUFDLFVBQVUsTUFBTTtBQUVuRCxtQkFBaUI7QUFDdEIsaUJBQ0UsS0FBSyxJQUFJLFNBQVMsZ0JBQWdCLGFBQWEsT0FBTyxjQUFjLElBQ3BFLEtBQUssSUFBSSxTQUFTLGdCQUFnQixjQUFjLE9BQU8sZUFBZTtBQUd4RSxTQUFLLFNBQVMsSUFBSSxTQUFTO0FBQzNCLFNBQUssU0FBUyxJQUFJO0FBRWxCLFNBQUs7QUFBQTtBQUdBLGtCQUFnQjtBQUNyQixlQUFXO0FBRVgsU0FBSztBQUFBO0FBR0Esa0JBQWdCLFdBQW1CO0FBQ3hDLFNBQUs7QUFBQTtBQUdBLHdCQUFzQjtBQUFBO0FBQ3RCLHlCQUF1QjtBQUFBO0FBQ3ZCLDBCQUF3QjtBQUM3QixTQUFLO0FBQUE7QUFFQSwyQkFBeUI7QUFDOUIsU0FBSztBQUFBO0FBTUEsTUFBTSxPQUFPOyIsCiAgIm5hbWVzIjogW10KfQo=
