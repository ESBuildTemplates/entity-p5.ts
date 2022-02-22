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
      var Base3 = class extends entity_base_1.Entity {
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
      exports.Base = Base3;
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

  // src/index.ts
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  function setup() {
    createCanvas(Math.max(document.documentElement.clientWidth, window.innerWidth || 0), Math.max(document.documentElement.clientHeight, window.innerHeight || 0));
    game.addChild(new Balloons(1));
    game.addChild(new Cursor());
    game.setup();
  }
  function draw() {
    if (!game.isSetup) {
      frameRate(0);
      return;
    }
    background(20);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibm9kZV9tb2R1bGVzL0BnaG9tL2V2ZW50LWVtaXR0ZXIvZGlzdC9hcHAvZW1pdHRlci5qcyIsICJub2RlX21vZHVsZXMvQGdob20vZXZlbnQtZW1pdHRlci9kaXN0L2luZGV4LmpzIiwgIm5vZGVfbW9kdWxlcy9AZ2hvbS9lbnRpdHktYmFzZS9kaXN0L2FwcC91dGlsLmpzIiwgIm5vZGVfbW9kdWxlcy9AZ2hvbS9lbnRpdHktYmFzZS9kaXN0L2FwcC9lbnRpdHkuanMiLCAibm9kZV9tb2R1bGVzL0BnaG9tL2VudGl0eS1iYXNlL2Rpc3QvYXBwL2Vhc2luZy5qcyIsICJub2RlX21vZHVsZXMvQGdob20vZW50aXR5LWJhc2UvZGlzdC9hcHAvYW5pbWF0aW9uLmpzIiwgIm5vZGVfbW9kdWxlcy9AZ2hvbS9lbnRpdHktYmFzZS9kaXN0L2FwcC90cmFuc2l0aW9uLmpzIiwgIm5vZGVfbW9kdWxlcy9AZ2hvbS9lbnRpdHktYmFzZS9kaXN0L2luZGV4LmpzIiwgIm5vZGVfbW9kdWxlcy9AZ2hvbS9lbnRpdHktcDUvZGlzdC9hcHAvYmFzZS5qcyIsICJub2RlX21vZHVsZXMvQGdob20vZW50aXR5LXA1L2Rpc3QvYXBwL2RyYXdhYmxlLmpzIiwgIm5vZGVfbW9kdWxlcy9AZ2hvbS9lbnRpdHktcDUvZGlzdC9hcHAvc2hhcGUuanMiLCAibm9kZV9tb2R1bGVzL0BnaG9tL2VudGl0eS1wNS9kaXN0L2luZGV4LmpzIiwgInNyYy9pbmRleC50cyIsICJzcmMvYXBwL2dhbWUudHMiLCAic3JjL2FwcC9jdXJzb3IudHMiLCAic3JjL2FwcC9iYWxsb29uLnRzIiwgInNyYy9hcHAvYmFsbG9vbnMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuRXZlbnRFbWl0dGVyID0gdm9pZCAwO1xyXG5jbGFzcyBFdmVudEVtaXR0ZXIge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5fbGlzdGVuZXJzID0gW107XHJcbiAgICB9XHJcbiAgICBvbihuYW1lLCBydW4pIHtcclxuICAgICAgICB0aGlzLl9saXN0ZW5lcnMucHVzaCh7IG5hbWUsIHJ1biB9KTtcclxuICAgIH1cclxuICAgIG9uY2UobmFtZSwgcnVuKSB7XHJcbiAgICAgICAgdGhpcy5fbGlzdGVuZXJzLnB1c2goeyBuYW1lLCBydW4sIG9uY2U6IHRydWUgfSk7XHJcbiAgICB9XHJcbiAgICBvZmYobmFtZSwgcnVuKSB7XHJcbiAgICAgICAgaWYgKHJ1bilcclxuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzLmZpbHRlcigobCkgPT4gbC5ydW4gIT09IHJ1bik7XHJcbiAgICAgICAgZWxzZSBpZiAobmFtZSlcclxuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzLmZpbHRlcigobCkgPT4gbC5uYW1lICE9PSBuYW1lKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVycy5zcGxpY2UoMCwgdGhpcy5fbGlzdGVuZXJzLmxlbmd0aCk7XHJcbiAgICB9XHJcbiAgICBlbWl0KG5hbWUsIHBhcmFtcywgY29udGV4dCkge1xyXG4gICAgICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgdGhpcy5fbGlzdGVuZXJzKSB7XHJcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lci5uYW1lID09PSBuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lci5ydW4uYmluZChjb250ZXh0KSguLi5wYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyLm9uY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuX2xpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGdldExpc3RlbmVyc0J5TmFtZShuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3RlbmVycy5maWx0ZXIoKGxpc3RlbmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBsaXN0ZW5lci5uYW1lID09PSBuYW1lO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xyXG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KSk7XHJcbnZhciBfX2V4cG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9fZXhwb3J0U3RhcikgfHwgZnVuY3Rpb24obSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChleHBvcnRzLCBwKSkgX19jcmVhdGVCaW5kaW5nKGV4cG9ydHMsIG0sIHApO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9hcHAvZW1pdHRlclwiKSwgZXhwb3J0cyk7XHJcbiIsICJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmNvbnN0cmFpbiA9IGV4cG9ydHMubWFwID0gdm9pZCAwO1xyXG5mdW5jdGlvbiBtYXAobiwgc3RhcnQxLCBzdG9wMSwgc3RhcnQyLCBzdG9wMiwgd2l0aGluQm91bmRzID0gZmFsc2UpIHtcclxuICAgIGNvbnN0IG91dHB1dCA9ICgobiAtIHN0YXJ0MSkgLyAoc3RvcDEgLSBzdGFydDEpKSAqIChzdG9wMiAtIHN0YXJ0MikgKyBzdGFydDI7XHJcbiAgICBpZiAoIXdpdGhpbkJvdW5kcykge1xyXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XHJcbiAgICB9XHJcbiAgICBpZiAoc3RhcnQyIDwgc3RvcDIpIHtcclxuICAgICAgICByZXR1cm4gY29uc3RyYWluKG91dHB1dCwgc3RhcnQyLCBzdG9wMik7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gY29uc3RyYWluKG91dHB1dCwgc3RvcDIsIHN0YXJ0Mik7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5tYXAgPSBtYXA7XHJcbmZ1bmN0aW9uIGNvbnN0cmFpbihuLCBsb3csIGhpZ2gpIHtcclxuICAgIHJldHVybiBNYXRoLm1heChNYXRoLm1pbihuLCBoaWdoKSwgbG93KTtcclxufVxyXG5leHBvcnRzLmNvbnN0cmFpbiA9IGNvbnN0cmFpbjtcclxuIiwgIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuRW50aXR5ID0gdm9pZCAwO1xyXG5jb25zdCBldmVudF9lbWl0dGVyXzEgPSByZXF1aXJlKFwiQGdob20vZXZlbnQtZW1pdHRlclwiKTtcclxuY2xhc3MgRW50aXR5IGV4dGVuZHMgZXZlbnRfZW1pdHRlcl8xLkV2ZW50RW1pdHRlciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xyXG4gICAgICAgIHRoaXMuX3N0YXJ0RnJhbWUgPSAwO1xyXG4gICAgICAgIHRoaXMuX2lzU2V0dXAgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IG5ldyBTZXQoKTtcclxuICAgICAgICB0aGlzLl9zdG9wUG9pbnRzID0ge307XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYWRkRnJhbWUoKSB7XHJcbiAgICAgICAgdGhpcy5mcmFtZUNvdW50Kys7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcmVzb2x2ZShlbnRpdHkpIHtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIGVudGl0eSA9PT0gXCJmdW5jdGlvblwiID8gZW50aXR5KCkgOiBlbnRpdHk7XHJcbiAgICB9XHJcbiAgICBnZXQgZnJhbWVDb3VudCgpIHtcclxuICAgICAgICByZXR1cm4gRW50aXR5LmZyYW1lQ291bnQgLSB0aGlzLl9zdGFydEZyYW1lO1xyXG4gICAgfVxyXG4gICAgZ2V0IGlzU2V0dXAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzU2V0dXA7XHJcbiAgICB9XHJcbiAgICBnZXQgY2hpbGRyZW4oKSB7XHJcbiAgICAgICAgcmV0dXJuIFsuLi50aGlzLl9jaGlsZHJlbl07XHJcbiAgICB9XHJcbiAgICBnZXQgcGFyZW50KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcclxuICAgICAqL1xyXG4gICAgb25TZXR1cCgpIHsgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBVc2VkIHRvIGJlIG92ZXJ3cml0dGVuIGJ5IHlvdXIgb3duIHdvcmtpbmdzXHJcbiAgICAgKi9cclxuICAgIG9uVXBkYXRlKCkgeyB9XHJcbiAgICAvKipcclxuICAgICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcclxuICAgICAqL1xyXG4gICAgb25UZWFyZG93bigpIHsgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cclxuICAgICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXHJcbiAgICAgKi9cclxuICAgIHNldHVwKCkge1xyXG4gICAgICAgIHRoaXMuX3N0YXJ0RnJhbWUgPSBFbnRpdHkuZnJhbWVDb3VudDtcclxuICAgICAgICBpZiAoIXRoaXMuaXNTZXR1cCkge1xyXG4gICAgICAgICAgICB0aGlzLm9uU2V0dXAoKTtcclxuICAgICAgICAgICAgdGhpcy50cmFuc21pdChcInNldHVwXCIpO1xyXG4gICAgICAgICAgICB0aGlzLl9pc1NldHVwID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9IGlzIGFscmVhZHkgc2V0dXBgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxyXG4gICAgICogU2hvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiFcclxuICAgICAqL1xyXG4gICAgdXBkYXRlKGFkZEZyYW1lKSB7XHJcbiAgICAgICAgaWYgKGFkZEZyYW1lKVxyXG4gICAgICAgICAgICBFbnRpdHkuYWRkRnJhbWUoKTtcclxuICAgICAgICBpZiAodGhpcy5pc1NldHVwKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9uVXBkYXRlKCkgIT09IGZhbHNlKVxyXG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc21pdChcInVwZGF0ZVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgdXBkYXRlIGlzIGNhbGxlZCBiZWZvcmUgc2V0dXAgaW4gJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cclxuICAgICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXHJcbiAgICAgKi9cclxuICAgIHRlYXJkb3duKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzU2V0dXApIHtcclxuICAgICAgICAgICAgdGhpcy5faXNTZXR1cCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLm9uVGVhcmRvd24oKTtcclxuICAgICAgICAgICAgdGhpcy5fcGFyZW50Py5yZW1vdmVDaGlsZCh0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy50cmFuc21pdChcInRlYXJkb3duXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGB0ZWFyZG93biBpcyBjYWxsZWQgYmVmb3JlIHNldHVwIGluICR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGFkZENoaWxkKC4uLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZHJlbikge1xyXG4gICAgICAgICAgICBjaGlsZC5fcGFyZW50ID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW4uYWRkKGNoaWxkKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNTZXR1cClcclxuICAgICAgICAgICAgICAgIGNoaWxkLnNldHVwKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmVtb3ZlQ2hpbGQoLi4uY2hpbGRyZW4pIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIGlmIChjaGlsZC5pc1NldHVwKVxyXG4gICAgICAgICAgICAgICAgY2hpbGQudGVhcmRvd24oKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW4uZGVsZXRlKGNoaWxkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdG9wVHJhbnNtaXNzaW9uKG5hbWUpIHtcclxuICAgICAgICB0aGlzLl9zdG9wUG9pbnRzW25hbWVdID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIHRyYW5zbWl0KG5hbWUpIHtcclxuICAgICAgICB0aGlzLmVtaXQobmFtZSwgW10sIHRoaXMpO1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fc3RvcFBvaW50c1tuYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3RvcFBvaW50c1tuYW1lXSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgaWYgKG5hbWUgaW4gY2hpbGQgJiYgdHlwZW9mIGNoaWxkW25hbWVdID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgICAgICAgICBjaGlsZFtuYW1lXSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHNjaGVtYShpbmRlbnRhdGlvbiA9IDIsIGRlcHRoID0gMCwgaW5kZXggPSBudWxsKSB7XHJcbiAgICAgICAgcmV0dXJuIGAke1wiIFwiLnJlcGVhdChpbmRlbnRhdGlvbikucmVwZWF0KGRlcHRoKX0ke2luZGV4ID09PSBudWxsID8gXCJcIiA6IGAke2luZGV4fSAtIGB9JHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9IFske3RoaXMuZnJhbWVDb3VudH0gZnJhbWVzXSAke3RoaXMuX2NoaWxkcmVuLnNpemUgPiAwXHJcbiAgICAgICAgICAgID8gYCAoY2hpbGRyZW46ICR7dGhpcy5jaGlsZHJlbi5sZW5ndGh9KSR7dGhpcy5fbGlzdGVuZXJzLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAgID8gYCAobGlzdGVuZXJzOiAke3RoaXMuX2xpc3RlbmVycy5sZW5ndGh9KWBcclxuICAgICAgICAgICAgICAgIDogXCJcIn1cXG4ke3RoaXMuY2hpbGRyZW5cclxuICAgICAgICAgICAgICAgIC5tYXAoKGNoaWxkLCBpbmRleCkgPT4gYCR7Y2hpbGQuc2NoZW1hKGluZGVudGF0aW9uLCBkZXB0aCArIDEsIGluZGV4KX1gKVxyXG4gICAgICAgICAgICAgICAgLmpvaW4oXCJcXG5cIil9YFxyXG4gICAgICAgICAgICA6IFwiXCJ9YDtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLkVudGl0eSA9IEVudGl0eTtcclxuRW50aXR5LmZyYW1lQ291bnQgPSAwO1xyXG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XHJcbi8vIHNvdXJjZTogaHR0cHM6Ly9naXRodWIuY29tL2FpL2Vhc2luZ3MubmV0L2Jsb2IvbWFzdGVyL3NyYy9lYXNpbmdzL2Vhc2luZ3NGdW5jdGlvbnMudHNcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmVhc2luZ1NldCA9IHZvaWQgMDtcclxuY29uc3QgUEkgPSBNYXRoLlBJO1xyXG5jb25zdCBjMSA9IDEuNzAxNTg7XHJcbmNvbnN0IGMyID0gYzEgKiAxLjUyNTtcclxuY29uc3QgYzMgPSBjMSArIDE7XHJcbmNvbnN0IGM0ID0gKDIgKiBQSSkgLyAzO1xyXG5jb25zdCBjNSA9ICgyICogUEkpIC8gNC41O1xyXG5jb25zdCBib3VuY2VPdXQgPSBmdW5jdGlvbiAoeCkge1xyXG4gICAgY29uc3QgbjEgPSA3LjU2MjU7XHJcbiAgICBjb25zdCBkMSA9IDIuNzU7XHJcbiAgICBpZiAoeCA8IDEgLyBkMSkge1xyXG4gICAgICAgIHJldHVybiBuMSAqIHggKiB4O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoeCA8IDIgLyBkMSkge1xyXG4gICAgICAgIHJldHVybiBuMSAqICh4IC09IDEuNSAvIGQxKSAqIHggKyAwLjc1O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoeCA8IDIuNSAvIGQxKSB7XHJcbiAgICAgICAgcmV0dXJuIG4xICogKHggLT0gMi4yNSAvIGQxKSAqIHggKyAwLjkzNzU7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gbjEgKiAoeCAtPSAyLjYyNSAvIGQxKSAqIHggKyAwLjk4NDM3NTtcclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5lYXNpbmdTZXQgPSB7XHJcbiAgICBsaW5lYXI6ICh4KSA9PiB4LFxyXG4gICAgZWFzZUluUXVhZDogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4geCAqIHg7XHJcbiAgICB9LFxyXG4gICAgZWFzZU91dFF1YWQ6IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIDEgLSAoMSAtIHgpICogKDEgLSB4KTtcclxuICAgIH0sXHJcbiAgICBlYXNlSW5PdXRRdWFkOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiB4IDwgMC41ID8gMiAqIHggKiB4IDogMSAtIE1hdGgucG93KC0yICogeCArIDIsIDIpIC8gMjtcclxuICAgIH0sXHJcbiAgICBlYXNlSW5DdWJpYzogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4geCAqIHggKiB4O1xyXG4gICAgfSxcclxuICAgIGVhc2VPdXRDdWJpYzogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4gMSAtIE1hdGgucG93KDEgLSB4LCAzKTtcclxuICAgIH0sXHJcbiAgICBlYXNlSW5PdXRDdWJpYzogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4geCA8IDAuNSA/IDQgKiB4ICogeCAqIHggOiAxIC0gTWF0aC5wb3coLTIgKiB4ICsgMiwgMykgLyAyO1xyXG4gICAgfSxcclxuICAgIGVhc2VJblF1YXJ0OiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiB4ICogeCAqIHggKiB4O1xyXG4gICAgfSxcclxuICAgIGVhc2VPdXRRdWFydDogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4gMSAtIE1hdGgucG93KDEgLSB4LCA0KTtcclxuICAgIH0sXHJcbiAgICBlYXNlSW5PdXRRdWFydDogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4geCA8IDAuNSA/IDggKiB4ICogeCAqIHggKiB4IDogMSAtIE1hdGgucG93KC0yICogeCArIDIsIDQpIC8gMjtcclxuICAgIH0sXHJcbiAgICBlYXNlSW5RdWludDogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4geCAqIHggKiB4ICogeCAqIHg7XHJcbiAgICB9LFxyXG4gICAgZWFzZU91dFF1aW50OiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiAxIC0gTWF0aC5wb3coMSAtIHgsIDUpO1xyXG4gICAgfSxcclxuICAgIGVhc2VJbk91dFF1aW50OiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiB4IDwgMC41ID8gMTYgKiB4ICogeCAqIHggKiB4ICogeCA6IDEgLSBNYXRoLnBvdygtMiAqIHggKyAyLCA1KSAvIDI7XHJcbiAgICB9LFxyXG4gICAgZWFzZUluU2luZTogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4gMSAtIE1hdGguY29zKCh4ICogUEkpIC8gMik7XHJcbiAgICB9LFxyXG4gICAgZWFzZU91dFNpbmU6IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc2luKCh4ICogUEkpIC8gMik7XHJcbiAgICB9LFxyXG4gICAgZWFzZUluT3V0U2luZTogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4gLShNYXRoLmNvcyhQSSAqIHgpIC0gMSkgLyAyO1xyXG4gICAgfSxcclxuICAgIGVhc2VJbkV4cG86IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIHggPT09IDAgPyAwIDogTWF0aC5wb3coMiwgMTAgKiB4IC0gMTApO1xyXG4gICAgfSxcclxuICAgIGVhc2VPdXRFeHBvOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiB4ID09PSAxID8gMSA6IDEgLSBNYXRoLnBvdygyLCAtMTAgKiB4KTtcclxuICAgIH0sXHJcbiAgICBlYXNlSW5PdXRFeHBvOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiB4ID09PSAwXHJcbiAgICAgICAgICAgID8gMFxyXG4gICAgICAgICAgICA6IHggPT09IDFcclxuICAgICAgICAgICAgICAgID8gMVxyXG4gICAgICAgICAgICAgICAgOiB4IDwgMC41XHJcbiAgICAgICAgICAgICAgICAgICAgPyBNYXRoLnBvdygyLCAyMCAqIHggLSAxMCkgLyAyXHJcbiAgICAgICAgICAgICAgICAgICAgOiAoMiAtIE1hdGgucG93KDIsIC0yMCAqIHggKyAxMCkpIC8gMjtcclxuICAgIH0sXHJcbiAgICBlYXNlSW5DaXJjOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiAxIC0gTWF0aC5zcXJ0KDEgLSBNYXRoLnBvdyh4LCAyKSk7XHJcbiAgICB9LFxyXG4gICAgZWFzZU91dENpcmM6IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCgxIC0gTWF0aC5wb3coeCAtIDEsIDIpKTtcclxuICAgIH0sXHJcbiAgICBlYXNlSW5PdXRDaXJjOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiB4IDwgMC41XHJcbiAgICAgICAgICAgID8gKDEgLSBNYXRoLnNxcnQoMSAtIE1hdGgucG93KDIgKiB4LCAyKSkpIC8gMlxyXG4gICAgICAgICAgICA6IChNYXRoLnNxcnQoMSAtIE1hdGgucG93KC0yICogeCArIDIsIDIpKSArIDEpIC8gMjtcclxuICAgIH0sXHJcbiAgICBlYXNlSW5CYWNrOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiBjMyAqIHggKiB4ICogeCAtIGMxICogeCAqIHg7XHJcbiAgICB9LFxyXG4gICAgZWFzZU91dEJhY2s6IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIDEgKyBjMyAqIE1hdGgucG93KHggLSAxLCAzKSArIGMxICogTWF0aC5wb3coeCAtIDEsIDIpO1xyXG4gICAgfSxcclxuICAgIGVhc2VJbk91dEJhY2s6IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIHggPCAwLjVcclxuICAgICAgICAgICAgPyAoTWF0aC5wb3coMiAqIHgsIDIpICogKChjMiArIDEpICogMiAqIHggLSBjMikpIC8gMlxyXG4gICAgICAgICAgICA6IChNYXRoLnBvdygyICogeCAtIDIsIDIpICogKChjMiArIDEpICogKHggKiAyIC0gMikgKyBjMikgKyAyKSAvIDI7XHJcbiAgICB9LFxyXG4gICAgZWFzZUluRWxhc3RpYzogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4geCA9PT0gMFxyXG4gICAgICAgICAgICA/IDBcclxuICAgICAgICAgICAgOiB4ID09PSAxXHJcbiAgICAgICAgICAgICAgICA/IDFcclxuICAgICAgICAgICAgICAgIDogLU1hdGgucG93KDIsIDEwICogeCAtIDEwKSAqIE1hdGguc2luKCh4ICogMTAgLSAxMC43NSkgKiBjNCk7XHJcbiAgICB9LFxyXG4gICAgZWFzZU91dEVsYXN0aWM6IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIHggPT09IDBcclxuICAgICAgICAgICAgPyAwXHJcbiAgICAgICAgICAgIDogeCA9PT0gMVxyXG4gICAgICAgICAgICAgICAgPyAxXHJcbiAgICAgICAgICAgICAgICA6IE1hdGgucG93KDIsIC0xMCAqIHgpICogTWF0aC5zaW4oKHggKiAxMCAtIDAuNzUpICogYzQpICsgMTtcclxuICAgIH0sXHJcbiAgICBlYXNlSW5PdXRFbGFzdGljOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiB4ID09PSAwXHJcbiAgICAgICAgICAgID8gMFxyXG4gICAgICAgICAgICA6IHggPT09IDFcclxuICAgICAgICAgICAgICAgID8gMVxyXG4gICAgICAgICAgICAgICAgOiB4IDwgMC41XHJcbiAgICAgICAgICAgICAgICAgICAgPyAtKE1hdGgucG93KDIsIDIwICogeCAtIDEwKSAqIE1hdGguc2luKCgyMCAqIHggLSAxMS4xMjUpICogYzUpKSAvIDJcclxuICAgICAgICAgICAgICAgICAgICA6IChNYXRoLnBvdygyLCAtMjAgKiB4ICsgMTApICogTWF0aC5zaW4oKDIwICogeCAtIDExLjEyNSkgKiBjNSkpIC8gMiArIDE7XHJcbiAgICB9LFxyXG4gICAgZWFzZUluQm91bmNlOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiAxIC0gYm91bmNlT3V0KDEgLSB4KTtcclxuICAgIH0sXHJcbiAgICBlYXNlT3V0Qm91bmNlOiBib3VuY2VPdXQsXHJcbiAgICBlYXNlSW5PdXRCb3VuY2U6IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIHggPCAwLjVcclxuICAgICAgICAgICAgPyAoMSAtIGJvdW5jZU91dCgxIC0gMiAqIHgpKSAvIDJcclxuICAgICAgICAgICAgOiAoMSArIGJvdW5jZU91dCgyICogeCAtIDEpKSAvIDI7XHJcbiAgICB9LFxyXG59O1xyXG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5BbmltYXRpb24gPSB2b2lkIDA7XHJcbmNvbnN0IHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XHJcbmNvbnN0IGVudGl0eV8xID0gcmVxdWlyZShcIi4vZW50aXR5XCIpO1xyXG5jb25zdCBlYXNpbmdfMSA9IHJlcXVpcmUoXCIuL2Vhc2luZ1wiKTtcclxuLyoqXHJcbiAqIEVxdWl2YWxlbnQgb2YgVHdlZW5cclxuICovXHJcbmNsYXNzIEFuaW1hdGlvbiBleHRlbmRzIGVudGl0eV8xLkVudGl0eSB7XHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncykge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzO1xyXG4gICAgICAgIHRoaXMuZWFzaW5nID0gc2V0dGluZ3MuZWFzaW5nID8/IGVhc2luZ18xLmVhc2luZ1NldC5saW5lYXI7XHJcbiAgICB9XHJcbiAgICBvblNldHVwKCkge1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3Mub25TZXR1cD8uKCk7XHJcbiAgICB9XHJcbiAgICBvblVwZGF0ZSgpIHtcclxuICAgICAgICBpZiAoZW50aXR5XzEuRW50aXR5LmZyYW1lQ291bnQgLSB0aGlzLl9zdGFydEZyYW1lID49IHRoaXMuc2V0dGluZ3MuZHVyYXRpb24pIHtcclxuICAgICAgICAgICAgdGhpcy50ZWFyZG93bigpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzLm9uVXBkYXRlPy4oKDAsIHV0aWxfMS5tYXApKHRoaXMuZWFzaW5nKChlbnRpdHlfMS5FbnRpdHkuZnJhbWVDb3VudCAtIHRoaXMuX3N0YXJ0RnJhbWUpIC8gdGhpcy5zZXR0aW5ncy5kdXJhdGlvbiksIDAsIDEsIHRoaXMuc2V0dGluZ3MuZnJvbSwgdGhpcy5zZXR0aW5ncy50bykpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG9uVGVhcmRvd24oKSB7XHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5vblRlYXJkb3duPy4oKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLkFuaW1hdGlvbiA9IEFuaW1hdGlvbjtcclxuIiwgIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuUGFyYWxsZWwgPSBleHBvcnRzLlNlcXVlbmNlID0gdm9pZCAwO1xyXG5jb25zdCBlbnRpdHlfMSA9IHJlcXVpcmUoXCIuL2VudGl0eVwiKTtcclxuY2xhc3MgU2VxdWVuY2UgZXh0ZW5kcyBlbnRpdHlfMS5FbnRpdHkge1xyXG4gICAgY29uc3RydWN0b3IobGlzdCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5saXN0ID0gbGlzdDtcclxuICAgICAgICB0aGlzLmluZGV4ID0gMDtcclxuICAgIH1cclxuICAgIG9uU2V0dXAoKSB7XHJcbiAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICB9XHJcbiAgICBuZXh0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmluZGV4ID49IHRoaXMubGlzdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy50ZWFyZG93bigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gZW50aXR5XzEuRW50aXR5LnJlc29sdmUodGhpcy5saXN0W3RoaXMuaW5kZXhdKTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50Lm9uKFwidGVhcmRvd25cIiwgKCkgPT4gdGhpcy5uZXh0KCkpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuY3VycmVudCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5kZXgrKztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5TZXF1ZW5jZSA9IFNlcXVlbmNlO1xyXG5jbGFzcyBQYXJhbGxlbCBleHRlbmRzIGVudGl0eV8xLkVudGl0eSB7XHJcbiAgICBjb25zdHJ1Y3RvcihsaXN0KSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmxpc3QgPSBsaXN0O1xyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQoLi4ubGlzdC5tYXAoZW50aXR5XzEuRW50aXR5LnJlc29sdmUpKTtcclxuICAgIH1cclxuICAgIG9uVXBkYXRlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnRlYXJkb3duKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuUGFyYWxsZWwgPSBQYXJhbGxlbDtcclxuIiwgIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSkpO1xyXG52YXIgX19leHBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2V4cG9ydFN0YXIpIHx8IGZ1bmN0aW9uKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZXhwb3J0cywgcCkpIF9fY3JlYXRlQmluZGluZyhleHBvcnRzLCBtLCBwKTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIkBnaG9tL2V2ZW50LWVtaXR0ZXJcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vYXBwL2FuaW1hdGlvblwiKSwgZXhwb3J0cyk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9hcHAvZWFzaW5nXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL2FwcC9lbnRpdHlcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vYXBwL3RyYW5zaXRpb25cIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vYXBwL3V0aWxcIiksIGV4cG9ydHMpO1xyXG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5CYXNlID0gdm9pZCAwO1xyXG5jb25zdCBlbnRpdHlfYmFzZV8xID0gcmVxdWlyZShcIkBnaG9tL2VudGl0eS1iYXNlXCIpO1xyXG5jbGFzcyBCYXNlIGV4dGVuZHMgZW50aXR5X2Jhc2VfMS5FbnRpdHkge1xyXG4gICAgZ2V0IHpJbmRleCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fekluZGV4ID8/IHRoaXMucGFyZW50Py5jaGlsZHJlbi5pbmRleE9mKHRoaXMpID8/IDA7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcclxuICAgICAqL1xyXG4gICAgb25EcmF3KCkgeyB9XHJcbiAgICAvKipcclxuICAgICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcclxuICAgICAqL1xyXG4gICAgb25Nb3VzZVJlbGVhc2VkKCkgeyB9XHJcbiAgICAvKipcclxuICAgICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcclxuICAgICAqL1xyXG4gICAgb25Nb3VzZVByZXNzZWQoKSB7IH1cclxuICAgIC8qKlxyXG4gICAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xyXG4gICAgICovXHJcbiAgICBvbktleVJlbGVhc2VkKCkgeyB9XHJcbiAgICAvKipcclxuICAgICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcclxuICAgICAqL1xyXG4gICAgb25LZXlQcmVzc2VkKCkgeyB9XHJcbiAgICAvKipcclxuICAgICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxyXG4gICAgICogU2hvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiFcclxuICAgICAqL1xyXG4gICAgZHJhdygpIHtcclxuICAgICAgICBpZiAodGhpcy5pc1NldHVwKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9uRHJhdygpICE9PSBmYWxzZSlcclxuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNtaXQoXCJkcmF3XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGBkcmF3IGlzIGNhbGxlZCBiZWZvcmUgc2V0dXAgaW4gJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cclxuICAgICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXHJcbiAgICAgKi9cclxuICAgIG1vdXNlUHJlc3NlZCgpIHtcclxuICAgICAgICBpZiAodGhpcy5pc1NldHVwKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25Nb3VzZVByZXNzZWQoKTtcclxuICAgICAgICAgICAgdGhpcy50cmFuc21pdChcIm1vdXNlUHJlc3NlZFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgbW91c2VQcmVzc2VkIGlzIGNhbGxlZCBiZWZvcmUgc2V0dXAgaW4gJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cclxuICAgICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXHJcbiAgICAgKi9cclxuICAgIG1vdXNlUmVsZWFzZWQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTZXR1cCkge1xyXG4gICAgICAgICAgICB0aGlzLm9uTW91c2VSZWxlYXNlZCgpO1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zbWl0KFwibW91c2VSZWxlYXNlZFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgbW91c2VSZWxlYXNlZCBpcyBjYWxsZWQgYmVmb3JlIHNldHVwIGluICR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjdXJyZW50IGVudGl0eSBpcyBhIHJvb3QuXHJcbiAgICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxyXG4gICAgICovXHJcbiAgICBrZXlQcmVzc2VkKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzU2V0dXApIHtcclxuICAgICAgICAgICAgdGhpcy5vbktleVByZXNzZWQoKTtcclxuICAgICAgICAgICAgdGhpcy50cmFuc21pdChcImtleVByZXNzZWRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYGtleVByZXNzZWQgaXMgY2FsbGVkIGJlZm9yZSBzZXR1cCBpbiAke3RoaXMuY29uc3RydWN0b3IubmFtZX1gKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxyXG4gICAgICogU2hvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiFcclxuICAgICAqL1xyXG4gICAga2V5UmVsZWFzZWQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTZXR1cCkge1xyXG4gICAgICAgICAgICB0aGlzLm9uS2V5UmVsZWFzZWQoKTtcclxuICAgICAgICAgICAgdGhpcy50cmFuc21pdChcImtleVJlbGVhc2VkXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGBrZXlSZWxlYXNlZCBpcyBjYWxsZWQgYmVmb3JlIHNldHVwIGluICR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnRzLkJhc2UgPSBCYXNlO1xyXG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5EcmF3YWJsZSA9IHZvaWQgMDtcclxuY29uc3QgYmFzZV8xID0gcmVxdWlyZShcIi4vYmFzZVwiKTtcclxuY2xhc3MgRHJhd2FibGUgZXh0ZW5kcyBiYXNlXzEuQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncykge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzO1xyXG4gICAgfVxyXG4gICAgb25EcmF3KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5zZXR0aW5ncylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmZpbGwpIHtcclxuICAgICAgICAgICAgaWYgKFwiY29sb3JcIiBpbiB0aGlzLnNldHRpbmdzLmZpbGwpIHtcclxuICAgICAgICAgICAgICAgIGZpbGwodGhpcy5zZXR0aW5ncy5maWxsLmNvbG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZpbGwodGhpcy5zZXR0aW5ncy5maWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbm9GaWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLnN0cm9rZSkge1xyXG4gICAgICAgICAgICBzdHJva2VXZWlnaHQodGhpcy5zZXR0aW5ncy5zdHJva2Uud2VpZ2h0KTtcclxuICAgICAgICAgICAgc3Ryb2tlKHRoaXMuc2V0dGluZ3Muc3Ryb2tlLmNvbG9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIG5vU3Ryb2tlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLnRleHRBbGlnbikge1xyXG4gICAgICAgICAgICB0ZXh0QWxpZ24odGhpcy5zZXR0aW5ncy50ZXh0QWxpZ24ueCwgdGhpcy5zZXR0aW5ncy50ZXh0QWxpZ24ueSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0ZXh0QWxpZ24oQ0VOVEVSLCBDRU5URVIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy50ZXh0U2l6ZSkge1xyXG4gICAgICAgICAgICB0ZXh0U2l6ZSh0aGlzLnNldHRpbmdzLnRleHRTaXplKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRleHRTaXplKGhlaWdodCAqIDAuMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuRHJhd2FibGUgPSBEcmF3YWJsZTtcclxuIiwgIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuVGV4dCA9IGV4cG9ydHMuSW1hZ2UgPSBleHBvcnRzLkxpbmUgPSBleHBvcnRzLkVsbGlwc2UgPSBleHBvcnRzLkNpcmNsZSA9IGV4cG9ydHMuUmVjdCA9IGV4cG9ydHMuU2hhcGUgPSB2b2lkIDA7XHJcbmNvbnN0IGRyYXdhYmxlXzEgPSByZXF1aXJlKFwiLi9kcmF3YWJsZVwiKTtcclxuY2xhc3MgU2hhcGUgZXh0ZW5kcyBkcmF3YWJsZV8xLkRyYXdhYmxlIHtcclxuICAgIGdldCBjZW50ZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLmNlbnRlclgsIHRoaXMuY2VudGVyWV07XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5TaGFwZSA9IFNoYXBlO1xyXG5jbGFzcyBSZWN0IGV4dGVuZHMgU2hhcGUge1xyXG4gICAgY29uc3RydWN0b3IoeCA9IDAsIHkgPSAwLCB3aWR0aCA9IDAsIGhlaWdodCA9IDAsIG9wdGlvbnMpIHtcclxuICAgICAgICBzdXBlcihvcHRpb25zKTtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgfVxyXG4gICAgZ2V0IGNlbnRlclgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCArIHRoaXMud2lkdGggLyAyO1xyXG4gICAgfVxyXG4gICAgZ2V0IGNlbnRlclkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueSArIHRoaXMuaGVpZ2h0IC8gMjtcclxuICAgIH1cclxuICAgIGdldCBpc0hvdmVyZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIChtb3VzZVggPiB0aGlzLnggJiZcclxuICAgICAgICAgICAgbW91c2VYIDwgdGhpcy54ICsgdGhpcy53aWR0aCAmJlxyXG4gICAgICAgICAgICBtb3VzZVkgPiB0aGlzLnkgJiZcclxuICAgICAgICAgICAgbW91c2VZIDwgdGhpcy55ICsgdGhpcy5oZWlnaHQpO1xyXG4gICAgfVxyXG4gICAgb25EcmF3KCkge1xyXG4gICAgICAgIHN1cGVyLm9uRHJhdygpO1xyXG4gICAgICAgIHJlY3QodGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLlJlY3QgPSBSZWN0O1xyXG5jbGFzcyBDaXJjbGUgZXh0ZW5kcyBTaGFwZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih4ID0gMCwgeSA9IDAsIGRpYW1ldGVyID0gMCwgb3B0aW9ucykge1xyXG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLmRpYW1ldGVyID0gZGlhbWV0ZXI7XHJcbiAgICB9XHJcbiAgICBnZXQgd2lkdGgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlhbWV0ZXI7XHJcbiAgICB9XHJcbiAgICBnZXQgaGVpZ2h0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpYW1ldGVyO1xyXG4gICAgfVxyXG4gICAgZ2V0IGNlbnRlclgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueDtcclxuICAgIH1cclxuICAgIGdldCBjZW50ZXJZKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnk7XHJcbiAgICB9XHJcbiAgICBnZXQgaXNIb3ZlcmVkKCkge1xyXG4gICAgICAgIHJldHVybiBkaXN0KG1vdXNlWCwgbW91c2VZLCB0aGlzLngsIHRoaXMueSkgPCB0aGlzLmRpYW1ldGVyIC8gMjtcclxuICAgIH1cclxuICAgIG9uRHJhdygpIHtcclxuICAgICAgICBzdXBlci5vbkRyYXcoKTtcclxuICAgICAgICBjaXJjbGUodGhpcy54LCB0aGlzLnksIHRoaXMuZGlhbWV0ZXIpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuQ2lyY2xlID0gQ2lyY2xlO1xyXG5jbGFzcyBFbGxpcHNlIGV4dGVuZHMgUmVjdCB7XHJcbiAgICBnZXQgY2VudGVyWCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54O1xyXG4gICAgfVxyXG4gICAgZ2V0IGNlbnRlclkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueTtcclxuICAgIH1cclxuICAgIGdldCBpc0hvdmVyZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIChNYXRoLnBvdyhtb3VzZVggLSB0aGlzLngsIDIpIC8gTWF0aC5wb3codGhpcy53aWR0aCAvIDIsIDIpICtcclxuICAgICAgICAgICAgTWF0aC5wb3cobW91c2VZIC0gdGhpcy55LCAyKSAvIE1hdGgucG93KHRoaXMuaGVpZ2h0IC8gMiwgMikgPD1cclxuICAgICAgICAgICAgMSk7XHJcbiAgICB9XHJcbiAgICBvbkRyYXcoKSB7XHJcbiAgICAgICAgc3VwZXIub25EcmF3KCk7XHJcbiAgICAgICAgZWxsaXBzZSh0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuRWxsaXBzZSA9IEVsbGlwc2U7XHJcbmNsYXNzIExpbmUgZXh0ZW5kcyBTaGFwZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih4ID0gMCwgeSA9IDAsIHgyID0gMCwgeTIgPSAwLCBvcHRpb25zKSB7XHJcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMueDIgPSB4MjtcclxuICAgICAgICB0aGlzLnkyID0geTI7XHJcbiAgICB9XHJcbiAgICBnZXQgd2lkdGgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueDIgLSB0aGlzLng7XHJcbiAgICB9XHJcbiAgICBnZXQgaGVpZ2h0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnkyIC0gdGhpcy55O1xyXG4gICAgfVxyXG4gICAgZ2V0IHNpemUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGRpc3QodGhpcy54LCB0aGlzLnksIHRoaXMueDIsIHRoaXMueTIpO1xyXG4gICAgfVxyXG4gICAgZ2V0IGNlbnRlclgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCArIHRoaXMud2lkdGggLyAyO1xyXG4gICAgfVxyXG4gICAgZ2V0IGNlbnRlclkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueSArIHRoaXMuaGVpZ2h0IC8gMjtcclxuICAgIH1cclxuICAgIGdldCBpc0hvdmVyZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIChkaXN0KHRoaXMueCwgdGhpcy55LCBtb3VzZVgsIG1vdXNlWSkgK1xyXG4gICAgICAgICAgICBkaXN0KG1vdXNlWCwgbW91c2VZLCB0aGlzLngyLCB0aGlzLnkyKSA8PVxyXG4gICAgICAgICAgICB0aGlzLnNpemUpO1xyXG4gICAgfVxyXG4gICAgb25EcmF3KCkge1xyXG4gICAgICAgIHN1cGVyLm9uRHJhdygpO1xyXG4gICAgICAgIGxpbmUodGhpcy54LCB0aGlzLnksIHRoaXMueDIsIHRoaXMueTIpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuTGluZSA9IExpbmU7XHJcbmNsYXNzIEltYWdlIGV4dGVuZHMgUmVjdCB7XHJcbiAgICBjb25zdHJ1Y3RvcihpbWcsIHggPSAwLCB5ID0gMCwgd2lkdGgsIGhlaWdodCwgb3B0aW9ucykge1xyXG4gICAgICAgIHN1cGVyKHgsIHksIHdpZHRoID8/IGltZy53aWR0aCwgaGVpZ2h0ID8/IGltZy5oZWlnaHQsIG9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMuaW1nID0gaW1nO1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgIH1cclxuICAgIG9uRHJhdygpIHtcclxuICAgICAgICBzdXBlci5vbkRyYXcoKTtcclxuICAgICAgICBpbWFnZSh0aGlzLmltZywgdGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLkltYWdlID0gSW1hZ2U7XHJcbmNsYXNzIFRleHQgZXh0ZW5kcyBTaGFwZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0ZXh0ID0gXCJcIiwgeCA9IDAsIHkgPSAwLCBfd2lkdGgsIF9oZWlnaHQsIG9wdGlvbnMpIHtcclxuICAgICAgICBzdXBlcihvcHRpb25zKTtcclxuICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLl93aWR0aCA9IF93aWR0aDtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSBfaGVpZ2h0O1xyXG4gICAgfVxyXG4gICAgZ2V0IHdpZHRoKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl93aWR0aCA/PyBJbmZpbml0eTtcclxuICAgIH1cclxuICAgIGdldCBoZWlnaHQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hlaWdodCA/PyBJbmZpbml0eTtcclxuICAgIH1cclxuICAgIGdldCBjZW50ZXJYKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNldHRpbmdzPy50ZXh0QWxpZ24/LnggPT09IENFTlRFUlxyXG4gICAgICAgICAgICA/IHRoaXMueFxyXG4gICAgICAgICAgICA6IHRoaXMueCArIHRoaXMud2lkdGggLyAyO1xyXG4gICAgfVxyXG4gICAgZ2V0IGNlbnRlclkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0dGluZ3M/LnRleHRBbGlnbj8ueSA9PT0gQ0VOVEVSXHJcbiAgICAgICAgICAgID8gdGhpcy55XHJcbiAgICAgICAgICAgIDogdGhpcy55ICsgdGhpcy5oZWlnaHQgLyAyO1xyXG4gICAgfVxyXG4gICAgZ2V0IGlzSG92ZXJlZCgpIHtcclxuICAgICAgICByZXR1cm4gKG1vdXNlWCA+IHRoaXMuY2VudGVyWCAtIHdpZHRoIC8gMTAgJiZcclxuICAgICAgICAgICAgbW91c2VYIDwgdGhpcy5jZW50ZXJYICsgd2lkdGggLyAxMCAmJlxyXG4gICAgICAgICAgICBtb3VzZVkgPiB0aGlzLmNlbnRlclkgLSBoZWlnaHQgLyAxMCAmJlxyXG4gICAgICAgICAgICBtb3VzZVkgPCB0aGlzLmNlbnRlclggKyBoZWlnaHQgLyAxMCk7XHJcbiAgICB9XHJcbiAgICBvbkRyYXcoKSB7XHJcbiAgICAgICAgc3VwZXIub25EcmF3KCk7XHJcbiAgICAgICAgdGV4dCh0aGlzLnRleHQsIHRoaXMueCwgdGhpcy55LCB0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLlRleHQgPSBUZXh0O1xyXG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KSk7XHJcbnZhciBfX2V4cG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9fZXhwb3J0U3RhcikgfHwgZnVuY3Rpb24obSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChleHBvcnRzLCBwKSkgX19jcmVhdGVCaW5kaW5nKGV4cG9ydHMsIG0sIHApO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiQGdob20vZW50aXR5LWJhc2VcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vYXBwL2Jhc2VcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vYXBwL2RyYXdhYmxlXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL2FwcC9zaGFwZVwiKSwgZXhwb3J0cyk7XHJcbiIsICIvLy8gQHRzLWNoZWNrXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL0B0eXBlcy9wNS9nbG9iYWwuZC50c1wiIC8+XG5cbmltcG9ydCB7IGdhbWUgfSBmcm9tIFwiLi9hcHAvZ2FtZVwiXG5pbXBvcnQgeyBDdXJzb3IgfSBmcm9tIFwiLi9hcHAvY3Vyc29yXCJcbmltcG9ydCB7IEJhbGxvb25zIH0gZnJvbSBcIi4vYXBwL2JhbGxvb25zXCJcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIChldmVudCkgPT4gZXZlbnQucHJldmVudERlZmF1bHQoKSlcblxuZXhwb3J0IGZ1bmN0aW9uIHNldHVwKCkge1xuICBjcmVhdGVDYW52YXMoXG4gICAgTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKSxcbiAgICBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0LCB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgMClcbiAgKVxuXG4gIGdhbWUuYWRkQ2hpbGQobmV3IEJhbGxvb25zKDEpKVxuICBnYW1lLmFkZENoaWxkKG5ldyBDdXJzb3IoKSlcblxuICBnYW1lLnNldHVwKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRyYXcoKSB7XG4gIGlmICghZ2FtZS5pc1NldHVwKSB7XG4gICAgZnJhbWVSYXRlKDApXG4gICAgcmV0dXJuXG4gIH1cblxuICBiYWNrZ3JvdW5kKDIwKVxuXG4gIGdhbWUuZHJhdygpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gIGlmIChnYW1lLmlzU2V0dXApIGdhbWUudXBkYXRlKHRydWUpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBrZXlQcmVzc2VkKCkge31cbmV4cG9ydCBmdW5jdGlvbiBrZXlSZWxlYXNlZCgpIHt9XG5leHBvcnQgZnVuY3Rpb24gbW91c2VQcmVzc2VkKCkge1xuICBnYW1lLm1vdXNlUHJlc3NlZCgpXG59XG5leHBvcnQgZnVuY3Rpb24gbW91c2VSZWxlYXNlZCgpIHtcbiAgZ2FtZS5tb3VzZVJlbGVhc2VkKClcbn1cblxuLyoqXG4gKiBkZWJ1ZyBpbXBvcnRzIChhY2Nlc3NpYmxlIGZyb20gZnJvbnRlbmQgY29uc29sZSB3aXRoIGBhcHAucm9vdGApXG4gKi9cbmV4cG9ydCBjb25zdCByb290ID0gZ2FtZVxuIiwgImltcG9ydCB7IEJhc2UsIFRleHQsIEFuaW1hdGlvbiwgRHJhd2FibGVTZXR0aW5ncyB9IGZyb20gXCJAZ2hvbS9lbnRpdHktcDVcIlxuXG5leHBvcnQgY2xhc3MgR2FtZSBleHRlbmRzIEJhc2Uge1xuICBwcml2YXRlIF9zY29yZSA9IDBcblxuICBnZXQgc2NvcmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Njb3JlXG4gIH1cblxuICBzZXQgc2NvcmUoc2NvcmUpIHtcbiAgICBpZiAodGhpcy5fc2NvcmUgIT09IHNjb3JlKSB7XG4gICAgICBjb25zdCBzY29yZVVwID0gc2NvcmUgPiB0aGlzLl9zY29yZVxuXG4gICAgICBjb25zdCBiYXNlVGV4dFNpemUgPSBoZWlnaHQgKiAwLjA1XG5cbiAgICAgIGNvbnN0IG9wdGlvbnM6IERyYXdhYmxlU2V0dGluZ3MgPSB7XG4gICAgICAgIHN0cm9rZTogZmFsc2UsXG4gICAgICAgIGZpbGw6IGNvbG9yKDE3MCksXG4gICAgICAgIHRleHRTaXplOiBiYXNlVGV4dFNpemUsXG4gICAgICAgIHRleHRBbGlnbjoge1xuICAgICAgICAgIHg6IENFTlRFUixcbiAgICAgICAgICB5OiBDRU5URVIsXG4gICAgICAgIH0sXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRleHQgPSBuZXcgVGV4dChcbiAgICAgICAgYFNjb3JlOiAke3Njb3JlfWAsXG4gICAgICAgIHdpZHRoIC8gMixcbiAgICAgICAgaGVpZ2h0ICogMC4xLFxuICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgb3B0aW9uc1xuICAgICAgKVxuXG4gICAgICB0aGlzLmFkZENoaWxkKFxuICAgICAgICBuZXcgQW5pbWF0aW9uKHtcbiAgICAgICAgICBmcm9tOiAwLFxuICAgICAgICAgIHRvOiAxLFxuICAgICAgICAgIGR1cmF0aW9uOiAxMDAsXG4gICAgICAgICAgb25TZXR1cDogKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZCh0ZXh0KVxuICAgICAgICAgIH0sXG4gICAgICAgICAgb25VcGRhdGU6ICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgb3B0aW9ucy50ZXh0U2l6ZSA9IGJhc2VUZXh0U2l6ZSAqIE1hdGgubWF4KDEsIHZhbHVlICsgMC41KVxuICAgICAgICAgICAgb3B0aW9ucy5maWxsID0gc2NvcmVVcFxuICAgICAgICAgICAgICA/IGNvbG9yKDEwMCwgMjU1LCAyNTUsICgxIC0gdmFsdWUpICogMjU1KVxuICAgICAgICAgICAgICA6IGNvbG9yKDI1NSwgMTAwLCAxMDAsICgxIC0gdmFsdWUpICogMjU1KVxuICAgICAgICAgIH0sXG4gICAgICAgICAgb25UZWFyZG93bjogKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVDaGlsZCh0ZXh0KVxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICApXG5cbiAgICAgIHRoaXMuX3Njb3JlID0gc2NvcmVcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpXG4gIH1cblxuICBvbkRyYXcoKSB7XG4gICAgdGhpcy5kcmF3U2NvcmUoKVxuICAgIHRoaXMuZHJhd1NjaGVtYSgpXG4gIH1cblxuICBkcmF3U2NvcmUoKSB7XG4gICAgbm9TdHJva2UoKVxuICAgIGZpbGwoMTcwKVxuICAgIHRleHRTaXplKGhlaWdodCAqIDAuMDUpXG4gICAgdGV4dEFsaWduKENFTlRFUiwgQ0VOVEVSKVxuICAgIHRleHQoYFNjb3JlOiAke3RoaXMuc2NvcmV9YCwgd2lkdGggLyAyLCBoZWlnaHQgKiAwLjEpXG4gIH1cblxuICBkcmF3U2NoZW1hKCkge1xuICAgIG5vU3Ryb2tlKClcbiAgICBmaWxsKDkwKVxuICAgIHRleHRTaXplKGhlaWdodCAqIDAuMDIpXG4gICAgdGV4dEFsaWduKExFRlQsIFRPUClcbiAgICB0ZXh0KHRoaXMuc2NoZW1hKDUpLCAyMCwgMjApXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGdhbWUgPSBuZXcgR2FtZSgpXG4iLCAiaW1wb3J0IHtcbiAgQ2lyY2xlLFxuICBBbmltYXRpb24sXG4gIGVhc2luZ1NldCxcbiAgUGFyYWxsZWwsXG4gIFNlcXVlbmNlLFxufSBmcm9tIFwiQGdob20vZW50aXR5LXA1XCJcblxuY29uc3QgSElTVE9SWV9MRU5HVEggPSAxMDBcblxuZXhwb3J0IGNsYXNzIEN1cnNvciBleHRlbmRzIENpcmNsZSB7XG4gIHB1YmxpYyBoaXN0b3J5OiBbeDogbnVtYmVyLCB5OiBudW1iZXJdW10gPSBbXVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKDAsIDAsIDE1KVxuICB9XG5cbiAgb25VcGRhdGUoKSB7XG4gICAgdGhpcy5oaXN0b3J5LnB1c2goW3RoaXMueCwgdGhpcy55XSlcbiAgICB0aGlzLnggPSBtb3VzZVhcbiAgICB0aGlzLnkgPSBtb3VzZVlcbiAgICB3aGlsZSAodGhpcy5oaXN0b3J5Lmxlbmd0aCA+IEhJU1RPUllfTEVOR1RIKSB0aGlzLmhpc3Rvcnkuc2hpZnQoKVxuICB9XG5cbiAgb25EcmF3KCkge1xuICAgIGxldCBsYXN0ID0gdGhpcy5oaXN0b3J5WzBdXG4gICAgZm9yIChjb25zdCBwb3Mgb2YgdGhpcy5oaXN0b3J5KSB7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuaGlzdG9yeS5pbmRleE9mKHBvcylcbiAgICAgIHN0cm9rZShmbG9vcihtYXAoaW5kZXgsIHRoaXMuaGlzdG9yeS5sZW5ndGgsIDAsIDI1NSwgMCkpKVxuICAgICAgc3Ryb2tlV2VpZ2h0KGZsb29yKG1hcChpbmRleCwgdGhpcy5oaXN0b3J5Lmxlbmd0aCwgMCwgdGhpcy5kaWFtZXRlciwgMCkpKVxuICAgICAgbGluZSguLi5sYXN0LCAuLi5wb3MpXG4gICAgICBsYXN0ID0gcG9zXG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZVJlbGVhc2VkKCkge1xuICAgIGNvbnN0IHN0cm9rZSA9IHtcbiAgICAgIGNvbG9yOiBjb2xvcigyNTUpLFxuICAgICAgd2VpZ2h0OiB0aGlzLmRpYW1ldGVyIC8gNCxcbiAgICB9XG4gICAgY29uc3QgaGFsbyA9IG5ldyBDaXJjbGUobW91c2VYLCBtb3VzZVksIDAsIHtcbiAgICAgIGZpbGw6IGZhbHNlLFxuICAgICAgc3Ryb2tlLFxuICAgIH0pXG5cbiAgICB0aGlzLmFkZENoaWxkKFxuICAgICAgbmV3IEFuaW1hdGlvbih7XG4gICAgICAgIGZyb206IDAsXG4gICAgICAgIHRvOiB0aGlzLmRpYW1ldGVyICogNSxcbiAgICAgICAgZHVyYXRpb246IDIwMCxcbiAgICAgICAgZWFzaW5nOiBlYXNpbmdTZXQuZWFzZU91dFF1YXJ0LFxuICAgICAgICBvblNldHVwOiAoKSA9PiB0aGlzLmFkZENoaWxkKGhhbG8pLFxuICAgICAgICBvblVwZGF0ZTogKHZhbHVlKSA9PiB7XG4gICAgICAgICAgaGFsby5kaWFtZXRlciA9IHZhbHVlXG4gICAgICAgICAgc3Ryb2tlLmNvbG9yID0gY29sb3IoXG4gICAgICAgICAgICAyNTUsXG4gICAgICAgICAgICAoKHRoaXMuZGlhbWV0ZXIgKiA1IC0gdmFsdWUpIC8gKHRoaXMuZGlhbWV0ZXIgKiA1KSkgKiAyNTVcbiAgICAgICAgICApXG4gICAgICAgIH0sXG4gICAgICAgIG9uVGVhcmRvd246ICgpID0+IHRoaXMucmVtb3ZlQ2hpbGQoaGFsbyksXG4gICAgICB9KVxuICAgIClcbiAgfVxufVxuIiwgImltcG9ydCB7IENpcmNsZSB9IGZyb20gXCJAZ2hvbS9lbnRpdHktcDVcIlxuaW1wb3J0IHsgZ2FtZSB9IGZyb20gXCIuL2dhbWVcIlxuXG5leHBvcnQgY2xhc3MgQmFsbG9vbiBleHRlbmRzIENpcmNsZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHJhbmRvbSgwLCB3aWR0aCksIHJhbmRvbSgwLCBoZWlnaHQpLCByYW5kb20oNDAsIDYwKSwge1xuICAgICAgZmlsbDogY29sb3IocmFuZG9tKDEwMCwgMjAwKSwgcmFuZG9tKDEwMCwgMjAwKSwgcmFuZG9tKDEwMCwgMjAwKSksXG4gICAgICBzdHJva2U6IGZhbHNlLFxuICAgIH0pXG4gIH1cblxuICBvblVwZGF0ZSgpIHtcbiAgICBpZiAodGhpcy5pc0hvdmVyZWQpIHtcbiAgICAgIHRoaXMuc2V0dGluZ3Muc3Ryb2tlID0ge1xuICAgICAgICBjb2xvcjogY29sb3IoMjU1KSxcbiAgICAgICAgd2VpZ2h0OiA1LFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldHRpbmdzLnN0cm9rZSA9IGZhbHNlXG4gICAgfVxuICB9XG5cbiAgb25UZWFyZG93bigpIHtcbiAgICBnYW1lLnNjb3JlKytcbiAgfVxuXG4gIG9uTW91c2VSZWxlYXNlZCgpIHtcbiAgICBpZiAodGhpcy5pc0hvdmVyZWQpIHtcbiAgICAgIGlmICh0aGlzLnBhcmVudC5jaGlsZHJlbi5sZW5ndGggPiAxKVxuICAgICAgICB0aGlzLnBhcmVudC5zdG9wVHJhbnNtaXNzaW9uKFwibW91c2VSZWxlYXNlZFwiKVxuXG4gICAgICB0aGlzLnBhcmVudC5hZGRDaGlsZChuZXcgQmFsbG9vbigpKVxuICAgICAgdGhpcy50ZWFyZG93bigpXG4gICAgfVxuICB9XG59XG4iLCAiaW1wb3J0IHsgQmFsbG9vbiB9IGZyb20gXCIuL2JhbGxvb25cIlxuaW1wb3J0IHsgQmFzZSB9IGZyb20gXCJAZ2hvbS9lbnRpdHktcDVcIlxuXG5leHBvcnQgY2xhc3MgQmFsbG9vbnMgZXh0ZW5kcyBCYXNlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjb3VudDogbnVtYmVyKSB7XG4gICAgc3VwZXIoKVxuICB9XG5cbiAgb25TZXR1cCgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY291bnQ7IGkrKykge1xuICAgICAgdGhpcy5hZGRDaGlsZChuZXcgQmFsbG9vbigpKVxuICAgIH1cbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQ0EsYUFBTyxlQUFlLFNBQVMsY0FBYyxFQUFFLE9BQU87QUFDdEQsY0FBUSxlQUFlO0FBQ3ZCLCtCQUFtQjtBQUFBLFFBQ2YsY0FBYztBQUNWLGVBQUssYUFBYTtBQUFBO0FBQUEsUUFFdEIsR0FBRyxNQUFNLEtBQUs7QUFDVixlQUFLLFdBQVcsS0FBSyxFQUFFLE1BQU07QUFBQTtBQUFBLFFBRWpDLEtBQUssTUFBTSxLQUFLO0FBQ1osZUFBSyxXQUFXLEtBQUssRUFBRSxNQUFNLEtBQUssTUFBTTtBQUFBO0FBQUEsUUFFNUMsSUFBSSxNQUFNLEtBQUs7QUFDWCxjQUFJO0FBQ0EsaUJBQUssYUFBYSxLQUFLLFdBQVcsT0FBTyxDQUFDLE1BQU0sRUFBRSxRQUFRO0FBQUEsbUJBQ3JEO0FBQ0wsaUJBQUssYUFBYSxLQUFLLFdBQVcsT0FBTyxDQUFDLE1BQU0sRUFBRSxTQUFTO0FBQUE7QUFFM0QsaUJBQUssV0FBVyxPQUFPLEdBQUcsS0FBSyxXQUFXO0FBQUE7QUFBQSxRQUVsRCxLQUFLLE1BQU0sUUFBUSxTQUFTO0FBQ3hCLHFCQUFXLFlBQVksS0FBSyxZQUFZO0FBQ3BD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
