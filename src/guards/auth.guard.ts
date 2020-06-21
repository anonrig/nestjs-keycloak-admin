import {
  CanActivate,
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common'
import { KeycloakAdminService } from '../service'
import { Reflector } from '@nestjs/core'
import { META_PUBLIC } from '../decorators/public.decorator'

@Injectable()
export class AuthGuard implements CanActivate {
  private logger = new Logger(AuthGuard.name)

  constructor(
    private readonly keycloak: KeycloakAdminService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.reflector.get<boolean>(META_PUBLIC, context.getHandler())) {
      return true
    }

    const request = context.switchToHttp().getRequest()

    const jwt = this.extractJwt(request.headers)

    try {
      const result = await this.keycloak.connect.grantManager.validateAccessToken(jwt)

      if (typeof result === 'string') {
        request.user = await this.keycloak.connect.grantManager.userInfo(jwt)
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
