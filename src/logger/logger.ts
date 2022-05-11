import chalk from 'chalk';

// eslint-disable-next-line no-shadow
export enum LoggerLevel {
  OFF = 0,
  FATAL = 1,
  ERROR = 2,
  WARN = 3,
  INFO = 4,
  DEBUG = 5,
  TRACE = 6,
  ALL = 7,
}

export class Logger {
  public static level: LoggerLevel = LoggerLevel.ALL;

  public static debug(message: string, context?: string): void {
    if (LoggerLevel.DEBUG <= this.level) {
      process.stdout.write(this.compose({ context, level: LoggerLevel.DEBUG, message }));
    }
  }

  public static error(message: string, context?: string): void {
    if (LoggerLevel.ERROR <= this.level) {
      process.stdout.write(this.compose({ context, level: LoggerLevel.ERROR, message }));
    }
  }

  public static fatal(message: string, context?: string): void {
    if (LoggerLevel.FATAL <= this.level) {
      process.stdout.write(this.compose({ context, level: LoggerLevel.FATAL, message }));
    }
  }

  public static info(message: string, context?: string): void {
    if (LoggerLevel.INFO <= this.level) {
      process.stdout.write(this.compose({ context, level: LoggerLevel.INFO, message }));
    }
  }

  public static trace(message: string, context?: string): void {
    if (LoggerLevel.TRACE <= this.level) {
      process.stdout.write(this.compose({ context, level: LoggerLevel.TRACE, message }));
    }
  }

  public static warn(message: string, context?: string): void {
    if (LoggerLevel.WARN <= this.level) {
      process.stdout.write(this.compose({ context, level: LoggerLevel.WARN, message }));
    }
  }

  protected static compose({ context, level, message }: { context?: string; level: LoggerLevel; message: string; }): string {
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
  }
}

export interface LoggerMessageFactory {
  (payload: { context?: string; level: LoggerLevel; message: string; }): string;
}
