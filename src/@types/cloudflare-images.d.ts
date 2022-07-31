declare module "cloudflare-images" {
    export = Cloudflare;
    namespace Cloudflare {

        export interface UsageStats {
            count: {
                current: number
                allowed: number
            }
        }

        // =====================================================================
        // Images
        // =====================================================================
        export namespace Images {
            export interface Image {
                id: string
                filename: string
                /** timestamp */
                uploaded: string
                requireSignedURLs: boolean
                variants: string[]
            }

            export interface ImageList {
                images: Image[]
            }
        }

        // =====================================================================
        // Variants
        // =====================================================================
        export namespace Variants {
            export namespace VariantFits {
                /**
                 * Image will be shrunk in size to fully fit within the given width or height,
                 * but will not be enlarged.
                 */
                export type ScaleDown = "scale-down"
                /**
                 * Image will be resized (shrunk or enlarged) to be as large as possible within
                 * the given width or height while preserving the aspect ratio.
                 */
                export type Contain = "contain"
                /**
                 * Image will be resized to exactly fill the entire area specified by
                 * width and height, and will be cropped if necessary.
                 */
                export type Cover = "cover"
                /**
                 * Image will be shrunk and cropped to fit within the area specified by width and height.
                 * The image will not be enlarged.
                 * For images smaller than the given dimensions it is the same as `scale-down`.
                 * For images larger than the given dimensions, it is the same as `cover`.
                 */
                export type Crop = "crop"
                /**
                 * Image will be resized (shrunk or enlarged) to be as large as possible within the
                 * given width or height while preserving the aspect ratio, and the extra area will
                 * be filled with a background color (white by default).
                 */
                export type Pad = "pad"
            }

            /** The fit property describes how the width and height dimensions should be interpreted. */
            export type VariantFit =
                | VariantFits.ScaleDown
                | VariantFits.Contain
                | VariantFits.Cover
                | VariantFits.Crop
                | VariantFits.Pad

            export interface Variant {
                /** API item identifier tag. */
                id: string
                /** Allows you to define image resizing sizes for different use cases. */
                options: {
                    /** The fit property describes how the width and height dimensions should be interpreted. */
                    fit: VariantFit
                    /** What EXIF data should be preserved in the output image. */
                    metadata?: "keep" | "copyright" | "none"
                    /** Maximum width in image pixels. */
                    width: number
                    /** Maximum height in image pixels. */
                    height: number
                    /** Indicates whether the variant can access an image without a signature, regardless of image access control. */
                    neverRequireSignedURLs?: boolean
                }
            }

            export interface VariantList {
                variants: { [key: string]: Variant }
            }
        }

        // =====================================================================
        // Responses
        // =====================================================================
        export namespace Responses {
            export interface Response<T = any> {
                result: T
                result_info: any
                success: boolean
                errors: any[]
                messages: any[]
            }
            export type UploadImage     = Response<Images.Image>
            export type DeleteImage     = Response
            export type ListImages      = Response<Images.ImageList>
            export type ImageDetails    = Response<ImageData>
            export type Variant         = Response<Variants.Variant>
            export type ListVariants    = Response<Variants.VariantList>
            export type UsageStatistics = Response<UsageStats>
        }

        // =====================================================================
        // Requests
        // =====================================================================
        export namespace Requests {
            export interface ImageUpload {
                id: string
                fileName: string
                fileData: Blob
                /**
                 * User modifiable key-value store.
                 * Can use used for keeping references to another system of record for managing images.
                 * @default {}
                 */
                metadata?: any
                /**
                 * Indicates whether the image requires a signature token for the access.
                 * @default false
                 */
                requireSignedURLs?: boolean
                // /**
                //  * A URL to fetch an image from origin.
                //  * Mutually exclusive with `file` parameter.
                //  */
                // url?: string
            }
            export interface ListImages {
                /**
                 * Page number.
                 * @default 1
                 */
                page?: number
                /**
                 * Number of results per page.
                 * Min of 10, max of 100.
                 * @default 100
                 */
                per_page?: number
            }
            export interface CreateVariant extends Variants.Variant { }
        }

        // =========================================================================
        // Client
        // =========================================================================
        export interface Credentials {
            /**
             * API key generated on the [My Account](https://dash.cloudflare.com/profile/api-tokens) page.
             */
            apiKey: string
            accountId: string
        }

        export interface CloudflareClientOptions extends Credentials { }

        export class CloudflareClient {
            constructor(options: CloudflareClientOptions)
            /**
             * Upload an image with up to 10 Megabytes using a single HTTP POST (multipart/form-data) request.
             *
             * [API Docs](https://api.cloudflare.com/#cloudflare-images-upload-an-image-using-a-single-http-request)
             */
            uploadImage(request: Requests.ImageUpload): Promise<Responses.UploadImage>
            /**
             * List up to 100 images with one request. Use the optional parameters below to get a specific range of images.
             *
             * [API Docs](https://api.cloudflare.com/#cloudflare-images-list-images)
             */
            listImages(request: Requests.ListImages): Promise<Responses.ListImages>
            /**
             * Delete an image on Cloudflare Images. On success, all copies of the image are deleted and purged from cache.
             *
             * [API Docs](https://api.cloudflare.com/#cloudflare-images-delete-image)
             */
            deleteImage(imageId: string): Promise<Responses.DeleteImage>
            /**
             * Fetch details for a single image.
             *
             * [API Docs](https://api.cloudflare.com/#cloudflare-images-image-details)
             */
            getImageDetails(imageId: string): Promise<Responses.ImageDetails>
            /**
             * Fetch details for a single image.
             *
             * [API Docs](https://api.cloudflare.com/#cloudflare-images-variants-create-a-variant)
             * [Cloudflare Docs](https://developers.cloudflare.com/images/cloudflare-images/transform/resize-images/)
             */
            createImageVariant(options: Variants.Variant): Promise<Responses.Variant>
            /**
             * Lists existing variants.
             *
             * [API Docs](https://api.cloudflare.com/#cloudflare-images-variants-list-variants)
             */
            listVariants(): Promise<Responses.ListVariants>
            /**
             * Fetch usage statistics details for Cloudflare Images.
             *
             * [API Docs](https://api.cloudflare.com/#cloudflare-images-images-usage-statistics)
             */
            getStats(): Promise<Responses.UsageStatistics>
        }

    }
}
