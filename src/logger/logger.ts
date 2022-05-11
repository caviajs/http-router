import { Color, white, redBright, red, yellow, green, blue, gray, cyan } from 'colorette';

// eslint-disable-next-line no-shadow
enum Level {
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
  protected static level: Level = Level[process.env.LOGGER_LEVEL || 'ALL'];

  public static debug(message: string, params?: { [name: string]: string }): void {
    if (Level.DEBUG <= this.level) {
      process.stdout.write(this.compose(Level.DEBUG, message, params));
    }
  }

  public static error(message: string, params?: { [name: string]: string }): void {
    if (Level.ERROR <= this.level) {
      process.stdout.write(this.compose(Level.ERROR, message, params));
    }
  }

  public static fatal(message: string, params?: { [name: string]: string }): void {
    if (Level.FATAL <= this.level) {
      process.stdout.write(this.compose(Level.FATAL, message, params));
    }
  }

  public static info(message: string, params?: { [name: string]: string }): void {
    if (Level.INFO <= this.level) {
      process.stdout.write(this.compose(Level.INFO, message, params));
    }
  }

  public static trace(message: string, params?: { [name: string]: string }): void {
    if (Level.TRACE <= this.level) {
      process.stdout.write(this.compose(Level.TRACE, message, params));
    }
  }

  public static warn(message: string, params?: { [name: string]: string }): void {
    if (Level.WARN <= this.level) {
      process.stdout.write(this.compose(Level.WARN, message, params));
    }
  }

  protected static compose(level: Level, message: string, params?: { [name: string]: string }): string {
    let color: Color;

    switch (level) {
      case Level.FATAL:
        color = redBright;
        break;
      case Level.ERROR:
        color = red;
        break;
      case Level.WARN:
        color = yellow;
        break;
      case Level.INFO:
        color = green;
        break;
      case Level.DEBUG:
        color = blue;
        break;
      case Level.TRACE:
        color = gray;
        break;
    }

    const datetime = new Date().toISOString();

    let output: string = `${ white(datetime) } ${ color(Level[level].padStart(5, ' ')) } ${ white(process.pid) }: ${ cyan(message) }`;

    if (params) {
      output += ` ${ white(Object.entries(params).map(([key, value]) => `${ key }=${ value }`).join(' ')) }`;
    }

    output += '\n';

    return output;
  }
}
