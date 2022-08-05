import { RunnderCodeRpc } from "./connectRpc";


export const RUNNER_CODE_SETTING = 'RUNNER_CODE_SETTING'



// browser 
export const IRunnerCodeServer = Symbol('runnerCodeServer');
export interface IRunnerCodeServer {
    onMessage(message: string): void;
    onRunnerCodeRpc(Rpc: RunnderCodeRpc)
}




export const RUNNER_CODE_CONNECT_SERVER_PATH = 'RUNNER_CODE_CONNECT_SERVER_PATH';
// node


export const IRunnerCodeNodeServer = Symbol('runnerCodeNodeServer');
export interface IRunnerCodeNodeServer {
    createRandomFile(folder: string, tmpFileName: string, content: string): void
    runCode(command: string, cmdOption: any)
}