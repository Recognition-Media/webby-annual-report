import { defineType } from 'sanity'

// A titled, ranked list of winEntry rows — e.g. "OFFICIAL WIN LIST: Media
// and Entertainment Networks" or "WINS TO WATCH: Vertical video series".
// A trendSection can carry several of these (Channel Surfing carries 4).
export default defineType({
  name: 'winnerList',
  title: 'Winner List',
  type: 'object',
  fields: [
    { name: 'heading', title: 'Heading', type: 'string', description: 'e.g. "Official Win List: Media and Entertainment Networks"', validation: (r) => r.required() },
    { name: 'intro', title: 'Intro Copy', type: 'text', rows: 3, description: 'Explanatory paragraph shown below the heading, above the list.' },
    { name: 'entries', title: 'Entries', type: 'array', of: [{ type: 'winEntry' }], validation: (r) => r.required().min(1) },
  ],
  preview: {
    select: { title: 'heading', entries: 'entries' },
    prepare({ title, entries }) {
      const count = Array.isArray(entries) ? entries.length : 0
      return { title: title || 'Untitled list', subtitle: `${count} ${count === 1 ? 'entry' : 'entries'}` }
    },
  },
})
