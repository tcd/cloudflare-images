import { basename } from "path"
import { readFile } from "fs/promises"
import axios, { AxiosRequestConfig } from "axios"
import NpmFormData from "form-data"

import {
    Requests,
    Responses,
    CloudflareClientOptions,
    Logging,
    ICloudflareClient,
    Operation,
} from "cloudflare-images"
import { isBlank } from "./is-blank"
import { urlJoin } from "./url-join"
import { DefaultRequests } from "./DefaultRequests"

interface LogErrorArgs {
    operation: Operation
    error: any
}

interface LogResponseArgs {
    operation: Operation
    response: any
}

/**
 * Client for interacting with the Cloudflare API
 *
 * ## Reference
 *
 * - [API token permissions](https://developers.cloudflare.com/api/tokens/create/permissions/)
 * - [Cloudflare API v4 Documentation](https://api.cloudflare.com/)
 * - [Cloudflare API v4 Documentation - Cloudflare Images](https://api.cloudflare.com/#cloudflare-images-properties)
 */
export class CloudflareClient implements ICloudflareClient {

    private BASE_URL = "https://api.cloudflare.com/client/v4"
    private options: CloudflareClientOptions
    private logger?: Logging.ILogger

    constructor(options: CloudflareClientOptions) {
        this.options = options
        this.logger = options?.logger ?? null
    }

    // =========================================================================
    // Images
    // =========================================================================

    public async createImageFromBuffer(request: Requests.CreateImage, buffer: Buffer): Promise<Responses.CreateImage> {
        try {
            const url = urlJoin(this.BASE_URL, "accounts", this.accountId, "images", "v1")
            const {
                id,
                fileName,
                metadata,
                requireSignedURLs,
            } = { ...DefaultRequests["image.create"]() as Requests.CreateImage, ...request }
            const formData = new NpmFormData()
            formData.append("id", id)
            formData.append("file", buffer, fileName)
            if (!isBlank(metadata)) {
                formData.append("metadata", JSON.stringify(metadata), { contentType: "application/json" })
            }
            formData.append("requireSignedURLs", requireSignedURLs == true ? "true" : "false")
            const config = this.config({
                "Content-Type": "multipart/form-data",
            })
            const response = await axios.post<Responses.CreateImage>(url, formData, config)
            this.logResponse({
                operation: "image.create",
                response: response?.data,
            })
            return response.data
        } catch (error) {
            this.logError({
                error,
                operation: "image.create",
            })
            throw error
        }
    }

    public async createImageFromFile(request: Requests.CreateImage, path: string): Promise<Responses.CreateImage> {
        try {
            const url = urlJoin(this.BASE_URL, "accounts", this.accountId, "images", "v1")
            let {
                id,
                fileName,
                metadata,
                requireSignedURLs,
            } = { ...DefaultRequests["image.create"]() as Requests.CreateImage, ...request }
            fileName = isBlank(fileName) ? basename(path) : fileName
            const file = await readFile(path)
            const formData = new NpmFormData()
            formData.append("id", id)
            formData.append("file", file, fileName)
            if (!isBlank(metadata)) {
                formData.append("metadata", JSON.stringify(metadata), { contentType: "application/json" })
            }
            formData.append("requireSignedURLs", requireSignedURLs == true ? "true" : "false")
            const config = this.config({
                "Content-Type": "multipart/form-data",
            })
            const response = await axios.post<Responses.CreateImage>(url, formData, config)
            this.logResponse({
                operation: "image.create",
                response: response?.data,
            })
            return response.data
        } catch (error) {
            this.logError({
                error,
                operation: "image.create",
            })
            throw error
        }
    }

    public async createImageFromUrl(request: Requests.CreateImage, imageUrl: string): Promise<Responses.CreateImage> {
        try {
            const url = urlJoin(this.BASE_URL, "accounts", this.accountId, "images", "v1")
            const config = this.config({
                "content-type": "multipart/form-data",
            })
            const {
                id,
                fileName,
                metadata,
                requireSignedURLs,
            } = { ...DefaultRequests["image.create"]() as Requests.CreateImage, ...request }

            metadata

            const formData = new NpmFormData()
            formData.append("id", id)
            formData.append("fileName", fileName)
            formData.append("url", imageUrl)
            formData.append("metadata", metadata)
            formData.append("requireSignedURLs", requireSignedURLs)
            const response = await axios.post<Responses.CreateImage>(url, formData, config)
            this.logResponse({
                operation: "image.create",
                response: response?.data,
            })
            return response.data
        } catch (error) {
            this.logError({
                error,
                operation: "image.create",
            })
            throw error
        }
    }

    public async createDirectUpload(request: Requests.CreateDirectUpload = {}) {
        const url = urlJoin(this.BASE_URL, "accounts", this.accountId, "images", "v2", "direct_upload")
        const config: AxiosRequestConfig = {
            ...this.config(),
            data: {
                ...DefaultRequests["image.createDirectUpload"](),
                ...request,
            },
        }
        try {
            const response = await axios.post<Responses.CreateDirectUpload>(url, null, config)
            this.logResponse({
                operation: "image.createDirectUpload",
                response: response?.data,
            })
            return response.data
        } catch (error) {
            this.logError({
                error,
                operation: "image.createDirectUpload",
            })
            throw error
        }
    }

    public async listImages(request: Requests.ListImages = {}): Promise<Responses.ListImages> {
        const url = urlJoin(this.BASE_URL, "accounts", this.accountId, "images", "v1")
        const config: AxiosRequestConfig = {
            ...this.config(),
            params: {
                ...DefaultRequests["image.list"](),
                ...request,
            },
        }
        try {
            const response = await axios.get<Responses.ListImages>(url, config)
            this.logResponse({
                operation: "image.list",
                response: response?.data,
            })
            return response.data
        } catch (error) {
            this.logError({
                error,
                operation: "image.list",
            })
            throw error
        }
    }

    public async getImage(imageId: string): Promise<Responses.GetImage> {
        try {
            const url = urlJoin(this.BASE_URL, "accounts", this.accountId, "images", "v1", imageId)
            const response = await axios.get<Responses.GetImage>(url, this.config())
            this.logResponse({
                operation: "image.get",
                // imageId,
                response: response?.data,
            })
            return response.data
        } catch (error) {
            this.logError({
                error,
                operation: "image.get",
            })
            throw error
        }
    }

    public async downloadImage(imageId: string): Promise<Blob> {
        try {
            const url = urlJoin(this.BASE_URL, "accounts", this.accountId, "images", "v1", imageId, "blob")
            const response = await axios.get<Blob>(url, this.config())
            this.logResponse({
                operation: "image.download",
                response: response?.data,
            })
            return response.data
        } catch (error) {
            this.logError({
                error,
                operation: "image.download",
            })
            throw error
        }
    }

    public async updateImage(imageId: string, options: Requests.UpdateImage): Promise<Responses.UpdateImage> {
        try {
            const url = urlJoin(this.BASE_URL, "accounts", this.accountId, "images", "v1", imageId)
            const response = await axios.patch<Responses.UpdateImage>(url, options, this.config())
            this.logResponse({
                operation: "image.update",
                // imageId,
                response: response?.data,
            })
            return response.data
        } catch (error) {
            this.logError({
                error,
                operation: "image.update",
            })
            throw error
        }
    }

    public async deleteImage(imageId: string): Promise<Responses.DeleteImage> {
        try {
            const url = urlJoin(this.BASE_URL, "accounts", this.accountId, "images", "v1", imageId)
            const response = await axios.delete<Responses.DeleteImage>(url, this.config())
            this.logResponse({
                operation: "image.delete",
                // imageId,
                response: response?.data,
            })
            return response.data
        } catch (error) {
            this.logError({
                error,
                operation: "image.delete",
            })
            throw error
        }
    }

    // =========================================================================
    // Variants
    // =========================================================================

    public async createVariant(options: Requests.CreateVariant): Promise<Responses.CreateVariant> {
        try {
            const url = urlJoin(this.BASE_URL, "accounts", this.accountId, "images", "v1", "variants")
            const response = await axios.post<Responses.CreateVariant>(url, options, this.config())
            this.logResponse({
                operation: "variant.create",
                // options,
                response: response?.data,
            })
            return response.data
        } catch (error) {
            this.logError({
                error,
                operation: "variant.create",
            })
            throw error
        }
    }

    public async listVariants(): Promise<Responses.ListVariants> {
        const url = urlJoin(this.BASE_URL, "accounts", this.accountId, "images", "v1", "variants")
        try {
            const response = await axios.get<Responses.ListVariants>(url, this.config())
            this.logResponse({
                operation: "variant.list",
                response: response?.data,
            })
            return response.data
        } catch (error) {
            this.logError({
                error,
                operation: "variant.list",
            })
            throw error
        }
    }

    public async getVariant(variantId: string): Promise<Responses.GetVariant> {
        try {
            const url = urlJoin(this.BASE_URL, "accounts", this.accountId, "images", "v1", "variants", variantId)
            const response = await axios.get<Responses.GetVariant>(url, this.config())
            this.logResponse({
                operation: "variant.get",
                // variantId,
                response: response?.data,
            })
            return response.data
        } catch (error) {
            this.logError({
                error,
                operation: "variant.get",
            })
            throw error
        }
    }

    public async updateVariant(variantId: string, options: Requests.UpdateVariant): Promise<Responses.UpdateVariant> {
        try {
            const url = urlJoin(this.BASE_URL, "accounts", this.accountId, "images", "v1", "variants", variantId)
            const response = await axios.patch<Responses.UpdateVariant>(url, options, this.config())
            this.logResponse({
                operation: "variant.update",
                // options,
                response: response?.data,
            })
            return response.data
        } catch (error) {
            this.logError({
                error,
                operation: "variant.update",
            })
            throw error
        }
    }

    public async deleteVariant(variantId: string): Promise<Responses.DeleteVariant> {
        try {
            const url = urlJoin(this.BASE_URL, "accounts", this.accountId, "images", "v1", "variants", variantId)
            const response = await axios.delete<Responses.DeleteVariant>(url, this.config())
            this.logResponse({
                operation: "variant.delete",
                // variantId,
                response: response?.data,
            })
            return response.data
        } catch (error) {
            this.logError({
                error,
                operation: "variant.delete",
            })
            throw error
        }
    }

    // =========================================================================
    // Misc.
    // =========================================================================

    public async getStats(): Promise<Responses.UsageStatistics> {
        const url = urlJoin(this.BASE_URL, "accounts", this.accountId, "images", "v1", "stats")
        try {
            const response = await axios.get<Responses.UsageStatistics>(url, this.config())
            this.logResponse({
                operation: "usageStatistics.get",
                response: response?.data,
            })
            return response.data
        } catch (error) {
            this.logError({
                error,
                operation: "usageStatistics.get",
            })
            throw error
        }
    }

    // =========================================================================
    // Helpers
    // =========================================================================

    private logResponse(data: LogResponseArgs): void {
        if (this.options.logResponses !== true) { return null }
        this.logger?.debug(data)
    }

    private logError(data: LogErrorArgs): void {
        if (this.options.logErrors !== true) { return null }
        this.logger?.error(data)
    }

    private get apiKey(): string { return this.options.apiKey }

    private get accountId(): string { return this.options.accountId }

    private config(otherHeaders: any = {}): AxiosRequestConfig {
        return {
            headers: {
                "Authorization": `Bearer ${this.apiKey}`,
                ...otherHeaders,
            },
        }
    }
}
