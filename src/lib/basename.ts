export const basename = (input: string): string => {
    return input.replace(/\.[^/.]+$/, "")
}
