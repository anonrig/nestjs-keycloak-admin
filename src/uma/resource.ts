import { UMAResourceOptions, UMAScopeOptions } from '../interfaces'
import { UMAScope } from './scope'

export class UMAResource {
  public options: UMAResourceOptions
  private scopes: UMAScope[] = []
  constructor(options: UMAResourceOptions) {
    this.options = options
    this.setScopes(options.scopes)
  }

  setScopes(scopes: string[] | UMAScopeOptions[] = []): UMAResource {
    scopes.forEach((scope: string | UMAScopeOptions) => {
      if (typeof scope === 'string') this.scopes.push(new UMAScope({ name: scope }))
      if (typeof scope === 'object') this.scopes.push(new UMAScope(scope))
    })
    return this
  }

  setName(name: string): UMAResource {
    this.options.name = name
    return this
  }

  setUri(uri: string): UMAResource {
    this.options.uri = uri
    return this
  }

  setType(type: string): UMAResource {
    this.options.type = type
    return this
  }

  setOwner(owner: string): UMAResource {
    this.options.owner = owner
    return this
  }

  setId(id: string): UMAResource {
    this.options.id = id
    return this
  }

  setIconUri(iconUri: string): UMAResource {
    this.options.iconUri = iconUri
    return this
  }

  toJson(): UMAResourceOptions {
    return Object.assign({}, this.options, {
      scopes: this.scopes.map((s) => s.toJson()),
    })
  }

  isEqual(rawRhs: UMAResource): boolean {
    const rhs = rawRhs.toJson()
    return (
      rhs.name === this.options.name &&
      rhs.id === this.options.id &&
      rhs.iconUri === this.options.uri &&
      rhs.type === this.options.type
    )
  }
}
