import { basename } from "path"
import { readFile } from "fs/promises"
import axios, { AxiosRequestConfig } from "axios"
import FormData from "form-data"

import {
    CloudflareDeleteImageResponse,
    CloudflareImageDetailsResponse,
    CloudflareListImagesResponse,
    CloudflareUploadImageResponse,
    CloudflareVariant,
    CloudflareVariantResponse,
    ImageUploadRequest,
    ListImagesRequest,
    CloudflareClientOptions,
} from "cloudflare-images"
import { urlJoin } from "./url-join"

/**
 * # Client for interacting with the Cloudflare API
 *
 * This is a work in progress.
 *
 * ## Reference
 *
 * - [API token permissions](https://developers.cloudflare.com/api/tokens/create/permissions/)
 * - [Cloudflare API v4 Documentation](https://api.cloudflare.com/)
 * - [Cloudflare API v4 Documentation - Cloudflare Images](https://api.cloudflare.com/#cloudflare-images-properties)
 * - [Send a File With Axios in Node.js](https://maximorlov.com/send-a-file-with-axios-in-nodejs/)
 */
export class CloudflareClient {

    private BASE_URL: string = "https://api.cloudflare.com/client/v4"
    private options: CloudflareClientOptions

    constructor(options: CloudflareClientOptions) {
        this.options = options;
    }

    /**
     * Upload an image with up to 10 Megabytes using a single HTTP POST (multipart/form-data) request.
     *
     * [API Docs](https://api.cloudflare.com/#cloudflare-images-upload-an-image-using-a-single-http-request)
     */
    public async uploadImage(request: ImageUploadRequest): Promise<CloudflareUploadImageResponse> {
        try {
            const url = urlJoin(this.BASE_URL, "accounts", this.accountId, "images", "v1")
            const fileName = basename(request.path)
            const file = await readFile(request.path);
            const formData = new FormData();
            formData.append("id", request.id)
            formData.append("file", file, fileName)
            const response = await axios.post<CloudflareUploadImageResponse>(url, formData, this.config())
            // logger.debug({
            //     message: "Image Uploaded",
            //     responseData: response?.data
            // })
            return response.data;
        } catch (error) {
            // logger.error(error)
            throw error
        }
    }

    /**
     * List up to 100 images with one request. Use the optional parameters below to get a specific range of images.
     *
     * [API Docs](https://api.cloudflare.com/#cloudflare-images-list-images)
     */
    public async listImages(request: ListImagesRequest): Promise<CloudflareListImagesResponse> {
        const url = urlJoin(this.BASE_URL, "accounts", this.accountId, "images", "v1")
        try {
            const response = await axios.get<CloudflareListImagesResponse>(url, this.config())
            // logger.debug({
            //     message: "Images Listed",
            //     responseData: response?.data
            // })
            return response.data
        } catch (error) {
            // logger.error(error)
            throw error
        }
    }

    /**
     * Delete an image on Cloudflare Images. On success, all copies of the image are deleted and purged from cache.
     *
     * [API Docs](https://api.cloudflare.com/#cloudflare-images-delete-image)
     */
    public async deleteImage(imageId: string): Promise<CloudflareDeleteImageResponse> {
        try {
            const url = urlJoin(this.BASE_URL, "accounts", this.accountId, "images", "v1", imageId)
            const response = await axios.delete<CloudflareDeleteImageResponse>(url, this.config())
            // logger.debug({
            //     message: "Image Deleted",
            //     imageId,
            //     responseData: response?.data
            // })
            return response.data;
        } catch (error) {
            // logger.error(error)
            throw error
        }
    }

    /**
     * Fetch details for a single image.
     *
     * [API Docs](https://api.cloudflare.com/#cloudflare-images-image-details)
     */
    public async getImageDetails(imageId: string): Promise<CloudflareImageDetailsResponse> {
        try {
            const url = urlJoin(this.BASE_URL, "accounts", this.accountId, "images", "v1", imageId)
            const response = await axios.get<CloudflareImageDetailsResponse>(url, this.config())
            // logger.debug({
            //     message: "Image Details Fetched",
            //     imageId,
            //     responseData: response?.data
            // })
            return response.data;
        } catch (error) {
            // logger.error(error)
            throw error
        }
    }

    /**
     * Fetch details for a single image.
     *
     * [API Docs](https://api.cloudflare.com/#cloudflare-images-variants-create-a-variant)
     * [Cloudflare Docs](https://developers.cloudflare.com/images/cloudflare-images/transform/resize-images/)
     */
    public async createImageVariant(options: CloudflareVariant): Promise<CloudflareVariantResponse> {
        try {
            const url = urlJoin(this.BASE_URL, "accounts", this.accountId, "images", "v1", "variants")
            const response = await axios.post<CloudflareVariantResponse>(url, this.config())
            // logger.debug({
            //     message: "Image Details Fetched",
            //     options,
            //     responseData: response?.data
            // })
            return response.data;
        } catch (error) {
            // logger.error(error)
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
                "Authorization": `Bearer ${this.apiKey}`
            }
        }
    }

    private DEFAULT_LIST_IMAGES_REQUEST: ListImagesRequest = {
        page: 1,
        per_page: 100,
    }
}
