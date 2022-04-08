import { SetMetadata, CustomDecorator } from '@nestjs/common'
import { RoleMatchingMode } from '../constants'

export const META_ROLES = 'keycloak-roles'

export interface RoleDecoratorOption {
  roles: string[]
  mode: RoleMatchingMode
}
export const Roles = (option: RoleDecoratorOption): CustomDecorator<string> =>
  SetMetadata<string, RoleDecoratorOption>(META_ROLES, option)
