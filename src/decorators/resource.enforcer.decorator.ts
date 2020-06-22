import { SetMetadata, CustomDecorator, ExecutionContext } from '@nestjs/common'

export const META_RESOURCE_ENFORCER = 'keycloak-resource-enforcer'

export const DefineResourceEnforcer = (
  options: ResourceDecoratorOptions
): CustomDecorator<string> =>
  SetMetadata<string, ResourceDecoratorOptions>(META_RESOURCE_ENFORCER, options)

export interface ResourceDecoratorOptions {
  id: ResourceDecoratorReq
}

export interface ResourceDecoratorReq {
  (req: Request, context: ExecutionContext): Promise<string> | string
}
