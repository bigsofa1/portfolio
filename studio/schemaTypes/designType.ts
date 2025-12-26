import {defineField, defineType} from 'sanity'

export const designType = defineType({
  name: 'designType',
  title: 'Design type',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Label',
      type: 'string',
      description: 'Human-friendly label (e.g. Branding design).',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titleFr',
      title: 'Label (French)',
      type: 'string',
      description: 'French translation of the label.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'value',
      title: 'Key',
      type: 'slug',
      description: 'Lowercase key for filtering (e.g. branding).',
      options: {
        source: 'title',
        maxLength: 50,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'titleFr',
    },
  },
})
