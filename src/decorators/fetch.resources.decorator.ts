import { SetMetadata, CustomDecorator } from '@nestjs/common'

export const META_FETCH_RESOURCES = 'fetch-resources'

/**
 * Keycloak resource.
 * @param resource
 */
export const FetchResources = (): CustomDecorator => SetMetadata(META_FETCH_RESOURCES, true)
