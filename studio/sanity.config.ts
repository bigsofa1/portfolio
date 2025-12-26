import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'portfolio',

  projectId: 'b5bnyd32',
  dataset: 'portfolio',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
