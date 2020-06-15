import { Logger } from '@nestjs/common';
import AdminClient from 'keycloak-admin';
import { Client, GrantBody, Issuer, TokenSet } from 'openid-client';
import { KeycloakAdminOptions } from './interfaces';

export class KeycloakAdminService {
  private logger = new Logger(KeycloakAdminService.name);

  private options: KeycloakAdminOptions;
  private client: AdminClient;
  private tokenSet: TokenSet | null | undefined;
  private issuerClient: Client | null | undefined;
  private connectionConfig: GrantBody & any;

  constructor(options: KeycloakAdminOptions) {
    this.options = options;
    this.client = new AdminClient(options.config);
    this.initConnection();
  }

  async initConnection() {
    const { clientId, clientSecret } = this.options.credentials;

    await this.client.auth({
      clientId,
      clientSecret,
      grantType: 'client_credentials',
    } as any);

    if (!this.options.config.baseUrl) {
      throw new Error(`Base url is missing from options.`);
    }
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

    this.initRefresh();
  }

  async initRefresh() {
    // Periodically using refresh_token grant flow to get new access token here
    // TODO: it will be better to check for token expiration instead of interval check
    setInterval(async () => {
      const tokenSet = this.tokenSet;

      if (!tokenSet || !tokenSet?.refresh_token) {
        return this.logger.warn(
          'Refresh token is missing. Refresh doesnt work.',
        );
      }

      if (!tokenSet.expired()) {
        return this.logger.verbose(`Omitting refreshing of Keycloak token.`);
      }

      try {
        this.tokenSet = await this.issuerClient?.refresh(
          tokenSet.refresh_token,
        );
        this.logger.log('Successfully refreshed token');
      } catch (e) {
        if (e.name === 'TimeoutError' || e?.error === 'invalid_grant') {
          this.tokenSet = await this.issuerClient?.grant(this.connectionConfig);
        } else {
          this.logger.error(e);
          throw e;
        }
      }
      if (this.tokenSet?.access_token) {
        this.client.setAccessToken(this.tokenSet.access_token);
      }
    }, 58 * 1000); // 58 seconds
  }

  getClient() {
    return this.client;
  }
}
