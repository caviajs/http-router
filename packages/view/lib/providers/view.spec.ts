import { Edge } from 'edge.js';
import { View } from './view';

describe('View', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should mount during initialization', () => {
    const edgeMountSpy = jest
      .spyOn(Edge.prototype, 'mount');
    const viewDirectoryPath: string = 'resources/views';

    new View(viewDirectoryPath);

    expect(edgeMountSpy).toHaveBeenNthCalledWith(1, viewDirectoryPath);
  });

  describe('global', () => {
    it('should set global', async () => {
      const edgeGlobalSpy = jest
        .spyOn(Edge.prototype, 'global');

      const view = new View('resources');
      const name: string = 'foo';
      const value: any = 'bar';

      expect(edgeGlobalSpy).toHaveBeenCalledTimes(0);
      await view.global(name, value);
      expect(edgeGlobalSpy).toHaveBeenNthCalledWith(1, name, value);
    });
  });

  describe('registerTemplate', () => {
    it('should register the template correctly', async () => {
      const edgeRegisterTemplateSpy = jest
        .spyOn(Edge.prototype, 'registerTemplate');

      const view = new View('resources');
      const templatePath: string = 'button';
      const template: any = '<button>Popcorn!</button>';

      expect(edgeRegisterTemplateSpy).toHaveBeenCalledTimes(0);
      await view.registerTemplate(templatePath, template);
      expect(edgeRegisterTemplateSpy).toHaveBeenNthCalledWith(1, templatePath, { template });
    });
  });

  describe('removeTemplate', () => {
    it('should remove the template correctly', async () => {
      const edgeRemoveTemplateSpy = jest
        .spyOn(Edge.prototype, 'removeTemplate');

      const view = new View('resources');
      const templatePath: string = 'button';

      expect(edgeRemoveTemplateSpy).toHaveBeenCalledTimes(0);
      await view.removeTemplate(templatePath);
      expect(edgeRemoveTemplateSpy).toHaveBeenNthCalledWith(1, templatePath);
    });
  });

  describe('render', () => {
    it('should return rendered template', async () => {
      const edgeRenderSpy = jest
        .spyOn(Edge.prototype, 'render')
        .mockImplementation(async (templatePath: string) => templatePath);

      const view = new View('resources');
      const templatePath: string = 'welcome';
      const state: any = { greeting: 'Hello world' };

      expect(edgeRenderSpy).toHaveBeenCalledTimes(0);
      expect(await view.render(templatePath, state)).toEqual(templatePath);
      expect(edgeRenderSpy).toHaveBeenNthCalledWith(1, templatePath, state);
    });
  });
});
