import { Storage } from '../../index';
import * as fs from 'fs';
import * as fsExtra from 'fs-extra';
import { Readable, Writable } from 'stream';

jest.mock('fs');
jest.mock('fs-extra', () => ({
  readFile: jest.fn().mockImplementation(path => {
    if (path === 'foo.txt') {
      return Promise.resolve(Buffer.of(1));
    } else {
      throw Error();
    }
  }),
  createReadStream: jest.fn().mockImplementation(path => {
    if (path === 'foo.txt') {
      return new Readable();
    } else {
      throw Error();
    }
  }),
  stat: jest.fn().mockImplementation(path => {
    if (path === 'foo.txt') {
      return {};
    } else {
      throw Error();
    }
  }),
  outputFile: jest.fn().mockImplementation(path => {
    if (path === 'foo.txt') {
      return {};
    } else {
      throw Error();
    }
  }),
  createWriteStream: jest.fn().mockImplementation(path => {
    if (path === 'foo.txt') {
      return new Writable({
        write(chunk, encoding, callback) {
          callback();
        },
      });
    } else {
      throw Error();
    }
  }),
  remove: jest.fn().mockImplementation(path => {
    if (path === 'foo.txt') {
      return;
    } else {
      throw Error();
    }
  }),
  copy: jest.fn().mockImplementation((source, destination) => {
    if (source === 'foo.txt' && destination === 'foo-2.txt') {
      return;
    } else {
      throw Error();
    }
  }),
  move: jest.fn().mockImplementation((source, destination) => {
    if (source === 'foo.txt' && destination === 'foo-2.txt') {
      return;
    } else {
      throw Error();
    }
  }),
}));

describe('Storage', () => {
  let storage: Storage;

  beforeEach(() => {
    storage = new Storage();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return buffer if the file exists', async () => {
      const path: string = 'foo.txt';

      expect(await storage.get(path)).toEqual(Buffer.of(1));
      expect(fsExtra.readFile).toHaveBeenNthCalledWith(1, path);
    });

    it('should return null if the file does not exist', async () => {
      const path: string = 'bar.txt';

      expect(await storage.get(path)).toBeNull();
      expect(fsExtra.readFile).toHaveBeenNthCalledWith(1, path);
    });
  });

  describe('getStream', () => {
    it('should return stream if the file exists', async () => {
      const path: string = 'foo.txt';

      expect(await storage.getStream(path)).toEqual(new Readable());
      expect(fsExtra.createReadStream).toHaveBeenNthCalledWith(1, path);
    });

    it('should return null if the file does not exist', async () => {
      const path: string = 'bar.txt';

      expect(await storage.getStream(path)).toBeNull();
      expect(fsExtra.createReadStream).toHaveBeenNthCalledWith(1, path);
    });
  });

  describe('getStats', () => {
    it('should return metadata if the file exists', async () => {
      const path: string = 'foo.txt';

      expect(await storage.getStats(path)).not.toBeNull();
      expect(fsExtra.stat).toHaveBeenNthCalledWith(1, path);
    });

    it('should return null if the file does not exist', async () => {
      const path: string = 'bar.txt';

      expect(await storage.getStats(path)).toBeNull();
      expect(fsExtra.stat).toHaveBeenNthCalledWith(1, path);
    });
  });

  describe('put', () => {
    it('should return true if the file was saved', async () => {
      const path: string = 'foo.txt';
      const contents: Buffer = Buffer.of(1);

      expect(await storage.put(path, contents)).toBe(true);
      expect(fsExtra.outputFile).toHaveBeenNthCalledWith(1, path, contents);
    });

    it('should return false if the file was not saved', async () => {
      const path: string = 'bar.txt';
      const contents: Buffer = Buffer.of(1);

      expect(await storage.put(path, contents)).toBe(false);
      expect(fsExtra.outputFile).toHaveBeenNthCalledWith(1, path, contents);
    });
  });

  describe('putStream', () => {
    it('should return true if the file was saved', async () => {
      const path: string = 'foo.txt';
      const contents: Readable = new Readable({
        read() {
          this.push('Hello World');
          this.push(null);
        },
      });

      expect(await storage.putStream(path, contents)).toBe(true);
      expect(fsExtra.createWriteStream).toHaveBeenNthCalledWith(1, path);
    });

    it('should return false if the file was not saved', async () => {
      const path: string = 'bar.txt';
      const contents: Readable = new Readable();

      expect(await storage.putStream(path, contents)).toBe(false);
      expect(fsExtra.createWriteStream).toHaveBeenNthCalledWith(1, path);
    });
  });

  describe('delete', () => {
    it('should return true if the file was deleted', async () => {
      const path: string = 'foo.txt';

      expect(await storage.delete(path)).toBe(true);
      expect(fsExtra.remove).toHaveBeenNthCalledWith(1, path);
    });

    it('should return false if the file was not deleted', async () => {
      const path: string = 'bar.txt';

      expect(await storage.delete(path)).toBe(false);
      expect(fsExtra.remove).toHaveBeenNthCalledWith(1, path);
    });
  });

  describe('copy', () => {
    it('should return true if the file was copied', async () => {
      const source: string = 'foo.txt';
      const destination: string = 'foo-2.txt';

      expect(await storage.copy(source, destination)).toBe(true);
      expect(fsExtra.copy).toHaveBeenNthCalledWith(1, source, destination, { overwrite: true });
    });

    it('should return false if the file was not copied', async () => {
      const source: string = 'bar.txt';
      const destination: string = 'bar-2.txt';

      expect(await storage.copy(source, destination)).toBe(false);
      expect(fsExtra.copy).toHaveBeenNthCalledWith(1, source, destination, { overwrite: true });
    });
  });

  describe('move', () => {
    it('should return true if the file was moved', async () => {
      const source: string = 'foo.txt';
      const destination: string = 'foo-2.txt';

      expect(await storage.move(source, destination)).toBe(true);
      expect(fsExtra.move).toHaveBeenNthCalledWith(1, source, destination, { overwrite: true });
    });

    it('should return false if the file was not moved', async () => {
      const source: string = 'bar.txt';
      const destination: string = 'bar-2.txt';

      expect(await storage.move(source, destination)).toBe(false);
      expect(fsExtra.move).toHaveBeenNthCalledWith(1, source, destination, { overwrite: true });
    });
  });
});
