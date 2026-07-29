import { defineType } from 'sanity'

// Historically this schema was video-only. It now also carries static
// image standouts (e.g. the IKEA Catalogue / Norlys / OK App treatments
// on Nordics Trends 02–03), so `sourceType` can be `image` with a
// click-through link. Keeping the type name `trendVideo` avoids
// migrating existing published content.
export default defineType({
  name: 'trendVideo',
  title: 'Standout Media',
  type: 'object',
  fields: [
    {
      name: 'sourceType',
      title: 'Media Source',
      type: 'string',
      options: {
        list: [
          { title: 'Upload (video)', value: 'upload' },
          { title: 'YouTube', value: 'youtube' },
          { title: 'Image + Link', value: 'image' },
        ],
        layout: 'radio',
      },
      initialValue: 'upload',
      validation: (r) => r.required(),
    },
    {
      name: 'videoFile',
      title: 'Video File',
      type: 'file',
      options: { accept: 'video/*' },
      hidden: ({ parent }) => parent?.sourceType !== 'upload',
    },
    {
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      description: 'e.g. https://www.youtube.com/watch?v=...',
      hidden: ({ parent }) => parent?.sourceType !== 'youtube',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Static image used in place of a video. Clicking it opens the link below in a new tab.',
      hidden: ({ parent }) => parent?.sourceType !== 'image',
    },
    {
      name: 'linkUrl',
      title: 'Click-Through URL',
      type: 'url',
      description: 'Destination when the image is clicked (e.g. project case study page).',
      hidden: ({ parent }) => parent?.sourceType !== 'image',
    },
    {
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      options: { list: ['9:16', '16:9', '1:1'], layout: 'radio' },
      initialValue: '16:9',
      validation: (r) => r.required(),
    },
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (r) => r.required(),
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional — speaker title, project subtitle, or short caption',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'string',
      description: 'Optional — short context about the media',
    },
  ],
})
