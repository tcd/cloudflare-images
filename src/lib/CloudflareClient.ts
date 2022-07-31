import axios, { AxiosRequestConfig } from "axios"
import FormData from "form-data"

import {
    Requests,
    Responses,
    CloudflareClientOptions,
} from "cloudflare-images"
import { urlJoin } from "./url-join"
import { DEFAULT_REQUESTS } from "./default-requests"

/**
 * Client for interacting with the Cloudflare API
 *
 * ## Reference
 *
 * - [API token permissions](https://developers.cloudflare.com/api/tokens/create/permissions/)
 * - [Cloudflare API v4 Documentation](https://api.cloudflare.com/)
 * - [Cloudflare API v4 Documentation - Cloudflare Images](https://api.cloudflare.com/#cloudflare-images-properties)
 */
export class CloudflareClient {

    private BASE_URL = "https://api.cloudflare.com/client/v4"
    private options: CloudflareClientOptions

    constructor(options: CloudflareClientOptions) {
        this.options = options
    }

    /**
     * Upload an image with up to 10 Megabytes using a single HTTP POST (multipart/form-data) request.
     *
     * [API Docs](https://api.cloudflare.com/#cloudflare-images-upload-an-image-using-a-single-http-request)
     */
    public async uploadImage(request: Requests.ImageUpload): Promise<Responses.UploadImage> {
        try {
            const url = urlJoin(this.BASE_URL, "accounts", this.accountId, "images", "v1")
            const {
                id,
                fileName,
                fileData,
                metadata,
                requireSignedURLs,
            } = { ...DEFAULT_REQUESTS.uploadImage, ...request }
            const formData = new FormData()
            formData.append("id", id)
            formData.append("file", fileData, fileName)
            formData.append("metadata", JSON.stringify(metadata))
            formData.append("requireSignedURLs", requireSignedURLs)
            const response = await axios.post<Responses.UploadImage>(url, formData, this.config())
            // logger?.debug({
            //     message: "Image Uploaded",
            //     responseData: response?.data
            // })
            return response.data
        } catch (error) {
            // logger?.error(error)
            throw error
        }
    }

    /**
     * List up to 100 images with one request. Use the optional parameters below to get a specific range of images.
     *
     * [API Docs](https://api.cloudflare.com/#cloudflare-images-list-images)
     */
    public async listImages(request: Requests.ListImages = {}): Promise<Responses.ListImages> {
        const url = urlJoin(this.BASE_URL, "accounts", this.accountId, "images", "v1")
        const config: AxiosRequestConfig = {
            ...this.config(),
            params: {
                ...DEFAULT_REQUESTS.listImages,
                ...request,
            },
        }
        try {
            const response = await axios.get<Responses.ListImages>(url, config)
            // logger?.debug({
            //     message: "Images Listed",
            //     responseData: response?.data
            // })
            return response.data
        } catch (error) {
            // logger?.error(error)
            throw error
        }
    }

    /**
     * Delete an image on Cloudflare Images. On success, all copies of the image are deleted and purged from cache.
     *
     * [API Docs](https://api.cloudflare.com/#cloudflare-images-delete-image)
     */
    public async deleteImage(imageId: string): Promise<Responses.DeleteImage> {
        try {
            const url = urlJoin(this.BASE_URL, "accounts", this.accountId, "images", "v1", imageId)
            const response = await axios.delete<Responses.DeleteImage>(url, this.config())
            // logger?.debug({
            //     message: "Image Deleted",
            //     imageId,
            //     responseData: response?.data
            // })
            return response.data
        } catch (error) {
            // logger?.error(error)
            throw error
        }
    }

    /**
     * Fetch details for a single image.
     *
     * [API Docs](https://api.cloudflare.com/#cloudflare-images-image-details)
     */
    public async getImageDetails(imageId: string): Promise<Responses.ImageDetails> {
        try {
            const url = urlJoin(this.BASE_URL, "accounts", this.accountId, "images", "v1", imageId)
            const response = await axios.get<Responses.ImageDetails>(url, this.config())
            // logger?.debug({
            //     message: "Image Details Fetched",
            //     imageId,
            //     responseData: response?.data
            // })
            return response.data
        } catch (error) {
            // logger?.error(error)
            throw error
        }
    }

    /**
     * Fetch details for a single image.
     *
     * [API Docs](https://api.cloudflare.com/#cloudflare-images-variants-create-a-variant)
     * [Cloudflare Docs](https://developers.cloudflare.com/images/cloudflare-images/transform/resize-images/)
     */
    public async createImageVariant(_options: Requests.CreateVariant): Promise<Responses.Variant> {
        try {
            const url = urlJoin(this.BASE_URL, "accounts", this.accountId, "images", "v1", "variants")
            const response = await axios.post<Responses.Variant>(url, this.config())
            // logger?.debug({
            //     message: "Image Details Fetched",
            //     options,
            //     responseData: response?.data
            // })
            return response.data
        } catch (error) {
            // logger?.error(error)
            throw error
        }
    }

    /**
     * Lists existing variants.
     *
     * [API Docs](https://api.cloudflare.com/#cloudflare-images-variants-list-variants)
     */
    public async listVariants(): Promise<Responses.ListVariants> {
        const url = urlJoin(this.BASE_URL, "accounts", this.accountId, "images", "v1", "variants")
        try {
            const response = await axios.get<Responses.ListVariants>(url, this.config())
            // logger?.debug({
            //     message: "Images Listed",
            //     responseData: response?.data
            // })
            return response.data
        } catch (error) {
            // logger?.error(error)
            throw error
        }
    }

    /**
     * Fetch usage statistics details for Cloudflare Images.
     *
     * [API Docs](https://api.cloudflare.com/#cloudflare-images-images-usage-statistics)
     */
    public async getStats(): Promise<Responses.UsageStatistics> {
        const url = urlJoin(this.BASE_URL, "accounts", this.accountId, "images", "v1", "stats")
        try {
            const response = await axios.get<Responses.UsageStatistics>(url, this.config())
            // logger?.debug({
            //     message: "Usage Statistics fetched",
            //     responseData: response?.data
            // })
            return response.data
        } catch (error) {
            // logger?.error(error)
            throw error
        }
    }

    // =========================================================================
    // Helpers
    // =========================================================================

    private get apiKey(): string { return this.options.apiKey }

    private get accountId(): string { return this.options.accountId }

    private config(): AxiosRequestConfig {
        return {
            headers: {
                "Authorization": `Bearer ${this.apiKey}`,
            },
        }
    }
}
