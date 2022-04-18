import { Injectable } from '../decorators/injectable';
import { isMatch } from 'matcher';

@Injectable()
export class EventEmitter {
  protected eventHandlers: EventHandler[] = [];

  public emit(event: string, data?: any): void {
    this
      .eventHandlers
      .filter(it => isMatch(event, it.event))
      .forEach(it => it.handler(data));
  }

  public listen(event: string, handler: Function): void {
    this.eventHandlers.push({ event, handler });
  }
}

export interface EventHandler {
  event: string;
  handler: Function;
}
