import {defineField, defineType} from 'sanity'

export const projectTranslation = defineType({
  name: 'projectTranslation',
  title: 'Project translation',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
