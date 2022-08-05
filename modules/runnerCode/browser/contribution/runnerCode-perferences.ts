import {  Injector } from '@opensumi/di';
import {
    Domain,
    PreferenceSchema,
    PreferenceProxy,
    PreferenceService,
    createPreferenceProxy,
    PreferenceContribution,
} from '@opensumi/ide-core-browser';

export const runnerCodePreferencesSchema: PreferenceSchema = {
    id: 'sumirunnerCode',
    type: 'object',
    title: '运行设置',
    properties: {
        "sumi-code-runner.executorMapByGlob": {
            type: "object",
            default: {
                "pom.xml": "cd $dir && mvn clean package"
            },
            description: "Set the executor by glob.",
           
        },
        "sumi-code-runner.executorMap": {
            "type": "object",
            "default": {
                "javascript": "node",
                "java": "cd $dir && javac $fileName && java $fileNameWithoutExt",
                "c": "cd $dir && gcc $fileName -o $fileNameWithoutExt && $dir$fileNameWithoutExt",
                "zig": "zig run",
                "cpp": "cd $dir && g++ $fileName -o $fileNameWithoutExt && $dir$fileNameWithoutExt",
                "objective-c": "cd $dir && gcc -framework Cocoa $fileName -o $fileNameWithoutExt && $dir$fileNameWithoutExt",
                "php": "php",
                "python": "python -u",
                "perl": "perl",
                "perl6": "perl6",
                "ruby": "ruby",
                "go": "go run",
                "lua": "lua",
                "groovy": "groovy",
                "powershell": "powershell -ExecutionPolicy ByPass -File",
                "bat": "cmd /c",
                "shellscript": "bash",
                "fsharp": "fsi",
                "csharp": "scriptcs",
                "vbscript": "cscript //Nologo",
                "typescript": "ts-node",
                "coffeescript": "coffee",
                "scala": "scala",
                "swift": "swift",
                "julia": "julia",
                "crystal": "crystal",
                "ocaml": "ocaml",
                "r": "Rscript",
                "applescript": "osascript",
                "clojure": "lein exec",
                "haxe": "haxe --cwd $dirWithoutTrailingSlash --run $fileNameWithoutExt",
                "rust": "cd $dir && rustc $fileName && $dir$fileNameWithoutExt",
                "racket": "racket",
                "scheme": "csi -script",
                "ahk": "autohotkey",
                "autoit": "autoit3",
                "dart": "dart",
                "pascal": "cd $dir && fpc $fileName && $dir$fileNameWithoutExt",
                "d": "cd $dir && dmd $fileName && $dir$fileNameWithoutExt",
                "haskell": "runghc",
                "nim": "nim compile --verbosity:0 --hints:off --run",
                "lisp": "sbcl --script",
                "kit": "kitc --run",
                "v": "v run",
                "sass": "sass --style expanded",
                "scss": "scss --style expanded",
                "less": "cd $dir && lessc $fileName $fileNameWithoutExt.css",
                "FortranFreeForm": "cd $dir && gfortran $fileName -o $fileNameWithoutExt && $dir$fileNameWithoutExt",
                "fortran-modern": "cd $dir && gfortran $fileName -o $fileNameWithoutExt && $dir$fileNameWithoutExt",
                "fortran_fixed-form": "cd $dir && gfortran $fileName -o $fileNameWithoutExt && $dir$fileNameWithoutExt",
                "fortran": "cd $dir && gfortran $fileName -o $fileNameWithoutExt && $dir$fileNameWithoutExt",
                "sml": "cd $dir && sml $fileName"
            },
            "description": "Set the executor of each language.",
           
        },
        "sumi-code-runner.executorMapByFileExtension": {
            "type": "object",
            "default": {
                ".vb": "cd $dir && vbc /nologo $fileName && $dir$fileNameWithoutExt",
                ".vbs": "cscript //Nologo",
                ".scala": "scala",
                ".jl": "julia",
                ".cr": "crystal",
                ".ml": "ocaml",
                ".zig": "zig run",
                ".exs": "elixir",
                ".hx": "haxe --cwd $dirWithoutTrailingSlash --run $fileNameWithoutExt",
                ".rkt": "racket",
                ".scm": "csi -script",
                ".ahk": "autohotkey",
                ".au3": "autoit3",
                ".kt": "cd $dir && kotlinc $fileName -include-runtime -d $fileNameWithoutExt.jar && java -jar $fileNameWithoutExt.jar",
                ".kts": "kotlinc -script",
                ".dart": "dart",
                ".pas": "cd $dir && fpc $fileName && $dir$fileNameWithoutExt",
                ".pp": "cd $dir && fpc $fileName && $dir$fileNameWithoutExt",
                ".d": "cd $dir && dmd $fileName && $dir$fileNameWithoutExt",
                ".hs": "runhaskell",
                ".nim": "nim compile --verbosity:0 --hints:off --run",
                ".csproj": "dotnet run --project",
                ".fsproj": "dotnet run --project",
                ".lisp": "sbcl --script",
                ".kit": "kitc --run",
                ".v": "v run",
                ".vsh": "v run",
                ".sass": "sass --style expanded",
                ".cu": "cd $dir && nvcc $fileName -o $fileNameWithoutExt && $dir$fileNameWithoutExt",
                ".ring": "ring",
                ".sml": "cd $dir && sml $fileName"
            },
            "description": "Set the executor of each file extension.",
           
        },
        "sumi-code-runner.customCommand": {
            "type": "string",
            "default": "echo Hello",
            "description": "Set the custom command to run.",
           
        },
        "sumi-code-runner.languageIdToFileExtensionMap": {
            "type": "object",
            "default": {
                "bat": ".bat",
                "powershell": ".ps1",
                "typescript": ".ts"
            },
            "description": "Set the mapping of languageId to file extension.",
           
        },
        "sumi-code-runner.defaultLanguage": {
            "type": "string",
            "default": "",
            "description": "Set the default language to run.",
           
        },
        "sumi-code-runner.cwd": {
            "type": "string",
            "default": "",
            "description": "Set the working directory.",
        },
        "sumi-code-runner.fileDirectoryAsCwd": {
            "type": "boolean",
            "default": false,
            "description": "Whether to use the directory of the file to be executed as the working directory.",
           
        },
        "sumi-code-runner.clearPreviousOutput": {
            "type": "boolean",
            "default": false,
            "description": "Whether to clear previous output before each run.",
           
        },
        "sumi-code-runner.saveAllFilesBeforeRun": {
            "type": "boolean",
            "default": false,
            "description": "Whether to save all files before running.",
           
        },
        "sumi-code-runner.saveFileBeforeRun": {
            "type": "boolean",
            "default": false,
            "description": "Whether to save the current file before running.",
           
        },
        "sumi-code-runner.enableAppInsights": {
            "type": "boolean",
            "default": true,
            "description": "Whether to enable AppInsights to track user telemetry data.",
           
        },
        "sumi-code-runner.showExecutionMessage": {
            "type": "boolean",
            "default": true,
            "description": "Whether to show extra execution message like [Running] ... and [Done] ...",
           
        },
        "sumi-code-runner.runInTerminal": {
            "type": "boolean",
            "default": false,
            "description": "Whether to run code in Integrated Terminal.",
           
        },
        "sumi-code-runner.terminalRoot": {
            "type": "string",
            "default": "",
            "description": "For Windows system, replaces the Windows style drive letter in the command with a Unix style root when using a custom shell as the terminal, like Bash or Cgywin. Example: Setting this to '/mnt/' will replace 'C:\\path' with '/mnt/c/path'",
           
        },
        "sumi-code-runner.preserveFocus": {
            "type": "boolean",
            "default": true,
            "description": "Whether to preserve focus on code editor after code run is triggered.",
           
        },
        "sumi-code-runner.ignoreSelection": {
            "type": "boolean",
            "default": false,
            "description": "Whether to ignore selection to always run entire file.",
           
        },
        "sumi-code-runner.showRunIconInEditorTitleMenu": {
            "type": "boolean",
            "default": true,
            "description": "Whether to show 'Run Code' icon in editor title menu.",
           
        },
        "sumi-code-runner.showStopIconInEditorTitleMenu": {
            "type": "boolean",
            "default": true,
            "description": "Whether to show 'Stop code run' icon in the editor title menu when code is running.",
           
        },
        "sumi-code-runner.showRunCommandInEditorContextMenu": {
            "type": "boolean",
            "default": true,
            "description": "Whether to show 'Run Code' command in editor context menu.",
           
        },
        "sumi-code-runner.showRunCommandInExplorerContextMenu": {
            "type": "boolean",
            "default": true,
            "description": "Whether to show 'Run Code' command in explorer context menu.",
           
        },
        "sumi-code-runner.temporaryFileName": {
            "type": "string",
            "default": "",
            "description": "Temporary file name used in running selected code snippet. When it is set as empty, the file name will be random.",
           
        },
        "sumi-code-runner.respectShebang": {
            "type": "boolean",
            "default": true,
            "description": "Whether to respect Shebang to run code.",
           
        }
    }
}

export interface runnerCodeConfiguration {
    'sumi-code-runner.executorMapByGlob': object;
    'sumi-code-runner.executorMap': object;
    'sumi-code-runner.executorMapByFileExtension': object;
    'sumi-code-runner.languageIdToFileExtensionMap': object;
    'sumi-code-runner.defaultLanguage': string;
    'sumi-code-runner.cwd': string;
    'sumi-code-runner.fileDirectoryAsCwd': boolean;
    'sumi-code-runner.clearPreviousOutput': boolean;
    'sumi-code-runner.saveAllFilesBeforeRun': boolean;
    'sumi-code-runner.saveFileBeforeRun': boolean;
    'sumi-code-runner.enableAppInsights': boolean;
    'sumi-code-runner.showExecutionMessage': boolean;
    'sumi-code-runner.runInTerminal': boolean;
    'sumi-code-runner.terminalRoot': string;
    'sumi-code-runner.preserveFocus': boolean;
    'sumi-code-runner.ignoreSelection': boolean;
    'sumi-code-runner.showRunIconInEditorTitleMenu': boolean;
    'sumi-code-runner.showStopIconInEditorTitleMenu': boolean;
    'sumi-code-runner.showRunCommandInEditorContextMenu': boolean;
    'sumi-code-runner.showRunCommandInExplorerContextMenu': boolean;
    'sumi-code-runner.temporaryFileName': string;
    'sumi-code-runner.respectShebang': boolean;

}


export const RunnerCodePreferences = Symbol('SumiRunnerCodePreferences');
export type RunnerCodePreferences = PreferenceProxy<runnerCodeConfiguration>;

export function injectRunnerCodePreferences(injector: Injector) {
    injector.addProviders({
        token: RunnerCodePreferences,
        useFactory: (injector: Injector) => {
            const preferences: PreferenceService = injector.get(PreferenceService);
            return createPreferenceProxy(preferences, runnerCodePreferencesSchema);
        },
    });
}


@Domain(PreferenceContribution)
export class RunnerCodePreferenceContribution implements PreferenceContribution {
    schema: PreferenceSchema = runnerCodePreferencesSchema
}