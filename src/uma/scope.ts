import { UMAScope } from '../@types/uma'

export class Scope {
  private name: string
  private id?: string
  private iconUri?: string

  constructor(scope: string | UMAScope) {
    if (typeof scope === 'string') {
      this.name = scope
    } else {
      this.name = scope.name
      this.id = scope.id
      this.iconUri = scope.icon_uri
    }
  }

  isEqual(rhs: Scope): boolean {
    return this.name === rhs.name
  }

  toJson(): UMAScope {
    return {
      name: this.name,
      id: this.id,
      icon_uri: this.iconUri,
    }
  }
}
