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
        throw new Error("Entity is already setup");
      }
    }
    update() {
      _Entity.frameCount++;
      if (this.isSetup) {
        this.onUpdate();
        this.transmit("update");
      } else {
        throw new Error("update is called before setup");
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
      return `${" ".repeat(indentation).repeat(depth)}${index === null ? "" : `${index} - `}${this.constructor.name}${this._children.size > 0 ? ` (children: ${this.children.length})${this._listeners.length > 0 ? ` (listeners: ${this._listeners.length})` : ""}
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
      var _a, _b, _c, _d;
      (_b = (_a = this.settings).onSetup) == null ? void 0 : _b.call(_a);
      super.onSetup();
      (_d = (_c = this.settings).onUpdate) == null ? void 0 : _d.call(_c, this.settings.from);
    }
    onUpdate() {
      var _a, _b;
      if (Entity.frameCount - this._startFrame >= this.settings.duration) {
        this.teardown();
      } else {
        (_b = (_a = this.settings).onUpdate) == null ? void 0 : _b.call(_a, map2(this.easing((Entity.frameCount - this._startFrame) / this.settings.duration), 0, 1, this.settings.from, this.settings.to));
      }
    }
    onTeardown() {
      var _a, _b, _c, _d;
      (_b = (_a = this.settings).onUpdate) == null ? void 0 : _b.call(_a, this.settings.to);
      (_d = (_c = this.settings).onTeardown) == null ? void 0 : _d.call(_c);
    }
  };

  // node_modules/@ghom/entity-p5/src/app/base.ts
  var Base = class extends Entity {
    constructor() {
      super(...arguments);
      this._children = /* @__PURE__ */ new Set();
    }
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
        this.onDraw();
        this.transmit("draw");
      } else {
        throw new Error("draw is called before setup");
      }
    }
    mousePressed() {
      if (this.isSetup) {
        this.onMousePressed();
        this.transmit("mousePressed");
      } else {
        throw new Error("mousePressed is called before setup");
      }
    }
    mouseReleased() {
      if (this.isSetup) {
        this.onMouseReleased();
        this.transmit("mouseReleased");
      } else {
        throw new Error("mousePressed is called before setup");
      }
    }
    keyPressed() {
      if (this.isSetup) {
        this.onKeyPressed();
        this.transmit("keyPressed");
      } else {
        throw new Error("keyPressed is called before setup");
      }
    }
    keyReleased() {
      if (this.isSetup) {
        this.onKeyReleased();
        this.transmit("keyReleased");
      } else {
        throw new Error("keyReleased is called before setup");
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
          duration: 20,
          onSetup: () => {
            this.addChild(text2);
          },
          onDraw: (value) => {
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2luZGV4LnRzIiwgIm5vZGVfbW9kdWxlcy9AZ2hvbS9lbnRpdHktYmFzZS9zcmMvYXBwL3V0aWwudHMiLCAibm9kZV9tb2R1bGVzL0BnaG9tL2VudGl0eS1iYXNlL3NyYy9hcHAvZW50aXR5LnRzIiwgIm5vZGVfbW9kdWxlcy9AZ2hvbS9lbnRpdHktYmFzZS9zcmMvYXBwL2Vhc2luZy50cyIsICJub2RlX21vZHVsZXMvQGdob20vZW50aXR5LWJhc2Uvc3JjL2FwcC9hbmltYXRpb24udHMiLCAibm9kZV9tb2R1bGVzL0BnaG9tL2VudGl0eS1wNS9zcmMvYXBwL2Jhc2UudHMiLCAibm9kZV9tb2R1bGVzL0BnaG9tL2VudGl0eS1wNS9zcmMvYXBwL2RyYXdhYmxlLnRzIiwgIm5vZGVfbW9kdWxlcy9AZ2hvbS9lbnRpdHktcDUvc3JjL2FwcC9zaGFwZS50cyIsICJzcmMvYXBwL2dhbWUudHMiLCAic3JjL2FwcC9jdXJzb3IudHMiLCAic3JjL2FwcC9iYWxsb29uLnRzIiwgInNyYy9hcHAvYmFsbG9vbnMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vLyBAdHMtY2hlY2tcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvQHR5cGVzL3A1L2dsb2JhbC5kLnRzXCIgLz5cblxuaW1wb3J0IHsgZ2FtZSB9IGZyb20gXCIuL2FwcC9nYW1lXCJcbmltcG9ydCB7IEN1cnNvciB9IGZyb20gXCIuL2FwcC9jdXJzb3JcIlxuaW1wb3J0IHsgQmFsbG9vbnMgfSBmcm9tIFwiLi9hcHAvYmFsbG9vbnNcIlxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgKGV2ZW50KSA9PiBldmVudC5wcmV2ZW50RGVmYXVsdCgpKVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0dXAoKSB7XG4gIGNyZWF0ZUNhbnZhcyhcbiAgICBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsIHdpbmRvdy5pbm5lcldpZHRoIHx8IDApLFxuICAgIE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKVxuICApXG5cbiAgZ2FtZS5hZGRDaGlsZChuZXcgQmFsbG9vbnMoMSkpXG4gIGdhbWUuYWRkQ2hpbGQobmV3IEN1cnNvcigpKVxuXG4gIGdhbWUuc2V0dXAoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZHJhdygpIHtcbiAgYmFja2dyb3VuZCgyMClcblxuICBnYW1lLmRyYXcoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlKHRpbWVzdGFtcDogbnVtYmVyKSB7XG4gIGdhbWUudXBkYXRlKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGtleVByZXNzZWQoKSB7fVxuZXhwb3J0IGZ1bmN0aW9uIGtleVJlbGVhc2VkKCkge31cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZVByZXNzZWQoKSB7XG4gIGdhbWUubW91c2VQcmVzc2VkKClcbn1cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZVJlbGVhc2VkKCkge1xuICBnYW1lLm1vdXNlUmVsZWFzZWQoKVxufVxuXG4vKipcbiAqIGRlYnVnIGltcG9ydHMgKGFjY2Vzc2libGUgZnJvbSBmcm9udGVuZCBjb25zb2xlIHdpdGggYGFwcC5yb290YClcbiAqL1xuZXhwb3J0IGNvbnN0IHJvb3QgPSBnYW1lXG4iLCAiZXhwb3J0IGZ1bmN0aW9uIG1hcChcbiAgbjogbnVtYmVyLFxuICBzdGFydDE6IG51bWJlcixcbiAgc3RvcDE6IG51bWJlcixcbiAgc3RhcnQyOiBudW1iZXIsXG4gIHN0b3AyOiBudW1iZXIsXG4gIHdpdGhpbkJvdW5kcyA9IGZhbHNlXG4pIHtcbiAgY29uc3Qgb3V0cHV0ID0gKChuIC0gc3RhcnQxKSAvIChzdG9wMSAtIHN0YXJ0MSkpICogKHN0b3AyIC0gc3RhcnQyKSArIHN0YXJ0MlxuICBpZiAoIXdpdGhpbkJvdW5kcykge1xuICAgIHJldHVybiBvdXRwdXRcbiAgfVxuICBpZiAoc3RhcnQyIDwgc3RvcDIpIHtcbiAgICByZXR1cm4gY29uc3RyYWluKG91dHB1dCwgc3RhcnQyLCBzdG9wMilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gY29uc3RyYWluKG91dHB1dCwgc3RvcDIsIHN0YXJ0MilcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29uc3RyYWluKG46IG51bWJlciwgbG93OiBudW1iZXIsIGhpZ2g6IG51bWJlcikge1xuICByZXR1cm4gTWF0aC5tYXgoTWF0aC5taW4obiwgaGlnaCksIGxvdylcbn1cbiIsICJleHBvcnQgdHlwZSBFbnRpdHlMaXN0ZW5lcjxUaGlzIGV4dGVuZHMgRW50aXR5PiA9IChcbiAgdGhpczogVGhpcyxcbiAgaXQ6IFRoaXNcbikgPT4gdW5rbm93blxuXG5leHBvcnQgdHlwZSBFbnRpdHlSZXNvbHZhYmxlID0gRW50aXR5IHwgKCgpID0+IEVudGl0eSlcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEVudGl0eSB7XG4gIHN0YXRpYyBmcmFtZUNvdW50ID0gMFxuICBzdGF0aWMgcmVzb2x2ZShlbnRpdHk6IEVudGl0eVJlc29sdmFibGUpIHtcbiAgICByZXR1cm4gdHlwZW9mIGVudGl0eSA9PT0gXCJmdW5jdGlvblwiID8gZW50aXR5KCkgOiBlbnRpdHlcbiAgfVxuXG4gIHByb3RlY3RlZCBfc3RhcnRGcmFtZSA9IDBcbiAgcHJvdGVjdGVkIF9pc1NldHVwID0gZmFsc2VcbiAgcHJvdGVjdGVkIF9jaGlsZHJlbiA9IG5ldyBTZXQ8RW50aXR5PigpXG4gIHByb3RlY3RlZCBfcGFyZW50PzogRW50aXR5XG4gIHByb3RlY3RlZCBfbGlzdGVuZXJzOiBFbnRpdHlMaXN0ZW5lcjx0aGlzPltdID0gW11cbiAgcHJvdGVjdGVkIF9zdG9wUG9pbnRzOiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPiA9IHt9XG5cbiAgZ2V0IGlzU2V0dXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lzU2V0dXBcbiAgfVxuXG4gIGdldCBjaGlsZHJlbigpOiBBcnJheTxFbnRpdHk+IHtcbiAgICByZXR1cm4gWy4uLnRoaXMuX2NoaWxkcmVuXVxuICB9XG5cbiAgZ2V0IHBhcmVudCgpOiBFbnRpdHkgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnRcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXByZXNlbnQgYW55IHN0YXRlLWJhc2VkIGVudGl0eVxuICAgKi9cbiAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25TZXR1cCgpIHt9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcbiAgICovXG4gIG9uVXBkYXRlKCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25UZWFyZG93bigpIHt9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxuICAgKi9cbiAgcHVibGljIHNldHVwKCkge1xuICAgIHRoaXMuX3N0YXJ0RnJhbWUgPSBFbnRpdHkuZnJhbWVDb3VudFxuICAgIGlmICghdGhpcy5pc1NldHVwKSB7XG4gICAgICB0aGlzLm9uU2V0dXAoKVxuICAgICAgdGhpcy50cmFuc21pdChcInNldHVwXCIpXG4gICAgICB0aGlzLl9pc1NldHVwID0gdHJ1ZVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbnRpdHkgaXMgYWxyZWFkeSBzZXR1cFwiKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cbiAgICogU2hvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiFcbiAgICovXG4gIHB1YmxpYyB1cGRhdGUoKSB7XG4gICAgRW50aXR5LmZyYW1lQ291bnQrK1xuICAgIGlmICh0aGlzLmlzU2V0dXApIHtcbiAgICAgIHRoaXMub25VcGRhdGUoKVxuICAgICAgdGhpcy50cmFuc21pdChcInVwZGF0ZVwiKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1cGRhdGUgaXMgY2FsbGVkIGJlZm9yZSBzZXR1cFwiKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cbiAgICogU2hvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiFcbiAgICovXG4gIHB1YmxpYyB0ZWFyZG93bigpIHtcbiAgICBpZiAodGhpcy5pc1NldHVwKSB7XG4gICAgICB0aGlzLl9pc1NldHVwID0gZmFsc2VcbiAgICAgIHRoaXMub25UZWFyZG93bigpXG4gICAgICB0aGlzLl9wYXJlbnQ/LnJlbW92ZUNoaWxkKHRoaXMpXG4gICAgICB0aGlzLnRyYW5zbWl0KFwidGVhcmRvd25cIilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRW50aXR5IG11c3QgYmUgc2V0dXAgYmVmb3JlXCIpXG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uKG5hbWU6IHN0cmluZywgbGlzdGVuZXI6IEVudGl0eUxpc3RlbmVyPHRoaXM+KSB7XG4gICAgdGhpcy5fbGlzdGVuZXJzLnB1c2goXG4gICAgICB7XG4gICAgICAgIFtuYW1lXSgpIHtcbiAgICAgICAgICBsaXN0ZW5lci5iaW5kKHRoaXMpKHRoaXMpXG4gICAgICAgIH0sXG4gICAgICB9W25hbWVdLmJpbmQodGhpcylcbiAgICApXG4gIH1cblxuICBwdWJsaWMgYWRkQ2hpbGQoLi4uY2hpbGRyZW46IEVudGl0eVtdKSB7XG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgICAgY2hpbGQuX3BhcmVudCA9IHRoaXNcbiAgICAgIHRoaXMuX2NoaWxkcmVuLmFkZChjaGlsZClcbiAgICAgIGlmICh0aGlzLmlzU2V0dXApIGNoaWxkLnNldHVwKClcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVtb3ZlQ2hpbGQoLi4uY2hpbGRyZW46IEVudGl0eVtdKSB7XG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgICAgaWYgKGNoaWxkLmlzU2V0dXApIGNoaWxkLnRlYXJkb3duKClcbiAgICAgIGVsc2UgdGhpcy5fY2hpbGRyZW4uZGVsZXRlKGNoaWxkKVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzdG9wVHJhbnNtaXNzaW9uKG5hbWU6IHN0cmluZykge1xuICAgIHRoaXMuX3N0b3BQb2ludHNbbmFtZV0gPSB0cnVlXG4gIH1cblxuICBwdWJsaWMgdHJhbnNtaXQobmFtZTogc3RyaW5nKSB7XG4gICAgZm9yIChjb25zdCBsaXN0ZW5lciBvZiB0aGlzLmdldExpc3RlbmVyc0J5TmFtZShuYW1lKSlcbiAgICAgIGxpc3RlbmVyLmJpbmQodGhpcykodGhpcylcblxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikge1xuICAgICAgaWYgKHRoaXMuX3N0b3BQb2ludHNbbmFtZV0pIHtcbiAgICAgICAgdGhpcy5fc3RvcFBvaW50c1tuYW1lXSA9IGZhbHNlXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBpZiAobmFtZSBpbiBjaGlsZCAmJiB0eXBlb2YgY2hpbGRbbmFtZV0gPT09IFwiZnVuY3Rpb25cIikgY2hpbGRbbmFtZV0oKVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRMaXN0ZW5lcnNCeU5hbWUobmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xpc3RlbmVycy5maWx0ZXIoKGxpc3RlbmVyKSA9PiB7XG4gICAgICByZXR1cm4gbGlzdGVuZXIubmFtZSA9PT0gbmFtZVxuICAgIH0pXG4gIH1cblxuICBwdWJsaWMgc2NoZW1hKFxuICAgIGluZGVudGF0aW9uID0gMixcbiAgICBkZXB0aCA9IDAsXG4gICAgaW5kZXg6IG51bWJlciB8IG51bGwgPSBudWxsXG4gICk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAke1wiIFwiLnJlcGVhdChpbmRlbnRhdGlvbikucmVwZWF0KGRlcHRoKX0ke1xuICAgICAgaW5kZXggPT09IG51bGwgPyBcIlwiIDogYCR7aW5kZXh9IC0gYFxuICAgIH0ke3RoaXMuY29uc3RydWN0b3IubmFtZX0ke1xuICAgICAgdGhpcy5fY2hpbGRyZW4uc2l6ZSA+IDBcbiAgICAgICAgPyBgIChjaGlsZHJlbjogJHt0aGlzLmNoaWxkcmVuLmxlbmd0aH0pJHtcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVycy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgID8gYCAobGlzdGVuZXJzOiAke3RoaXMuX2xpc3RlbmVycy5sZW5ndGh9KWBcbiAgICAgICAgICAgICAgOiBcIlwiXG4gICAgICAgICAgfVxcbiR7dGhpcy5jaGlsZHJlblxuICAgICAgICAgICAgLm1hcChcbiAgICAgICAgICAgICAgKGNoaWxkLCBpbmRleCkgPT4gYCR7Y2hpbGQuc2NoZW1hKGluZGVudGF0aW9uLCBkZXB0aCArIDEsIGluZGV4KX1gXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuam9pbihcIlxcblwiKX1gXG4gICAgICAgIDogXCJcIlxuICAgIH1gXG4gIH1cbn1cbiIsICIvLyBzb3VyY2U6IGh0dHBzOi8vZ2l0aHViLmNvbS9haS9lYXNpbmdzLm5ldC9ibG9iL21hc3Rlci9zcmMvZWFzaW5ncy9lYXNpbmdzRnVuY3Rpb25zLnRzXG5cbmV4cG9ydCB0eXBlIEVhc2luZ0Z1bmN0aW9uID0gKHByb2dyZXNzOiBudW1iZXIpID0+IG51bWJlclxuXG5leHBvcnQgdHlwZSBFYXNpbmdOYW1lID1cbiAgfCBcImxpbmVhclwiXG4gIHwgXCJlYXNlSW5RdWFkXCJcbiAgfCBcImVhc2VPdXRRdWFkXCJcbiAgfCBcImVhc2VJbk91dFF1YWRcIlxuICB8IFwiZWFzZUluQ3ViaWNcIlxuICB8IFwiZWFzZU91dEN1YmljXCJcbiAgfCBcImVhc2VJbk91dEN1YmljXCJcbiAgfCBcImVhc2VJblF1YXJ0XCJcbiAgfCBcImVhc2VPdXRRdWFydFwiXG4gIHwgXCJlYXNlSW5PdXRRdWFydFwiXG4gIHwgXCJlYXNlSW5RdWludFwiXG4gIHwgXCJlYXNlT3V0UXVpbnRcIlxuICB8IFwiZWFzZUluT3V0UXVpbnRcIlxuICB8IFwiZWFzZUluU2luZVwiXG4gIHwgXCJlYXNlT3V0U2luZVwiXG4gIHwgXCJlYXNlSW5PdXRTaW5lXCJcbiAgfCBcImVhc2VJbkV4cG9cIlxuICB8IFwiZWFzZU91dEV4cG9cIlxuICB8IFwiZWFzZUluT3V0RXhwb1wiXG4gIHwgXCJlYXNlSW5DaXJjXCJcbiAgfCBcImVhc2VPdXRDaXJjXCJcbiAgfCBcImVhc2VJbk91dENpcmNcIlxuICB8IFwiZWFzZUluQmFja1wiXG4gIHwgXCJlYXNlT3V0QmFja1wiXG4gIHwgXCJlYXNlSW5PdXRCYWNrXCJcbiAgfCBcImVhc2VJbkVsYXN0aWNcIlxuICB8IFwiZWFzZU91dEVsYXN0aWNcIlxuICB8IFwiZWFzZUluT3V0RWxhc3RpY1wiXG4gIHwgXCJlYXNlSW5Cb3VuY2VcIlxuICB8IFwiZWFzZU91dEJvdW5jZVwiXG4gIHwgXCJlYXNlSW5PdXRCb3VuY2VcIlxuXG5jb25zdCBQSSA9IE1hdGguUElcbmNvbnN0IGMxID0gMS43MDE1OFxuY29uc3QgYzIgPSBjMSAqIDEuNTI1XG5jb25zdCBjMyA9IGMxICsgMVxuY29uc3QgYzQgPSAoMiAqIFBJKSAvIDNcbmNvbnN0IGM1ID0gKDIgKiBQSSkgLyA0LjVcblxuY29uc3QgYm91bmNlT3V0OiBFYXNpbmdGdW5jdGlvbiA9IGZ1bmN0aW9uICh4KSB7XG4gIGNvbnN0IG4xID0gNy41NjI1XG4gIGNvbnN0IGQxID0gMi43NVxuXG4gIGlmICh4IDwgMSAvIGQxKSB7XG4gICAgcmV0dXJuIG4xICogeCAqIHhcbiAgfSBlbHNlIGlmICh4IDwgMiAvIGQxKSB7XG4gICAgcmV0dXJuIG4xICogKHggLT0gMS41IC8gZDEpICogeCArIDAuNzVcbiAgfSBlbHNlIGlmICh4IDwgMi41IC8gZDEpIHtcbiAgICByZXR1cm4gbjEgKiAoeCAtPSAyLjI1IC8gZDEpICogeCArIDAuOTM3NVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBuMSAqICh4IC09IDIuNjI1IC8gZDEpICogeCArIDAuOTg0Mzc1XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGVhc2luZ1NldDogUmVjb3JkPEVhc2luZ05hbWUsIEVhc2luZ0Z1bmN0aW9uPiA9IHtcbiAgbGluZWFyOiAoeCkgPT4geCxcbiAgZWFzZUluUXVhZDogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4geCAqIHhcbiAgfSxcbiAgZWFzZU91dFF1YWQ6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIDEgLSAoMSAtIHgpICogKDEgLSB4KVxuICB9LFxuICBlYXNlSW5PdXRRdWFkOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4IDwgMC41ID8gMiAqIHggKiB4IDogMSAtIE1hdGgucG93KC0yICogeCArIDIsIDIpIC8gMlxuICB9LFxuICBlYXNlSW5DdWJpYzogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4geCAqIHggKiB4XG4gIH0sXG4gIGVhc2VPdXRDdWJpYzogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gMSAtIE1hdGgucG93KDEgLSB4LCAzKVxuICB9LFxuICBlYXNlSW5PdXRDdWJpYzogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4geCA8IDAuNSA/IDQgKiB4ICogeCAqIHggOiAxIC0gTWF0aC5wb3coLTIgKiB4ICsgMiwgMykgLyAyXG4gIH0sXG4gIGVhc2VJblF1YXJ0OiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4ICogeCAqIHggKiB4XG4gIH0sXG4gIGVhc2VPdXRRdWFydDogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gMSAtIE1hdGgucG93KDEgLSB4LCA0KVxuICB9LFxuICBlYXNlSW5PdXRRdWFydDogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4geCA8IDAuNSA/IDggKiB4ICogeCAqIHggKiB4IDogMSAtIE1hdGgucG93KC0yICogeCArIDIsIDQpIC8gMlxuICB9LFxuICBlYXNlSW5RdWludDogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4geCAqIHggKiB4ICogeCAqIHhcbiAgfSxcbiAgZWFzZU91dFF1aW50OiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiAxIC0gTWF0aC5wb3coMSAtIHgsIDUpXG4gIH0sXG4gIGVhc2VJbk91dFF1aW50OiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4IDwgMC41ID8gMTYgKiB4ICogeCAqIHggKiB4ICogeCA6IDEgLSBNYXRoLnBvdygtMiAqIHggKyAyLCA1KSAvIDJcbiAgfSxcbiAgZWFzZUluU2luZTogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gMSAtIE1hdGguY29zKCh4ICogUEkpIC8gMilcbiAgfSxcbiAgZWFzZU91dFNpbmU6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIE1hdGguc2luKCh4ICogUEkpIC8gMilcbiAgfSxcbiAgZWFzZUluT3V0U2luZTogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gLShNYXRoLmNvcyhQSSAqIHgpIC0gMSkgLyAyXG4gIH0sXG4gIGVhc2VJbkV4cG86IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggPT09IDAgPyAwIDogTWF0aC5wb3coMiwgMTAgKiB4IC0gMTApXG4gIH0sXG4gIGVhc2VPdXRFeHBvOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4ID09PSAxID8gMSA6IDEgLSBNYXRoLnBvdygyLCAtMTAgKiB4KVxuICB9LFxuICBlYXNlSW5PdXRFeHBvOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4ID09PSAwXG4gICAgICA/IDBcbiAgICAgIDogeCA9PT0gMVxuICAgICAgPyAxXG4gICAgICA6IHggPCAwLjVcbiAgICAgID8gTWF0aC5wb3coMiwgMjAgKiB4IC0gMTApIC8gMlxuICAgICAgOiAoMiAtIE1hdGgucG93KDIsIC0yMCAqIHggKyAxMCkpIC8gMlxuICB9LFxuICBlYXNlSW5DaXJjOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiAxIC0gTWF0aC5zcXJ0KDEgLSBNYXRoLnBvdyh4LCAyKSlcbiAgfSxcbiAgZWFzZU91dENpcmM6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIE1hdGguc3FydCgxIC0gTWF0aC5wb3coeCAtIDEsIDIpKVxuICB9LFxuICBlYXNlSW5PdXRDaXJjOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4IDwgMC41XG4gICAgICA/ICgxIC0gTWF0aC5zcXJ0KDEgLSBNYXRoLnBvdygyICogeCwgMikpKSAvIDJcbiAgICAgIDogKE1hdGguc3FydCgxIC0gTWF0aC5wb3coLTIgKiB4ICsgMiwgMikpICsgMSkgLyAyXG4gIH0sXG4gIGVhc2VJbkJhY2s6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIGMzICogeCAqIHggKiB4IC0gYzEgKiB4ICogeFxuICB9LFxuICBlYXNlT3V0QmFjazogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gMSArIGMzICogTWF0aC5wb3coeCAtIDEsIDMpICsgYzEgKiBNYXRoLnBvdyh4IC0gMSwgMilcbiAgfSxcbiAgZWFzZUluT3V0QmFjazogZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4geCA8IDAuNVxuICAgICAgPyAoTWF0aC5wb3coMiAqIHgsIDIpICogKChjMiArIDEpICogMiAqIHggLSBjMikpIC8gMlxuICAgICAgOiAoTWF0aC5wb3coMiAqIHggLSAyLCAyKSAqICgoYzIgKyAxKSAqICh4ICogMiAtIDIpICsgYzIpICsgMikgLyAyXG4gIH0sXG4gIGVhc2VJbkVsYXN0aWM6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggPT09IDBcbiAgICAgID8gMFxuICAgICAgOiB4ID09PSAxXG4gICAgICA/IDFcbiAgICAgIDogLU1hdGgucG93KDIsIDEwICogeCAtIDEwKSAqIE1hdGguc2luKCh4ICogMTAgLSAxMC43NSkgKiBjNClcbiAgfSxcbiAgZWFzZU91dEVsYXN0aWM6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggPT09IDBcbiAgICAgID8gMFxuICAgICAgOiB4ID09PSAxXG4gICAgICA/IDFcbiAgICAgIDogTWF0aC5wb3coMiwgLTEwICogeCkgKiBNYXRoLnNpbigoeCAqIDEwIC0gMC43NSkgKiBjNCkgKyAxXG4gIH0sXG4gIGVhc2VJbk91dEVsYXN0aWM6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHggPT09IDBcbiAgICAgID8gMFxuICAgICAgOiB4ID09PSAxXG4gICAgICA/IDFcbiAgICAgIDogeCA8IDAuNVxuICAgICAgPyAtKE1hdGgucG93KDIsIDIwICogeCAtIDEwKSAqIE1hdGguc2luKCgyMCAqIHggLSAxMS4xMjUpICogYzUpKSAvIDJcbiAgICAgIDogKE1hdGgucG93KDIsIC0yMCAqIHggKyAxMCkgKiBNYXRoLnNpbigoMjAgKiB4IC0gMTEuMTI1KSAqIGM1KSkgLyAyICsgMVxuICB9LFxuICBlYXNlSW5Cb3VuY2U6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIDEgLSBib3VuY2VPdXQoMSAtIHgpXG4gIH0sXG4gIGVhc2VPdXRCb3VuY2U6IGJvdW5jZU91dCxcbiAgZWFzZUluT3V0Qm91bmNlOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4IDwgMC41XG4gICAgICA/ICgxIC0gYm91bmNlT3V0KDEgLSAyICogeCkpIC8gMlxuICAgICAgOiAoMSArIGJvdW5jZU91dCgyICogeCAtIDEpKSAvIDJcbiAgfSxcbn1cbiIsICJpbXBvcnQgeyBtYXAgfSBmcm9tIFwiLi91dGlsXCJcbmltcG9ydCB7IEVudGl0eSB9IGZyb20gXCIuL2VudGl0eVwiXG5pbXBvcnQgeyBFYXNpbmdGdW5jdGlvbiwgZWFzaW5nU2V0IH0gZnJvbSBcIi4vZWFzaW5nXCJcblxuZXhwb3J0IGludGVyZmFjZSBBbmltYXRpb25TZXR0aW5ncyB7XG4gIGZyb206IG51bWJlclxuICB0bzogbnVtYmVyXG4gIC8qKlxuICAgKiBBbmltYXRpb24gZHVyYXRpb24gaW4gKipmcmFtZSBjb3VudCoqIVxuICAgKi9cbiAgZHVyYXRpb246IG51bWJlclxuICBlYXNpbmc/OiBFYXNpbmdGdW5jdGlvblxuICBvblNldHVwPzogKCkgPT4gdW5rbm93blxuICBvblVwZGF0ZT86ICh2YWx1ZTogbnVtYmVyKSA9PiB1bmtub3duXG4gIG9uVGVhcmRvd24/OiAoKSA9PiB1bmtub3duXG59XG5cbi8qKlxuICogRXF1aXZhbGVudCBvZiBUd2VlblxuICovXG5leHBvcnQgY2xhc3MgQW5pbWF0aW9uIGV4dGVuZHMgRW50aXR5IHtcbiAgcHJpdmF0ZSByZWFkb25seSBlYXNpbmc6IEVhc2luZ0Z1bmN0aW9uXG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzZXR0aW5nczogQW5pbWF0aW9uU2V0dGluZ3MpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5lYXNpbmcgPSBzZXR0aW5ncy5lYXNpbmcgPz8gZWFzaW5nU2V0LmxpbmVhclxuICB9XG5cbiAgb25TZXR1cCgpIHtcbiAgICB0aGlzLnNldHRpbmdzLm9uU2V0dXA/LigpXG4gICAgc3VwZXIub25TZXR1cCgpXG4gICAgdGhpcy5zZXR0aW5ncy5vblVwZGF0ZT8uKHRoaXMuc2V0dGluZ3MuZnJvbSlcbiAgfVxuXG4gIG9uVXBkYXRlKCkge1xuICAgIGlmIChFbnRpdHkuZnJhbWVDb3VudCAtIHRoaXMuX3N0YXJ0RnJhbWUgPj0gdGhpcy5zZXR0aW5ncy5kdXJhdGlvbikge1xuICAgICAgdGhpcy50ZWFyZG93bigpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0dGluZ3Mub25VcGRhdGU/LihcbiAgICAgICAgbWFwKFxuICAgICAgICAgIHRoaXMuZWFzaW5nKFxuICAgICAgICAgICAgKEVudGl0eS5mcmFtZUNvdW50IC0gdGhpcy5fc3RhcnRGcmFtZSkgLyB0aGlzLnNldHRpbmdzLmR1cmF0aW9uXG4gICAgICAgICAgKSxcbiAgICAgICAgICAwLFxuICAgICAgICAgIDEsXG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy5mcm9tLFxuICAgICAgICAgIHRoaXMuc2V0dGluZ3MudG9cbiAgICAgICAgKVxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIG9uVGVhcmRvd24oKSB7XG4gICAgdGhpcy5zZXR0aW5ncy5vblVwZGF0ZT8uKHRoaXMuc2V0dGluZ3MudG8pXG4gICAgdGhpcy5zZXR0aW5ncy5vblRlYXJkb3duPy4oKVxuICB9XG59XG4iLCAiaW1wb3J0IHsgRW50aXR5IH0gZnJvbSBcIkBnaG9tL2VudGl0eS1iYXNlXCJcblxuZXhwb3J0IGNsYXNzIEJhc2UgZXh0ZW5kcyBFbnRpdHkge1xuICBwcm90ZWN0ZWQgX2NoaWxkcmVuID0gbmV3IFNldDxFbnRpdHk+KClcbiAgcHJvdGVjdGVkIF96SW5kZXg/OiBudW1iZXJcblxuICBnZXQgekluZGV4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3pJbmRleCA/PyB0aGlzLnBhcmVudD8uY2hpbGRyZW4uaW5kZXhPZih0aGlzKSA/PyAwXG4gIH1cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25EcmF3KCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25Nb3VzZVJlbGVhc2VkKCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25Nb3VzZVByZXNzZWQoKSB7fVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIGJlIG92ZXJ3cml0dGVuIGJ5IHlvdXIgb3duIHdvcmtpbmdzXG4gICAqL1xuICBvbktleVJlbGVhc2VkKCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25LZXlQcmVzc2VkKCkge31cblxuICAvKipcbiAgICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjdXJyZW50IGVudGl0eSBpcyBhIHJvb3QuXG4gICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXG4gICAqL1xuICBwdWJsaWMgZHJhdygpIHtcbiAgICBpZiAodGhpcy5pc1NldHVwKSB7XG4gICAgICB0aGlzLm9uRHJhdygpXG4gICAgICB0aGlzLnRyYW5zbWl0KFwiZHJhd1wiKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJkcmF3IGlzIGNhbGxlZCBiZWZvcmUgc2V0dXBcIilcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjdXJyZW50IGVudGl0eSBpcyBhIHJvb3QuXG4gICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXG4gICAqL1xuICBwdWJsaWMgbW91c2VQcmVzc2VkKCkge1xuICAgIGlmICh0aGlzLmlzU2V0dXApIHtcbiAgICAgIHRoaXMub25Nb3VzZVByZXNzZWQoKVxuICAgICAgdGhpcy50cmFuc21pdChcIm1vdXNlUHJlc3NlZFwiKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJtb3VzZVByZXNzZWQgaXMgY2FsbGVkIGJlZm9yZSBzZXR1cFwiKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cbiAgICogU2hvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiFcbiAgICovXG4gIHB1YmxpYyBtb3VzZVJlbGVhc2VkKCkge1xuICAgIGlmICh0aGlzLmlzU2V0dXApIHtcbiAgICAgIHRoaXMub25Nb3VzZVJlbGVhc2VkKClcbiAgICAgIHRoaXMudHJhbnNtaXQoXCJtb3VzZVJlbGVhc2VkXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIm1vdXNlUHJlc3NlZCBpcyBjYWxsZWQgYmVmb3JlIHNldHVwXCIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxuICAgKi9cbiAgcHVibGljIGtleVByZXNzZWQoKSB7XG4gICAgaWYgKHRoaXMuaXNTZXR1cCkge1xuICAgICAgdGhpcy5vbktleVByZXNzZWQoKVxuICAgICAgdGhpcy50cmFuc21pdChcImtleVByZXNzZWRcIilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwia2V5UHJlc3NlZCBpcyBjYWxsZWQgYmVmb3JlIHNldHVwXCIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxuICAgKi9cbiAgcHVibGljIGtleVJlbGVhc2VkKCkge1xuICAgIGlmICh0aGlzLmlzU2V0dXApIHtcbiAgICAgIHRoaXMub25LZXlSZWxlYXNlZCgpXG4gICAgICB0aGlzLnRyYW5zbWl0KFwia2V5UmVsZWFzZWRcIilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwia2V5UmVsZWFzZWQgaXMgY2FsbGVkIGJlZm9yZSBzZXR1cFwiKVxuICAgIH1cbiAgfVxufVxuIiwgImltcG9ydCAqIGFzIHA1IGZyb20gXCJwNVwiXG5pbXBvcnQgeyBCYXNlIH0gZnJvbSBcIi4vYmFzZVwiXG5cbmV4cG9ydCBpbnRlcmZhY2UgRHJhd2FibGVTZXR0aW5ncyB7XG4gIGZpbGw6IGZhbHNlIHwgRmlsbE9wdGlvbnNcbiAgc3Ryb2tlOiBmYWxzZSB8IFN0cm9rZU9wdGlvbnNcbiAgdGV4dFNpemU/OiBudW1iZXJcbiAgdGV4dEFsaWduPzoge1xuICAgIHg/OiBwNS5IT1JJWl9BTElHTlxuICAgIHk/OiBwNS5WRVJUX0FMSUdOXG4gIH1cbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIERyYXdhYmxlIGV4dGVuZHMgQmFzZSB7XG4gIHByb3RlY3RlZCBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc2V0dGluZ3M/OiBEcmF3YWJsZVNldHRpbmdzKSB7XG4gICAgc3VwZXIoKVxuICB9XG5cbiAgb25EcmF3KCkge1xuICAgIGlmICghdGhpcy5zZXR0aW5ncykgcmV0dXJuXG5cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5maWxsKSB7XG4gICAgICBpZiAoXCJjb2xvclwiIGluIHRoaXMuc2V0dGluZ3MuZmlsbCkge1xuICAgICAgICBmaWxsKHRoaXMuc2V0dGluZ3MuZmlsbC5jb2xvcilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbGwodGhpcy5zZXR0aW5ncy5maWxsKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBub0ZpbGwoKVxuICAgIH1cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLnN0cm9rZSkge1xuICAgICAgc3Ryb2tlV2VpZ2h0KHRoaXMuc2V0dGluZ3Muc3Ryb2tlLndlaWdodClcbiAgICAgIHN0cm9rZSh0aGlzLnNldHRpbmdzLnN0cm9rZS5jb2xvcilcbiAgICB9IGVsc2Uge1xuICAgICAgbm9TdHJva2UoKVxuICAgIH1cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLnRleHRBbGlnbikge1xuICAgICAgdGV4dEFsaWduKHRoaXMuc2V0dGluZ3MudGV4dEFsaWduLngsIHRoaXMuc2V0dGluZ3MudGV4dEFsaWduLnkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRleHRBbGlnbihDRU5URVIsIENFTlRFUilcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zZXR0aW5ncy50ZXh0U2l6ZSkge1xuICAgICAgdGV4dFNpemUodGhpcy5zZXR0aW5ncy50ZXh0U2l6ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGV4dFNpemUoaGVpZ2h0ICogMC4xKVxuICAgIH1cbiAgfVxufVxuIiwgImltcG9ydCAqIGFzIHA1IGZyb20gXCJwNVwiXG5pbXBvcnQgeyBEcmF3YWJsZSwgRHJhd2FibGVTZXR0aW5ncyB9IGZyb20gXCIuL2RyYXdhYmxlXCJcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNoYXBlXG4gIGV4dGVuZHMgRHJhd2FibGVcbiAgaW1wbGVtZW50cyBQb3NpdGlvbmFibGUsIFJlc2l6YWJsZVxue1xuICBhYnN0cmFjdCB4OiBudW1iZXJcbiAgYWJzdHJhY3QgeTogbnVtYmVyXG4gIGFic3RyYWN0IHdpZHRoOiBudW1iZXJcbiAgYWJzdHJhY3QgaGVpZ2h0OiBudW1iZXJcbiAgYWJzdHJhY3QgcmVhZG9ubHkgY2VudGVyWDogbnVtYmVyXG4gIGFic3RyYWN0IHJlYWRvbmx5IGNlbnRlclk6IG51bWJlclxuXG4gIGdldCBjZW50ZXIoKTogW3g6IG51bWJlciwgeTogbnVtYmVyXSB7XG4gICAgcmV0dXJuIFt0aGlzLmNlbnRlclgsIHRoaXMuY2VudGVyWV1cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUmVjdCBleHRlbmRzIFNoYXBlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHggPSAwLFxuICAgIHB1YmxpYyB5ID0gMCxcbiAgICBwdWJsaWMgd2lkdGggPSAwLFxuICAgIHB1YmxpYyBoZWlnaHQgPSAwLFxuICAgIG9wdGlvbnM/OiBEcmF3YWJsZVNldHRpbmdzXG4gICkge1xuICAgIHN1cGVyKG9wdGlvbnMpXG4gIH1cblxuICBnZXQgY2VudGVyWCgpIHtcbiAgICByZXR1cm4gdGhpcy54ICsgdGhpcy53aWR0aCAvIDJcbiAgfVxuXG4gIGdldCBjZW50ZXJZKCkge1xuICAgIHJldHVybiB0aGlzLnkgKyB0aGlzLmhlaWdodCAvIDJcbiAgfVxuXG4gIGdldCBpc0hvdmVyZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChcbiAgICAgIG1vdXNlWCA+IHRoaXMueCAmJlxuICAgICAgbW91c2VYIDwgdGhpcy54ICsgdGhpcy53aWR0aCAmJlxuICAgICAgbW91c2VZID4gdGhpcy55ICYmXG4gICAgICBtb3VzZVkgPCB0aGlzLnkgKyB0aGlzLmhlaWdodFxuICAgIClcbiAgfVxuXG4gIG9uRHJhdygpIHtcbiAgICBzdXBlci5vbkRyYXcoKVxuICAgIHJlY3QodGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDaXJjbGUgZXh0ZW5kcyBTaGFwZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyB4ID0gMCxcbiAgICBwdWJsaWMgeSA9IDAsXG4gICAgcHVibGljIGRpYW1ldGVyID0gMCxcbiAgICBvcHRpb25zPzogRHJhd2FibGVTZXR0aW5nc1xuICApIHtcbiAgICBzdXBlcihvcHRpb25zKVxuICB9XG5cbiAgZ2V0IHdpZHRoKCkge1xuICAgIHJldHVybiB0aGlzLmRpYW1ldGVyXG4gIH1cblxuICBnZXQgaGVpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLmRpYW1ldGVyXG4gIH1cblxuICBnZXQgY2VudGVyWCgpIHtcbiAgICByZXR1cm4gdGhpcy54XG4gIH1cblxuICBnZXQgY2VudGVyWSgpIHtcbiAgICByZXR1cm4gdGhpcy55XG4gIH1cblxuICBnZXQgaXNIb3ZlcmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBkaXN0KG1vdXNlWCwgbW91c2VZLCB0aGlzLngsIHRoaXMueSkgPCB0aGlzLmRpYW1ldGVyIC8gMlxuICB9XG5cbiAgb25EcmF3KCkge1xuICAgIHN1cGVyLm9uRHJhdygpXG4gICAgY2lyY2xlKHRoaXMueCwgdGhpcy55LCB0aGlzLmRpYW1ldGVyKVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBFbGxpcHNlIGV4dGVuZHMgUmVjdCB7XG4gIGdldCBjZW50ZXJYKCkge1xuICAgIHJldHVybiB0aGlzLnhcbiAgfVxuXG4gIGdldCBjZW50ZXJZKCkge1xuICAgIHJldHVybiB0aGlzLnlcbiAgfVxuXG4gIGdldCBpc0hvdmVyZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChcbiAgICAgIE1hdGgucG93KG1vdXNlWCAtIHRoaXMueCwgMikgLyBNYXRoLnBvdyh0aGlzLndpZHRoIC8gMiwgMikgK1xuICAgICAgICBNYXRoLnBvdyhtb3VzZVkgLSB0aGlzLnksIDIpIC8gTWF0aC5wb3codGhpcy5oZWlnaHQgLyAyLCAyKSA8PVxuICAgICAgMVxuICAgIClcbiAgfVxuXG4gIG9uRHJhdygpIHtcbiAgICBzdXBlci5vbkRyYXcoKVxuICAgIGVsbGlwc2UodGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMaW5lIGV4dGVuZHMgU2hhcGUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgeCA9IDAsXG4gICAgcHVibGljIHkgPSAwLFxuICAgIHB1YmxpYyB4MiA9IDAsXG4gICAgcHVibGljIHkyID0gMCxcbiAgICBvcHRpb25zPzogRHJhd2FibGVTZXR0aW5nc1xuICApIHtcbiAgICBzdXBlcihvcHRpb25zKVxuICB9XG5cbiAgZ2V0IHdpZHRoKCkge1xuICAgIHJldHVybiB0aGlzLngyIC0gdGhpcy54XG4gIH1cblxuICBnZXQgaGVpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLnkyIC0gdGhpcy55XG4gIH1cblxuICBnZXQgc2l6ZSgpIHtcbiAgICByZXR1cm4gZGlzdCh0aGlzLngsIHRoaXMueSwgdGhpcy54MiwgdGhpcy55MilcbiAgfVxuXG4gIGdldCBjZW50ZXJYKCkge1xuICAgIHJldHVybiB0aGlzLnggKyB0aGlzLndpZHRoIC8gMlxuICB9XG5cbiAgZ2V0IGNlbnRlclkoKSB7XG4gICAgcmV0dXJuIHRoaXMueSArIHRoaXMuaGVpZ2h0IC8gMlxuICB9XG5cbiAgZ2V0IGlzSG92ZXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgZGlzdCh0aGlzLngsIHRoaXMueSwgbW91c2VYLCBtb3VzZVkpICtcbiAgICAgICAgZGlzdChtb3VzZVgsIG1vdXNlWSwgdGhpcy54MiwgdGhpcy55MikgPD1cbiAgICAgIHRoaXMuc2l6ZVxuICAgIClcbiAgfVxuXG4gIG9uRHJhdygpIHtcbiAgICBzdXBlci5vbkRyYXcoKVxuICAgIGxpbmUodGhpcy54LCB0aGlzLnksIHRoaXMueDIsIHRoaXMueTIpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEltYWdlIGV4dGVuZHMgUmVjdCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBpbWc6IHA1LkltYWdlLFxuICAgIHB1YmxpYyB4ID0gMCxcbiAgICBwdWJsaWMgeSA9IDAsXG4gICAgd2lkdGg/OiBudW1iZXIsXG4gICAgaGVpZ2h0PzogbnVtYmVyLFxuICAgIG9wdGlvbnM/OiBEcmF3YWJsZVNldHRpbmdzXG4gICkge1xuICAgIHN1cGVyKHgsIHksIHdpZHRoID8/IGltZy53aWR0aCwgaGVpZ2h0ID8/IGltZy5oZWlnaHQsIG9wdGlvbnMpXG4gIH1cblxuICBvbkRyYXcoKSB7XG4gICAgc3VwZXIub25EcmF3KClcbiAgICBpbWFnZSh0aGlzLmltZywgdGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUZXh0IGV4dGVuZHMgU2hhcGUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgdGV4dCA9IFwiXCIsXG4gICAgcHVibGljIHggPSAwLFxuICAgIHB1YmxpYyB5ID0gMCxcbiAgICBwdWJsaWMgX3dpZHRoPzogbnVtYmVyLFxuICAgIHB1YmxpYyBfaGVpZ2h0PzogbnVtYmVyLFxuICAgIG9wdGlvbnM/OiBEcmF3YWJsZVNldHRpbmdzXG4gICkge1xuICAgIHN1cGVyKG9wdGlvbnMpXG4gIH1cblxuICBnZXQgd2lkdGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fd2lkdGggPz8gSW5maW5pdHlcbiAgfVxuXG4gIGdldCBoZWlnaHQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5faGVpZ2h0ID8/IEluZmluaXR5XG4gIH1cblxuICBnZXQgY2VudGVyWCgpIHtcbiAgICByZXR1cm4gdGhpcy5zZXR0aW5ncy50ZXh0QWxpZ24ueCA9PT0gQ0VOVEVSXG4gICAgICA/IHRoaXMueFxuICAgICAgOiB0aGlzLnggKyB0aGlzLndpZHRoIC8gMlxuICB9XG5cbiAgZ2V0IGNlbnRlclkoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0dGluZ3MudGV4dEFsaWduLnkgPT09IENFTlRFUlxuICAgICAgPyB0aGlzLnlcbiAgICAgIDogdGhpcy55ICsgdGhpcy5oZWlnaHQgLyAyXG4gIH1cblxuICBnZXQgaXNIb3ZlcmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICBtb3VzZVggPiB0aGlzLmNlbnRlclggLSB3aWR0aCAvIDEwICYmXG4gICAgICBtb3VzZVggPCB0aGlzLmNlbnRlclggKyB3aWR0aCAvIDEwICYmXG4gICAgICBtb3VzZVkgPiB0aGlzLmNlbnRlclkgLSBoZWlnaHQgLyAxMCAmJlxuICAgICAgbW91c2VZIDwgdGhpcy5jZW50ZXJYICsgaGVpZ2h0IC8gMTBcbiAgICApXG4gIH1cblxuICBvbkRyYXcoKSB7XG4gICAgc3VwZXIub25EcmF3KClcbiAgICB0ZXh0KHRoaXMudGV4dCwgdGhpcy54LCB0aGlzLnksIHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQpXG4gIH1cbn1cbiIsICJpbXBvcnQgeyBCYXNlLCBUZXh0LCBBbmltYXRpb24sIERyYXdhYmxlU2V0dGluZ3MgfSBmcm9tIFwiQGdob20vZW50aXR5LXA1XCJcblxuZXhwb3J0IGNsYXNzIEdhbWUgZXh0ZW5kcyBCYXNlIHtcbiAgcHJpdmF0ZSBfc2NvcmUgPSAwXG5cbiAgZ2V0IHNjb3JlKCkge1xuICAgIHJldHVybiB0aGlzLl9zY29yZVxuICB9XG5cbiAgc2V0IHNjb3JlKHNjb3JlKSB7XG4gICAgaWYgKHRoaXMuX3Njb3JlICE9PSBzY29yZSkge1xuICAgICAgY29uc3Qgc2NvcmVVcCA9IHNjb3JlID4gdGhpcy5fc2NvcmVcblxuICAgICAgY29uc3QgYmFzZVRleHRTaXplID0gaGVpZ2h0ICogMC4wNVxuXG4gICAgICBjb25zdCBvcHRpb25zOiBEcmF3YWJsZVNldHRpbmdzID0ge1xuICAgICAgICBzdHJva2U6IGZhbHNlLFxuICAgICAgICBmaWxsOiBjb2xvcigxNzApLFxuICAgICAgICB0ZXh0U2l6ZTogYmFzZVRleHRTaXplLFxuICAgICAgICB0ZXh0QWxpZ246IHtcbiAgICAgICAgICB4OiBDRU5URVIsXG4gICAgICAgICAgeTogQ0VOVEVSLFxuICAgICAgICB9LFxuICAgICAgfVxuXG4gICAgICBjb25zdCB0ZXh0ID0gbmV3IFRleHQoXG4gICAgICAgIGBTY29yZTogJHtzY29yZX1gLFxuICAgICAgICB3aWR0aCAvIDIsXG4gICAgICAgIGhlaWdodCAqIDAuMSxcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgIG9wdGlvbnNcbiAgICAgIClcblxuICAgICAgdGhpcy5hZGRDaGlsZChcbiAgICAgICAgbmV3IEFuaW1hdGlvbih7XG4gICAgICAgICAgZnJvbTogMCxcbiAgICAgICAgICB0bzogMSxcbiAgICAgICAgICBkdXJhdGlvbjogMjAsXG4gICAgICAgICAgb25TZXR1cDogKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZCh0ZXh0KVxuICAgICAgICAgIH0sXG4gICAgICAgICAgb25EcmF3OiAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIG9wdGlvbnMudGV4dFNpemUgPSBiYXNlVGV4dFNpemUgKiBNYXRoLm1heCgxLCB2YWx1ZSArIDAuNSlcbiAgICAgICAgICAgIG9wdGlvbnMuZmlsbCA9IHNjb3JlVXBcbiAgICAgICAgICAgICAgPyBjb2xvcigxMDAsIDI1NSwgMjU1LCAoMSAtIHZhbHVlKSAqIDI1NSlcbiAgICAgICAgICAgICAgOiBjb2xvcigyNTUsIDEwMCwgMTAwLCAoMSAtIHZhbHVlKSAqIDI1NSlcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9uVGVhcmRvd246ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQ2hpbGQodGV4dClcbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuICAgICAgKVxuXG4gICAgICB0aGlzLl9zY29yZSA9IHNjb3JlXG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKVxuICB9XG5cbiAgb25EcmF3KCkge1xuICAgIHRoaXMuZHJhd1Njb3JlKClcbiAgICB0aGlzLmRyYXdTY2hlbWEoKVxuICB9XG5cbiAgZHJhd1Njb3JlKCkge1xuICAgIG5vU3Ryb2tlKClcbiAgICBmaWxsKDE3MClcbiAgICB0ZXh0U2l6ZShoZWlnaHQgKiAwLjA1KVxuICAgIHRleHRBbGlnbihDRU5URVIsIENFTlRFUilcbiAgICB0ZXh0KGBTY29yZTogJHt0aGlzLnNjb3JlfWAsIHdpZHRoIC8gMiwgaGVpZ2h0ICogMC4xKVxuICB9XG5cbiAgZHJhd1NjaGVtYSgpIHtcbiAgICBub1N0cm9rZSgpXG4gICAgZmlsbCg5MClcbiAgICB0ZXh0U2l6ZShoZWlnaHQgKiAwLjAyKVxuICAgIHRleHRBbGlnbihMRUZULCBUT1ApXG4gICAgdGV4dCh0aGlzLnNjaGVtYSg1KSwgMjAsIDIwKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBnYW1lID0gbmV3IEdhbWUoKVxuIiwgImltcG9ydCB7XG4gIENpcmNsZSxcbiAgQW5pbWF0aW9uLFxuICBlYXNpbmdTZXQsXG4gIFBhcmFsbGVsLFxuICBTZXF1ZW5jZSxcbn0gZnJvbSBcIkBnaG9tL2VudGl0eS1wNVwiXG5cbmNvbnN0IEhJU1RPUllfTEVOR1RIID0gMTAwXG5cbmV4cG9ydCBjbGFzcyBDdXJzb3IgZXh0ZW5kcyBDaXJjbGUge1xuICBwdWJsaWMgaGlzdG9yeTogW3g6IG51bWJlciwgeTogbnVtYmVyXVtdID0gW11cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigwLCAwLCAxNSlcbiAgfVxuXG4gIG9uVXBkYXRlKCkge1xuICAgIHRoaXMuaGlzdG9yeS5wdXNoKFt0aGlzLngsIHRoaXMueV0pXG4gICAgdGhpcy54ID0gbW91c2VYXG4gICAgdGhpcy55ID0gbW91c2VZXG4gICAgd2hpbGUgKHRoaXMuaGlzdG9yeS5sZW5ndGggPiBISVNUT1JZX0xFTkdUSCkgdGhpcy5oaXN0b3J5LnNoaWZ0KClcbiAgfVxuXG4gIG9uRHJhdygpIHtcbiAgICBsZXQgbGFzdCA9IHRoaXMuaGlzdG9yeVswXVxuICAgIGZvciAoY29uc3QgcG9zIG9mIHRoaXMuaGlzdG9yeSkge1xuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmhpc3RvcnkuaW5kZXhPZihwb3MpXG4gICAgICBzdHJva2UoZmxvb3IobWFwKGluZGV4LCB0aGlzLmhpc3RvcnkubGVuZ3RoLCAwLCAyNTUsIDApKSlcbiAgICAgIHN0cm9rZVdlaWdodChmbG9vcihtYXAoaW5kZXgsIHRoaXMuaGlzdG9yeS5sZW5ndGgsIDAsIHRoaXMuZGlhbWV0ZXIsIDApKSlcbiAgICAgIGxpbmUoLi4ubGFzdCwgLi4ucG9zKVxuICAgICAgbGFzdCA9IHBvc1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VSZWxlYXNlZCgpIHtcbiAgICBjb25zdCBzdHJva2UgPSB7XG4gICAgICBjb2xvcjogY29sb3IoMjU1KSxcbiAgICAgIHdlaWdodDogdGhpcy5kaWFtZXRlciAvIDQsXG4gICAgfVxuICAgIGNvbnN0IGhhbG8gPSBuZXcgQ2lyY2xlKG1vdXNlWCwgbW91c2VZLCAwLCB7XG4gICAgICBmaWxsOiBmYWxzZSxcbiAgICAgIHN0cm9rZSxcbiAgICB9KVxuXG4gICAgdGhpcy5hZGRDaGlsZChcbiAgICAgIG5ldyBBbmltYXRpb24oe1xuICAgICAgICBmcm9tOiAwLFxuICAgICAgICB0bzogdGhpcy5kaWFtZXRlciAqIDUsXG4gICAgICAgIGR1cmF0aW9uOiAxMDAsXG4gICAgICAgIGVhc2luZzogZWFzaW5nU2V0LmVhc2VPdXRRdWFydCxcbiAgICAgICAgb25TZXR1cDogKCkgPT4gdGhpcy5hZGRDaGlsZChoYWxvKSxcbiAgICAgICAgb25EcmF3OiAodmFsdWUpID0+IHtcbiAgICAgICAgICBoYWxvLmRpYW1ldGVyID0gdmFsdWVcbiAgICAgICAgICBzdHJva2UuY29sb3IgPSBjb2xvcihcbiAgICAgICAgICAgIDI1NSxcbiAgICAgICAgICAgICgodGhpcy5kaWFtZXRlciAqIDUgLSB2YWx1ZSkgLyAodGhpcy5kaWFtZXRlciAqIDUpKSAqIDI1NVxuICAgICAgICAgIClcbiAgICAgICAgfSxcbiAgICAgICAgb25UZWFyZG93bjogKCkgPT4gdGhpcy5yZW1vdmVDaGlsZChoYWxvKSxcbiAgICAgIH0pXG4gICAgKVxuICB9XG59XG4iLCAiaW1wb3J0IHsgQ2lyY2xlIH0gZnJvbSBcIkBnaG9tL2VudGl0eS1wNVwiXG5pbXBvcnQgeyBnYW1lIH0gZnJvbSBcIi4vZ2FtZVwiXG5cbmV4cG9ydCBjbGFzcyBCYWxsb29uIGV4dGVuZHMgQ2lyY2xlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIocmFuZG9tKDAsIHdpZHRoKSwgcmFuZG9tKDAsIGhlaWdodCksIHJhbmRvbSg0MCwgNjApLCB7XG4gICAgICBmaWxsOiBjb2xvcihyYW5kb20oMTAwLCAyMDApLCByYW5kb20oMTAwLCAyMDApLCByYW5kb20oMTAwLCAyMDApKSxcbiAgICAgIHN0cm9rZTogZmFsc2UsXG4gICAgfSlcbiAgfVxuXG4gIG9uVXBkYXRlKCkge1xuICAgIGlmICh0aGlzLmlzSG92ZXJlZCkge1xuICAgICAgdGhpcy5zZXR0aW5ncy5zdHJva2UgPSB7XG4gICAgICAgIGNvbG9yOiBjb2xvcigyNTUpLFxuICAgICAgICB3ZWlnaHQ6IDUsXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0dGluZ3Muc3Ryb2tlID0gZmFsc2VcbiAgICB9XG4gIH1cblxuICBvblRlYXJkb3duKCkge1xuICAgIGdhbWUuc2NvcmUrK1xuICB9XG5cbiAgb25Nb3VzZVJlbGVhc2VkKCkge1xuICAgIGlmICh0aGlzLmlzSG92ZXJlZCkge1xuICAgICAgaWYgKHRoaXMucGFyZW50LmNoaWxkcmVuLmxlbmd0aCA+IDEpXG4gICAgICAgIHRoaXMucGFyZW50LnN0b3BUcmFuc21pc3Npb24oXCJtb3VzZVJlbGVhc2VkXCIpXG5cbiAgICAgIHRoaXMucGFyZW50LmFkZENoaWxkKG5ldyBCYWxsb29uKCkpXG4gICAgICB0aGlzLnRlYXJkb3duKClcbiAgICB9XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBCYWxsb29uIH0gZnJvbSBcIi4vYmFsbG9vblwiXG5pbXBvcnQgeyBCYXNlIH0gZnJvbSBcIkBnaG9tL2VudGl0eS1wNVwiXG5cbmV4cG9ydCBjbGFzcyBCYWxsb29ucyBleHRlbmRzIEJhc2Uge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvdW50OiBudW1iZXIpIHtcbiAgICBzdXBlcigpXG4gIH1cblxuICBvblNldHVwKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jb3VudDsgaSsrKSB7XG4gICAgICB0aGlzLmFkZENoaWxkKG5ldyBCYWxsb29uKCkpXG4gICAgfVxuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7O0FDQU8sZ0JBQ0wsR0FDQSxRQUNBLE9BQ0EsUUFDQSxPQUNBLGVBQWUsT0FDZjtBQUNBLFVBQU0sU0FBVyxLQUFJLFVBQVcsU0FBUSxVQUFZLFNBQVEsVUFBVTtBQUN0RSxRQUFJLENBQUMsY0FBYztBQUNqQixhQUFPO0FBQUE7QUFFVCxRQUFJLFNBQVMsT0FBTztBQUNsQixhQUFPLFVBQVUsUUFBUSxRQUFRO0FBQUEsV0FDNUI7QUFDTCxhQUFPLFVBQVUsUUFBUSxPQUFPO0FBQUE7QUFBQTtBQUk3QixxQkFBbUIsR0FBVyxLQUFhLE1BQWM7QUFDOUQsV0FBTyxLQUFLLElBQUksS0FBSyxJQUFJLEdBQUcsT0FBTztBQUFBOzs7QUNiOUIsc0JBQXNCO0FBQUEsSUE0QmpCLGNBQWM7QUF0QmQseUJBQWM7QUFDZCxzQkFBVztBQUNYLHVCQUFZLG9CQUFJO0FBRWhC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
