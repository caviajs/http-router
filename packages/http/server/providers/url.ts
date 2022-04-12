import { Injectable } from '@caviajs/core';
import { parse as qsParse } from 'qs';
import { parse as urlParse } from 'url';
import { match, MatchResult } from 'path-to-regexp';

@Injectable()
export class Url {
  public parseParams(url: string, pattern: string): Record<string, string> {
    return ((match(pattern)(urlParse(url).pathname) as MatchResult)?.params || {}) as Record<string, string>;
  }

  public parseQuery(url: string): Record<string, string | string[]> {
    return qsParse(urlParse(url || '').query) as Record<string, string | string[]>;
  }
}

