export type EntityEventNames =
  | "setup"
  | "draw"
  | "update"
  | "teardown"
  | "mousePressed"
  | "mouseReleased"

export type EntityListener<This extends Entity> = (
  this: This,
  it: This
) => unknown

export class Entity {
  static root = new Entity(true)

  protected _isSetup = false
  protected zIndex = 0
  protected parent?: Entity
  protected children = new Set<Entity>()
  protected listeners: EntityListener<this>[] = []

  get isSetup() {
    return this._isSetup
  }

  /**
   * Represent any state-based entity
   * @param isRoot Define the entity as root entity (only 1 root entity by project)
   */
  constructor(public readonly isRoot = false) {
    if (!isRoot) Entity.root.addChild(this)
  }

  /**
   * Used to be overwritten by your own workings
   */
  setup() {}

  /**
   * Used to be overwritten by your own workings
   */
  draw() {}

  /**
   * Used to be overwritten by your own workings
   */
  update() {}

  /**
   * Used to be overwritten by your own workings
   */
  teardown() {}

  /**
   * Used to be overwritten by your own workings
   */
  mouseReleased() {}

  /**
   * Used to be overwritten by your own workings
   */
  mousePressed() {}

  /**
   * Should only be called if the current entity is a root.
   */
  public _setup() {
    if (!this.isSetup) {
      this.setup()
      this.transmit("setup")
      this._isSetup = true
    } else {
      throw new Error("Entity is already setup")
    }
  }

  /**
   * Should only be called if the current entity is a root.
   */
  public _draw() {
    if (this.isSetup) {
      this.draw()
      this.transmit("draw")
    } else {
      console.warn("Draw is called before setup")
    }
  }

  /**
   * Should only be called if the current entity is a root.
   */
  public _update() {
    if (this.isSetup) {
      this.update()
      this.transmit("update")
    } else {
      console.warn("update is called before setup")
    }
  }

  /**
   * Should only be called if the current entity is a root.
   */
  public _teardown() {
    if (this.isSetup) {
      this.teardown()
      if (this.parent) this.parent.children.delete(this)
      this.transmit("teardown")
      this._isSetup = false
    } else {
      throw new Error("Entity must be setup before")
    }
  }

  /**
   * Should only be called if the current entity is a root.
   */
  public _mouseReleased() {
    if (this.isSetup) {
      this.mouseReleased()
      this.transmit("mouseReleased")
    } else {
      console.warn("mousePressed is called before setup")
    }
  }

  /**
   * Should only be called if the current entity is a root.
   */
  public _mousePressed() {
    if (this.isSetup) {
      this.mousePressed()
      this.transmit("mousePressed")
    } else {
      console.warn("mousePressed is called before setup")
    }
  }

  public on(name: EntityEventNames, listener: EntityListener<this>) {
    this.listeners.push(
      {
        [name]() {
          listener.bind(this)(this)
        },
      }[name].bind(this)
    )
  }

  public addChild(...children: Entity[]) {
    for (const child of children) {
      child.parent = this
      this.children.add(child)
      if (this.isSetup) child._setup()
    }
  }

  private transmit(name: EntityEventNames) {
    for (const listener of this.getListenersByName(name))
      listener.bind(this)(this)

    for (const child of [...this.children].sort((a, b) => a.zIndex - b.zIndex))
      child[`_${name}`]()
  }

  private getListenersByName(name: EntityEventNames) {
    return this.listeners.filter((listener) => {
      return listener.name === name
    })
  }
}
