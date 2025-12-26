import groq from 'groq'

export const PROJECTS_QUERY = groq`*[_type == "project"] | order(publishDate desc){
  _id,
  publishDate,
  type->{title, titleFr, "key": value.current},
  images[]{
    alt,
    asset
  },
  translations
}`

export const SECTIONS_QUERY = groq`*[_type == "section"] | order(order asc){
  _id,
  "key": key.current,
  title,
  titleFr,
  order
}`

export const SOCIAL_LINKS_QUERY = groq`*[_type == "socialLink"] | order(order asc){
  _id,
  label,
  url,
  order
}`

export const EXPERIENCES_QUERY = groq`*[_type == "experience"] | order(order asc){
  _id,
  order,
  translations
}`
