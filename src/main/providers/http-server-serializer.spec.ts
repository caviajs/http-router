import { HttpServerSerializer } from './http-server-serializer';
import { Response } from '../types/response';
import { Readable, Stream } from 'stream';

describe('HttpServerSerializer', () => {
  let response: Response;
  let httpServerSerializer: HttpServerSerializer;

  beforeEach(() => {
    response = <any>{
      end: jest.fn(),
      getHeader: jest.fn(),
      writeHead: jest.fn(),
    };
    httpServerSerializer = new HttpServerSerializer();

    jest.spyOn(response, 'end').mockImplementation(() => response);
    jest.spyOn(response, 'writeHead').mockImplementation(() => response);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should correctly serialize undefined', () => {
    expect(response.end).not.toHaveBeenCalled();
    expect(response.writeHead).not.toHaveBeenCalled();

    httpServerSerializer.serialize(response, undefined);

    expect(response.end).toHaveBeenNthCalledWith(1);
    expect(response.writeHead).toHaveBeenNthCalledWith(1, 204); // Inferred status code (204 No Content)
  });

  it('should correctly serialize undefined with predefined response properties', () => {
    response.statusCode = 402;

    expect(response.end).not.toHaveBeenCalled();
    expect(response.writeHead).not.toHaveBeenCalled();

    httpServerSerializer.serialize(response, undefined);

    expect(response.end).toHaveBeenNthCalledWith(1);
    expect(response.writeHead).toHaveBeenNthCalledWith(1, 402); // Overwritten status code
  });

  it('should correctly serialize Buffer', () => {
    const data: Buffer = Buffer.from('Hello World');

    expect(response.end).not.toHaveBeenCalled();
    expect(response.writeHead).not.toHaveBeenCalled();

    httpServerSerializer.serialize(response, data);

    expect(response.end).toHaveBeenNthCalledWith(1, data);
    expect(response.writeHead).toHaveBeenNthCalledWith(1, 200, { // Inferred status code (200 OK)
      'Content-Length': data.length, // Inferred Content-Length
      'Content-Type': 'application/octet-stream', // Inferred Content-Type
    });
  });

  it('should correctly serialize Buffer with predefined response properties', () => {
    const data: Buffer = Buffer.from('Hello World');

    jest.spyOn(response, 'getHeader').mockImplementation(() => 'Popcorn');

    response.statusCode = 402;

    expect(response.end).not.toHaveBeenCalled();
    expect(response.writeHead).not.toHaveBeenCalled();

    httpServerSerializer.serialize(response, data);

    expect(response.end).toHaveBeenNthCalledWith(1, data);
    expect(response.writeHead).toHaveBeenNthCalledWith(1, 402, { // Overwritten status code
      'Content-Length': 'Popcorn', // Overwritten Content-Length
      'Content-Type': 'Popcorn', // Overwritten Content-Type
    });
  });

  it('should correctly serialize Stream', () => {
    const data: Stream = Readable.from('Hello World');

    jest.spyOn(data, 'pipe').mockImplementation(jest.fn());

    expect(data.pipe).not.toHaveBeenCalled();
    expect(response.end).not.toHaveBeenCalled();
    expect(response.writeHead).not.toHaveBeenCalled();

    httpServerSerializer.serialize(response, data);

    expect(data.pipe).toHaveBeenNthCalledWith(1, response);
    expect(response.end).not.toHaveBeenCalled();
    expect(response.writeHead).toHaveBeenNthCalledWith(1, 200, { // Inferred status code (200 OK)
      'Content-Type': 'application/octet-stream', // Inferred Content-Type
    });
  });

  it('should correctly serialize Stream with predefined response properties', () => {
    const data: Stream = Readable.from('Hello World');

    jest.spyOn(data, 'pipe').mockImplementation(jest.fn());
    jest.spyOn(response, 'getHeader').mockImplementation(() => 'Popcorn');

    response.statusCode = 402;

    expect(data.pipe).not.toHaveBeenCalled();
    expect(response.end).not.toHaveBeenCalled();
    expect(response.writeHead).not.toHaveBeenCalled();

    httpServerSerializer.serialize(response, data);

    expect(data.pipe).toHaveBeenNthCalledWith(1, response);
    expect(response.end).not.toHaveBeenCalled();
    expect(response.writeHead).toHaveBeenNthCalledWith(1, 402, { // Overwritten status code
      'Content-Type': 'Popcorn', // Overwritten Content-Type
    });
  });

  it('should correctly serialize String', () => {
    const data: string = 'Hello World';

    expect(response.end).not.toHaveBeenCalled();
    expect(response.writeHead).not.toHaveBeenCalled();

    httpServerSerializer.serialize(response, data);

    expect(response.end).toHaveBeenNthCalledWith(1, data);
    expect(response.writeHead).toHaveBeenNthCalledWith(1, 200, { // Inferred status code (200 OK)
      'Content-Length': Buffer.byteLength(data), // Inferred Content-Length
      'Content-Type': 'text/plain', // Inferred Content-Type
    });
  });

  it('should correctly serialize String with predefined response properties', () => {
    const data: string = 'Hello World';

    jest.spyOn(response, 'getHeader').mockImplementation(() => 'Popcorn');

    response.statusCode = 402;

    expect(response.end).not.toHaveBeenCalled();
    expect(response.writeHead).not.toHaveBeenCalled();

    httpServerSerializer.serialize(response, data);

    expect(response.end).toHaveBeenNthCalledWith(1, data);
    expect(response.writeHead).toHaveBeenNthCalledWith(1, 402, { // Overwritten status code
      'Content-Length': 'Popcorn', // Overwritten Content-Length
      'Content-Type': 'Popcorn', // Overwritten Content-Type
    });
  });

  it('should correctly serialize JSON', () => {
    // JSON (true, false, number, null, array, object) but without string
    for (const data of [true, false, 1245, null, [1, 2, 4, 5], { foo: 'bar' }]) {
      expect(response.end).not.toHaveBeenCalled();
      expect(response.writeHead).not.toHaveBeenCalled();

      httpServerSerializer.serialize(response, data);

      expect(response.end).toHaveBeenNthCalledWith(1, JSON.stringify(data));
      expect(response.writeHead).toHaveBeenNthCalledWith(1, 200, { // Inferred status code (200 OK)
        'Content-Length': Buffer.byteLength(JSON.stringify(data)), // Inferred Content-Length
        'Content-Type': 'application/json; charset=utf-8', // Inferred Content-Type
      });

      jest.clearAllMocks();
    }
  });

  it('should correctly serialize JSON with predefined response properties', () => {
    // JSON (true, false, number, null, array, object) but without string
    for (const data of [true, false, 1245, null, [1, 2, 4, 5], { foo: 'bar' }]) {
      jest.spyOn(response, 'getHeader').mockImplementation(() => 'Popcorn');

      response.statusCode = 402;

      expect(response.end).not.toHaveBeenCalled();
      expect(response.writeHead).not.toHaveBeenCalled();

      httpServerSerializer.serialize(response, data);

      expect(response.end).toHaveBeenNthCalledWith(1, JSON.stringify(data));
      expect(response.writeHead).toHaveBeenNthCalledWith(1, 402, { // Overwritten status code
        'Content-Length': 'Popcorn', // Overwritten Content-Length
        'Content-Type': 'Popcorn', // Overwritten Content-Type
      });

      jest.clearAllMocks();
    }
  });
});
