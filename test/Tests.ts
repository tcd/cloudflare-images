import { CloudflareClient } from "../src"
import { credentials } from "./credentials"

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
            case "image.list":   response = await this.listImages();  break
            case "image.get":    response = await this.getImage();    break
            // case "image.create": response = await this.createImage(); break
            case "image.update": response = await this.updateImage(); break
            case "image.delete": response = await this.deleteImage(); break
            // -----------------------------------------------------------------
            // Variants
            // -----------------------------------------------------------------
            // case "variant.list":   response = await this.listVariants();  break
            // case "variant.get":    response = await this.getVariant();    break
            case "variant.create": response = await this.createVariant(); break
            case "variant.update": response = await this.updateVariant(); break
            case "variant.delete": response = await this.deleteVariant(); break
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
    // Images
    // =========================================================================

    async listImages(): Promise<any> {
        const response = await this.client.listImages({
            page: 1,
            per_page: 10,
        })
        return response
    }

    async getImage(): Promise<any> {
        const response = await this.client.getImage("misc/random-bullshit")
        return response
    }

    async updateImage(): Promise<any> {
        const response = await this.client.updateImage("misc/random-bullshit", {
            metadata: {
                someKey: "this image has metadata now",
            },
        })
        return response
    }

    async deleteImage(): Promise<any> {
        const response = await this.client.deleteImage("misc/random-bullshit")
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

    async deleteVariant(): Promise<any> {
        const response = await this.client.deleteVariant("xxx")
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

