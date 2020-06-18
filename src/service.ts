import { Logger, InternalServerErrorException } from '@nestjs/common'
import AdminClient from 'keycloak-admin'
import { Client, Issuer, TokenSet } from 'openid-client'
import { resolve } from 'url'
import { KeycloakAdminOptions } from './interfaces'
import { ResourceManager } from './lib/resource-manager'

export class KeycloakAdminService {
  private logger = new Logger(KeycloakAdminService.name)

  public readonly options: KeycloakAdminOptions
  private tokenSet?: TokenSet
  private issuerClient?: Client
  public resourceManager: ResourceManager
  public client: AdminClient

  constructor(options: KeycloakAdminOptions) {
    if (!options.config.baseUrl.startsWith('http')) {
      throw new Error(`Invalid base url. It should start with either http or https.`)
    }

    this.options = options
    this.client = new AdminClient(options.config)
    this.resourceManager = new ResourceManager(this)
    this.initConnection()
  }

  async initConnection(): Promise<void> {
    const { clientId, clientSecret } = this.options.credentials

    await this.client.auth({
      clientId,
      clientSecret,
      grantType: 'client_credentials',
    } as any)

    const keycloakIssuer = await Issuer.discover(
      resolve(this.options.config.baseUrl, `/auth/realms/${this.options.config.realmName}`)
    )

    this.issuerClient = new keycloakIssuer.Client({
      client_id: clientId,
      client_secret: clientSecret,
    })

    this.tokenSet = await this.issuerClient.grant({
      clientId,
      clientSecret,
      grant_type: 'client_credentials',
    })

    if (this.tokenSet.expires_at) {
      this.logger.log(`Initial token expires at ${this.tokenSet.expires_at}`)
    }
  }

  async refreshGrant(): Promise<TokenSet | undefined> {
    if (this.tokenSet && !this.tokenSet.expired()) {
      return this.tokenSet
    }

    if (!this.tokenSet) {
      throw new InternalServerErrorException(`Token set is missing. Could not refresh grant.`)
    }

    const { refresh_token } = this.tokenSet

    this.logger.verbose(`Grant token expired, refreshing.`)

    if (!refresh_token) {
      throw new InternalServerErrorException(`Could not refresh token. Refresh token is missing.`)
    }

    this.tokenSet = await this.issuerClient?.refresh(refresh_token)

    if (this.tokenSet?.access_token) {
      this.client.setAccessToken(this.tokenSet.access_token)
    }

    return this.tokenSet
  }
}
