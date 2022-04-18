import { Package } from '../runtime/types/package';

export class QueuePackage {
  public static declareQueue(name: string): Package {
    return {
      providers: [],
    };
  }
}
