
export class Output {
    content: any[] = []
    focus: boolean = false


    show = (focus) => {
        this.focus = focus
    }

    appendLine = (message: string) => {
        this.content.push({
            status: 'success',
            message
        })
    }

    clear = () => {
        this.content = []
    }

    ssrpush = (any) => {
        this.content.push(any)
    }

    getLog = () => {
        return this.content
    }
}