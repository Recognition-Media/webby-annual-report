import { defineType } from 'sanity'

export default defineType({
  name: 'carouselImage',
  title: 'Carousel Image',
  type: 'object',
  fields: [
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, validation: (r) => r.required() },
    { name: 'caption', title: 'Caption', type: 'string' },
  ],
})
