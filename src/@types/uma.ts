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

export interface UMAConfiguration {
  issuer: string
  authorization_endpoint: string
  token_endpoint: string
  token_introspection_endpoint: string
  end_session_endpoint: string
  grant_types_supported: string[]
  response_types_supported: string[]
  response_modes_supported: string[]
  registration_endpoint: string
  token_endpoint_auth_methods_supported: string
  token_endpoint_auth_signing_alg_values_supported: string[]
  scopes_supported: string[]
  resource_registration_endpoint: string
  permission_endpoint: string
  policy_endpoint: string
  introspection_endpoint: string
}
