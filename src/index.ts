import { KeycloakModule } from './module'

export * from './@types/package'
export * from './@types/resource'
export * from './@types/uma'
export * from './@types/uma.ticket'
export * from './@types/user'

export * from './decorators/fetch.resources.decorator'
export * from './decorators/public.decorator'
export * from './decorators/resource.decorator'
export * from './decorators/resource.enforcer.decorator'
export * from './decorators/scope.decorator'

export * from './guards/auth.guard'
export * from './guards/resource.guard'

export * from './lib/request-manager'
export * from './lib/resource-manager'
export * from './lib/permission-manager'

export * from './param-decorators/access-token.decorator'
export * from './param-decorators/user.decorator'

export * from './uma/resource'
export * from './uma/scope'

export * from './constants'
export * from './service'

export default KeycloakModule
