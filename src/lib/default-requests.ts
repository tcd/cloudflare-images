import {
    ImageUploadRequest,
    ListImagesRequest,
} from "cloudflare-images"

const imageUploadRequest: ImageUploadRequest = {
    id: null,
    fileName: null,
    fileData: null,
    metadata: {},
    requireSignedURLs: false,
}

const listImagesRequest: ListImagesRequest = {
    page: 1,
    per_page: 100,
}

export const DEFAULT_REQUESTS = {
    uploadImage:     imageUploadRequest,
    listImages:      listImagesRequest,
}
