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

http.ServerResponse.prototype.setCookie = setCookie;

function setCookie(this: Response, name: string, value: string, options?: http.SetCookieOptions): void {
  let setCookie = this.getHeader('Set-Cookie') || [];

  if (typeof setCookie === 'number') {
    setCookie = [setCookie.toString()];
  }

  if (typeof setCookie === 'string') {
    setCookie = [setCookie];
  }

  setCookie.push(serializeCookie(name, value, options));

  this.setHeader('Set-Cookie', setCookie);
}
