import * as http from 'http';

import { serializeCookie } from '../utils/serialize-cookie';
import { Response } from '../types/response';

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

http.ServerResponse.prototype.setCookie = function (this: Response, name: string, value: string, options?: http.SetCookieOptions): void {
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
