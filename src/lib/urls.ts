import { urlJoin } from "./url-join"

const BASE_URL: string = "https://api.cloudflare.com/client/v4"

export const CLOUDFLARE_URLS = {
    uploadImage:     (accountId: string)                  => urlJoin(BASE_URL, "accounts", accountId, "images", "v1"),
    listImages:      (accountId: string)                  => urlJoin(BASE_URL, "accounts", accountId, "images", "v1"),
    deleteImage:     (accountId: string, imageId: string) => urlJoin(BASE_URL, "accounts", accountId, "images", "v1", imageId),
    getImageDetails: (accountId: string, imageId: string) => urlJoin(BASE_URL, "accounts", accountId, "images", "v1", imageId),
    createVariant:   (accountId: string)                  => urlJoin(BASE_URL, "accounts", accountId, "images", "v1", "variants"),
}
