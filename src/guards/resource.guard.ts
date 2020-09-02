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
  META_RESOURCE_ENFORCER,
  EnforceResourceOptions,
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
import { getRequest } from './execution.request'
import { PriviledgedRequest } from '../@types/request'

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

    // Emit process, if endpoint is public.
    if (isPublic) {
      return true
    }

    const request = getRequest(context)

    const resourceType = this.reflector.get<string>(META_RESOURCE, context.getClass())

    // If no @DefineScope() decorator is used in handler, it's generated from http method.
    const scope =
      this.reflector.get<string>(META_SCOPE, context.getHandler()) ||
      this.getScopeFromRequestMethod(request)

    const resourceHandler = this.reflector.get<EnforceResourceOptions>(
      META_RESOURCE_ENFORCER,
      context.getHandler()
    )
    const shouldFetchResources = this.reflector.get<boolean>(
      META_FETCH_RESOURCES,
      context.getHandler()
    )

    // If no resource type is defined as class decorator, emit.
    if (!resourceType) {
      return true
    }

    // If no access token is defined, probably auth guard failed to load.
    if (!request.accessToken) {
      throw new UnauthorizedException()
    }

    // If handler has a @FetchResources() decorator, fetch resources for that resource type.
    if (shouldFetchResources) {
      return this.fetchResources(request)
    }

    let resourceId: string | undefined

    try {
      if (resourceHandler) {
        const urlParam = resourceHandler.def(request)
        if (resourceHandler.param) {
          const resource = await this.keycloak.resourceManager.findByAttribute(
            resourceHandler.param,
            urlParam
          )
          if (resource) {
            resourceId = resource[0]
          }
        } else {
          resourceId = urlParam
        }
      }

      const response = await this.keycloak.permissionManager.requestTicket({
        token: request.accessToken as string,
        audience: this.keycloak.options.clientId,
        resourceId,
        scope: scope ? `${resourceType}:${scope}` : undefined,
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

  private async fetchResources(request: PriviledgedRequest) {
    try {
      const response = (await this.keycloak.permissionManager.requestTicket({
        token: request.accessToken as string,
        audience: this.keycloak.options.clientId,
        response_mode: TicketResponseMode.permissions,
      })) as TicketPermissionResponse[]

      request.resources = await Promise.all(
        response.map((r: TicketPermissionResponse) =>
          this.keycloak.resourceManager.findById(r.rsid)
        )
      )

      return true
    } catch (error) {
      this.logger.error(`Uncaught exception when fetching resources from UMA server`, error)
    }

    throw new UnauthorizedException()
  }
}
