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

  // node_modules/@ghom/entity-base/src/app/util.ts
  function map2(n, start1, stop1, start2, stop2, withinBounds = false) {
    const output = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    if (!withinBounds) {
      return output;
    }
    if (start2 < stop2) {
      return constrain(output, start2, stop2);
    } else {
      return constrain(output, stop2, start2);
    }
  }
  function constrain(n, low, high) {
    return Math.max(Math.min(n, high), low);
  }

  // node_modules/@ghom/entity-base/src/app/entity.ts
  var _Entity = class {
    constructor() {
      this._startFrame = 0;
      this._isSetup = false;
      this._children = /* @__PURE__ */ new Set();
      this._listeners = [];
      this._stopPoints = {};
    }
    static resolve(entity) {
      return typeof entity === "function" ? entity() : entity;
    }
    get frameCount() {
      return _Entity.frameCount - this._startFrame;
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
      this._startFrame = _Entity.frameCount;
      if (!this.isSetup) {
        this.onSetup();
        this.transmit("setup");
        this._isSetup = true;
      } else {
        console.warn(`${this.constructor.name} is already setup`);
      }
    }
    update() {
      _Entity.frameCount++;
      if (this.isSetup) {
        if (this.onUpdate() !== false)
          this.transmit("update");
      } else {
        console.warn(`update is called before setup in ${this.constructor.name}`);
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
        console.warn(`teardown is called before setup in ${this.constructor.name}`);
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
        if (name in child && typeof child[name] === "function")
          child[name]();
      }
    }
    getListenersByName(name) {
      return this._listeners.filter((listener) => {
        return listener.name === name;
      });
    }
    schema(indentation = 2, depth = 0, index = null) {
      return `${" ".repeat(indentation).repeat(depth)}${index === null ? "" : `${index} - `}${this.constructor.name} [${this.frameCount} frames] ${this._children.size > 0 ? ` (children: ${this.children.length})${this._listeners.length > 0 ? ` (listeners: ${this._listeners.length})` : ""}
${this.children.map((child, index2) => `${child.schema(indentation, depth + 1, index2)}`).join("\n")}` : ""}`;
    }
  };
  var Entity = _Entity;
  Entity.frameCount = 0;

  // node_modules/@ghom/entity-base/src/app/easing.ts
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
      return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    },
    easeInCubic: function(x) {
      return x * x * x;
    },
    easeOutCubic: function(x) {
      return 1 - Math.pow(1 - x, 3);
    },
    easeInOutCubic: function(x) {
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    },
    easeInQuart: function(x) {
      return x * x * x * x;
    },
    easeOutQuart: function(x) {
      return 1 - Math.pow(1 - x, 4);
    },
    easeInOutQuart: function(x) {
      return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
    },
    easeInQuint: function(x) {
      return x * x * x * x * x;
    },
    easeOutQuint: function(x) {
      return 1 - Math.pow(1 - x, 5);
    },
    easeInOutQuint: function(x) {
      return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
    },
    easeInSine: function(x) {
      return 1 - Math.cos(x * PI / 2);
    },
    easeOutSine: function(x) {
      return Math.sin(x * PI / 2);
    },
    easeInOutSine: function(x) {
      return -(Math.cos(PI * x) - 1) / 2;
    },
    easeInExpo: function(x) {
      return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
    },
    easeOutExpo: function(x) {
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    },
    easeInOutExpo: function(x) {
      return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
    },
    easeInCirc: function(x) {
      return 1 - Math.sqrt(1 - Math.pow(x, 2));
    },
    easeOutCirc: function(x) {
      return Math.sqrt(1 - Math.pow(x - 1, 2));
    },
    easeInOutCirc: function(x) {
      return x < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
    },
    easeInBack: function(x) {
      return c3 * x * x * x - c1 * x * x;
    },
    easeOutBack: function(x) {
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    },
    easeInOutBack: function(x) {
      return x < 0.5 ? Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2) / 2 : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
    },
    easeInElastic: function(x) {
      return x === 0 ? 0 : x === 1 ? 1 : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
    },
    easeOutElastic: function(x) {
      return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
    },
    easeInOutElastic: function(x) {
      return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2 : Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5) / 2 + 1;
    },
    easeInBounce: function(x) {
      return 1 - bounceOut(1 - x);
    },
    easeOutBounce: bounceOut,
    easeInOutBounce: function(x) {
      return x < 0.5 ? (1 - bounceOut(1 - 2 * x)) / 2 : (1 + bounceOut(2 * x - 1)) / 2;
    }
  };

  // node_modules/@ghom/entity-base/src/app/animation.ts
  var Animation = class extends Entity {
    constructor(settings) {
      super();
      this.settings = settings;
      var _a;
      this.easing = (_a = settings.easing) != null ? _a : easingSet.linear;
    }
    onSetup() {
      var _a, _b;
      (_b = (_a = this.settings).onSetup) == null ? void 0 : _b.call(_a);
    }
    onUpdate() {
      var _a, _b;
      if (Entity.frameCount - this._startFrame >= this.settings.duration) {
        this.teardown();
        return false;
      } else {
        (_b = (_a = this.settings).onUpdate) == null ? void 0 : _b.call(_a, map2(this.easing((Entity.frameCount - this._startFrame) / this.settings.duration), 0, 1, this.settings.from, this.settings.to));
      }
    }
    onTeardown() {
      var _a, _b;
      (_b = (_a = this.settings).onTeardown) == null ? void 0 : _b.call(_a);
    }
  };

  // node_modules/@ghom/entity-p5/src/app/base.ts
  var Base = class extends Entity {
    get zIndex() {
      var _a, _b, _c;
      return (_c = (_b = this._zIndex) != null ? _b : (_a = this.parent) == null ? void 0 : _a.children.indexOf(this)) != null ? _c : 0;
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
        if (this.onDraw() !== false)
          this.transmit("draw");
      } else {
        console.warn(`draw is called before setup in ${this.constructor.name}`);
      }
    }
    mousePressed() {
      if (this.isSetup) {
        this.onMousePressed();
        this.transmit("mousePressed");
      } else {
        console.warn(`mousePressed is called before setup in ${this.constructor.name}`);
      }
    }
    mouseReleased() {
      if (this.isSetup) {
        this.onMouseReleased();
        this.transmit("mouseReleased");
      } else {
        console.warn(`mouseReleased is called before setup in ${this.constructor.name}`);
      }
    }
    keyPressed() {
      if (this.isSetup) {
        this.onKeyPressed();
        this.transmit("keyPressed");
      } else {
        console.warn(`keyPressed is called before setup in ${this.constructor.name}`);
      }
    }
    keyReleased() {
      if (this.isSetup) {
        this.onKeyReleased();
        this.transmit("keyReleased");
      } else {
        console.warn(`keyReleased is called before setup in ${this.constructor.name}`);
      }
    }
  };

  // node_modules/@ghom/entity-p5/src/app/drawable.ts
  var Drawable = class extends Base {
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
  var Game = class extends Base {
    constructor() {
      super();
      this._score = 0;
    }
    get score() {
      return this._score;
    }
    set score(score) {
      if (this._score !== score) {
        const scoreUp = score > this._score;
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
        const text2 = new Text(`Score: ${score}`, width / 2, height * 0.1, void 0, void 0, options);
        this.addChild(new Animation({
          from: 0,
          to: 1,
          duration: 100,
          onSetup: () => {
            this.addChild(text2);
          },
          onUpdate: (value) => {
            options.textSize = baseTextSize * Math.max(1, value + 0.5);
            options.fill = scoreUp ? color(100, 255, 255, (1 - value) * 255) : color(255, 100, 100, (1 - value) * 255);
          },
          onTeardown: () => {
            this.removeChild(text2);
          }
        }));
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
        duration: 200,
        easing: easingSet.easeOutQuart,
        onSetup: () => this.addChild(halo),
        onUpdate: (value) => {
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
  var Balloons = class extends Base {
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2luZGV4LnRzIiwgIm5vZGVfbW9kdWxlcy9AZ2hvbS9lbnRpdHktYmFzZS9zcmMvYXBwL3V0aWwudHMiLCAibm9kZV9tb2R1bGVzL0BnaG9tL2VudGl0eS1iYXNlL3NyYy9hcHAvZW50aXR5LnRzIiwgIm5vZGVfbW9kdWxlcy9AZ2hvbS9lbnRpdHktYmFzZS9zcmMvYXBwL2Vhc2luZy50cyIsICJub2RlX21vZHVsZXMvQGdob20vZW50aXR5LWJhc2Uvc3JjL2FwcC9hbmltYXRpb24udHMiLCAibm9kZV9tb2R1bGVzL0BnaG9tL2VudGl0eS1wNS9zcmMvYXBwL2Jhc2UudHMiLCAibm9kZV9tb2R1bGVzL0BnaG9tL2VudGl0eS1wNS9zcmMvYXBwL2RyYXdhYmxlLnRzIiwgIm5vZGVfbW9kdWxlcy9AZ2hvbS9lbnRpdHktcDUvc3JjL2FwcC9zaGFwZS50cyIsICJzcmMvYXBwL2dhbWUudHMiLCAic3JjL2FwcC9jdXJzb3IudHMiLCAic3JjL2FwcC9iYWxsb29uLnRzIiwgInNyYy9hcHAvYmFsbG9vbnMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vLyBAdHMtY2hlY2tcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvQHR5cGVzL3A1L2dsb2JhbC5kLnRzXCIgLz5cblxuaW1wb3J0IHsgZ2FtZSB9IGZyb20gXCIuL2FwcC9nYW1lXCJcbmltcG9ydCB7IEN1cnNvciB9IGZyb20gXCIuL2FwcC9jdXJzb3JcIlxuaW1wb3J0IHsgQmFsbG9vbnMgfSBmcm9tIFwiLi9hcHAvYmFsbG9vbnNcIlxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgKGV2ZW50KSA9PiBldmVudC5wcmV2ZW50RGVmYXVsdCgpKVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0dXAoKSB7XG4gIGNyZWF0ZUNhbnZhcyhcbiAgICBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsIHdpbmRvdy5pbm5lcldpZHRoIHx8IDApLFxuICAgIE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKVxuICApXG5cbiAgZ2FtZS5hZGRDaGlsZChuZXcgQmFsbG9vbnMoMSkpXG4gIGdhbWUuYWRkQ2hpbGQobmV3IEN1cnNvcigpKVxuXG4gIGdhbWUuc2V0dXAoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZHJhdygpIHtcbiAgYmFja2dyb3VuZCgyMClcblxuICBnYW1lLmRyYXcoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlKHRpbWVzdGFtcDogbnVtYmVyKSB7XG4gIGdhbWUudXBkYXRlKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGtleVByZXNzZWQoKSB7fVxuZXhwb3J0IGZ1bmN0aW9uIGtleVJlbGVhc2VkKCkge31cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZVByZXNzZWQoKSB7XG4gIGdhbWUubW91c2VQcmVzc2VkKClcbn1cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZVJlbGVhc2VkKCkge1xuICBnYW1lLm1vdXNlUmVsZWFzZWQoKVxufVxuXG4vKipcbiAqIGRlYnVnIGltcG9ydHMgKGFjY2Vzc2libGUgZnJvbSBmcm9udGVuZCBjb25zb2xlIHdpdGggYGFwcC5yb290YClcbiAqL1xuZXhwb3J0IGNvbnN0IHJvb3QgPSBnYW1lXG4iLCAiZXhwb3J0IGZ1bmN0aW9uIG1hcChcbiAgbjogbnVtYmVyLFxuICBzdGFydDE6IG51bWJlcixcbiAgc3RvcDE6IG51bWJlcixcbiAgc3RhcnQyOiBudW1iZXIsXG4gIHN0b3AyOiBudW1iZXIsXG4gIHdpdGhpbkJvdW5kcyA9IGZhbHNlXG4pIHtcbiAgY29uc3Qgb3V0cHV0ID0gKChuIC0gc3RhcnQxKSAvIChzdG9wMSAtIHN0YXJ0MSkpICogKHN0b3AyIC0gc3RhcnQyKSArIHN0YXJ0MlxuICBpZiAoIXdpdGhpbkJvdW5kcykge1xuICAgIHJldHVybiBvdXRwdXRcbiAgfVxuICBpZiAoc3RhcnQyIDwgc3RvcDIpIHtcbiAgICByZXR1cm4gY29uc3RyYWluKG91dHB1dCwgc3RhcnQyLCBzdG9wMilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gY29uc3RyYWluKG91dHB1dCwgc3RvcDIsIHN0YXJ0MilcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29uc3RyYWluKG46IG51bWJlciwgbG93OiBudW1iZXIsIGhpZ2g6IG51bWJlcikge1xuICByZXR1cm4gTWF0aC5tYXgoTWF0aC5taW4obiwgaGlnaCksIGxvdylcbn1cbiIsICJleHBvcnQgdHlwZSBFbnRpdHlMaXN0ZW5lcjxUaGlzIGV4dGVuZHMgRW50aXR5PiA9IChcbiAgdGhpczogVGhpcyxcbiAgaXQ6IFRoaXNcbikgPT4gdW5rbm93blxuXG5leHBvcnQgdHlwZSBFbnRpdHlSZXNvbHZhYmxlID0gRW50aXR5IHwgKCgpID0+IEVudGl0eSlcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEVudGl0eSB7XG4gIHN0YXRpYyBmcmFtZUNvdW50ID0gMFxuICBzdGF0aWMgcmVzb2x2ZShlbnRpdHk6IEVudGl0eVJlc29sdmFibGUpIHtcbiAgICByZXR1cm4gdHlwZW9mIGVudGl0eSA9PT0gXCJmdW5jdGlvblwiID8gZW50aXR5KCkgOiBlbnRpdHlcbiAgfVxuXG4gIHByb3RlY3RlZCBfc3RhcnRGcmFtZSA9IDBcbiAgcHJvdGVjdGVkIF9pc1NldHVwID0gZmFsc2VcbiAgcHJvdGVjdGVkIF9jaGlsZHJlbiA9IG5ldyBTZXQ8RW50aXR5PigpXG4gIHByb3RlY3RlZCBfcGFyZW50PzogRW50aXR5XG4gIHByb3RlY3RlZCBfbGlzdGVuZXJzOiBFbnRpdHlMaXN0ZW5lcjx0aGlzPltdID0gW11cbiAgcHJvdGVjdGVkIF9zdG9wUG9pbnRzOiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPiA9IHt9XG5cbiAgZ2V0IGZyYW1lQ291bnQoKSB7XG4gICAgcmV0dXJuIEVudGl0eS5mcmFtZUNvdW50IC0gdGhpcy5fc3RhcnRGcmFtZVxuICB9XG5cbiAgZ2V0IGlzU2V0dXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lzU2V0dXBcbiAgfVxuXG4gIGdldCBjaGlsZHJlbigpOiBBcnJheTxFbnRpdHk+IHtcbiAgICByZXR1cm4gWy4uLnRoaXMuX2NoaWxkcmVuXVxuICB9XG5cbiAgZ2V0IHBhcmVudCgpOiBFbnRpdHkgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnRcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIGJlIG92ZXJ3cml0dGVuIGJ5IHlvdXIgb3duIHdvcmtpbmdzXG4gICAqL1xuICBvblNldHVwKCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25VcGRhdGUoKTogYm9vbGVhbiB8IHZvaWQge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25UZWFyZG93bigpIHt9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxuICAgKi9cbiAgcHVibGljIHNldHVwKCkge1xuICAgIHRoaXMuX3N0YXJ0RnJhbWUgPSBFbnRpdHkuZnJhbWVDb3VudFxuICAgIGlmICghdGhpcy5pc1NldHVwKSB7XG4gICAgICB0aGlzLm9uU2V0dXAoKVxuICAgICAgdGhpcy50cmFuc21pdChcInNldHVwXCIpXG4gICAgICB0aGlzLl9pc1NldHVwID0gdHJ1ZVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oYCR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSBpcyBhbHJlYWR5IHNldHVwYClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjdXJyZW50IGVudGl0eSBpcyBhIHJvb3QuXG4gICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXG4gICAqL1xuICBwdWJsaWMgdXBkYXRlKCkge1xuICAgIEVudGl0eS5mcmFtZUNvdW50KytcbiAgICBpZiAodGhpcy5pc1NldHVwKSB7XG4gICAgICBpZiAodGhpcy5vblVwZGF0ZSgpICE9PSBmYWxzZSkgdGhpcy50cmFuc21pdChcInVwZGF0ZVwiKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oYHVwZGF0ZSBpcyBjYWxsZWQgYmVmb3JlIHNldHVwIGluICR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfWApXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxuICAgKi9cbiAgcHVibGljIHRlYXJkb3duKCkge1xuICAgIGlmICh0aGlzLmlzU2V0dXApIHtcbiAgICAgIHRoaXMuX2lzU2V0dXAgPSBmYWxzZVxuICAgICAgdGhpcy5vblRlYXJkb3duKClcbiAgICAgIHRoaXMuX3BhcmVudD8ucmVtb3ZlQ2hpbGQodGhpcylcbiAgICAgIHRoaXMudHJhbnNtaXQoXCJ0ZWFyZG93blwiKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgIGB0ZWFyZG93biBpcyBjYWxsZWQgYmVmb3JlIHNldHVwIGluICR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfWBcbiAgICAgIClcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb24obmFtZTogc3RyaW5nLCBsaXN0ZW5lcjogRW50aXR5TGlzdGVuZXI8dGhpcz4pIHtcbiAgICB0aGlzLl9saXN0ZW5lcnMucHVzaChcbiAgICAgIHtcbiAgICAgICAgW25hbWVdKCkge1xuICAgICAgICAgIGxpc3RlbmVyLmJpbmQodGhpcykodGhpcylcbiAgICAgICAgfSxcbiAgICAgIH1bbmFtZV0uYmluZCh0aGlzKVxuICAgIClcbiAgfVxuXG4gIHB1YmxpYyBhZGRDaGlsZCguLi5jaGlsZHJlbjogRW50aXR5W10pIHtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgICBjaGlsZC5fcGFyZW50ID0gdGhpc1xuICAgICAgdGhpcy5fY2hpbGRyZW4uYWRkKGNoaWxkKVxuICAgICAgaWYgKHRoaXMuaXNTZXR1cCkgY2hpbGQuc2V0dXAoKVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyByZW1vdmVDaGlsZCguLi5jaGlsZHJlbjogRW50aXR5W10pIHtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgICBpZiAoY2hpbGQuaXNTZXR1cCkgY2hpbGQudGVhcmRvd24oKVxuICAgICAgZWxzZSB0aGlzLl9jaGlsZHJlbi5kZWxldGUoY2hpbGQpXG4gICAgfVxuICB9XG5cbiAgcHVibGljIHN0b3BUcmFuc21pc3Npb24obmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fc3RvcFBvaW50c1tuYW1lXSA9IHRydWVcbiAgfVxuXG4gIHB1YmxpYyB0cmFuc21pdChuYW1lOiBzdHJpbmcpIHtcbiAgICBmb3IgKGNvbnN0IGxpc3RlbmVyIG9mIHRoaXMuZ2V0TGlzdGVuZXJzQnlOYW1lKG5hbWUpKVxuICAgICAgbGlzdGVuZXIuYmluZCh0aGlzKSh0aGlzKVxuXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKSB7XG4gICAgICBpZiAodGhpcy5fc3RvcFBvaW50c1tuYW1lXSkge1xuICAgICAgICB0aGlzLl9zdG9wUG9pbnRzW25hbWVdID0gZmFsc2VcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGlmIChuYW1lIGluIGNoaWxkICYmIHR5cGVvZiBjaGlsZFtuYW1lXSA9PT0gXCJmdW5jdGlvblwiKSBjaGlsZFtuYW1lXSgpXG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldExpc3RlbmVyc0J5TmFtZShuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5fbGlzdGVuZXJzLmZpbHRlcigobGlzdGVuZXIpID0+IHtcbiAgICAgIHJldHVybiBsaXN0ZW5lci5uYW1lID09PSBuYW1lXG4gICAgfSlcbiAgfVxuXG4gIHB1YmxpYyBzY2hlbWEoXG4gICAgaW5kZW50YXRpb24gPSAyLFxuICAgIGRlcHRoID0gMCxcbiAgICBpbmRleDogbnVtYmVyIHwgbnVsbCA9IG51bGxcbiAgKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCR7XCIgXCIucmVwZWF0KGluZGVudGF0aW9uKS5yZXBlYXQoZGVwdGgpfSR7XG4gICAgICBpbmRleCA9PT0gbnVsbCA/IFwiXCIgOiBgJHtpbmRleH0gLSBgXG4gICAgfSR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSBbJHt0aGlzLmZyYW1lQ291bnR9IGZyYW1lc10gJHtcbiAgICAgIHRoaXMuX2NoaWxkcmVuLnNpemUgPiAwXG4gICAgICAgID8gYCAoY2hpbGRyZW46ICR7dGhpcy5jaGlsZHJlbi5sZW5ndGh9KSR7XG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnMubGVuZ3RoID4gMFxuICAgICAgICAgICAgICA/IGAgKGxpc3RlbmVyczogJHt0aGlzLl9saXN0ZW5lcnMubGVuZ3RofSlgXG4gICAgICAgICAgICAgIDogXCJcIlxuICAgICAgICAgIH1cXG4ke3RoaXMuY2hpbGRyZW5cbiAgICAgICAgICAgIC5tYXAoXG4gICAgICAgICAgICAgIChjaGlsZCwgaW5kZXgpID0+IGAke2NoaWxkLnNjaGVtYShpbmRlbnRhdGlvbiwgZGVwdGggKyAxLCBpbmRleCl9YFxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmpvaW4oXCJcXG5cIil9YFxuICAgICAgICA6IFwiXCJcbiAgICB9YFxuICB9XG59XG4iLCAiLy8gc291cmNlOiBodHRwczovL2dpdGh1Yi5jb20vYWkvZWFzaW5ncy5uZXQvYmxvYi9tYXN0ZXIvc3JjL2Vhc2luZ3MvZWFzaW5nc0Z1bmN0aW9ucy50c1xuXG5leHBvcnQgdHlwZSBFYXNpbmdGdW5jdGlvbiA9IChwcm9ncmVzczogbnVtYmVyKSA9PiBudW1iZXJcblxuZXhwb3J0IHR5cGUgRWFzaW5nTmFtZSA9XG4gIHwgXCJsaW5lYXJcIlxuICB8IFwiZWFzZUluUXVhZFwiXG4gIHwgXCJlYXNlT3V0UXVhZFwiXG4gIHwgXCJlYXNlSW5PdXRRdWFkXCJcbiAgfCBcImVhc2VJbkN1YmljXCJcbiAgfCBcImVhc2VPdXRDdWJpY1wiXG4gIHwgXCJlYXNlSW5PdXRDdWJpY1wiXG4gIHwgXCJlYXNlSW5RdWFydFwiXG4gIHwgXCJlYXNlT3V0UXVhcnRcIlxuICB8IFwiZWFzZUluT3V0UXVhcnRcIlxuICB8IFwiZWFzZUluUXVpbnRcIlxuICB8IFwiZWFzZU91dFF1aW50XCJcbiAgfCBcImVhc2VJbk91dFF1aW50XCJcbiAgfCBcImVhc2VJblNpbmVcIlxuICB8IFwiZWFzZU91dFNpbmVcIlxuICB8IFwiZWFzZUluT3V0U2luZVwiXG4gIHwgXCJlYXNlSW5FeHBvXCJcbiAgfCBcImVhc2VPdXRFeHBvXCJcbiAgfCBcImVhc2VJbk91dEV4cG9cIlxuICB8IFwiZWFzZUluQ2lyY1wiXG4gIHwgXCJlYXNlT3V0Q2lyY1wiXG4gIHwgXCJlYXNlSW5PdXRDaXJjXCJcbiAgfCBcImVhc2VJbkJhY2tcIlxuICB8IFwiZWFzZU91dEJhY2tcIlxuICB8IFwiZWFzZUluT3V0QmFja1wiXG4gIHwgXCJlYXNlSW5FbGFzdGljXCJcbiAgfCBcImVhc2VPdXRFbGFzdGljXCJcbiAgfCBcImVhc2VJbk91dEVsYXN0aWNcIlxuICB8IFwiZWFzZUluQm91bmNlXCJcbiAgfCBcImVhc2VPdXRCb3VuY2VcIlxuICB8IFwiZWFzZUluT3V0Qm91bmNlXCJcblxuY29uc3QgUEkgPSBNYXRoLlBJXG5jb25zdCBjMSA9IDEuNzAxNThcbmNvbnN0IGMyID0gYzEgKiAxLjUyNVxuY29uc3QgYzMgPSBjMSArIDFcbmNvbnN0IGM0ID0gKDIgKiBQSSkgLyAzXG5jb25zdCBjNSA9ICgyICogUEkpIC8gNC41XG5cbmNvbnN0IGJvdW5jZU91dDogRWFzaW5nRnVuY3Rpb24gPSBmdW5jdGlvbiAoeCkge1xuICBjb25zdCBuMSA9IDcuNTYyNVxuICBjb25zdCBkMSA9IDIuNzVcblxuICBpZiAoeCA8IDEgLyBkMSkge1xuICAgIHJldHVybiBuMSAqIHggKiB4XG4gIH0gZWxzZSBpZiAoeCA8IDIgLyBkMSkge1xuICAgIHJldHVybiBuMSAqICh4IC09IDEuNSAvIGQxKSAqIHggKyAwLjc1XG4gIH0gZWxzZSBpZiAoeCA8IDIuNSAvIGQxKSB7XG4gICAgcmV0dXJuIG4xICogKHggLT0gMi4yNSAvIGQxKSAqIHggKyAwLjkzNzVcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbjEgKiAoeCAtPSAyLjYyNSAvIGQxKSAqIHggKyAwLjk4NDM3NVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBlYXNpbmdTZXQ6IFJlY29yZDxFYXNpbmdOYW1lLCBFYXNpbmdGdW5jdGlvbj4gPSB7XG4gIGxpbmVhcjogKHgpID0+IHgsXG4gIGVhc2VJblF1YWQ6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggKiB4XG4gIH0sXG4gIGVhc2VPdXRRdWFkOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiAxIC0gKDEgLSB4KSAqICgxIC0geClcbiAgfSxcbiAgZWFzZUluT3V0UXVhZDogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4geCA8IDAuNSA/IDIgKiB4ICogeCA6IDEgLSBNYXRoLnBvdygtMiAqIHggKyAyLCAyKSAvIDJcbiAgfSxcbiAgZWFzZUluQ3ViaWM6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggKiB4ICogeFxuICB9LFxuICBlYXNlT3V0Q3ViaWM6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIDEgLSBNYXRoLnBvdygxIC0geCwgMylcbiAgfSxcbiAgZWFzZUluT3V0Q3ViaWM6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggPCAwLjUgPyA0ICogeCAqIHggKiB4IDogMSAtIE1hdGgucG93KC0yICogeCArIDIsIDMpIC8gMlxuICB9LFxuICBlYXNlSW5RdWFydDogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4geCAqIHggKiB4ICogeFxuICB9LFxuICBlYXNlT3V0UXVhcnQ6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIDEgLSBNYXRoLnBvdygxIC0geCwgNClcbiAgfSxcbiAgZWFzZUluT3V0UXVhcnQ6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggPCAwLjUgPyA4ICogeCAqIHggKiB4ICogeCA6IDEgLSBNYXRoLnBvdygtMiAqIHggKyAyLCA0KSAvIDJcbiAgfSxcbiAgZWFzZUluUXVpbnQ6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggKiB4ICogeCAqIHggKiB4XG4gIH0sXG4gIGVhc2VPdXRRdWludDogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gMSAtIE1hdGgucG93KDEgLSB4LCA1KVxuICB9LFxuICBlYXNlSW5PdXRRdWludDogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4geCA8IDAuNSA/IDE2ICogeCAqIHggKiB4ICogeCAqIHggOiAxIC0gTWF0aC5wb3coLTIgKiB4ICsgMiwgNSkgLyAyXG4gIH0sXG4gIGVhc2VJblNpbmU6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIDEgLSBNYXRoLmNvcygoeCAqIFBJKSAvIDIpXG4gIH0sXG4gIGVhc2VPdXRTaW5lOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiBNYXRoLnNpbigoeCAqIFBJKSAvIDIpXG4gIH0sXG4gIGVhc2VJbk91dFNpbmU6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIC0oTWF0aC5jb3MoUEkgKiB4KSAtIDEpIC8gMlxuICB9LFxuICBlYXNlSW5FeHBvOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4ID09PSAwID8gMCA6IE1hdGgucG93KDIsIDEwICogeCAtIDEwKVxuICB9LFxuICBlYXNlT3V0RXhwbzogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4geCA9PT0gMSA/IDEgOiAxIC0gTWF0aC5wb3coMiwgLTEwICogeClcbiAgfSxcbiAgZWFzZUluT3V0RXhwbzogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4geCA9PT0gMFxuICAgICAgPyAwXG4gICAgICA6IHggPT09IDFcbiAgICAgID8gMVxuICAgICAgOiB4IDwgMC41XG4gICAgICA/IE1hdGgucG93KDIsIDIwICogeCAtIDEwKSAvIDJcbiAgICAgIDogKDIgLSBNYXRoLnBvdygyLCAtMjAgKiB4ICsgMTApKSAvIDJcbiAgfSxcbiAgZWFzZUluQ2lyYzogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gMSAtIE1hdGguc3FydCgxIC0gTWF0aC5wb3coeCwgMikpXG4gIH0sXG4gIGVhc2VPdXRDaXJjOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiBNYXRoLnNxcnQoMSAtIE1hdGgucG93KHggLSAxLCAyKSlcbiAgfSxcbiAgZWFzZUluT3V0Q2lyYzogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4geCA8IDAuNVxuICAgICAgPyAoMSAtIE1hdGguc3FydCgxIC0gTWF0aC5wb3coMiAqIHgsIDIpKSkgLyAyXG4gICAgICA6IChNYXRoLnNxcnQoMSAtIE1hdGgucG93KC0yICogeCArIDIsIDIpKSArIDEpIC8gMlxuICB9LFxuICBlYXNlSW5CYWNrOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiBjMyAqIHggKiB4ICogeCAtIGMxICogeCAqIHhcbiAgfSxcbiAgZWFzZU91dEJhY2s6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIDEgKyBjMyAqIE1hdGgucG93KHggLSAxLCAzKSArIGMxICogTWF0aC5wb3coeCAtIDEsIDIpXG4gIH0sXG4gIGVhc2VJbk91dEJhY2s6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggPCAwLjVcbiAgICAgID8gKE1hdGgucG93KDIgKiB4LCAyKSAqICgoYzIgKyAxKSAqIDIgKiB4IC0gYzIpKSAvIDJcbiAgICAgIDogKE1hdGgucG93KDIgKiB4IC0gMiwgMikgKiAoKGMyICsgMSkgKiAoeCAqIDIgLSAyKSArIGMyKSArIDIpIC8gMlxuICB9LFxuICBlYXNlSW5FbGFzdGljOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4ID09PSAwXG4gICAgICA/IDBcbiAgICAgIDogeCA9PT0gMVxuICAgICAgPyAxXG4gICAgICA6IC1NYXRoLnBvdygyLCAxMCAqIHggLSAxMCkgKiBNYXRoLnNpbigoeCAqIDEwIC0gMTAuNzUpICogYzQpXG4gIH0sXG4gIGVhc2VPdXRFbGFzdGljOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4ID09PSAwXG4gICAgICA/IDBcbiAgICAgIDogeCA9PT0gMVxuICAgICAgPyAxXG4gICAgICA6IE1hdGgucG93KDIsIC0xMCAqIHgpICogTWF0aC5zaW4oKHggKiAxMCAtIDAuNzUpICogYzQpICsgMVxuICB9LFxuICBlYXNlSW5PdXRFbGFzdGljOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4ID09PSAwXG4gICAgICA/IDBcbiAgICAgIDogeCA9PT0gMVxuICAgICAgPyAxXG4gICAgICA6IHggPCAwLjVcbiAgICAgID8gLShNYXRoLnBvdygyLCAyMCAqIHggLSAxMCkgKiBNYXRoLnNpbigoMjAgKiB4IC0gMTEuMTI1KSAqIGM1KSkgLyAyXG4gICAgICA6IChNYXRoLnBvdygyLCAtMjAgKiB4ICsgMTApICogTWF0aC5zaW4oKDIwICogeCAtIDExLjEyNSkgKiBjNSkpIC8gMiArIDFcbiAgfSxcbiAgZWFzZUluQm91bmNlOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiAxIC0gYm91bmNlT3V0KDEgLSB4KVxuICB9LFxuICBlYXNlT3V0Qm91bmNlOiBib3VuY2VPdXQsXG4gIGVhc2VJbk91dEJvdW5jZTogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4geCA8IDAuNVxuICAgICAgPyAoMSAtIGJvdW5jZU91dCgxIC0gMiAqIHgpKSAvIDJcbiAgICAgIDogKDEgKyBib3VuY2VPdXQoMiAqIHggLSAxKSkgLyAyXG4gIH0sXG59XG4iLCAiaW1wb3J0IHsgbWFwIH0gZnJvbSBcIi4vdXRpbFwiXG5pbXBvcnQgeyBFbnRpdHkgfSBmcm9tIFwiLi9lbnRpdHlcIlxuaW1wb3J0IHsgRWFzaW5nRnVuY3Rpb24sIGVhc2luZ1NldCB9IGZyb20gXCIuL2Vhc2luZ1wiXG5cbmV4cG9ydCBpbnRlcmZhY2UgQW5pbWF0aW9uU2V0dGluZ3Mge1xuICBmcm9tOiBudW1iZXJcbiAgdG86IG51bWJlclxuICAvKipcbiAgICogQW5pbWF0aW9uIGR1cmF0aW9uIGluICoqZnJhbWUgY291bnQqKiFcbiAgICovXG4gIGR1cmF0aW9uOiBudW1iZXJcbiAgZWFzaW5nPzogRWFzaW5nRnVuY3Rpb25cbiAgb25TZXR1cD86ICgpID0+IHVua25vd25cbiAgb25VcGRhdGU/OiAodmFsdWU6IG51bWJlcikgPT4gdW5rbm93blxuICBvblRlYXJkb3duPzogKCkgPT4gdW5rbm93blxufVxuXG4vKipcbiAqIEVxdWl2YWxlbnQgb2YgVHdlZW5cbiAqL1xuZXhwb3J0IGNsYXNzIEFuaW1hdGlvbiBleHRlbmRzIEVudGl0eSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgZWFzaW5nOiBFYXNpbmdGdW5jdGlvblxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc2V0dGluZ3M6IEFuaW1hdGlvblNldHRpbmdzKSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuZWFzaW5nID0gc2V0dGluZ3MuZWFzaW5nID8/IGVhc2luZ1NldC5saW5lYXJcbiAgfVxuXG4gIG9uU2V0dXAoKSB7XG4gICAgdGhpcy5zZXR0aW5ncy5vblNldHVwPy4oKVxuICB9XG5cbiAgb25VcGRhdGUoKSB7XG4gICAgaWYgKEVudGl0eS5mcmFtZUNvdW50IC0gdGhpcy5fc3RhcnRGcmFtZSA+PSB0aGlzLnNldHRpbmdzLmR1cmF0aW9uKSB7XG4gICAgICB0aGlzLnRlYXJkb3duKClcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldHRpbmdzLm9uVXBkYXRlPy4oXG4gICAgICAgIG1hcChcbiAgICAgICAgICB0aGlzLmVhc2luZyhcbiAgICAgICAgICAgIChFbnRpdHkuZnJhbWVDb3VudCAtIHRoaXMuX3N0YXJ0RnJhbWUpIC8gdGhpcy5zZXR0aW5ncy5kdXJhdGlvblxuICAgICAgICAgICksXG4gICAgICAgICAgMCxcbiAgICAgICAgICAxLFxuICAgICAgICAgIHRoaXMuc2V0dGluZ3MuZnJvbSxcbiAgICAgICAgICB0aGlzLnNldHRpbmdzLnRvXG4gICAgICAgIClcbiAgICAgIClcbiAgICB9XG4gIH1cblxuICBvblRlYXJkb3duKCkge1xuICAgIHRoaXMuc2V0dGluZ3Mub25UZWFyZG93bj8uKClcbiAgfVxufVxuIiwgImltcG9ydCB7IEVudGl0eSB9IGZyb20gXCJAZ2hvbS9lbnRpdHktYmFzZVwiXG5cbmV4cG9ydCBjbGFzcyBCYXNlIGV4dGVuZHMgRW50aXR5IHtcbiAgcHJvdGVjdGVkIF96SW5kZXg/OiBudW1iZXJcblxuICBnZXQgekluZGV4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3pJbmRleCA/PyB0aGlzLnBhcmVudD8uY2hpbGRyZW4uaW5kZXhPZih0aGlzKSA/PyAwXG4gIH1cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25EcmF3KCk6IGJvb2xlYW4gfCB2b2lkIHt9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcbiAgICovXG4gIG9uTW91c2VSZWxlYXNlZCgpIHt9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcbiAgICovXG4gIG9uTW91c2VQcmVzc2VkKCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25LZXlSZWxlYXNlZCgpIHt9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcbiAgICovXG4gIG9uS2V5UHJlc3NlZCgpIHt9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxuICAgKi9cbiAgcHVibGljIGRyYXcoKSB7XG4gICAgaWYgKHRoaXMuaXNTZXR1cCkge1xuICAgICAgaWYgKHRoaXMub25EcmF3KCkgIT09IGZhbHNlKSB0aGlzLnRyYW5zbWl0KFwiZHJhd1wiKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oYGRyYXcgaXMgY2FsbGVkIGJlZm9yZSBzZXR1cCBpbiAke3RoaXMuY29uc3RydWN0b3IubmFtZX1gKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cbiAgICogU2hvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiFcbiAgICovXG4gIHB1YmxpYyBtb3VzZVByZXNzZWQoKSB7XG4gICAgaWYgKHRoaXMuaXNTZXR1cCkge1xuICAgICAgdGhpcy5vbk1vdXNlUHJlc3NlZCgpXG4gICAgICB0aGlzLnRyYW5zbWl0KFwibW91c2VQcmVzc2VkXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgYG1vdXNlUHJlc3NlZCBpcyBjYWxsZWQgYmVmb3JlIHNldHVwIGluICR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfWBcbiAgICAgIClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjdXJyZW50IGVudGl0eSBpcyBhIHJvb3QuXG4gICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXG4gICAqL1xuICBwdWJsaWMgbW91c2VSZWxlYXNlZCgpIHtcbiAgICBpZiAodGhpcy5pc1NldHVwKSB7XG4gICAgICB0aGlzLm9uTW91c2VSZWxlYXNlZCgpXG4gICAgICB0aGlzLnRyYW5zbWl0KFwibW91c2VSZWxlYXNlZFwiKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgIGBtb3VzZVJlbGVhc2VkIGlzIGNhbGxlZCBiZWZvcmUgc2V0dXAgaW4gJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9YFxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cbiAgICogU2hvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiFcbiAgICovXG4gIHB1YmxpYyBrZXlQcmVzc2VkKCkge1xuICAgIGlmICh0aGlzLmlzU2V0dXApIHtcbiAgICAgIHRoaXMub25LZXlQcmVzc2VkKClcbiAgICAgIHRoaXMudHJhbnNtaXQoXCJrZXlQcmVzc2VkXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgYGtleVByZXNzZWQgaXMgY2FsbGVkIGJlZm9yZSBzZXR1cCBpbiAke3RoaXMuY29uc3RydWN0b3IubmFtZX1gXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxuICAgKi9cbiAgcHVibGljIGtleVJlbGVhc2VkKCkge1xuICAgIGlmICh0aGlzLmlzU2V0dXApIHtcbiAgICAgIHRoaXMub25LZXlSZWxlYXNlZCgpXG4gICAgICB0aGlzLnRyYW5zbWl0KFwia2V5UmVsZWFzZWRcIilcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICBga2V5UmVsZWFzZWQgaXMgY2FsbGVkIGJlZm9yZSBzZXR1cCBpbiAke3RoaXMuY29uc3RydWN0b3IubmFtZX1gXG4gICAgICApXG4gICAgfVxuICB9XG59XG4iLCAiaW1wb3J0ICogYXMgcDUgZnJvbSBcInA1XCJcbmltcG9ydCB7IEJhc2UgfSBmcm9tIFwiLi9iYXNlXCJcblxuZXhwb3J0IGludGVyZmFjZSBEcmF3YWJsZVNldHRpbmdzIHtcbiAgZmlsbDogZmFsc2UgfCBGaWxsT3B0aW9uc1xuICBzdHJva2U6IGZhbHNlIHwgU3Ryb2tlT3B0aW9uc1xuICB0ZXh0U2l6ZT86IG51bWJlclxuICB0ZXh0QWxpZ24/OiB7XG4gICAgeD86IHA1LkhPUklaX0FMSUdOXG4gICAgeT86IHA1LlZFUlRfQUxJR05cbiAgfVxufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRHJhd2FibGUgZXh0ZW5kcyBCYXNlIHtcbiAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzZXR0aW5ncz86IERyYXdhYmxlU2V0dGluZ3MpIHtcbiAgICBzdXBlcigpXG4gIH1cblxuICBvbkRyYXcoKSB7XG4gICAgaWYgKCF0aGlzLnNldHRpbmdzKSByZXR1cm5cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmZpbGwpIHtcbiAgICAgIGlmIChcImNvbG9yXCIgaW4gdGhpcy5zZXR0aW5ncy5maWxsKSB7XG4gICAgICAgIGZpbGwodGhpcy5zZXR0aW5ncy5maWxsLmNvbG9yKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmlsbCh0aGlzLnNldHRpbmdzLmZpbGwpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vRmlsbCgpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3Muc3Ryb2tlKSB7XG4gICAgICBzdHJva2VXZWlnaHQodGhpcy5zZXR0aW5ncy5zdHJva2Uud2VpZ2h0KVxuICAgICAgc3Ryb2tlKHRoaXMuc2V0dGluZ3Muc3Ryb2tlLmNvbG9yKVxuICAgIH0gZWxzZSB7XG4gICAgICBub1N0cm9rZSgpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MudGV4dEFsaWduKSB7XG4gICAgICB0ZXh0QWxpZ24odGhpcy5zZXR0aW5ncy50ZXh0QWxpZ24ueCwgdGhpcy5zZXR0aW5ncy50ZXh0QWxpZ24ueSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGV4dEFsaWduKENFTlRFUiwgQ0VOVEVSKVxuICAgIH1cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLnRleHRTaXplKSB7XG4gICAgICB0ZXh0U2l6ZSh0aGlzLnNldHRpbmdzLnRleHRTaXplKVxuICAgIH0gZWxzZSB7XG4gICAgICB0ZXh0U2l6ZShoZWlnaHQgKiAwLjEpXG4gICAgfVxuICB9XG59XG4iLCAiaW1wb3J0ICogYXMgcDUgZnJvbSBcInA1XCJcbmltcG9ydCB7IERyYXdhYmxlLCBEcmF3YWJsZVNldHRpbmdzIH0gZnJvbSBcIi4vZHJhd2FibGVcIlxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU2hhcGVcbiAgZXh0ZW5kcyBEcmF3YWJsZVxuICBpbXBsZW1lbnRzIFBvc2l0aW9uYWJsZSwgUmVzaXphYmxlXG57XG4gIGFic3RyYWN0IHg6IG51bWJlclxuICBhYnN0cmFjdCB5OiBudW1iZXJcbiAgYWJzdHJhY3Qgd2lkdGg6IG51bWJlclxuICBhYnN0cmFjdCBoZWlnaHQ6IG51bWJlclxuICBhYnN0cmFjdCByZWFkb25seSBjZW50ZXJYOiBudW1iZXJcbiAgYWJzdHJhY3QgcmVhZG9ubHkgY2VudGVyWTogbnVtYmVyXG5cbiAgZ2V0IGNlbnRlcigpOiBbeDogbnVtYmVyLCB5OiBudW1iZXJdIHtcbiAgICByZXR1cm4gW3RoaXMuY2VudGVyWCwgdGhpcy5jZW50ZXJZXVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSZWN0IGV4dGVuZHMgU2hhcGUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgeCA9IDAsXG4gICAgcHVibGljIHkgPSAwLFxuICAgIHB1YmxpYyB3aWR0aCA9IDAsXG4gICAgcHVibGljIGhlaWdodCA9IDAsXG4gICAgb3B0aW9ucz86IERyYXdhYmxlU2V0dGluZ3NcbiAgKSB7XG4gICAgc3VwZXIob3B0aW9ucylcbiAgfVxuXG4gIGdldCBjZW50ZXJYKCkge1xuICAgIHJldHVybiB0aGlzLnggKyB0aGlzLndpZHRoIC8gMlxuICB9XG5cbiAgZ2V0IGNlbnRlclkoKSB7XG4gICAgcmV0dXJuIHRoaXMueSArIHRoaXMuaGVpZ2h0IC8gMlxuICB9XG5cbiAgZ2V0IGlzSG92ZXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgbW91c2VYID4gdGhpcy54ICYmXG4gICAgICBtb3VzZVggPCB0aGlzLnggKyB0aGlzLndpZHRoICYmXG4gICAgICBtb3VzZVkgPiB0aGlzLnkgJiZcbiAgICAgIG1vdXNlWSA8IHRoaXMueSArIHRoaXMuaGVpZ2h0XG4gICAgKVxuICB9XG5cbiAgb25EcmF3KCkge1xuICAgIHN1cGVyLm9uRHJhdygpXG4gICAgcmVjdCh0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIENpcmNsZSBleHRlbmRzIFNoYXBlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHggPSAwLFxuICAgIHB1YmxpYyB5ID0gMCxcbiAgICBwdWJsaWMgZGlhbWV0ZXIgPSAwLFxuICAgIG9wdGlvbnM/OiBEcmF3YWJsZVNldHRpbmdzXG4gICkge1xuICAgIHN1cGVyKG9wdGlvbnMpXG4gIH1cblxuICBnZXQgd2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlhbWV0ZXJcbiAgfVxuXG4gIGdldCBoZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlhbWV0ZXJcbiAgfVxuXG4gIGdldCBjZW50ZXJYKCkge1xuICAgIHJldHVybiB0aGlzLnhcbiAgfVxuXG4gIGdldCBjZW50ZXJZKCkge1xuICAgIHJldHVybiB0aGlzLnlcbiAgfVxuXG4gIGdldCBpc0hvdmVyZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGRpc3QobW91c2VYLCBtb3VzZVksIHRoaXMueCwgdGhpcy55KSA8IHRoaXMuZGlhbWV0ZXIgLyAyXG4gIH1cblxuICBvbkRyYXcoKSB7XG4gICAgc3VwZXIub25EcmF3KClcbiAgICBjaXJjbGUodGhpcy54LCB0aGlzLnksIHRoaXMuZGlhbWV0ZXIpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEVsbGlwc2UgZXh0ZW5kcyBSZWN0IHtcbiAgZ2V0IGNlbnRlclgoKSB7XG4gICAgcmV0dXJuIHRoaXMueFxuICB9XG5cbiAgZ2V0IGNlbnRlclkoKSB7XG4gICAgcmV0dXJuIHRoaXMueVxuICB9XG5cbiAgZ2V0IGlzSG92ZXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgTWF0aC5wb3cobW91c2VYIC0gdGhpcy54LCAyKSAvIE1hdGgucG93KHRoaXMud2lkdGggLyAyLCAyKSArXG4gICAgICAgIE1hdGgucG93KG1vdXNlWSAtIHRoaXMueSwgMikgLyBNYXRoLnBvdyh0aGlzLmhlaWdodCAvIDIsIDIpIDw9XG4gICAgICAxXG4gICAgKVxuICB9XG5cbiAgb25EcmF3KCkge1xuICAgIHN1cGVyLm9uRHJhdygpXG4gICAgZWxsaXBzZSh0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIExpbmUgZXh0ZW5kcyBTaGFwZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyB4ID0gMCxcbiAgICBwdWJsaWMgeSA9IDAsXG4gICAgcHVibGljIHgyID0gMCxcbiAgICBwdWJsaWMgeTIgPSAwLFxuICAgIG9wdGlvbnM/OiBEcmF3YWJsZVNldHRpbmdzXG4gICkge1xuICAgIHN1cGVyKG9wdGlvbnMpXG4gIH1cblxuICBnZXQgd2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMueDIgLSB0aGlzLnhcbiAgfVxuXG4gIGdldCBoZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMueTIgLSB0aGlzLnlcbiAgfVxuXG4gIGdldCBzaXplKCkge1xuICAgIHJldHVybiBkaXN0KHRoaXMueCwgdGhpcy55LCB0aGlzLngyLCB0aGlzLnkyKVxuICB9XG5cbiAgZ2V0IGNlbnRlclgoKSB7XG4gICAgcmV0dXJuIHRoaXMueCArIHRoaXMud2lkdGggLyAyXG4gIH1cblxuICBnZXQgY2VudGVyWSgpIHtcbiAgICByZXR1cm4gdGhpcy55ICsgdGhpcy5oZWlnaHQgLyAyXG4gIH1cblxuICBnZXQgaXNIb3ZlcmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICBkaXN0KHRoaXMueCwgdGhpcy55LCBtb3VzZVgsIG1vdXNlWSkgK1xuICAgICAgICBkaXN0KG1vdXNlWCwgbW91c2VZLCB0aGlzLngyLCB0aGlzLnkyKSA8PVxuICAgICAgdGhpcy5zaXplXG4gICAgKVxuICB9XG5cbiAgb25EcmF3KCkge1xuICAgIHN1cGVyLm9uRHJhdygpXG4gICAgbGluZSh0aGlzLngsIHRoaXMueSwgdGhpcy54MiwgdGhpcy55MilcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW1hZ2UgZXh0ZW5kcyBSZWN0IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGltZzogcDUuSW1hZ2UsXG4gICAgcHVibGljIHggPSAwLFxuICAgIHB1YmxpYyB5ID0gMCxcbiAgICB3aWR0aD86IG51bWJlcixcbiAgICBoZWlnaHQ/OiBudW1iZXIsXG4gICAgb3B0aW9ucz86IERyYXdhYmxlU2V0dGluZ3NcbiAgKSB7XG4gICAgc3VwZXIoeCwgeSwgd2lkdGggPz8gaW1nLndpZHRoLCBoZWlnaHQgPz8gaW1nLmhlaWdodCwgb3B0aW9ucylcbiAgfVxuXG4gIG9uRHJhdygpIHtcbiAgICBzdXBlci5vbkRyYXcoKVxuICAgIGltYWdlKHRoaXMuaW1nLCB0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRleHQgZXh0ZW5kcyBTaGFwZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyB0ZXh0ID0gXCJcIixcbiAgICBwdWJsaWMgeCA9IDAsXG4gICAgcHVibGljIHkgPSAwLFxuICAgIHB1YmxpYyBfd2lkdGg/OiBudW1iZXIsXG4gICAgcHVibGljIF9oZWlnaHQ/OiBudW1iZXIsXG4gICAgb3B0aW9ucz86IERyYXdhYmxlU2V0dGluZ3NcbiAgKSB7XG4gICAgc3VwZXIob3B0aW9ucylcbiAgfVxuXG4gIGdldCB3aWR0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl93aWR0aCA/PyBJbmZpbml0eVxuICB9XG5cbiAgZ2V0IGhlaWdodCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9oZWlnaHQgPz8gSW5maW5pdHlcbiAgfVxuXG4gIGdldCBjZW50ZXJYKCkge1xuICAgIHJldHVybiB0aGlzLnNldHRpbmdzLnRleHRBbGlnbi54ID09PSBDRU5URVJcbiAgICAgID8gdGhpcy54XG4gICAgICA6IHRoaXMueCArIHRoaXMud2lkdGggLyAyXG4gIH1cblxuICBnZXQgY2VudGVyWSgpIHtcbiAgICByZXR1cm4gdGhpcy5zZXR0aW5ncy50ZXh0QWxpZ24ueSA9PT0gQ0VOVEVSXG4gICAgICA/IHRoaXMueVxuICAgICAgOiB0aGlzLnkgKyB0aGlzLmhlaWdodCAvIDJcbiAgfVxuXG4gIGdldCBpc0hvdmVyZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChcbiAgICAgIG1vdXNlWCA+IHRoaXMuY2VudGVyWCAtIHdpZHRoIC8gMTAgJiZcbiAgICAgIG1vdXNlWCA8IHRoaXMuY2VudGVyWCArIHdpZHRoIC8gMTAgJiZcbiAgICAgIG1vdXNlWSA+IHRoaXMuY2VudGVyWSAtIGhlaWdodCAvIDEwICYmXG4gICAgICBtb3VzZVkgPCB0aGlzLmNlbnRlclggKyBoZWlnaHQgLyAxMFxuICAgIClcbiAgfVxuXG4gIG9uRHJhdygpIHtcbiAgICBzdXBlci5vbkRyYXcoKVxuICAgIHRleHQodGhpcy50ZXh0LCB0aGlzLngsIHRoaXMueSwgdGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodClcbiAgfVxufVxuIiwgImltcG9ydCB7IEJhc2UsIFRleHQsIEFuaW1hdGlvbiwgRHJhd2FibGVTZXR0aW5ncyB9IGZyb20gXCJAZ2hvbS9lbnRpdHktcDVcIlxuXG5leHBvcnQgY2xhc3MgR2FtZSBleHRlbmRzIEJhc2Uge1xuICBwcml2YXRlIF9zY29yZSA9IDBcblxuICBnZXQgc2NvcmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Njb3JlXG4gIH1cblxuICBzZXQgc2NvcmUoc2NvcmUpIHtcbiAgICBpZiAodGhpcy5fc2NvcmUgIT09IHNjb3JlKSB7XG4gICAgICBjb25zdCBzY29yZVVwID0gc2NvcmUgPiB0aGlzLl9zY29yZVxuXG4gICAgICBjb25zdCBiYXNlVGV4dFNpemUgPSBoZWlnaHQgKiAwLjA1XG5cbiAgICAgIGNvbnN0IG9wdGlvbnM6IERyYXdhYmxlU2V0dGluZ3MgPSB7XG4gICAgICAgIHN0cm9rZTogZmFsc2UsXG4gICAgICAgIGZpbGw6IGNvbG9yKDE3MCksXG4gICAgICAgIHRleHRTaXplOiBiYXNlVGV4dFNpemUsXG4gICAgICAgIHRleHRBbGlnbjoge1xuICAgICAgICAgIHg6IENFTlRFUixcbiAgICAgICAgICB5OiBDRU5URVIsXG4gICAgICAgIH0sXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRleHQgPSBuZXcgVGV4dChcbiAgICAgICAgYFNjb3JlOiAke3Njb3JlfWAsXG4gICAgICAgIHdpZHRoIC8gMixcbiAgICAgICAgaGVpZ2h0ICogMC4xLFxuICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgb3B0aW9uc1xuICAgICAgKVxuXG4gICAgICB0aGlzLmFkZENoaWxkKFxuICAgICAgICBuZXcgQW5pbWF0aW9uKHtcbiAgICAgICAgICBmcm9tOiAwLFxuICAgICAgICAgIHRvOiAxLFxuICAgICAgICAgIGR1cmF0aW9uOiAxMDAsXG4gICAgICAgICAgb25TZXR1cDogKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZCh0ZXh0KVxuICAgICAgICAgIH0sXG4gICAgICAgICAgb25VcGRhdGU6ICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgb3B0aW9ucy50ZXh0U2l6ZSA9IGJhc2VUZXh0U2l6ZSAqIE1hdGgubWF4KDEsIHZhbHVlICsgMC41KVxuICAgICAgICAgICAgb3B0aW9ucy5maWxsID0gc2NvcmVVcFxuICAgICAgICAgICAgICA/IGNvbG9yKDEwMCwgMjU1LCAyNTUsICgxIC0gdmFsdWUpICogMjU1KVxuICAgICAgICAgICAgICA6IGNvbG9yKDI1NSwgMTAwLCAxMDAsICgxIC0gdmFsdWUpICogMjU1KVxuICAgICAgICAgIH0sXG4gICAgICAgICAgb25UZWFyZG93bjogKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVDaGlsZCh0ZXh0KVxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICApXG5cbiAgICAgIHRoaXMuX3Njb3JlID0gc2NvcmVcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpXG4gIH1cblxuICBvbkRyYXcoKSB7XG4gICAgdGhpcy5kcmF3U2NvcmUoKVxuICAgIHRoaXMuZHJhd1NjaGVtYSgpXG4gIH1cblxuICBkcmF3U2NvcmUoKSB7XG4gICAgbm9TdHJva2UoKVxuICAgIGZpbGwoMTcwKVxuICAgIHRleHRTaXplKGhlaWdodCAqIDAuMDUpXG4gICAgdGV4dEFsaWduKENFTlRFUiwgQ0VOVEVSKVxuICAgIHRleHQoYFNjb3JlOiAke3RoaXMuc2NvcmV9YCwgd2lkdGggLyAyLCBoZWlnaHQgKiAwLjEpXG4gIH1cblxuICBkcmF3U2NoZW1hKCkge1xuICAgIG5vU3Ryb2tlKClcbiAgICBmaWxsKDkwKVxuICAgIHRleHRTaXplKGhlaWdodCAqIDAuMDIpXG4gICAgdGV4dEFsaWduKExFRlQsIFRPUClcbiAgICB0ZXh0KHRoaXMuc2NoZW1hKDUpLCAyMCwgMjApXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGdhbWUgPSBuZXcgR2FtZSgpXG4iLCAiaW1wb3J0IHtcbiAgQ2lyY2xlLFxuICBBbmltYXRpb24sXG4gIGVhc2luZ1NldCxcbiAgUGFyYWxsZWwsXG4gIFNlcXVlbmNlLFxufSBmcm9tIFwiQGdob20vZW50aXR5LXA1XCJcblxuY29uc3QgSElTVE9SWV9MRU5HVEggPSAxMDBcblxuZXhwb3J0IGNsYXNzIEN1cnNvciBleHRlbmRzIENpcmNsZSB7XG4gIHB1YmxpYyBoaXN0b3J5OiBbeDogbnVtYmVyLCB5OiBudW1iZXJdW10gPSBbXVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKDAsIDAsIDE1KVxuICB9XG5cbiAgb25VcGRhdGUoKSB7XG4gICAgdGhpcy5oaXN0b3J5LnB1c2goW3RoaXMueCwgdGhpcy55XSlcbiAgICB0aGlzLnggPSBtb3VzZVhcbiAgICB0aGlzLnkgPSBtb3VzZVlcbiAgICB3aGlsZSAodGhpcy5oaXN0b3J5Lmxlbmd0aCA+IEhJU1RPUllfTEVOR1RIKSB0aGlzLmhpc3Rvcnkuc2hpZnQoKVxuICB9XG5cbiAgb25EcmF3KCkge1xuICAgIGxldCBsYXN0ID0gdGhpcy5oaXN0b3J5WzBdXG4gICAgZm9yIChjb25zdCBwb3Mgb2YgdGhpcy5oaXN0b3J5KSB7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuaGlzdG9yeS5pbmRleE9mKHBvcylcbiAgICAgIHN0cm9rZShmbG9vcihtYXAoaW5kZXgsIHRoaXMuaGlzdG9yeS5sZW5ndGgsIDAsIDI1NSwgMCkpKVxuICAgICAgc3Ryb2tlV2VpZ2h0KGZsb29yKG1hcChpbmRleCwgdGhpcy5oaXN0b3J5Lmxlbmd0aCwgMCwgdGhpcy5kaWFtZXRlciwgMCkpKVxuICAgICAgbGluZSguLi5sYXN0LCAuLi5wb3MpXG4gICAgICBsYXN0ID0gcG9zXG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZVJlbGVhc2VkKCkge1xuICAgIGNvbnN0IHN0cm9rZSA9IHtcbiAgICAgIGNvbG9yOiBjb2xvcigyNTUpLFxuICAgICAgd2VpZ2h0OiB0aGlzLmRpYW1ldGVyIC8gNCxcbiAgICB9XG4gICAgY29uc3QgaGFsbyA9IG5ldyBDaXJjbGUobW91c2VYLCBtb3VzZVksIDAsIHtcbiAgICAgIGZpbGw6IGZhbHNlLFxuICAgICAgc3Ryb2tlLFxuICAgIH0pXG5cbiAgICB0aGlzLmFkZENoaWxkKFxuICAgICAgbmV3IEFuaW1hdGlvbih7XG4gICAgICAgIGZyb206IDAsXG4gICAgICAgIHRvOiB0aGlzLmRpYW1ldGVyICogNSxcbiAgICAgICAgZHVyYXRpb246IDIwMCxcbiAgICAgICAgZWFzaW5nOiBlYXNpbmdTZXQuZWFzZU91dFF1YXJ0LFxuICAgICAgICBvblNldHVwOiAoKSA9PiB0aGlzLmFkZENoaWxkKGhhbG8pLFxuICAgICAgICBvblVwZGF0ZTogKHZhbHVlKSA9PiB7XG4gICAgICAgICAgaGFsby5kaWFtZXRlciA9IHZhbHVlXG4gICAgICAgICAgc3Ryb2tlLmNvbG9yID0gY29sb3IoXG4gICAgICAgICAgICAyNTUsXG4gICAgICAgICAgICAoKHRoaXMuZGlhbWV0ZXIgKiA1IC0gdmFsdWUpIC8gKHRoaXMuZGlhbWV0ZXIgKiA1KSkgKiAyNTVcbiAgICAgICAgICApXG4gICAgICAgIH0sXG4gICAgICAgIG9uVGVhcmRvd246ICgpID0+IHRoaXMucmVtb3ZlQ2hpbGQoaGFsbyksXG4gICAgICB9KVxuICAgIClcbiAgfVxufVxuIiwgImltcG9ydCB7IENpcmNsZSB9IGZyb20gXCJAZ2hvbS9lbnRpdHktcDVcIlxuaW1wb3J0IHsgZ2FtZSB9IGZyb20gXCIuL2dhbWVcIlxuXG5leHBvcnQgY2xhc3MgQmFsbG9vbiBleHRlbmRzIENpcmNsZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHJhbmRvbSgwLCB3aWR0aCksIHJhbmRvbSgwLCBoZWlnaHQpLCByYW5kb20oNDAsIDYwKSwge1xuICAgICAgZmlsbDogY29sb3IocmFuZG9tKDEwMCwgMjAwKSwgcmFuZG9tKDEwMCwgMjAwKSwgcmFuZG9tKDEwMCwgMjAwKSksXG4gICAgICBzdHJva2U6IGZhbHNlLFxuICAgIH0pXG4gIH1cblxuICBvblVwZGF0ZSgpIHtcbiAgICBpZiAodGhpcy5pc0hvdmVyZWQpIHtcbiAgICAgIHRoaXMuc2V0dGluZ3Muc3Ryb2tlID0ge1xuICAgICAgICBjb2xvcjogY29sb3IoMjU1KSxcbiAgICAgICAgd2VpZ2h0OiA1LFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldHRpbmdzLnN0cm9rZSA9IGZhbHNlXG4gICAgfVxuICB9XG5cbiAgb25UZWFyZG93bigpIHtcbiAgICBnYW1lLnNjb3JlKytcbiAgfVxuXG4gIG9uTW91c2VSZWxlYXNlZCgpIHtcbiAgICBpZiAodGhpcy5pc0hvdmVyZWQpIHtcbiAgICAgIGlmICh0aGlzLnBhcmVudC5jaGlsZHJlbi5sZW5ndGggPiAxKVxuICAgICAgICB0aGlzLnBhcmVudC5zdG9wVHJhbnNtaXNzaW9uKFwibW91c2VSZWxlYXNlZFwiKVxuXG4gICAgICB0aGlzLnBhcmVudC5hZGRDaGlsZChuZXcgQmFsbG9vbigpKVxuICAgICAgdGhpcy50ZWFyZG93bigpXG4gICAgfVxuICB9XG59XG4iLCAiaW1wb3J0IHsgQmFsbG9vbiB9IGZyb20gXCIuL2JhbGxvb25cIlxuaW1wb3J0IHsgQmFzZSB9IGZyb20gXCJAZ2hvbS9lbnRpdHktcDVcIlxuXG5leHBvcnQgY2xhc3MgQmFsbG9vbnMgZXh0ZW5kcyBCYXNlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjb3VudDogbnVtYmVyKSB7XG4gICAgc3VwZXIoKVxuICB9XG5cbiAgb25TZXR1cCgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY291bnQ7IGkrKykge1xuICAgICAgdGhpcy5hZGRDaGlsZChuZXcgQmFsbG9vbigpKVxuICAgIH1cbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7OztBQ0FPLGdCQUNMLEdBQ0EsUUFDQSxPQUNBLFFBQ0EsT0FDQSxlQUFlLE9BQ2Y7QUFDQSxVQUFNLFNBQVcsS0FBSSxVQUFXLFNBQVEsVUFBWSxTQUFRLFVBQVU7QUFDdEUsUUFBSSxDQUFDLGNBQWM7QUFDakIsYUFBTztBQUFBO0FBRVQsUUFBSSxTQUFTLE9BQU87QUFDbEIsYUFBTyxVQUFVLFFBQVEs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
