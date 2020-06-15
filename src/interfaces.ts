import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { AxiosRequestConfig } from 'axios';

export interface KeycloakAdminModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<KeycloakAdminOptionsFactory>;
  useClass?: Type<KeycloakAdminOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<KeycloakAdminOptions> | KeycloakAdminOptions;
}

export interface KeycloakAdminOptionsFactory {
  createKeycloakAdminOptions():
    | Promise<KeycloakAdminOptions>
    | KeycloakAdminOptions;
}

export interface ConnectionConfig {
  baseUrl?: string;
  realmName?: string;
  requestConfig?: AxiosRequestConfig;
}

export interface Credentials {
  username: string;
  password: string;
  grantType: string;
  clientId: string;
  clientSecret?: string;
}

export interface KeycloakAdminOptions {
  config?: ConnectionConfig;
  credentials: Credentials;
}
