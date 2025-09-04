"use client"
import { imageUrl } from "@/lib/imageUrl";
import { Product } from "@/sanity.types";
import Image from "next/image";
import Link from "next/link";

function ProductThumb({product}: { product: Product }){
    // si le produit est encore en stock
    const isOutOfStock = product.stock != null && product.stock <= 0
    return (
        <Link
        href={`/article/${product.slug?.current}`}
        className={`group flex flex-col bg-white rounded-lg border border-gray-200 w-200 h-100
        shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${ isOutOfStock ? "opacity-50" : "" }    
        `}
        >
            <div className="relative aspect-square w-full h-full overflow-hidden">
                {
                    product.image && (
                        <Image
                            className="object-contain transition-transform duration-300 group-hover:scale-105"
                            src={imageUrl(product.image).url()}
                            alt={product.name || "Image de l'article"}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    )
                }
                
                {
                    isOutOfStock &&(
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="text-white font-bold text-lg">En rupture de stock</div>
                        </div>
                    )
                }
            </div>
            <div className="p-4">
                <h2 className="text-lg font-semibold text-gold truncate">{product.name}</h2>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {
                        product.description?.map((block)=>
                            block._type === "block"
                            ? block.children?.map((child)=>child.text).join("")
                            : ""
                        ).join(" ") || "Aucune description"
                    }
                </p>
                <p className="mt-2 text-lg font-bold text-gray-900">
                    {product.price} FCFA
                </p>
            </div>
        </Link>
    )
}

export default ProductThumb;