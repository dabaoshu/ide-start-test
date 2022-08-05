import { Injectable, Injector, Provider } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { IRunnerCodeServer, RUNNER_CODE_CONNECT_SERVER_PATH } from '../common';
import { injectRunnerCodePreferences, RunnerCodeSettingContribution, RunnerCodeService, RunnerCodeCommandContribution, RunnerCodePreferenceContribution } from './contribution';

@Injectable()
export class RunnerCodeModule extends BrowserModule {
    providers: Provider[] = [
        RunnerCodeCommandContribution,
        RunnerCodeSettingContribution,
        RunnerCodePreferenceContribution,
        {
            token: IRunnerCodeServer,
            useClass: RunnerCodeService
        }
    ];

    backServices = [
        {
            servicePath: RUNNER_CODE_CONNECT_SERVER_PATH, // 双端通信通道唯一路径
            clientToken: IRunnerCodeServer // 关联前端服务
        }
    ];

    preferences = injectRunnerCodePreferences;

}