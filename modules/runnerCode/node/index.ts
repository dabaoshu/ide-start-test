import { Provider, Injectable } from '@opensumi/di';
import { NodeModule } from '@opensumi/ide-core-node';

import { RunnerCodeNodeServer } from './runnerCode-node-service';
import { IRunnerCodeNodeServer, RUNNER_CODE_CONNECT_SERVER_PATH } from '../common';

@Injectable()
export class RunnerCodeNodeModule extends NodeModule {
    providers: Provider[] = [
        {
            token: IRunnerCodeNodeServer,
            useClass: RunnerCodeNodeServer,
        },
    ];

    backServices = [
        {
            servicePath: RUNNER_CODE_CONNECT_SERVER_PATH, // 双端通信通道唯一路径
            token: IRunnerCodeNodeServer, // 关联后端服务
        },
    ];
}
