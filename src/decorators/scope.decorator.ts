import { SetMetadata, CustomDecorator } from '@nestjs/common'

export const META_SCOPE = 'scope'

/**
 * Keycloak Authorization Scopes.
 * @param scopes - scopes that are associated with the resource
 */
export const DefineScope = (scope: string): CustomDecorator => SetMetadata(META_SCOPE, scope)
