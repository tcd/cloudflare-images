/**
 * Cloudflare Images error codes
 *
 * [API Docs](https://api.cloudflare.com/#cloudflare-images-errors)
 */
export const ErrorCodes = {
    "5400":  "Bad Request.",
    "5401":  "Variant not found.",
    "5403":  "The given account is not valid or is not authorized to access this service.",
    "5404":  "Image not found.",
    "5408":  "Client was sending upload too slowly.",
    "5413":  "Maximum image size of 10 MB is reached",
    "5415":  "Images must be uploaded as a form, not as raw image data. Please use multipart/form-data format.",
    "5433":  "Request has been aborted by the client.",
    "5450":  "Error while receiving upload.",
    "5453":  "The given account has reached a service limit.",
    "5455":  "Unsupported image format.",
    "5500":  "Internal Server Error.",
    "5503":  "Server Unavailable.",
    "5540":  "Error received from the storage.",
    "5541":  "Error while purging cache.",
    "5542":  "Error while loading account.",
    "5543":  "Error during audit.",
    "5544":  "Error during abuse operation.",
    "5550":  "Internal Server Error.",
    "9422":  "Decode Error",
    "10000": "Authentication error",
} as const

export type ErrorCode = keyof typeof ErrorCodes
export type ErrorCodeDescription = typeof ErrorCodes[ErrorCode]
