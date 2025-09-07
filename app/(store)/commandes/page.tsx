import { imageUrl } from '@/lib/imageUrl'
import { getMyOrders } from '@/sanity/lib/orders/getMyOrders'
import { auth } from '@clerk/nextjs/server'
import Image from 'next/image'
import { redirect } from 'next/navigation'

async function Orders() {
  const { userId } = await auth()

  if (!userId) {
    return redirect('/')
  }

  const orders = await getMyOrders(userId)
  // let totalPrice = 0;
  // orders.map(order=>{
  //   totalPrice = order.products?.reduce((total, item)=> total + (item.quantity! * item.product?.price!), 0)
  // })

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4'>
      <div className='bg-white p-4 sm:p-8 rounded-xl shadow lg w-full max-w-4xl'>
        <h1 className='text-4xl font-bold text-gray-900 tracking-tight mb-8'>
          Mes commandes
        </h1>
        {orders.length === 0 ? (
          <div className='text-center text-gray-600'>
            <p>Aucun historique de commandes</p>
          </div>
        ) : (
          <div className='space-y-6 sm:space-y-8'>
            {orders.map((order) => (
              <div
                key={order.orderNumber}
                className='bg-white border-gray-200 rounded-lg shadow-sm overflow-hidden'
              >
                <div className='p-4 sm:p-6 border-b border-gray-200'>
                  <div className='flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-4'>
                    <div>
                      <p className='text-sm text-gray-600 mb-1 font-bold'>
                        N° de commande:
                      </p>
                      <p className='font-mono text-sm text-bold break-all text-gold'>
                        {order.orderNumber}
                      </p>
                    </div>
                    <div className='sm:text-right'>
                      <p className='text-sm text-gray-600 mb-1'>
                        Date de la commande:
                      </p>
                      <p className='font-medium'>
                        {order.orderDate
                          ? new Date(order.orderDate).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center p-4'>
                  <div className='flex items-center'>
                    <span className='text-sm mr-2'>Statut:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${order.status === 'paid' ? 'bg-gold text-white' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className='sm:text-right'>
                    <p className='text-sm text-gray-600 mb-1'>Montant total:</p>
                    <p className='font-bold text-lg'>
                      {order.products
                        ?.reduce((total, item) => {
                          const quantity = item.quantity || 0
                          const price = item.product?.price || 0
                          return total + quantity * price
                        }, 0)
                        .toLocaleString()}{' '}
                      FCFA
                    </p>
                  </div>

                  {order.amountDiscount ? (
                    <div className='mt-4 p-3 sm:p-4 bg-red-50 rounded-lg'>
                      <p className='text-red-600 font-medium mb-1 text-sm sm:text-base'>
                        Réduction appliquée: {order.amountDiscount} FCFA
                      </p>
                      <p className='text-sm text-gray-600'>
                        Prix original:{' '}
                        {order.products?.map((product) => (
                          <span key={product.product?._id}>
                            {product.product && product.product.price != null
                              ? product.quantity! * product.product.price +
                                order.amountDiscount!
                              : 'N/A'}{' '}
                            FCFA
                          </span>
                        ))}
                      </p>
                    </div>
                  ) : null}
                </div>
                <div className='px-4 py-3 sm:px-6 sm:py-4'>
                  <p className='text-sm font-semibold text-gray-600 mb-3 sm:mb-4'>
                    Liste des articles commandés
                  </p>
                  <div className='space-y-3 sm:space-y-4'>
                    {order.products?.map((product) => (
                      <div
                        key={product.product?._id}
                        className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-2 border-b last:border-b-0'
                      >
                        <div className='flex ietms-center gap-3 sm:gap-4'>
                          {product.product?.image && (
                            <div className='relative h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 rounded-md overflow-hidden'>
                              <Image
                                src={imageUrl(product.product.image).url()}
                                alt={product.product.name ?? ''}
                                fill
                                className='object-cover'
                              />
                            </div>
                          )}
                          <div>
                            <p className='font-medium text-sm sm:text-base'>
                              {product.product?.name}
                            </p>
                            <p className='text-sm text-graay-600'>
                              Qté: {product.quantity ?? 'N/A'}
                            </p>
                          </div>
                        </div>
                        <p className='font-medium text-right'>
                          {product.product?.price && product.quantity
                            ? `${product.product?.price * product.quantity} FCFA`
                            : 'N/A'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
