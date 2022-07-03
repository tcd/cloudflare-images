declare module "cloudflare-images" {

    // =========================================================================
    // Responses
    // =========================================================================

    export interface CloudflareResponse<T = any> {
        result: T
        result_info: any
        success: boolean
        errors: any[]
        messages: any[]
    }

    export interface CloudflareImageData {
        id: string
        filename: string
        /** timestamp */
        uploaded: string
        requireSignedURLs: boolean
        variants: string[]
    }

    export interface CloudflareImageListData {
        images: CloudflareImageData[]
    }

    /** Image will be shrunk in size to fully fit within the given width or height, but will not be enlarged. */
    export type VariantFit_ScaleDown = "scale-down"
    /** Image will be resized (shrunk or enlarged) to be as large as possible within the given width or height while preserving the aspect ratio. */
    export type VariantFit_Contain = "contain"
    /** Image will be resized to exactly fill the entire area specified by width and height, and will be cropped if necessary. */
    export type VariantFit_Cover = "cover"
    /** Image will be shrunk and cropped to fit within the area specified by width and height. The image will not be enlarged. For images smaller than the given dimensions it is the same as `scale-down`. For images larger than the given dimensions, it is the same as `cover`. */
    export type VariantFit_Crop = "crop"
    /** Image will be resized (shrunk or enlarged) to be as large as possible within the given width or height while preserving the aspect ratio, and the extra area will be filled with a background color (white by default). */
    export type VariantFit_Pad = "pad"

    /** The fit property describes how the width and height dimensions should be interpreted. */
    export type VariantFit =
        | VariantFit_ScaleDown
        | VariantFit_Contain
        | VariantFit_Cover
        | VariantFit_Crop
        | VariantFit_Pad

    export interface CloudflareVariant {
        /**
         * API item identifier tag
         */
        id: string
        /**
         * Allows you to define image resizing sizes for different use cases.
         */
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

    export type CloudflareUploadImageResponse  = CloudflareResponse<CloudflareImageData>
    export type CloudflareDeleteImageResponse  = CloudflareResponse
    export type CloudflareListImagesResponse   = CloudflareResponse<CloudflareImageListData>
    export type CloudflareImageDetailsResponse = CloudflareResponse<CloudflareImageData>
    export type CloudflareVariantResponse      = CloudflareResponse<CloudflareVariant>
}
