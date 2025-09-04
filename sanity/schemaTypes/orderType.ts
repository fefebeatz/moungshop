import { BasketIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const orderType = defineType({
    name: 'order',
    title: "Commandes",
    type: 'document',
    icon: BasketIcon,
    fields: [
        defineField({
            name: "orderNumber",
            title: "N° de la commande",
            type: "string",
            validation: (Rule) => Rule.required()
        }),
        defineField({
            name: "momoCheckoutSessionID",
            title: "ID de la session de paiement",
            type: "string",
        }),
        defineField({
            name: "momoCustomerID",
            title: "ID client",
            type: "string",
        }),
        defineField({
            name: "customerName",
            title: "Identité du client",
            type: "string",
            validation: (Rule) => Rule.required()
        }),
        defineField({
            name: "customerEmail",
            title: "Email du client",
            type: "string",
            validation: (Rule) => Rule.required()
        }),
        defineField({
            name: "momoPaymentIntentID",
            title: "ID instance de paiement",
            type: "string",
            validation: (Rule) => Rule.required()
        }),
        defineField({
            name: "products",
            title: "Articles",
            type: "array",
            of: [
                defineArrayMember({
                    type: "object",
                    fields: [
                        defineField({
                            name: "product",
                            title: "Articles achetés",
                            type: "reference",
                            to : ({ type: "product" })
                        }),
                        defineField({
                            name: "quantity",
                            title: "Quantité",
                            type: "number"
                        }),
                    ],
                    preview: {
                        select: {
                            product: "product.name",
                            quantity: "quantity",
                            image: "product.image",
                            price: "product.price",
                            currency: "product.currency",
                        },
                        prepare(select){
                            return {
                                title: `${select.product} x ${select.quantity}`,
                                subtitle: `${select.price * select.quantity}`,
                                media: select.image,
                            };
                        },
                    }
                })
            ]
        }),
        defineField({
            name: "amountDiscount",
            title: "Montant de réduction",
            type: "number",
            validation: (Rule) => Rule.min(0),
        }),
        defineField({
            name: "status",
            title: "Statut de la commande",
            type: "string",
            options: {
                list: [
                    {title: "En attente", value: "pending"},
                    {title: "Payé", value: "paid"},
                    {title: "Expédié", value: "shipped"},
                    {title: "Livré", value: "delivered"},
                    {title: "Annulé", value: "canceled"},
                ],
            }
        }),
        defineField({
            name: "orderDate",
            title: "Date de la commande",
            type: "datetime",
            validation: (Rule) => Rule.required()
        })
    ],
    preview: {
        select: {
            name: "customerName",
            amount: "totalPrice",
            currency: "currency",
            orderID: "orderNumber",
            email: "email"
        },
        prepare(select){
            const orderIDSnippet = `${select.orderID.slice(0, 5)}...${select.orderID.slice(-5)}`
            return {
                title: `${select.name} (${orderIDSnippet})`,
                subtitle: `${select.amount} ${select.currency}, ${select.email}`,
                media: BasketIcon,
            }
        }
    }
})