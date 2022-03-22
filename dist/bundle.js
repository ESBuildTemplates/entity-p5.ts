var app = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
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
  var __toESM = (module, isNodeMode) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", !isNodeMode && module && module.__esModule ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };
  var __toCommonJS = /* @__PURE__ */ ((cache) => {
    return (module, temp) => {
      return cache && cache.get(module) || (temp = __reExport(__markAsModule({}), module, 1), cache && cache.set(module, temp), temp);
    };
  })(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

  // node_modules/@ghom/event-emitter/dist/app/emitter.js
  var require_emitter = __commonJS({
    "node_modules/@ghom/event-emitter/dist/app/emitter.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.EventEmitter = void 0;
      var EventEmitter = class {
        constructor() {
          this._listeners = [];
        }
        on(name, run) {
          this._listeners.push({ name, run });
        }
        once(name, run) {
          this._listeners.push({ name, run, once: true });
        }
        off(name, run) {
          if (run)
            this._listeners = this._listeners.filter((l) => l.run !== run);
          else if (name)
            this._listeners = this._listeners.filter((l) => l.name !== name);
          else
            this._listeners.splice(0, this._listeners.length);
        }
        emit(name, params, context) {
          for (const listener of this._listeners) {
            if (listener.name === name) {
              listener.run.bind(context)(...params);
              if (listener.once) {
                const index = this._listeners.indexOf(listener);
                this._listeners.splice(index, 1);
              }
            }
          }
        }
        getListenersByName(name) {
          return this._listeners.filter((listener) => {
            return listener.name === name;
          });
        }
      };
      exports.EventEmitter = EventEmitter;
    }
  });

  // node_modules/@ghom/event-emitter/dist/index.js
  var require_dist = __commonJS({
    "node_modules/@ghom/event-emitter/dist/index.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() {
          return m[k];
        } });
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m)
          if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
            __createBinding(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      __exportStar(require_emitter(), exports);
    }
  });

  // node_modules/@ghom/entity-base/dist/app/util.js
  var require_util = __commonJS({
    "node_modules/@ghom/entity-base/dist/app/util.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.constrain = exports.map = void 0;
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
      exports.map = map2;
      function constrain(n, low, high) {
        return Math.max(Math.min(n, high), low);
      }
      exports.constrain = constrain;
    }
  });

  // node_modules/@ghom/entity-base/dist/app/entity.js
  var require_entity = __commonJS({
    "node_modules/@ghom/entity-base/dist/app/entity.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Entity = void 0;
      var event_emitter_1 = require_dist();
      var Entity = class extends event_emitter_1.EventEmitter {
        constructor() {
          super(...arguments);
          this._startFrame = 0;
          this._isSetup = false;
          this._children = /* @__PURE__ */ new Set();
          this._stopPoints = {};
        }
        static addFrame() {
          this.frameCount++;
        }
        static resolve(entity) {
          return typeof entity === "function" ? entity() : entity;
        }
        get frameCount() {
          return Entity.frameCount - this._startFrame;
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
          this._startFrame = Entity.frameCount;
          if (!this.isSetup) {
            this.onSetup();
            this.transmit("setup");
            this._isSetup = true;
          } else {
            console.warn(`${this.constructor.name} is already setup`);
          }
        }
        update(addFrame) {
          if (addFrame)
            Entity.addFrame();
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
          this.emit(name, [], this);
          for (const child of this.children) {
            if (this._stopPoints[name]) {
              this._stopPoints[name] = false;
              return;
            }
            if (name in child && typeof child[name] === "function")
              child[name]();
          }
        }
        schema(indentation = 2, depth = 0, index = null) {
          return `${" ".repeat(indentation).repeat(depth)}${index === null ? "" : `${index} - `}${this.constructor.name} [${this.frameCount} frames] ${this._children.size > 0 ? ` (children: ${this.children.length})${this._listeners.length > 0 ? ` (listeners: ${this._listeners.length})` : ""}
${this.children.map((child, index2) => `${child.schema(indentation, depth + 1, index2)}`).join("\n")}` : ""}`;
        }
      };
      exports.Entity = Entity;
      Entity.frameCount = 0;
    }
  });

  // node_modules/@ghom/entity-base/dist/app/easing.js
  var require_easing = __commonJS({
    "node_modules/@ghom/entity-base/dist/app/easing.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.easingSet = void 0;
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
      exports.easingSet = {
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
    }
  });

  // node_modules/@ghom/entity-base/dist/app/animation.js
  var require_animation = __commonJS({
    "node_modules/@ghom/entity-base/dist/app/animation.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Animation = void 0;
      var util_1 = require_util();
      var entity_1 = require_entity();
      var easing_1 = require_easing();
      var Animation3 = class extends entity_1.Entity {
        constructor(settings) {
          super();
          var _a;
          this.settings = settings;
          this.easing = (_a = settings.easing) != null ? _a : easing_1.easingSet.linear;
        }
        onSetup() {
          var _a, _b;
          (_b = (_a = this.settings).onSetup) == null ? void 0 : _b.call(_a);
        }
        onUpdate() {
          var _a, _b;
          if (entity_1.Entity.frameCount - this._startFrame >= this.settings.duration) {
            this.teardown();
            return false;
          } else {
            (_b = (_a = this.settings).onUpdate) == null ? void 0 : _b.call(_a, (0, util_1.map)(this.easing((entity_1.Entity.frameCount - this._startFrame) / this.settings.duration), 0, 1, this.settings.from, this.settings.to));
          }
        }
        onTeardown() {
          var _a, _b;
          (_b = (_a = this.settings).onTeardown) == null ? void 0 : _b.call(_a);
        }
      };
      exports.Animation = Animation3;
    }
  });

  // node_modules/@ghom/entity-base/dist/app/transition.js
  var require_transition = __commonJS({
    "node_modules/@ghom/entity-base/dist/app/transition.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Parallel = exports.Sequence = void 0;
      var entity_1 = require_entity();
      var Sequence2 = class extends entity_1.Entity {
        constructor(list) {
          super();
          this.list = list;
          this.index = 0;
        }
        onSetup() {
          this.next();
        }
        next() {
          if (this.index >= this.list.length) {
            this.teardown();
          } else {
            this.current = entity_1.Entity.resolve(this.list[this.index]);
            this.current.on("teardown", () => this.next());
            this.addChild(this.current);
            this.index++;
          }
        }
      };
      exports.Sequence = Sequence2;
      var Parallel2 = class extends entity_1.Entity {
        constructor(list) {
          super();
          this.list = list;
          this.addChild(...list.map(entity_1.Entity.resolve));
        }
        onUpdate() {
          if (this.children.length === 0) {
            this.teardown();
          }
        }
      };
      exports.Parallel = Parallel2;
    }
  });

  // node_modules/@ghom/entity-base/dist/index.js
  var require_dist2 = __commonJS({
    "node_modules/@ghom/entity-base/dist/index.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() {
          return m[k];
        } });
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m)
          if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
            __createBinding(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      __exportStar(require_dist(), exports);
      __exportStar(require_animation(), exports);
      __exportStar(require_easing(), exports);
      __exportStar(require_entity(), exports);
      __exportStar(require_transition(), exports);
      __exportStar(require_util(), exports);
    }
  });

  // node_modules/@ghom/entity-p5/dist/app/base.js
  var require_base = __commonJS({
    "node_modules/@ghom/entity-p5/dist/app/base.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Base = void 0;
      var entity_base_1 = require_dist2();
      var Base4 = class extends entity_base_1.Entity {
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
      exports.Base = Base4;
    }
  });

  // node_modules/@ghom/entity-p5/dist/app/drawable.js
  var require_drawable = __commonJS({
    "node_modules/@ghom/entity-p5/dist/app/drawable.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Drawable = void 0;
      var base_1 = require_base();
      var Drawable = class extends base_1.Base {
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
      exports.Drawable = Drawable;
    }
  });

  // node_modules/@ghom/entity-p5/dist/app/shape.js
  var require_shape = __commonJS({
    "node_modules/@ghom/entity-p5/dist/app/shape.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Text = exports.Image = exports.Line = exports.Ellipse = exports.Circle = exports.Rect = exports.Shape = void 0;
      var drawable_1 = require_drawable();
      var Shape = class extends drawable_1.Drawable {
        get center() {
          return [this.centerX, this.centerY];
        }
      };
      exports.Shape = Shape;
      var Rect = class extends Shape {
        constructor(x = 0, y = 0, width2 = 0, height2 = 0, options) {
          super(options);
          this.x = x;
          this.y = y;
          this.width = width2;
          this.height = height2;
        }
        get centerX() {
          return this.x + this.width / 2;
        }
        get centerY() {
          return this.y + this.height / 2;
        }
        get isHovered() {
          return mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height;
        }
        onDraw() {
          super.onDraw();
          rect(this.x, this.y, this.width, this.height);
        }
      };
      exports.Rect = Rect;
      var Circle3 = class extends Shape {
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
      exports.Circle = Circle3;
      var Ellipse = class extends Rect {
        get centerX() {
          return this.x;
        }
        get centerY() {
          return this.y;
        }
        get isHovered() {
          return Math.pow(mouseX - this.x, 2) / Math.pow(this.width / 2, 2) + Math.pow(mouseY - this.y, 2) / Math.pow(this.height / 2, 2) <= 1;
        }
        onDraw() {
          super.onDraw();
          ellipse(this.x, this.y, this.width, this.height);
        }
      };
      exports.Ellipse = Ellipse;
      var Line = class extends Shape {
        constructor(x = 0, y = 0, x2 = 0, y2 = 0, options) {
          super(options);
          this.x = x;
          this.y = y;
          this.x2 = x2;
          this.y2 = y2;
        }
        get width() {
          return this.x2 - this.x;
        }
        get height() {
          return this.y2 - this.y;
        }
        get size() {
          return dist(this.x, this.y, this.x2, this.y2);
        }
        get centerX() {
          return this.x + this.width / 2;
        }
        get centerY() {
          return this.y + this.height / 2;
        }
        get isHovered() {
          return dist(this.x, this.y, mouseX, mouseY) + dist(mouseX, mouseY, this.x2, this.y2) <= this.size;
        }
        onDraw() {
          super.onDraw();
          line(this.x, this.y, this.x2, this.y2);
        }
      };
      exports.Line = Line;
      var Image = class extends Rect {
        constructor(img, x = 0, y = 0, width2, height2, options) {
          super(x, y, width2 != null ? width2 : img.width, height2 != null ? height2 : img.height, options);
          this.img = img;
          this.x = x;
          this.y = y;
        }
        onDraw() {
          super.onDraw();
          image(this.img, this.x, this.y, this.width, this.height);
        }
      };
      exports.Image = Image;
      var Text2 = class extends Shape {
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
          var _a, _b;
          return ((_b = (_a = this.settings) == null ? void 0 : _a.textAlign) == null ? void 0 : _b.x) === CENTER ? this.x : this.x + this.width / 2;
        }
        get centerY() {
          var _a, _b;
          return ((_b = (_a = this.settings) == null ? void 0 : _a.textAlign) == null ? void 0 : _b.y) === CENTER ? this.y : this.y + this.height / 2;
        }
        get isHovered() {
          return mouseX > this.centerX - width / 10 && mouseX < this.centerX + width / 10 && mouseY > this.centerY - height / 10 && mouseY < this.centerX + height / 10;
        }
        onDraw() {
          super.onDraw();
          text(this.text, this.x, this.y, this._width, this._height);
        }
      };
      exports.Text = Text2;
    }
  });

  // node_modules/@ghom/entity-p5/dist/index.js
  var require_dist3 = __commonJS({
    "node_modules/@ghom/entity-p5/dist/index.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() {
          return m[k];
        } });
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m)
          if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
            __createBinding(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      __exportStar(require_dist2(), exports);
      __exportStar(require_base(), exports);
      __exportStar(require_drawable(), exports);
      __exportStar(require_shape(), exports);
    }
  });

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

  // src/app/game.ts
  var import_entity_p5 = __toESM(require_dist3());
  var Game = class extends import_entity_p5.Base {
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
        const text2 = new import_entity_p5.Text(`Score: ${score}`, width / 2, height * 0.1, void 0, void 0, options);
        this.addChild(new import_entity_p5.Animation({
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
  var import_entity_p52 = __toESM(require_dist3());
  var HISTORY_LENGTH = 100;
  var Cursor = class extends import_entity_p52.Circle {
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
      const halo = new import_entity_p52.Circle(mouseX, mouseY, 0, {
        fill: false,
        stroke: stroke2
      });
      this.addChild(new import_entity_p52.Animation({
        from: 0,
        to: this.diameter * 5,
        duration: 200,
        easing: import_entity_p52.easingSet.easeOutQuart,
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
  var import_entity_p53 = __toESM(require_dist3());
  var Balloon = class extends import_entity_p53.Circle {
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
  var import_entity_p54 = __toESM(require_dist3());
  var Balloons = class extends import_entity_p54.Base {
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

  // src/app/background.ts
  var import_entity_p55 = __toESM(require_dist3());
  var Background = class extends import_entity_p55.Base {
    constructor() {
      super(...arguments);
      this.noiseScale = 0.5;
    }
    onUpdate() {
      background(0);
      for (let x = 0; x * 50 < width; x++) {
        for (let y = 0; y * 50 < height; y++) {
          fill(noise(x * this.noiseScale, y * this.noiseScale + this.frameCount / 100) * 100);
          noStroke();
          rect(x * 50 + 2, y * 50 + 2, 46, 46, 5);
        }
      }
    }
  };

  // src/index.ts
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  function setup() {
    createCanvas(Math.max(document.documentElement.clientWidth, window.innerWidth || 0), Math.max(document.documentElement.clientHeight, window.innerHeight || 0));
    game.addChild(new Background());
    game.addChild(new Balloons(1));
    game.addChild(new Cursor());
    game.setup();
  }
  function draw() {
    if (!game.isSetup) {
      frameRate(0);
      return;
    }
    game.draw();
  }
  function update() {
    if (game.isSetup)
      game.update(true);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibm9kZV9tb2R1bGVzL0BnaG9tL2V2ZW50LWVtaXR0ZXIvZGlzdC9hcHAvZW1pdHRlci5qcyIsICJub2RlX21vZHVsZXMvQGdob20vZXZlbnQtZW1pdHRlci9kaXN0L2luZGV4LmpzIiwgIm5vZGVfbW9kdWxlcy9AZ2hvbS9lbnRpdHktYmFzZS9kaXN0L2FwcC91dGlsLmpzIiwgIm5vZGVfbW9kdWxlcy9AZ2hvbS9lbnRpdHktYmFzZS9kaXN0L2FwcC9lbnRpdHkuanMiLCAibm9kZV9tb2R1bGVzL0BnaG9tL2VudGl0eS1iYXNlL2Rpc3QvYXBwL2Vhc2luZy5qcyIsICJub2RlX21vZHVsZXMvQGdob20vZW50aXR5LWJhc2UvZGlzdC9hcHAvYW5pbWF0aW9uLmpzIiwgIm5vZGVfbW9kdWxlcy9AZ2hvbS9lbnRpdHktYmFzZS9kaXN0L2FwcC90cmFuc2l0aW9uLmpzIiwgIm5vZGVfbW9kdWxlcy9AZ2hvbS9lbnRpdHktYmFzZS9kaXN0L2luZGV4LmpzIiwgIm5vZGVfbW9kdWxlcy9AZ2hvbS9lbnRpdHktcDUvZGlzdC9hcHAvYmFzZS5qcyIsICJub2RlX21vZHVsZXMvQGdob20vZW50aXR5LXA1L2Rpc3QvYXBwL2RyYXdhYmxlLmpzIiwgIm5vZGVfbW9kdWxlcy9AZ2hvbS9lbnRpdHktcDUvZGlzdC9hcHAvc2hhcGUuanMiLCAibm9kZV9tb2R1bGVzL0BnaG9tL2VudGl0eS1wNS9kaXN0L2luZGV4LmpzIiwgInNyYy9pbmRleC50cyIsICJzcmMvYXBwL2dhbWUudHMiLCAic3JjL2FwcC9jdXJzb3IudHMiLCAic3JjL2FwcC9iYWxsb29uLnRzIiwgInNyYy9hcHAvYmFsbG9vbnMudHMiLCAic3JjL2FwcC9iYWNrZ3JvdW5kLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLkV2ZW50RW1pdHRlciA9IHZvaWQgMDtcclxuY2xhc3MgRXZlbnRFbWl0dGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuX2xpc3RlbmVycyA9IFtdO1xyXG4gICAgfVxyXG4gICAgb24obmFtZSwgcnVuKSB7XHJcbiAgICAgICAgdGhpcy5fbGlzdGVuZXJzLnB1c2goeyBuYW1lLCBydW4gfSk7XHJcbiAgICB9XHJcbiAgICBvbmNlKG5hbWUsIHJ1bikge1xyXG4gICAgICAgIHRoaXMuX2xpc3RlbmVycy5wdXNoKHsgbmFtZSwgcnVuLCBvbmNlOiB0cnVlIH0pO1xyXG4gICAgfVxyXG4gICAgb2ZmKG5hbWUsIHJ1bikge1xyXG4gICAgICAgIGlmIChydW4pXHJcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycy5maWx0ZXIoKGwpID0+IGwucnVuICE9PSBydW4pO1xyXG4gICAgICAgIGVsc2UgaWYgKG5hbWUpXHJcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycy5maWx0ZXIoKGwpID0+IGwubmFtZSAhPT0gbmFtZSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnMuc3BsaWNlKDAsIHRoaXMuX2xpc3RlbmVycy5sZW5ndGgpO1xyXG4gICAgfVxyXG4gICAgZW1pdChuYW1lLCBwYXJhbXMsIGNvbnRleHQpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGxpc3RlbmVyIG9mIHRoaXMuX2xpc3RlbmVycykge1xyXG4gICAgICAgICAgICBpZiAobGlzdGVuZXIubmFtZSA9PT0gbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgbGlzdGVuZXIucnVuLmJpbmQoY29udGV4dCkoLi4ucGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lci5vbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9saXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnZXRMaXN0ZW5lcnNCeU5hbWUobmFtZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9saXN0ZW5lcnMuZmlsdGVyKChsaXN0ZW5lcikgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbGlzdGVuZXIubmFtZSA9PT0gbmFtZTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcclxuIiwgIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSkpO1xyXG52YXIgX19leHBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2V4cG9ydFN0YXIpIHx8IGZ1bmN0aW9uKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZXhwb3J0cywgcCkpIF9fY3JlYXRlQmluZGluZyhleHBvcnRzLCBtLCBwKTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vYXBwL2VtaXR0ZXJcIiksIGV4cG9ydHMpO1xyXG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5jb25zdHJhaW4gPSBleHBvcnRzLm1hcCA9IHZvaWQgMDtcclxuZnVuY3Rpb24gbWFwKG4sIHN0YXJ0MSwgc3RvcDEsIHN0YXJ0Miwgc3RvcDIsIHdpdGhpbkJvdW5kcyA9IGZhbHNlKSB7XHJcbiAgICBjb25zdCBvdXRwdXQgPSAoKG4gLSBzdGFydDEpIC8gKHN0b3AxIC0gc3RhcnQxKSkgKiAoc3RvcDIgLSBzdGFydDIpICsgc3RhcnQyO1xyXG4gICAgaWYgKCF3aXRoaW5Cb3VuZHMpIHtcclxuICAgICAgICByZXR1cm4gb3V0cHV0O1xyXG4gICAgfVxyXG4gICAgaWYgKHN0YXJ0MiA8IHN0b3AyKSB7XHJcbiAgICAgICAgcmV0dXJuIGNvbnN0cmFpbihvdXRwdXQsIHN0YXJ0Miwgc3RvcDIpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGNvbnN0cmFpbihvdXRwdXQsIHN0b3AyLCBzdGFydDIpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMubWFwID0gbWFwO1xyXG5mdW5jdGlvbiBjb25zdHJhaW4obiwgbG93LCBoaWdoKSB7XHJcbiAgICByZXR1cm4gTWF0aC5tYXgoTWF0aC5taW4obiwgaGlnaCksIGxvdyk7XHJcbn1cclxuZXhwb3J0cy5jb25zdHJhaW4gPSBjb25zdHJhaW47XHJcbiIsICJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLkVudGl0eSA9IHZvaWQgMDtcclxuY29uc3QgZXZlbnRfZW1pdHRlcl8xID0gcmVxdWlyZShcIkBnaG9tL2V2ZW50LWVtaXR0ZXJcIik7XHJcbmNsYXNzIEVudGl0eSBleHRlbmRzIGV2ZW50X2VtaXR0ZXJfMS5FdmVudEVtaXR0ZXIge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcclxuICAgICAgICB0aGlzLl9zdGFydEZyYW1lID0gMDtcclxuICAgICAgICB0aGlzLl9pc1NldHVwID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fY2hpbGRyZW4gPSBuZXcgU2V0KCk7XHJcbiAgICAgICAgdGhpcy5fc3RvcFBvaW50cyA9IHt9O1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFkZEZyYW1lKCkge1xyXG4gICAgICAgIHRoaXMuZnJhbWVDb3VudCsrO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIHJlc29sdmUoZW50aXR5KSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBlbnRpdHkgPT09IFwiZnVuY3Rpb25cIiA/IGVudGl0eSgpIDogZW50aXR5O1xyXG4gICAgfVxyXG4gICAgZ2V0IGZyYW1lQ291bnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIEVudGl0eS5mcmFtZUNvdW50IC0gdGhpcy5fc3RhcnRGcmFtZTtcclxuICAgIH1cclxuICAgIGdldCBpc1NldHVwKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc1NldHVwO1xyXG4gICAgfVxyXG4gICAgZ2V0IGNoaWxkcmVuKCkge1xyXG4gICAgICAgIHJldHVybiBbLi4udGhpcy5fY2hpbGRyZW5dO1xyXG4gICAgfVxyXG4gICAgZ2V0IHBhcmVudCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGFyZW50O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBVc2VkIHRvIGJlIG92ZXJ3cml0dGVuIGJ5IHlvdXIgb3duIHdvcmtpbmdzXHJcbiAgICAgKi9cclxuICAgIG9uU2V0dXAoKSB7IH1cclxuICAgIC8qKlxyXG4gICAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xyXG4gICAgICovXHJcbiAgICBvblVwZGF0ZSgpIHsgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBVc2VkIHRvIGJlIG92ZXJ3cml0dGVuIGJ5IHlvdXIgb3duIHdvcmtpbmdzXHJcbiAgICAgKi9cclxuICAgIG9uVGVhcmRvd24oKSB7IH1cclxuICAgIC8qKlxyXG4gICAgICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjdXJyZW50IGVudGl0eSBpcyBhIHJvb3QuXHJcbiAgICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxyXG4gICAgICovXHJcbiAgICBzZXR1cCgpIHtcclxuICAgICAgICB0aGlzLl9zdGFydEZyYW1lID0gRW50aXR5LmZyYW1lQ291bnQ7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzU2V0dXApIHtcclxuICAgICAgICAgICAgdGhpcy5vblNldHVwKCk7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNtaXQoXCJzZXR1cFwiKTtcclxuICAgICAgICAgICAgdGhpcy5faXNTZXR1cCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYCR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSBpcyBhbHJlYWR5IHNldHVwYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cclxuICAgICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZShhZGRGcmFtZSkge1xyXG4gICAgICAgIGlmIChhZGRGcmFtZSlcclxuICAgICAgICAgICAgRW50aXR5LmFkZEZyYW1lKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTZXR1cCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vblVwZGF0ZSgpICE9PSBmYWxzZSlcclxuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNtaXQoXCJ1cGRhdGVcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYHVwZGF0ZSBpcyBjYWxsZWQgYmVmb3JlIHNldHVwIGluICR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjdXJyZW50IGVudGl0eSBpcyBhIHJvb3QuXHJcbiAgICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxyXG4gICAgICovXHJcbiAgICB0ZWFyZG93bigpIHtcclxuICAgICAgICBpZiAodGhpcy5pc1NldHVwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzU2V0dXAgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5vblRlYXJkb3duKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudD8ucmVtb3ZlQ2hpbGQodGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNtaXQoXCJ0ZWFyZG93blwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgdGVhcmRvd24gaXMgY2FsbGVkIGJlZm9yZSBzZXR1cCBpbiAke3RoaXMuY29uc3RydWN0b3IubmFtZX1gKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhZGRDaGlsZCguLi5jaGlsZHJlbikge1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgY2hpbGQuX3BhcmVudCA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuLmFkZChjaGlsZCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzU2V0dXApXHJcbiAgICAgICAgICAgICAgICBjaGlsZC5zZXR1cCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJlbW92ZUNoaWxkKC4uLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZHJlbikge1xyXG4gICAgICAgICAgICBpZiAoY2hpbGQuaXNTZXR1cClcclxuICAgICAgICAgICAgICAgIGNoaWxkLnRlYXJkb3duKCk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuLmRlbGV0ZShjaGlsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc3RvcFRyYW5zbWlzc2lvbihuYW1lKSB7XHJcbiAgICAgICAgdGhpcy5fc3RvcFBvaW50c1tuYW1lXSA9IHRydWU7XHJcbiAgICB9XHJcbiAgICB0cmFuc21pdChuYW1lKSB7XHJcbiAgICAgICAgdGhpcy5lbWl0KG5hbWUsIFtdLCB0aGlzKTtcclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3N0b3BQb2ludHNbbmFtZV0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N0b3BQb2ludHNbbmFtZV0gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgIGlmIChuYW1lIGluIGNoaWxkICYmIHR5cGVvZiBjaGlsZFtuYW1lXSA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgICAgICAgICAgY2hpbGRbbmFtZV0oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzY2hlbWEoaW5kZW50YXRpb24gPSAyLCBkZXB0aCA9IDAsIGluZGV4ID0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiBgJHtcIiBcIi5yZXBlYXQoaW5kZW50YXRpb24pLnJlcGVhdChkZXB0aCl9JHtpbmRleCA9PT0gbnVsbCA/IFwiXCIgOiBgJHtpbmRleH0gLSBgfSR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSBbJHt0aGlzLmZyYW1lQ291bnR9IGZyYW1lc10gJHt0aGlzLl9jaGlsZHJlbi5zaXplID4gMFxyXG4gICAgICAgICAgICA/IGAgKGNoaWxkcmVuOiAke3RoaXMuY2hpbGRyZW4ubGVuZ3RofSkke3RoaXMuX2xpc3RlbmVycy5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgICAgICA/IGAgKGxpc3RlbmVyczogJHt0aGlzLl9saXN0ZW5lcnMubGVuZ3RofSlgXHJcbiAgICAgICAgICAgICAgICA6IFwiXCJ9XFxuJHt0aGlzLmNoaWxkcmVuXHJcbiAgICAgICAgICAgICAgICAubWFwKChjaGlsZCwgaW5kZXgpID0+IGAke2NoaWxkLnNjaGVtYShpbmRlbnRhdGlvbiwgZGVwdGggKyAxLCBpbmRleCl9YClcclxuICAgICAgICAgICAgICAgIC5qb2luKFwiXFxuXCIpfWBcclxuICAgICAgICAgICAgOiBcIlwifWA7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5FbnRpdHkgPSBFbnRpdHk7XHJcbkVudGl0eS5mcmFtZUNvdW50ID0gMDtcclxuIiwgIlwidXNlIHN0cmljdFwiO1xyXG4vLyBzb3VyY2U6IGh0dHBzOi8vZ2l0aHViLmNvbS9haS9lYXNpbmdzLm5ldC9ibG9iL21hc3Rlci9zcmMvZWFzaW5ncy9lYXNpbmdzRnVuY3Rpb25zLnRzXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5lYXNpbmdTZXQgPSB2b2lkIDA7XHJcbmNvbnN0IFBJID0gTWF0aC5QSTtcclxuY29uc3QgYzEgPSAxLjcwMTU4O1xyXG5jb25zdCBjMiA9IGMxICogMS41MjU7XHJcbmNvbnN0IGMzID0gYzEgKyAxO1xyXG5jb25zdCBjNCA9ICgyICogUEkpIC8gMztcclxuY29uc3QgYzUgPSAoMiAqIFBJKSAvIDQuNTtcclxuY29uc3QgYm91bmNlT3V0ID0gZnVuY3Rpb24gKHgpIHtcclxuICAgIGNvbnN0IG4xID0gNy41NjI1O1xyXG4gICAgY29uc3QgZDEgPSAyLjc1O1xyXG4gICAgaWYgKHggPCAxIC8gZDEpIHtcclxuICAgICAgICByZXR1cm4gbjEgKiB4ICogeDtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHggPCAyIC8gZDEpIHtcclxuICAgICAgICByZXR1cm4gbjEgKiAoeCAtPSAxLjUgLyBkMSkgKiB4ICsgMC43NTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHggPCAyLjUgLyBkMSkge1xyXG4gICAgICAgIHJldHVybiBuMSAqICh4IC09IDIuMjUgLyBkMSkgKiB4ICsgMC45Mzc1O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIG4xICogKHggLT0gMi42MjUgLyBkMSkgKiB4ICsgMC45ODQzNzU7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydHMuZWFzaW5nU2V0ID0ge1xyXG4gICAgbGluZWFyOiAoeCkgPT4geCxcclxuICAgIGVhc2VJblF1YWQ6IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIHggKiB4O1xyXG4gICAgfSxcclxuICAgIGVhc2VPdXRRdWFkOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiAxIC0gKDEgLSB4KSAqICgxIC0geCk7XHJcbiAgICB9LFxyXG4gICAgZWFzZUluT3V0UXVhZDogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4geCA8IDAuNSA/IDIgKiB4ICogeCA6IDEgLSBNYXRoLnBvdygtMiAqIHggKyAyLCAyKSAvIDI7XHJcbiAgICB9LFxyXG4gICAgZWFzZUluQ3ViaWM6IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIHggKiB4ICogeDtcclxuICAgIH0sXHJcbiAgICBlYXNlT3V0Q3ViaWM6IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIDEgLSBNYXRoLnBvdygxIC0geCwgMyk7XHJcbiAgICB9LFxyXG4gICAgZWFzZUluT3V0Q3ViaWM6IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIHggPCAwLjUgPyA0ICogeCAqIHggKiB4IDogMSAtIE1hdGgucG93KC0yICogeCArIDIsIDMpIC8gMjtcclxuICAgIH0sXHJcbiAgICBlYXNlSW5RdWFydDogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4geCAqIHggKiB4ICogeDtcclxuICAgIH0sXHJcbiAgICBlYXNlT3V0UXVhcnQ6IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIDEgLSBNYXRoLnBvdygxIC0geCwgNCk7XHJcbiAgICB9LFxyXG4gICAgZWFzZUluT3V0UXVhcnQ6IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIHggPCAwLjUgPyA4ICogeCAqIHggKiB4ICogeCA6IDEgLSBNYXRoLnBvdygtMiAqIHggKyAyLCA0KSAvIDI7XHJcbiAgICB9LFxyXG4gICAgZWFzZUluUXVpbnQ6IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIHggKiB4ICogeCAqIHggKiB4O1xyXG4gICAgfSxcclxuICAgIGVhc2VPdXRRdWludDogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4gMSAtIE1hdGgucG93KDEgLSB4LCA1KTtcclxuICAgIH0sXHJcbiAgICBlYXNlSW5PdXRRdWludDogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4geCA8IDAuNSA/IDE2ICogeCAqIHggKiB4ICogeCAqIHggOiAxIC0gTWF0aC5wb3coLTIgKiB4ICsgMiwgNSkgLyAyO1xyXG4gICAgfSxcclxuICAgIGVhc2VJblNpbmU6IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIDEgLSBNYXRoLmNvcygoeCAqIFBJKSAvIDIpO1xyXG4gICAgfSxcclxuICAgIGVhc2VPdXRTaW5lOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNpbigoeCAqIFBJKSAvIDIpO1xyXG4gICAgfSxcclxuICAgIGVhc2VJbk91dFNpbmU6IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIC0oTWF0aC5jb3MoUEkgKiB4KSAtIDEpIC8gMjtcclxuICAgIH0sXHJcbiAgICBlYXNlSW5FeHBvOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiB4ID09PSAwID8gMCA6IE1hdGgucG93KDIsIDEwICogeCAtIDEwKTtcclxuICAgIH0sXHJcbiAgICBlYXNlT3V0RXhwbzogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4geCA9PT0gMSA/IDEgOiAxIC0gTWF0aC5wb3coMiwgLTEwICogeCk7XHJcbiAgICB9LFxyXG4gICAgZWFzZUluT3V0RXhwbzogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4geCA9PT0gMFxyXG4gICAgICAgICAgICA/IDBcclxuICAgICAgICAgICAgOiB4ID09PSAxXHJcbiAgICAgICAgICAgICAgICA/IDFcclxuICAgICAgICAgICAgICAgIDogeCA8IDAuNVxyXG4gICAgICAgICAgICAgICAgICAgID8gTWF0aC5wb3coMiwgMjAgKiB4IC0gMTApIC8gMlxyXG4gICAgICAgICAgICAgICAgICAgIDogKDIgLSBNYXRoLnBvdygyLCAtMjAgKiB4ICsgMTApKSAvIDI7XHJcbiAgICB9LFxyXG4gICAgZWFzZUluQ2lyYzogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4gMSAtIE1hdGguc3FydCgxIC0gTWF0aC5wb3coeCwgMikpO1xyXG4gICAgfSxcclxuICAgIGVhc2VPdXRDaXJjOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoMSAtIE1hdGgucG93KHggLSAxLCAyKSk7XHJcbiAgICB9LFxyXG4gICAgZWFzZUluT3V0Q2lyYzogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4geCA8IDAuNVxyXG4gICAgICAgICAgICA/ICgxIC0gTWF0aC5zcXJ0KDEgLSBNYXRoLnBvdygyICogeCwgMikpKSAvIDJcclxuICAgICAgICAgICAgOiAoTWF0aC5zcXJ0KDEgLSBNYXRoLnBvdygtMiAqIHggKyAyLCAyKSkgKyAxKSAvIDI7XHJcbiAgICB9LFxyXG4gICAgZWFzZUluQmFjazogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4gYzMgKiB4ICogeCAqIHggLSBjMSAqIHggKiB4O1xyXG4gICAgfSxcclxuICAgIGVhc2VPdXRCYWNrOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiAxICsgYzMgKiBNYXRoLnBvdyh4IC0gMSwgMykgKyBjMSAqIE1hdGgucG93KHggLSAxLCAyKTtcclxuICAgIH0sXHJcbiAgICBlYXNlSW5PdXRCYWNrOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiB4IDwgMC41XHJcbiAgICAgICAgICAgID8gKE1hdGgucG93KDIgKiB4LCAyKSAqICgoYzIgKyAxKSAqIDIgKiB4IC0gYzIpKSAvIDJcclxuICAgICAgICAgICAgOiAoTWF0aC5wb3coMiAqIHggLSAyLCAyKSAqICgoYzIgKyAxKSAqICh4ICogMiAtIDIpICsgYzIpICsgMikgLyAyO1xyXG4gICAgfSxcclxuICAgIGVhc2VJbkVsYXN0aWM6IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIHggPT09IDBcclxuICAgICAgICAgICAgPyAwXHJcbiAgICAgICAgICAgIDogeCA9PT0gMVxyXG4gICAgICAgICAgICAgICAgPyAxXHJcbiAgICAgICAgICAgICAgICA6IC1NYXRoLnBvdygyLCAxMCAqIHggLSAxMCkgKiBNYXRoLnNpbigoeCAqIDEwIC0gMTAuNzUpICogYzQpO1xyXG4gICAgfSxcclxuICAgIGVhc2VPdXRFbGFzdGljOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiB4ID09PSAwXHJcbiAgICAgICAgICAgID8gMFxyXG4gICAgICAgICAgICA6IHggPT09IDFcclxuICAgICAgICAgICAgICAgID8gMVxyXG4gICAgICAgICAgICAgICAgOiBNYXRoLnBvdygyLCAtMTAgKiB4KSAqIE1hdGguc2luKCh4ICogMTAgLSAwLjc1KSAqIGM0KSArIDE7XHJcbiAgICB9LFxyXG4gICAgZWFzZUluT3V0RWxhc3RpYzogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4geCA9PT0gMFxyXG4gICAgICAgICAgICA/IDBcclxuICAgICAgICAgICAgOiB4ID09PSAxXHJcbiAgICAgICAgICAgICAgICA/IDFcclxuICAgICAgICAgICAgICAgIDogeCA8IDAuNVxyXG4gICAgICAgICAgICAgICAgICAgID8gLShNYXRoLnBvdygyLCAyMCAqIHggLSAxMCkgKiBNYXRoLnNpbigoMjAgKiB4IC0gMTEuMTI1KSAqIGM1KSkgLyAyXHJcbiAgICAgICAgICAgICAgICAgICAgOiAoTWF0aC5wb3coMiwgLTIwICogeCArIDEwKSAqIE1hdGguc2luKCgyMCAqIHggLSAxMS4xMjUpICogYzUpKSAvIDIgKyAxO1xyXG4gICAgfSxcclxuICAgIGVhc2VJbkJvdW5jZTogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4gMSAtIGJvdW5jZU91dCgxIC0geCk7XHJcbiAgICB9LFxyXG4gICAgZWFzZU91dEJvdW5jZTogYm91bmNlT3V0LFxyXG4gICAgZWFzZUluT3V0Qm91bmNlOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiB4IDwgMC41XHJcbiAgICAgICAgICAgID8gKDEgLSBib3VuY2VPdXQoMSAtIDIgKiB4KSkgLyAyXHJcbiAgICAgICAgICAgIDogKDEgKyBib3VuY2VPdXQoMiAqIHggLSAxKSkgLyAyO1xyXG4gICAgfSxcclxufTtcclxuIiwgIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuQW5pbWF0aW9uID0gdm9pZCAwO1xyXG5jb25zdCB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xyXG5jb25zdCBlbnRpdHlfMSA9IHJlcXVpcmUoXCIuL2VudGl0eVwiKTtcclxuY29uc3QgZWFzaW5nXzEgPSByZXF1aXJlKFwiLi9lYXNpbmdcIik7XHJcbi8qKlxyXG4gKiBFcXVpdmFsZW50IG9mIFR3ZWVuXHJcbiAqL1xyXG5jbGFzcyBBbmltYXRpb24gZXh0ZW5kcyBlbnRpdHlfMS5FbnRpdHkge1xyXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcclxuICAgICAgICB0aGlzLmVhc2luZyA9IHNldHRpbmdzLmVhc2luZyA/PyBlYXNpbmdfMS5lYXNpbmdTZXQubGluZWFyO1xyXG4gICAgfVxyXG4gICAgb25TZXR1cCgpIHtcclxuICAgICAgICB0aGlzLnNldHRpbmdzLm9uU2V0dXA/LigpO1xyXG4gICAgfVxyXG4gICAgb25VcGRhdGUoKSB7XHJcbiAgICAgICAgaWYgKGVudGl0eV8xLkVudGl0eS5mcmFtZUNvdW50IC0gdGhpcy5fc3RhcnRGcmFtZSA+PSB0aGlzLnNldHRpbmdzLmR1cmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGVhcmRvd24oKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5vblVwZGF0ZT8uKCgwLCB1dGlsXzEubWFwKSh0aGlzLmVhc2luZygoZW50aXR5XzEuRW50aXR5LmZyYW1lQ291bnQgLSB0aGlzLl9zdGFydEZyYW1lKSAvIHRoaXMuc2V0dGluZ3MuZHVyYXRpb24pLCAwLCAxLCB0aGlzLnNldHRpbmdzLmZyb20sIHRoaXMuc2V0dGluZ3MudG8pKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBvblRlYXJkb3duKCkge1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3Mub25UZWFyZG93bj8uKCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5BbmltYXRpb24gPSBBbmltYXRpb247XHJcbiIsICJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLlBhcmFsbGVsID0gZXhwb3J0cy5TZXF1ZW5jZSA9IHZvaWQgMDtcclxuY29uc3QgZW50aXR5XzEgPSByZXF1aXJlKFwiLi9lbnRpdHlcIik7XHJcbmNsYXNzIFNlcXVlbmNlIGV4dGVuZHMgZW50aXR5XzEuRW50aXR5IHtcclxuICAgIGNvbnN0cnVjdG9yKGxpc3QpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMubGlzdCA9IGxpc3Q7XHJcbiAgICAgICAgdGhpcy5pbmRleCA9IDA7XHJcbiAgICB9XHJcbiAgICBvblNldHVwKCkge1xyXG4gICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgfVxyXG4gICAgbmV4dCgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbmRleCA+PSB0aGlzLmxpc3QubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGVhcmRvd24oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IGVudGl0eV8xLkVudGl0eS5yZXNvbHZlKHRoaXMubGlzdFt0aGlzLmluZGV4XSk7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudC5vbihcInRlYXJkb3duXCIsICgpID0+IHRoaXMubmV4dCgpKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLmN1cnJlbnQpO1xyXG4gICAgICAgICAgICB0aGlzLmluZGV4Kys7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuU2VxdWVuY2UgPSBTZXF1ZW5jZTtcclxuY2xhc3MgUGFyYWxsZWwgZXh0ZW5kcyBlbnRpdHlfMS5FbnRpdHkge1xyXG4gICAgY29uc3RydWN0b3IobGlzdCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5saXN0ID0gbGlzdDtcclxuICAgICAgICB0aGlzLmFkZENoaWxkKC4uLmxpc3QubWFwKGVudGl0eV8xLkVudGl0eS5yZXNvbHZlKSk7XHJcbiAgICB9XHJcbiAgICBvblVwZGF0ZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5jaGlsZHJlbi5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy50ZWFyZG93bigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnRzLlBhcmFsbGVsID0gUGFyYWxsZWw7XHJcbiIsICJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pKTtcclxudmFyIF9fZXhwb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19leHBvcnRTdGFyKSB8fCBmdW5jdGlvbihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGV4cG9ydHMsIHApKSBfX2NyZWF0ZUJpbmRpbmcoZXhwb3J0cywgbSwgcCk7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCJAZ2hvbS9ldmVudC1lbWl0dGVyXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL2FwcC9hbmltYXRpb25cIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vYXBwL2Vhc2luZ1wiKSwgZXhwb3J0cyk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9hcHAvZW50aXR5XCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL2FwcC90cmFuc2l0aW9uXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL2FwcC91dGlsXCIpLCBleHBvcnRzKTtcclxuIiwgIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuQmFzZSA9IHZvaWQgMDtcclxuY29uc3QgZW50aXR5X2Jhc2VfMSA9IHJlcXVpcmUoXCJAZ2hvbS9lbnRpdHktYmFzZVwiKTtcclxuY2xhc3MgQmFzZSBleHRlbmRzIGVudGl0eV9iYXNlXzEuRW50aXR5IHtcclxuICAgIGdldCB6SW5kZXgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3pJbmRleCA/PyB0aGlzLnBhcmVudD8uY2hpbGRyZW4uaW5kZXhPZih0aGlzKSA/PyAwO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBVc2VkIHRvIGJlIG92ZXJ3cml0dGVuIGJ5IHlvdXIgb3duIHdvcmtpbmdzXHJcbiAgICAgKi9cclxuICAgIG9uRHJhdygpIHsgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBVc2VkIHRvIGJlIG92ZXJ3cml0dGVuIGJ5IHlvdXIgb3duIHdvcmtpbmdzXHJcbiAgICAgKi9cclxuICAgIG9uTW91c2VSZWxlYXNlZCgpIHsgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBVc2VkIHRvIGJlIG92ZXJ3cml0dGVuIGJ5IHlvdXIgb3duIHdvcmtpbmdzXHJcbiAgICAgKi9cclxuICAgIG9uTW91c2VQcmVzc2VkKCkgeyB9XHJcbiAgICAvKipcclxuICAgICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcclxuICAgICAqL1xyXG4gICAgb25LZXlSZWxlYXNlZCgpIHsgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBVc2VkIHRvIGJlIG92ZXJ3cml0dGVuIGJ5IHlvdXIgb3duIHdvcmtpbmdzXHJcbiAgICAgKi9cclxuICAgIG9uS2V5UHJlc3NlZCgpIHsgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cclxuICAgICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXHJcbiAgICAgKi9cclxuICAgIGRyYXcoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTZXR1cCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vbkRyYXcoKSAhPT0gZmFsc2UpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zbWl0KFwiZHJhd1wiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgZHJhdyBpcyBjYWxsZWQgYmVmb3JlIHNldHVwIGluICR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjdXJyZW50IGVudGl0eSBpcyBhIHJvb3QuXHJcbiAgICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxyXG4gICAgICovXHJcbiAgICBtb3VzZVByZXNzZWQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTZXR1cCkge1xyXG4gICAgICAgICAgICB0aGlzLm9uTW91c2VQcmVzc2VkKCk7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNtaXQoXCJtb3VzZVByZXNzZWRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYG1vdXNlUHJlc3NlZCBpcyBjYWxsZWQgYmVmb3JlIHNldHVwIGluICR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjdXJyZW50IGVudGl0eSBpcyBhIHJvb3QuXHJcbiAgICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxyXG4gICAgICovXHJcbiAgICBtb3VzZVJlbGVhc2VkKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzU2V0dXApIHtcclxuICAgICAgICAgICAgdGhpcy5vbk1vdXNlUmVsZWFzZWQoKTtcclxuICAgICAgICAgICAgdGhpcy50cmFuc21pdChcIm1vdXNlUmVsZWFzZWRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYG1vdXNlUmVsZWFzZWQgaXMgY2FsbGVkIGJlZm9yZSBzZXR1cCBpbiAke3RoaXMuY29uc3RydWN0b3IubmFtZX1gKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxyXG4gICAgICogU2hvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiFcclxuICAgICAqL1xyXG4gICAga2V5UHJlc3NlZCgpIHtcclxuICAgICAgICBpZiAodGhpcy5pc1NldHVwKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25LZXlQcmVzc2VkKCk7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNtaXQoXCJrZXlQcmVzc2VkXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGBrZXlQcmVzc2VkIGlzIGNhbGxlZCBiZWZvcmUgc2V0dXAgaW4gJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cclxuICAgICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXHJcbiAgICAgKi9cclxuICAgIGtleVJlbGVhc2VkKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzU2V0dXApIHtcclxuICAgICAgICAgICAgdGhpcy5vbktleVJlbGVhc2VkKCk7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNtaXQoXCJrZXlSZWxlYXNlZFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2Fybihga2V5UmVsZWFzZWQgaXMgY2FsbGVkIGJlZm9yZSBzZXR1cCBpbiAke3RoaXMuY29uc3RydWN0b3IubmFtZX1gKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5CYXNlID0gQmFzZTtcclxuIiwgIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuRHJhd2FibGUgPSB2b2lkIDA7XHJcbmNvbnN0IGJhc2VfMSA9IHJlcXVpcmUoXCIuL2Jhc2VcIik7XHJcbmNsYXNzIERyYXdhYmxlIGV4dGVuZHMgYmFzZV8xLkJhc2Uge1xyXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcclxuICAgIH1cclxuICAgIG9uRHJhdygpIHtcclxuICAgICAgICBpZiAoIXRoaXMuc2V0dGluZ3MpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5maWxsKSB7XHJcbiAgICAgICAgICAgIGlmIChcImNvbG9yXCIgaW4gdGhpcy5zZXR0aW5ncy5maWxsKSB7XHJcbiAgICAgICAgICAgICAgICBmaWxsKHRoaXMuc2V0dGluZ3MuZmlsbC5jb2xvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmaWxsKHRoaXMuc2V0dGluZ3MuZmlsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIG5vRmlsbCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5zdHJva2UpIHtcclxuICAgICAgICAgICAgc3Ryb2tlV2VpZ2h0KHRoaXMuc2V0dGluZ3Muc3Ryb2tlLndlaWdodCk7XHJcbiAgICAgICAgICAgIHN0cm9rZSh0aGlzLnNldHRpbmdzLnN0cm9rZS5jb2xvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBub1N0cm9rZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy50ZXh0QWxpZ24pIHtcclxuICAgICAgICAgICAgdGV4dEFsaWduKHRoaXMuc2V0dGluZ3MudGV4dEFsaWduLngsIHRoaXMuc2V0dGluZ3MudGV4dEFsaWduLnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGV4dEFsaWduKENFTlRFUiwgQ0VOVEVSKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MudGV4dFNpemUpIHtcclxuICAgICAgICAgICAgdGV4dFNpemUodGhpcy5zZXR0aW5ncy50ZXh0U2l6ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0ZXh0U2l6ZShoZWlnaHQgKiAwLjEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnRzLkRyYXdhYmxlID0gRHJhd2FibGU7XHJcbiIsICJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLlRleHQgPSBleHBvcnRzLkltYWdlID0gZXhwb3J0cy5MaW5lID0gZXhwb3J0cy5FbGxpcHNlID0gZXhwb3J0cy5DaXJjbGUgPSBleHBvcnRzLlJlY3QgPSBleHBvcnRzLlNoYXBlID0gdm9pZCAwO1xyXG5jb25zdCBkcmF3YWJsZV8xID0gcmVxdWlyZShcIi4vZHJhd2FibGVcIik7XHJcbmNsYXNzIFNoYXBlIGV4dGVuZHMgZHJhd2FibGVfMS5EcmF3YWJsZSB7XHJcbiAgICBnZXQgY2VudGVyKCkge1xyXG4gICAgICAgIHJldHVybiBbdGhpcy5jZW50ZXJYLCB0aGlzLmNlbnRlclldO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuU2hhcGUgPSBTaGFwZTtcclxuY2xhc3MgUmVjdCBleHRlbmRzIFNoYXBlIHtcclxuICAgIGNvbnN0cnVjdG9yKHggPSAwLCB5ID0gMCwgd2lkdGggPSAwLCBoZWlnaHQgPSAwLCBvcHRpb25zKSB7XHJcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICAgIH1cclxuICAgIGdldCBjZW50ZXJYKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggKyB0aGlzLndpZHRoIC8gMjtcclxuICAgIH1cclxuICAgIGdldCBjZW50ZXJZKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnkgKyB0aGlzLmhlaWdodCAvIDI7XHJcbiAgICB9XHJcbiAgICBnZXQgaXNIb3ZlcmVkKCkge1xyXG4gICAgICAgIHJldHVybiAobW91c2VYID4gdGhpcy54ICYmXHJcbiAgICAgICAgICAgIG1vdXNlWCA8IHRoaXMueCArIHRoaXMud2lkdGggJiZcclxuICAgICAgICAgICAgbW91c2VZID4gdGhpcy55ICYmXHJcbiAgICAgICAgICAgIG1vdXNlWSA8IHRoaXMueSArIHRoaXMuaGVpZ2h0KTtcclxuICAgIH1cclxuICAgIG9uRHJhdygpIHtcclxuICAgICAgICBzdXBlci5vbkRyYXcoKTtcclxuICAgICAgICByZWN0KHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5SZWN0ID0gUmVjdDtcclxuY2xhc3MgQ2lyY2xlIGV4dGVuZHMgU2hhcGUge1xyXG4gICAgY29uc3RydWN0b3IoeCA9IDAsIHkgPSAwLCBkaWFtZXRlciA9IDAsIG9wdGlvbnMpIHtcclxuICAgICAgICBzdXBlcihvcHRpb25zKTtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy5kaWFtZXRlciA9IGRpYW1ldGVyO1xyXG4gICAgfVxyXG4gICAgZ2V0IHdpZHRoKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpYW1ldGVyO1xyXG4gICAgfVxyXG4gICAgZ2V0IGhlaWdodCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kaWFtZXRlcjtcclxuICAgIH1cclxuICAgIGdldCBjZW50ZXJYKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLng7XHJcbiAgICB9XHJcbiAgICBnZXQgY2VudGVyWSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy55O1xyXG4gICAgfVxyXG4gICAgZ2V0IGlzSG92ZXJlZCgpIHtcclxuICAgICAgICByZXR1cm4gZGlzdChtb3VzZVgsIG1vdXNlWSwgdGhpcy54LCB0aGlzLnkpIDwgdGhpcy5kaWFtZXRlciAvIDI7XHJcbiAgICB9XHJcbiAgICBvbkRyYXcoKSB7XHJcbiAgICAgICAgc3VwZXIub25EcmF3KCk7XHJcbiAgICAgICAgY2lyY2xlKHRoaXMueCwgdGhpcy55LCB0aGlzLmRpYW1ldGVyKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLkNpcmNsZSA9IENpcmNsZTtcclxuY2xhc3MgRWxsaXBzZSBleHRlbmRzIFJlY3Qge1xyXG4gICAgZ2V0IGNlbnRlclgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueDtcclxuICAgIH1cclxuICAgIGdldCBjZW50ZXJZKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnk7XHJcbiAgICB9XHJcbiAgICBnZXQgaXNIb3ZlcmVkKCkge1xyXG4gICAgICAgIHJldHVybiAoTWF0aC5wb3cobW91c2VYIC0gdGhpcy54LCAyKSAvIE1hdGgucG93KHRoaXMud2lkdGggLyAyLCAyKSArXHJcbiAgICAgICAgICAgIE1hdGgucG93KG1vdXNlWSAtIHRoaXMueSwgMikgLyBNYXRoLnBvdyh0aGlzLmhlaWdodCAvIDIsIDIpIDw9XHJcbiAgICAgICAgICAgIDEpO1xyXG4gICAgfVxyXG4gICAgb25EcmF3KCkge1xyXG4gICAgICAgIHN1cGVyLm9uRHJhdygpO1xyXG4gICAgICAgIGVsbGlwc2UodGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLkVsbGlwc2UgPSBFbGxpcHNlO1xyXG5jbGFzcyBMaW5lIGV4dGVuZHMgU2hhcGUge1xyXG4gICAgY29uc3RydWN0b3IoeCA9IDAsIHkgPSAwLCB4MiA9IDAsIHkyID0gMCwgb3B0aW9ucykge1xyXG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLngyID0geDI7XHJcbiAgICAgICAgdGhpcy55MiA9IHkyO1xyXG4gICAgfVxyXG4gICAgZ2V0IHdpZHRoKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLngyIC0gdGhpcy54O1xyXG4gICAgfVxyXG4gICAgZ2V0IGhlaWdodCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy55MiAtIHRoaXMueTtcclxuICAgIH1cclxuICAgIGdldCBzaXplKCkge1xyXG4gICAgICAgIHJldHVybiBkaXN0KHRoaXMueCwgdGhpcy55LCB0aGlzLngyLCB0aGlzLnkyKTtcclxuICAgIH1cclxuICAgIGdldCBjZW50ZXJYKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggKyB0aGlzLndpZHRoIC8gMjtcclxuICAgIH1cclxuICAgIGdldCBjZW50ZXJZKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnkgKyB0aGlzLmhlaWdodCAvIDI7XHJcbiAgICB9XHJcbiAgICBnZXQgaXNIb3ZlcmVkKCkge1xyXG4gICAgICAgIHJldHVybiAoZGlzdCh0aGlzLngsIHRoaXMueSwgbW91c2VYLCBtb3VzZVkpICtcclxuICAgICAgICAgICAgZGlzdChtb3VzZVgsIG1vdXNlWSwgdGhpcy54MiwgdGhpcy55MikgPD1cclxuICAgICAgICAgICAgdGhpcy5zaXplKTtcclxuICAgIH1cclxuICAgIG9uRHJhdygpIHtcclxuICAgICAgICBzdXBlci5vbkRyYXcoKTtcclxuICAgICAgICBsaW5lKHRoaXMueCwgdGhpcy55LCB0aGlzLngyLCB0aGlzLnkyKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLkxpbmUgPSBMaW5lO1xyXG5jbGFzcyBJbWFnZSBleHRlbmRzIFJlY3Qge1xyXG4gICAgY29uc3RydWN0b3IoaW1nLCB4ID0gMCwgeSA9IDAsIHdpZHRoLCBoZWlnaHQsIG9wdGlvbnMpIHtcclxuICAgICAgICBzdXBlcih4LCB5LCB3aWR0aCA/PyBpbWcud2lkdGgsIGhlaWdodCA/PyBpbWcuaGVpZ2h0LCBvcHRpb25zKTtcclxuICAgICAgICB0aGlzLmltZyA9IGltZztcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICB9XHJcbiAgICBvbkRyYXcoKSB7XHJcbiAgICAgICAgc3VwZXIub25EcmF3KCk7XHJcbiAgICAgICAgaW1hZ2UodGhpcy5pbWcsIHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5JbWFnZSA9IEltYWdlO1xyXG5jbGFzcyBUZXh0IGV4dGVuZHMgU2hhcGUge1xyXG4gICAgY29uc3RydWN0b3IodGV4dCA9IFwiXCIsIHggPSAwLCB5ID0gMCwgX3dpZHRoLCBfaGVpZ2h0LCBvcHRpb25zKSB7XHJcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy5fd2lkdGggPSBfd2lkdGg7XHJcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gX2hlaWdodDtcclxuICAgIH1cclxuICAgIGdldCB3aWR0aCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGggPz8gSW5maW5pdHk7XHJcbiAgICB9XHJcbiAgICBnZXQgaGVpZ2h0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9oZWlnaHQgPz8gSW5maW5pdHk7XHJcbiAgICB9XHJcbiAgICBnZXQgY2VudGVyWCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZXR0aW5ncz8udGV4dEFsaWduPy54ID09PSBDRU5URVJcclxuICAgICAgICAgICAgPyB0aGlzLnhcclxuICAgICAgICAgICAgOiB0aGlzLnggKyB0aGlzLndpZHRoIC8gMjtcclxuICAgIH1cclxuICAgIGdldCBjZW50ZXJZKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNldHRpbmdzPy50ZXh0QWxpZ24/LnkgPT09IENFTlRFUlxyXG4gICAgICAgICAgICA/IHRoaXMueVxyXG4gICAgICAgICAgICA6IHRoaXMueSArIHRoaXMuaGVpZ2h0IC8gMjtcclxuICAgIH1cclxuICAgIGdldCBpc0hvdmVyZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIChtb3VzZVggPiB0aGlzLmNlbnRlclggLSB3aWR0aCAvIDEwICYmXHJcbiAgICAgICAgICAgIG1vdXNlWCA8IHRoaXMuY2VudGVyWCArIHdpZHRoIC8gMTAgJiZcclxuICAgICAgICAgICAgbW91c2VZID4gdGhpcy5jZW50ZXJZIC0gaGVpZ2h0IC8gMTAgJiZcclxuICAgICAgICAgICAgbW91c2VZIDwgdGhpcy5jZW50ZXJYICsgaGVpZ2h0IC8gMTApO1xyXG4gICAgfVxyXG4gICAgb25EcmF3KCkge1xyXG4gICAgICAgIHN1cGVyLm9uRHJhdygpO1xyXG4gICAgICAgIHRleHQodGhpcy50ZXh0LCB0aGlzLngsIHRoaXMueSwgdGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5UZXh0ID0gVGV4dDtcclxuIiwgIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSkpO1xyXG52YXIgX19leHBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2V4cG9ydFN0YXIpIHx8IGZ1bmN0aW9uKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZXhwb3J0cywgcCkpIF9fY3JlYXRlQmluZGluZyhleHBvcnRzLCBtLCBwKTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIkBnaG9tL2VudGl0eS1iYXNlXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL2FwcC9iYXNlXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL2FwcC9kcmF3YWJsZVwiKSwgZXhwb3J0cyk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9hcHAvc2hhcGVcIiksIGV4cG9ydHMpO1xyXG4iLCAiLy8vIEB0cy1jaGVja1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9AdHlwZXMvcDUvZ2xvYmFsLmQudHNcIiAvPlxuXG5pbXBvcnQgeyBnYW1lIH0gZnJvbSBcIi4vYXBwL2dhbWVcIlxuaW1wb3J0IHsgQ3Vyc29yIH0gZnJvbSBcIi4vYXBwL2N1cnNvclwiXG5pbXBvcnQgeyBCYWxsb29ucyB9IGZyb20gXCIuL2FwcC9iYWxsb29uc1wiXG5pbXBvcnQgeyBCYWNrZ3JvdW5kIH0gZnJvbSBcIi4vYXBwL2JhY2tncm91bmRcIlxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgKGV2ZW50KSA9PiBldmVudC5wcmV2ZW50RGVmYXVsdCgpKVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0dXAoKSB7XG4gIGNyZWF0ZUNhbnZhcyhcbiAgICBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsIHdpbmRvdy5pbm5lcldpZHRoIHx8IDApLFxuICAgIE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKVxuICApXG5cbiAgZ2FtZS5hZGRDaGlsZChuZXcgQmFja2dyb3VuZCgpKVxuICBnYW1lLmFkZENoaWxkKG5ldyBCYWxsb29ucygxKSlcbiAgZ2FtZS5hZGRDaGlsZChuZXcgQ3Vyc29yKCkpXG5cbiAgZ2FtZS5zZXR1cCgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkcmF3KCkge1xuICBpZiAoIWdhbWUuaXNTZXR1cCkge1xuICAgIGZyYW1lUmF0ZSgwKVxuICAgIHJldHVyblxuICB9XG5cbiAgZ2FtZS5kcmF3KClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgaWYgKGdhbWUuaXNTZXR1cCkgZ2FtZS51cGRhdGUodHJ1ZSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGtleVByZXNzZWQoKSB7fVxuZXhwb3J0IGZ1bmN0aW9uIGtleVJlbGVhc2VkKCkge31cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZVByZXNzZWQoKSB7XG4gIGdhbWUubW91c2VQcmVzc2VkKClcbn1cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZVJlbGVhc2VkKCkge1xuICBnYW1lLm1vdXNlUmVsZWFzZWQoKVxufVxuXG4vKipcbiAqIGRlYnVnIGltcG9ydHMgKGFjY2Vzc2libGUgZnJvbSBmcm9udGVuZCBjb25zb2xlIHdpdGggYGFwcC5yb290YClcbiAqL1xuZXhwb3J0IGNvbnN0IHJvb3QgPSBnYW1lXG4iLCAiaW1wb3J0IHsgQmFzZSwgVGV4dCwgQW5pbWF0aW9uLCBEcmF3YWJsZVNldHRpbmdzIH0gZnJvbSBcIkBnaG9tL2VudGl0eS1wNVwiXG5cbmV4cG9ydCBjbGFzcyBHYW1lIGV4dGVuZHMgQmFzZSB7XG4gIHByaXZhdGUgX3Njb3JlID0gMFxuXG4gIGdldCBzY29yZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc2NvcmVcbiAgfVxuXG4gIHNldCBzY29yZShzY29yZSkge1xuICAgIGlmICh0aGlzLl9zY29yZSAhPT0gc2NvcmUpIHtcbiAgICAgIGNvbnN0IHNjb3JlVXAgPSBzY29yZSA+IHRoaXMuX3Njb3JlXG5cbiAgICAgIGNvbnN0IGJhc2VUZXh0U2l6ZSA9IGhlaWdodCAqIDAuMDVcblxuICAgICAgY29uc3Qgb3B0aW9uczogRHJhd2FibGVTZXR0aW5ncyA9IHtcbiAgICAgICAgc3Ryb2tlOiBmYWxzZSxcbiAgICAgICAgZmlsbDogY29sb3IoMTcwKSxcbiAgICAgICAgdGV4dFNpemU6IGJhc2VUZXh0U2l6ZSxcbiAgICAgICAgdGV4dEFsaWduOiB7XG4gICAgICAgICAgeDogQ0VOVEVSLFxuICAgICAgICAgIHk6IENFTlRFUixcbiAgICAgICAgfSxcbiAgICAgIH1cblxuICAgICAgY29uc3QgdGV4dCA9IG5ldyBUZXh0KFxuICAgICAgICBgU2NvcmU6ICR7c2NvcmV9YCxcbiAgICAgICAgd2lkdGggLyAyLFxuICAgICAgICBoZWlnaHQgKiAwLjEsXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICBvcHRpb25zXG4gICAgICApXG5cbiAgICAgIHRoaXMuYWRkQ2hpbGQoXG4gICAgICAgIG5ldyBBbmltYXRpb24oe1xuICAgICAgICAgIGZyb206IDAsXG4gICAgICAgICAgdG86IDEsXG4gICAgICAgICAgZHVyYXRpb246IDEwMCxcbiAgICAgICAgICBvblNldHVwOiAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKHRleHQpXG4gICAgICAgICAgfSxcbiAgICAgICAgICBvblVwZGF0ZTogKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBvcHRpb25zLnRleHRTaXplID0gYmFzZVRleHRTaXplICogTWF0aC5tYXgoMSwgdmFsdWUgKyAwLjUpXG4gICAgICAgICAgICBvcHRpb25zLmZpbGwgPSBzY29yZVVwXG4gICAgICAgICAgICAgID8gY29sb3IoMTAwLCAyNTUsIDI1NSwgKDEgLSB2YWx1ZSkgKiAyNTUpXG4gICAgICAgICAgICAgIDogY29sb3IoMjU1LCAxMDAsIDEwMCwgKDEgLSB2YWx1ZSkgKiAyNTUpXG4gICAgICAgICAgfSxcbiAgICAgICAgICBvblRlYXJkb3duOiAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUNoaWxkKHRleHQpXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcbiAgICAgIClcblxuICAgICAgdGhpcy5fc2NvcmUgPSBzY29yZVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKClcbiAgfVxuXG4gIG9uRHJhdygpIHtcbiAgICB0aGlzLmRyYXdTY29yZSgpXG4gICAgdGhpcy5kcmF3U2NoZW1hKClcbiAgfVxuXG4gIGRyYXdTY29yZSgpIHtcbiAgICBub1N0cm9rZSgpXG4gICAgZmlsbCgxNzApXG4gICAgdGV4dFNpemUoaGVpZ2h0ICogMC4wNSlcbiAgICB0ZXh0QWxpZ24oQ0VOVEVSLCBDRU5URVIpXG4gICAgdGV4dChgU2NvcmU6ICR7dGhpcy5zY29yZX1gLCB3aWR0aCAvIDIsIGhlaWdodCAqIDAuMSlcbiAgfVxuXG4gIGRyYXdTY2hlbWEoKSB7XG4gICAgbm9TdHJva2UoKVxuICAgIGZpbGwoOTApXG4gICAgdGV4dFNpemUoaGVpZ2h0ICogMC4wMilcbiAgICB0ZXh0QWxpZ24oTEVGVCwgVE9QKVxuICAgIHRleHQodGhpcy5zY2hlbWEoNSksIDIwLCAyMClcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZ2FtZSA9IG5ldyBHYW1lKClcbiIsICJpbXBvcnQge1xuICBDaXJjbGUsXG4gIEFuaW1hdGlvbixcbiAgZWFzaW5nU2V0LFxuICBQYXJhbGxlbCxcbiAgU2VxdWVuY2UsXG59IGZyb20gXCJAZ2hvbS9lbnRpdHktcDVcIlxuXG5jb25zdCBISVNUT1JZX0xFTkdUSCA9IDEwMFxuXG5leHBvcnQgY2xhc3MgQ3Vyc29yIGV4dGVuZHMgQ2lyY2xlIHtcbiAgcHVibGljIGhpc3Rvcnk6IFt4OiBudW1iZXIsIHk6IG51bWJlcl1bXSA9IFtdXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoMCwgMCwgMTUpXG4gIH1cblxuICBvblVwZGF0ZSgpIHtcbiAgICB0aGlzLmhpc3RvcnkucHVzaChbdGhpcy54LCB0aGlzLnldKVxuICAgIHRoaXMueCA9IG1vdXNlWFxuICAgIHRoaXMueSA9IG1vdXNlWVxuICAgIHdoaWxlICh0aGlzLmhpc3RvcnkubGVuZ3RoID4gSElTVE9SWV9MRU5HVEgpIHRoaXMuaGlzdG9yeS5zaGlmdCgpXG4gIH1cblxuICBvbkRyYXcoKSB7XG4gICAgbGV0IGxhc3QgPSB0aGlzLmhpc3RvcnlbMF1cbiAgICBmb3IgKGNvbnN0IHBvcyBvZiB0aGlzLmhpc3RvcnkpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5oaXN0b3J5LmluZGV4T2YocG9zKVxuICAgICAgc3Ryb2tlKGZsb29yKG1hcChpbmRleCwgdGhpcy5oaXN0b3J5Lmxlbmd0aCwgMCwgMjU1LCAwKSkpXG4gICAgICBzdHJva2VXZWlnaHQoZmxvb3IobWFwKGluZGV4LCB0aGlzLmhpc3RvcnkubGVuZ3RoLCAwLCB0aGlzLmRpYW1ldGVyLCAwKSkpXG4gICAgICBsaW5lKC4uLmxhc3QsIC4uLnBvcylcbiAgICAgIGxhc3QgPSBwb3NcbiAgICB9XG4gIH1cblxuICBvbk1vdXNlUmVsZWFzZWQoKSB7XG4gICAgY29uc3Qgc3Ryb2tlID0ge1xuICAgICAgY29sb3I6IGNvbG9yKDI1NSksXG4gICAgICB3ZWlnaHQ6IHRoaXMuZGlhbWV0ZXIgLyA0LFxuICAgIH1cbiAgICBjb25zdCBoYWxvID0gbmV3IENpcmNsZShtb3VzZVgsIG1vdXNlWSwgMCwge1xuICAgICAgZmlsbDogZmFsc2UsXG4gICAgICBzdHJva2UsXG4gICAgfSlcblxuICAgIHRoaXMuYWRkQ2hpbGQoXG4gICAgICBuZXcgQW5pbWF0aW9uKHtcbiAgICAgICAgZnJvbTogMCxcbiAgICAgICAgdG86IHRoaXMuZGlhbWV0ZXIgKiA1LFxuICAgICAgICBkdXJhdGlvbjogMjAwLFxuICAgICAgICBlYXNpbmc6IGVhc2luZ1NldC5lYXNlT3V0UXVhcnQsXG4gICAgICAgIG9uU2V0dXA6ICgpID0+IHRoaXMuYWRkQ2hpbGQoaGFsbyksXG4gICAgICAgIG9uVXBkYXRlOiAodmFsdWUpID0+IHtcbiAgICAgICAgICBoYWxvLmRpYW1ldGVyID0gdmFsdWVcbiAgICAgICAgICBzdHJva2UuY29sb3IgPSBjb2xvcihcbiAgICAgICAgICAgIDI1NSxcbiAgICAgICAgICAgICgodGhpcy5kaWFtZXRlciAqIDUgLSB2YWx1ZSkgLyAodGhpcy5kaWFtZXRlciAqIDUpKSAqIDI1NVxuICAgICAgICAgIClcbiAgICAgICAgfSxcbiAgICAgICAgb25UZWFyZG93bjogKCkgPT4gdGhpcy5yZW1vdmVDaGlsZChoYWxvKSxcbiAgICAgIH0pXG4gICAgKVxuICB9XG59XG4iLCAiaW1wb3J0IHsgQ2lyY2xlIH0gZnJvbSBcIkBnaG9tL2VudGl0eS1wNVwiXG5pbXBvcnQgeyBnYW1lIH0gZnJvbSBcIi4vZ2FtZVwiXG5cbmV4cG9ydCBjbGFzcyBCYWxsb29uIGV4dGVuZHMgQ2lyY2xlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIocmFuZG9tKDAsIHdpZHRoKSwgcmFuZG9tKDAsIGhlaWdodCksIHJhbmRvbSg0MCwgNjApLCB7XG4gICAgICBmaWxsOiBjb2xvcihyYW5kb20oMTAwLCAyMDApLCByYW5kb20oMTAwLCAyMDApLCByYW5kb20oMTAwLCAyMDApKSxcbiAgICAgIHN0cm9rZTogZmFsc2UsXG4gICAgfSlcbiAgfVxuXG4gIG9uVXBkYXRlKCkge1xuICAgIGlmICh0aGlzLmlzSG92ZXJlZCkge1xuICAgICAgdGhpcy5zZXR0aW5ncy5zdHJva2UgPSB7XG4gICAgICAgIGNvbG9yOiBjb2xvcigyNTUpLFxuICAgICAgICB3ZWlnaHQ6IDUsXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0dGluZ3Muc3Ryb2tlID0gZmFsc2VcbiAgICB9XG4gIH1cblxuICBvblRlYXJkb3duKCkge1xuICAgIGdhbWUuc2NvcmUrK1xuICB9XG5cbiAgb25Nb3VzZVJlbGVhc2VkKCkge1xuICAgIGlmICh0aGlzLmlzSG92ZXJlZCkge1xuICAgICAgaWYgKHRoaXMucGFyZW50LmNoaWxkcmVuLmxlbmd0aCA+IDEpXG4gICAgICAgIHRoaXMucGFyZW50LnN0b3BUcmFuc21pc3Npb24oXCJtb3VzZVJlbGVhc2VkXCIpXG5cbiAgICAgIHRoaXMucGFyZW50LmFkZENoaWxkKG5ldyBCYWxsb29uKCkpXG4gICAgICB0aGlzLnRlYXJkb3duKClcbiAgICB9XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBCYWxsb29uIH0gZnJvbSBcIi4vYmFsbG9vblwiXG5pbXBvcnQgeyBCYXNlIH0gZnJvbSBcIkBnaG9tL2VudGl0eS1wNVwiXG5cbmV4cG9ydCBjbGFzcyBCYWxsb29ucyBleHRlbmRzIEJhc2Uge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvdW50OiBudW1iZXIpIHtcbiAgICBzdXBlcigpXG4gIH1cblxuICBvblNldHVwKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jb3VudDsgaSsrKSB7XG4gICAgICB0aGlzLmFkZENoaWxkKG5ldyBCYWxsb29uKCkpXG4gICAgfVxuICB9XG59XG4iLCAiaW1wb3J0IHsgQmFzZSB9IGZyb20gXCJAZ2hvbS9lbnRpdHktcDVcIlxuXG5leHBvcnQgY2xhc3MgQmFja2dyb3VuZCBleHRlbmRzIEJhc2Uge1xuICBwcml2YXRlIG5vaXNlU2NhbGUgPSAwLjVcblxuICBvblVwZGF0ZSgpIHtcbiAgICBiYWNrZ3JvdW5kKDApXG4gICAgZm9yIChsZXQgeCA9IDA7IHggKiA1MCA8IHdpZHRoOyB4KyspIHtcbiAgICAgIGZvciAobGV0IHkgPSAwOyB5ICogNTAgPCBoZWlnaHQ7IHkrKykge1xuICAgICAgICBmaWxsKFxuICAgICAgICAgIG5vaXNlKFxuICAgICAgICAgICAgeCAqIHRoaXMubm9pc2VTY2FsZSxcbiAgICAgICAgICAgIHkgKiB0aGlzLm5vaXNlU2NhbGUgKyB0aGlzLmZyYW1lQ291bnQgLyAxMDBcbiAgICAgICAgICApICogMTAwXG4gICAgICAgIClcbiAgICAgICAgbm9TdHJva2UoKVxuICAgICAgICByZWN0KHggKiA1MCArIDIsIHkgKiA1MCArIDIsIDQ2LCA0NiwgNSlcbiAg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
