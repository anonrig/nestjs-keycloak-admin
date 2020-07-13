import { SetMetadata, CustomDecorator, Type, Provider, Inject } from '@nestjs/common'

export const META_RESOURCE_ENFORCER = 'keycloak-resource-enforcer'

export interface EnforceResourceDefinition {
  (request: any): string
}

export interface EnforceResourceOptions {
  def: EnforceResourceDefinition
  param?: string
}

export const EnforceResource = (options: EnforceResourceOptions): CustomDecorator<string> =>
  SetMetadata<string, EnforceResourceOptions>(META_RESOURCE_ENFORCER, options)
