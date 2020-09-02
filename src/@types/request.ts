import { Resource } from '../uma/resource'

export interface PriviledgedRequest extends Request {
  accessToken?: string
  resource?: Resource | null
  resources?: (Resource | null)[]
  scopes?: string[]
}
