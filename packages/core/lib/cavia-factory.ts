import { Logger } from '@caviajs/logger';
import { CaviaApplication } from './cavia-application';
import { Type } from './types/type';
import { APPLICATION_METADATA, ApplicationMetadata } from './decorators/application';
import { Token } from './types/token';
import { Provider } from './types/provider';
import { getProviderToken } from './utils/get-provider-token';
import { Injector } from './injector';
import { LOGGER_CONTEXT } from './constants';

export class CaviaFactory {
  public static async create(application: Type): Promise<CaviaApplication> {
    if (Reflect.hasMetadata(APPLICATION_METADATA, application) === false) {
      throw new Error(`The '${ application?.name }' should be annotated as an application`);
    }

    const injector = await Injector.create([...this.getApplicationProviders(application).values()]);
    const logger: Logger = await injector.find(Logger);

    const caviaApplication: CaviaApplication = new CaviaApplication(injector);

    logger?.trace('Starting application...', LOGGER_CONTEXT);

    await caviaApplication.boot();

    return caviaApplication;
  }

  protected static getApplicationProviders(application: Type): Map<Token, Provider> {
    const applicationMetadata: ApplicationMetadata = Reflect.getMetadata(APPLICATION_METADATA, application);

    const providers: Map<Token, Provider> = new Map();

    for (const pkg of [...applicationMetadata?.packages || []]) {
      for (const provider of pkg.providers || []) {
        providers.set(getProviderToken(provider), provider);
      }
    }

    // todo { provide: APPLICATION_REF, useExisting: application } ?
    for (const provider of [...applicationMetadata?.providers || [], application]) {
      providers.set(getProviderToken(provider), provider);
    }

    return providers;
  }
}
