'use server';

import { imageUrl } from "@/lib/imageUrl";
import stripe from "@/lib/stripe";
import { BasketItem } from "@/sanity/lib/store/store";
import { client } from "@/sanity/lib/backendClient";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { randomUUID } from "crypto";

export type Metadata = {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    clerkUserId: string;
}

export type GroupedBasketItem = {
    product : BasketItem["product"];
    quantity: number;
}

export async function createCheckOutSession(
    items: GroupedBasketItem[],
    metadata: Metadata
){
    try {
        const itemsWithoutPrice = items.filter((item)=> !item.product.price);
        if(itemsWithoutPrice.length > 0)
        {
            throw new Error("Le prix de certains articles n'a pas été renseigné.")
        }

        // recherche du client par email sur stripe
        const customers = await stripe.customers.list({
            email: metadata.customerEmail,
            limit: 1
        })

        let customerID: string | undefined;
        if(customers.data.length > 0)
        {
            customerID = customers.data[0].id;
        }

        const baseURL = process.env.NODE_ENV === "production"
        ? `https://${process.env.VERCEL_URL}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}`

        const successURL = `${baseURL}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`;
        const cancelURL = `${baseURL}/panier`

        const session = await stripe.checkout.sessions.create({
            customer: customerID,
            customer_creation: customerID ? undefined : "always",
            customer_email: !customerID ? metadata.customerEmail : undefined,
            metadata,
            mode: "payment",
            allow_promotion_codes: true,
            success_url: successURL,
            cancel_url: cancelURL,
            line_items: items.map((item)=>({
                price_data: {
                    currency: "XAF",
                    unit_amount: item.product.price!,
                    product_data: {
                        name: item.product.name || "Article sans dénomination",
                        description: `ID Article: ${item.product._id}`,
                        metadata: {
                            id: item.product._id,
                        },
                        images: item.product.image ? [imageUrl(item.product.image).url()] : undefined,
                    },
                },
                quantity: item.quantity,
            }))
        })

        return session.url;

    } catch (error) {
        console.error("Erreur lors de la création de la session de paiement:", error)
        throw error;
    }
}

// export async function createCheckOutSession(
//     items: GroupedBasketItem[],
//     metadata: Metadata
//   ) {
//     try {
//       // Validation des prix
//       const itemsWithoutPrice = items.filter((item) => !item.product.price);
//       if (itemsWithoutPrice.length > 0) {
//         throw new Error("Le prix de certains articles n'a pas été renseigné.");
//       }
  
//       // Création de la commande dans Sanity (statut pending)
//       const orderId = uuidv4();
//       const totalAmount = items.reduce((sum, item) => sum + (item.product.price! * item.quantity), 0);
  
//       await client.create({
//         _type: 'order',
//         _id: orderId,
//         orderNumber: metadata.orderNumber,
//         customerName: metadata.customerName,
//         customerEmail: metadata.customerEmail,
//         clerkUserId: metadata.clerkUserId,
//         products: items.map(item => ({
//           product: { _type: 'reference', _ref: item.product._id },
//           quantity: item.quantity
//         })),
//         status: 'pending',
//         orderDate: new Date().toISOString(),
//         totalPrice: totalAmount,
//         currency: 'XOF'
//       });
  
//       // Configuration MTN MoMo
//       const authString = Buffer.from(`${process.env.MTN_USER_ID}:${process.env.MTN_API_KEY}`).toString('base64');
      
      
//       // 1. Obtenir le token d'accès
//       const getToken = await axios.post(
//         `${process.env.MTN_API_URL}/collection/token/`,
//         {},
//         {
//           headers: {
//             Authorization: `Basic ${authString}`,
//             'Ocp-Apim-Subscription-Key': process.env.MTN_SUBSCRIPTION_KEY
//           }
//         }
//       );

//       // 2. Initier le paiement
//       const paymentData = {
//         amount: totalAmount.toString(),
//         currency: 'EUR',
//         externalId: "068891349",
//         payer: {
//           partyIdType: 'MSISDN',
//           partyId: '225068891349' // Numéro de test par défaut
//         },
//         payerMessage: `Paiement pour commande ${metadata.orderNumber}`,
//         payeeNote: 'Merci pour votre achat'
//       };
  
//       const  {data}  = await axios.post(
//         `${process.env.MTN_API_URL}/collection/v1_0/requesttopay`,
//         paymentData,
//         {
//           headers: {
//             Authorization: `Bearer ${getToken.data.access_token}`,
//             'X-Reference-Id': orderId,
//             'X-Target-Environment': process.env.MTN_TARGET_ENVIRONMENT,
//             'Ocp-Apim-Subscription-Key': process.env.MTN_SUBSCRIPTION_KEY,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
//       return { 
//         success: true,
//         transactionId: data,
//         orderId
//       };
  
//     } catch (error) {
//       console.error("Erreur lors de la création de la session MoMo:", error);
//       throw error;
//     }
//   }