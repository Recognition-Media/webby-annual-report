/**
 * Populate the Telly 2026 State of Video Report with the T48 Trend
 * Report Outline content (Google Doc 1NL2ooYNVPuBTdWJVpUeUzOVPP4vgAQhpbl0K4gka--I).
 *
 * Patches the existing document `report-telly-2026-state-of-video` only.
 * Does NOT touch: formFields, creditsCreatedBy, creditsContributors,
 * signupTitle, signupSubhead, metaTitle, metaDescription, heroHeadline,
 * heroSubtitle, heroButtonText, status, letterAuthors (Amanda Needham's
 * name/title/photo are already correct on the live document).
 *
 * Usage:
 *   node scripts/migrate-telly-outline-2026.mjs --dry-run   # print the payload, no writes
 *   SANITY_API_TOKEN=sk-... node scripts/migrate-telly-outline-2026.mjs
 *
 * Get a token from: https://www.sanity.io/manage/project/za6m18kc/api#tokens
 * (needs Editor or above permissions)
 */

import { createClient } from '@sanity/client'

const PROJECT_ID = 'za6m18kc'
const DATASET = 'production'
const DOC_ID = 'report-telly-2026-state-of-video'
const DRY_RUN = process.argv.includes('--dry-run')

const TOKEN = process.env.SANITY_API_TOKEN
if (!DRY_RUN && !TOKEN) {
  console.error('Missing SANITY_API_TOKEN. Get one from https://www.sanity.io/manage/project/za6m18kc/api#tokens')
  process.exit(1)
}

const client = DRY_RUN
  ? null
  : createClient({
      projectId: PROJECT_ID,
      dataset: DATASET,
      token: TOKEN,
      apiVersion: '2024-01-01',
      useCdn: false,
    })

let keyCounter = 0
function key() {
  keyCounter += 1
  return `k${keyCounter}${Math.random().toString(36).slice(2, 6)}`
}

function textBlock(text) {
  return {
    _type: 'block',
    _key: key(),
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
    markDefs: [],
    style: 'normal',
  }
}

function winEntry({ name, workTitle, workUrl, metricValue, metricPlatform, metricUrl, highlight }) {
  return {
    _type: 'winEntry',
    _key: key(),
    name,
    ...(workTitle ? { workTitle } : {}),
    ...(workUrl ? { workUrl } : {}),
    ...(metricValue ? { metricValue } : {}),
    ...(metricPlatform ? { metricPlatform } : {}),
    ...(metricUrl ? { metricUrl } : {}),
    ...(highlight ? { highlight: true } : {}),
  }
}

function winnerList(heading, intro, entries) {
  return {
    _type: 'winnerList',
    _key: key(),
    heading,
    intro,
    entries: entries.map(winEntry),
  }
}

function expertQuote(name, title, text) {
  return {
    _type: 'expertQuote',
    _key: key(),
    name,
    ...(title ? { title } : {}),
    quoteText: [textBlock(text)],
  }
}

// ─────────────────────────────────────────────────────────────────
// About Page (Pg 2)
// ─────────────────────────────────────────────────────────────────

const aboutBody = [
  textBlock(
    'The Telly Awards honors excellence in video and television across all screens. Founded in 1979, the global award program receives over 13,000 entries a year from all 50 states and 5 continents. Telly Award winners represent work from some of the most respected advertising agencies, television stations, production companies and publishers from around the world.'
  ),
  textBlock(
    "Work is accepted in TV or Online Shows & Series, Branded Content, Commercials & Marketing, Social Media, Non-Broadcast, Immersive & Interactive, Film & Shorts and Animation. The early pricing deadline for submissions is December 11, 2026."
  ),
]

// ─────────────────────────────────────────────────────────────────
// What's Inside This Report (Pg 3) — letterBody only; letterAuthors[0]
// (Amanda Needham, Managing Director, photo) is already correct.
// ─────────────────────────────────────────────────────────────────

const letterBody = [
  textBlock(
    "Great video work is everywhere, but knowing where to look is the hard part. To help, we're bringing you straight to the work itself. What makes a vertical series the new primetime? Can branded content feel more like cinema than advertising? What does it take for a film to move viewers to act? You'll find answers across the standout shows, branded campaigns, social impact stories, music videos, animation, sports, and AI work that stopped our scroll this season, along with perspectives from our Judging Council on where storytelling is headed. We hope it starts conversations and gives you a chance to reflect on how your own work fits this moment."
  ),
]

// ─────────────────────────────────────────────────────────────────
// Table of Contents (Pg 4) — replaces the wrong Anthem-flavored list
// ─────────────────────────────────────────────────────────────────

const keyFindings = [
  { _type: 'keyFinding', _key: key(), number: '01', title: 'Shows & Series', description: 'Media Networks & Vertical Video', hoverColor: '#ef1e40', anchor: 'trend-01' },
  { _type: 'keyFinding', _key: key(), number: '02', title: 'Branded Content & Marketing', description: 'Campaigns, Commercials & Online Ads', hoverColor: '#c23799', anchor: 'trend-02' },
  { _type: 'keyFinding', _key: key(), number: '03', title: 'Social Impact Work', description: 'Nonprofits & Documentary Storytelling', hoverColor: '#ef1e40', anchor: 'trend-03' },
  { _type: 'keyFinding', _key: key(), number: '04', title: 'Channel Surfing', description: 'Sports, Music, AI & Animation', hoverColor: '#c23799', anchor: 'trend-04' },
]

// ─────────────────────────────────────────────────────────────────
// Facts (Pg 5)
// ─────────────────────────────────────────────────────────────────

const facts = {
  factsEntryCount: '13,876',
  factsEntryLabel: 'Entries This Season',
  factsJudgeCount: '575',
  factsJudgeLabel: 'Judging Council Members',
  factsTopTitlesHeading: "Who's Behind the Best Video Work",
  factsTopTitles: [
    'Executive Producer',
    'Chief Marketing Officer (CMO)',
    'Creative Director',
    'Marketing Director',
    'Video Producer',
    'Marketing Manager',
    'Production Manager',
    'Founder',
    'Filmmaker',
    'VP of Original Storytelling',
  ],
  factsTopCitiesNationalHeading: 'Top National Cities for Gold Winners',
  factsTopCitiesNational: ['New York', 'Los Angeles', 'Washington, D.C.', 'Atlanta', 'Chicago'],
  factsTopCitiesInternationalHeading: 'Top International Cities for Gold Winners',
  factsTopCitiesInternational: ['Dubai', 'London', 'Beijing', 'Doha', 'Toronto'],
}

// ─────────────────────────────────────────────────────────────────
// Insights From The Season (Pg 6) — 8 judges
// ─────────────────────────────────────────────────────────────────

const judgeQuotes = [
  expertQuote('Janet Graham Borba', 'HBO', 'These days, the industry is in flux—constant change, constant consolidation. I look for a unique point of view and high craft standards. Simple as that.'),
  expertQuote('Lauren Moraski', 'PepsiCo', "Excellence in video boils down to how well it connects, moves, and makes the audience feel… It's really the emotional impact of any given video—whether it be long-form or short-form—that sets it apart."),
  expertQuote(
    'Marielle Bobo',
    'Transform',
    "I'm constantly inspired by the innovation, passion, and cultural relevance reflected in today's visual content, from emerging voices to established creators pushing the boundaries of the medium. Being part of a platform that recognizes that kind of creativity is both an honor and a joy. Excellence in video starts with intentional storytelling—when every creative choice serves a clear purpose and evokes genuine emotion. One of the most significant shifts I'm seeing across video, television, and film is the democratization of storytelling. Technology and social platforms have opened the door for creators from all backgrounds to share their perspectives, often outside of traditional systems. This has expanded whose stories are told—and how—giving rise to more authentic, culturally nuanced narratives that reflect the true diversity of our world. At the same time, the industry is being transformed by advancements in AI and immersive technology, which are reshaping the creative process and audience engagement. The challenge—and the opportunity—lies in using these tools responsibly and intentionally, ensuring innovation enhances rather than erases the human voice at the heart of every story."
  ),
  expertQuote('Michael Sternoff', 'Amazon Leo', 'There are only two ways to deal with it: resist it or find new paths. Change is never easy, but the only real way forward is to stay flexible and keep learning. The way we tell stories today is completely different from five or ten years ago. The best way to navigate it is to keep adapting.'),
  expertQuote('David E. Cid', 'Remezcla', 'We champion work that is not just technically brilliant, but culturally authentic, nuanced, and resonant in its representation of diverse communities.'),
  expertQuote('Christina Richardson', undefined, "First and foremost, I ask myself: did I feel something? Did the story pull me in, did I care deeply about the characters, and did the filmmaker build enough of an emotional connection that I became invested in what happened to them? Craft and technical execution absolutely matter, but for me, they are secondary to emotional impact. If I'm still thinking about what I watched after it ends, you've done something special."),
  expertQuote('Enrique Montalvo', undefined, 'Formats will continue to change, but the foundation remains the same: understand your audience, have a clear point of view, and make them feel something. Audiences may not always know exactly why a story connects with them, but they know when it does.'),
  expertQuote('Prerna Suri', undefined, "True excellence in video lives at the intersection of rigorous craft and undeniable emotional truth. I look for compelling narrative arcs, nuanced character development, and a strong foundational storytelling spine. Beyond the technical execution, the gold standard is emotive quality—work that doesn't just capture an audience's attention for a moment, but leaves a lasting, visceral imprint long after the screen goes dark."),
]

// ─────────────────────────────────────────────────────────────────
// Sections 7–10: sectionCovers + trendSections, replacing the 3
// placeholder covers / 8 placeholder Anthem trends.
// ─────────────────────────────────────────────────────────────────

const sectionCovers = [
  {
    _type: 'sectionCover',
    _key: key(),
    sectionNumber: '01',
    title: 'Shows & Series',
    subtitle: 'At the Tellys, we honored HBO before the Emmys did.',
    copy: "Today, microcontent is changing how celebrity and series are created. We're honoring this first too.",
    accentColor: '#ef1e40',
  },
  {
    _type: 'sectionCover',
    _key: key(),
    sectionNumber: '02',
    title: 'Branded Content & Marketing',
    subtitle: 'Branded content is hitting new levels and expanding in ways that have never before been seen.',
    copy: 'While commercials are still big and bold, branded content is blowing expectations out of the water with films, immersive exhibits, and campaigns.',
    accentColor: '#c23799',
  },
  {
    _type: 'sectionCover',
    _key: key(),
    sectionNumber: '03',
    title: 'Social Impact Work',
    subtitle: "Social impact video isn't just about being watched or remembered.",
    copy: 'It has everything to do with what someone does next. A film can make you feel, or a brand can move you to buy; social impact video pushes the viewer to think on the "how" and the "why."',
    accentColor: '#ef1e40',
  },
  {
    _type: 'sectionCover',
    _key: key(),
    sectionNumber: '04',
    title: 'Channel Surfing',
    subtitle: 'The sports, music, AI & animation work stopping our scroll.',
    copy: "We get work from all over — storytelling music videos, animation making us laugh until we cry, AI content that pushed boundaries, and more. Here are some of our favorites that we hope you'll enjoy too!",
    accentColor: '#c23799',
  },
]

const trendSections = [
  // ── 01: Shows & Series ─────────────────────────────────────────
  {
    _type: 'trendSection',
    _key: key(),
    enabled: true,
    trendTitle: 'Shows & Series',
    accentColor: '#ef1e40',
    moduleOrder: [
      { _type: 'object', _key: key(), module: 'data' },
      { _type: 'object', _key: key(), module: 'quotes' },
    ],
    trendBody: [
      textBlock(
        "Shows and series are shifting. At the Tellys, we honored HBO before the Emmys did. Today, microcontent is changing how celebrity and series are created. We're honoring this first too."
      ),
    ],
    showData: true,
    dataHeadline: 'Microseries Are Reshaping Development',
    dataStats: [
      { _type: 'dataStat', _key: key(), value: 85, label: 'believe microseries are changing how TV and online shows & series will be developed and distributed' },
    ],
    showQuotes: true,
    expertQuotes: [expertQuote('Michael Sternoff', 'Amazon Leo', 'There are only two ways to deal with it: resist it or find new paths.')],
    showWinnerLists: true,
    winnerLists: [
      winnerList(
        'Official Win List: Media and Entertainment Networks',
        'These organizations won the most gold, silver and bronze across the whole competition from media & entertainment networks. Using advanced technology and high-quality techniques, traditional network production looks more and more like film every day.',
        [
          { name: 'Asharq Network', workTitle: 'THE 4TH DIMENSION', workUrl: 'https://vimeo.com/1150088022', metricValue: '56k', metricPlatform: 'linkedin', metricUrl: 'https://www.linkedin.com/company/asharqnews/' },
          { name: 'CGTN' },
          { name: 'National Geographic', workTitle: "Best of the World's Destination Guizhou", workUrl: 'https://drive.google.com/file/d/1ZA0G-V1UyY0oAU7mpGIv6zQhxWVJ8mi_/view', metricValue: '4M', metricPlatform: 'linkedin', metricUrl: 'https://www.linkedin.com/company/national-geographic/' },
          { name: 'Al Jazeera English', workTitle: "36 Days in July: Sheikh Hasina's secret orders revealed", workUrl: 'https://www.tellyawards.com/winners/2026/online/general-social-impact/36-days-in-july-sheikh-hasinas-secret-orders-revealed/363693/', metricValue: '50k', metricPlatform: 'linkedin', metricUrl: 'https://www.linkedin.com/showcase/aljazeera-english/' },
          { name: 'Korean Broadcasting Services' },
          { name: 'Hearst Media Production Group', workTitle: 'Earth Odyssey', workUrl: 'https://www.dropbox.com/scl/fo/xxmgovdsqnumczcahmh10/AD3dN9xGuzF1jYxS5BQJUKQ/EDD/Season8/EDD_801_BCS.mp4?dl=0&rlkey=r5vtm13fv1xupk6bn9h5wz5zq', metricValue: '6k', metricPlatform: 'linkedin', metricUrl: 'https://www.linkedin.com/company/hearst-media-production-group/' },
          { name: 'Fortune Media (USA) Corp', workTitle: 'Singapore by Design', workUrl: 'https://fortune.com/brandstudio/designsingapore/singapore-by-design/' },
        ]
      ),
      winnerList(
        'Wins to Watch: Vertical Video Series',
        "Online shows are reframing where and how people watch shows. We're returning to destination viewing — tuning in on a weeknight to watch our favorite creator segment drop versus watching a network sitcom. This season, we're honoring a full suite of micro-series categories across online shows & series and social, as they're redefining the way great work is being made.",
        [
          { name: 'dan rodo productions', workTitle: 'The Tony Hawk Mystery Skater Series', workUrl: 'https://www.tellyawards.com/winners/2026/social-video/series-vertical-video-series/the-tony-hawk-mystery-skater-series/361709/', metricValue: '1.1M', metricPlatform: 'instagram', metricUrl: 'https://www.instagram.com/danocracy/' },
          { name: 'sesame workshop', workTitle: 'Sesame Street Babies', workUrl: 'https://www.tellyawards.com/winners/2026/social-video/series-vertical-video-series/sesame-street-babies/361698', metricValue: '99k', metricPlatform: 'linkedin', metricUrl: 'https://www.linkedin.com/company/sesame-workshop/posts/?feedView=all' },
          { name: 'mad realities', workTitle: 'Shop Cats', workUrl: 'https://www.tellyawards.com/winners/2026/social-video/series-comedy/shop-cats-a-mad-realities-show/361692/', metricValue: '15k', metricPlatform: 'instagram', metricUrl: 'https://www.instagram.com/madrealities/?hl=en' },
          { name: 'Reelshort', workTitle: 'Waterboy', workUrl: 'http://www.tellyawards.com/winners/2026/immersive-interactive-mixed/general-series-shows/waterboy/364528', metricValue: '1k', metricPlatform: 'linkedin', metricUrl: 'https://www.linkedin.com/showcase/reelshort/' },
          { name: 'Bilt', workTitle: 'Roomies Roomies Roomies', workUrl: 'https://www.tellyawards.com/winners/2026/social-video/series-pop-culture-commentary/roomies-roomies-roomies/361717/', highlight: true },
          { name: 'american picture company', workTitle: 'the Ick', workUrl: 'https://www.instagram.com/submityourick', metricValue: '639', metricPlatform: 'linkedin', metricUrl: 'https://www.linkedin.com/company/american-picture-company/' },
        ]
      ),
    ],
  },

  // ── 02: Branded Content & Marketing ────────────────────────────
  {
    _type: 'trendSection',
    _key: key(),
    enabled: true,
    trendTitle: 'Branded Content & Marketing',
    accentColor: '#c23799',
    moduleOrder: [{ _type: 'object', _key: key(), module: 'quotes' }],
    trendBody: [
      textBlock(
        'Branded content is hitting new levels and expanding in ways that have never before been seen. While commercials are still big and bold, branded content is blowing expectations out of the water with films, immersive exhibits, and campaigns.'
      ),
    ],
    showWinnerLists: true,
    winnerLists: [
      winnerList(
        'Branded Content (Official Win List)',
        "Branded work barely feels branded anymore — it's cinema, campaign, and commercial all together. The brand lets the story speak for itself, with significant results.",
        [
          { name: 'Gibson', workTitle: 'Handcrafted in Nashville', workUrl: 'https://www.youtube.com/watch?v=SikxabcmqCo', metricValue: '3M', metricPlatform: 'instagram', metricUrl: 'https://www.instagram.com/gibsonguitar/' },
          { name: 'Qatar Museums', workTitle: 'MATAF', workUrl: 'https://www.youtube.com/watch?v=tP_-c8_T_pI' },
          { name: 'Black Tent', workTitle: 'Hawaii Leader', workUrl: 'https://next.frame.io/share/de80fa46-632f-45e8-9e1c-b89382c97697/view/f67279b7-6c7e-4d97-96db-11811a9824a6', metricValue: '821', metricPlatform: 'linkedin', metricUrl: 'https://www.linkedin.com/company/black-tent/' },
          { name: 'Mad Arte Digitales', workTitle: 'Cleopatra, The Immersive Exhibition — 360 Immersive Film', workUrl: 'https://drive.google.com/drive/folders/1nqhqMY3-dHWrjnyeyZYl3NeIhnLo48i5?usp=drive_link' },
          { name: 'Warner Bros Discovery', workTitle: 'BMW x Hacks', workUrl: 'https://www.tellyawards.com/winners/2026/branded-content/general-automotive/bmw-x-hacks/356167/' },
          { name: 'Marriott International', workTitle: "'I AM THE LUXURY COLLECTION' Global Brand Campaign", workUrl: 'https://www.tellyawards.com/winners/2026/branded-content/campaign-travel-tourism/i-am-the-luxury-collection-global-brand-campaign/356168/' },
          { name: 'Disney Experiences', workTitle: 'Disneyland Handcrafted', workUrl: 'https://www.youtube.com/watch?v=YtrVcOxVDls', metricValue: '506k', metricPlatform: 'linkedin', metricUrl: 'https://www.linkedin.com/company/disney-experiences/' },
        ]
      ),
      winnerList(
        'Online Commercials That Made Waves This Year',
        "The best commercials are the ones you want to watch over and over — the ones you don't skip. Here are some that we kept on repeat this year:",
        [
          { name: 'Gravity Global', workTitle: 'Those Who Dream of Transformative Flight, Love e2', workUrl: 'http://www.tellyawards.com/winners/2026/non-broadcast/craft-use-of-animation/those-who-dream-of-transformative-flight-love-e2/359141', metricValue: '14k', metricPlatform: 'linkedin', metricUrl: 'https://www.linkedin.com/company/gravityglobal/' },
          { name: 'Sixtwentysix', workTitle: 'The Value Affleck', workUrl: 'https://www.sixtwentysix.co/case-studies/dunkin-the-value-affleck', metricValue: '10k', metricPlatform: 'linkedin', metricUrl: 'https://www.linkedin.com/company/sixtwentysix/' },
          { name: 'DuskHouse', workTitle: 'Mountain Dew — Brings You Back', workUrl: 'https://www.tellyawards.com/winners/2026/online-commercials/craft-directing/mountain-dew-brings-you-back/360440/' },
          { name: 'Alter Ego', workTitle: 'Subway — Did It Just Get Worldly In Here?', workUrl: 'https://www.tellyawards.com/winners/2026/regional-tv/craft-use-of-color/subway-did-it-just-get-worldly-in-here/361345/', metricValue: '4k', metricPlatform: 'linkedin', metricUrl: 'https://www.linkedin.com/company/alter-ego-post/' },
          { name: 'Amazon Leo', workTitle: 'Countdown', workUrl: 'https://www.tellyawards.com/winners/2026/online-commercials/craft-sound-sound-design/countdown/360476/', metricValue: '6.5M', metricPlatform: 'instagram', metricUrl: 'https://www.instagram.com/amazon/' },
          { name: 'Demonstrate X DDW', workTitle: 'Stick to Real, Dinner Party', workUrl: 'https://recognitionmedia-production.s3.amazonaws.com/8/ToBeEncoded/e39712b5-7542-4345-8487-fc20878b26e0.mp4', metricValue: '2k', metricPlatform: 'linkedin', metricUrl: 'https://www.linkedin.com/company/wearedemonstrate/' },
        ]
      ),
    ],
  },

  // ── 03: Social Impact Work ──────────────────────────────────────
  {
    _type: 'trendSection',
    _key: key(),
    enabled: true,
    trendTitle: 'Social Impact Work',
    accentColor: '#ef1e40',
    moduleOrder: [{ _type: 'object', _key: key(), module: 'quotes' }],
    trendBody: [
      textBlock(
        'Social impact video work isn\'t just about being watched or being remembered — it has everything to do with what someone does next. A film can make you feel, or a brand can move you to buy; social impact video pushes the viewer to think on the "how" and the "why."'
      ),
      textBlock(
        'You can also check out work from our partners NonFiction Hotlist and our roster of partners in the social impact space — Film Fatales, Fwd Doc, Seed & Spark, Video Consortium, Reel Abilities, and NYWIFT.'
      ),
    ],
    showQuotes: true,
    expertQuotes: [expertQuote('Marielle Bobo', 'Transform', "One of the most significant shifts I'm seeing across video, television, and film is the democratization of storytelling.")],
    showWinnerLists: true,
    winnerLists: [
      winnerList(
        'Official Win List: Top Nonprofits By Gold',
        'This is work from nonprofits that won the most golds across the competition.',
        [
          { name: 'William Freund, fStop Foundation, Inc.', metricValue: '5 golds' },
          { name: 'Delaney Bishop, Operation Smile', metricValue: '3 golds' },
          { name: 'Danielle Broza, The WNET Group', metricValue: '3 golds' },
          { name: 'Gary Dixon, The Foundation for a Better Life', metricValue: '3 golds' },
          { name: "John Phelps, ALSAC/St. Jude Children's Research Hospital", metricValue: '3 golds' },
          { name: 'Tom Costanza, World Vision', metricValue: '3 golds' },
        ]
      ),
      winnerList(
        'Wins to Watch: Top 5 Documentaries',
        "Real world. Real events. Real people. Documentaries capture history, and they can also capture a moment. No matter the funding, there's always a story to be told. These are the real-life stories that need telling.",
        [
          { name: 'Olympic Channel and International Olympic Committee', workTitle: 'Champions of the Golden Valley', workUrl: 'https://www.olympics.com/en/films/watch/champions-of-the-golden-valley' },
          { name: 'Segal Family Foundation', workTitle: 'Daughters of the Lake', workUrl: 'https://www.tellyawards.com/winners/2026/film-shorts/general-documentary/daughters-of-the-lake/357730/', metricValue: '35k', metricPlatform: 'linkedin', metricUrl: 'https://www.linkedin.com/company/segal-family-foundation/' },
          { name: 'Traveling Picture Show Company', workTitle: 'Mountain Joy', workUrl: 'https://vimeo.com/1077795833/53c6d808e3' },
          { name: 'Good Studios', workTitle: 'A Way Out | The Safehouse Project Documentary', workUrl: 'https://vimeo.com/1134931118/25095fa599' },
          { name: 'Lucky Day', workTitle: 'Oh Whale', workUrl: 'https://recognitionmedia-production.s3.amazonaws.com/8/ToBeEncoded/f0817325-88a0-45c6-8879-6613ccd54c59.mp4', highlight: true },
        ]
      ),
    ],
  },

  // ── 04: Channel Surfing — Sports, Music, AI & Animation ────────
  {
    _type: 'trendSection',
    _key: key(),
    enabled: true,
    trendTitle: 'Channel Surfing: Sports, Music, AI & Animation',
    accentColor: '#c23799',
    moduleOrder: [
      { _type: 'object', _key: key(), module: 'data' },
      { _type: 'object', _key: key(), module: 'quotes' },
    ],
    trendBody: [
      textBlock(
        "We get work from all over — and some of our standout work occurs across genres, from storytelling music videos, to animation work making us laugh until we cry, to AI content that pushed boundaries, and more. We've been blown away by the quality of work this year. Here are some of our favorites that we hope you'll enjoy too!"
      ),
    ],
    showData: true,
    dataHeadline: 'AI Is Reshaping How We Make and Watch',
    dataStats: [
      { _type: 'dataStat', _key: key(), value: 89, label: 'agree that AI is changing the way we make and consume video forever' },
    ],
    showQuotes: true,
    expertQuotes: [
      expertQuote(
        'Maggie Luo',
        undefined,
        "AI is changing our industry at an incredible pace—making things possible that we couldn't have imagined before, and allowing us to create faster than ever. But speed and possibility aren't the same as meaning. Human emotion, taste and judgment still matter. My advice is to embrace the technology, stay curious, but never lose sight of the human reason you're creating in the first place."
      ),
    ],
    showWinnerLists: true,
    winnerLists: [
      winnerList(
        'Wins to Watch: Top 5 Music Videos',
        'The music video era is back! These pieces made us move (and groove) while also being cinematically impressive.',
        [
          { name: 'Modern Post', workTitle: 'Sabrina Carpenter (Tears)', workUrl: 'https://www.tellyawards.com/winners/2026/branded-content/craft-editing/sabrina-carpenter-tears/356628/', metricValue: '7k', metricPlatform: 'linkedin', metricUrl: 'https://www.linkedin.com/company/modern-post/' },
          { name: 'Slick Rick Music Corps', workTitle: 'BADMAN GENERATION', workUrl: 'https://www.tellyawards.com/winners/2026/film-shorts/general-music-video/badman-generation/357721/' },
          { name: 'Elastic People', workTitle: "Ricky Martin ft. Carin Leon's A Medio Vivir", workUrl: 'http://www.tellyawards.com/winners/2026/film-shorts/general-music-video/a-medio-vivir-ricky-martin-ft-carin-leon/358397', metricValue: '228', metricPlatform: 'linkedin', metricUrl: 'https://www.linkedin.com/company/elastic-people/' },
          { name: 'Partizan Entertainment', workTitle: "Laufey's Madwoman", workUrl: 'https://www.tellyawards.com/winners/2026/promotional-video/general-music-video/laufey-madwoman/360873/' },
          { name: 'Action Factory', workTitle: 'Taylor Swift: The Fate of Ophelia', workUrl: 'http://www.tellyawards.com/winners/2026/peoples-telly/specialty-best-music-video/taylor-swift-the-fate-of-ophelia/354995' },
        ]
      ),
      winnerList(
        'Top 5 Animation',
        "Animation has the special ability to make you feel nostalgic or immersed in the future, and these pieces show the breadth of what's capable in the industry. The tools keep changing, but the craft is holding up.",
        [
          { name: 'Paramount TV Media', workTitle: 'South Park', workUrl: 'http://www.tellyawards.com/winners/2026/animated-tv-film-shorts/tv-or-online-shows-segments-comedy/south-park/355910', metricValue: '827k', metricPlatform: 'linkedin', metricUrl: 'https://www.linkedin.com/company/paramountco/posts/?feedView=all' },
          { name: 'BUCK', workTitle: 'Airbnb Experiences', workUrl: 'http://www.tellyawards.com/winners/2026/animated-commercials/craft-3dcg-animation/airbnb-experiences-the-grand-adventure/355748', metricValue: '394k', metricPlatform: 'instagram', metricUrl: 'https://www.instagram.com/buck_design/' },
          { name: 'bento box', workTitle: "Bob's Burgers Lo-Fry Volume I", workUrl: 'https://youtu.be/u5L7n3veUKU', metricValue: '64k', metricPlatform: 'linkedin', metricUrl: 'https://www.linkedin.com/company/bento-box-entertainment-llc/' },
          { name: 'Laundry', workTitle: 'Now You See Me: Now You Don\'t — MOE Titles', workUrl: 'https://laundrystudio.slateapp.com/embed/clip/1772', metricValue: '19k', metricPlatform: 'linkedin', metricUrl: 'https://www.linkedin.com/company/laundry-design-llc/' },
          { name: 'Epipheo', workTitle: 'The Endless Life of Water', workUrl: 'https://epipheo-1.wistia.com/medias/uup2oah44y', metricValue: '10k', metricPlatform: 'linkedin', metricUrl: 'https://www.linkedin.com/company/epipheo/' },
          { name: 'Abema', workTitle: 'Poppin — Play Kitchen', workUrl: 'https://www.youtube.com/watch?v=NFhaUF5gElQ', metricValue: '900', metricPlatform: 'linkedin', metricUrl: 'https://www.linkedin.com/company/abematv/' },
          { name: 'Bodega Virtual', workTitle: 'Pac-Man 45th Anniversary', workUrl: 'http://www.tellyawards.com/winners/2026/animated-commercials/craft-directing/pac-man-45th-anniversary/355749', metricValue: '152', metricPlatform: 'linkedin', metricUrl: 'https://www.linkedin.com/company/bodega-virtual/' },
        ]
      ),
      winnerList(
        'Top 5 Sports',
        "We've all played sports in one form or another: from track & field to bowling or basketball — even fantasy football counts. Sports video isn't just about the game or the player but the fandom that follows it. Which one moves you?",
        [
          { name: 'Melbourne Cricket Club', workTitle: 'Confessions of a Lions Fan', workUrl: 'http://www.tellyawards.com/winners/2026/branded-content/general-sports/confessions-of-a-lions-fan-melbourne-cricket-ground/356851', metricValue: '279k', metricPlatform: 'instagram', metricUrl: 'https://www.instagram.com/mcg/?hl=en' },
          { name: 'Green Bay Packers', workTitle: 'The Frozen Tundra', workUrl: 'https://www.tellyawards.com/winners/2026/branded-content/general-sports/packers-frozen-tundra/356227/', metricValue: '75k', metricPlatform: 'linkedin', metricUrl: 'https://www.linkedin.com/company/green-bay-packers/' },
          { name: 'Blue Ox', workTitle: 'NIKE || BREAKING4', workUrl: 'https://vimeo.com/1093205575', metricValue: '822', metricPlatform: 'linkedin', metricUrl: 'https://www.linkedin.com/company/blueoxfilms/' },
          { name: 'Portland Trailblazers', workTitle: 'The Box', workUrl: 'https://www.tellyawards.com/winners/2026/social-video/general-sports/the-box-toumani-camara-for-2024-25-defensive-player-of-the-year/361705/' },
          { name: 'Olympic Channel', workTitle: 'Champions of the Golden Valley', workUrl: 'https://www.tellyawards.com/winners/2026/film-shorts/general-documentary/champions-of-the-golden-valley/357719/' },
          { name: 'ESPN', workTitle: 'Fuera de Juego', workUrl: 'https://recognitionmedia-production.s3.amazonaws.com/8/ToBeEncoded/2cdb4748-ad99-4472-90e3-eab5b706b899.mp4' },
        ]
      ),
      winnerList(
        'Wins to Watch: Top 5 AI',
        '"AI is changing our industry at an incredible pace… If your work can solve a problem, move people, challenge how they see the world, or simply make them feel something, there will always be a place for great storytellers." — Maggie Luo',
        [
          { name: 'Cisco', workTitle: 'Your Stage for the Moments That Matter', workUrl: 'http://www.tellyawards.com/winners/2026/online-commercials/general-b2b-business-to-business/your-stage-for-the-moments-that-matter/360622', metricValue: '8M', metricPlatform: 'linkedin', metricUrl: 'https://www.linkedin.com/company/cisco/' },
          { name: 'ISLA', workTitle: "Valentine's DA.I", workUrl: 'http://www.tellyawards.com/winners/2026/film-shorts/craft-use-of-generative-ai/valentines-dai/357753' },
          { name: 'UNSHOT', workTitle: 'Plastic Ocean', workUrl: 'https://www.tellyawards.com/winners/2026/non-broadcast/craft-use-of-generative-ai/plastic-ocean/359063/' },
          { name: 'Melt Pictures', workTitle: 'Shokz x Hyrox Co-branded Concept Video', workUrl: 'http://www.tellyawards.com/winners/2026/online-commercials/generative-ai-branding/shokz-x-hyrox-co-branded-concept-video/360534' },
          { name: 'Fourth Crown Studios LLC', workTitle: "Lainey Wilson's Let It Snow", workUrl: 'https://www.tellyawards.com/winners/2026/branded-content/craft-visual-effects/lainey-wilson-let-it-snow/356145/' },
        ]
      ),
    ],
  },
]

// ─────────────────────────────────────────────────────────────────

const patch = {
  aboutEyebrow: 'About',
  aboutHeading: 'About The Telly Awards',
  aboutBody,
  aboutCtaText: 'Enter Now',
  aboutCtaUrl: 'https://www.tellyawards.com',
  letterBody,
  keyFindings,
  ...facts,
  judgeInsightsEyebrow: 'Insights From The Season',
  judgeInsightsHeading: 'Who Determined What Made The Cut?',
  judgeQuotes,
  sectionCovers,
  trendSections,
}

function summarize() {
  const entryCount = trendSections.reduce(
    (sum, t) => sum + (t.winnerLists || []).reduce((s, l) => s + l.entries.length, 0),
    0
  )
  console.log(`\n— ${sectionCovers.length} section covers`)
  console.log(`— ${trendSections.length} trend sections`)
  console.log(`— ${trendSections.reduce((s, t) => s + (t.winnerLists || []).length, 0)} winner lists, ${entryCount} total winner entries`)
  console.log(`— ${judgeQuotes.length} judge quotes`)
  console.log(`— ${keyFindings.length} key findings (Table of Contents)`)
  console.log('\nNOTE: aboutLogo left unset — falls back to /public/telly/telly-logo-black.svg until a real logo image is uploaded in Studio.')
  console.log('NOTE: letterAuthors (Amanda Needham, title, photo) were already correct on the live doc — not touched.\n')
}

if (DRY_RUN) {
  console.log(JSON.stringify(patch, null, 2))
  summarize()
  process.exit(0)
}

const result = await client.patch(DOC_ID).set(patch).commit()
console.log(`Patched ${DOC_ID} — new revision ${result._rev}`)
summarize()
