import {defineField, defineType} from 'sanity'

export const section = defineType({
  name: 'section',
  title: 'Section',
  type: 'document',
  fields: [
    defineField({
      name: 'key',
      title: 'Key',
      type: 'slug',
      description: 'Stable key for the section (e.g. information, projects).',
      options: {
        maxLength: 50,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title (English)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titleFr',
      title: 'Title (French)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Use to order sections in navigation.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'titleFr',
    },
  },
})
