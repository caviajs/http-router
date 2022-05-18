import { HttpRouter } from '../src';
import { tap } from 'rxjs';
import http from 'http';
import supertest from 'supertest';

function wait(ms: number, cb: () => void): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      cb();
      resolve();
    }, ms);
  });
}

describe('Interceptors', () => {
  describe('Obsługa odpowiedzi z handlera w interceptorze', () => {
  });

  describe('Nadpisanie odpowiedzi z handlera w interceptorze', () => {
  });

  describe('Obsługa/Nadpisanie błędu z handlera', () => {
  });
});
