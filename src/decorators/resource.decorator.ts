import { SetMetadata, CustomDecorator } from '@nestjs/common'

export const META_RESOURCE = 'resource'

/**
 * Keycloak resource.
 * @param resource
 */
export const DefineResource = (resource: string): CustomDecorator =>
  SetMetadata(META_RESOURCE, resource)
