export class Env {
  public static get(name: keyof typeof process.env | string, defaultValue?: any): any {
    return process.env[name] || defaultValue;
  }
}
