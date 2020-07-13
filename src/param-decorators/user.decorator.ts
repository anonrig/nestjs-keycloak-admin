import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { KeycloakUser } from '../@types/user'

export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): KeycloakUser => {
    return ctx.switchToHttp().getRequest().user
  }
)
