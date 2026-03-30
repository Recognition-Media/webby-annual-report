import { defineType } from 'sanity'

export default defineType({
  name: 'trendVideo',
  title: 'Trend Video',
  type: 'object',
  fields: [
    {
      name: 'videoFile',
      title: 'Video File',
      type: 'file',
      options: { accept: 'video/*' },
      validation: (r) => r.required(),
    },
    {
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      options: { list: ['9:16', '16:9', '1:1'], layout: 'radio' },
      initialValue: '9:16',
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
