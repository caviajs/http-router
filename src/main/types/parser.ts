import http from 'http';

export abstract class Parser {
  public abstract readonly metadata: ParserMetadata;

  public abstract parse(buffer: Buffer, headers: http.IncomingHttpHeaders): any;
}

export interface ParserMetadata {
  mimeType: string;
}
