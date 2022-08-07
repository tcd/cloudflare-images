import type { ICloudflareError, Operation } from "cloudflare-images"

export class CloudflareException extends Error implements ICloudflareError {
    name = "CloudflareException"

    public code: string
    public operation: Operation
    public isCloudflareError: true = true

    constructor(data: ICloudflareError, operation: Operation) {
        const msg = data?.message ?? "An error occurred with the Cloudflare Images API"
        super(msg)
        Object.setPrototypeOf(this, CloudflareException.prototype)
        this.code = data.code
        this.operation = operation
    }
}
