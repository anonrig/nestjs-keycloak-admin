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
import { KeycloakUser } from '../@types/user'

@Injectable()
export class AuthGuard implements CanActivate {
  logger = new Logger(AuthGuard.name)

  constructor(
    @Inject(KeycloakService)
    private keycloak: KeycloakService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic: boolean = this.reflector.get<boolean>(META_PUBLIC, context.getHandler())

    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const jwt = this.extractJwt(request.headers)

    try {
      const result = await this.keycloak.connect.grantManager.validateAccessToken(jwt)

      if (typeof result === 'string') {
        request.user = await this.keycloak.connect.grantManager.userInfo<string, KeycloakUser>(jwt)
        request.accessToken = jwt
        return true
      }
    } catch (error) {
      this.logger.warn(`Error occurred validating token`, error)
    }

    throw new UnauthorizedException()
  }

  private extractJwt({ authorization }: Record<string, string>): string {
    if (!authorization) {
      throw new UnauthorizedException()
    }

    const [type, payload] = authorization.split(' ')

    if (type.toLowerCase() !== 'bearer') {
      throw new UnauthorizedException()
    }

    return payload
  }
}
