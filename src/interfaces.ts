import { ModuleMetadata } from '@nestjs/common/interfaces';
import { ConnectionConfig } from 'keycloak-admin/lib/client';

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
  username: string;
  password: string;
  grantType: string;
  clientId: string;
  clientSecret?: string;
}

export interface KeycloakAdminOptions {
  config: ConnectionConfig;
  credentials: Credentials;
}
