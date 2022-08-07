import { matchCloudflareError } from "../src/lib/errors/match-cloudflare-error"
import { readJsonFile } from "./helpers"

export abstract class ErrorTests {

    public static match(): void {
        const errors = readJsonFile<string[]>("./test/fixtures/errors/errors.jsonc")
        for (const errorString of errors) {
            const matches = matchCloudflareError(errorString)
            console.log(matches)
        }
        // console.log(errors)
    }
}
