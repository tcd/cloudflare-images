import { ICloudflareError } from "cloudflare-images"

/**
 * Test for errors from the Cloudflare API.
 */
export const isCloudflareError = (value: any): value is ICloudflareError => {
    return value?.isCloudflareError == true
}
