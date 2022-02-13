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
    draw: () => draw,
    keyPressed: () => keyPressed,
    keyReleased: () => keyReleased,
    mousePressed: () => mousePressed,
    mouseReleased: () => mouseReleased,
    root: () => root,
    setup: () => setup
  });

  // node_modules/entity-p5/src/app/entity.ts
  var Entity = class {
    constructor() {
      this._isSetup = false;
      this._children = new Set();
      this._listeners = [];
      this._stopPoints = {
        setup: false,
        draw: false,
        update: false,
        teardown: false,
        keyPressed: false,
        keyReleased: false,
        mousePressed: false,
        mouseReleased: false
      };
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
    onKeyReleased() {
    }
    onKeyPressed() {
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
      let children = name === "mouseReleased" || name === "mousePressed" || name === "keyPressed" || name === "keyReleased" ? this.children.sort((a, b) => a.zIndex - b.zIndex) : this.children.sort((a, b) => b.zIndex - a.zIndex);
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
    schema(indentation = 2, depth = 0, index = null) {
      return `${" ".repeat(indentation).repeat(depth)}${index === null ? "" : `${index} - `}${this.constructor.name} [${this.isSetup ? "on" : "off"}]${this._children.size > 0 ? `:
${this.children.map((child, index2) => `${child.schema(indentation, depth + 1, index2)}`).join("\n")}` : ""}`;
    }
  };

  // node_modules/entity-p5/src/app/drawable.ts
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

  // node_modules/entity-p5/src/app/shape.ts
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
  return src_exports;
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2luZGV4LnRzIiwgIm5vZGVfbW9kdWxlcy9lbnRpdHktcDUvc3JjL2FwcC9lbnRpdHkudHMiLCAibm9kZV9tb2R1bGVzL2VudGl0eS1wNS9zcmMvYXBwL2RyYXdhYmxlLnRzIiwgIm5vZGVfbW9kdWxlcy9lbnRpdHktcDUvc3JjL2FwcC9zaGFwZS50cyIsICJzcmMvYXBwL2dhbWUudHMiLCAic3JjL2FwcC9jdXJzb3IudHMiLCAic3JjL2FwcC9iYWxsb29uLnRzIiwgInNyYy9hcHAvYmFsbG9vbnMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vLyBAdHMtY2hlY2tcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvQHR5cGVzL3A1L2dsb2JhbC5kLnRzXCIgLz5cblxuaW1wb3J0IHsgZ2FtZSB9IGZyb20gXCIuL2FwcC9nYW1lXCJcbmltcG9ydCB7IEN1cnNvciB9IGZyb20gXCIuL2FwcC9jdXJzb3JcIlxuaW1wb3J0IHsgQmFsbG9vbnMgfSBmcm9tIFwiLi9hcHAvYmFsbG9vbnNcIlxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgKGV2ZW50KSA9PiBldmVudC5wcmV2ZW50RGVmYXVsdCgpKVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0dXAoKSB7XG4gIGNyZWF0ZUNhbnZhcyhcbiAgICBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsIHdpbmRvdy5pbm5lcldpZHRoIHx8IDApLFxuICAgIE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKVxuICApXG5cbiAgbmV3IEJhbGxvb25zKDEpXG4gIG5ldyBDdXJzb3IoKVxuXG4gIGdhbWUuc2V0dXAoKVxuICBnYW1lLnNjaGVtYSgyKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZHJhdygpIHtcbiAgYmFja2dyb3VuZCgyMClcblxuICBnYW1lLmRyYXcoKVxuICBnYW1lLnVwZGF0ZSgpXG59XG5cbi8vIHRvZG86IGFkZCBmcmFtZXJhdGUgbGltaXQgc2V0dGluZyAodXNpbmcgRGF0YS5ub3coKSlcbi8vIGZpeG1lOiBub3QgY2FsbGVkIG9uIHVwZGF0ZVxuLy8gZnVuY3Rpb24gdGljaygpIHtcbi8vICAgZW50aXR5LnJvb3RFbnRpdHkudXBkYXRlKClcbi8vXG4vLyAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKVxuLy8gfVxuXG5leHBvcnQgZnVuY3Rpb24ga2V5UHJlc3NlZCgpIHt9XG5leHBvcnQgZnVuY3Rpb24ga2V5UmVsZWFzZWQoKSB7fVxuZXhwb3J0IGZ1bmN0aW9uIG1vdXNlUHJlc3NlZCgpIHtcbiAgZ2FtZS5tb3VzZVByZXNzZWQoKVxufVxuZXhwb3J0IGZ1bmN0aW9uIG1vdXNlUmVsZWFzZWQoKSB7XG4gIGdhbWUubW91c2VSZWxlYXNlZCgpXG59XG5cbi8vIGRlYnVnIGltcG9ydHNcbmV4cG9ydCBjb25zdCByb290ID0gZ2FtZVxuIiwgImV4cG9ydCB0eXBlIEVudGl0eUV2ZW50TmFtZSA9XG4gIHwgXCJzZXR1cFwiXG4gIHwgXCJkcmF3XCJcbiAgfCBcInVwZGF0ZVwiXG4gIHwgXCJ0ZWFyZG93blwiXG4gIHwgXCJtb3VzZVByZXNzZWRcIlxuICB8IFwibW91c2VSZWxlYXNlZFwiXG4gIHwgXCJrZXlQcmVzc2VkXCJcbiAgfCBcImtleVJlbGVhc2VkXCJcblxuZXhwb3J0IHR5cGUgRW50aXR5TGlzdGVuZXI8VGhpcyBleHRlbmRzIEVudGl0eT4gPSAoXG4gIHRoaXM6IFRoaXMsXG4gIGl0OiBUaGlzXG4pID0+IHVua25vd25cblxuZXhwb3J0IGNsYXNzIEVudGl0eSB7XG4gIHByb3RlY3RlZCBfaXNTZXR1cCA9IGZhbHNlXG4gIHByb3RlY3RlZCBfY2hpbGRyZW4gPSBuZXcgU2V0PEVudGl0eT4oKVxuICBwcm90ZWN0ZWQgX3pJbmRleD86IG51bWJlclxuICBwcm90ZWN0ZWQgX3BhcmVudD86IEVudGl0eVxuICBwcm90ZWN0ZWQgX2xpc3RlbmVyczogRW50aXR5TGlzdGVuZXI8dGhpcz5bXSA9IFtdXG4gIHByb3RlY3RlZCBfc3RvcFBvaW50czogUmVjb3JkPEVudGl0eUV2ZW50TmFtZSwgYm9vbGVhbj4gPSB7XG4gICAgc2V0dXA6IGZhbHNlLFxuICAgIGRyYXc6IGZhbHNlLFxuICAgIHVwZGF0ZTogZmFsc2UsXG4gICAgdGVhcmRvd246IGZhbHNlLFxuICAgIGtleVByZXNzZWQ6IGZhbHNlLFxuICAgIGtleVJlbGVhc2VkOiBmYWxzZSxcbiAgICBtb3VzZVByZXNzZWQ6IGZhbHNlLFxuICAgIG1vdXNlUmVsZWFzZWQ6IGZhbHNlLFxuICB9XG5cbiAgZ2V0IGlzU2V0dXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lzU2V0dXBcbiAgfVxuXG4gIGdldCBjaGlsZHJlbigpOiBBcnJheTxFbnRpdHk+IHtcbiAgICByZXR1cm4gWy4uLnRoaXMuX2NoaWxkcmVuXVxuICB9XG5cbiAgZ2V0IHpJbmRleCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl96SW5kZXggPz8gdGhpcy5wYXJlbnQ/LmNoaWxkcmVuLmluZGV4T2YodGhpcykgPz8gMFxuICB9XG5cbiAgZ2V0IHBhcmVudCgpOiBFbnRpdHkgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnRcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXByZXNlbnQgYW55IHN0YXRlLWJhc2VkIGVudGl0eVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIGJlIG92ZXJ3cml0dGVuIGJ5IHlvdXIgb3duIHdvcmtpbmdzXG4gICAqL1xuICBvblNldHVwKCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25EcmF3KCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25VcGRhdGUoKSB7fVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIGJlIG92ZXJ3cml0dGVuIGJ5IHlvdXIgb3duIHdvcmtpbmdzXG4gICAqL1xuICBvblRlYXJkb3duKCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25Nb3VzZVJlbGVhc2VkKCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25Nb3VzZVByZXNzZWQoKSB7fVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIGJlIG92ZXJ3cml0dGVuIGJ5IHlvdXIgb3duIHdvcmtpbmdzXG4gICAqL1xuICBvbktleVJlbGVhc2VkKCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25LZXlQcmVzc2VkKCkge31cblxuICAvKipcbiAgICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjdXJyZW50IGVudGl0eSBpcyBhIHJvb3QuXG4gICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXG4gICAqL1xuICBwdWJsaWMgc2V0dXAoKSB7XG4gICAgaWYgKCF0aGlzLmlzU2V0dXApIHtcbiAgICAgIHRoaXMub25TZXR1cCgpXG4gICAgICB0aGlzLnRyYW5zbWl0KFwic2V0dXBcIilcbiAgICAgIHRoaXMuX2lzU2V0dXAgPSB0cnVlXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkVudGl0eSBpcyBhbHJlYWR5IHNldHVwXCIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxuICAgKi9cbiAgcHVibGljIGRyYXcoKSB7XG4gICAgaWYgKHRoaXMuaXNTZXR1cCkge1xuICAgICAgdGhpcy5vbkRyYXcoKVxuICAgICAgdGhpcy50cmFuc21pdChcImRyYXdcIilcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKFwiRHJhdyBpcyBjYWxsZWQgYmVmb3JlIHNldHVwXCIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxuICAgKi9cbiAgcHVibGljIHVwZGF0ZSgpIHtcbiAgICBpZiAodGhpcy5pc1NldHVwKSB7XG4gICAgICB0aGlzLm9uVXBkYXRlKClcbiAgICAgIHRoaXMudHJhbnNtaXQoXCJ1cGRhdGVcIilcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKFwidXBkYXRlIGlzIGNhbGxlZCBiZWZvcmUgc2V0dXBcIilcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjdXJyZW50IGVudGl0eSBpcyBhIHJvb3QuXG4gICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXG4gICAqL1xuICBwdWJsaWMgdGVhcmRvd24oKSB7XG4gICAgaWYgKHRoaXMuaXNTZXR1cCkge1xuICAgICAgdGhpcy5faXNTZXR1cCA9IGZhbHNlXG4gICAgICB0aGlzLm9uVGVhcmRvd24oKVxuICAgICAgdGhpcy5fcGFyZW50Py5yZW1vdmVDaGlsZCh0aGlzKVxuICAgICAgdGhpcy50cmFuc21pdChcInRlYXJkb3duXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkVudGl0eSBtdXN0IGJlIHNldHVwIGJlZm9yZVwiKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cbiAgICogU2hvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiFcbiAgICovXG4gIHB1YmxpYyBtb3VzZVByZXNzZWQoKSB7XG4gICAgaWYgKHRoaXMuaXNTZXR1cCkge1xuICAgICAgdGhpcy5vbk1vdXNlUHJlc3NlZCgpXG4gICAgICB0aGlzLnRyYW5zbWl0KFwibW91c2VQcmVzc2VkXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybihcIm1vdXNlUHJlc3NlZCBpcyBjYWxsZWQgYmVmb3JlIHNldHVwXCIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxuICAgKi9cbiAgcHVibGljIG1vdXNlUmVsZWFzZWQoKSB7XG4gICAgaWYgKHRoaXMuaXNTZXR1cCkge1xuICAgICAgdGhpcy5vbk1vdXNlUmVsZWFzZWQoKVxuICAgICAgdGhpcy50cmFuc21pdChcIm1vdXNlUmVsZWFzZWRcIilcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKFwibW91c2VQcmVzc2VkIGlzIGNhbGxlZCBiZWZvcmUgc2V0dXBcIilcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjdXJyZW50IGVudGl0eSBpcyBhIHJvb3QuXG4gICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXG4gICAqL1xuICBwdWJsaWMga2V5UHJlc3NlZCgpIHtcbiAgICBpZiAodGhpcy5pc1NldHVwKSB7XG4gICAgICB0aGlzLm9uS2V5UHJlc3NlZCgpXG4gICAgICB0aGlzLnRyYW5zbWl0KFwia2V5UHJlc3NlZFwiKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJrZXlQcmVzc2VkIGlzIGNhbGxlZCBiZWZvcmUgc2V0dXBcIilcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjdXJyZW50IGVudGl0eSBpcyBhIHJvb3QuXG4gICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXG4gICAqL1xuICBwdWJsaWMga2V5UmVsZWFzZWQoKSB7XG4gICAgaWYgKHRoaXMuaXNTZXR1cCkge1xuICAgICAgdGhpcy5vbktleVJlbGVhc2VkKClcbiAgICAgIHRoaXMudHJhbnNtaXQoXCJrZXlSZWxlYXNlZFwiKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJrZXlSZWxlYXNlZCBpcyBjYWxsZWQgYmVmb3JlIHNldHVwXCIpXG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uKG5hbWU6IEVudGl0eUV2ZW50TmFtZSwgbGlzdGVuZXI6IEVudGl0eUxpc3RlbmVyPHRoaXM+KSB7XG4gICAgdGhpcy5fbGlzdGVuZXJzLnB1c2goXG4gICAgICB7XG4gICAgICAgIFtuYW1lXSgpIHtcbiAgICAgICAgICBsaXN0ZW5lci5iaW5kKHRoaXMpKHRoaXMpXG4gICAgICAgIH0sXG4gICAgICB9W25hbWVdLmJpbmQodGhpcylcbiAgICApXG4gIH1cblxuICBwdWJsaWMgYWRkQ2hpbGQoLi4uY2hpbGRyZW46IEVudGl0eVtdKSB7XG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgICAgY2hpbGQuX3BhcmVudCA9IHRoaXNcbiAgICAgIHRoaXMuX2NoaWxkcmVuLmFkZChjaGlsZClcbiAgICAgIGlmICh0aGlzLmlzU2V0dXApIGNoaWxkLnNldHVwKClcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVtb3ZlQ2hpbGQoLi4uY2hpbGRyZW46IEVudGl0eVtdKSB7XG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgICAgaWYgKGNoaWxkLmlzU2V0dXApIGNoaWxkLnRlYXJkb3duKClcbiAgICAgIGVsc2UgdGhpcy5fY2hpbGRyZW4uZGVsZXRlKGNoaWxkKVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzdG9wVHJhbnNtaXNzaW9uKG5hbWU6IEVudGl0eUV2ZW50TmFtZSkge1xuICAgIHRoaXMuX3N0b3BQb2ludHNbbmFtZV0gPSB0cnVlXG4gIH1cblxuICBwcml2YXRlIHRyYW5zbWl0KG5hbWU6IEVudGl0eUV2ZW50TmFtZSkge1xuICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgdGhpcy5nZXRMaXN0ZW5lcnNCeU5hbWUobmFtZSkpXG4gICAgICBsaXN0ZW5lci5iaW5kKHRoaXMpKHRoaXMpXG5cbiAgICBsZXQgY2hpbGRyZW4gPVxuICAgICAgbmFtZSA9PT0gXCJtb3VzZVJlbGVhc2VkXCIgfHxcbiAgICAgIG5hbWUgPT09IFwibW91c2VQcmVzc2VkXCIgfHxcbiAgICAgIG5hbWUgPT09IFwia2V5UHJlc3NlZFwiIHx8XG4gICAgICBuYW1lID09PSBcImtleVJlbGVhc2VkXCJcbiAgICAgICAgPyB0aGlzLmNoaWxkcmVuLnNvcnQoKGEsIGIpID0+IGEuekluZGV4IC0gYi56SW5kZXgpXG4gICAgICAgIDogdGhpcy5jaGlsZHJlbi5zb3J0KChhLCBiKSA9PiBiLnpJbmRleCAtIGEuekluZGV4KVxuXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgICAgaWYgKHRoaXMuX3N0b3BQb2ludHNbbmFtZV0pIHtcbiAgICAgICAgdGhpcy5fc3RvcFBvaW50c1tuYW1lXSA9IGZhbHNlXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjaGlsZFtuYW1lXSgpXG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRMaXN0ZW5lcnNCeU5hbWUobmFtZTogRW50aXR5RXZlbnROYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xpc3RlbmVycy5maWx0ZXIoKGxpc3RlbmVyKSA9PiB7XG4gICAgICByZXR1cm4gbGlzdGVuZXIubmFtZSA9PT0gbmFtZVxuICAgIH0pXG4gIH1cblxuICBwdWJsaWMgc2NoZW1hKFxuICAgIGluZGVudGF0aW9uID0gMixcbiAgICBkZXB0aCA9IDAsXG4gICAgaW5kZXg6IG51bWJlciB8IG51bGwgPSBudWxsXG4gICk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAke1wiIFwiLnJlcGVhdChpbmRlbnRhdGlvbikucmVwZWF0KGRlcHRoKX0ke1xuICAgICAgaW5kZXggPT09IG51bGwgPyBcIlwiIDogYCR7aW5kZXh9IC0gYFxuICAgIH0ke3RoaXMuY29uc3RydWN0b3IubmFtZX0gWyR7dGhpcy5pc1NldHVwID8gXCJvblwiIDogXCJvZmZcIn1dJHtcbiAgICAgIHRoaXMuX2NoaWxkcmVuLnNpemUgPiAwXG4gICAgICAgID8gYDpcXG4ke3RoaXMuY2hpbGRyZW5cbiAgICAgICAgICAgIC5tYXAoXG4gICAgICAgICAgICAgIChjaGlsZCwgaW5kZXgpID0+IGAke2NoaWxkLnNjaGVtYShpbmRlbnRhdGlvbiwgZGVwdGggKyAxLCBpbmRleCl9YFxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmpvaW4oXCJcXG5cIil9YFxuICAgICAgICA6IFwiXCJcbiAgICB9YFxuICB9XG59XG4iLCAiaW1wb3J0ICogYXMgZW50aXR5IGZyb20gXCIuL2VudGl0eVwiXG5cbmV4cG9ydCBpbnRlcmZhY2UgRHJhd2FibGVTZXR0aW5ncyB7XG4gIGZpbGw6IGZhbHNlIHwgRmlsbE9wdGlvbnNcbiAgc3Ryb2tlOiBmYWxzZSB8IFN0cm9rZU9wdGlvbnNcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIERyYXdhYmxlIGV4dGVuZHMgZW50aXR5LkVudGl0eSB7XG4gIHByb3RlY3RlZCBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc2V0dGluZ3M/OiBEcmF3YWJsZVNldHRpbmdzKSB7XG4gICAgc3VwZXIoKVxuICB9XG5cbiAgb25EcmF3KCkge1xuICAgIGlmICghdGhpcy5zZXR0aW5ncykgcmV0dXJuXG5cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5maWxsKSB7XG4gICAgICBpZiAoXCJjb2xvclwiIGluIHRoaXMuc2V0dGluZ3MuZmlsbCkge1xuICAgICAgICBmaWxsKHRoaXMuc2V0dGluZ3MuZmlsbC5jb2xvcilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbGwodGhpcy5zZXR0aW5ncy5maWxsKVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLnN0cm9rZSkge1xuICAgICAgc3Ryb2tlV2VpZ2h0KHRoaXMuc2V0dGluZ3Muc3Ryb2tlLndlaWdodClcbiAgICAgIHN0cm9rZSh0aGlzLnNldHRpbmdzLnN0cm9rZS5jb2xvcilcbiAgICB9IGVsc2Uge1xuICAgICAgbm9TdHJva2UoKVxuICAgIH1cbiAgfVxufVxuIiwgImltcG9ydCB7IERyYXdhYmxlLCBEcmF3YWJsZVNldHRpbmdzIH0gZnJvbSBcIi4vZHJhd2FibGVcIlxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU2hhcGVcbiAgZXh0ZW5kcyBEcmF3YWJsZVxuICBpbXBsZW1lbnRzIFBvc2l0aW9uYWJsZSwgUmVzaXphYmxlXG57XG4gIGFic3RyYWN0IHg6IG51bWJlclxuICBhYnN0cmFjdCB5OiBudW1iZXJcbiAgYWJzdHJhY3Qgd2lkdGg6IG51bWJlclxuICBhYnN0cmFjdCBoZWlnaHQ6IG51bWJlclxuICBhYnN0cmFjdCByZWFkb25seSBjZW50ZXJYOiBudW1iZXJcbiAgYWJzdHJhY3QgcmVhZG9ubHkgY2VudGVyWTogbnVtYmVyXG5cbiAgZ2V0IGNlbnRlcigpOiBbeDogbnVtYmVyLCB5OiBudW1iZXJdIHtcbiAgICByZXR1cm4gW3RoaXMuY2VudGVyWCwgdGhpcy5jZW50ZXJZXVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSZWN0IGV4dGVuZHMgU2hhcGUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgeCA9IDAsXG4gICAgcHVibGljIHkgPSAwLFxuICAgIHB1YmxpYyB3aWR0aCA9IDAsXG4gICAgcHVibGljIGhlaWdodCA9IDAsXG4gICAgb3B0aW9ucz86IERyYXdhYmxlU2V0dGluZ3NcbiAgKSB7XG4gICAgc3VwZXIob3B0aW9ucylcbiAgfVxuXG4gIGdldCBjZW50ZXJYKCkge1xuICAgIHJldHVybiB0aGlzLnggKyB0aGlzLndpZHRoIC8gMlxuICB9XG5cbiAgZ2V0IGNlbnRlclkoKSB7XG4gICAgcmV0dXJuIHRoaXMueSArIHRoaXMuaGVpZ2h0IC8gMlxuICB9XG5cbiAgZ2V0IGlzSG92ZXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgbW91c2VYID4gdGhpcy54ICYmXG4gICAgICBtb3VzZVggPCB0aGlzLnggKyB0aGlzLndpZHRoICYmXG4gICAgICBtb3VzZVkgPiB0aGlzLnkgJiZcbiAgICAgIG1vdXNlWSA8IHRoaXMueSArIHRoaXMuaGVpZ2h0XG4gICAgKVxuICB9XG5cbiAgb25EcmF3KCkge1xuICAgIHN1cGVyLm9uRHJhdygpXG4gICAgcmVjdCh0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIENpcmNsZSBleHRlbmRzIFNoYXBlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHggPSAwLFxuICAgIHB1YmxpYyB5ID0gMCxcbiAgICBwdWJsaWMgZGlhbWV0ZXIgPSAwLFxuICAgIG9wdGlvbnM/OiBEcmF3YWJsZVNldHRpbmdzXG4gICkge1xuICAgIHN1cGVyKG9wdGlvbnMpXG4gIH1cblxuICBnZXQgd2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlhbWV0ZXJcbiAgfVxuXG4gIGdldCBoZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlhbWV0ZXJcbiAgfVxuXG4gIGdldCBjZW50ZXJYKCkge1xuICAgIHJldHVybiB0aGlzLnhcbiAgfVxuXG4gIGdldCBjZW50ZXJZKCkge1xuICAgIHJldHVybiB0aGlzLnlcbiAgfVxuXG4gIGdldCBpc0hvdmVyZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGRpc3QobW91c2VYLCBtb3VzZVksIHRoaXMueCwgdGhpcy55KSA8IHRoaXMuZGlhbWV0ZXIgLyAyXG4gIH1cblxuICBvbkRyYXcoKSB7XG4gICAgc3VwZXIub25EcmF3KClcbiAgICBjaXJjbGUodGhpcy54LCB0aGlzLnksIHRoaXMuZGlhbWV0ZXIpXG4gIH1cbn1cbiIsICJpbXBvcnQgeyBFbnRpdHkgfSBmcm9tIFwiZW50aXR5LXA1XCJcblxuZXhwb3J0IGNsYXNzIEdhbWUgZXh0ZW5kcyBFbnRpdHkge1xuICBzY29yZTogbnVtYmVyXG59XG5cbmV4cG9ydCBjb25zdCBnYW1lID0gbmV3IEdhbWUoKVxuIiwgImltcG9ydCB7IGdhbWUgfSBmcm9tIFwiLi9nYW1lXCJcbmltcG9ydCB7IENpcmNsZSB9IGZyb20gXCJlbnRpdHktcDVcIlxuXG5jb25zdCBISVNUT1JZX0xFTkdUSCA9IDEwMFxuXG5leHBvcnQgY2xhc3MgQ3Vyc29yIGV4dGVuZHMgQ2lyY2xlIHtcbiAgcHVibGljIGhpc3Rvcnk6IFt4OiBudW1iZXIsIHk6IG51bWJlcl1bXSA9IFtdXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoMCwgMCwgMTUpXG4gICAgZ2FtZS5hZGRDaGlsZCh0aGlzKVxuICB9XG5cbiAgb25VcGRhdGUoKSB7XG4gICAgdGhpcy5oaXN0b3J5LnB1c2goW3RoaXMueCwgdGhpcy55XSlcbiAgICB0aGlzLnggPSBtb3VzZVhcbiAgICB0aGlzLnkgPSBtb3VzZVlcbiAgICB3aGlsZSAodGhpcy5oaXN0b3J5Lmxlbmd0aCA+IEhJU1RPUllfTEVOR1RIKSB0aGlzLmhpc3Rvcnkuc2hpZnQoKVxuICB9XG5cbiAgb25EcmF3KCkge1xuICAgIGxldCBsYXN0ID0gdGhpcy5oaXN0b3J5WzBdXG4gICAgZm9yIChjb25zdCBwb3Mgb2YgdGhpcy5oaXN0b3J5KSB7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuaGlzdG9yeS5pbmRleE9mKHBvcylcbiAgICAgIHN0cm9rZShmbG9vcihtYXAoaW5kZXgsIHRoaXMuaGlzdG9yeS5sZW5ndGgsIDAsIDI1NSwgMCkpKVxuICAgICAgc3Ryb2tlV2VpZ2h0KGZsb29yKG1hcChpbmRleCwgdGhpcy5oaXN0b3J5Lmxlbmd0aCwgMCwgdGhpcy5kaWFtZXRlciwgMCkpKVxuICAgICAgbGluZSguLi5sYXN0LCAuLi5wb3MpXG4gICAgICBsYXN0ID0gcG9zXG4gICAgfVxuICB9XG59XG4iLCAiaW1wb3J0IHsgQ2lyY2xlIH0gZnJvbSBcImVudGl0eS1wNVwiXG5pbXBvcnQgeyBnYW1lIH0gZnJvbSBcIi4vZ2FtZVwiXG5cbmV4cG9ydCBjbGFzcyBCYWxsb29uIGV4dGVuZHMgQ2lyY2xlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIocmFuZG9tKDAsIHdpZHRoKSwgcmFuZG9tKDAsIGhlaWdodCksIHJhbmRvbSg0MCwgNjApLCB7XG4gICAgICBmaWxsOiBjb2xvcihyYW5kb20oMTAwLCAyMDApLCByYW5kb20oMTAwLCAyMDApLCByYW5kb20oMTAwLCAyMDApKSxcbiAgICAgIHN0cm9rZTogZmFsc2UsXG4gICAgfSlcbiAgfVxuXG4gIG9uVXBkYXRlKCkge1xuICAgIGlmICh0aGlzLmlzSG92ZXJlZCkge1xuICAgICAgdGhpcy5zZXR0aW5ncy5zdHJva2UgPSB7XG4gICAgICAgIGNvbG9yOiBjb2xvcigyNTUpLFxuICAgICAgICB3ZWlnaHQ6IDUsXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0dGluZ3Muc3Ryb2tlID0gZmFsc2VcbiAgICB9XG4gIH1cblxuICBvblRlYXJkb3duKCkge1xuICAgIGdhbWUuc2NvcmUrK1xuICB9XG5cbiAgb25Nb3VzZVJlbGVhc2VkKCkge1xuICAgIGlmICh0aGlzLmlzSG92ZXJlZCkge1xuICAgICAgaWYgKHRoaXMucGFyZW50LmNoaWxkcmVuLmxlbmd0aCA+IDEpXG4gICAgICAgIHRoaXMucGFyZW50LnN0b3BUcmFuc21pc3Npb24oXCJtb3VzZVJlbGVhc2VkXCIpXG5cbiAgICAgIHRoaXMucGFyZW50LmFkZENoaWxkKG5ldyBCYWxsb29uKCkpXG4gICAgICB0aGlzLnRlYXJkb3duKClcbiAgICB9XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBnYW1lIH0gZnJvbSBcIi4vZ2FtZVwiXG5pbXBvcnQgeyBCYWxsb29uIH0gZnJvbSBcIi4vYmFsbG9vblwiXG5pbXBvcnQgeyBFbnRpdHkgfSBmcm9tIFwiZW50aXR5LXA1XCJcblxuZXhwb3J0IGNsYXNzIEJhbGxvb25zIGV4dGVuZHMgRW50aXR5IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjb3VudDogbnVtYmVyKSB7XG4gICAgc3VwZXIoKVxuICAgIGdhbWUuYWRkQ2hpbGQodGhpcylcbiAgfVxuXG4gIG9uU2V0dXAoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNvdW50OyBpKyspIHtcbiAgICAgIHRoaXMuYWRkQ2hpbGQobmV3IEJhbGxvb24oKSlcbiAgICB9XG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7O0FDZU8scUJBQWE7QUFBQSxJQW9DbEIsY0FBYztBQW5DSixzQkFBVztBQUNYLHVCQUFZLElBQUk7QUFHaEIsd0JBQXFDO0FBQ3JDLHlCQUFnRDtBQUFBLFFBQ3hELE9BQU87QUFBQSxRQUNQLE1BQU07QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLFVBQVU7QUFBQSxRQUNWLFlBQVk7QUFBQSxRQUNaLGFBQWE7QUFBQSxRQUNiLGNBQWM7QUFBQSxRQUNkLGVBQWU7QUFBQTtBQUFBO0FBQUEsUUFHYixVQUFVO0FBQ1osYUFBTyxLQUFLO0FBQUE7QUFBQSxRQUdWLFdBQTBCO0FBQzVCLGFBQU8sQ0FBQyxHQUFHLEtBQUs7QUFBQTtBQUFBLFFBR2QsU0FBaUI7QUF4Q3ZCO0FBeUNJLGFBQU8saUJBQUssWUFBTCxZQUFnQixXQUFLLFdBQUwsbUJBQWEsU0FBUyxRQUFRLFVBQTlDLFlBQXVEO0FBQUE7QUFBQSxRQUc1RCxTQUE2QjtBQUMvQixhQUFPLEtBQUs7QUFBQTtBQUFBLElBV2QsVUFBVTtBQUFBO0FBQUEsSUFLVixTQUFTO0FBQUE7QUFBQSxJQUtULFdBQVc7QUFBQTtBQUFBLElBS1gsYUFBYTtBQUFBO0FBQUEsSUFLYixrQkFBa0I7QUFB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
