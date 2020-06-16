import { UMAScopeOptions } from '../interfaces';

export class UMAScope {
  private readonly options: UMAScopeOptions;

  constructor(opts: UMAScopeOptions) {
    this.options = opts;
  }

  isEqual(rhs: UMAScope) {
    return this.toJson().name === rhs.toJson().name;
  }

  toJson() {
    return this.options;
  }
}
