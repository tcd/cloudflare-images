import type { AxiosError } from "axios"

// https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
export const isAxiosError = (value: any): value is AxiosError => {
    return value?.isAxiosError === true
}
