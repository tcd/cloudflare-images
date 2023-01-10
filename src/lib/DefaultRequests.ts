import { Requests, Operation } from "cloudflare-images"

const image_create: () => Requests.CreateImage = () => ({
    id: null,
    fileName: null,
    metadata: {
        updatedAt: new Date().toISOString(),
    },
    requireSignedURLs: false,
})

const image_update: () => Requests.UpdateImage = () => ({
    metadata: {
        updatedAt: new Date().toISOString(),
    },
})

const image_list: () => Requests.ListImages = () => ({
    page: 1,
    per_page: 100,
})

const image_direct_upload: () => Requests.CreateDirectUpload = () => ({
    expiry: new Date(new Date().getTime() + 30 * 60 * 1000).toISOString(),
    metadata: {
        updatedAt: new Date().toISOString(),
    },
    requireSignedURLs:false,
})

const empty  = () => {}

export const DefaultRequests: Record<Operation, () => any> = {
    "image.create": image_create,
    "image.createDirectUpload": image_direct_upload,
    "image.list":          image_list,
    "image.get":           empty,
    "image.update":        image_update,
    "image.delete":        empty,
    "image.download":      empty,
    "variant.list":        empty,
    "variant.get":         empty,
    "variant.create":      empty,
    "variant.update":      empty,
    "variant.delete":      empty,
    "usageStatistics.get": empty,
}
