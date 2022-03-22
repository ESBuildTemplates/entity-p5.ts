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
        async emit(name, ...params) {
          for (const listener of this._listeners) {
            if (listener.name === name) {
              await listener.run(...params);
              if (listener.once) {
                const index = this._listeners.indexOf(listener);
                this._listeners.splice(index, 1);
              }
            }
          }
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

  // node_modules/@ghom/entity/dist/app/util.js
  var require_util = __commonJS({
    "node_modules/@ghom/entity/dist/app/util.js"(exports) {
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

  // node_modules/@ghom/entity/dist/app/entity.js
  var require_entity = __commonJS({
    "node_modules/@ghom/entity/dist/app/entity.js"(exports) {
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
        afterUpdate() {
        }
        afterParentUpdate() {
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
            if (this.onUpdate() !== false) {
              this.transmit("update");
              this.children.forEach((child) => {
                if (child.isSetup)
                  child.afterParentUpdate();
              });
              this.afterUpdate();
            }
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

  // node_modules/@ghom/entity/dist/app/easing.js
  var require_easing = __commonJS({
    "node_modules/@ghom/entity/dist/app/easing.js"(exports) {
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

  // node_modules/@ghom/entity/dist/app/animation.js
  var require_animation = __commonJS({
    "node_modules/@ghom/entity/dist/app/animation.js"(exports) {
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
          if (this.isFinish) {
            this.teardown();
            return false;
          } else {
            (_b = (_a = this.settings).onUpdate) == null ? void 0 : _b.call(_a, this.value);
          }
        }
        afterParentUpdate() {
          var _a, _b;
          if (this.isFinish) {
            this.teardown();
            return false;
          } else {
            (_b = (_a = this.settings).afterUpdate) == null ? void 0 : _b.call(_a, this.value);
          }
        }
        onTeardown() {
          var _a, _b;
          (_b = (_a = this.settings).onTeardown) == null ? void 0 : _b.call(_a);
        }
        get isFinish() {
          return entity_1.Entity.frameCount - this._startFrame >= this.settings.duration;
        }
        get value() {
          return (0, util_1.map)(this.easing((entity_1.Entity.frameCount - this._startFrame) / this.settings.duration), 0, 1, this.settings.from, this.settings.to);
        }
      };
      exports.Animation = Animation3;
    }
  });

  // node_modules/@ghom/entity/dist/app/transition.js
  var require_transition = __commonJS({
    "node_modules/@ghom/entity/dist/app/transition.js"(exports) {
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

  // node_modules/@ghom/entity/dist/index.js
  var require_dist2 = __commonJS({
    "node_modules/@ghom/entity/dist/index.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
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
      var entity_1 = require_dist2();
      var Base6 = class extends entity_1.Entity {
        onMousePressed() {
        }
        onMouseReleased() {
        }
        onKeyPressed() {
        }
        onKeyReleased() {
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
      exports.Base = Base6;
    }
  });

  // node_modules/@ghom/entity-p5/dist/index.js
  var require_dist3 = __commonJS({
    "node_modules/@ghom/entity-p5/dist/index.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
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
    }
  });

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
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
        this.addChild(new import_entity_p5.Animation({
          from: 0,
          to: 1,
          duration: 100,
          afterUpdate: (value) => {
            noStroke();
            fill(scoreUp ? color(100, 255, 255, (1 - value) * 255) : color(255, 100, 100, (1 - value) * 255));
            textAlign(CENTER, CENTER);
            textSize(baseTextSize * Math.max(1, value + 0.5));
            text(`Score: ${score}`, width / 2, height * 0.1);
          }
        }));
        this._score = score;
      }
    }
    afterUpdate() {
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
  var Cursor = class extends import_entity_p52.Base {
    constructor() {
      super(...arguments);
      this.x = 0;
      this.y = 0;
      this.diameter = 15;
      this.history = [];
    }
    onUpdate() {
      this.history.push([this.x, this.y]);
      this.x = mouseX;
      this.y = mouseY;
      while (this.history.length > HISTORY_LENGTH)
        this.history.shift();
      this.draw();
    }
    draw() {
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
      let x = mouseX;
      let y = mouseY;
      this.addChild(new import_entity_p52.Animation({
        from: 0,
        to: this.diameter * 5,
        duration: 200,
        easing: import_entity_p52.easingSet.easeOutQuart,
        onUpdate: (value) => {
          noFill();
          stroke(255, (this.diameter * 5 - value) / (this.diameter * 5) * 255);
          strokeWeight(this.diameter / 4);
          circle(x, y, value);
        }
      }));
    }
  };

  // src/app/balloon.ts
  var import_entity_p53 = __toESM(require_dist3());
  var Balloon = class extends import_entity_p53.Base {
    constructor() {
      super(...arguments);
      this.color = color(random(100, 200), random(100, 200), random(100, 200));
      this.x = random(0, width);
      this.y = random(0, height);
      this.diameter = random(40, 60);
    }
    onUpdate() {
      fill(this.color);
      if (this.isHovered) {
        stroke(255);
        strokeWeight(5);
      } else
        noStroke();
      circle(this.x, this.y, this.diameter);
    }
    onTeardown() {
      game.score++;
    }
    onMousePressed() {
      if (this.isHovered) {
        if (this.parent.children.length > 1)
          this.parent.stopTransmission("mousePressed");
        this.parent.addChild(new Balloon());
        this.teardown();
      }
    }
    get isHovered() {
      return dist(mouseX, mouseY, this.x, this.y) < this.diameter / 2;
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
  var meter = new FPSMeter(void 0, {
    right: "3px",
    left: "inherit",
    graph: 1
  });
  function setup() {
    createCanvas(Math.max(document.documentElement.clientWidth, window.innerWidth || 0), Math.max(document.documentElement.clientHeight, window.innerHeight || 0));
    game.addChild(new Background());
    game.addChild(new Balloons(3));
    game.addChild(new Cursor());
    game.setup();
  }
  function update() {
    meter.tickStart();
    if (game.isSetup) {
      game.update(true);
    } else {
      frameRate(0);
      return;
    }
    meter.tick();
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibm9kZV9tb2R1bGVzL0BnaG9tL2V2ZW50LWVtaXR0ZXIvZGlzdC9hcHAvZW1pdHRlci5qcyIsICJub2RlX21vZHVsZXMvQGdob20vZXZlbnQtZW1pdHRlci9kaXN0L2luZGV4LmpzIiwgIm5vZGVfbW9kdWxlcy9AZ2hvbS9lbnRpdHkvZGlzdC9hcHAvdXRpbC5qcyIsICJub2RlX21vZHVsZXMvQGdob20vZW50aXR5L2Rpc3QvYXBwL2VudGl0eS5qcyIsICJub2RlX21vZHVsZXMvQGdob20vZW50aXR5L2Rpc3QvYXBwL2Vhc2luZy5qcyIsICJub2RlX21vZHVsZXMvQGdob20vZW50aXR5L2Rpc3QvYXBwL2FuaW1hdGlvbi5qcyIsICJub2RlX21vZHVsZXMvQGdob20vZW50aXR5L2Rpc3QvYXBwL3RyYW5zaXRpb24uanMiLCAibm9kZV9tb2R1bGVzL0BnaG9tL2VudGl0eS9kaXN0L2luZGV4LmpzIiwgIm5vZGVfbW9kdWxlcy9AZ2hvbS9lbnRpdHktcDUvZGlzdC9hcHAvYmFzZS5qcyIsICJub2RlX21vZHVsZXMvQGdob20vZW50aXR5LXA1L2Rpc3QvaW5kZXguanMiLCAic3JjL2luZGV4LnRzIiwgInNyYy9hcHAvZ2FtZS50cyIsICJzcmMvYXBwL2N1cnNvci50cyIsICJzcmMvYXBwL2JhbGxvb24udHMiLCAic3JjL2FwcC9iYWxsb29ucy50cyIsICJzcmMvYXBwL2JhY2tncm91bmQudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuRXZlbnRFbWl0dGVyID0gdm9pZCAwO1xyXG5jbGFzcyBFdmVudEVtaXR0ZXIge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5fbGlzdGVuZXJzID0gW107XHJcbiAgICB9XHJcbiAgICBvbihuYW1lLCBydW4pIHtcclxuICAgICAgICB0aGlzLl9saXN0ZW5lcnMucHVzaCh7IG5hbWUsIHJ1biB9KTtcclxuICAgIH1cclxuICAgIG9uY2UobmFtZSwgcnVuKSB7XHJcbiAgICAgICAgdGhpcy5fbGlzdGVuZXJzLnB1c2goeyBuYW1lLCBydW4sIG9uY2U6IHRydWUgfSk7XHJcbiAgICB9XHJcbiAgICBvZmYobmFtZSwgcnVuKSB7XHJcbiAgICAgICAgaWYgKHJ1bilcclxuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzLmZpbHRlcigobCkgPT4gbC5ydW4gIT09IHJ1bik7XHJcbiAgICAgICAgZWxzZSBpZiAobmFtZSlcclxuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzLmZpbHRlcigobCkgPT4gbC5uYW1lICE9PSBuYW1lKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVycy5zcGxpY2UoMCwgdGhpcy5fbGlzdGVuZXJzLmxlbmd0aCk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBlbWl0KG5hbWUsIC4uLnBhcmFtcykge1xyXG4gICAgICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgdGhpcy5fbGlzdGVuZXJzKSB7XHJcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lci5uYW1lID09PSBuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCBsaXN0ZW5lci5ydW4oLi4ucGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lci5vbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9saXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XHJcbiIsICJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pKTtcclxudmFyIF9fZXhwb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19leHBvcnRTdGFyKSB8fCBmdW5jdGlvbihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGV4cG9ydHMsIHApKSBfX2NyZWF0ZUJpbmRpbmcoZXhwb3J0cywgbSwgcCk7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL2FwcC9lbWl0dGVyXCIpLCBleHBvcnRzKTtcclxuIiwgIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuY29uc3RyYWluID0gZXhwb3J0cy5tYXAgPSB2b2lkIDA7XHJcbmZ1bmN0aW9uIG1hcChuLCBzdGFydDEsIHN0b3AxLCBzdGFydDIsIHN0b3AyLCB3aXRoaW5Cb3VuZHMgPSBmYWxzZSkge1xyXG4gICAgY29uc3Qgb3V0cHV0ID0gKChuIC0gc3RhcnQxKSAvIChzdG9wMSAtIHN0YXJ0MSkpICogKHN0b3AyIC0gc3RhcnQyKSArIHN0YXJ0MjtcclxuICAgIGlmICghd2l0aGluQm91bmRzKSB7XHJcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcclxuICAgIH1cclxuICAgIGlmIChzdGFydDIgPCBzdG9wMikge1xyXG4gICAgICAgIHJldHVybiBjb25zdHJhaW4ob3V0cHV0LCBzdGFydDIsIHN0b3AyKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBjb25zdHJhaW4ob3V0cHV0LCBzdG9wMiwgc3RhcnQyKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLm1hcCA9IG1hcDtcclxuZnVuY3Rpb24gY29uc3RyYWluKG4sIGxvdywgaGlnaCkge1xyXG4gICAgcmV0dXJuIE1hdGgubWF4KE1hdGgubWluKG4sIGhpZ2gpLCBsb3cpO1xyXG59XHJcbmV4cG9ydHMuY29uc3RyYWluID0gY29uc3RyYWluO1xyXG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5FbnRpdHkgPSB2b2lkIDA7XHJcbmNvbnN0IGV2ZW50X2VtaXR0ZXJfMSA9IHJlcXVpcmUoXCJAZ2hvbS9ldmVudC1lbWl0dGVyXCIpO1xyXG5jbGFzcyBFbnRpdHkgZXh0ZW5kcyBldmVudF9lbWl0dGVyXzEuRXZlbnRFbWl0dGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XHJcbiAgICAgICAgdGhpcy5fc3RhcnRGcmFtZSA9IDA7XHJcbiAgICAgICAgdGhpcy5faXNTZXR1cCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2NoaWxkcmVuID0gbmV3IFNldCgpO1xyXG4gICAgICAgIHRoaXMuX3N0b3BQb2ludHMgPSB7fTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBhZGRGcmFtZSgpIHtcclxuICAgICAgICB0aGlzLmZyYW1lQ291bnQrKztcclxuICAgIH1cclxuICAgIHN0YXRpYyByZXNvbHZlKGVudGl0eSkge1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgZW50aXR5ID09PSBcImZ1bmN0aW9uXCIgPyBlbnRpdHkoKSA6IGVudGl0eTtcclxuICAgIH1cclxuICAgIGdldCBmcmFtZUNvdW50KCkge1xyXG4gICAgICAgIHJldHVybiBFbnRpdHkuZnJhbWVDb3VudCAtIHRoaXMuX3N0YXJ0RnJhbWU7XHJcbiAgICB9XHJcbiAgICBnZXQgaXNTZXR1cCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faXNTZXR1cDtcclxuICAgIH1cclxuICAgIGdldCBjaGlsZHJlbigpIHtcclxuICAgICAgICByZXR1cm4gWy4uLnRoaXMuX2NoaWxkcmVuXTtcclxuICAgIH1cclxuICAgIGdldCBwYXJlbnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xyXG4gICAgICovXHJcbiAgICBvblNldHVwKCkgeyB9XHJcbiAgICAvKipcclxuICAgICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcclxuICAgICAqL1xyXG4gICAgb25VcGRhdGUoKSB7IH1cclxuICAgIC8qKlxyXG4gICAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xyXG4gICAgICovXHJcbiAgICBhZnRlclVwZGF0ZSgpIHsgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBVc2VkIHRvIGJlIG92ZXJ3cml0dGVuIGJ5IHlvdXIgb3duIHdvcmtpbmdzXHJcbiAgICAgKi9cclxuICAgIGFmdGVyUGFyZW50VXBkYXRlKCkgeyB9XHJcbiAgICAvKipcclxuICAgICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcclxuICAgICAqL1xyXG4gICAgb25UZWFyZG93bigpIHsgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cclxuICAgICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXHJcbiAgICAgKi9cclxuICAgIHNldHVwKCkge1xyXG4gICAgICAgIHRoaXMuX3N0YXJ0RnJhbWUgPSBFbnRpdHkuZnJhbWVDb3VudDtcclxuICAgICAgICBpZiAoIXRoaXMuaXNTZXR1cCkge1xyXG4gICAgICAgICAgICB0aGlzLm9uU2V0dXAoKTtcclxuICAgICAgICAgICAgdGhpcy50cmFuc21pdChcInNldHVwXCIpO1xyXG4gICAgICAgICAgICB0aGlzLl9pc1NldHVwID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9IGlzIGFscmVhZHkgc2V0dXBgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxyXG4gICAgICogU2hvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiFcclxuICAgICAqL1xyXG4gICAgdXBkYXRlKGFkZEZyYW1lKSB7XHJcbiAgICAgICAgaWYgKGFkZEZyYW1lKVxyXG4gICAgICAgICAgICBFbnRpdHkuYWRkRnJhbWUoKTtcclxuICAgICAgICBpZiAodGhpcy5pc1NldHVwKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9uVXBkYXRlKCkgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zbWl0KFwidXBkYXRlXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZC5pc1NldHVwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZC5hZnRlclBhcmVudFVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFmdGVyVXBkYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgdXBkYXRlIGlzIGNhbGxlZCBiZWZvcmUgc2V0dXAgaW4gJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cclxuICAgICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXHJcbiAgICAgKi9cclxuICAgIHRlYXJkb3duKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzU2V0dXApIHtcclxuICAgICAgICAgICAgdGhpcy5faXNTZXR1cCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLm9uVGVhcmRvd24oKTtcclxuICAgICAgICAgICAgdGhpcy5fcGFyZW50Py5yZW1vdmVDaGlsZCh0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy50cmFuc21pdChcInRlYXJkb3duXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGB0ZWFyZG93biBpcyBjYWxsZWQgYmVmb3JlIHNldHVwIGluICR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGFkZENoaWxkKC4uLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZHJlbikge1xyXG4gICAgICAgICAgICBjaGlsZC5fcGFyZW50ID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW4uYWRkKGNoaWxkKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNTZXR1cClcclxuICAgICAgICAgICAgICAgIGNoaWxkLnNldHVwKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmVtb3ZlQ2hpbGQoLi4uY2hpbGRyZW4pIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIGlmIChjaGlsZC5pc1NldHVwKVxyXG4gICAgICAgICAgICAgICAgY2hpbGQudGVhcmRvd24oKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW4uZGVsZXRlKGNoaWxkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdG9wVHJhbnNtaXNzaW9uKG5hbWUpIHtcclxuICAgICAgICB0aGlzLl9zdG9wUG9pbnRzW25hbWVdID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIHRyYW5zbWl0KG5hbWUpIHtcclxuICAgICAgICB0aGlzLmVtaXQobmFtZSwgW10sIHRoaXMpO1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fc3RvcFBvaW50c1tuYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3RvcFBvaW50c1tuYW1lXSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgaWYgKG5hbWUgaW4gY2hpbGQgJiYgdHlwZW9mIGNoaWxkW25hbWVdID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgICAgICAgICBjaGlsZFtuYW1lXSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHNjaGVtYShpbmRlbnRhdGlvbiA9IDIsIGRlcHRoID0gMCwgaW5kZXggPSBudWxsKSB7XHJcbiAgICAgICAgcmV0dXJuIGAke1wiIFwiLnJlcGVhdChpbmRlbnRhdGlvbikucmVwZWF0KGRlcHRoKX0ke2luZGV4ID09PSBudWxsID8gXCJcIiA6IGAke2luZGV4fSAtIGB9JHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9IFske3RoaXMuZnJhbWVDb3VudH0gZnJhbWVzXSAke3RoaXMuX2NoaWxkcmVuLnNpemUgPiAwXHJcbiAgICAgICAgICAgID8gYCAoY2hpbGRyZW46ICR7dGhpcy5jaGlsZHJlbi5sZW5ndGh9KSR7dGhpcy5fbGlzdGVuZXJzLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAgID8gYCAobGlzdGVuZXJzOiAke3RoaXMuX2xpc3RlbmVycy5sZW5ndGh9KWBcclxuICAgICAgICAgICAgICAgIDogXCJcIn1cXG4ke3RoaXMuY2hpbGRyZW5cclxuICAgICAgICAgICAgICAgIC5tYXAoKGNoaWxkLCBpbmRleCkgPT4gYCR7Y2hpbGQuc2NoZW1hKGluZGVudGF0aW9uLCBkZXB0aCArIDEsIGluZGV4KX1gKVxyXG4gICAgICAgICAgICAgICAgLmpvaW4oXCJcXG5cIil9YFxyXG4gICAgICAgICAgICA6IFwiXCJ9YDtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLkVudGl0eSA9IEVudGl0eTtcclxuRW50aXR5LmZyYW1lQ291bnQgPSAwO1xyXG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XHJcbi8vIHNvdXJjZTogaHR0cHM6Ly9naXRodWIuY29tL2FpL2Vhc2luZ3MubmV0L2Jsb2IvbWFzdGVyL3NyYy9lYXNpbmdzL2Vhc2luZ3NGdW5jdGlvbnMudHNcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmVhc2luZ1NldCA9IHZvaWQgMDtcclxuY29uc3QgUEkgPSBNYXRoLlBJO1xyXG5jb25zdCBjMSA9IDEuNzAxNTg7XHJcbmNvbnN0IGMyID0gYzEgKiAxLjUyNTtcclxuY29uc3QgYzMgPSBjMSArIDE7XHJcbmNvbnN0IGM0ID0gKDIgKiBQSSkgLyAzO1xyXG5jb25zdCBjNSA9ICgyICogUEkpIC8gNC41O1xyXG5jb25zdCBib3VuY2VPdXQgPSBmdW5jdGlvbiAoeCkge1xyXG4gICAgY29uc3QgbjEgPSA3LjU2MjU7XHJcbiAgICBjb25zdCBkMSA9IDIuNzU7XHJcbiAgICBpZiAoeCA8IDEgLyBkMSkge1xyXG4gICAgICAgIHJldHVybiBuMSAqIHggKiB4O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoeCA8IDIgLyBkMSkge1xyXG4gICAgICAgIHJldHVybiBuMSAqICh4IC09IDEuNSAvIGQxKSAqIHggKyAwLjc1O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoeCA8IDIuNSAvIGQxKSB7XHJcbiAgICAgICAgcmV0dXJuIG4xICogKHggLT0gMi4yNSAvIGQxKSAqIHggKyAwLjkzNzU7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gbjEgKiAoeCAtPSAyLjYyNSAvIGQxKSAqIHggKyAwLjk4NDM3NTtcclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5lYXNpbmdTZXQgPSB7XHJcbiAgICBsaW5lYXI6ICh4KSA9PiB4LFxyXG4gICAgZWFzZUluUXVhZDogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4geCAqIHg7XHJcbiAgICB9LFxyXG4gICAgZWFzZU91dFF1YWQ6IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIDEgLSAoMSAtIHgpICogKDEgLSB4KTtcclxuICAgIH0sXHJcbiAgICBlYXNlSW5PdXRRdWFkOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiB4IDwgMC41ID8gMiAqIHggKiB4IDogMSAtIE1hdGgucG93KC0yICogeCArIDIsIDIpIC8gMjtcclxuICAgIH0sXHJcbiAgICBlYXNlSW5DdWJpYzogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4geCAqIHggKiB4O1xyXG4gICAgfSxcclxuICAgIGVhc2VPdXRDdWJpYzogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4gMSAtIE1hdGgucG93KDEgLSB4LCAzKTtcclxuICAgIH0sXHJcbiAgICBlYXNlSW5PdXRDdWJpYzogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4geCA8IDAuNSA/IDQgKiB4ICogeCAqIHggOiAxIC0gTWF0aC5wb3coLTIgKiB4ICsgMiwgMykgLyAyO1xyXG4gICAgfSxcclxuICAgIGVhc2VJblF1YXJ0OiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiB4ICogeCAqIHggKiB4O1xyXG4gICAgfSxcclxuICAgIGVhc2VPdXRRdWFydDogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4gMSAtIE1hdGgucG93KDEgLSB4LCA0KTtcclxuICAgIH0sXHJcbiAgICBlYXNlSW5PdXRRdWFydDogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4geCA8IDAuNSA/IDggKiB4ICogeCAqIHggKiB4IDogMSAtIE1hdGgucG93KC0yICogeCArIDIsIDQpIC8gMjtcclxuICAgIH0sXHJcbiAgICBlYXNlSW5RdWludDogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4geCAqIHggKiB4ICogeCAqIHg7XHJcbiAgICB9LFxyXG4gICAgZWFzZU91dFF1aW50OiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiAxIC0gTWF0aC5wb3coMSAtIHgsIDUpO1xyXG4gICAgfSxcclxuICAgIGVhc2VJbk91dFF1aW50OiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiB4IDwgMC41ID8gMTYgKiB4ICogeCAqIHggKiB4ICogeCA6IDEgLSBNYXRoLnBvdygtMiAqIHggKyAyLCA1KSAvIDI7XHJcbiAgICB9LFxyXG4gICAgZWFzZUluU2luZTogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4gMSAtIE1hdGguY29zKCh4ICogUEkpIC8gMik7XHJcbiAgICB9LFxyXG4gICAgZWFzZU91dFNpbmU6IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc2luKCh4ICogUEkpIC8gMik7XHJcbiAgICB9LFxyXG4gICAgZWFzZUluT3V0U2luZTogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4gLShNYXRoLmNvcyhQSSAqIHgpIC0gMSkgLyAyO1xyXG4gICAgfSxcclxuICAgIGVhc2VJbkV4cG86IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIHggPT09IDAgPyAwIDogTWF0aC5wb3coMiwgMTAgKiB4IC0gMTApO1xyXG4gICAgfSxcclxuICAgIGVhc2VPdXRFeHBvOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiB4ID09PSAxID8gMSA6IDEgLSBNYXRoLnBvdygyLCAtMTAgKiB4KTtcclxuICAgIH0sXHJcbiAgICBlYXNlSW5PdXRFeHBvOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiB4ID09PSAwXHJcbiAgICAgICAgICAgID8gMFxyXG4gICAgICAgICAgICA6IHggPT09IDFcclxuICAgICAgICAgICAgICAgID8gMVxyXG4gICAgICAgICAgICAgICAgOiB4IDwgMC41XHJcbiAgICAgICAgICAgICAgICAgICAgPyBNYXRoLnBvdygyLCAyMCAqIHggLSAxMCkgLyAyXHJcbiAgICAgICAgICAgICAgICAgICAgOiAoMiAtIE1hdGgucG93KDIsIC0yMCAqIHggKyAxMCkpIC8gMjtcclxuICAgIH0sXHJcbiAgICBlYXNlSW5DaXJjOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiAxIC0gTWF0aC5zcXJ0KDEgLSBNYXRoLnBvdyh4LCAyKSk7XHJcbiAgICB9LFxyXG4gICAgZWFzZU91dENpcmM6IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCgxIC0gTWF0aC5wb3coeCAtIDEsIDIpKTtcclxuICAgIH0sXHJcbiAgICBlYXNlSW5PdXRDaXJjOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiB4IDwgMC41XHJcbiAgICAgICAgICAgID8gKDEgLSBNYXRoLnNxcnQoMSAtIE1hdGgucG93KDIgKiB4LCAyKSkpIC8gMlxyXG4gICAgICAgICAgICA6IChNYXRoLnNxcnQoMSAtIE1hdGgucG93KC0yICogeCArIDIsIDIpKSArIDEpIC8gMjtcclxuICAgIH0sXHJcbiAgICBlYXNlSW5CYWNrOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiBjMyAqIHggKiB4ICogeCAtIGMxICogeCAqIHg7XHJcbiAgICB9LFxyXG4gICAgZWFzZU91dEJhY2s6IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIDEgKyBjMyAqIE1hdGgucG93KHggLSAxLCAzKSArIGMxICogTWF0aC5wb3coeCAtIDEsIDIpO1xyXG4gICAgfSxcclxuICAgIGVhc2VJbk91dEJhY2s6IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIHggPCAwLjVcclxuICAgICAgICAgICAgPyAoTWF0aC5wb3coMiAqIHgsIDIpICogKChjMiArIDEpICogMiAqIHggLSBjMikpIC8gMlxyXG4gICAgICAgICAgICA6IChNYXRoLnBvdygyICogeCAtIDIsIDIpICogKChjMiArIDEpICogKHggKiAyIC0gMikgKyBjMikgKyAyKSAvIDI7XHJcbiAgICB9LFxyXG4gICAgZWFzZUluRWxhc3RpYzogZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICByZXR1cm4geCA9PT0gMFxyXG4gICAgICAgICAgICA/IDBcclxuICAgICAgICAgICAgOiB4ID09PSAxXHJcbiAgICAgICAgICAgICAgICA/IDFcclxuICAgICAgICAgICAgICAgIDogLU1hdGgucG93KDIsIDEwICogeCAtIDEwKSAqIE1hdGguc2luKCh4ICogMTAgLSAxMC43NSkgKiBjNCk7XHJcbiAgICB9LFxyXG4gICAgZWFzZU91dEVsYXN0aWM6IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIHggPT09IDBcclxuICAgICAgICAgICAgPyAwXHJcbiAgICAgICAgICAgIDogeCA9PT0gMVxyXG4gICAgICAgICAgICAgICAgPyAxXHJcbiAgICAgICAgICAgICAgICA6IE1hdGgucG93KDIsIC0xMCAqIHgpICogTWF0aC5zaW4oKHggKiAxMCAtIDAuNzUpICogYzQpICsgMTtcclxuICAgIH0sXHJcbiAgICBlYXNlSW5PdXRFbGFzdGljOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiB4ID09PSAwXHJcbiAgICAgICAgICAgID8gMFxyXG4gICAgICAgICAgICA6IHggPT09IDFcclxuICAgICAgICAgICAgICAgID8gMVxyXG4gICAgICAgICAgICAgICAgOiB4IDwgMC41XHJcbiAgICAgICAgICAgICAgICAgICAgPyAtKE1hdGgucG93KDIsIDIwICogeCAtIDEwKSAqIE1hdGguc2luKCgyMCAqIHggLSAxMS4xMjUpICogYzUpKSAvIDJcclxuICAgICAgICAgICAgICAgICAgICA6IChNYXRoLnBvdygyLCAtMjAgKiB4ICsgMTApICogTWF0aC5zaW4oKDIwICogeCAtIDExLjEyNSkgKiBjNSkpIC8gMiArIDE7XHJcbiAgICB9LFxyXG4gICAgZWFzZUluQm91bmNlOiBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIHJldHVybiAxIC0gYm91bmNlT3V0KDEgLSB4KTtcclxuICAgIH0sXHJcbiAgICBlYXNlT3V0Qm91bmNlOiBib3VuY2VPdXQsXHJcbiAgICBlYXNlSW5PdXRCb3VuY2U6IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIHggPCAwLjVcclxuICAgICAgICAgICAgPyAoMSAtIGJvdW5jZU91dCgxIC0gMiAqIHgpKSAvIDJcclxuICAgICAgICAgICAgOiAoMSArIGJvdW5jZU91dCgyICogeCAtIDEpKSAvIDI7XHJcbiAgICB9LFxyXG59O1xyXG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5BbmltYXRpb24gPSB2b2lkIDA7XHJcbmNvbnN0IHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XHJcbmNvbnN0IGVudGl0eV8xID0gcmVxdWlyZShcIi4vZW50aXR5XCIpO1xyXG5jb25zdCBlYXNpbmdfMSA9IHJlcXVpcmUoXCIuL2Vhc2luZ1wiKTtcclxuLyoqXHJcbiAqIEVxdWl2YWxlbnQgb2YgVHdlZW5cclxuICovXHJcbmNsYXNzIEFuaW1hdGlvbiBleHRlbmRzIGVudGl0eV8xLkVudGl0eSB7XHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncykge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzO1xyXG4gICAgICAgIHRoaXMuZWFzaW5nID0gc2V0dGluZ3MuZWFzaW5nID8/IGVhc2luZ18xLmVhc2luZ1NldC5saW5lYXI7XHJcbiAgICB9XHJcbiAgICBvblNldHVwKCkge1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3Mub25TZXR1cD8uKCk7XHJcbiAgICB9XHJcbiAgICBvblVwZGF0ZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0ZpbmlzaCkge1xyXG4gICAgICAgICAgICB0aGlzLnRlYXJkb3duKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0dGluZ3Mub25VcGRhdGU/Lih0aGlzLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhZnRlclBhcmVudFVwZGF0ZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0ZpbmlzaCkge1xyXG4gICAgICAgICAgICB0aGlzLnRlYXJkb3duKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuYWZ0ZXJVcGRhdGU/Lih0aGlzLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBvblRlYXJkb3duKCkge1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3Mub25UZWFyZG93bj8uKCk7XHJcbiAgICB9XHJcbiAgICBnZXQgaXNGaW5pc2goKSB7XHJcbiAgICAgICAgcmV0dXJuIGVudGl0eV8xLkVudGl0eS5mcmFtZUNvdW50IC0gdGhpcy5fc3RhcnRGcmFtZSA+PSB0aGlzLnNldHRpbmdzLmR1cmF0aW9uO1xyXG4gICAgfVxyXG4gICAgZ2V0IHZhbHVlKCkge1xyXG4gICAgICAgIHJldHVybiAoMCwgdXRpbF8xLm1hcCkodGhpcy5lYXNpbmcoKGVudGl0eV8xLkVudGl0eS5mcmFtZUNvdW50IC0gdGhpcy5fc3RhcnRGcmFtZSkgLyB0aGlzLnNldHRpbmdzLmR1cmF0aW9uKSwgMCwgMSwgdGhpcy5zZXR0aW5ncy5mcm9tLCB0aGlzLnNldHRpbmdzLnRvKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLkFuaW1hdGlvbiA9IEFuaW1hdGlvbjtcclxuIiwgIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuUGFyYWxsZWwgPSBleHBvcnRzLlNlcXVlbmNlID0gdm9pZCAwO1xyXG5jb25zdCBlbnRpdHlfMSA9IHJlcXVpcmUoXCIuL2VudGl0eVwiKTtcclxuY2xhc3MgU2VxdWVuY2UgZXh0ZW5kcyBlbnRpdHlfMS5FbnRpdHkge1xyXG4gICAgY29uc3RydWN0b3IobGlzdCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5saXN0ID0gbGlzdDtcclxuICAgICAgICB0aGlzLmluZGV4ID0gMDtcclxuICAgIH1cclxuICAgIG9uU2V0dXAoKSB7XHJcbiAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICB9XHJcbiAgICBuZXh0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmluZGV4ID49IHRoaXMubGlzdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy50ZWFyZG93bigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gZW50aXR5XzEuRW50aXR5LnJlc29sdmUodGhpcy5saXN0W3RoaXMuaW5kZXhdKTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50Lm9uKFwidGVhcmRvd25cIiwgKCkgPT4gdGhpcy5uZXh0KCkpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuY3VycmVudCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5kZXgrKztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5TZXF1ZW5jZSA9IFNlcXVlbmNlO1xyXG5jbGFzcyBQYXJhbGxlbCBleHRlbmRzIGVudGl0eV8xLkVudGl0eSB7XHJcbiAgICBjb25zdHJ1Y3RvcihsaXN0KSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmxpc3QgPSBsaXN0O1xyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQoLi4ubGlzdC5tYXAoZW50aXR5XzEuRW50aXR5LnJlc29sdmUpKTtcclxuICAgIH1cclxuICAgIG9uVXBkYXRlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnRlYXJkb3duKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuUGFyYWxsZWwgPSBQYXJhbGxlbDtcclxuIiwgIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG0sIGspO1xyXG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcclxuICAgICAgZGVzYyA9IHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfTtcclxuICAgIH1cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KSk7XHJcbnZhciBfX2V4cG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9fZXhwb3J0U3RhcikgfHwgZnVuY3Rpb24obSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChleHBvcnRzLCBwKSkgX19jcmVhdGVCaW5kaW5nKGV4cG9ydHMsIG0sIHApO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiQGdob20vZXZlbnQtZW1pdHRlclwiKSwgZXhwb3J0cyk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9hcHAvYW5pbWF0aW9uXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL2FwcC9lYXNpbmdcIiksIGV4cG9ydHMpO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vYXBwL2VudGl0eVwiKSwgZXhwb3J0cyk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9hcHAvdHJhbnNpdGlvblwiKSwgZXhwb3J0cyk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9hcHAvdXRpbFwiKSwgZXhwb3J0cyk7XHJcbiIsICJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLkJhc2UgPSB2b2lkIDA7XHJcbmNvbnN0IGVudGl0eV8xID0gcmVxdWlyZShcIkBnaG9tL2VudGl0eVwiKTtcclxuY2xhc3MgQmFzZSBleHRlbmRzIGVudGl0eV8xLkVudGl0eSB7XHJcbiAgICAvKipcclxuICAgICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcclxuICAgICAqL1xyXG4gICAgb25Nb3VzZVByZXNzZWQoKSB7IH1cclxuICAgIC8qKlxyXG4gICAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xyXG4gICAgICovXHJcbiAgICBvbk1vdXNlUmVsZWFzZWQoKSB7IH1cclxuICAgIC8qKlxyXG4gICAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xyXG4gICAgICovXHJcbiAgICBvbktleVByZXNzZWQoKSB7IH1cclxuICAgIC8qKlxyXG4gICAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xyXG4gICAgICovXHJcbiAgICBvbktleVJlbGVhc2VkKCkgeyB9XHJcbiAgICAvKipcclxuICAgICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxyXG4gICAgICogU2hvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiFcclxuICAgICAqL1xyXG4gICAgbW91c2VQcmVzc2VkKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzU2V0dXApIHtcclxuICAgICAgICAgICAgdGhpcy5vbk1vdXNlUHJlc3NlZCgpO1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zbWl0KFwibW91c2VQcmVzc2VkXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGBtb3VzZVByZXNzZWQgaXMgY2FsbGVkIGJlZm9yZSBzZXR1cCBpbiAke3RoaXMuY29uc3RydWN0b3IubmFtZX1gKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxyXG4gICAgICogU2hvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiFcclxuICAgICAqL1xyXG4gICAgbW91c2VSZWxlYXNlZCgpIHtcclxuICAgICAgICBpZiAodGhpcy5pc1NldHVwKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25Nb3VzZVJlbGVhc2VkKCk7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNtaXQoXCJtb3VzZVJlbGVhc2VkXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGBtb3VzZVJlbGVhc2VkIGlzIGNhbGxlZCBiZWZvcmUgc2V0dXAgaW4gJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cclxuICAgICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXHJcbiAgICAgKi9cclxuICAgIGtleVByZXNzZWQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTZXR1cCkge1xyXG4gICAgICAgICAgICB0aGlzLm9uS2V5UHJlc3NlZCgpO1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zbWl0KFwia2V5UHJlc3NlZFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2Fybihga2V5UHJlc3NlZCBpcyBjYWxsZWQgYmVmb3JlIHNldHVwIGluICR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjdXJyZW50IGVudGl0eSBpcyBhIHJvb3QuXHJcbiAgICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxyXG4gICAgICovXHJcbiAgICBrZXlSZWxlYXNlZCgpIHtcclxuICAgICAgICBpZiAodGhpcy5pc1NldHVwKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25LZXlSZWxlYXNlZCgpO1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zbWl0KFwia2V5UmVsZWFzZWRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYGtleVJlbGVhc2VkIGlzIGNhbGxlZCBiZWZvcmUgc2V0dXAgaW4gJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuQmFzZSA9IEJhc2U7XHJcbiIsICJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtLCBrKTtcclxuICAgIGlmICghZGVzYyB8fCAoXCJnZXRcIiBpbiBkZXNjID8gIW0uX19lc01vZHVsZSA6IGRlc2Mud3JpdGFibGUgfHwgZGVzYy5jb25maWd1cmFibGUpKSB7XHJcbiAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XHJcbiAgICB9XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSkpO1xyXG52YXIgX19leHBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2V4cG9ydFN0YXIpIHx8IGZ1bmN0aW9uKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZXhwb3J0cywgcCkpIF9fY3JlYXRlQmluZGluZyhleHBvcnRzLCBtLCBwKTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIkBnaG9tL2VudGl0eVwiKSwgZXhwb3J0cyk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9hcHAvYmFzZVwiKSwgZXhwb3J0cyk7XHJcbiIsICIvLy8gQHRzLWNoZWNrXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL0B0eXBlcy9wNS9nbG9iYWwuZC50c1wiIC8+XG5cbmltcG9ydCB7IGdhbWUgfSBmcm9tIFwiLi9hcHAvZ2FtZVwiXG5pbXBvcnQgeyBDdXJzb3IgfSBmcm9tIFwiLi9hcHAvY3Vyc29yXCJcbmltcG9ydCB7IEJhbGxvb25zIH0gZnJvbSBcIi4vYXBwL2JhbGxvb25zXCJcbmltcG9ydCB7IEJhY2tncm91bmQgfSBmcm9tIFwiLi9hcHAvYmFja2dyb3VuZFwiXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCAoZXZlbnQpID0+IGV2ZW50LnByZXZlbnREZWZhdWx0KCkpXG5cbmNvbnN0IG1ldGVyID0gbmV3IEZQU01ldGVyKHVuZGVmaW5lZCwge1xuICByaWdodDogXCIzcHhcIixcbiAgbGVmdDogXCJpbmhlcml0XCIsXG4gIGdyYXBoOiAxLFxufSlcblxuZXhwb3J0IGZ1bmN0aW9uIHNldHVwKCkge1xuICBjcmVhdGVDYW52YXMoXG4gICAgTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKSxcbiAgICBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0LCB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgMClcbiAgKVxuXG4gIGdhbWUuYWRkQ2hpbGQobmV3IEJhY2tncm91bmQoKSlcbiAgZ2FtZS5hZGRDaGlsZChuZXcgQmFsbG9vbnMoMykpXG4gIGdhbWUuYWRkQ2hpbGQobmV3IEN1cnNvcigpKVxuXG4gIGdhbWUuc2V0dXAoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlKCkge1xuICBtZXRlci50aWNrU3RhcnQoKVxuICBpZiAoZ2FtZS5pc1NldHVwKSB7XG4gICAgZ2FtZS51cGRhdGUodHJ1ZSlcbiAgfSBlbHNlIHtcbiAgICBmcmFtZVJhdGUoMClcbiAgICByZXR1cm5cbiAgfVxuICBtZXRlci50aWNrKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGtleVByZXNzZWQoKSB7fVxuZXhwb3J0IGZ1bmN0aW9uIGtleVJlbGVhc2VkKCkge31cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZVByZXNzZWQoKSB7XG4gIGdhbWUubW91c2VQcmVzc2VkKClcbn1cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZVJlbGVhc2VkKCkge1xuICBnYW1lLm1vdXNlUmVsZWFzZWQoKVxufVxuXG4vKipcbiAqIGRlYnVnIGltcG9ydHMgKGFjY2Vzc2libGUgZnJvbSBmcm9udGVuZCBjb25zb2xlIHdpdGggYGFwcC5yb290YClcbiAqL1xuZXhwb3J0IGNvbnN0IHJvb3QgPSBnYW1lXG4iLCAiaW1wb3J0IHsgQmFzZSwgQW5pbWF0aW9uIH0gZnJvbSBcIkBnaG9tL2VudGl0eS1wNVwiXG5cbmV4cG9ydCBjbGFzcyBHYW1lIGV4dGVuZHMgQmFzZSB7XG4gIHByaXZhdGUgX3Njb3JlID0gMFxuXG4gIGdldCBzY29yZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc2NvcmVcbiAgfVxuXG4gIHNldCBzY29yZShzY29yZSkge1xuICAgIGlmICh0aGlzLl9zY29yZSAhPT0gc2NvcmUpIHtcbiAgICAgIGNvbnN0IHNjb3JlVXAgPSBzY29yZSA+IHRoaXMuX3Njb3JlXG5cbiAgICAgIGNvbnN0IGJhc2VUZXh0U2l6ZSA9IGhlaWdodCAqIDAuMDVcblxuICAgICAgdGhpcy5hZGRDaGlsZChcbiAgICAgICAgbmV3IEFuaW1hdGlvbih7XG4gICAgICAgICAgZnJvbTogMCxcbiAgICAgICAgICB0bzogMSxcbiAgICAgICAgICBkdXJhdGlvbjogMTAwLFxuICAgICAgICAgIGFmdGVyVXBkYXRlOiAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIG5vU3Ryb2tlKClcbiAgICAgICAgICAgIGZpbGwoXG4gICAgICAgICAgICAgIHNjb3JlVXBcbiAgICAgICAgICAgICAgICA/IGNvbG9yKDEwMCwgMjU1LCAyNTUsICgxIC0gdmFsdWUpICogMjU1KVxuICAgICAgICAgICAgICAgIDogY29sb3IoMjU1LCAxMDAsIDEwMCwgKDEgLSB2YWx1ZSkgKiAyNTUpXG4gICAgICAgICAgICApXG4gICAgICAgICAgICB0ZXh0QWxpZ24oQ0VOVEVSLCBDRU5URVIpXG4gICAgICAgICAgICB0ZXh0U2l6ZShiYXNlVGV4dFNpemUgKiBNYXRoLm1heCgxLCB2YWx1ZSArIDAuNSkpXG4gICAgICAgICAgICB0ZXh0KGBTY29yZTogJHtzY29yZX1gLCB3aWR0aCAvIDIsIGhlaWdodCAqIDAuMSlcbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuICAgICAgKVxuXG4gICAgICB0aGlzLl9zY29yZSA9IHNjb3JlXG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKVxuICB9XG5cbiAgYWZ0ZXJVcGRhdGUoKSB7XG4gICAgdGhpcy5kcmF3U2NvcmUoKVxuICAgIHRoaXMuZHJhd1NjaGVtYSgpXG4gIH1cblxuICBkcmF3U2NvcmUoKSB7XG4gICAgbm9TdHJva2UoKVxuICAgIGZpbGwoMTcwKVxuICAgIHRleHRTaXplKGhlaWdodCAqIDAuMDUpXG4gICAgdGV4dEFsaWduKENFTlRFUiwgQ0VOVEVSKVxuICAgIHRleHQoYFNjb3JlOiAke3RoaXMuc2NvcmV9YCwgd2lkdGggLyAyLCBoZWlnaHQgKiAwLjEpXG4gIH1cblxuICBkcmF3U2NoZW1hKCkge1xuICAgIG5vU3Ryb2tlKClcbiAgICBmaWxsKDkwKVxuICAgIHRleHRTaXplKGhlaWdodCAqIDAuMDIpXG4gICAgdGV4dEFsaWduKExFRlQsIFRPUClcbiAgICB0ZXh0KHRoaXMuc2NoZW1hKDUpLCAyMCwgMjApXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGdhbWUgPSBuZXcgR2FtZSgpXG4iLCAiaW1wb3J0IHsgQW5pbWF0aW9uLCBlYXNpbmdTZXQsIFBhcmFsbGVsLCBTZXF1ZW5jZSwgQmFzZSB9IGZyb20gXCJAZ2hvbS9lbnRpdHktcDVcIlxuXG5jb25zdCBISVNUT1JZX0xFTkdUSCA9IDEwMFxuXG5leHBvcnQgY2xhc3MgQ3Vyc29yIGV4dGVuZHMgQmFzZSB7XG4gIHggPSAwXG4gIHkgPSAwXG4gIGRpYW1ldGVyID0gMTVcblxuICBwdWJsaWMgaGlzdG9yeTogW3g6IG51bWJlciwgeTogbnVtYmVyXVtdID0gW11cblxuICBvblVwZGF0ZSgpIHtcbiAgICB0aGlzLmhpc3RvcnkucHVzaChbdGhpcy54LCB0aGlzLnldKVxuICAgIHRoaXMueCA9IG1vdXNlWFxuICAgIHRoaXMueSA9IG1vdXNlWVxuICAgIHdoaWxlICh0aGlzLmhpc3RvcnkubGVuZ3RoID4gSElTVE9SWV9MRU5HVEgpIHRoaXMuaGlzdG9yeS5zaGlmdCgpXG4gICAgdGhpcy5kcmF3KClcbiAgfVxuXG4gIGRyYXcoKSB7XG4gICAgbGV0IGxhc3QgPSB0aGlzLmhpc3RvcnlbMF1cbiAgICBmb3IgKGNvbnN0IHBvcyBvZiB0aGlzLmhpc3RvcnkpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5oaXN0b3J5LmluZGV4T2YocG9zKVxuICAgICAgc3Ryb2tlKGZsb29yKG1hcChpbmRleCwgdGhpcy5oaXN0b3J5Lmxlbmd0aCwgMCwgMjU1LCAwKSkpXG4gICAgICBzdHJva2VXZWlnaHQoZmxvb3IobWFwKGluZGV4LCB0aGlzLmhpc3RvcnkubGVuZ3RoLCAwLCB0aGlzLmRpYW1ldGVyLCAwKSkpXG4gICAgICBsaW5lKC4uLmxhc3QsIC4uLnBvcylcbiAgICAgIGxhc3QgPSBwb3NcbiAgICB9XG4gIH1cblxuICBvbk1vdXNlUmVsZWFzZWQoKSB7XG4gICAgbGV0IHggPSBtb3VzZVhcbiAgICBsZXQgeSA9IG1vdXNlWVxuXG4gICAgdGhpcy5hZGRDaGlsZChcbiAgICAgIG5ldyBBbmltYXRpb24oe1xuICAgICAgICBmcm9tOiAwLFxuICAgICAgICB0bzogdGhpcy5kaWFtZXRlciAqIDUsXG4gICAgICAgIGR1cmF0aW9uOiAyMDAsXG4gICAgICAgIGVhc2luZzogZWFzaW5nU2V0LmVhc2VPdXRRdWFydCxcbiAgICAgICAgb25VcGRhdGU6ICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIG5vRmlsbCgpXG4gICAgICAgICAgc3Ryb2tlKDI1NSwgKCh0aGlzLmRpYW1ldGVyICogNSAtIHZhbHVlKSAvICh0aGlzLmRpYW1ldGVyICogNSkpICogMjU1KVxuICAgICAgICAgIHN0cm9rZVdlaWdodCh0aGlzLmRpYW1ldGVyIC8gNClcbiAgICAgICAgICBjaXJjbGUoeCwgeSwgdmFsdWUpXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIClcbiAgfVxufVxuIiwgImltcG9ydCB7IEJhc2UgfSBmcm9tIFwiQGdob20vZW50aXR5LXA1XCJcbmltcG9ydCB7IGdhbWUgfSBmcm9tIFwiLi9nYW1lXCJcblxuZXhwb3J0IGNsYXNzIEJhbGxvb24gZXh0ZW5kcyBCYXNlIHtcbiAgY29sb3IgPSBjb2xvcihyYW5kb20oMTAwLCAyMDApLCByYW5kb20oMTAwLCAyMDApLCByYW5kb20oMTAwLCAyMDApKVxuICB4ID0gcmFuZG9tKDAsIHdpZHRoKVxuICB5ID0gcmFuZG9tKDAsIGhlaWdodClcbiAgZGlhbWV0ZXIgPSByYW5kb20oNDAsIDYwKVxuXG4gIG9uVXBkYXRlKCkge1xuICAgIGZpbGwodGhpcy5jb2xvcilcbiAgICBpZiAodGhpcy5pc0hvdmVyZWQpIHtcbiAgICAgIHN0cm9rZSgyNTUpXG4gICAgICBzdHJva2VXZWlnaHQoNSlcbiAgICB9IGVsc2Ugbm9TdHJva2UoKVxuICAgIGNpcmNsZSh0aGlzLngsIHRoaXMueSwgdGhpcy5kaWFtZXRlcilcbiAgfVxuXG4gIG9uVGVhcmRvd24oKSB7XG4gICAgZ2FtZS5zY29yZSsrXG4gIH1cblxuICBvbk1vdXNlUHJlc3NlZCgpIHtcbiAgICBpZiAodGhpcy5pc0hvdmVyZWQpIHtcbiAgICAgIGlmICh0aGlzLnBhcmVudC5jaGlsZHJlbi5sZW5ndGggPiAxKVxuICAgICAgICB0aGlzLnBhcmVudC5zdG9wVHJhbnNtaXNzaW9uKFwibW91c2VQcmVzc2VkXCIpXG5cbiAgICAgIHRoaXMucGFyZW50LmFkZENoaWxkKG5ldyBCYWxsb29uKCkpXG4gICAgICB0aGlzLnRlYXJkb3duKClcbiAgICB9XG4gIH1cblxuICBnZXQgaXNIb3ZlcmVkKCkge1xuICAgIHJldHVybiBkaXN0KG1vdXNlWCwgbW91c2VZLCB0aGlzLngsIHRoaXMueSkgPCB0aGlzLmRpYW1ldGVyIC8gMlxuICB9XG59XG4iLCAiaW1wb3J0IHsgQmFsbG9vbiB9IGZyb20gXCIuL2JhbGxvb25cIlxuaW1wb3J0IHsgQmFzZSB9IGZyb20gXCJAZ2hvbS9lbnRpdHktcDVcIlxuXG5leHBvcnQgY2xhc3MgQmFsbG9vbnMgZXh0ZW5kcyBCYXNlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjb3VudDogbnVtYmVyKSB7XG4gICAgc3VwZXIoKVxuICB9XG5cbiAgb25TZXR1cCgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY291bnQ7IGkrKykge1xuICAgICAgdGhpcy5hZGRDaGlsZChuZXcgQmFsbG9vbigpKVxuICAgIH1cbiAgfVxufVxuIiwgImltcG9ydCB7IEJhc2UgfSBmcm9tIFwiQGdob20vZW50aXR5LXA1XCJcblxuZXhwb3J0IGNsYXNzIEJhY2tncm91bmQgZXh0ZW5kcyBCYXNlIHtcbiAgcHJpdmF0ZSBub2lzZVNjYWxlID0gMC41XG5cbiAgb25VcGRhdGUoKSB7XG4gICAgYmFja2dyb3VuZCgwKVxuICAgIGZvciAobGV0IHggPSAwOyB4ICogNTAgPCB3aWR0aDsgeCsrKSB7XG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSAqIDUwIDwgaGVpZ2h0OyB5KyspIHtcbiAgICAgICAgZmlsbChcbiAgICAgICAgICBub2lzZShcbiAgICAgICAgICAgIHggKiB0aGlzLm5vaXNlU2NhbGUsXG4gICAgICAgICAgICB5ICogdGhpcy5ub2lzZVNjYWxlICsgdGhpcy5mcmFtZUNvdW50IC8gMTAwXG4gICAgICAgICAgKSAqIDEwMFxuICAgICAgICApXG4gICAgICAgIG5vU3Ryb2tlKClcbiAgICAgICAgcmVjdCh4ICogNTAgKyAyLCB5ICogNTAgKyAyLCA0NiwgNDYsIDUpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFDQSxhQUFPLGVBQWUsU0FBUyxjQUFjLEVBQUUsT0FBTztBQUN0RCxjQUFRLGVBQWU7QUFDdkIsK0JBQW1CO0FBQUEsUUFDZixjQUFjO0FBQ1YsZUFBSyxhQUFhO0FBQUE7QUFBQSxRQUV0QixHQUFHLE1BQU0sS0FBSztBQUNWLGVBQUssV0FBVyxLQUFLLEVBQUUsTUFBTTtBQUFBO0FBQUEsUUFFakMs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
