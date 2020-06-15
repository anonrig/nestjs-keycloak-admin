import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { KEYCLOAK_ADMIN_OPTIONS } from './constants';
import {
  KeycloakAdminModuleAsyncOptions,
  KeycloakAdminOptions,
} from './interfaces';
import { KeycloakAdminService } from './service';

@Global()
@Module({
  providers: [KeycloakAdminService],
  exports: [KeycloakAdminService],
})
export class KeycloakAdminModule {
  public static register(options: KeycloakAdminOptions): DynamicModule {
    const provider = this.getOptionsProvider(options);
    return {
      module: KeycloakAdminModule,
      providers: [provider, this.keycloakProvider],
      exports: [provider, this.keycloakProvider],
    };
  }

  public static registerAsync(
    options: KeycloakAdminModuleAsyncOptions,
  ): DynamicModule {
    const customOptions = this.getCustomOptions(options);

    return {
      module: KeycloakAdminModule,
      imports: options.imports || [],
      providers: [customOptions, this.keycloakProvider],
      exports: [customOptions, this.keycloakProvider],
    };
  }

  private static getCustomOptions(
    options: KeycloakAdminModuleAsyncOptions,
  ): Provider {
    return {
      provide: KEYCLOAK_ADMIN_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }

  private static keycloakProvider: Provider = {
    provide: KeycloakAdminService,
    useFactory: (options: KeycloakAdminOptions) =>
      new KeycloakAdminService(options),
    inject: [KEYCLOAK_ADMIN_OPTIONS],
  };

  private static getOptionsProvider(options: KeycloakAdminOptions): Provider {
    return {
      provide: KEYCLOAK_ADMIN_OPTIONS,
      useValue: options,
    };
  }
}
