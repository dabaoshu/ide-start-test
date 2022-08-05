import { Autowired, Injectable } from '@opensumi/di';
import { Schemes, URI } from '@opensumi/ide-core-common';
import { IEditor, WorkbenchEditorService } from '@opensumi/ide-editor';
import { IMessageService } from '@opensumi/ide-overlay';
import { IWorkspaceService } from '@opensumi/ide-workspace';
import { RunnerCodePreferences } from './runnerCode-perferences';
import { Output } from "./output";
import { IRunnerCodeNodeServer, IRunnerCodeServer, RUNNER_CODE_CONNECT_SERVER_PATH } from '../../common';
import { RPCService } from '@opensumi/ide-connection';
import { getCodeBaseFile, getCodeFileDir, getCodeFileDirWithoutTrailingSlash, getCodeFileWithoutDirAndExt, getDriveLetter, quoteFileName, rndName } from '../../common/pathUtils';
import { RunnderCodeRpc } from '../../common/connectRpc';
const isUntitled = (url: URI) => {
    return url.scheme === Schemes.untitled
}

@Injectable()
export class RunnerCodeService extends RPCService implements IRunnerCodeServer {

    @Autowired(WorkbenchEditorService)
    protected workbenchEditorService: WorkbenchEditorService
    @Autowired(IMessageService)
    protected messageService: IMessageService

    @Autowired(RunnerCodePreferences)
    private readonly _config: RunnerCodePreferences;
    @Autowired(IWorkspaceService)
    private readonly workspaceService: IWorkspaceService;
    @Autowired(RUNNER_CODE_CONNECT_SERVER_PATH)

    private readonly runnerCodeNodeServer: IRunnerCodeNodeServer


    private _isRunning: boolean;
    private _runFromExplorer: boolean;    // 是否从文件树哪里运行
    private _document: IEditor;    // 当前编辑器对象
    private _cwd: string; // 打开目录
    private _languageId: string; // 文本语言类型
    private _isTmpFile: boolean;  // 是否临时文件运行 
    private _codeFile: string; // 全路径-文件
    private _workspaceFolder: string;; // 工作区-路径
    private tempObj: any // 临时文件对象
    output: Output   // 输出对象


    onMessage(message: string) {
        this.messageService.info(message)
    }

    initOutput() {
        this.a = this.a + 10
        console.log("初始化", this.a);

        // 初始化
        this.output = new Output()
    }

    private initialize(): void {
        this.initOutput()
        this._cwd = this._config['sumi-code-runner.cwd']
        if (this._cwd) {
            return;
        }
        this._workspaceFolder = this.getWorkspaceFolder();
        if ((this._config['sumi-code-runner.fileDirectoryAsCwd'] || !this._workspaceFolder)
            && this._document && !isUntitled(this._document.currentUri!)) {
            this._cwd = this._document.currentUri?.codeUri.fsPath!
        } else {
            this._cwd = this._workspaceFolder;
        }
        if (this._cwd) {
            return;
        }
    }

    private getWorkspaceFolder(): string {
        if (this.workspaceService.tryGetRoots()) {
            if (this._document) {
                const WorkspaceRootUri = this.workspaceService.getWorkspaceRootUri(this._document.currentUri!)

                if (WorkspaceRootUri) {
                    return WorkspaceRootUri.codeUri.fsPath
                }
            }
        }
        return undefined;
    }

    private checkIsRunFromExplorer(fileUri: URI): boolean {
        const editor = this.workbenchEditorService.currentEditor

        if (!fileUri || !fileUri.codeUri.fsPath) {
            return false;
        }
        if (!editor) {
            return true;
        }
        if (fileUri.codeUri.fsPath === editor.currentUri?.codeUri.fsPath) {
            return false;
        }
        return true;
    }

    // 获取运行指令
    private getExecutor(languageId: string, fileExtension: string): string {
        // this._languageId = languageId === null ? this._document.languageId : languageId;
        this._languageId = languageId === null ? this._document.currentDocumentModel?.languageId : languageId;

        let executor: string = null



        // Check if file contains hash-bang
        if (languageId == null && this._config['sumi-code-runner.respectShebang']) {
            // const firstLineInFile = this._document.lineAt(0).text;
            // 获取头文件 
            const firstLineInFile = this._document.currentDocumentModel!.getText({
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: 2,
                endColumn: 1
            })
            if (/^#!(?!\[)/.test(firstLineInFile)) { // #![...] are used in rust https://doc.rust-lang.org/reference/attributes.html
                executor = firstLineInFile.slice(2);
            }
        }

        // if (executor == null) {
        //     const executorMapByGlob = this._config['sumi-code-runner.executorMapByGlob']
        //     if (executorMapByGlob) {
        //         const fileBasename = this._document.currentUri?.path.base
        //         for (const glob of Object.keys(executorMapByGlob)) {
        //             if (micromatch.isMatch(fileBasename, glob)) {
        //                 executor = executorMapByGlob[glob];
        //                 break;
        //             }
        //         }
        //     }
        // }

        const executorMap = this._config['sumi-code-runner.executorMap']

        if (executor == null) {
            executor = executorMap[this._languageId];
        }
        // 项目暂不需要这个
        // executor is undefined or null 
        // if (executor == null && fileExtension) {
        //     const executorMapByFileExtension = this._config['sumi-code-runner.executorMapByFileExtension']
        //     executor = executorMapByFileExtension[fileExtension];
        //     if (executor != null) {
        //         this._languageId = fileExtension;
        //     }
        // }
        // if (executor == null) {
        //     this._languageId = this._config['sumi-code-runner.defaultLanguage']
        //     executor = executorMap[this._languageId];
        // }

        return executor;
    }

    private executeCommand(executor: string, appendFile: boolean = true) {
        if (this._config['sumi-code-runner.runInTerminal']) {
            // 不抛终端
            // this.executeCommandInTerminal(executor, appendFile);
        } else {
            this.executeCommandInOutputChannel(executor, appendFile);
        }
    }

    private async executeCommandInOutputChannel(executor: string, appendFile: boolean = true) {
        const command = await this.getFinalCommandToRunCodeFile(executor, appendFile);

        // 是否显示额外信息
        const showExecutionMessage = this._config['sumi-code-runner.showExecutionMessage']
        // this._outputChannel.show(this._config['sumi-code-runner.preserveFocus']);
        this.output.show(true)

        if (showExecutionMessage) {
            this.output.appendLine("[Running] " + command);
        }
        this.runnerCodeNodeServer.runCode(command, { cwd: this._cwd, shell: true },)


    }


    public async run(languageId: string = null, fileUri: URI = null) {
        // if (this._isRunning) {
        //     this.messageService.info('正在运行')
        //     return;
        // }
        // 直接从文件处运行 run直接传uri
        this._runFromExplorer = this.checkIsRunFromExplorer(fileUri);

        if (this._runFromExplorer) {
            // 暂时无这个需求 从资源管理器或者别的地方哪里运行
            // return
            // this._document = await this.workbenchEditorService.open(fileUri)
        } else {
            const editor = this.workbenchEditorService.currentEditor
            if (editor) {
                this._document = editor
            } else {
                this.messageService.error('找不到代码 或者 无选中代码')
                this.messageService.error('No code found or selected.')
                return;
            }
        }
        // 
        this.initialize();
        console.log(this._cwd);

        const fileExtension = this._document.currentUri?.path.ext
        const executor = this.getExecutor(languageId, fileExtension);
        // undefined or null
        if (executor == null) {
            this.messageService.error("Code language not supported or defined.");
            return;
        }

        this.getCodeFileAndExecute(fileExtension, executor);
    }

    /**获取输出文件和执行文件
     * 有真实文件 直接执行
     * 选中行数执行 需要创建临时文件在执行
     */
    private getCodeFileAndExecute(fileExtension: string, executor: string, appendFile: boolean = true): any {
        let selection;
        const activeTextEditor = this.workbenchEditorService.currentEditor
        if (activeTextEditor) {
            selection = activeTextEditor.monacoEditor.getSelection()
        }
        const ignoreSelection = this._config['sumi-code-runner.ignoreSelection']
        if ((this._runFromExplorer || !selection || selection.isEmpty() || ignoreSelection) && !isUntitled(this._document.currentUri!)) {
            this._isTmpFile = false;
            this._codeFile = this._document.currentUri?.codeUri.fsPath
            if (this._config['sumi-code-runner.saveAllFilesBeforeRun']) {
                return this.workbenchEditorService.saveAll().then(() => {
                    this.executeCommand(executor, appendFile);
                });
            }
            if (this._config['sumi-code-runner.saveFileBeforeRun']) {
                return this._document.save().then(() => {
                    this.executeCommand(executor, appendFile);
                });
            }
            // 有真实文件的直接运行
            this.executeCommand(executor, appendFile);
        } else {
            let text = (this._runFromExplorer || !selection || selection.isEmpty() || ignoreSelection) ?
                this._document.currentDocumentModel!.getText() : this._document.currentDocumentModel!.getText(selection)
            if (this._languageId === "php") {
                text = text.trim();
                if (!text.startsWith("<?php")) {
                    text = "<?php\r\n" + text;
                }
            }
            this._isTmpFile = true;
            const folder = isUntitled(this._document.currentUri!) ? this._cwd : this._document.currentUri?.codeUri.fsPath
            console.log(folder);
            this.createRandomFile(text, folder, fileExtension);
        }
    }

    // 创建随机文件
    private createRandomFile(content: string, folder: string, fileExtension: string) {
        let fileType = "";
        const languageIdToFileExtensionMap = this._config['sumi-code-runner.languageIdToFileExtensionMap'];
        if (this._languageId && languageIdToFileExtensionMap[this._languageId]) {
            fileType = languageIdToFileExtensionMap[this._languageId];
        } else {
            if (fileExtension) {
                fileType = fileExtension;
            } else {
                fileType = "." + this._languageId;
            }
        }
        const temporaryFileName = this._config['sumi-code-runner.temporaryFileName']
        const tmpFileNameWithoutExt = temporaryFileName ? temporaryFileName : rndName('temp');
        const tmpFileName = tmpFileNameWithoutExt + fileType;

        this.tempObj = {
            folder,
            tmpFileName
        }
        // 创建临时文件
        this.runnerCodeNodeServer.createRandomFile(folder, tmpFileName, content)

    }




    private a = 1

    onRunnerCodeRpc(res: RunnderCodeRpc): void {


        console.log(this.a++);
        const { code, date, method, status } = res
        if (method === 'append') {
            this.onAppend(res)

        }
        if (method === 'close') {
            this._isRunning = false
        }
        if (method === 'startRun') {
            this.onStartRun()
        }
        if (method === 'createTempFile') {
            // this.executeCommand(executor);
        }


    }


    private onAppend(res) {
        this.output.ssrpush(res)

    }

    private onStartRun() {
        this._isRunning = true
        const clearPreviousOutput = this._config['sumi-code-runner.clearPreviousOutput']
        // 此时应与运行日志窗口联动
        if (clearPreviousOutput) {
            this.output.clear();
        }
    }





    /**
     * Gets the executor to run a source code file
     * and generates the complete command that allow that file to be run.
     * This executor command may include a variable $1 to indicate the place where
     * the source code file name have to be included.
     * If no such a variable is present in the executor command,
     * the file name is appended to the end of the executor command.
     *
     * @param executor The command used to run a source code file
     * @return the complete command to run the file, that includes the file name
     */
    private async getFinalCommandToRunCodeFile(
        executor: string,
        appendFile: boolean = true
    ): Promise<string> {
        let cmd = executor;
        if (this._codeFile) {
            const codeFileDir = getCodeFileDir(this._codeFile);
            const workspaceRoot = this._workspaceFolder ? this._workspaceFolder : codeFileDir
            // const pythonPath = cmd.includes("$pythonPath")
            //     ? await Utility.getPythonPath(this._document)
            //     : Constants.python;
            const placeholders: Array<{ regex: RegExp; replaceValue: string }> = [
                // A placeholder that has to be replaced by the path of the folder opened in VS Code
                // If no folder is opened, replace with the directory of the code file
                {
                    regex: /\$workspaceRoot/g,
                    replaceValue: workspaceRoot,
                },
                // A placeholder that has to be replaced by the code file name without its extension
                {
                    regex: /\$fileNameWithoutExt/g,
                    replaceValue: getCodeFileWithoutDirAndExt(codeFileDir),
                },
                // A placeholder that has to be replaced by the full code file name
                {
                    regex: /\$fullFileName/g,
                    replaceValue: quoteFileName(this._codeFile),
                },
                // A placeholder that has to be replaced by the code file name without the directory
                { regex: /\$fileName/g, replaceValue: getCodeBaseFile(this._codeFile) },
                // A placeholder that has to be replaced by the drive letter of the code file (Windows only)
                { regex: /\$driveLetter/g, replaceValue: getDriveLetter(this._codeFile) },
                // A placeholder that has to be replaced by the directory of the code file without a trailing slash
                {
                    regex: /\$dirWithoutTrailingSlash/g,
                    replaceValue: quoteFileName(getCodeFileDirWithoutTrailingSlash(codeFileDir)),
                },
                // A placeholder that has to be replaced by the directory of the code file
                { regex: /\$dir/g, replaceValue: quoteFileName(codeFileDir) },
                // A placeholder that has to be replaced by the path of Python interpreter
                // python 暂不实现
                // { regex: /\$pythonPath/g, replaceValue: pythonPath },
            ];

            placeholders.forEach((placeholder) => {
                cmd = cmd.replace(placeholder.regex, placeholder.replaceValue);
            });
        }
        return cmd !== executor
            ? cmd
            : executor + (appendFile ? " " + quoteFileName(this._codeFile) : "");
    }



}