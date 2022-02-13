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
    Entity: () => Entity2,
    draw: () => draw,
    keyPressed: () => keyPressed,
    keyReleased: () => keyReleased,
    mousePressed: () => mousePressed,
    mouseReleased: () => mouseReleased,
    root: () => root,
    setup: () => setup
  });

  // src/lib/entity.ts
  var _Entity = class {
    constructor() {
      this._isSetup = false;
      this._children = new Set();
      this._listeners = [];
      this._stopPoints = {
        setup: false,
        draw: false,
        update: false,
        teardown: false,
        mousePressed: false,
        mouseReleased: false
      };
    }
    static schema(indentation = 2) {
      return console.log(this.root.schema(indentation < 1 ? 2 : indentation));
    }
    static setup() {
      this.root.setup();
    }
    static draw() {
      this.root.draw();
    }
    static update() {
      this.root.update();
    }
    static teardown() {
      this.root.teardown();
    }
    static mouseReleased() {
      this.root.mouseReleased();
    }
    static mousePressed() {
      this.root.mousePressed();
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
    mouseReleased() {
      if (this.isSetup) {
        this.onMouseReleased();
        this.transmit("mouseReleased");
      } else {
        console.warn("mousePressed is called before setup");
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
      let children = name === "mouseReleased" || name === "mousePressed" ? this.children.sort((a, b) => a.zIndex - b.zIndex) : this.children.sort((a, b) => b.zIndex - a.zIndex);
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
    schema(indentation, depth = 0, index = null) {
      return `${" ".repeat(indentation).repeat(depth)}${index === null ? "" : `${index} - `}${this.constructor.name} [${this.isSetup ? "on" : "off"}]${this._children.size > 0 ? `:
${this.children.map((child, index2) => `${child.schema(indentation, depth + 1, index2)}`).join("\n")}` : ""}`;
    }
  };
  var Entity = _Entity;
  Entity.root = new _Entity();

  // src/app/hitbox.ts
  var HitBox = class extends Entity {
    constructor(x = 0, y = 0, width2 = 0, height2 = 0) {
      super();
      this.x = x;
      this.y = y;
      this.width = width2;
      this.height = height2;
    }
    get center() {
      return [this.x + this.width / 2, this.y + this.height / 2];
    }
    get isHovered() {
      return mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height;
    }
  };
  var HitEllipse = class extends HitBox {
    constructor(x = 0, y = 0, diameter = 0) {
      super(x, y, diameter, diameter);
      this.diameter = diameter;
    }
    get center() {
      return [this.x, this.y];
    }
    get isHovered() {
      return dist(mouseX, mouseY, this.x, this.y) < this.diameter / 2;
    }
  };

  // src/app/cursor.ts
  var HISTORY_LENGTH = 100;
  var Cursor = class extends HitEllipse {
    constructor() {
      super(0, 0, 15);
      this.history = [];
      Cursor.root.addChild(this);
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
        strokeWeight(floor(map(index, this.history.length, 0, this.diameter / 2, 0)));
        line(...last, ...pos);
        last = pos;
      }
      fill(255);
      noStroke();
      circle(mouseX, mouseY, this.diameter);
    }
  };
  var cursor = new Cursor();

  // src/app/game.ts
  var context = {
    score: 0
  };

  // src/app/balloon.ts
  var Balloon = class extends HitEllipse {
    onSetup() {
      this.color = color(random(100, 200), random(100, 200), random(100, 200));
      this.x = random(0, width);
      this.y = random(0, height);
      this.diameter = random(40, 60);
    }
    onDraw() {
      if (this.isHovered) {
        stroke(255);
      } else {
        noStroke();
      }
      fill(this.color);
      circle(...this.center, this.diameter);
    }
    onTeardown() {
      context.score++;
      if (this.parent.children.length > 2)
        this.parent.stopTransmission("mouseReleased");
    }
    onMouseReleased() {
      if (this.isHovered) {
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
      Balloons.root.addChild(this);
    }
    onSetup() {
      for (let i = 0; i < this.count; i++) {
        this.addChild(new Balloon());
      }
    }
  };
  var balloons = new Balloons(1);

  // src/index.ts
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  function setup() {
    createCanvas(Math.max(document.documentElement.clientWidth, window.innerWidth || 0), Math.max(document.documentElement.clientHeight, window.innerHeight || 0));
    Entity.setup();
    Entity.schema(2);
  }
  function draw() {
    background(20);
    Entity.draw();
    Entity.update();
  }
  function keyPressed() {
  }
  function keyReleased() {
  }
  function mousePressed() {
    Entity.mousePressed();
  }
  function mouseReleased() {
    Entity.mouseReleased();
  }
  var root = Entity.root;
  var Entity2 = Entity;
  return src_exports;
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2luZGV4LnRzIiwgInNyYy9saWIvZW50aXR5LnRzIiwgInNyYy9hcHAvaGl0Ym94LnRzIiwgInNyYy9hcHAvY3Vyc29yLnRzIiwgInNyYy9hcHAvZ2FtZS50cyIsICJzcmMvYXBwL2JhbGxvb24udHMiLCAic3JjL2FwcC9iYWxsb29ucy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8vIEB0cy1jaGVja1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9AdHlwZXMvcDUvZ2xvYmFsLmQudHNcIiAvPlxuXG5pbXBvcnQgKiBhcyBlbnRpdHkgZnJvbSBcIi4vbGliL2VudGl0eVwiXG5cbmltcG9ydCBcIi4vYXBwL2N1cnNvclwiXG5pbXBvcnQgXCIuL2FwcC9iYWxsb29uXCJcbmltcG9ydCBcIi4vYXBwL2JhbGxvb25zXCJcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIChldmVudCkgPT4gZXZlbnQucHJldmVudERlZmF1bHQoKSlcblxuZXhwb3J0IGZ1bmN0aW9uIHNldHVwKCkge1xuICBjcmVhdGVDYW52YXMoXG4gICAgTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKSxcbiAgICBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0LCB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgMClcbiAgKVxuXG4gIGVudGl0eS5FbnRpdHkuc2V0dXAoKVxuICBlbnRpdHkuRW50aXR5LnNjaGVtYSgyKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZHJhdygpIHtcbiAgYmFja2dyb3VuZCgyMClcblxuICBlbnRpdHkuRW50aXR5LmRyYXcoKVxuICBlbnRpdHkuRW50aXR5LnVwZGF0ZSgpXG59XG5cbi8vIHRvZG86IGFkZCBmcmFtZXJhdGUgbGltaXQgc2V0dGluZyAodXNpbmcgRGF0YS5ub3coKSlcbi8vIGZpeG1lOiBub3QgY2FsbGVkIG9uIHVwZGF0ZVxuLy8gZnVuY3Rpb24gdGljaygpIHtcbi8vICAgZW50aXR5LnJvb3RFbnRpdHkudXBkYXRlKClcbi8vXG4vLyAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKVxuLy8gfVxuXG5leHBvcnQgZnVuY3Rpb24ga2V5UHJlc3NlZCgpIHt9XG5leHBvcnQgZnVuY3Rpb24ga2V5UmVsZWFzZWQoKSB7fVxuZXhwb3J0IGZ1bmN0aW9uIG1vdXNlUHJlc3NlZCgpIHtcbiAgZW50aXR5LkVudGl0eS5tb3VzZVByZXNzZWQoKVxufVxuZXhwb3J0IGZ1bmN0aW9uIG1vdXNlUmVsZWFzZWQoKSB7XG4gIGVudGl0eS5FbnRpdHkubW91c2VSZWxlYXNlZCgpXG59XG5cbmV4cG9ydCBjb25zdCByb290ID0gZW50aXR5LkVudGl0eS5yb290XG5leHBvcnQgY29uc3QgRW50aXR5ID0gZW50aXR5LkVudGl0eVxuIiwgImV4cG9ydCB0eXBlIEVudGl0eUV2ZW50TmFtZSA9XG4gIHwgXCJzZXR1cFwiXG4gIHwgXCJkcmF3XCJcbiAgfCBcInVwZGF0ZVwiXG4gIHwgXCJ0ZWFyZG93blwiXG4gIHwgXCJtb3VzZVByZXNzZWRcIlxuICB8IFwibW91c2VSZWxlYXNlZFwiXG5cbmV4cG9ydCB0eXBlIEVudGl0eUxpc3RlbmVyPFRoaXMgZXh0ZW5kcyBFbnRpdHk+ID0gKFxuICB0aGlzOiBUaGlzLFxuICBpdDogVGhpc1xuKSA9PiB1bmtub3duXG5cbmV4cG9ydCBjbGFzcyBFbnRpdHkge1xuICAvKipcbiAgICogUm9vdCBlbnRpdHkgKGp1c3Qgb25lIHBlciBwcm9qZWN0KVxuICAgKi9cbiAgc3RhdGljIHJvb3QgPSBuZXcgRW50aXR5KClcblxuICBzdGF0aWMgc2NoZW1hKGluZGVudGF0aW9uID0gMikge1xuICAgIHJldHVybiBjb25zb2xlLmxvZyh0aGlzLnJvb3Quc2NoZW1hKGluZGVudGF0aW9uIDwgMSA/IDIgOiBpbmRlbnRhdGlvbikpXG4gIH1cblxuICBzdGF0aWMgc2V0dXAoKSB7XG4gICAgdGhpcy5yb290LnNldHVwKClcbiAgfVxuXG4gIHN0YXRpYyBkcmF3KCkge1xuICAgIHRoaXMucm9vdC5kcmF3KClcbiAgfVxuXG4gIHN0YXRpYyB1cGRhdGUoKSB7XG4gICAgdGhpcy5yb290LnVwZGF0ZSgpXG4gIH1cblxuICBzdGF0aWMgdGVhcmRvd24oKSB7XG4gICAgdGhpcy5yb290LnRlYXJkb3duKClcbiAgfVxuXG4gIHN0YXRpYyBtb3VzZVJlbGVhc2VkKCkge1xuICAgIHRoaXMucm9vdC5tb3VzZVJlbGVhc2VkKClcbiAgfVxuXG4gIHN0YXRpYyBtb3VzZVByZXNzZWQoKSB7XG4gICAgdGhpcy5yb290Lm1vdXNlUHJlc3NlZCgpXG4gIH1cblxuICBwcm90ZWN0ZWQgX2lzU2V0dXAgPSBmYWxzZVxuICBwcm90ZWN0ZWQgX2NoaWxkcmVuID0gbmV3IFNldDxFbnRpdHk+KClcbiAgcHJvdGVjdGVkIF96SW5kZXg/OiBudW1iZXJcbiAgcHJvdGVjdGVkIF9wYXJlbnQ/OiBFbnRpdHlcbiAgcHJvdGVjdGVkIF9saXN0ZW5lcnM6IEVudGl0eUxpc3RlbmVyPHRoaXM+W10gPSBbXVxuICBwcm90ZWN0ZWQgX3N0b3BQb2ludHM6IFJlY29yZDxFbnRpdHlFdmVudE5hbWUsIGJvb2xlYW4+ID0ge1xuICAgIHNldHVwOiBmYWxzZSxcbiAgICBkcmF3OiBmYWxzZSxcbiAgICB1cGRhdGU6IGZhbHNlLFxuICAgIHRlYXJkb3duOiBmYWxzZSxcbiAgICBtb3VzZVByZXNzZWQ6IGZhbHNlLFxuICAgIG1vdXNlUmVsZWFzZWQ6IGZhbHNlLFxuICB9XG5cbiAgZ2V0IGlzU2V0dXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lzU2V0dXBcbiAgfVxuXG4gIGdldCBjaGlsZHJlbigpOiBBcnJheTxFbnRpdHk+IHtcbiAgICByZXR1cm4gWy4uLnRoaXMuX2NoaWxkcmVuXVxuICB9XG5cbiAgZ2V0IHpJbmRleCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl96SW5kZXggPz8gdGhpcy5wYXJlbnQ/LmNoaWxkcmVuLmluZGV4T2YodGhpcykgPz8gMFxuICB9XG5cbiAgZ2V0IHBhcmVudCgpOiBFbnRpdHkgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnRcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXByZXNlbnQgYW55IHN0YXRlLWJhc2VkIGVudGl0eVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIGJlIG92ZXJ3cml0dGVuIGJ5IHlvdXIgb3duIHdvcmtpbmdzXG4gICAqL1xuICBvblNldHVwKCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25EcmF3KCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25VcGRhdGUoKSB7fVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIGJlIG92ZXJ3cml0dGVuIGJ5IHlvdXIgb3duIHdvcmtpbmdzXG4gICAqL1xuICBvblRlYXJkb3duKCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25Nb3VzZVJlbGVhc2VkKCkge31cblxuICAvKipcbiAgICogVXNlZCB0byBiZSBvdmVyd3JpdHRlbiBieSB5b3VyIG93biB3b3JraW5nc1xuICAgKi9cbiAgb25Nb3VzZVByZXNzZWQoKSB7fVxuXG4gIC8qKlxuICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cbiAgICogU2hvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiFcbiAgICovXG4gIHB1YmxpYyBzZXR1cCgpIHtcbiAgICBpZiAoIXRoaXMuaXNTZXR1cCkge1xuICAgICAgdGhpcy5vblNldHVwKClcbiAgICAgIHRoaXMudHJhbnNtaXQoXCJzZXR1cFwiKVxuICAgICAgdGhpcy5faXNTZXR1cCA9IHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRW50aXR5IGlzIGFscmVhZHkgc2V0dXBcIilcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjdXJyZW50IGVudGl0eSBpcyBhIHJvb3QuXG4gICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXG4gICAqL1xuICBwdWJsaWMgZHJhdygpIHtcbiAgICBpZiAodGhpcy5pc1NldHVwKSB7XG4gICAgICB0aGlzLm9uRHJhdygpXG4gICAgICB0aGlzLnRyYW5zbWl0KFwiZHJhd1wiKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJEcmF3IGlzIGNhbGxlZCBiZWZvcmUgc2V0dXBcIilcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjdXJyZW50IGVudGl0eSBpcyBhIHJvb3QuXG4gICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXG4gICAqL1xuICBwdWJsaWMgdXBkYXRlKCkge1xuICAgIGlmICh0aGlzLmlzU2V0dXApIHtcbiAgICAgIHRoaXMub25VcGRhdGUoKVxuICAgICAgdGhpcy50cmFuc21pdChcInVwZGF0ZVwiKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJ1cGRhdGUgaXMgY2FsbGVkIGJlZm9yZSBzZXR1cFwiKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cbiAgICogU2hvdWxkIG5vdCBiZSBvdmVyd3JpdHRlbiFcbiAgICovXG4gIHB1YmxpYyB0ZWFyZG93bigpIHtcbiAgICBpZiAodGhpcy5pc1NldHVwKSB7XG4gICAgICB0aGlzLl9pc1NldHVwID0gZmFsc2VcbiAgICAgIHRoaXMub25UZWFyZG93bigpXG4gICAgICB0aGlzLl9wYXJlbnQ/LnJlbW92ZUNoaWxkKHRoaXMpXG4gICAgICB0aGlzLnRyYW5zbWl0KFwidGVhcmRvd25cIilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRW50aXR5IG11c3QgYmUgc2V0dXAgYmVmb3JlXCIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKiBTaG91bGQgbm90IGJlIG92ZXJ3cml0dGVuIVxuICAgKi9cbiAgcHVibGljIG1vdXNlUmVsZWFzZWQoKSB7XG4gICAgaWYgKHRoaXMuaXNTZXR1cCkge1xuICAgICAgdGhpcy5vbk1vdXNlUmVsZWFzZWQoKVxuICAgICAgdGhpcy50cmFuc21pdChcIm1vdXNlUmVsZWFzZWRcIilcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKFwibW91c2VQcmVzc2VkIGlzIGNhbGxlZCBiZWZvcmUgc2V0dXBcIilcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBjdXJyZW50IGVudGl0eSBpcyBhIHJvb3QuXG4gICAqIFNob3VsZCBub3QgYmUgb3ZlcndyaXR0ZW4hXG4gICAqL1xuICBwdWJsaWMgbW91c2VQcmVzc2VkKCkge1xuICAgIGlmICh0aGlzLmlzU2V0dXApIHtcbiAgICAgIHRoaXMub25Nb3VzZVByZXNzZWQoKVxuICAgICAgdGhpcy50cmFuc21pdChcIm1vdXNlUHJlc3NlZFwiKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJtb3VzZVByZXNzZWQgaXMgY2FsbGVkIGJlZm9yZSBzZXR1cFwiKVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbihuYW1lOiBFbnRpdHlFdmVudE5hbWUsIGxpc3RlbmVyOiBFbnRpdHlMaXN0ZW5lcjx0aGlzPikge1xuICAgIHRoaXMuX2xpc3RlbmVycy5wdXNoKFxuICAgICAge1xuICAgICAgICBbbmFtZV0oKSB7XG4gICAgICAgICAgbGlzdGVuZXIuYmluZCh0aGlzKSh0aGlzKVxuICAgICAgICB9LFxuICAgICAgfVtuYW1lXS5iaW5kKHRoaXMpXG4gICAgKVxuICB9XG5cbiAgcHVibGljIGFkZENoaWxkKC4uLmNoaWxkcmVuOiBFbnRpdHlbXSkge1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgIGNoaWxkLl9wYXJlbnQgPSB0aGlzXG4gICAgICB0aGlzLl9jaGlsZHJlbi5hZGQoY2hpbGQpXG4gICAgICBpZiAodGhpcy5pc1NldHVwKSBjaGlsZC5zZXR1cCgpXG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlbW92ZUNoaWxkKC4uLmNoaWxkcmVuOiBFbnRpdHlbXSkge1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgIGlmIChjaGlsZC5pc1NldHVwKSBjaGlsZC50ZWFyZG93bigpXG4gICAgICBlbHNlIHRoaXMuX2NoaWxkcmVuLmRlbGV0ZShjaGlsZClcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc3RvcFRyYW5zbWlzc2lvbihuYW1lOiBFbnRpdHlFdmVudE5hbWUpIHtcbiAgICB0aGlzLl9zdG9wUG9pbnRzW25hbWVdID0gdHJ1ZVxuICB9XG5cbiAgcHJpdmF0ZSB0cmFuc21pdChuYW1lOiBFbnRpdHlFdmVudE5hbWUpIHtcbiAgICBmb3IgKGNvbnN0IGxpc3RlbmVyIG9mIHRoaXMuZ2V0TGlzdGVuZXJzQnlOYW1lKG5hbWUpKVxuICAgICAgbGlzdGVuZXIuYmluZCh0aGlzKSh0aGlzKVxuXG4gICAgbGV0IGNoaWxkcmVuID1cbiAgICAgIG5hbWUgPT09IFwibW91c2VSZWxlYXNlZFwiIHx8IG5hbWUgPT09IFwibW91c2VQcmVzc2VkXCJcbiAgICAgICAgPyB0aGlzLmNoaWxkcmVuLnNvcnQoKGEsIGIpID0+IGEuekluZGV4IC0gYi56SW5kZXgpXG4gICAgICAgIDogdGhpcy5jaGlsZHJlbi5zb3J0KChhLCBiKSA9PiBiLnpJbmRleCAtIGEuekluZGV4KVxuXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgICAgaWYgKHRoaXMuX3N0b3BQb2ludHNbbmFtZV0pIHtcbiAgICAgICAgdGhpcy5fc3RvcFBvaW50c1tuYW1lXSA9IGZhbHNlXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjaGlsZFtuYW1lXSgpXG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRMaXN0ZW5lcnNCeU5hbWUobmFtZTogRW50aXR5RXZlbnROYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xpc3RlbmVycy5maWx0ZXIoKGxpc3RlbmVyKSA9PiB7XG4gICAgICByZXR1cm4gbGlzdGVuZXIubmFtZSA9PT0gbmFtZVxuICAgIH0pXG4gIH1cblxuICBwdWJsaWMgc2NoZW1hKFxuICAgIGluZGVudGF0aW9uOiBudW1iZXIsXG4gICAgZGVwdGggPSAwLFxuICAgIGluZGV4OiBudW1iZXIgfCBudWxsID0gbnVsbFxuICApOiBzdHJpbmcge1xuICAgIHJldHVybiBgJHtcIiBcIi5yZXBlYXQoaW5kZW50YXRpb24pLnJlcGVhdChkZXB0aCl9JHtcbiAgICAgIGluZGV4ID09PSBudWxsID8gXCJcIiA6IGAke2luZGV4fSAtIGBcbiAgICB9JHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9IFske3RoaXMuaXNTZXR1cCA/IFwib25cIiA6IFwib2ZmXCJ9XSR7XG4gICAgICB0aGlzLl9jaGlsZHJlbi5zaXplID4gMFxuICAgICAgICA/IGA6XFxuJHt0aGlzLmNoaWxkcmVuXG4gICAgICAgICAgICAubWFwKFxuICAgICAgICAgICAgICAoY2hpbGQsIGluZGV4KSA9PiBgJHtjaGlsZC5zY2hlbWEoaW5kZW50YXRpb24sIGRlcHRoICsgMSwgaW5kZXgpfWBcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5qb2luKFwiXFxuXCIpfWBcbiAgICAgICAgOiBcIlwiXG4gICAgfWBcbiAgfVxufVxuIiwgImltcG9ydCAqIGFzIGVudGl0eSBmcm9tIFwiLi4vbGliL2VudGl0eVwiXG5cbmV4cG9ydCBjbGFzcyBIaXRCb3ggZXh0ZW5kcyBlbnRpdHkuRW50aXR5IHtcbiAgY29uc3RydWN0b3IocHVibGljIHggPSAwLCBwdWJsaWMgeSA9IDAsIHB1YmxpYyB3aWR0aCA9IDAsIHB1YmxpYyBoZWlnaHQgPSAwKSB7XG4gICAgc3VwZXIoKVxuICB9XG5cbiAgZ2V0IGNlbnRlcigpOiBbeDogbnVtYmVyLCB5OiBudW1iZXJdIHtcbiAgICByZXR1cm4gW3RoaXMueCArIHRoaXMud2lkdGggLyAyLCB0aGlzLnkgKyB0aGlzLmhlaWdodCAvIDJdXG4gIH1cblxuICBnZXQgaXNIb3ZlcmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICBtb3VzZVggPiB0aGlzLnggJiZcbiAgICAgIG1vdXNlWCA8IHRoaXMueCArIHRoaXMud2lkdGggJiZcbiAgICAgIG1vdXNlWSA+IHRoaXMueSAmJlxuICAgICAgbW91c2VZIDwgdGhpcy55ICsgdGhpcy5oZWlnaHRcbiAgICApXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEhpdEVsbGlwc2UgZXh0ZW5kcyBIaXRCb3gge1xuICBjb25zdHJ1Y3Rvcih4ID0gMCwgeSA9IDAsIHB1YmxpYyBkaWFtZXRlciA9IDApIHtcbiAgICBzdXBlcih4LCB5LCBkaWFtZXRlciwgZGlhbWV0ZXIpXG4gIH1cblxuICBnZXQgY2VudGVyKCk6IFt4OiBudW1iZXIsIHk6IG51bWJlcl0ge1xuICAgIHJldHVybiBbdGhpcy54LCB0aGlzLnldXG4gIH1cblxuICBnZXQgaXNIb3ZlcmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBkaXN0KG1vdXNlWCwgbW91c2VZLCB0aGlzLngsIHRoaXMueSkgPCB0aGlzLmRpYW1ldGVyIC8gMlxuICB9XG59XG4iLCAiaW1wb3J0ICogYXMgaGl0Ym94IGZyb20gXCIuL2hpdGJveFwiXG5cbmNvbnN0IEhJU1RPUllfTEVOR1RIID0gMTAwXG5cbmNsYXNzIEN1cnNvciBleHRlbmRzIGhpdGJveC5IaXRFbGxpcHNlIHtcbiAgcHVibGljIGhpc3Rvcnk6IFt4OiBudW1iZXIsIHk6IG51bWJlcl1bXSA9IFtdXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoMCwgMCwgMTUpXG4gICAgQ3Vyc29yLnJvb3QuYWRkQ2hpbGQodGhpcylcbiAgfVxuXG4gIG9uVXBkYXRlKCkge1xuICAgIHRoaXMuaGlzdG9yeS5wdXNoKFt0aGlzLngsIHRoaXMueV0pXG4gICAgdGhpcy54ID0gbW91c2VYXG4gICAgdGhpcy55ID0gbW91c2VZXG4gICAgd2hpbGUgKHRoaXMuaGlzdG9yeS5sZW5ndGggPiBISVNUT1JZX0xFTkdUSCkgdGhpcy5oaXN0b3J5LnNoaWZ0KClcbiAgfVxuXG4gIG9uRHJhdygpIHtcbiAgICBsZXQgbGFzdCA9IHRoaXMuaGlzdG9yeVswXVxuICAgIGZvciAoY29uc3QgcG9zIG9mIHRoaXMuaGlzdG9yeSkge1xuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmhpc3RvcnkuaW5kZXhPZihwb3MpXG4gICAgICBzdHJva2UoZmxvb3IobWFwKGluZGV4LCB0aGlzLmhpc3RvcnkubGVuZ3RoLCAwLCAyNTUsIDApKSlcbiAgICAgIHN0cm9rZVdlaWdodChcbiAgICAgICAgZmxvb3IobWFwKGluZGV4LCB0aGlzLmhpc3RvcnkubGVuZ3RoLCAwLCB0aGlzLmRpYW1ldGVyIC8gMiwgMCkpXG4gICAgICApXG4gICAgICBsaW5lKC4uLmxhc3QsIC4uLnBvcylcbiAgICAgIGxhc3QgPSBwb3NcbiAgICB9XG4gICAgZmlsbCgyNTUpXG4gICAgbm9TdHJva2UoKVxuICAgIGNpcmNsZShtb3VzZVgsIG1vdXNlWSwgdGhpcy5kaWFtZXRlcilcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgY3Vyc29yID0gbmV3IEN1cnNvcigpXG4iLCAiZXhwb3J0IGNvbnN0IGNvbnRleHQgPSB7XG4gIHNjb3JlOiAwLFxufVxuIiwgImltcG9ydCAqIGFzIHA1IGZyb20gXCJwNVwiXG5pbXBvcnQgKiBhcyBoaXRib3ggZnJvbSBcIi4vaGl0Ym94XCJcbmltcG9ydCAqIGFzIGdhbWUgZnJvbSBcIi4vZ2FtZVwiXG5cbmV4cG9ydCBjbGFzcyBCYWxsb29uIGV4dGVuZHMgaGl0Ym94LkhpdEVsbGlwc2Uge1xuICBwdWJsaWMgY29sb3I6IHA1LkNvbG9yXG5cbiAgb25TZXR1cCgpIHtcbiAgICB0aGlzLmNvbG9yID0gY29sb3IocmFuZG9tKDEwMCwgMjAwKSwgcmFuZG9tKDEwMCwgMjAwKSwgcmFuZG9tKDEwMCwgMjAwKSlcbiAgICB0aGlzLnggPSByYW5kb20oMCwgd2lkdGgpXG4gICAgdGhpcy55ID0gcmFuZG9tKDAsIGhlaWdodClcbiAgICB0aGlzLmRpYW1ldGVyID0gcmFuZG9tKDQwLCA2MClcbiAgfVxuXG4gIG9uRHJhdygpIHtcbiAgICBpZiAodGhpcy5pc0hvdmVyZWQpIHtcbiAgICAgIHN0cm9rZSgyNTUpXG4gICAgfSBlbHNlIHtcbiAgICAgIG5vU3Ryb2tlKClcbiAgICB9XG4gICAgZmlsbCh0aGlzLmNvbG9yKVxuICAgIGNpcmNsZSguLi50aGlzLmNlbnRlciwgdGhpcy5kaWFtZXRlcilcbiAgfVxuXG4gIG9uVGVhcmRvd24oKSB7XG4gICAgZ2FtZS5jb250ZXh0LnNjb3JlKytcbiAgICBpZiAodGhpcy5wYXJlbnQuY2hpbGRyZW4ubGVuZ3RoID4gMilcbiAgICAgIHRoaXMucGFyZW50LnN0b3BUcmFuc21pc3Npb24oXCJtb3VzZVJlbGVhc2VkXCIpXG4gIH1cblxuICBvbk1vdXNlUmVsZWFzZWQoKSB7XG4gICAgaWYgKHRoaXMuaXNIb3ZlcmVkKSB7XG4gICAgICB0aGlzLnBhcmVudC5hZGRDaGlsZChuZXcgQmFsbG9vbigpKVxuICAgICAgdGhpcy50ZWFyZG93bigpXG4gICAgfVxuICB9XG59XG4iLCAiaW1wb3J0ICogYXMgZW50aXR5IGZyb20gXCIuLi9saWIvZW50aXR5XCJcbmltcG9ydCAqIGFzIGJhbGxvb24gZnJvbSBcIi4vYmFsbG9vblwiXG5cbmV4cG9ydCBjbGFzcyBCYWxsb29ucyBleHRlbmRzIGVudGl0eS5FbnRpdHkge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvdW50OiBudW1iZXIpIHtcbiAgICBzdXBlcigpXG4gICAgQmFsbG9vbnMucm9vdC5hZGRDaGlsZCh0aGlzKVxuICB9XG5cbiAgb25TZXR1cCgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY291bnQ7IGkrKykge1xuICAgICAgdGhpcy5hZGRDaGlsZChuZXcgYmFsbG9vbi5CYWxsb29uKCkpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBiYWxsb29ucyA9IG5ldyBCYWxsb29ucygxKVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7OztBQ2FPLHNCQUFhO0FBQUEsSUFtRWxCLGNBQWM7QUFqQ0osc0JBQVc7QUFDWCx1QkFBWSxJQUFJO0FBR2hCLHdCQUFxQztBQUNyQyx5QkFBZ0Q7QUFBQSxRQUN4RCxPQUFPO0FBQUEsUUFDUCxNQUFNO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixVQUFVO0FBQUEsUUFDVixjQUFjO0FBQUEsUUFDZCxlQUFlO0FBQUE7QUFBQTtBQUFBLFdBdkNWLE9BQU8sY0FBYyxHQUFHO0FBQzdCLGFBQU8sUUFBUSxJQUFJLEtBQUssS0FBSyxPQUFPLGNBQWMsSUFBSSxJQUFJO0FBQUE7QUFBQSxXQUdyRCxRQUFRO0FBQ2IsV0FBSyxLQUFLO0FBQUE7QUFBQSxXQUdMLE9BQU87QUFDWixXQUFLLEtBQUs7QUFBQTtBQUFBLFdBR0wsU0FBUztBQUNkLFdBQUssS0FBSztBQUFBO0FBQUEsV0FHTCxXQUFXO0FBQ2hCLFdBQUssS0FBSztBQUFBO0FBQUEsV0FHTCxnQkFBZ0I7QUFDckIsV0FBSyxLQUFLO0FBQUE7QUFBQSxXQUdMLGVBQWU7QUFDcEIsV0FBSyxLQUFLO0FBQUE7QUFBQSxRQWlCUixVQUFVO0FBQ1osYUFBTyxLQUFLO0FBQUE7QUFBQSxRQUdWLFdBQTBCO0FB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
