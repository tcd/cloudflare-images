import { CloudflareClient } from "../src"
import { credentials } from "./credentials"

export const list = async (): Promise<void> => {
    const client = new CloudflareClient(credentials)
    // const response = await client.listImages({
    //     per_page: 10,
    // })
    const response = await client.getStats()
    console.log(response)
}
