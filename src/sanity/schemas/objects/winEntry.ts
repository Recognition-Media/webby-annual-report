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
    { name: 'highlight', title: 'Highlight This Entry', type: 'boolean', initialValue: false, description: 'Matches the outline’s bolded/starred standout rows.' },
    {
      name: 'videoUrl',
      title: 'Video URL (pop-out)',
      type: 'url',
      description: 'Direct link to the work’s video (Google Drive, Dropbox, YouTube, or Vimeo share link). When set, this entry gets a small play-icon button that opens the video in a pop-out player, and shows in the channel-guide preview pane when hovered.',
    },
    {
      name: 'videoThumbnail',
      title: 'Video Preview Thumbnail',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional preview thumbnail shown in the channel-guide preview pane. If left blank, the preview pane shows the work title/company as text only.',
    },
    {
      name: 'videoDescription',
      title: 'Video Description',
      type: 'text',
      rows: 3,
      description: 'Short synopsis shown in the channel-guide’s rotating title/description area when this entry’s video is the active preview (e.g. "National Geographic explorer and photographer Ben Horton goes on an adventure through Guizhou’s mystical wilderness...").',
    },
    {
      name: 'orgDescription',
      title: 'Organization Description',
      type: 'text',
      rows: 2,
      description: 'Short blurb about the organization/creator itself (not the specific work), shown under the title in the channel-guide player (e.g. "Elastic People is a multi-disciplinary creative studio specializing in identity, brand development, film production and live experiences.").',
    },
    {
      name: 'hoverBlurb',
      title: 'Hover Blurb (partner logos)',
      type: 'text',
      rows: 2,
      description: 'One short line shown over the logo on hover in the partner directory row (e.g. "Advocating for women and non-binary film directors."). Deliberately separate from Organization Description, which is longer and stays in the click-through card.',
    },
    {
      name: 'logo',
      title: 'Organization Logo',
      type: 'image',
      description: 'Organization logo for non-video entries (e.g. "Our Partners\' Work"). Shown in a light tile since most partner logos are dark-on-transparent.',
    },
    {
      name: 'orgLinkText',
      title: 'Linked Text Within Description',
      type: 'string',
      description: 'Must exactly match the start of "Organization Description" (e.g. "The Nonfiction Hotlist"). That leading phrase is hyperlinked to Work URL instead of showing a separate name/heading. Used by the directory-row layout only — leave blank elsewhere.',
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'workTitle' },
    prepare({ title, subtitle }) {
      return { title: title || 'Untitled', subtitle: subtitle || undefined }
    },
  },
})
