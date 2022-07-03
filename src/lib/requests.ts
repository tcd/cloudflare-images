export interface ImageUploadRequest {
    id: string
    path: string
}

export interface ListImagesRequest {
    /**
     * Page number.
     * @default 1
     */
    page?: number
    /**
     * Number of results per page. Max of 100.
     * @default 100
     */
    per_page?: number
}

export const DEFAULT_LIST_IMAGES_REQUEST: ListImagesRequest = {
    page: 1,
    per_page: 100,
}
