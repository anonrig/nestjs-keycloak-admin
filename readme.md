## Keycloak Admin Client for NestJs

Install using `npm i --save nestjs-keycloak-admin` or `yarn add nestjs-keycloak-admin`


## Initialize KeycloakModule

Then on your app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import KeycloakModule, { AuthGuard, ResourceGuard } from 'nestjs-keycloak-admin'
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    KeycloakModule.register({
      baseUrl: '',
      realmName: ''
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
    {provide: APP_GUARD, useClass: ResourceGuard},
  ],
})
export class AppModule {}
```

### Resource Management using User Managed Access (UMA)

By default nestjs-keycloak-admin supports User Managed Access for managing your resources.

```typescript
import { Controller, Get, Request, ExecutionContext, Post } from '@nestjs/common';
import {DefineResource, Public, KeycloakService, FetchResources, Resource, DefineScope, DefineResourceEnforcer, UMAResource, Scope} from 'nestjs-keycloak-admin';

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
    def: ({params}) => params.slug,
    param: 'slug'
  })
  findBySlug(@Request() req: any): Resource {
    return req.resource as Resource
  }

  @Get('/slug/:slug')
  @DefineScope('read')
  @DefineResourceEnforcer({
    id: async (req: any, context: ExecutionContext) => {
      const cls = context.getClass<AppController>()
      //do something with it
      
      return req.slug
    }
  })
  findBySlug(@Request() req: any): Resource {
    return req.resource as Resource
  }

  @Post('/')
  @DefineScope('create')
  async create(@Request() req: any): Promise<Resource> {
    let resource = new Resource({
      name: 'resource',
      displayName: 'My Resource'
    } as UMAResource)
      .setOwner(req.user._id)
      .setScopes([new Scope('organization:read'), new Scope('organization:write')])
      .setType('urn:resource-server:type:organization')
      .setUris(['/organization/123'])
      .setAttributes({
        valid: true,
        types: ['customer', 'any']
      })

    resource = await this.keycloak.resourceManager.create(resource)

    // create organization on your resource server and add link to resource.id, to access it later.

    return resource 
  }
}
```
