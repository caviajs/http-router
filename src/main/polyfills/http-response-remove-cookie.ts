import * as http from 'http';

import { Response } from '../types/response';

declare module 'http' {
  export interface ServerResponse {
    removeCookie(name: string): void;
  }
}

http.ServerResponse.prototype.removeCookie = function (this: Response, name: string): void {
  this.setCookie(name, '', { maxAge: 0, expires: new Date(0) });
};
