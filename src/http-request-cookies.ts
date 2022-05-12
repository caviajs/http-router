import * as http from 'http';

declare module 'http' {
  export interface Cookies {
    readonly [key: string]: string | string[];
  }

  export interface IncomingMessage {
    readonly cookies: Cookies;
  }
}

const KEY: string = '_cookies';

Object.defineProperty(http.IncomingMessage.prototype, 'cookies', {
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cookie
  get: function (this: http.IncomingMessage): http.Cookies {
    if (!this[KEY]) {
      this[KEY] = Object
        .values((this.headers.cookie || '').split('; '))
        // skip things that don't look like key=value
        .filter((cookie: string) => cookie.includes('='))
        .reduce((prev: http.Cookies, cookie: string) => {
          const [key, value] = cookie.split('=');

          return { ...prev, [key.trim()]: tryDecode(value.trim()) };
        }, {});
    }

    return this[KEY];
  },
});

function tryDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch (error) {
    return value;
  }
}
