import { Scope } from './scope'
import { UMAResource, UMAScope } from '../@types/uma'

export class Resource {
  public id?: string
  public displayName: string
  public name: string
  public uris?: string[]
  public type?: string
  public owner?: string
  public ownerManagedAccess?: boolean
  public attributes?: Record<string, any> = {}

  public scopes: Scope[] = []
  public resourceScopes: Scope[] = []

  constructor(resource: UMAResource, scopes?: UMAScope[]) {
    this.id = resource._id
    this.displayName = resource.displayName
    this.name = resource.name
    this.uris = resource.uris || []
    this.type = resource.type
    this.owner = resource.owner?.id
    this.ownerManagedAccess = resource.ownerManagedAccess || false
    this.attributes = resource.attributes

    if (resource.resource_scopes) {
      this.setResourceScopes(resource.resource_scopes.map((s) => new Scope(s)))
    }

    if (scopes) {
      this.setScopes(scopes.map((s) => new Scope(s)))
    }
  }

  setId(id: string): Resource {
    this.id = id
    return this
  }

  setDisplayName(displayName: string): Resource {
    this.displayName = displayName
    return this
  }

  setName(name: string): Resource {
    this.name = name
    return this
  }

  setUris(uris: string[]): Resource {
    this.uris = uris
    return this
  }

  setType(type: string): Resource {
    this.type = type
    return this
  }

  setOwner(ownerId: string): Resource {
    this.owner = ownerId
    return this
  }

  setOwnerManagedAccess(isOwnerManaged: boolean): Resource {
    this.ownerManagedAccess = isOwnerManaged
    return this
  }

  setAttributes(attributes: Record<string, any>): Resource {
    this.attributes = attributes
    return this
  }

  setScopes(scopes: Scope[]): Resource {
    this.scopes = scopes
    return this
  }

  setResourceScopes(scopes: Scope[]): Resource {
    this.resourceScopes = scopes
    return this
  }

  isEqual(rhs: Resource): boolean {
    return (
      rhs.name === this.name &&
      rhs.id === this.id &&
      rhs.type === this.type &&
      rhs.owner === this.owner
    )
  }

  toJson(): UMAResource {
    return {
      _id: this.id,
      name: this.name,
      uris: this.uris,
      type: this.type,
      owner: this.owner ? { id: this.owner } : undefined,
      ownerManagedAccess: this.ownerManagedAccess,
      attributes: this.attributes || {},
      displayName: this.displayName,
      resource_scopes: this.resourceScopes.map((s) => s.toJson()),
      scopes: this.scopes.map((s) => s.toJson()),
    }
  }
}
