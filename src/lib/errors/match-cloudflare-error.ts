import { CloudflareError } from "cloudflare-images"

export const CLOUDFLARE_ERROR_REGEX = /^ERROR (?<code>\d+): (?<message>.+)$/i

export const matchCloudflareError = (input: string): CloudflareError => {
    const match = input.match(CLOUDFLARE_ERROR_REGEX)
    if (match) {
        return {
            code: match?.groups?.code,
            message: match?.groups?.message,
        }
    }
    return null
}
