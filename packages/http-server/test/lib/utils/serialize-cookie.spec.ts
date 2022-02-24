import { serializeCookie } from '../../../src/public-api';

describe('serializeCookie', () => {
  it('serialize', () => {
    expect(serializeCookie('foo', 'bar')).toBe('foo=bar');
    expect(serializeCookie('foo', 'bar baz')).toBe('foo=bar%20baz');
    expect(serializeCookie('foo', '')).toBe('foo=');

    // escape
    expect(serializeCookie('foo', '+ ')).toBe('foo=%2B%20');
  });

  it('serialize with domain', () => {
    expect(serializeCookie('foo', 'bar', { domain: 'example.com' })).toBe('foo=bar; Domain=example.com');
  });

  it('serialize with expires', () => {
    expect(serializeCookie('foo', 'bar', { expires: new Date(Date.UTC(2000, 11, 24, 10, 30, 59, 900)) })).toBe('foo=bar; Expires=Sun, 24 Dec 2000 10:30:59 GMT');
  });

  it('serialize with httpOnly', () => {
    expect(serializeCookie('foo', 'bar', { httpOnly: true })).toBe('foo=bar; HttpOnly');
    expect(serializeCookie('foo', 'bar', { httpOnly: false })).toBe('foo=bar');
  });

  it('serialize with maxAge', () => {
    expect(serializeCookie('foo', 'bar', { maxAge: 1000 })).toBe('foo=bar; Max-Age=1000');
    expect(serializeCookie('foo', 'bar', { maxAge: 0 })).toBe('foo=bar; Max-Age=0');
    expect(serializeCookie('foo', 'bar', { maxAge: 3.14 })).toBe('foo=bar; Max-Age=3');
  });

  it('serialize with path', () => {
    expect(serializeCookie('foo', 'bar', { path: '/' })).toBe('foo=bar; Path=/');
  });

  it('serialize with sameSite', () => {
    expect(serializeCookie('foo', 'bar', { sameSite: 'Strict' })).toBe('foo=bar; SameSite=Strict');
    expect(serializeCookie('foo', 'bar', { sameSite: 'Lax' })).toBe('foo=bar; SameSite=Lax');
    expect(serializeCookie('foo', 'bar', { sameSite: 'None' })).toBe('foo=bar; SameSite=None');
  });

  it('serialize with secure', () => {
    expect(serializeCookie('foo', 'bar', { secure: true })).toBe('foo=bar; Secure');
    expect(serializeCookie('foo', 'bar', { secure: false })).toBe('foo=bar');
  });

  it('serialize with multiple options', () => {
    const result = serializeCookie('foo', 'bar', {
      domain: 'example.com',
      expires: new Date(Date.UTC(2000, 11, 24, 10, 30, 59, 900)),
      httpOnly: true,
      maxAge: 1000,
      path: '/',
      sameSite: 'Strict',
      secure: true,
    });

    expect(result).toBe('foo=bar; Domain=example.com; Expires=Sun, 24 Dec 2000 10:30:59 GMT; HttpOnly; Max-Age=1000; Path=/; SameSite=Strict; Secure');
  });
});
