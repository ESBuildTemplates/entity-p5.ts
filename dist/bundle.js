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
    setup: () => setup
  });

  // src/entity.ts
  var _Entity = class {
    constructor(isRoot = false) {
      this.isRoot = isRoot;
      this._isSetup = false;
      this.zIndex = 0;
      this.children = new Set();
      this.listeners = [];
      if (!isRoot)
        _Entity.root.addChild(this);
    }
    get isSetup() {
      return this._isSetup;
    }
    setup() {
    }
    draw() {
    }
    update() {
    }
    teardown() {
    }
    mouseReleased() {
    }
    mousePressed() {
    }
    _setup() {
      if (!this.isSetup) {
        this.setup();
        this.transmit("setup");
        this._isSetup = true;
      } else {
        throw new Error("Entity is already setup");
      }
    }
    _draw() {
      if (this.isSetup) {
        this.draw();
        this.transmit("draw");
      } else {
        console.warn("Draw is called before setup");
      }
    }
    _update() {
      if (this.isSetup) {
        this.update();
        this.transmit("update");
      } else {
        console.warn("update is called before setup");
      }
    }
    _teardown() {
      if (this.isSetup) {
        this.teardown();
        if (this.parent)
          this.parent.children.delete(this);
        this.transmit("teardown");
        this._isSetup = false;
      } else {
        throw new Error("Entity must be setup before");
      }
    }
    _mouseReleased() {
      if (this.isSetup) {
        this.mouseReleased();
        this.transmit("mouseReleased");
      } else {
        console.warn("mousePressed is called before setup");
      }
    }
    _mousePressed() {
      if (this.isSetup) {
        this.mousePressed();
        this.transmit("mousePressed");
      } else {
        console.warn("mousePressed is called before setup");
      }
    }
    on(name, listener) {
      this.listeners.push({
        [name]() {
          listener.bind(this)(this);
        }
      }[name].bind(this));
    }
    addChild(...children) {
      for (const child of children) {
        child.parent = this;
        this.children.add(child);
        if (this.isSetup)
          child._setup();
      }
    }
    transmit(name) {
      for (const listener of this.getListenersByName(name))
        listener.bind(this)(this);
      for (const child of [...this.children].sort((a, b) => a.zIndex - b.zIndex))
        child[`_${name}`]();
    }
    getListenersByName(name) {
      return this.listeners.filter((listener) => {
        return listener.name === name;
      });
    }
  };
  var Entity = _Entity;
  Entity.root = new _Entity(true);

  // src/hitbox.ts
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

  // src/cursor.ts
  var HISTORY_LENGTH = 100;
  var Cursor = class extends HitEllipse {
    constructor() {
      super(0, 0, 15);
      this.history = [];
    }
    update() {
      this.history.push([this.x, this.y]);
      this.x = mouseX;
      this.y = mouseY;
      while (this.history.length > HISTORY_LENGTH)
        this.history.shift();
    }
    draw() {
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

  // src/game.ts
  var context = {
    score: 0
  };

  // src/balloon.ts
  var BALLOON_COUNT = 5;
  var Balloon = class extends HitEllipse {
    setup() {
      this.color = color(random(100, 200), random(100, 200), random(100, 200));
      this.x = random(0, width);
      this.y = random(0, height);
      this.diameter = random(40, 60);
    }
    draw() {
      if (this.isHovered) {
        stroke(255);
      } else {
        noStroke();
      }
      fill(this.color);
      circle(...this.center, this.diameter);
    }
    teardown() {
      balloons.delete(this);
    }
    mousePressed() {
      if (this.isHovered) {
        this.teardown();
        const newBalloon = new Balloon();
        balloons.add(newBalloon);
        context.score++;
      }
    }
  };
  var balloons = new Set();
  for (let i = 0; i < BALLOON_COUNT; i++) {
    balloons.add(new Balloon());
  }

  // src/index.ts
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  function setup() {
    createCanvas(Math.max(document.documentElement.clientWidth, window.innerWidth || 0), Math.max(document.documentElement.clientHeight, window.innerHeight || 0));
    Entity.root._setup();
  }
  function draw() {
    background(20);
    Entity.root._draw();
    Entity.root._update();
  }
  function keyPressed() {
  }
  function keyReleased() {
  }
  function mousePressed() {
    Entity.root._mousePressed();
  }
  function mouseReleased() {
    Entity.root._mouseReleased();
  }
  return src_exports;
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2luZGV4LnRzIiwgInNyYy9lbnRpdHkudHMiLCAic3JjL2hpdGJveC50cyIsICJzcmMvY3Vyc29yLnRzIiwgInNyYy9nYW1lLnRzIiwgInNyYy9iYWxsb29uLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLy8gQHRzLWNoZWNrXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL0B0eXBlcy9wNS9nbG9iYWwuZC50c1wiIC8+XG5cbmltcG9ydCAqIGFzIGVudGl0eSBmcm9tIFwiLi9lbnRpdHlcIlxuXG5pbXBvcnQgXCIuL2N1cnNvclwiXG5pbXBvcnQgXCIuL2JhbGxvb25cIlxuXG4vL2NvbnN0IFNLSVBQRURfRlJBTUVTID0gMlxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgKGV2ZW50KSA9PiBldmVudC5wcmV2ZW50RGVmYXVsdCgpKVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0dXAoKSB7XG4gIGNyZWF0ZUNhbnZhcyhcbiAgICBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsIHdpbmRvdy5pbm5lcldpZHRoIHx8IDApLFxuICAgIE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKVxuICApXG5cbiAgZW50aXR5LkVudGl0eS5yb290Ll9zZXR1cCgpXG59XG5cbi8vbGV0IGZyYW1lSW5kZXggPSAwXG5cbmV4cG9ydCBmdW5jdGlvbiBkcmF3KCkge1xuICAvL2ZyYW1lSW5kZXgrK1xuXG4gIGJhY2tncm91bmQoMjApXG5cbiAgZW50aXR5LkVudGl0eS5yb290Ll9kcmF3KClcbiAgZW50aXR5LkVudGl0eS5yb290Ll91cGRhdGUoKVxuICAvL2lmIChTS0lQUEVEX0ZSQU1FUyAlIGZyYW1lSW5kZXgpIGVudGl0eS5yb290RW50aXR5LnVwZGF0ZSgpXG59XG5cbi8vIHRvZG86IGFkZCBmcmFtZXJhdGUgbGltaXQgc2V0dGluZyAodXNpbmcgRGF0YS5ub3coKSlcbi8vIGZpeG1lOiBub3QgY2FsbGVkIG9uIHVwZGF0ZVxuLy8gZnVuY3Rpb24gdGljaygpIHtcbi8vICAgZW50aXR5LnJvb3RFbnRpdHkudXBkYXRlKClcbi8vXG4vLyAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKVxuLy8gfVxuXG5leHBvcnQgZnVuY3Rpb24ga2V5UHJlc3NlZCgpIHt9XG5leHBvcnQgZnVuY3Rpb24ga2V5UmVsZWFzZWQoKSB7fVxuZXhwb3J0IGZ1bmN0aW9uIG1vdXNlUHJlc3NlZCgpIHtcbiAgZW50aXR5LkVudGl0eS5yb290Ll9tb3VzZVByZXNzZWQoKVxufVxuZXhwb3J0IGZ1bmN0aW9uIG1vdXNlUmVsZWFzZWQoKSB7XG4gIGVudGl0eS5FbnRpdHkucm9vdC5fbW91c2VSZWxlYXNlZCgpXG59XG4iLCAiZXhwb3J0IHR5cGUgRW50aXR5RXZlbnROYW1lcyA9XG4gIHwgXCJzZXR1cFwiXG4gIHwgXCJkcmF3XCJcbiAgfCBcInVwZGF0ZVwiXG4gIHwgXCJ0ZWFyZG93blwiXG4gIHwgXCJtb3VzZVByZXNzZWRcIlxuICB8IFwibW91c2VSZWxlYXNlZFwiXG5cbmV4cG9ydCB0eXBlIEVudGl0eUxpc3RlbmVyPFRoaXMgZXh0ZW5kcyBFbnRpdHk+ID0gKFxuICB0aGlzOiBUaGlzLFxuICBpdDogVGhpc1xuKSA9PiB1bmtub3duXG5cbmV4cG9ydCBjbGFzcyBFbnRpdHkge1xuICBzdGF0aWMgcm9vdCA9IG5ldyBFbnRpdHkodHJ1ZSlcblxuICBwcm90ZWN0ZWQgX2lzU2V0dXAgPSBmYWxzZVxuICBwcm90ZWN0ZWQgekluZGV4ID0gMFxuICBwcm90ZWN0ZWQgcGFyZW50PzogRW50aXR5XG4gIHByb3RlY3RlZCBjaGlsZHJlbiA9IG5ldyBTZXQ8RW50aXR5PigpXG4gIHByb3RlY3RlZCBsaXN0ZW5lcnM6IEVudGl0eUxpc3RlbmVyPHRoaXM+W10gPSBbXVxuXG4gIGdldCBpc1NldHVwKCkge1xuICAgIHJldHVybiB0aGlzLl9pc1NldHVwXG4gIH1cblxuICAvKipcbiAgICogUmVwcmVzZW50IGFueSBzdGF0ZS1iYXNlZCBlbnRpdHlcbiAgICogQHBhcmFtIGlzUm9vdCBEZWZpbmUgdGhlIGVudGl0eSBhcyByb290IGVudGl0eSAob25seSAxIHJvb3QgZW50aXR5IGJ5IHByb2plY3QpXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgaXNSb290ID0gZmFsc2UpIHtcbiAgICBpZiAoIWlzUm9vdCkgRW50aXR5LnJvb3QuYWRkQ2hpbGQodGhpcylcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIGJlIG92ZXJ3cml0dGVuIGJ5IHlvdXIgb3duIHdvcmtpbmdzXG4gICAqL1xuICBzZXR1cCgpIHt9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcbiAgICovXG4gIGRyYXcoKSB7fVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIGJlIG92ZXJ3cml0dGVuIGJ5IHlvdXIgb3duIHdvcmtpbmdzXG4gICAqL1xuICB1cGRhdGUoKSB7fVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIGJlIG92ZXJ3cml0dGVuIGJ5IHlvdXIgb3duIHdvcmtpbmdzXG4gICAqL1xuICB0ZWFyZG93bigpIHt9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gYmUgb3ZlcndyaXR0ZW4gYnkgeW91ciBvd24gd29ya2luZ3NcbiAgICovXG4gIG1vdXNlUmVsZWFzZWQoKSB7fVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIGJlIG92ZXJ3cml0dGVuIGJ5IHlvdXIgb3duIHdvcmtpbmdzXG4gICAqL1xuICBtb3VzZVByZXNzZWQoKSB7fVxuXG4gIC8qKlxuICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cbiAgICovXG4gIHB1YmxpYyBfc2V0dXAoKSB7XG4gICAgaWYgKCF0aGlzLmlzU2V0dXApIHtcbiAgICAgIHRoaXMuc2V0dXAoKVxuICAgICAgdGhpcy50cmFuc21pdChcInNldHVwXCIpXG4gICAgICB0aGlzLl9pc1NldHVwID0gdHJ1ZVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbnRpdHkgaXMgYWxyZWFkeSBzZXR1cFwiKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cbiAgICovXG4gIHB1YmxpYyBfZHJhdygpIHtcbiAgICBpZiAodGhpcy5pc1NldHVwKSB7XG4gICAgICB0aGlzLmRyYXcoKVxuICAgICAgdGhpcy50cmFuc21pdChcImRyYXdcIilcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKFwiRHJhdyBpcyBjYWxsZWQgYmVmb3JlIHNldHVwXCIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKi9cbiAgcHVibGljIF91cGRhdGUoKSB7XG4gICAgaWYgKHRoaXMuaXNTZXR1cCkge1xuICAgICAgdGhpcy51cGRhdGUoKVxuICAgICAgdGhpcy50cmFuc21pdChcInVwZGF0ZVwiKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJ1cGRhdGUgaXMgY2FsbGVkIGJlZm9yZSBzZXR1cFwiKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cbiAgICovXG4gIHB1YmxpYyBfdGVhcmRvd24oKSB7XG4gICAgaWYgKHRoaXMuaXNTZXR1cCkge1xuICAgICAgdGhpcy50ZWFyZG93bigpXG4gICAgICBpZiAodGhpcy5wYXJlbnQpIHRoaXMucGFyZW50LmNoaWxkcmVuLmRlbGV0ZSh0aGlzKVxuICAgICAgdGhpcy50cmFuc21pdChcInRlYXJkb3duXCIpXG4gICAgICB0aGlzLl9pc1NldHVwID0gZmFsc2VcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRW50aXR5IG11c3QgYmUgc2V0dXAgYmVmb3JlXCIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgY3VycmVudCBlbnRpdHkgaXMgYSByb290LlxuICAgKi9cbiAgcHVibGljIF9tb3VzZVJlbGVhc2VkKCkge1xuICAgIGlmICh0aGlzLmlzU2V0dXApIHtcbiAgICAgIHRoaXMubW91c2VSZWxlYXNlZCgpXG4gICAgICB0aGlzLnRyYW5zbWl0KFwibW91c2VSZWxlYXNlZFwiKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJtb3VzZVByZXNzZWQgaXMgY2FsbGVkIGJlZm9yZSBzZXR1cFwiKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTaG91bGQgb25seSBiZSBjYWxsZWQgaWYgdGhlIGN1cnJlbnQgZW50aXR5IGlzIGEgcm9vdC5cbiAgICovXG4gIHB1YmxpYyBfbW91c2VQcmVzc2VkKCkge1xuICAgIGlmICh0aGlzLmlzU2V0dXApIHtcbiAgICAgIHRoaXMubW91c2VQcmVzc2VkKClcbiAgICAgIHRoaXMudHJhbnNtaXQoXCJtb3VzZVByZXNzZWRcIilcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKFwibW91c2VQcmVzc2VkIGlzIGNhbGxlZCBiZWZvcmUgc2V0dXBcIilcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb24obmFtZTogRW50aXR5RXZlbnROYW1lcywgbGlzdGVuZXI6IEVudGl0eUxpc3RlbmVyPHRoaXM+KSB7XG4gICAgdGhpcy5saXN0ZW5lcnMucHVzaChcbiAgICAgIHtcbiAgICAgICAgW25hbWVdKCkge1xuICAgICAgICAgIGxpc3RlbmVyLmJpbmQodGhpcykodGhpcylcbiAgICAgICAgfSxcbiAgICAgIH1bbmFtZV0uYmluZCh0aGlzKVxuICAgIClcbiAgfVxuXG4gIHB1YmxpYyBhZGRDaGlsZCguLi5jaGlsZHJlbjogRW50aXR5W10pIHtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzXG4gICAgICB0aGlzLmNoaWxkcmVuLmFkZChjaGlsZClcbiAgICAgIGlmICh0aGlzLmlzU2V0dXApIGNoaWxkLl9zZXR1cCgpXG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB0cmFuc21pdChuYW1lOiBFbnRpdHlFdmVudE5hbWVzKSB7XG4gICAgZm9yIChjb25zdCBsaXN0ZW5lciBvZiB0aGlzLmdldExpc3RlbmVyc0J5TmFtZShuYW1lKSlcbiAgICAgIGxpc3RlbmVyLmJpbmQodGhpcykodGhpcylcblxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgWy4uLnRoaXMuY2hpbGRyZW5dLnNvcnQoKGEsIGIpID0+IGEuekluZGV4IC0gYi56SW5kZXgpKVxuICAgICAgY2hpbGRbYF8ke25hbWV9YF0oKVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRMaXN0ZW5lcnNCeU5hbWUobmFtZTogRW50aXR5RXZlbnROYW1lcykge1xuICAgIHJldHVybiB0aGlzLmxpc3RlbmVycy5maWx0ZXIoKGxpc3RlbmVyKSA9PiB7XG4gICAgICByZXR1cm4gbGlzdGVuZXIubmFtZSA9PT0gbmFtZVxuICAgIH0pXG4gIH1cbn1cbiIsICJpbXBvcnQgKiBhcyBlbnRpdHkgZnJvbSBcIi4vZW50aXR5XCJcblxuZXhwb3J0IGNsYXNzIEhpdEJveCBleHRlbmRzIGVudGl0eS5FbnRpdHkge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgeCA9IDAsIHB1YmxpYyB5ID0gMCwgcHVibGljIHdpZHRoID0gMCwgcHVibGljIGhlaWdodCA9IDApIHtcbiAgICBzdXBlcigpXG4gIH1cblxuICBnZXQgY2VudGVyKCk6IFt4OiBudW1iZXIsIHk6IG51bWJlcl0ge1xuICAgIHJldHVybiBbdGhpcy54ICsgdGhpcy53aWR0aCAvIDIsIHRoaXMueSArIHRoaXMuaGVpZ2h0IC8gMl1cbiAgfVxuXG4gIGdldCBpc0hvdmVyZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChcbiAgICAgIG1vdXNlWCA+IHRoaXMueCAmJlxuICAgICAgbW91c2VYIDwgdGhpcy54ICsgdGhpcy53aWR0aCAmJlxuICAgICAgbW91c2VZID4gdGhpcy55ICYmXG4gICAgICBtb3VzZVkgPCB0aGlzLnkgKyB0aGlzLmhlaWdodFxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSGl0RWxsaXBzZSBleHRlbmRzIEhpdEJveCB7XG4gIGNvbnN0cnVjdG9yKHggPSAwLCB5ID0gMCwgcHVibGljIGRpYW1ldGVyID0gMCkge1xuICAgIHN1cGVyKHgsIHksIGRpYW1ldGVyLCBkaWFtZXRlcilcbiAgfVxuXG4gIGdldCBjZW50ZXIoKTogW3g6IG51bWJlciwgeTogbnVtYmVyXSB7XG4gICAgcmV0dXJuIFt0aGlzLngsIHRoaXMueV1cbiAgfVxuXG4gIGdldCBpc0hvdmVyZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGRpc3QobW91c2VYLCBtb3VzZVksIHRoaXMueCwgdGhpcy55KSA8IHRoaXMuZGlhbWV0ZXIgLyAyXG4gIH1cbn1cbiIsICJpbXBvcnQgKiBhcyBoaXRib3ggZnJvbSBcIi4vaGl0Ym94XCJcblxuY29uc3QgSElTVE9SWV9MRU5HVEggPSAxMDBcblxuY2xhc3MgQ3Vyc29yIGV4dGVuZHMgaGl0Ym94LkhpdEVsbGlwc2Uge1xuICBwdWJsaWMgaGlzdG9yeTogW3g6IG51bWJlciwgeTogbnVtYmVyXVtdID0gW11cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigwLCAwLCAxNSlcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLmhpc3RvcnkucHVzaChbdGhpcy54LCB0aGlzLnldKVxuICAgIHRoaXMueCA9IG1vdXNlWFxuICAgIHRoaXMueSA9IG1vdXNlWVxuICAgIHdoaWxlICh0aGlzLmhpc3RvcnkubGVuZ3RoID4gSElTVE9SWV9MRU5HVEgpIHRoaXMuaGlzdG9yeS5zaGlmdCgpXG4gIH1cblxuICBkcmF3KCkge1xuICAgIGxldCBsYXN0ID0gdGhpcy5oaXN0b3J5WzBdXG4gICAgZm9yIChjb25zdCBwb3Mgb2YgdGhpcy5oaXN0b3J5KSB7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuaGlzdG9yeS5pbmRleE9mKHBvcylcbiAgICAgIHN0cm9rZShmbG9vcihtYXAoaW5kZXgsIHRoaXMuaGlzdG9yeS5sZW5ndGgsIDAsIDI1NSwgMCkpKVxuICAgICAgc3Ryb2tlV2VpZ2h0KFxuICAgICAgICBmbG9vcihtYXAoaW5kZXgsIHRoaXMuaGlzdG9yeS5sZW5ndGgsIDAsIHRoaXMuZGlhbWV0ZXIgLyAyLCAwKSlcbiAgICAgIClcbiAgICAgIGxpbmUoLi4ubGFzdCwgLi4ucG9zKVxuICAgICAgbGFzdCA9IHBvc1xuICAgIH1cbiAgICBmaWxsKDI1NSlcbiAgICBub1N0cm9rZSgpXG4gICAgY2lyY2xlKG1vdXNlWCwgbW91c2VZLCB0aGlzLmRpYW1ldGVyKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBjdXJzb3IgPSBuZXcgQ3Vyc29yKClcbiIsICJleHBvcnQgY29uc3QgY29udGV4dCA9IHtcbiAgc2NvcmU6IDAsXG59XG4iLCAiaW1wb3J0ICogYXMgcDUgZnJvbSBcInA1XCJcbmltcG9ydCAqIGFzIGhpdGJveCBmcm9tIFwiLi9oaXRib3hcIlxuaW1wb3J0ICogYXMgZ2FtZSBmcm9tIFwiLi9nYW1lXCJcblxuY29uc3QgQkFMTE9PTl9DT1VOVCA9IDVcblxuZXhwb3J0IGNsYXNzIEJhbGxvb24gZXh0ZW5kcyBoaXRib3guSGl0RWxsaXBzZSB7XG4gIHB1YmxpYyBjb2xvcjogcDUuQ29sb3JcblxuICBzZXR1cCgpIHtcbiAgICB0aGlzLmNvbG9yID0gY29sb3IocmFuZG9tKDEwMCwgMjAwKSwgcmFuZG9tKDEwMCwgMjAwKSwgcmFuZG9tKDEwMCwgMjAwKSlcbiAgICB0aGlzLnggPSByYW5kb20oMCwgd2lkdGgpXG4gICAgdGhpcy55ID0gcmFuZG9tKDAsIGhlaWdodClcbiAgICB0aGlzLmRpYW1ldGVyID0gcmFuZG9tKDQwLCA2MClcbiAgfVxuXG4gIGRyYXcoKSB7XG4gICAgaWYgKHRoaXMuaXNIb3ZlcmVkKSB7XG4gICAgICBzdHJva2UoMjU1KVxuICAgIH0gZWxzZSB7XG4gICAgICBub1N0cm9rZSgpXG4gICAgfVxuICAgIGZpbGwodGhpcy5jb2xvcilcbiAgICBjaXJjbGUoLi4udGhpcy5jZW50ZXIsIHRoaXMuZGlhbWV0ZXIpXG4gIH1cblxuICB0ZWFyZG93bigpIHtcbiAgICBiYWxsb29ucy5kZWxldGUodGhpcylcbiAgfVxuXG4gIG1vdXNlUHJlc3NlZCgpIHtcbiAgICBpZiAodGhpcy5pc0hvdmVyZWQpIHtcbiAgICAgIHRoaXMudGVhcmRvd24oKVxuICAgICAgY29uc3QgbmV3QmFsbG9vbiA9IG5ldyBCYWxsb29uKClcbiAgICAgIGJhbGxvb25zLmFkZChuZXdCYWxsb29uKVxuICAgICAgZ2FtZS5jb250ZXh0LnNjb3JlKytcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGJhbGxvb25zID0gbmV3IFNldDxCYWxsb29uPigpXG5cbmZvciAobGV0IGkgPSAwOyBpIDwgQkFMTE9PTl9DT1VOVDsgaSsrKSB7XG4gIGJhbGxvb25zLmFkZChuZXcgQmFsbG9vbigpKVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7O0FDYU8sc0JBQWE7QUFBQSxJQWlCbEIsWUFBNEIsU0FBUyxPQUFPO0FBQWhCO0FBZGxCLHNCQUFXO0FBQ1gsb0JBQVM7QUFFVCxzQkFBVyxJQUFJO0FBQ2YsdUJBQW9DO0FBVzVDLFVBQUksQ0FBQztBQUFRLGdCQUFPLEtBQUssU0FBUztBQUFBO0FBQUEsUUFUaEMsVUFBVTtBQUNaLGFBQU8sS0FBSztBQUFBO0FBQUEsSUFjZCxRQUFRO0FBQUE7QUFBQSxJQUtSLE9BQU87QUFBQTtBQUFBLElBS1AsU0FBUztBQUFBO0FBQUEsSUFLVCxXQUFXO0FB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
