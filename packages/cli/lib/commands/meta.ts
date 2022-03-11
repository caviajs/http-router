import 'reflect-metadata';
import { CommandModule } from 'yargs';

export const MetaCommand: CommandModule = {
  command: [
    'meta generate http-client',
  ],
  handler: async yargs => {

  },
};
