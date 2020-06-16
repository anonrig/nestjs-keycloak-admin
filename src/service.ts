import { Logger } from '@nestjs/common';
import AdminClient from 'keycloak-admin';
import { Client, Issuer, TokenSet } from 'openid-client';
import { KeycloakAdminOptions } from './interfaces';
import { ResourceManager } from './lib/resource-manager';

export class KeycloakAdminService {
  private logger = new Logger(KeycloakAdminService.name);

  public readonly options: KeycloakAdminOptions;
  private tokenSet?: TokenSet;
  private issuerClient?: Client;
  public resourceManager: ResourceManager;
  public client: AdminClient;

  constructor(options: KeycloakAdminOptions) {
    this.options = options;
    this.client = new AdminClient(options.config);
    this.resourceManager = new ResourceManager(this);
    this.initConnection();
  }

  async initConnection() {
    const { clientId, clientSecret } = this.options.credentials;

    await this.client.auth({
      clientId,
      clientSecret,
      grantType: 'client_credentials',
    } as any);

    const keycloakIssuer = await Issuer.discover(this.options.config.jwtIssuer);

    this.issuerClient = new keycloakIssuer.Client({
      client_id: clientId,
      client_secret: clientSecret,
    });

    this.tokenSet = await this.issuerClient.grant({
      clientId,
      clientSecret,
      grant_type: 'client_credentials',
    });

    this.logger.log(
      `Initial token expires at ${new Date(this.tokenSet.expires_at!)}`,
    );
  }

  async refreshGrant(): Promise<TokenSet> {
    if (this.tokenSet && !this.tokenSet.expired()) {
      return this.tokenSet;
    }

    this.logger.verbose(`Grant token expired, refreshing.`);

    this.tokenSet = await this.issuerClient?.refresh(
      this.tokenSet!.refresh_token!,
    );

    this.client.setAccessToken(this.tokenSet!.access_token!);
    return this.tokenSet!;
  }
}
