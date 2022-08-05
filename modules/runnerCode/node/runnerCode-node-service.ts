import { Injectable } from '@opensumi/di';
import { RPCService } from '@opensumi/ide-connection';
import { dirname, join } from "path";
import * as fs from "fs";
import * as os from "os";
import { IRunnerCodeNodeServer } from '../common';
import { Imethod, Istatus, RunnderCodeRpc } from '../common/connectRpc';
// import { Utility } from "./utility";
// import { Constants } from "./constants";

const TmpDir = os.tmpdir();

@Injectable()
export class RunnerCodeNodeServer extends RPCService implements IRunnerCodeNodeServer {
    private _process;
    private connectId: string

    private _isRunning: boolean

    // 显示信息
    showMessage = (message: string) => {
        // 这里的 this.rpcClient![0] 可以直接获取到通信通道下的 proxy 实例
        this.rpcClient![0].onMessage(`I got you message, echo again. ${message}`);
    };


    // 创建临时文件
    createRandomFile(filePath, tmpFileName, content) {
        const folder = dirname(filePath)
        const codeFile = join(folder, tmpFileName);
        try {
            fs.writeFileSync(codeFile, content,);


            this.rpcClient![0].oncreateRandomFile({ status: 'success' });
            // this.stdoutMessage()
        } catch (error) {
            this.rpcClient![0].oncreateRandomFile({ status: 'error' });
        }
    }

    // 删除临时文件
    deleteRandomFile(filePath, tmpFileName) {
        const folder = dirname(filePath)
        const codeFile = join(folder, tmpFileName);
        try {
            fs.unlinkSync(codeFile)
            this.rpcClient![0].showMessage('删除文件成功');
        } catch (error) {
            this.rpcClient![0].showMessage('删除文件失败');
        }
    }

    runCode(command: string, spawnOption,) {
        const { cwd, shell = true } = spawnOption
        const startTime = new Date();
        this.stdoutMessage('', 'success', 'startRun')
        const spawn = require("child_process").spawn;
        this._process = spawn(command, [], { cwd, shell });

        this._process.stdout.on("data", (data) => {
            // this._outputChannel.append(data.toString());
            this.stdoutMessage(data.toString(), 'success', 'append')
        });

        this._process.stderr.on("data", (data) => {
            this.stdoutMessage(data.toString(), 'error', 'append')
            // this._outputChannel.append(data.toString());
        });

        this._process.on("close", (code) => {
            this._isRunning = false;
            const endTime = new Date();
            const elapsedTime = (endTime.getTime() - startTime.getTime()) / 1000;
            this.stdoutMessage('', 'success', 'append')
            this.stdoutMessage(`[Done] exited with code=" + ${code} + " in " + ${elapsedTime} + " seconds`, 'success', 'append')
            this.stdoutMessage('', 'success', 'close')

            // if (tmpFileName) {
            //     this.deleteRandomFile(tmpFileName)
            // }
        });

    }



    private stdoutMessage = (message: string, status: Istatus, method: Imethod) => {
        const Rpc: RunnderCodeRpc = {
            code: '200',
            date: message,
            status,
            method,
            connectId: this.connectId,
        }
        this.rpcClient![0].onRunnerCodeRpc(Rpc);
    }

}
