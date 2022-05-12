import * as http from 'http';

declare module 'http' {
  export interface SetCookieOptions {
    domain?: string;
    expires?: Date;
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    sameSite?: 'Lax' | 'Strict' | 'None';
    secure?: boolean;
  }

  export interface ServerResponse {
    setCookie(name: string, value: string, options?: SetCookieOptions): void;
  }
}

http.ServerResponse.prototype.setCookie = function (this: http.ServerResponse, name: string, value: string, options?: http.SetCookieOptions): void {
  let setCookieHeader = this.getHeader('Set-Cookie') || [];

  if (typeof setCookieHeader === 'number') {
    setCookieHeader = [setCookieHeader.toString()];
  }

  if (typeof setCookieHeader === 'string') {
    setCookieHeader = [setCookieHeader];
  }

  setCookieHeader.push(serializeCookie(name, value, options));

  this.setHeader('Set-Cookie', setCookieHeader);
};

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
function serializeCookie(name: string, value: string, options?: http.SetCookieOptions): string {
  let cookie = `${ name }=${ encodeURIComponent(value) }`;

  if (options?.domain) {
    cookie += '; Domain=' + options.domain;
  }

  if (options?.expires) {
    cookie += '; Expires=' + options.expires.toUTCString();
  }

  if (options?.httpOnly) {
    cookie += '; HttpOnly';
  }

  if (options?.maxAge !== undefined) {
    cookie += '; Max-Age=' + Math.floor(options.maxAge);
  }

  if (options?.path) {
    cookie += '; Path=' + options.path;
  }

  if (options?.sameSite) {
    switch (options.sameSite) {
      case 'Lax':
        cookie += '; SameSite=Lax';
        break;
      case 'Strict':
        cookie += '; SameSite=Strict';
        break;
      case 'None':
        cookie += '; SameSite=None';
        break;
    }
  }

  if (options?.secure) {
    cookie += '; Secure';
  }

  return cookie;
}
