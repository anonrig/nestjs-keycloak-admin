# Keycloak for Nest.js

## Installation

Install using `npm i --save nestjs-keycloak-admin` or `pnpm add nestjs-keycloak-admin`

## ESM restriction

- Due to `@keycloak/keycloak-admin-client` package, `nestjs-keycloak-admin` can't support CommonJS at the moment. 
The team behind `keycloak-admin-client` made the decision to have a breaking change and support CommonJS.
Please refer to [this Github issue](https://github.com/keycloak/keycloak-nodejs-admin-client/issues/523) for more information about their decision-making process.
- You need to switch to ESM to run this package without any issues. Please refer to [this Github gist](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)
for more information.

## Initialize KeycloakModule

Then on your app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import KeycloakModule, { AuthGuard, ResourceGuard, RoleGuard } from 'nestjs-keycloak-admin'
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
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: ResourceGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
})
export class AppModule {}
```

### Resource Management using User Managed Access (UMA)

By default nestjs-keycloak-admin supports User Managed Access for managing your resources.

```typescript
import { Controller, Get, Request, ExecutionContext, Post } from '@nestjs/common'
import {
  DefineResource,
  Public,
  KeycloakService,
  FetchResources,
  Resource,
  DefineScope,
  DefineResourceEnforcer,
  UMAResource,
  Scope,
} from 'nestjs-keycloak-admin'

@Controller('/organization')
@DefineResource('organization')
export class AppController {
  constructor(private readonly keycloak: KeycloakService) {}

  @Get('/hello')
  @Public()
  sayHello(): string {
    return 'life is short.'
  }

  @Get('/')
  @FetchResources()
  findAll(@Request() req: any): Resource[] {
    return req.resources as Resource[]
  }

  @Get('/:slug')
  @DefineScope('read')
  @EnforceResource({
    def: ({ params }) => params.slug,
    param: 'slug',
  })
  findBySlug(@Request() req: any): Resource {
    return req.resource as Resource
  }

  @Post('/')
  @DefineScope('create')
  async create(@Request() req: any): Promise<Resource> {
    let resource = new Resource({
      name: 'resource',
      displayName: 'My Resource',
    } as UMAResource)
      .setOwner(req.user._id)
      .setScopes([new Scope('organization:read'), new Scope('organization:write')])
      .setType('urn:resource-server:type:organization')
      .setUris(['/organization/123'])
      .setAttributes({
        valid: true,
        types: ['customer', 'any'],
      })

    resource = await this.keycloak.resourceManager.create(resource)

    // create organization on your resource server and add link to resource.id, to access it later.

    return resource
  }
}
```

## Decorators

```typescript
@Get('/hello')
@Roles({roles: ['realm:admin'], mode: RoleMatchingMode.ANY})
sayHello(@User() user: KeycloakUser, @AccessToken() accessToken): string {
  return `life is short. -${user.email}/${accessToken}`
}
```

Here is the decorators you can use in your controllers.

| Decorator        | Description                                                                                               |
|------------------|-----------------------------------------------------------------------------------------------------------|
| @User            | Retrieves the current Keycloak logged-in user. (must be per method, unless controller is request scoped.) |
| @AccessToken     | Retrieves the current access token. (must be per method, unless controller is request scoped.)            |
| @DefineResource  | Define the keycloak application resource name.                                                            |
| @DefineScope     | Define the keycloak resource scope (ex: 'create', 'read', 'update', 'delete')                             |
| @EnforceResource |                                                                                                           |
| @FetchResources  |                                                                                                           |
| @Public          | Allow any user to use the route.                                                                          |
| @Roles           | Keycloak realm/application roles. Prefix any realm-level roles with "realm:" (i.e realm:admin)            |
