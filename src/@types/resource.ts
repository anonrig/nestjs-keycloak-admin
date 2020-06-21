export interface ResourceOwner {
  id: string
}

export interface ResourceQuery {
  scope?: string
  type?: string
  uri?: string
  name?: string
}
