export type EntityEventName<Data extends any> = keyof EntityEvents<Data>

export interface EntityListener<
  Data extends any,
  Name extends EntityEventName<Data>
> {
  name: Name
  callback: EntityListenerCallback<Data, Name>
}

export type EntityListenerCallback<
  Data extends any,
  Name extends EntityEventName<Data>
> = EntityEvents<Data>[Name]

export interface EntityEvents<Data extends any> {
  setup: (data: Data) => unknown
  draw: (data: Data) => unknown
  update: (data: Data) => unknown
  teardown: (data: Data) => unknown
  mousePressed: (data: Data) => unknown
  mouseReleased: (data: Data) => unknown
}

export class Entity<Data extends any> {
  private _isSetup = false
  private zIndex = 0
  private parent?: Entity<any>
  private children = new Set<Entity<any>>()
  private listeners: EntityListener<Data, EntityEventName<Data>>[] = []

  constructor(public data: Data) {}

  get isSetup() {
    return this._isSetup
  }

  setup() {
    if (this.isSetup) throw new Error("Entity is already setup")
    this.childrenCalling("setup")
    this._isSetup = true
  }

  draw() {
    if (this.isSetup) this.childrenCalling("draw")
  }

  update() {
    if (this.isSetup) this.childrenCalling("update")
  }

  teardown() {
    if (!this.isSetup) throw new Error("Entity must be setup before")
    if (this.parent) this.parent.children.delete(this)
    this.childrenCalling("teardown")
    this._isSetup = false
  }

  mouseReleased() {
    this.childrenCalling("mouseReleased")
  }

  mousePressed() {
    this.childrenCalling("mousePressed")
  }

  on<Name extends EntityEventName<Data>>(listener: EntityListener<Data, Name>) {
    this.listeners.push(listener)
  }

  addChild(...children: Entity<any>[]) {
    for (const child of children) {
      child.parent = this
      this.children.add(child)
      if (this.isSetup) child.setup()
    }
  }

  private childrenCalling(name: EntityEventName<Data>) {
    for (const listener of this.getListenersByName(name)) {
      listener.callback(this.data)
    }

    for (const child of [...this.children].sort((a, b) => a.zIndex - b.zIndex))
      child[name]()
  }

  private getListenersByName<Name extends EntityEventName<Data>>(name: Name) {
    return this.listeners.filter(
      (listener): listener is EntityListener<Data, Name> => {
        return listener.name === name
      }
    )
  }
}

export const rootEntity = new Entity<undefined>(undefined)
