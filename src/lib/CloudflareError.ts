import { ErrorCode } from "./ErrorCodes"
import { isAxiosError } from "./is-axios-error"

export class CloudflareError extends Error {
    name = "CloudflareError"

    public override cause?: Error

    public errorCode?: ErrorCode

    public  isCloudflareError: boolean
    private wrapsAxiosError:   boolean

    constructor(error: Error) {
        super("An error occurred", { cause: error })
        Object.setPrototypeOf(this, CloudflareError.prototype)
        this.wrapsAxiosError = false
        this.isCloudflareError = false
        this.stack = error.stack
        this.process()
    }

    private process(): void {
        if (isAxiosError(this.cause)) {
            this.wrapsAxiosError = true
            // @ts-ignore: next-line
            const firstErrorCode = this.cause?.response?.data?.errors?.[0]?.code
            if (firstErrorCode) {
                this.errorCode = firstErrorCode
                this.isCloudflareError = true
            }
        }
    }

    public toJSON() {
        return {
            message:      this.message,
            cause:        this.cause,
            isAxiosError: this.wrapsAxiosError,
        }
    }
}
