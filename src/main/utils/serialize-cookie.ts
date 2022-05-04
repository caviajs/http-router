// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
export function serializeCookie(name: string, value: string, options?: SerializeCookieOptions): string {
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

export interface SerializeCookieOptions {
  domain?: string;
  expires?: Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: 'Lax' | 'Strict' | 'None';
  secure?: boolean;
}
