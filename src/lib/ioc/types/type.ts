export interface Type<T = any> {
  new(...args: any): T;
}
