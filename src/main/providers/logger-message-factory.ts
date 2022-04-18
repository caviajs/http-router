import chalk from 'chalk';
import { FactoryProvider } from '../types/provider';
import { Token } from '../types/token';
import { LoggerLevel } from './logger-level';

export const LOGGER_MESSAGE_FACTORY: Token<LoggerMessageFactory> = Symbol('LOGGER_MESSAGE_FACTORY');

export const LoggerMessageFactoryProvider: FactoryProvider<LoggerMessageFactory> = {
  provide: LOGGER_MESSAGE_FACTORY,
  useFactory: (): LoggerMessageFactory => {
    return ({ context, level, message }): string => {
      let color: chalk.Chalk;

      switch (level) {
        case LoggerLevel.FATAL:
          color = chalk.red;
          break;
        case LoggerLevel.ERROR:
          color = chalk.redBright;
          break;
        case LoggerLevel.WARN:
          color = chalk.yellowBright;
          break;
        case LoggerLevel.INFO:
          color = chalk.blueBright;
          break;
        case LoggerLevel.DEBUG:
          color = chalk.magentaBright;
          break;
        case LoggerLevel.TRACE:
          color = chalk.green;
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
        output += ` ${ chalk.yellow(`[${ context }]`) }`;
      }

      output += ` ${ color(`- ${ message }`) }\n`;

      return output;
    };
  },
};

export interface LoggerMessageFactory {
  (payload: { context?: string; level: LoggerLevel; message: string; }): string;
}
