import type { Method } from "axios"
import type { Operation } from "cloudflare-images"
import Cloudflare from "cloudflare-images"
import { urlJoin } from "./url-join"

const BASE_URL = "https://api.cloudflare.com/client/v4"

export const OperationUrls: Record<Operation, any> = {
    "image.create":        (accountId: string)                    => urlJoin(BASE_URL, "accounts", accountId, "images", "v1"),
    "image.list":          (accountId: string)                    => urlJoin(BASE_URL, "accounts", accountId, "images", "v1"),
    "image.get":           (accountId: string, imageId: string)   => urlJoin(BASE_URL, "accounts", accountId, "images", "v1", imageId),
    "image.update":        (accountId: string, imageId: string)   => urlJoin(BASE_URL, "accounts", accountId, "images", "v1", imageId),
    "image.delete":        (accountId: string, imageId: string)   => urlJoin(BASE_URL, "accounts", accountId, "images", "v1", imageId),
    "image.download":      (accountId: string, imageId: string)   => urlJoin(BASE_URL, "accounts", accountId, "images", "v1", imageId, "blob"),
    "variant.create":      (accountId: string)                    => urlJoin(BASE_URL, "accounts", accountId, "images", "v1", "variants"),
    "variant.list":        (accountId: string)                    => urlJoin(BASE_URL, "accounts", accountId, "images", "v1", "variants"),
    "variant.get":         (accountId: string, variantId: string) => urlJoin(BASE_URL, "accounts", accountId, "images", "v1", "variants", variantId),
    "variant.update":      (accountId: string, variantId: string) => urlJoin(BASE_URL, "accounts", accountId, "images", "v1", "variants", variantId),
    "variant.delete":      (accountId: string, variantId: string) => urlJoin(BASE_URL, "accounts", accountId, "images", "v1", "variants", variantId),
    "usageStatistics.get": (accountId: string)                    => urlJoin(BASE_URL, "accounts", accountId, "images", "v1", "variants"),
}

export const OperationMethods: Record<Operation, Method> = {
    "image.create":        "POST",
    "image.list":          "GET",
    "image.get":           "GET",
    "image.update":        "PATCH",
    "image.delete":        "DELETE",
    "image.download":      "GET",
    "variant.create":      "POST",
    "variant.list":        "GET",
    "variant.get":         "GET",
    "variant.update":      "PATCH",
    "variant.delete":      "DELETE",
    "usageStatistics.get": "GET",
}

type TypeMap<Type> = {
    [Property in keyof Type]: Type[Property];
}

class IOperationRequests implements Record<Operation, any> {
    ["image.create"]:        Cloudflare.Requests.CreateImage
    ["image.list"]:          Cloudflare.Requests.ListImages
    ["image.get"]:           undefined
    ["image.update"]:        Cloudflare.Requests.UpdateImage
    ["image.delete"]:        undefined
    ["image.download"]:      undefined
    ["variant.create"]:      Cloudflare.Requests.CreateVariant
    ["variant.list"]:        undefined
    ["variant.get"]:         undefined
    ["variant.update"]:      Cloudflare.Requests.UpdateVariant
    ["variant.delete"]:      undefined
    ["usageStatistics.get"]: undefined
}

class IOperationResponses implements Record<Operation, any> {
    ["image.create"]:        Cloudflare.Responses.CreateImage
    ["image.list"]:          Cloudflare.Responses.ListImages
    ["image.get"]:           Cloudflare.Responses.GetImage
    ["image.update"]:        Cloudflare.Responses.UpdateImage
    ["image.delete"]:        Cloudflare.Responses.DeleteImage
    ["image.download"]:      Blob
    ["variant.create"]:      Cloudflare.Responses.CreateVariant
    ["variant.list"]:        Cloudflare.Responses.ListVariants
    ["variant.get"]:         Cloudflare.Responses.GetVariant
    ["variant.update"]:      Cloudflare.Responses.UpdateVariant
    ["variant.delete"]:      Cloudflare.Responses.DeleteVariant
    ["usageStatistics.get"]: Cloudflare.Responses.UsageStatistics
}

export type OperationRequests = TypeMap<IOperationRequests>
export type OperationResponses = TypeMap<IOperationResponses>
