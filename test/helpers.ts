import { readFileSync } from "fs"
import { fixString } from "fixjson"

export const readJsonFile = <T = any>(path: string): T => {
    try {
        const result = JSON.parse(fixString(readFileSync(path).toString()))
        return result as unknown as T
    } catch (error) {
        if (error.code == "ENOENT") {
            console.log(`[readJsonFile] file not found: '${path}'`)
        } else {
            console.log(`unable to read JSON from path '${path}'`)
            console.log(`${error.message}`)
        }
        process.exit(1)
    }
}
