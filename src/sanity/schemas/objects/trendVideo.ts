import { defineType } from 'sanity'

export default defineType({
  name: 'trendVideo',
  title: 'Trend Video',
  type: 'object',
  fields: [
    {
      name: 'sourceType',
      title: 'Video Source',
      type: 'string',
      options: { list: [{ title: 'Upload', value: 'upload' }, { title: 'YouTube', value: 'youtube' }], layout: 'radio' },
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
      description: 'Optional — speaker title or role',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'string',
      description: 'Optional — short context about the video',
    },
  ],
})
