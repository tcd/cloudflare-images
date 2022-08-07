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
import { OperationMethods, OperationRequests, OperationUrls } from "./data"

interface LogErrorArgs {
    operation: Operation
    error: any
}

interface LogResponseArgs {
    operation: Operation
    response: any
}

interface RequestArgs {
    operation: Operation
    urlArgs?: any[]
    params?: Record<string, any>
    headers?: Record<string, string>
    body?: OperationRequests[Operation]
}
const defaultRequestArgs: RequestArgs = {
    operation: null,
    urlArgs: [],
    params: {},
    headers: {},
    body: undefined,
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

    private async request<TResponse>(requestArgs: RequestArgs): Promise<TResponse> {
        try {
            requestArgs = { ...defaultRequestArgs, ...requestArgs }
            const {
                operation,
                urlArgs,
                params,
                headers,
                body,
            } = { ...defaultRequestArgs, ...requestArgs }
            const config: AxiosRequestConfig = {
                url: OperationUrls[operation](...urlArgs),
                method: OperationMethods[operation],
                headers: {
                    "Authorization": `Bearer ${this.apiKey}`,
                    ...headers,
                },
            }
            if (isBlank(params)) { config.params = params }
            if (isBlank(body))   { config.data = body }
            const response = await axios.request<TResponse>(config)
            this.logResponse({ operation, response: response?.data })
            return response.data
        } catch (error) {
            this.logError({ error, operation: "image.list" })
            throw error
        }
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
            } = { ...DefaultRequests["image.create"] as Requests.CreateImage, ...request }
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
            } = { ...DefaultRequests["image.create"] as Requests.CreateImage, ...request }
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
            } = { ...DefaultRequests["image.create"] as Requests.CreateImage, ...request }
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

    public async listImages(request: Requests.ListImages = {}): Promise<Responses.ListImages> {
        return await this.request({
            operation: "image.list",
            params: {
                ...DefaultRequests["image.list"],
                ...request,
            },
        })
    }

    public async getImage(imageId: string): Promise<Responses.GetImage> {
        return await this.request({
            operation: "image.get",
            urlArgs: [imageId],
        })
    }

    public async downloadImage(imageId: string): Promise<Blob> {
        return await this.request({
            operation: "image.download",
            urlArgs: [imageId],
        })
    }

    // public async downloadImage(imageId: string): Promise<Blob> {
    //     try {
    //         const url = urlJoin(this.BASE_URL, "accounts", this.accountId, "images", "v1", imageId, "blob")
    //         const response = await axios.get<Blob>(url, this.config())
    //         this.logResponse({
    //             operation: "image.download",
    //             response: response?.data,
    //         })
    //         return response.data
    //     } catch (error) {
    //         this.logError({
    //             error,
    //             operation: "image.download",
    //         })
    //         throw error
    //     }
    // }

    public async updateImage(imageId: string, options: Requests.UpdateImage): Promise<Responses.UpdateImage> {
        return await this.request({
            operation: "image.update",
            urlArgs: [imageId],
            body: options,
        })
    }

    public async deleteImage(imageId: string): Promise<Responses.DeleteImage> {
        return await this.request({
            operation: "image.delete",
            urlArgs: [imageId],
        })
    }

    // =========================================================================
    // Variants
    // =========================================================================

    public async createVariant(options: Requests.CreateVariant): Promise<Responses.CreateVariant> {
        return await this.request({
            operation: "variant.create",
            body: options,
        })
    }

    public async listVariants(): Promise<Responses.ListVariants> {
        return await this.request({
            operation: "variant.list",
        })
    }

    public async getVariant(variantId: string): Promise<Responses.GetVariant> {
        return await this.request({
            operation: "variant.get",
            urlArgs: [variantId],
        })
    }

    public async updateVariant(variantId: string, options: Requests.UpdateVariant): Promise<Responses.UpdateVariant> {
        return await this.request({
            operation: "variant.update",
            urlArgs: [variantId],
            body: options,
        })
    }

    public async deleteVariant(variantId: string): Promise<Responses.DeleteVariant> {
        return await this.request({
            operation: "variant.delete",
            urlArgs: [variantId],
        })
    }

    // =========================================================================
    // Misc.
    // =========================================================================

    public async getStats(): Promise<Responses.UsageStatistics> {
        return await this.request({
            operation: "usageStatistics.get",
        })
    }

}
