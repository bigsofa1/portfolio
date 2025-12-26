import {defineArrayMember, defineField, defineType} from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishDate',
      title: 'Publish date',
      type: 'date',
      options: {calendarTodayLabel: 'Today'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type of design',
      type: 'reference',
      to: [{type: 'designType'}],
      options: {disableNew: false},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      options: {
        layout: 'grid',
      },
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'translations',
      title: 'Translations',
      type: 'object',
      fields: [
        defineField({
          name: 'en',
          title: 'English',
          type: 'projectTranslation',
        }),
        defineField({
          name: 'fr',
          title: 'French',
          type: 'projectTranslation',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publishDate',
      media: 'images.0',
    },
  },
})
