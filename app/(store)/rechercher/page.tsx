import ProductGrid from '@/components/ProductGrid';
import { searchProductsByName } from '@/sanity/lib/products/searchProductsByName';
import React from 'react'

async function SearchPage({
    searchParams,
}:{
    searchParams: {
        query: string
    }
}) {

    const { query } = await searchParams;
    const products = await searchProductsByName(query);

    if(!products.length)
    {
      return (
        <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-center">Aucun article trouvé pour: {query}</h1>
            <p className="text-gray-600 text-center">
              Réessayez avec autre chose.
            </p>
          </div>
        </div>
      )
    }

  return (
    <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        {
          products.length == 1 && (
            <h1 className="text-3xl font-bold mb-6 text-center">
              Résultat de la recherche pour: {query}
            </h1>
          )
        }
        {
          products.length > 1 && (
            <h1 className="text-3xl font-bold mb-6 text-center">
              Résultats de la recherche pour: {query}
            </h1>
          )
        }

        <ProductGrid products={products} />
      </div>
    </div>
  )
}

export default SearchPage