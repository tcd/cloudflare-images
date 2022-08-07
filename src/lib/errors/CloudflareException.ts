import type { AxiosError } from "axios"
import type { CloudflareError } from "cloudflare-images"
// import { ErrorCode } from "./ErrorCodes"
import { isAxiosError } from "./is-axios-error"

export class CloudflareException extends Error {
    name        = "CloudflareException"
    displayName = "CloudflareException"

    public static CLOUDFLARE_ERROR_REGEX = /^ERROR (?<code>\d+): (?<message>.+)$/i

    public override cause?: AxiosError<string | CloudflareError, unknown>
    public cloudflareError: CloudflareError
    public isCloudflareError: boolean

    constructor(error: AxiosError) {
        super("An error occurred", { cause: error })
        Object.setPrototypeOf(this, CloudflareException.prototype)
        this.cloudflareError = {}
        this.isCloudflareError = false
        this.stack = error?.stack
        this.process()
    }

    private process(): void {
        if (isAxiosError(this.cause)) {
            // @ts-ignore: next-line
            const firstErrorCode = this.cause?.response?.data?.errors?.[0]?.code
            if (firstErrorCode) {
                this.cloudflareError.code = firstErrorCode
                this.isCloudflareError = true
                return
            }
            // @ts-ignore: next-line
            const data = this.matchCloudflareError(this?.cause?.response?.data)
            if (data) {
                this.cloudflareError = data
                this.isCloudflareError = true
            }
        }
    }

    public toJSON() {
        return {
            message:             this.message,
            cause:               this.cause,
            isCloudflareError:   this.isCloudflareError,
            cloudflareErrorData: this.cloudflareError,
        }
    }

    private matchCloudflareError(input: string): CloudflareError {
        const match = input.match(CloudflareException.CLOUDFLARE_ERROR_REGEX)
        if (match) {
            return {
                code: match?.groups?.code,
                message: match?.groups?.message,
            }
        }
        return null
    }
}
