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
    {
      name: 'railLabel',
      title: 'Sidebar Rail Label',
      type: 'string',
      description: 'Short, plain label shown in the left-hand wayfinding rail (e.g. "Television" for a list headed "Top Media & Entertainment Networks") — deliberately doesn\'t mirror the on-page heading, so the rail reads as a quick clear index rather than a word-for-word table of contents. Falls back to the full heading above if left blank.',
    },
    { name: 'intro', title: 'Intro Copy', type: 'text', rows: 3, description: 'Explanatory paragraph shown below the heading, above the list.' },
    {
      name: 'infoTooltip',
      title: 'Info Tooltip (Poster Row only)',
      type: 'text',
      rows: 4,
      description: 'Longer-form note shown in a hover/tap popover off a small "i" icon next to the heading — for context too long or tangential for the regular intro. Leave blank for no icon. Only rendered on Poster Row layout lists.',
    },
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
      description: 'Telly only — renders this list Netflix "Top 10"-style: a horizontal row of posters, each with a numbered rank tile in its top-left corner. No video player (one work per entry) — a card just links out to its Work URL. Easy to toggle off to revert to the table.',
    },
    {
      name: 'hideRankNumbers',
      title: 'Hide Rank Numbers',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }) => !parent?.rankedRow,
      description: 'Keeps the ranked-row layout but drops the numbered tiles — for a list that is a curated set rather than a ranking. Toggle back off to bring the numbers back.',
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
