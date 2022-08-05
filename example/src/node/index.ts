import { startServer } from './start-server';
import { ExpressFileServerModule } from '@opensumi/ide-express-file-server/lib/node';
import { CommonNodeModules } from './common-modules';

import { TodoListModule } from 'modules/connection/node';
import { RunnerCodeNodeModule } from 'modules/runnerCode/node';
startServer({
  modules: [
    ...CommonNodeModules,
    ExpressFileServerModule,
    TodoListModule, RunnerCodeNodeModule
  ],
});
