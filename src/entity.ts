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
}

export class Entity<Data extends any> {
  private parent?: Entity<any>
  private children: Entity<any>[]
  private listeners: EntityListener<Data, EntityEventName<Data>>[] = []

  constructor(public data: Data) {}

  setup() {
    for (const listener of this.getListenersByName("setup")) {
      listener.callback(this.data)
    }
  }

  draw() {
    for (const listener of this.getListenersByName("draw")) {
      listener.callback(this.data)
    }
  }

  update() {
    for (const listener of this.getListenersByName("update")) {
      listener.callback(this.data)
    }
  }

  teardown() {
    for (const listener of this.getListenersByName("teardown")) {
      listener.callback(this.data)
    }
  }

  on<Name extends EntityEventName<Data>>(listener: EntityListener<Data, Name>) {
    this.listeners.push(listener)
  }

  addChild(...children: Entity<any>[]) {
    this.children.push(
      ...children.map((child) => {
        child.parent = this
        return child
      })
    )
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
