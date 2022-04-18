import { Readable } from 'stream';
import * as fsExtra from 'fs-extra';
import * as fs from 'fs';
import { Injectable } from '../decorators/injectable';

@Injectable()
export class Storage {
  public async get(path: string): Promise<Buffer | null> {
    try {
      return await fsExtra.readFile(path);
    } catch (e) {
      return null;
    }
  }

  public getStream(path: string): Readable | null {
    try {
      return fsExtra.createReadStream(path);
    } catch (e) {
      return null;
    }
  }

  public async getStats(path: string): Promise<GetStatsResult | null> {
    try {
      return await fsExtra.stat(path);
    } catch (e) {
      return null;
    }
  }

  public async put(path: string, contents: Buffer | string): Promise<boolean> {
    try {
      await fsExtra.outputFile(path, contents);

      return true;
    } catch (error) {
      return false;
    }
  }

  public putStream(path: string, contents: Readable): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        return contents
          .pipe(fsExtra.createWriteStream(path))
          .on('error', () => resolve(false))
          .on('finish', () => resolve(true));
      } catch (e) {
        return resolve(false);
      }
    });
  }

  public async delete(path: string): Promise<boolean> {
    try {
      await fsExtra.remove(path);

      return true;
    } catch (error) {
      return false;
    }
  }

  public async copy(source: string, destination: string): Promise<boolean> {
    try {
      await fsExtra.copy(source, destination, { overwrite: true });

      return true;
    } catch (error) {
      return false;
    }
  }

  public async move(source: string, destination: string): Promise<boolean> {
    try {
      await fsExtra.move(source, destination, { overwrite: true });

      return true;
    } catch (error) {
      return false;
    }
  }
}

export type GetStatsResult = fs.Stats;
