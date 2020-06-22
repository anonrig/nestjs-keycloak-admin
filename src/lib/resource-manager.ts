import { Resource } from '../uma/resource'
import { KeycloakService } from '../service'
import { RequestManager } from './request-manager'
import { UMAResource } from '../@types/uma'
import { ResourceQuery } from '../@types/resource'

export class ResourceManager {
  private readonly requestManager: RequestManager

  constructor(client: KeycloakService, endpoint: string) {
    this.requestManager = new RequestManager(client, endpoint)
  }

  async create(resource: Resource): Promise<Resource> {
    const { data } = await this.requestManager.post<UMAResource>(
      '/',
      resource.toJson()
    )

    if (data._id) {
      resource.setId(data._id)
    }

    return resource
  }

  async update(resource: Resource): Promise<Resource> {
    if (!resource.id) throw new Error(`Id is missing from resource`)

    await this.requestManager.put<any>(
      `/${resource.id}`,
      resource.toJson()
    )

    return resource
  }

  async delete(resource: Resource): Promise<void> {
    await this.requestManager.delete<any>(`/${resource.id}`)
  }

  async findById(id: string): Promise<Resource | null> {
    const { data } = await this.requestManager.get<Resource>(`/${id}`)

    return data
  }

  async findAll(params: ResourceQuery): Promise<Resource[] | any> {
    const { data } = await this.requestManager.get<string[]>(`/`, {
      params,
    })
    return Promise.all(data.map((id) => this.findById(id)))
  }
}
