import { defineQuery } from "next-sanity"
import { sanityFetch } from "../live"

export const searchProductsByName = async (searchParam: string)=>{
    const PRODUCT_SEARCH_QUERY = defineQuery(`
        *[
            _type == "product"
            && name match $searchParam
        ] | order(name asc)
    `)
    try {
        const products = await sanityFetch({
            query: PRODUCT_SEARCH_QUERY,
            params: {
                searchParam: `${searchParam}*`
            }
        })

        return products.data || [];
    } catch (error) {
        console.error("Une erreur s'est produite lors du filtrage des articles par nom:", error)
        return [];
    }
}