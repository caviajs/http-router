import { Edge } from 'edge.js';
import { Inject } from '../decorators/inject';
import { Injectable } from '../decorators/injectable';
import { VIEW_DIRECTORY_PATH, ViewDirectoryPath } from './view-directory-path';

@Injectable()
export class View {
  protected readonly edge: Edge = new Edge({ cache: false });

  constructor(
    @Inject(VIEW_DIRECTORY_PATH) protected readonly viewDirectoryPath: ViewDirectoryPath,
  ) {
    this.edge.mount(viewDirectoryPath);
  }

  public global(name: string, value: any) {
    this.edge.global(name, value);
  }

  public registerTemplate(templatePath: string, template: string): void {
    this.edge.registerTemplate(templatePath, { template });
  }

  public removeTemplate(templatePath: string): void {
    this.edge.removeTemplate(templatePath);
  }

  public async render(templatePath: string, state?: any): Promise<string> {
    return await this.edge.render(templatePath, state);
  }
}
