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
    {
      name: 'posterRow',
      title: 'Poster Row Layout (experimental)',
      type: 'boolean',
      initialValue: false,
      description: 'Telly only — renders this list as a horizontal row of poster/thumbnail cards (streaming-guide style) instead of the ranked table. Clicking a card opens the video in a pop-out player — 16:9 by default, or 9:16 when Vertical Video is also on. Easy to toggle off to revert to the table.',
    },
    {
      name: 'verticalVideo',
      title: 'Vertical Video',
      type: 'boolean',
      initialValue: false,
      description: 'Poster Row only — this list\'s own work is vertical/mobile-native (e.g. "Binge on the Scroll: Vertical Series"), so its pop-out player opens tall (9:16) instead of the standard widescreen (16:9) shape every other list uses.',
      hidden: ({ parent }) => !parent?.posterRow,
    },
    {
      name: 'rankedRow',
      title: 'Ranked Thumbnail Row Layout (experimental)',
      type: 'boolean',
      initialValue: false,
      description: 'Telly only — renders this list Netflix "Top 10"-style: a horizontal row of posters, each with a giant outline rank number tucked behind it. No video player (one work per entry) — a card just links out to its Work URL. Easy to toggle off to revert to the table.',
    },
    {
      name: 'directoryRow',
      title: 'Directory Row Layout (experimental)',
      type: 'boolean',
      initialValue: false,
      description: 'Telly only — renders this list as a stacked directory: each entry\'s logo, name, and organization description in one row. For non-video, logo-plus-blurb lists (e.g. "Our Partners\' Work"). Easy to toggle off to revert to the table.',
    },
    {
      name: 'statValue',
      title: 'Lead-in Stat Value',
      type: 'string',
      description: 'e.g. "85%" — shown as a large stat banner above this list, between the intro copy and the entries. Leave blank for no stat banner.',
    },
    {
      name: 'statCaption',
      title: 'Lead-in Stat Caption',
      type: 'text',
      rows: 2,
      description: 'Supporting sentence shown beside the stat value, e.g. "believe that microseries are changing how TV and online shows & series will be developed and distributed."',
    },
  ],
  preview: {
    select: { title: 'heading', entries: 'entries' },
    prepare({ title, entries }) {
      const count = Array.isArray(entries) ? entries.length : 0
      return { title: title || 'Untitled list', subtitle: `${count} ${count === 1 ? 'entry' : 'entries'}` }
    },
  },
})
