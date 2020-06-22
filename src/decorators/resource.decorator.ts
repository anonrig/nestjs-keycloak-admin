import { SetMetadata, CustomDecorator } from '@nestjs/common'

export const META_RESOURCE = 'keycloak-resource'

export const DefineResource = (resource: string): CustomDecorator<string> =>
  SetMetadata<string, string>(META_RESOURCE, resource)
