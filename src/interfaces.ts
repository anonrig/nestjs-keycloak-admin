import { ModuleMetadata } from '@nestjs/common/interfaces';

export interface KeycloakAdminModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory: (
    ...args: any[]
  ) => Promise<KeycloakAdminOptions> | KeycloakAdminOptions;
}

export interface KeycloakAdminOptionsFactory {
  createKeycloakAdminOptions():
    | Promise<KeycloakAdminOptions>
    | KeycloakAdminOptions;
}

export interface Credentials {
  clientId: string;
  clientSecret: string;
}

export interface KeycloakAdminConfig {
  baseUrl: string;
  realmName: string;
}
export interface KeycloakAdminOptions {
  config: KeycloakAdminConfig;
  credentials: Credentials;
}

export interface UMAScopeOptions {
  name: string;
  id?: string;
  iconUri?: string;
}

export interface UMAResourceOptions {
  name: string;
  id?: string;
  uri?: string;
  type?: string;
  iconUri?: string;
  owner?: string;
  scopes?: string[] | UMAScopeOptions[];
}
