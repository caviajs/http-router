import 'reflect-metadata';
import { CommandModule } from 'yargs';

export const MetaCommand: CommandModule = {
  command: [
    'generate',
  ],
  handler: async yargs => {
    console.log('siema');
  },
};
