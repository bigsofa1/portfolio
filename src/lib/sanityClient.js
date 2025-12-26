import {createClient} from '@sanity/client'
import {createImageUrlBuilder} from '@sanity/image-url'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2025-02-13'
const token = import.meta.env.VITE_SANITY_READ_TOKEN

// CDN is used automatically when no token is provided; with a token we hit the API for drafts.
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: !token,
  perspective: token ? 'previewDrafts' : 'published',
})

const builder = createImageUrlBuilder(sanityClient)
export const urlFor = (source) => builder.image(source)
