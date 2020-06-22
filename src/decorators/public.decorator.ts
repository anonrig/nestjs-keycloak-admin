import { SetMetadata, CustomDecorator } from '@nestjs/common'

export const META_PUBLIC = 'keycloak-public'

export const Public = (): CustomDecorator<string> => SetMetadata<string, boolean>(META_PUBLIC, true)
