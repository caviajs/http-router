import { Injectable } from '@caviajs/core';
import { parse as qsParse } from 'qs';
import { parse as urlParse } from 'url';

@Injectable()
export class Url {
  public parseQuery(url: string): Record<string, string | string[]> {
    return qsParse(urlParse(url || '').query) as Record<string, string | string[]>;
  }
}
