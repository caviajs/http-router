import { parse as qsParse } from 'qs';
import { parse as urlParse } from 'url';
import { Injectable } from '../decorators/injectable';

@Injectable()
export class Url {
  public query(url: string): Record<string, string | string[]> {
    return qsParse(urlParse(url || '').query) as Record<string, string | string[]>;
  }
}
