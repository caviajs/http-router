import { Injectable } from '../decorators/injectable';
import { Inject } from '../decorators/inject';
import { LOGGER_LEVEL, LoggerLevel } from './logger-level';
import { LOGGER_MESSAGE_FACTORY, LoggerMessageFactory } from './logger-message-factory';

@Injectable()
export class Logger {
  constructor(
    @Inject(LOGGER_LEVEL) protected readonly loggerLevel: LoggerLevel,
    @Inject(LOGGER_MESSAGE_FACTORY) protected readonly loggerMessageFactory: LoggerMessageFactory,
  ) {
  }

  public debug(message: string, context?: string): void {
    if (LoggerLevel.DEBUG <= this.loggerLevel) {
      process.stdout.write(this.loggerMessageFactory({ message, context, level: LoggerLevel.DEBUG }));
    }
  }

  public error(message: string, context?: string): void {
    if (LoggerLevel.ERROR <= this.loggerLevel) {
      process.stdout.write(this.loggerMessageFactory({ message, context, level: LoggerLevel.ERROR }));
    }
  }

  public fatal(message: string, context?: string): void {
    if (LoggerLevel.FATAL <= this.loggerLevel) {
      process.stdout.write(this.loggerMessageFactory({ message, context, level: LoggerLevel.FATAL }));
    }
  }

  public info(message: string, context?: string): void {
    if (LoggerLevel.INFO <= this.loggerLevel) {
      process.stdout.write(this.loggerMessageFactory({ message, context, level: LoggerLevel.INFO }));
    }
  }

  public trace(message: string, context?: string): void {
    if (LoggerLevel.TRACE <= this.loggerLevel) {
      process.stdout.write(this.loggerMessageFactory({ message, context, level: LoggerLevel.TRACE }));
    }
  }

  public warn(message: string, context?: string): void {
    if (LoggerLevel.WARN <= this.loggerLevel) {
      process.stdout.write(this.loggerMessageFactory({ message, context, level: LoggerLevel.WARN }));
    }
  }
}
