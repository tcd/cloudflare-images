const argsTest = () => {
    const array = []
    let _log1 = () => console.log()
    let _log2 = (msg) => console.log(msg)
    const log1 = () => _log1()
    const log2 = (msg) => _log2(msg)
    const map = {
        "L1": log1,
        "L2": log2,
    }
    // @ts-ignore: next-line
    map["L1"](...array)
    // @ts-ignore: next-line
    map["L2"](...array)
}
