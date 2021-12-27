export function asTest():Promise<any> {
    return new Promise<any>((resolve) => {
        setTimeout(() => {
            resolve(0)
        }, 1000)
    })
}