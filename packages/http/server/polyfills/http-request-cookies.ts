import * as http from 'http';

import { Request } from '../types/request';

declare module 'http' {
  export interface Cookies {
    readonly [key: string]: string | string[];
  }

  export interface IncomingMessage {
    readonly cookies: Cookies;
  }
}

Object.defineProperty(http.IncomingMessage.prototype, 'cookies', {
  get: cookies,
});

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cookie
function cookies(this: Request): http.Cookies {
  if (!this['_cookies']) {
    this['_cookies'] = Object
      .values((this.headers.cookie || '').split('; '))
      // skip things that don't look like key=value
      .filter((cookie: string) => cookie.includes('='))
      .reduce((prev: http.Cookies, cookie: string) => {
        const [key, value] = cookie.split('=');

        return { ...prev, [key.trim()]: tryDecode(value.trim()) };
      }, {});
  }

  return this['_cookies'];
}

function tryDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch (error) {
    return value;
  }
}