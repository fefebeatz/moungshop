import AddToBasketButton from '@/components/AddToBasketButton';
import { imageUrl } from '@/lib/imageUrl';
import { getProductBySlug } from '@/sanity/lib/products/getProductBySlug';
import { PortableText } from 'next-sanity';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import React from 'react'

async function ArcticlePage({ params } : {params: Promise<{ slug: string }>}) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    
    
    if (!product)
    {
        return notFound();
    }

    const isOutOfStock = product.stock != null && product.stock <= 0;
  return (
    <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={`relative aspect-square overflow-hidden rounded-lg shadow-lg ${isOutOfStock ? "opacity-20": ""}`}>
                {
                    product.image && (
                        <Image
                            src={imageUrl(product.image).url()}
                            alt={product.name ?? "Image de l'article"}
                            fill
                            className="object-contain transition-transform duration-300 hover:scale-105"
                        />
                    )
                }
                {
                    isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <span className="text-white font-bold text-lg">En rupture de stock</span>
                        </div>
                    )
                }
            </div>

            <div className="flex flex-col justify-between">
                <div className="">
                    <h1 className="text-3xl font-bold mb-4 text-gold">{product.name}</h1>
                    <div className="text-xl font-semibold mb-4">
                        {product.price} FCFA
                    </div>
                    <div className="prose max-w-none mb-6">
                        {
                            Array.isArray(product.description) && (
                                <PortableText value={product.description} />
                            )
                        }
                    </div>
                </div>
                <div className="mt-6">
                    <AddToBasketButton product={product} disabled={isOutOfStock} />
                </div>
            </div>
        </div>
    </div>
  )
}

export default ArcticlePage