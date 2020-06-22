import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const User = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().user
})
