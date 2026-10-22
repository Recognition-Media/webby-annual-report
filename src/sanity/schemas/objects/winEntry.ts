import { defineType } from 'sanity'

// One row in a Telly "winner list" (Official Win List / Wins to Watch).
// Array order is the rank — no separate rank field. `highlight` matches
// the outline's bolded/starred standout entries (e.g. "**Bilt**").
export default defineType({
  name: 'winEntry',
  title: 'Win Entry',
  type: 'object',
  fields: [
    { name: 'name', title: 'Organization / Creator', type: 'string', description: 'e.g. "Asharq Network" or "William Freund, fStop Foundation, Inc."', validation: (r) => r.required() },
    { name: 'workTitle', title: 'Work Title', type: 'string', description: 'e.g. "THE 4TH DIMENSION" — optional when the entry is a person/org ranking with no single work (e.g. Facts-style gold-count rows).' },
    { name: 'workUrl', title: 'Work URL', type: 'url', description: 'Link to the work itself (Vimeo, YouTube, tellyawards.com winner page, etc).' },
    { name: 'metricValue', title: 'Social Proof Value', type: 'string', description: 'e.g. "56k", "1.1M", "5 golds" — optional.' },
    {
      name: 'metricPlatform',
      title: 'Social Proof Platform',
      type: 'string',
      options: {
        list: [
          { title: 'LinkedIn', value: 'linkedin' },
          { title: 'Instagram', value: 'instagram' },
          { title: 'Vimeo', value: 'vimeo' },
          { title: 'YouTube', value: 'youtube' },
          { title: 'TikTok', value: 'tiktok' },
          { title: 'Website', value: 'website' },
        ],
      },
      hidden: ({ parent }) => !(parent as { metricValue?: string })?.metricValue,
    },
    { name: 'metricUrl', title: 'Social Proof URL', type: 'url', description: 'Where the social proof value links (the LinkedIn/Instagram page, etc).', hidden: ({ parent }) => !(parent as { metricValue?: string })?.metricValue },
    { name: 'highlight', title: 'Highlight This Entry', type: 'boolean', initialValue: false, description: 'Matches the outline’s bolded/starred standout rows.' },
  ],
  preview: {
    select: { title: 'name', subtitle: 'workTitle' },
    prepare({ title, subtitle }) {
      return { title: title || 'Untitled', subtitle: subtitle || undefined }
    },
  },
})
