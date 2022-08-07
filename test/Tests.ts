import { join } from "path"
import { readFile } from "fs/promises"
// import { CloudflareClient } from "../src"
import { CloudflareClient } from "../src/lib/CloudflareClient.v2"
import { credentials } from "./credentials"
import { BASE_64_IMAGES } from "./base-64-images"

export type CloudflareOperation =
    | "image.list"
    | "image.get"
    | "image.create"
    | "image.update"
    | "image.delete"
    // | "image.download"
    | "variant.list"
    | "variant.get"
    | "variant.create"
    | "variant.update"
    | "variant.delete"
    | "usageStatistics.get"

export class Tests {
    public client: CloudflareClient

    constructor() {
        this.client = new CloudflareClient({
            ...credentials,
            logger: console,
            logErrors: true,
        })
    }

    public async test(operation: CloudflareOperation): Promise<unknown> {
        const args = {
            variantId: "testing",
            imageId: "testing/w3c",
        }
        let response: any = {}
        switch (operation) {
            // -----------------------------------------------------------------
            // Images
            // -----------------------------------------------------------------
            case "image.list":   response = await this.listImages(); break
            case "image.get":    response = await this.getImage(args.imageId); break
            case "image.create": response = await this.createImage(); break
            case "image.update": response = await this.updateImage(args.imageId); break
            case "image.delete": response = await this.deleteImage(args.imageId); break
            // -----------------------------------------------------------------
            // Variants
            // -----------------------------------------------------------------
            case "variant.list":   response = await this.listVariants(); break
            case "variant.get":    response = await this.getVariant(args.variantId); break
            case "variant.create": response = await this.createVariant(); break
            case "variant.update": response = await this.updateVariant(); break
            case "variant.delete": response = await this.deleteVariant(args.variantId); break
            // -----------------------------------------------------------------
            // Misc.
            // -----------------------------------------------------------------
            case "usageStatistics.get": response = await this.getStats(); break
            default:
                console.log("no matching operation found")
                process.exit(1)
        }

        console.log(JSON.stringify(response, null, 2))
        return null
    }

    // =========================================================================
    // Upload Image
    // =========================================================================

    async createImage(): Promise<any> {
        return this.fromBuffer()
    }

    async fromBuffer(): Promise<any> {
        const path = join(__dirname, "fixtures", "images", "w3c_home.png")
        const file = await readFile(path)
        const options = {
            id: "testing/w3c",
            fileName: "other-name.png",
            metadata: {
                updatedAt: new Date().toISOString(),
            },
        }
        const response = await this.client.createImageFromBuffer(options, file)
        return response
    }

    async fromFile(): Promise<any> {
        const path = join(__dirname, "fixtures", "images", "w3c_home.png")
        const options = {
            id: "testing/w3c",
            fileName: "other-name.png",
            metadata: {
                updatedAt: new Date().toISOString(),
            },
        }
        const response = await this.client.createImageFromFile(options, path)
        return response
    }

    // =========================================================================
    // Images
    // =========================================================================

    async listImages(): Promise<any> {
        const response = await this.client.listImages({
            page: 1,
            per_page: 10,
        })
        return response
    }

    async getImage(imageId: string): Promise<any> {
        const response = await this.client.getImage(imageId)
        return response
    }

    async updateImage(imageId: string): Promise<any> {
        const response = await this.client.updateImage(imageId, {
            metadata: {
                updatedAt: new Date().toISOString(),
            },
        })
        return response
    }

    async deleteImage(imageId: string): Promise<any> {
        const response = await this.client.deleteImage(imageId)
        return response
    }

    // =========================================================================
    // Variants
    // =========================================================================

    async listVariants(): Promise<any> {
        const response = await this.client.listVariants()
        return response
    }

    async getVariant(variantId: string): Promise<any> {
        const response = await this.client.getVariant(variantId)
        return response
    }

    async createVariant(): Promise<any> {
        const response = await this.client.createVariant({
            id: "testing",
            options: {
                fit: "cover",
                metadata: "none",
                width: 69,
                height: 69,
                neverRequireSignedURLs: true,
            },
        })
        return response
    }

    async deleteVariant(variantId: string): Promise<any> {
        const response = await this.client.deleteVariant(variantId)
        return response
    }

    async updateVariant(): Promise<any> {
        const response = await this.client.updateVariant("testing", {
            options: {
                fit: "pad",
                metadata: "copyright",
                width: 420,
                height: 69,
                neverRequireSignedURLs: true,
            },
        })
        return response
    }

    // =========================================================================
    // Misc.
    // =========================================================================

    async getStats(): Promise<any> {
        const response = await this.client.getStats()
        return response
    }
}

