import { UMAScopeOptions } from '../interfaces'

export class UMAScope {
  private readonly options: UMAScopeOptions

  constructor(opts: UMAScopeOptions) {
    this.options = opts
  }

  isEqual(rhs: UMAScope): boolean {
    return this.toJson().name === rhs.toJson().name
  }

  toJson(): UMAScopeOptions {
    return this.options
  }
}
