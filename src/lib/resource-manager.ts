import { UMAResourceOptions } from '../interfaces'
import { KeycloakAdminService } from '../service'
import { UMAResource } from '../uma/resource'
import { RequestManager } from './request-manager'

export class ResourceManager {
  private readonly requestManager: RequestManager

  constructor(client: KeycloakAdminService) {
    this.requestManager = new RequestManager(client)
  }

  async create(resource: UMAResource): Promise<UMAResource> {
    const { data } = await this.requestManager.post<UMAResourceOptions>(
      '/authz/protection/resource_set',
      resource.toJson()
    )

    if (data.id) {
      resource.setId(data.id)
    }

    return resource
  }

  async update(resource: UMAResource): Promise<UMAResource> {
    const { id } = resource.toJson()

    if (!id) throw new Error(`Id is missing from resource`)

    await this.requestManager.put<any>(`/authz/protection/resource_set/${id}`, resource.toJson())
    return resource
  }

  async delete(resource: UMAResource): Promise<void> {
    const { id } = resource.toJson()

    if (!id) throw new Error(`Id is missing from resource`)

    await this.requestManager.delete<any>(`/authz/protection/resource_set/${id}`)
  }

  async findById(id: string): Promise<UMAResource | null> {
    const { data } = await this.requestManager.get<UMAResourceOptions>(
      `/authz/protection/resource_set/${id}`
    )

    return data && new UMAResource(data)
  }

  async findAll(deep = false): Promise<UMAResource[] | any> {
    const { data } = await this.requestManager.get<string[]>(`/authz/protection/resource_set`)

    if (deep) {
      return data
    }

    return Promise.all(data.map((id) => this.findById(id)))
  }
}
