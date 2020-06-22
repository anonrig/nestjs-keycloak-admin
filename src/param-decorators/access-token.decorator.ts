import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const AccessToken = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().accessToken
})
