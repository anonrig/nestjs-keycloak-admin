import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { KeycloakService } from '../service'
import { Logger } from '@nestjs/common'

export class RequestManager {
  private logger = new Logger(RequestManager.name)
  private requester: AxiosInstance
  private readonly client: KeycloakService

  constructor(client: KeycloakService, baseURL: string) {
    this.client = client
    this.requester = Axios.create({ baseURL })
    this.requester.interceptors.request.use(async (config) => {
      if (config.headers?.authorization?.length) {
        return config
      }
      try {
        const tokenSet = await this.client.refreshGrant()

        if (tokenSet?.access_token) {
          config.headers.authorization = `Bearer ${tokenSet?.access_token}`
        }
      } catch (error) {
        this.logger.warn(`Could not refresh grant on interceptor.`, error)
      }
      return config
    })
  }

  async get<T>(...args: [string, (AxiosRequestConfig | undefined)?]): Promise<AxiosResponse<T>> {
    return this.requester.get.apply<any, any, Promise<AxiosResponse<T>>>(null, args)
  }

  async post<T>(
    ...args: [string, any?, (AxiosRequestConfig | undefined)?]
  ): Promise<AxiosResponse<T>> {
    return this.requester.post.apply<any, any, Promise<AxiosResponse<T>>>(null, args)
  }

  async put<T>(
    ...args: [string, unknown?, (AxiosRequestConfig | undefined)?]
  ): Promise<AxiosResponse<T>> {
    return this.requester.put.apply<any, any, Promise<AxiosResponse<T>>>(null, args)
  }

  async delete<T>(...args: [string, (AxiosRequestConfig | undefined)?]): Promise<AxiosResponse<T>> {
    return this.requester.delete.apply<any, any, Promise<AxiosResponse<T>>>(null, args)
  }
}
