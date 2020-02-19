import { RootLogger } from '@elunic/logger';
import { ModuleMetadata } from '@nestjs/common/interfaces';

export const LOGGER_MODULE_OPTIONS = Symbol('LOGGER_MODULE_OPTIONS');

export interface LoggerModuleOptions {
  logger: RootLogger;
}

export interface LoggerModuleLegacyOptions {
  isGlobal: boolean;
}

export interface LoggerModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  isGlobal?: boolean;
  // tslint:disable-next-line:no-any
  useFactory: (...args: any[]) => Promise<LoggerModuleOptions> | LoggerModuleOptions;
  // tslint:disable-next-line:no-any
  inject?: any[];
}
