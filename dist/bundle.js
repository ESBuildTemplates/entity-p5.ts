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
    setup: () => setup
  });

  // src/entity.ts
  var Entity = class {
    constructor(data) {
      this.data = data;
      this.listeners = [];
    }
    setup() {
      for (const listener of this.getListenersByName("setup")) {
        listener.callback(this.data);
      }
    }
    draw() {
      for (const listener of this.getListenersByName("draw")) {
        listener.callback(this.data);
      }
    }
    update() {
      for (const listener of this.getListenersByName("update")) {
        listener.callback(this.data);
      }
    }
    teardown() {
      for (const listener of this.getListenersByName("teardown")) {
        listener.callback(this.data);
      }
    }
    on(listener) {
      this.listeners.push(listener);
    }
    addChild(...children) {
      this.children.push(...children.map((child) => {
        child.parent = this;
        return child;
      }));
    }
    getListenersByName(name) {
      return this.listeners.filter((listener) => {
        return listener.name === name;
      });
    }
  };
  var rootEntity = new Entity(void 0);

  // src/index.ts
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  function setup() {
    createCanvas(Math.max(document.documentElement.clientWidth, window.innerWidth || 0), Math.max(document.documentElement.clientHeight, window.innerHeight || 0));
    rootEntity.addChild(new Entity([]));
    rootEntity.setup();
  }
  function draw() {
    background(20);
    textAlign(CENTER, CENTER);
    textSize(height / 10);
    fill(200);
    rootEntity.draw();
  }
  function keyPressed() {
  }
  function keyReleased() {
  }
  return src_exports;
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2luZGV4LnRzIiwgInNyYy9lbnRpdHkudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vLyBAdHMtY2hlY2tcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvQHR5cGVzL3A1L2dsb2JhbC5kLnRzXCIgLz5cblxuaW1wb3J0ICogYXMgZW50aXR5IGZyb20gXCIuL2VudGl0eVwiXG5pbXBvcnQgKiBhcyB2ZWN0b3IgZnJvbSBcIi4vdmVjdG9yXCJcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIChldmVudCkgPT4gZXZlbnQucHJldmVudERlZmF1bHQoKSlcblxuZXhwb3J0IGZ1bmN0aW9uIHNldHVwKCkge1xuICBjcmVhdGVDYW52YXMoXG4gICAgTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKSxcbiAgICBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0LCB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgMClcbiAgKVxuXG4gIGVudGl0eS5yb290RW50aXR5LmFkZENoaWxkKFxuICAgIG5ldyBlbnRpdHkuRW50aXR5PHZlY3Rvci5WZWN0b3JbXT4oW10pXG4gIClcbiAgZW50aXR5LnJvb3RFbnRpdHkuc2V0dXAoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZHJhdygpIHtcbiAgYmFja2dyb3VuZCgyMClcbiAgdGV4dEFsaWduKENFTlRFUiwgQ0VOVEVSKVxuICB0ZXh0U2l6ZShoZWlnaHQgLyAxMClcbiAgZmlsbCgyMDApXG5cbiAgZW50aXR5LnJvb3RFbnRpdHkuZHJhdygpXG59XG5cbi8vIHRvZG86IGFkZCBmcmFtZXJhdGUgbGltaXQgc2V0dGluZyAodXNpbmcgRGF0YS5ub3coKSlcbmZ1bmN0aW9uIHRpY2soKSB7XG4gIGVudGl0eS5yb290RW50aXR5LnVwZGF0ZSgpXG5cbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpY2spXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBrZXlQcmVzc2VkKCkge31cbmV4cG9ydCBmdW5jdGlvbiBrZXlSZWxlYXNlZCgpIHt9XG4iLCAiZXhwb3J0IHR5cGUgRW50aXR5RXZlbnROYW1lPERhdGEgZXh0ZW5kcyBhbnk+ID0ga2V5b2YgRW50aXR5RXZlbnRzPERhdGE+XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5TGlzdGVuZXI8XG4gIERhdGEgZXh0ZW5kcyBhbnksXG4gIE5hbWUgZXh0ZW5kcyBFbnRpdHlFdmVudE5hbWU8RGF0YT5cbj4ge1xuICBuYW1lOiBOYW1lXG4gIGNhbGxiYWNrOiBFbnRpdHlMaXN0ZW5lckNhbGxiYWNrPERhdGEsIE5hbWU+XG59XG5cbmV4cG9ydCB0eXBlIEVudGl0eUxpc3RlbmVyQ2FsbGJhY2s8XG4gIERhdGEgZXh0ZW5kcyBhbnksXG4gIE5hbWUgZXh0ZW5kcyBFbnRpdHlFdmVudE5hbWU8RGF0YT5cbj4gPSBFbnRpdHlFdmVudHM8RGF0YT5bTmFtZV1cblxuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlFdmVudHM8RGF0YSBleHRlbmRzIGFueT4ge1xuICBzZXR1cDogKGRhdGE6IERhdGEpID0+IHVua25vd25cbiAgZHJhdzogKGRhdGE6IERhdGEpID0+IHVua25vd25cbiAgdXBkYXRlOiAoZGF0YTogRGF0YSkgPT4gdW5rbm93blxuICB0ZWFyZG93bjogKGRhdGE6IERhdGEpID0+IHVua25vd25cbn1cblxuZXhwb3J0IGNsYXNzIEVudGl0eTxEYXRhIGV4dGVuZHMgYW55PiB7XG4gIHByaXZhdGUgcGFyZW50PzogRW50aXR5PGFueT5cbiAgcHJpdmF0ZSBjaGlsZHJlbjogRW50aXR5PGFueT5bXVxuICBwcml2YXRlIGxpc3RlbmVyczogRW50aXR5TGlzdGVuZXI8RGF0YSwgRW50aXR5RXZlbnROYW1lPERhdGE+PltdID0gW11cblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZGF0YTogRGF0YSkge31cblxuXG4gIHNldHVwKCkge1xuICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgdGhpcy5nZXRMaXN0ZW5lcnNCeU5hbWUoXCJzZXR1cFwiKSkge1xuICAgICAgbGlzdGVuZXIuY2FsbGJhY2sodGhpcy5kYXRhKVxuICAgIH1cbiAgfVxuXG4gIGRyYXcoKSB7XG4gICAgZm9yIChjb25zdCBsaXN0ZW5lciBvZiB0aGlzLmdldExpc3RlbmVyc0J5TmFtZShcImRyYXdcIikpIHtcbiAgICAgIGxpc3RlbmVyLmNhbGxiYWNrKHRoaXMuZGF0YSlcbiAgICB9XG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgZm9yIChjb25zdCBsaXN0ZW5lciBvZiB0aGlzLmdldExpc3RlbmVyc0J5TmFtZShcInVwZGF0ZVwiKSkge1xuICAgICAgbGlzdGVuZXIuY2FsbGJhY2sodGhpcy5kYXRhKVxuICAgIH1cbiAgfVxuXG4gIHRlYXJkb3duKCkge1xuICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgdGhpcy5nZXRMaXN0ZW5lcnNCeU5hbWUoXCJ0ZWFyZG93blwiKSkge1xuICAgICAgbGlzdGVuZXIuY2FsbGJhY2sodGhpcy5kYXRhKVxuICAgIH1cbiAgfVxuXG4gIG9uPE5hbWUgZXh0ZW5kcyBFbnRpdHlFdmVudE5hbWU8RGF0YT4+KGxpc3RlbmVyOiBFbnRpdHlMaXN0ZW5lcjxEYXRhLCBOYW1lPikge1xuICAgIHRoaXMubGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpXG4gIH1cblxuICBhZGRDaGlsZCguLi5jaGlsZHJlbjogRW50aXR5PGFueT5bXSkge1xuICAgIHRoaXMuY2hpbGRyZW4ucHVzaChcbiAgICAgIC4uLmNoaWxkcmVuLm1hcCgoY2hpbGQpID0+IHtcbiAgICAgICAgY2hpbGQucGFyZW50ID0gdGhpc1xuICAgICAgICByZXR1cm4gY2hpbGRcbiAgICAgIH0pXG4gICAgKVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRMaXN0ZW5lcnNCeU5hbWU8TmFtZSBleHRlbmRzIEVudGl0eUV2ZW50TmFtZTxEYXRhPj4obmFtZTogTmFtZSkge1xuICAgIHJldHVybiB0aGlzLmxpc3RlbmVycy5maWx0ZXIoXG4gICAgICAobGlzdGVuZXIpOiBsaXN0ZW5lciBpcyBFbnRpdHlMaXN0ZW5lcjxEYXRhLCBOYW1lPiA9PiB7XG4gICAgICAgIHJldHVybiBsaXN0ZW5lci5uYW1lID09PSBuYW1lXG4gICAgICB9XG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCByb290RW50aXR5ID0gbmV3IEVudGl0eTx1bmRlZmluZWQ+KHVuZGVmaW5lZClcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7O0FDc0JPLHFCQUErQjtBQUFBLElBS3BDLFlBQW1CLE1BQVk7QUFBWjtBQUZYLHVCQUEyRDtBQUFBO0FBQUEsSUFLbkUsUUFBUTtBQUNOLGlCQUFXLFlBQVksS0FBSyxtQkFBbUIsVUFBVTtBQUN2RCxpQkFBUyxTQUFTLEtBQUs7QUFBQTtBQUFBO0FBQUEsSUFJM0IsT0FBTztBQUNMLGlCQUFXLFlBQVksS0FBSyxtQkFBbUIsU0FBUztBQUN0RCxpQkFBUyxTQUFTLEtBQUs7QUFBQTtBQUFBO0FBQUEsSUFJM0IsU0FBUztBQUNQLGlCQUFXLFlBQVksS0FBSyxtQkFBbUIsV0FBVztBQUN4RCxpQkFBUyxTQUFTLEtBQUs7QUFBQTtBQUFBO0FBQUEsSUFJM0IsV0FBVztBQUNULGlCQUFXLFlBQVksS0FBSyxtQkFBbUIsYUFBYTtBQUMxRCxpQkFBUyxTQUFTLEtBQUs7QUFBQTtBQUFBO0FBQUEsSUFJM0IsR0FBdUMsVUFBc0M7QUFDM0UsV0FBSyxVQUFVLEtBQUs7QUFBQTtBQUFBLElBR3RCLFlBQVksVUFBeUI7QUFDbkMsV0FBSyxTQUFTLEtBQ1osR0FBRyxTQUFTLElBQUksQ0FBQyxVQUFVO0FBQ3pCLGNBQU0sU0FBUztBQUNmLGVBQU87QUFBQTtBQUFBO0FBQUEsSUFLTCxtQkFBdUQsTUFBWTtBQUN6RSxhQUFPLEtBQUssVUFBVSxPQUNwQixDQUFDLGFBQXFEO0FBQ3BELGVBQU8sU0FBUyxTQUFTO0FBQUE7QUFBQTtBQUFBO0FBTTFCLE1BQU0sYUFBYSxJQUFJLE9BQWtCOzs7QUR0RWhELFdBQVMsaUJBQWlCLGVBQWUsQ0FBQyxVQUFVLE1BQU07QUFFbkQsbUJBQWlCO0FBQ3RCLGlCQUNFLEtBQUssSUFBSSxTQUFTLGdCQUFnQixhQUFhLE9BQU8sY0FBYyxJQUNwRSxLQUFLLElBQUksU0FBUyxnQkFBZ0IsY0FBYyxPQUFPLGVBQWU7QUFHeEUsSUFBTyxXQUFXLFNBQ2hCLElBQVcsT0FBd0I7QUFFckMsSUFBTyxXQUFXO0FBQUE7QUFHYixrQkFBZ0I7QUFDckIsZUFBVztBQUNYLGNBQVUsUUFBUTtBQUNsQixhQUFTLFNBQVM7QUFDbEIsU0FBSztBQUVMLElBQU8sV0FBVztBQUFBO0FBVWIsd0JBQXNCO0FBQUE7QUFDdEIseUJBQXVCO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==
