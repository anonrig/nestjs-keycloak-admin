import { ModuleMetadata } from '@nestjs/common/interfaces'

export interface KeycloakAdminModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[]
  useFactory: (...args: any[]) => Promise<KeycloakAdminOptions> | KeycloakAdminOptions
}

export interface KeycloakAdminOptionsFactory {
  createKeycloakAdminOptions(): Promise<KeycloakAdminOptions> | KeycloakAdminOptions
}

export interface Credentials {
  clientId: string
  clientSecret: string
}

export interface KeycloakAdminConfig {
  baseUrl: string
  realmName: string
}

export interface KeycloakAdminOptions {
  config: KeycloakAdminConfig
  credentials: Credentials
}
