import { defineType } from 'sanity'

// A lettered sub-page under a Table of Contents entry (Telly only) —
// e.g. Shows & Series → "Official Win List: Media and Entertainment
// Networks" / "Wins to Watch: Vertical Video Series".
export default defineType({
  name: 'keyFindingSubItem',
  title: 'Sub-Page',
  type: 'object',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() },
    { name: 'anchor', title: 'Anchor (DOM id of target section)', type: 'string', description: 'e.g. "trend-01-list-0"' },
  ],
  preview: {
    select: { title: 'title' },
  },
})
