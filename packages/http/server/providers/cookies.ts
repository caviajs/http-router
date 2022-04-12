import { Injectable } from '@caviajs/core';
import { Request } from '../types/request';

@Injectable()
export class Cookies {
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cookie
  public parseCookies(request: Request): Record<string, string | string[]> {
    return Object
      .values((request.headers.cookie || '').split('; '))
      // skip things that don't look like key=value
      .filter((cookie: string) => cookie.includes('='))
      .reduce((prev, cookie: string) => {
        const [key, value] = cookie.split('=');

        return { ...prev, [key.trim()]: tryDecode(value.trim()) };
      }, {});
  }

  public setCookie(): any {
    // todo
  }

  public removeCookie(): any {
    // todo
  }
}

function tryDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch (error) {
    return value;
  }
}
