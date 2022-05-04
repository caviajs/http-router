import * as http from 'http';
import { parse as qsParse } from 'qs';
import { parse as urlParse } from 'url';

import { Request } from '../types/request';

declare module 'http' {
  export interface Query {
    readonly [key: string]: string | string[];
  }

  export interface IncomingMessage {
    readonly query: Query;
  }
}

Object.defineProperty(http.IncomingMessage.prototype, 'query', {
  get: function (this: Request): http.Query {
    if (!this['_query']) {
      this['_query'] = qsParse(urlParse(this.url || '').query) as http.Query;
    }

    return this['_query'];
  },
});
