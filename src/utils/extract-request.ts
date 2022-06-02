import { ExecutionContext } from '@nestjs/common'
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql'

export function extractRequest(context: ExecutionContext): any {
  if (context.getType<GqlContextType>() === 'graphql') {
    const gqlContext = GqlExecutionContext.create(context)
    return gqlContext.getContext().req
  }
  return context.switchToHttp().getRequest()
}
