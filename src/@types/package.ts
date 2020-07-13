import { ModuleMetadata } from '@nestjs/common/interfaces'

export interface KeycloakModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[]
  useFactory: (...args: any[]) => Promise<KeycloakModuleOptions> | KeycloakModuleOptions
}

export interface KeycloakOptionsFactory {
  createKeycloakOptions(): Promise<KeycloakModuleOptions> | KeycloakModuleOptions
}

export interface KeycloakModuleOptions {
  baseUrl: string
  realmName: string
  clientId: string
  clientSecret: string
}
