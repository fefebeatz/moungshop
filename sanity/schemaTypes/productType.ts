import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productType = defineType({
    name: 'product',
    title: "Articles",
    type: "document",
    icon: TrolleyIcon,
    fields: [
        defineField({
            name: "name",
            title: "Dénomination de l'article",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "slug",
            title: "slug",
            type: "slug",
            options: {
                source: "name",
                maxLength: 96
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "image",
            title: "Image de l'article",
            type: "image",
            options: {
                hotspot: true
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "blockContent",
        }),
        defineField({
            name: "price",
            title: "Prix",
            type: "number",
            validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
            name: "categories",
            title: "Catégories de l'article",
            type: "array",
            of: [{ type: "reference", to: {type: "category"} }]
        }),
        defineField({
            name: "stock",
            title: "Quantité en stock",
            type: "number",
            validation: (Rule) => Rule.min(0),
        }),
    ],
    preview: {
        select: {
            title: "name",
            media: "image",
            price: "price"
        },
        prepare(select){
            return {
                title: select.title,
                subtitle: `${select.price} FCFA`,
                media: select.media
            }
        }
    }
})