import { DynamicModule, Module, Provider } from '@nestjs/common';
import { KEYCLOAK_ADMIN_OPTIONS } from './constants';
import {
  KeycloakAdminModuleAsyncOptions,
  KeycloakAdminOptions,
  KeycloakAdminOptionsFactory,
} from './interfaces';
import { KeycloakAdminService } from './service';

@Module({})
export class KeycloakAdminModule {
  public static register(opts: KeycloakAdminOptions): DynamicModule {
    const optsProvider = {
      provide: KEYCLOAK_ADMIN_OPTIONS,
      useValue: opts,
    };

    return {
      module: KeycloakAdminModule,
      providers: [optsProvider, this.keycloakProvider],
      exports: [optsProvider, this.keycloakProvider],
    };
  }

  public static registerAsync(
    opts: KeycloakAdminModuleAsyncOptions,
  ): DynamicModule {
    const optsProvider = this.createAdminProviders(opts);

    return {
      module: KeycloakAdminModule,
      imports: opts.imports || [],
      providers: [optsProvider, this.keycloakProvider],
      exports: [optsProvider, this.keycloakProvider],
    };
  }

  private static createAdminProviders(
    options: KeycloakAdminModuleAsyncOptions,
  ): Provider {
    if (options.useExisting || options.useFactory) {
      return this.createAdminOptionsProvider(options);
    }

    // useClass
    return {
      provide: options.useClass,
      useClass: options.useClass,
    };
  }

  private static createAdminOptionsProvider(
    options: KeycloakAdminModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      // useFactory
      return {
        provide: KEYCLOAK_ADMIN_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    // useExisting
    return {
      provide: KEYCLOAK_ADMIN_OPTIONS,
      useFactory: async (optionsFactory: KeycloakAdminOptionsFactory) =>
        await optionsFactory.createKeycloakAdminOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }

  private static keycloakProvider: Provider = {
    provide: KeycloakAdminService,
    useFactory: async (options: KeycloakAdminOptions) => {
      return new KeycloakAdminService(options);
    },
    inject: [KEYCLOAK_ADMIN_OPTIONS],
  };
}
