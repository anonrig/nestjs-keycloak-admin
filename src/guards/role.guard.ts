import {
  CanActivate,
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
  Inject,
} from '@nestjs/common'

import { KeycloakService } from '../service'
import { Reflector } from '@nestjs/core'
import { META_PUBLIC } from '../decorators/public.decorator'
import { META_ROLES, RoleDecoratorOption } from '../decorators/roles.decorator'
import { RoleMatchingMode } from '../constants'
import KeycloakConnect from 'keycloak-connect'

@Injectable()
export class RoleGuard implements CanActivate {
  logger = new Logger(RoleGuard.name)

  constructor(
    @Inject(KeycloakService)
    private keycloak: KeycloakService,
    private readonly reflector: Reflector
  ) {}

  getRequest(context: ExecutionContext): any {
    return context.switchToHttp().getRequest()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(META_PUBLIC, context.getHandler())

    // Emit process, if endpoint is public.
    if (isPublic) {
      return true
    }

    const request = this.getRequest(context)

    const roleDefinition = this.reflector.get<RoleDecoratorOption>(META_ROLES, context.getHandler())

    // If no resource type is defined as class decorator, emit.
    if (!roleDefinition?.roles?.length) {
      return true
    }

    // If no access token is defined, probably auth guard failed to load.
    if (!request.accessToken) {
      throw new UnauthorizedException()
    }

    try {
      const grant = await this.keycloak.connect.grantManager.createGrant({
        access_token: request.accessToken,
      })

      const granted = this.isAccessGranted(roleDefinition, grant.access_token);

      granted
        ? this.logger.verbose(`Access granted for role(s).`)
        : this.logger.verbose(`Access denied due to missing role(s).`)
      return granted
    } catch (error) {
      this.logger.error(`Error occured validating roles`, error)
    }

    throw new UnauthorizedException()
  }

  isAccessGranted(roleDefinition: RoleDecoratorOption, accessToken?: KeycloakConnect.Token): boolean {
    if (roleDefinition.mode == RoleMatchingMode.ANY) {
      return roleDefinition.roles.some((role) => accessToken?.hasRole(role))
    }
    return roleDefinition.roles.every((role) => accessToken?.hasRole(role))
  }
}
