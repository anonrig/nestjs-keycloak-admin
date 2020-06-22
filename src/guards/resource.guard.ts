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
import {
  ResourceDecoratorOptions,
  META_RESOURCE_ENFORCER,
} from '../decorators/resource.enforcer.decorator'
import { META_SCOPE } from '../decorators/scope.decorator'
import {
  TicketResponseMode,
  TicketPermissionResponse,
  TicketDecisionResponse,
} from '../@types/uma.ticket'
import { META_RESOURCE } from '../decorators/resource.decorator'
import { META_FETCH_RESOURCES } from '../decorators/fetch.resources.decorator'
import { META_PUBLIC } from '../decorators/public.decorator'

@Injectable()
export class ResourceGuard implements CanActivate {
  logger = new Logger(ResourceGuard.name)

  constructor(
    @Inject(KeycloakService)
    private keycloak: KeycloakService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(META_PUBLIC, context.getHandler())
    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const resource = this.reflector.get<string>(META_RESOURCE, context.getClass())
    const scope =
      this.reflector.get<string>(META_SCOPE, context.getHandler()) ||
      this.getScopeFromRequestMethod(request)
    const resourceHandler = this.reflector.get<ResourceDecoratorOptions>(
      META_RESOURCE_ENFORCER,
      context.getHandler()
    )
    const fetchResources = this.reflector.get<boolean>(META_FETCH_RESOURCES, context.getHandler())

    if (!resource) {
      return true
    }

    if (!request.accessToken) {
      throw new UnauthorizedException()
    }

    if (fetchResources) {
      return this.fetchResources(request)
    }

    let resourceId: string | undefined

    try {
      if (resourceHandler) {
        resourceId = await Promise.resolve(resourceHandler.id(request, context))
      }

      const response = await this.keycloak.permissionManager.requestTicket({
        token: request.accessToken as string,
        audience: this.keycloak.options.credentials.clientId,
        resourceId,
        scope: scope ? `${resource}:${scope}` : undefined,
        response_mode: resourceHandler
          ? TicketResponseMode.permissions
          : TicketResponseMode.decision,
      })

      if (!resourceHandler) {
        if ((response as TicketDecisionResponse).result) return true
        throw new UnauthorizedException()
      }

      const [{ scopes, rsid }] = response as TicketPermissionResponse[]
      request.scopes = scopes
      request.resource = await this.keycloak.resourceManager.findById(rsid)
      return true
    } catch (error) {
      this.logger.error(`Uncaught exception from UMA server`, error)
    }

    throw new UnauthorizedException()
  }

  private getScopeFromRequestMethod(request: Request): string {
    switch (request.method) {
      case 'post':
        return 'create'
      case 'get':
        return 'read'
      case 'put':
        return 'update'
      case 'delete':
        return 'delete'
      default:
        return 'read'
    }
  }

  private async fetchResources(request: any) {
    try {
      const response = (await this.keycloak.permissionManager.requestTicket({
        token: request.accessToken as string,
        audience: this.keycloak.options.credentials.clientId,
        response_mode: TicketResponseMode.permissions,
      })) as TicketPermissionResponse[]

      request.resources = await Promise.all(
        response.map((r: TicketPermissionResponse) =>
          this.keycloak.resourceManager.findById(r.rsid)
        )
      )
      return true
    } catch (error) {
      this.logger.error(`Uncaught exception from UMA server`, error)
    }

    throw new UnauthorizedException()
  }
}
