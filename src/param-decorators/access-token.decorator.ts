import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const AccessToken = createParamDecorator((_data: unknown, ctx: ExecutionContext): string => {
  return ctx.switchToHttp().getRequest().accessToken
})
