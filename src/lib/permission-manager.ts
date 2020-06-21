import { KeycloakAdminService } from '../service'
import { RequestManager } from './request-manager'
import { TicketForm, TicketDecisionResponse, TicketPermissionResponse } from '../@types/uma.ticket'

export class PermissionManager {
  private readonly requestManager: RequestManager

  constructor(client: KeycloakAdminService) {
    this.requestManager = new RequestManager(client)
  }

  async requestTicket(
    ticket: TicketForm
  ): Promise<TicketDecisionResponse | TicketPermissionResponse[]> {
    if (!ticket.grant_type) {
      ticket.grant_type = 'urn:ietf:params:oauth:grant-type:uma-ticket'
    }

    const permission =
      ticket.resourceId && ticket.scope ? `${ticket.resourceId}#${ticket.scope}` : undefined

    const { data } = await this.requestManager.post<
      TicketDecisionResponse | TicketPermissionResponse[]
    >('/protocol/openid-connect/token', {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${ticket.token}`,
      },
      data: {
        grant_type: ticket.grant_type,
        audience: ticket.audience,
        permission,
        response_mode: ticket.response_mode || 'decision',
      },
    })

    return data
  }
}
