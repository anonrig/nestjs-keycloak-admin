import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { KeycloakAdminService } from '../service';

export class RequestManager {
  private requester: AxiosInstance;
  private readonly client: KeycloakAdminService;

  constructor(client: KeycloakAdminService) {
    this.client = client;

    const { baseUrl, realmName } = this.client.options.config;
    this.requester = Axios.create({
      baseURL: `${baseUrl}/auth/realms/${realmName}`,
    });

    this.requester.interceptors.request.use(async (config) => {
      const tokenSet = await this.client.refreshGrant();
      config.headers.authorization = `Bearer ${tokenSet.access_token}`;
      return config;
    });
  }

  async get<T>(...args: [string, (AxiosRequestConfig | undefined)?]) {
    return this.requester.get.apply<any, any, Promise<AxiosResponse<T>>>(
      null,
      args,
    );
  }

  async post<T>(...args: [string, any?, (AxiosRequestConfig | undefined)?]) {
    return this.requester.post.apply<any, any, Promise<AxiosResponse<T>>>(
      null,
      args,
    );
  }

  async put<T>(...args: [string, any?, (AxiosRequestConfig | undefined)?]) {
    return this.requester.put.apply<any, any, Promise<AxiosResponse<T>>>(
      null,
      args,
    );
  }

  async delete<T>(...args: [string, (AxiosRequestConfig | undefined)?]) {
    return this.requester.delete.apply<any, any, Promise<AxiosResponse<T>>>(
      null,
      args,
    );
  }
}
