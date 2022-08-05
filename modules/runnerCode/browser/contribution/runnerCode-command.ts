import { Domain } from '@opensumi/ide-core-browser';
import { CommandContribution, CommandRegistry, Uri } from '@opensumi/ide-core-common';
import {
    WorkbenchEditorService,
} from '@opensumi/ide-editor/lib/browser/types';
import { RUNNER_CODE } from '../../common/command';

import { formatMessage } from '@/modules/utils/utils';
import { RunnerCodeService } from './runnerCode-service';
import { RunnerCodePreferences } from './runnerCode-perferences';
import { Injectable, Autowired, INJECTOR_TOKEN, Injector } from '@opensumi/di';





@Domain(CommandContribution)
export class RunnerCodeCommandContribution implements CommandContribution {

    @Autowired(WorkbenchEditorService)
    protected workbenchEditorService: WorkbenchEditorService;


    @Autowired(RunnerCodeService)
    protected runnerCodeService: RunnerCodeService

    @Autowired(RunnerCodePreferences)
    private readonly runnerCodePreferences: RunnerCodePreferences;

    @Autowired(INJECTOR_TOKEN)
    protected readonly injector: Injector

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(RUNNER_CODE.run, {
            execute: (fileUri: Uri) => {
                const editor = this.workbenchEditorService.currentEditor

                // this.runnerCodeService.run(null, fileUri);
                this.runnerCodeService.run(null, editor?.currentUri);
            }
        })
        commands.registerCommand(RUNNER_CODE.log, {
            execute: (fileUri: Uri) => {
                console.log(this.runnerCodePreferences['code-runner.ignoreSelection']);

            }
        })
    }


}
