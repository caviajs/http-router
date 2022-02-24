import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { Env } from '../../../src/public-api';

jest.mock('dotenv');
jest.mock('fs');

describe('Env', () => {
  const envPath: string = path.join(process.cwd(), '.env');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not load the contents of the .env file if it does not exist', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    new Env(envPath);

    expect(fs.readFileSync).not.toHaveBeenCalled();
    expect(dotenv.parse).not.toHaveBeenCalled();
  });

  it('should load the contents of the .env file if it exists', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);

    const buffer: Buffer = Buffer.from('FOO=bar');

    jest.spyOn(fs, 'readFileSync').mockReturnValue(buffer);
    jest.spyOn(dotenv, 'parse').mockReturnValue({ FOO: 'bar' });

    const env: Env = new Env(envPath);

    expect(fs.readFileSync).toHaveBeenNthCalledWith(1, envPath);
    expect(dotenv.parse).toHaveBeenNthCalledWith(1, buffer);
    expect(env.get('FOO')).toEqual('bar');
  });

  it('should return the correct property if there is a conflict between process.env and the contents of the .env file', () => {
    process.env['FOO'] = '1';

    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(dotenv, 'parse').mockReturnValue({ FOO: '2', BAR: '2' });

    const env: Env = new Env(envPath);

    expect(env.get('FOO')).toEqual('2');
    expect(env.get('BAR')).toEqual('2');

    delete process.env['FOO'];
  });

  it('should return a default value if the environment does not exist', () => {
    const env: Env = new Env(envPath);

    expect(env.get('CAVIA', 'popcorn')).toEqual('popcorn');
  });
});
