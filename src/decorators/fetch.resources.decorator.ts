import { SetMetadata, CustomDecorator } from '@nestjs/common'

export const META_FETCH_RESOURCES = 'keycloak-fetch-resources'

export const FetchResources = (): CustomDecorator<string> =>
  SetMetadata<string, boolean>(META_FETCH_RESOURCES, true)
