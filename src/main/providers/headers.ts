import { Injectable } from '../decorators/injectable';

@Injectable()
export class Headers {
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
  public contentType = new class {
    public getMime(header: string): string | undefined {
      const media = header?.split(';')[0];

      if (media === '') {
        return;
      }

      return media?.trim();
    }

    public getParameter(header: string, parameter: string): string | undefined {
      return header?.split(';').find(it => it.includes(parameter))?.split('=')[1]?.trim();
    }
  };
}
