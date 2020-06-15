/* eslint-disable @typescript-eslint/camelcase */
import { Logger } from '@nestjs/common';
import KeycloakAdminClient from 'keycloak-admin';
import { Client, GrantBody, Issuer, TokenSet } from 'openid-client';
import { KeycloakAdminOptions } from './interfaces';

export class KeycloakAdminService {
  private logger = new Logger(KeycloakAdminService.name);

  private config: KeycloakAdminOptions;
  private client: KeycloakAdminClient;
  private tokenSet: TokenSet;
  private issuerClient: Client;
  private connectionConfig: GrantBody & any;

  constructor(options: KeycloakAdminOptions) {
    this.config = options;

    this.client = new KeycloakAdminClient(options.config);

    this.connectionConfig = {
      clientId: options.credentials.clientId,
      clientSecret: options.credentials.clientSecret,
      grant_type: 'client_credentials',
    };

    this.initConnection();

    return this;
  }

  async initConnection() {
    try {
      await this.client.auth(this.connectionConfig);

      const keycloakIssuer = await Issuer.discover(
        this.config['auth-server-url'],
      );

      this.issuerClient = new keycloakIssuer.Client({
        client_id: this.config.credentials.clientSecret,
        client_secret: this.config.credentials.clientSecret,
      });

      this.tokenSet = await this.issuerClient.grant(this.connectionConfig);

      this.initRefresh();
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async initRefresh() {
    // Periodically using refresh_token grant flow to get new access token here
    // TODO: it will be better to check for token expiration instead of interval check
    setInterval(async () => {
      const refreshToken = this.tokenSet.refresh_token;
      try {
        this.tokenSet = await this.issuerClient.refresh(refreshToken);
        this.logger.verbose('Successfully refreshed token');
      } catch (e) {
        if (e.name === 'TimeoutError' || e?.error === 'invalid_grant') {
          this.tokenSet = await this.issuerClient.grant(this.connectionConfig);
        } else {
          this.logger.error(e);
          throw e;
        }
      }
      this.client.setAccessToken(this.tokenSet.access_token);
    }, 58 * 1000); // 58 seconds
  }

  getClient() {
    return this.client;
  }
}
