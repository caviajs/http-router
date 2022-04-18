import clc from 'cli-color';
import { FactoryProvider } from '../types/provider';
import { Token } from '../types/token';
import { LoggerLevel } from './logger-level';

export const LOGGER_MESSAGE_FACTORY: Token<LoggerMessageFactory> = Symbol('LOGGER_MESSAGE_FACTORY');

export const LoggerMessageFactoryProvider: FactoryProvider<LoggerMessageFactory> = {
  provide: LOGGER_MESSAGE_FACTORY,
  useFactory: (): LoggerMessageFactory => {
    return ({ context, level, message }): string => {
      let color: clc.Format;

      switch (level) {
        case LoggerLevel.FATAL:
          color = clc.red;
          break;
        case LoggerLevel.ERROR:
          color = clc.redBright;
          break;
        case LoggerLevel.WARN:
          color = clc.yellowBright;
          break;
        case LoggerLevel.INFO:
          color = clc.blueBright;
          break;
        case LoggerLevel.DEBUG:
          color = clc.magentaBright;
          break;
        case LoggerLevel.TRACE:
          color = clc.green;
          break;
      }

      const datetime = new Date().toLocaleString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      });

      let output: string = `${ color(`[Cavia] ${ process.pid } -`) } ${ datetime }`;

      if (context) {
        output += ` ${ clc.yellow(`[${ context }]`) }`;
      }

      output += ` ${ color(`- ${ message }`) }\n`;

      return output;
    };
  },
};

export interface LoggerMessageFactory {
  (payload: { context?: string; level: LoggerLevel; message: string; }): string;
}
