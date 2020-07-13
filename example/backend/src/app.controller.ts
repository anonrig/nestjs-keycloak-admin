/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Get, Request, Post, Inject } from '@nestjs/common';
import {DefineResource, Public, KeycloakService, FetchResources, Resource, DefineScope, UMAResource, Scope, EnforceResource} from '../../../dist/main';
import { AppService } from './app.service';

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
