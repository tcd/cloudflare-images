import { join } from "path"
import { createReadStream } from "fs"
import { CloudflareClient } from "../src"
import { credentials } from "./credentials"
import { readFile } from "fs/promises"

export type CloudflareOperation =
    | "image.list"
    | "image.get"
    | "image.create"
    | "image.update"
    | "image.delete"
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
        let response: any = {}
        switch (operation) {
            // -----------------------------------------------------------------
            // Images
            // -----------------------------------------------------------------
            case "image.list":   response = await this.listImages(); break
            case "image.get":    response = await this.getImage("testing/w3c"); break
            case "image.create": response = await this.createImage(); break
            case "image.update": response = await this.updateImage("misc/random-bullshit"); break
            case "image.delete": response = await this.deleteImage("testing/w3c"); break
            // -----------------------------------------------------------------
            // Variants
            // -----------------------------------------------------------------
            // case "variant.list":   response = await this.listVariants();  break
            // case "variant.get":    response = await this.getVariant();    break
            case "variant.create": response = await this.createVariant(); break
            case "variant.update": response = await this.updateVariant(); break
            case "variant.delete": response = await this.deleteVariant("xxx"); break
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
        return this.fromFile()
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
        const response = await this.client.updateVariant("xxx", {
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

