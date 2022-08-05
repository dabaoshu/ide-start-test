import { Autowired, Injectable, Injector, } from '@opensumi/di';
import {
    PreferenceSchema,
    PreferenceProxy,
    PreferenceService,
    createPreferenceProxy,
    PreferenceContribution,
    localize, Domain, ISettingGroup, ISettingSection
} from '@opensumi/ide-core-browser';
import { IDisposable } from '@opensumi/ide-monaco/lib/common/types';
import {
    SettingContribution
} from '@opensumi/ide-preferences';
import { RUNNER_CODE_SETTING } from '../../common';
import { runnerCodePreferencesSchema } from './runnerCode-perferences';
@Domain(SettingContribution)
export class RunnerCodeSettingContribution implements SettingContribution {
    registerSetting(regist: {
        registerSettingGroup: (settingGroup: ISettingGroup) => IDisposable;
        registerSettingSection: (key: string, section: ISettingSection) => IDisposable;
    }) {
        regist.registerSettingGroup({
            id: RUNNER_CODE_SETTING,
            title: '运行设置',
            iconClass: ''
        })
        regist.registerSettingSection(RUNNER_CODE_SETTING, {
            title: runnerCodePreferencesSchema.title,
            preferences: [
                // { id: 'sumi-code-runner.executorMapByGlob', localized: '' },
                { id: 'sumi-code-runner.ignoreSelection', localized: '' }
            ],
        })
    }
}
