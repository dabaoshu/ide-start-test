
// export type Istatus = 'resolve' | 'pendding' | 'reject'
export type Istatus = 'success' | 'loading' | 'error'
// 持续输出 响应中 关闭
export type Imethod = 'append' | 'pendding' | 'close' | "createTempFile" | 'startRun'

export type RunnderCodeRpc = {
    code: string;
    status: Istatus;
    date: string;
    method: Imethod;
    connectId?: string
}