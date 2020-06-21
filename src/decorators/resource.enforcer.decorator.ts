import { SetMetadata, CustomDecorator, ExecutionContext } from '@nestjs/common'

export const META_RESOURCE_ENFORCER = 'resource-enforcer'

/**
 * Keycloak Authorization Scopes.
 * @param scopes - scopes that are associated with the resource
 */
export const DefineResourceEnforcer = (options: ResourceDecoratorOptions): CustomDecorator =>
  SetMetadata(META_RESOURCE_ENFORCER, options)

export interface ResourceDecoratorOptions {
  id: ResourceDecoratorReq
}

export interface ResourceDecoratorReq {
  (req: Request, context: ExecutionContext): Promise<string> | string
}
