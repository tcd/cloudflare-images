import { ICloudflareError } from "cloudflare-images"

export const CLOUDFLARE_ERROR_REGEX = /^ERROR (?<code>\d+): (?<message>.+)/i

export const matchCloudflareError = (input: string): ICloudflareError => {
    input = (input ?? "").trim()
    // thanks cloudflare, very helpful
    if (input == "variant not found") {
        return {
            code: null,
            message: "variant not found",
        }
    }
    const match = input.match(CLOUDFLARE_ERROR_REGEX)
    if (match) {
        return {
            code: match?.groups?.code,
            message: match?.groups?.message,
        }
    }
    return null
}
