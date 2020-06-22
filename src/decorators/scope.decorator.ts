import { SetMetadata, CustomDecorator } from '@nestjs/common'

export const META_SCOPE = 'keycloak-scope'

export const DefineScope = (scope: string): CustomDecorator<string> =>
  SetMetadata<string, string>(META_SCOPE, scope)
