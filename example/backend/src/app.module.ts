import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import KeycloakModule, { AuthGuard, ResourceGuard, RoleGuard } from '../../../dist/main'
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    KeycloakModule.register({
      baseUrl: '',
      realmName: '',
      clientSecret: '',
      clientId: ''
    })
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD, 
      useClass: AuthGuard
    },
    { provide: APP_GUARD, useClass: ResourceGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
})
export class AppModule {}
