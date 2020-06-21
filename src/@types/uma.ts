import { ResourceOwner } from './resource'

export interface UMAResource {
  _id?: string
  name: string
  displayName: string
  uris?: string[]
  type?: string
  owner?: ResourceOwner
  ownerManagedAccess?: boolean
  attributes: Record<string, any>
  resource_scopes?: UMAScope[]
  scopes: UMAScope[]
}

export interface UMAScope {
  name: string
  id?: string
  icon_uri?: string
}
