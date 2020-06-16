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
            jwtIssuer: 'https://relevantfruit.com/auth/realms/relevant-fruit'
          },
          credentials: {
            clientId: 'batman',
            clientSecret: 'batman-is-cool'
          }
        }),
        inject: [ConfigService]
      }),
    ]
  })
```

### UMA Support

By default nestjs-keycloak-admin supports User Managed Access for managing your resources.

```typescript
class Organization() {
  constructor(private readonly adminProvider: KeycloakAdminService) {}

  async findAll(): UMAResource[] {
    return this.adminProvider.resourceManager.findAll()
  }

  async create(payload: payload): Promise<UMAResource> {
    const resource = new UMAResource(payload)
      .setOwner(1)
      .addScope('organization:create')
      .setType('organization')
      .setUri('/organization/123')

    return this.adminProvider.create(resource)
  }
}
```
