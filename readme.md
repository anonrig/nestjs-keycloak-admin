### Keycloak Admin Client for NestJs

Install using `npm i --save nestjs-keycloak-admin` or `yarn add nestjs-keycloak-admin`

Then on your app.module.ts

```javascript
  @Module({
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
  })
```
