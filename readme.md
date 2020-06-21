## Keycloak Admin Client for NestJs

Install using `npm i --save nestjs-keycloak-admin` or `yarn add nestjs-keycloak-admin`

Then on your app.module.ts

```typescript
  @Module({
    imports: [
      KeycloakAdminModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async () => ({
          config: {
            baseUrl: 'https://relevantfruit.com/auth',
            realmName: 'relevant-fruit',
          },
          credentials: {
            clientId: 'batman',
            clientSecret: 'batman-is-cool'
          }
        }),
        inject: [ConfigService]
      }),
    ],
    providers: [
      { provide: APP_GUARD, useClass: AuthGuard },
      { provide: APP_GUARD, useClass: ResourceGuard }  
    ]
  })
```

### UMA Support

By default nestjs-keycloak-admin supports User Managed Access for managing your resources.

```typescript
@Controller()
@DefineResource('organization')
class OrganizationController() {
  constructor(private readonly adminProvider: KeycloakAdminService) {}

  @Get('/hello')
  @Public()
  hello(): string {
    return 'life is short'
  }

  @Get('/)
  @FetchResources()
  findAll(@Request('resources'): Resource[]): Resource[] {
    return resources
  }

  @Get('/:id')
  @DefineScope('read') // this will check organization:read permission
  @DefineResourceEnforcer({
    id: (req: any) => req.params.id
  })
  findOne(@Request('resource'): Resource): Resource) {
    return resource
  }

  @Get('/slug/:slug')
  @DefineScope('read')
  @DefineResourceEnforcer({
    id: async (req: any, context: ExecutionContext) => {
      const class = context.getClass<OrganizationController>()
      const org = await class.typeormProvider.findBySlug(req.params.slug)
      return org.keycloakId
    }
  })
  findBySlug(@Request('resource'): Resource): Resource) {
    return resource
  }

  @Post('/')
  @DefineScope('create')
  async create((): Promise<Resource> {
    let resource = new Resource({
      name: 'resource',
      displayName: 'My Resource'
    })
      .setOwner(1)
      .addScopes([new Scope('organization:read'), new Scope('organization:write')])
      .setType('urn:resource-server:type:organization')
      .setUri('/organization/123')
      .setAttributes({
        valid: true,
        types: ['customer', 'any']
      })

    resource = await this.adminProvider.create(resource)

    // create organization on your resource server and add link to resource.id, to access it later.

    return resource 
  }
}
```
