import { Injectable } from '../decorators/injectable';
import { OnApplicationBoot } from '../types/hooks';
import { Body } from './body';
import { Parser } from '../types/parser';
import { Injector } from '../injector';

@Injectable()
export class BodyExplorer implements OnApplicationBoot {
  constructor(
    protected readonly body: Body,
    protected readonly injector: Injector,
  ) {
  }

  public async onApplicationBoot(): Promise<void> {
    const parsers: Parser[] = await this
      .injector
      .filter(provider => typeof provider === 'function' && provider.prototype instanceof Parser);

    parsers
      .map((parser: Parser) => {
        this.body.addParser(parser);
      });
  }
}
