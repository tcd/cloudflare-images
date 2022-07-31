import { Requests } from "cloudflare-images"

const imageUploadRequest: Requests.ImageUpload = {
    id: null,
    fileName: null,
    fileData: null,
    metadata: {},
    requireSignedURLs: false,
}

const listImagesRequest: Requests.ListImages = {
    page: 1,
    per_page: 100,
}

export const DEFAULT_REQUESTS = {
    uploadImage:     imageUploadRequest,
    listImages:      listImagesRequest,
}
