import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Catégorie article',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: "Libellé de la catégorie",
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'description',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description"
    }
  }
})
