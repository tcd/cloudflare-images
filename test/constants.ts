// import { CloudflareClient } from "../src"

const TResources = {
    "image":           "image",
    "variant":         "variant",
    "usageStatistics": "usageStatistics",
} as const

type TResourceKey = keyof typeof TResources
export type TResource = typeof TResources[TResourceKey]

const TOperations = {
    "list":   "list",
    "get":    "get",
    "create": "create",
    "update": "update",
    "delete": "delete",
} as const

type TOperationsKey = keyof typeof TOperations
export type TOperation = typeof TOperations[TOperationsKey]
