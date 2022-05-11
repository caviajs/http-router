import { Edge } from 'edge.js';
import path from 'path';

export class View {
  protected static readonly edge: Edge = new Edge({ cache: false })
    .mount(path.join(process.cwd()));

  public static global(name: string, value: any) {
    this.edge.global(name, value);
  }

  public static registerTemplate(templatePath: string, template: string): void {
    this.edge.registerTemplate(templatePath, { template });
  }

  public static removeTemplate(templatePath: string): void {
    this.edge.removeTemplate(templatePath);
  }

  public static async render(templatePath: string, state?: any): Promise<string> {
    return await this.edge.render(templatePath, state);
  }
}
