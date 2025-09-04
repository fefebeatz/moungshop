"use client";

import { createCheckOutSession, Metadata } from '@/actions/createCheckOutSession';
import AddToBasketButton from '@/components/AddToBasketButton';
import Loader from '@/components/Loader';
import { imageUrl } from '@/lib/imageUrl';
import useBasketStore from '@/sanity/lib/store/store'
import { SignInButton, useAuth, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function BasketPage() {
    const groupedItems = useBasketStore((state) => state.getGroupedItems());
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const router = useRouter();

    const [isClient, setIsClient] = useState(false);
    const [isLoading, setisLoading] = useState(false);

    useEffect(()=>{
        setIsClient(true);
    }, []);

    if(!isClient)
    {
        return <Loader />
    }

    const handleCheckOut = async() => {
        if(!isSignedIn) return;
        setisLoading(true);

        try {
            const metadata: Metadata = {
                orderNumber: crypto.randomUUID(),
                customerName: user?.fullName ?? "Inconnu",
                customerEmail: user?.emailAddresses[0].emailAddress ?? "Inconnu(e)",
                clerkUserId: user!.id
            }

            const checkOutUrl = await createCheckOutSession(groupedItems, metadata);
        
            if(checkOutUrl)
            {
                window.location.href = checkOutUrl;
            }
        } catch (error) {
            console.error("Erreur lors de la création de la session de paiement:", error);
        }finally{
            setisLoading(false);
        }
    }

    // const handleMomoPayment = async () => {
    //     if (!isSignedIn) return;
    //     setisLoading(true);
    
    //     try {
    //       const metadata: Metadata = {
    //         orderNumber: crypto.randomUUID(),
    //         customerName: user?.fullName ?? "Inconnu",
    //         customerEmail: user?.emailAddresses[0].emailAddress ?? "Inconnu(e)",
    //         clerkUserId: user!.id,
    //         customerPhone: "242068891349" // Récupérer le numéro MTN
    //       };
    
    //       await createCheckOutSession(groupedItems, metadata);
    //       const baseURL = process.env.NODE_ENV === "production"
    //     ? `https://${process.env.VERCEL_URL}`
    //     : `${process.env.NEXT_PUBLIC_BASE_URL}`
    //       // Redirection vers l'interface de paiement MTN
    //       window.location.href = `${baseURL}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`;
    
    //     } catch (error) {
    //       console.error("Erreur lors du paiement MoMo:", error);
    //     } finally {
    //       setisLoading(false);
    //     }
    //   };

    if(groupedItems.length === 0)
    {
        return (
            <div className="container mx-auto p-4 flex flex-col items-center justify-center
            min-h-[50vh]">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Votre panier</h1>
                <p className="text-gray-600 text-lg">Votre panier est vide.</p>
            </div>
        )
    }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
        <h1 className="text-2xl font-bold mb-4">Votre panier</h1>
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-grow">
                {
                    groupedItems?.map((item)=>(
                        <div key={item.product._id}
                            className="mb-4 p-4 border rounded flex items-center justify-between"
                            >
                                <div className="flex items-center cursor-pointer flex-1 min-w-0"
                                    onClick={()=>
                                        router.push(`/article/${item.product.slug?.current}`)
                                    }
                                >
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 mr-4">
                                        {
                                            item.product.image && (
                                                <Image
                                                    src={imageUrl(item.product.image).url()}
                                                    alt={item.product.name ?? "Nom de l'article"}
                                                    className="w-full h-full object-cover rounded"
                                                    width={96}
                                                    height={96}
                                                />
                                            )
                                        }
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="text-lg sm:text-xl font-semibold truncate">
                                            {item.product.name}
                                        </h2>
                                        <p className="text-sm sm:text-base">
                                            Prix: {(item.product.price ?? 0) * item.quantity} FCFA
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center ml-4 flex-shrink-0">
                                    <AddToBasketButton product={item.product} />
                                </div>
                        </div>
                    ))
                }
            </div>
            <div className="w-full lg:w-80 lg:sticky lg:top-4 h-fit bg-white p-6 border rounded
            order-first lg:order-last fixed bottom-0 left-0 lg:left-auto
            ">
                <h3 className="text-xl font-semibold">Résumé de la commande</h3>
                <div className="mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Nombre d'article:</span>
                        
                        <span>
                            {groupedItems.reduce((total, item) => total + item.quantity, 0)}
                        </span>
                    </p>
                    <p className="flex justify-between text-2xl font-bold border-t pt-2">
                        <span>Total:</span>
                        <span>{useBasketStore.getState().getTotalPrice()} FCFA</span>
                    </p>
                </div>
                {
                    isSignedIn ? (
                        <button
                            onClick={handleCheckOut}
                            disabled={isLoading}
                            className="mt-4 w-full bg-black text-white px-4 py-2 rounded hover:bg-black
                                        disabled:bg-gray-400 cursor-pointer flex items-center justify-center gap-2"
                            >
                            {isLoading ? "Traitement en cours..." : "Procéder au paiement"}
                            <Image
                                src="/momo.jpg"
                                alt="Logo MoMo"
                                width={50}
                                height={24}
                            />
                        </button>

                    ) : (
                        <SignInButton mode="modal">
                            <button className="mt-4 w-full bg-black text-white px-4 py-2 rounded hover:bg-black">
                                Connectez-vous pour procéder au paiement
                            </button>
                        </SignInButton>
                    )
                }
            </div>
            <div className="h-64 lg:h-0">

            </div>
        </div>
    </div>
  )
}

export default BasketPage