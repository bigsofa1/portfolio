import {defineField, defineType} from 'sanity'

export const experience = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    defineField({
      name: 'translations',
      title: 'Translations',
      type: 'object',
      fields: [
        defineField({
          name: 'en',
          title: 'English',
          type: 'experienceTranslation',
        }),
        defineField({
          name: 'fr',
          title: 'French',
          type: 'experienceTranslation',
        }),
      ],
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Optional ordering for display.',
    }),
  ],
  preview: {
    select: {
      title: 'translations.en.title',
      subtitle: 'order',
    },
  },
})
