import { Container } from '../container';
import { Injectable } from '../decorators/injectable';
import { Parser, ParserMetadata } from '../types/parser';
import { BodyExplorer } from './body-explorer';
import { Body } from './body';
import { LoggerLevel } from './logger-level';
import { Logger } from './logger';

@Injectable()
class FooParser extends Parser {
  public readonly metadata: ParserMetadata = {
    mimeType: 'text/plain',
  };

  public parse(): Promise<void> {
    return Promise.resolve(undefined);
  }
}

@Injectable()
class BarParser extends Parser {
  public readonly metadata: ParserMetadata = {
    mimeType: 'text/plain',
  };

  public parse(): Promise<void> {
    return Promise.resolve(undefined);
  }
}

@Injectable()
class NoParser {
}

describe('BodyExplorer', () => {
  let body: Body;
  let bodyExplorer: BodyExplorer;
  let fooParser: FooParser;
  let barParser: BarParser;
  let noParser: NoParser;

  beforeEach(async () => {
    const container: Container = await Container.create([FooParser, BarParser, NoParser]);

    body = new Body(new Logger(LoggerLevel.OFF, () => ''));
    bodyExplorer = new BodyExplorer(body, container);
    fooParser = await container.find(FooParser);
    barParser = await container.find(BarParser);
    noParser = await container.find(NoParser);

    jest.spyOn(body, 'addParser').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onApplicationBoot', () => {
    it('should add endpoints', async () => {
      expect(body.addParser).toHaveBeenCalledTimes(0);

      await bodyExplorer.onApplicationBoot();

      expect(body.addParser).toHaveBeenCalledTimes(2);
      expect(body.addParser).toHaveBeenCalledWith(fooParser);
      expect(body.addParser).toHaveBeenCalledWith(barParser);
    });
  });
});
