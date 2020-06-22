import { ModuleMetadata } from '@nestjs/common/interfaces'

export interface KeycloakModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[]
  useFactory: (...args: any[]) => Promise<KeycloakModuleOptions> | KeycloakModuleOptions
}

export interface KeycloakOptionsFactory {
  createKeycloakOptions(): Promise<KeycloakModuleOptions> | KeycloakModuleOptions
}

export interface Credentials {
  clientId: string
  clientSecret: string
}

export interface KeycloakConfig {
  baseUrl: string
  realmName: string
}

export interface KeycloakModuleOptions {
  config: KeycloakConfig
  credentials: Credentials
}
