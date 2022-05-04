import { Injectable } from '../decorators/injectable';
import { OnApplicationBoot } from '../types/hooks';
import { Body } from './body';
import { Parser } from '../types/parser';
import { Container } from '../container';

@Injectable()
export class BodyExplorer implements OnApplicationBoot {
  constructor(
    protected readonly body: Body,
    protected readonly container: Container,
  ) {
  }

  public async onApplicationBoot(): Promise<void> {
    const parsers: Parser[] = await this
      .container
      .filter(provider => typeof provider === 'function' && provider.prototype instanceof Parser);

    parsers
      .map((parser: Parser) => {
        this.body.addParser(parser);
      });
  }
}
