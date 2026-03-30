/**
 * Migrate hardcoded trend content to Sanity CMS
 *
 * Usage:
 *   SANITY_API_TOKEN=sk-... node scripts/migrate-trends-to-sanity.mjs
 *
 * Get a token from: https://www.sanity.io/manage/project/za6m18kc/api#tokens
 * (needs Editor or above permissions)
 */

import { createClient } from '@sanity/client'

const PROJECT_ID = 'za6m18kc'
const DATASET = 'production'
const TOKEN = process.env.SANITY_API_TOKEN

if (!TOKEN) {
  console.error('Missing SANITY_API_TOKEN. Get one from https://www.sanity.io/manage/project/za6m18kc/api#tokens')
  process.exit(1)
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// Helper: create a portable text block from a plain string
function textBlock(text, key) {
  return {
    _type: 'block',
    _key: key || Math.random().toString(36).slice(2, 10),
    children: [{ _type: 'span', _key: 's' + Math.random().toString(36).slice(2, 8), text }],
    markDefs: [],
    style: 'normal',
  }
}

// All 7 trends — pulled from the current live site content (TREND_OVERRIDES + MOCK_DATA_STATS)
const trends = [
  {
    enabled: true,
    trendTitle: 'The Best AI Is Invisible',
    trendBody: [
      textBlock('The strongest AI products this season shared one quality: the technology was invisible. They solved existing problems — tax preparation, health monitoring, wildfire detection, and accessibility — without making users consider the AI layer. The moment they did, Executive Judges noted that the product had already lost users.'),
      textBlock('As AI becomes a mainstay, utility and novelty are the bars to meet.'),
    ],
    showFeaturedProjects: true,
    featuredProjects: [
      { _key: 'fp0', _type: 'featuredProject', title: 'TurboTax AI Concierge', url: 'https://turbotax.intuit.com/lp/webby/' },
      { _key: 'fp1', _type: 'featuredProject', title: "Carveco LTD's Beyond Vision - AI for Blind", url: 'http://www.touch-beyond-vision.com' },
      { _key: 'fp2', _type: 'featuredProject', title: 'ClimateGPT 3.0', url: 'http://climategpt.ai' },
      { _key: 'fp3', _type: 'featuredProject', title: 'MiroMind', url: 'http://www.MiroMind.ai' },
    ],
    showData: true,
    dataHeadline: 'What Webby 30 Signals About the Future',
    dataSubheadline: 'When asked about the competition and future, these are the signals Executive Judges returned to most. AI and storytelling are capturing the industry\u2019s attention right now.',
    dataStats: [
      { _key: 'ds0', _type: 'dataStat', value: 79, label: 'AI categories will transform by Webby 31' },
      { _key: 'ds1', _type: 'dataStat', value: 61, label: 'cited storytelling as a recurring theme across categories' },
      { _key: 'ds2', _type: 'dataStat', value: 53, label: 'named AI Integration as the craft showing the most growth' },
    ],
    showQuotes: true,
    expertQuotes: [
      {
        _key: 'eq0', _type: 'expertQuote',
        name: 'Tom Hale', title: 'CEO, Oura',
        headshotUrl: '/judges/tom_hale_720.jpg',
        quoteText: [textBlock('\u201CThe best AI category entrants avoided the trap of \u2018chat shall be its interface\u2019 and leaned more on personalization, interaction, and just-in-time content generation.\u201D')],
      },
      {
        _key: 'eq1', _type: 'expertQuote',
        name: 'Jeanniey Walden', title: 'Founder & CMO, Liftoff Enterprises',
        headshotUrl: '/judges/jeanniey__walden_360.jpg',
        quoteText: [textBlock('\u201CWhat distinguished the best AI products was this: the AI was invisible to the person using it. You didn\u2019t feel like you were \u2018using an AI product.\u2019 You felt like the product finally worked the way it should have always worked. The moment someone has to think about the AI layer, the product has already lost.\u201D')],
      },
      {
        _key: 'eq2', _type: 'expertQuote',
        name: 'Martin Cedergren', title: 'Creative Director, Xnet',
        headshotUrl: '/judges/martin_cedergren_360.jpg',
        quoteText: [textBlock('\u201CA focus on \u2018invisible\u2019 utility that automates drudgery rather than just adding a chatbot. Also, accessibility tools and real-time translation that solved actual human barriers with zero friction.\u201D')],
      },
    ],
    showVideo: true,
    videoType: 'local',
    videoUrl: '/trend-video-test.mp4',
  },
  {
    enabled: true,
    trendTitle: 'The Best AI Integrations Were Unapologetic',
    trendBody: [
      textBlock('More than 50% of Executive Judges ranked AI Integration as the craft discipline that showed the most growth in the 30th Annual Webby Awards.'),
      textBlock('The strongest integrations this season used AI as a means, but not the primary idea. Half of the judges also ranked Executive & Production as the most sophisticated use of AI, by using it to unlock new ways for people to engage or experience an idea.'),
      textBlock('Unlike AI products, where invisibility is the goal, the best integrations in Webby 30 were unapologetically AI. The technology wasn\u2019t hidden; it was the point to produce something surreal, personalized, or scalable.'),
    ],
    showFeaturedProjects: true,
    featuredProjects: [
      { _key: 'fp0', _type: 'featuredProject', title: 'Jeep\u2019s \u201CWild Thoughts\u201D by HighDive', url: 'https://www.youtube.com/watch?v=zKfk5x0PMMs' },
      { _key: 'fp1', _type: 'featuredProject', title: 'Find Your Feet by Code and Theory', url: 'https://www.codeandtheory.com/things-we-make/scores-network-find-your-feet' },
    ],
    showData: true,
    dataHeadline: 'What Set AI Integrations Apart',
    dataSubheadline: 'Judges weighed in on where AI integrations performed best in this year\u2019s top entries, and where they saw the biggest leaps. Half said execution and production, followed by concept.',
    dataStats: [
      { _key: 'ds0', _type: 'dataStat', value: 50, label: 'Execution & Production' },
      { _key: 'ds1', _type: 'dataStat', value: 19, label: 'Concept' },
      { _key: 'ds2', _type: 'dataStat', value: 12, label: 'Audience Interaction' },
      { _key: 'ds3', _type: 'dataStat', value: 12, label: 'Distribution' },
    ],
    showQuotes: true,
    expertQuotes: [
      {
        _key: 'eq0', _type: 'expertQuote',
        name: 'Robert Slot', title: 'Chief Innovation Officer, TBWA\\NEBOKO',
        linkedInUrl: 'https://nl.linkedin.com/in/robertslot',
        quoteText: [textBlock('\u201CThe standout work used AI as a means, not the message. The most interesting applications weren\u2019t about showing off the technology, but about unlocking new ways for people to engage, contribute, or experience an idea.\u201D')],
      },
      {
        _key: 'eq1', _type: 'expertQuote',
        name: 'Jeanniey Walden', title: 'Founder, CMO, Liftoff Enterprises',
        linkedInUrl: 'https://www.linkedin.com/in/jeannieywalden',
        quoteText: [textBlock('\u201CJeep\u2019s \u2018Wild Thoughts\u2019 campaign for the 2026 Grand Cherokee put talking wild animals in front of the camera to give unfiltered reviews of the vehicle\u2026 It\u2019s ridiculous, and it knows it. What makes it work is that the AI isn\u2019t hiding. The absurdity of the concept requires AI to exist.\u201D')],
      },
      {
        _key: 'eq2', _type: 'expertQuote',
        name: 'Kim Larson', title: 'Managing Director, Head of Creators & Gaming, YouTube',
        linkedInUrl: 'https://www.linkedin.com/in/kim-larson-304486',
        quoteText: [textBlock('\u201CThe best AI integrations were unapologetically AI. They went beyond transitions and used AI to elevate the complete narrative arc.\u201D')],
      },
    ],
    showVideo: true,
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=zKfk5x0PMMs',
  },
  {
    enabled: true,
    trendTitle: 'The Best Creators Went Deeper, Not Broader',
    trendBody: [
      textBlock('More than a third of judges named distinct POV as the defining quality of this season\u2019s top Creator and Social projects. The work that stood out dove deeper into a niche, a format, or a community. Intentional, serialized storytelling that committed to a narrative over time outperformed single executions.'),
      textBlock('Executive Judges also flagged \u201Cradical humanism\u201D as a differentiator amongst social entries. While production quality was important, the best stories leaned into influencer maturity and cultural awareness over a polished product.'),
    ],
    showFeaturedProjects: true,
    featuredProjects: [
      { _key: 'fp0', _type: 'featuredProject', title: 'Stella Artois \u201CWho Is Other David?\u201D', url: 'https://www.youtube.com/watch?v=FQ_pPtV2uWo' },
      { _key: 'fp1', _type: 'featuredProject', title: '15 Second Film', url: 'https://www.youtube.com/watch?v=FQ_pPtV2uWo' },
      { _key: 'fp2', _type: 'featuredProject', title: 'iPhone Standby Dock by OVERWERK and Scott Yu-Jan', url: 'https://www.instagram.com/reel/C_fwPDqpwXB/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
    ],
    showQuotes: true,
    expertQuotes: [
      { _key: 'eq0', _type: 'expertQuote', name: 'Mary Nittolo', title: 'Founder & CCO, the STUDIO', quoteText: [textBlock('\u201CIt\u2019s not the format, it\u2019s the person. Performance and specificity are what make stuff effective.\u201D')] },
      { _key: 'eq1', _type: 'expertQuote', name: 'Olive Mwangi', title: 'Head of Social Media, Dentsu Creative Kenya', quoteText: [textBlock('\u201CFor more complex, tech-led products, audiences are not only willing but actively choosing to engage with longer, more detailed storytelling. The most effective work came from creators who understood where their product naturally fits within that spectrum.\u201D')] },
      { _key: 'eq2', _type: 'expertQuote', name: 'Alessandro Bogliari', title: 'Co-Founder & CEO, The Influencer Marketing Factory', quoteText: [textBlock('\u201CThe creators doing the most interesting work this season aren\u2019t optimizing for everyone. They\u2019re going deeper on a niche, a format, a community, and the audience loyalty that follows is measurably stronger.\u201D')] },
    ],
  },
  {
    enabled: true,
    trendTitle: 'The Best Websites Did Less, To Do More',
    trendBody: [
      textBlock('Restraint and creative risk. Those themes defined web experiences this season. As AI tools democratize templates and design conventions, UX literacy has risen for both creatives and users. That made standing out amongst the competition more difficult this year.'),
      textBlock('For Executive Judges, the top websites and mobile sites scaled back and invested in doing fewer things extremely well.'),
      textBlock('47% of judges cited intentional motion as a defining quality, followed by broken-grid layouts, kinetic typography, and scroll-based narratives. The throughline was a desire to have websites feel specific.'),
    ],
    showFeaturedProjects: true,
    featuredProjects: [
      { _key: 'fp0', _type: 'featuredProject', title: 'FramLabs', url: 'https://framlabs.com/' },
      { _key: 'fp1', _type: 'featuredProject', title: 'GUDEA', url: 'https://www.gudea.ai/' },
      { _key: 'fp2', _type: 'featuredProject', title: 'BEA \u2014 Brand Experience Agent', url: 'http://brand-experience-agent.com' },
    ],
    showQuotes: true,
    expertQuotes: [
      { _key: 'eq0', _type: 'expertQuote', name: 'Magnus \u00D6stberg', title: 'Chief Software Officer, Mercedes-Benz AG', linkedInUrl: 'https://de.linkedin.com/in/magnus-%C3%B6stberg', quoteText: [textBlock('\u201CUX is moving toward quieter intelligence: interfaces that are more adaptive, more context-aware, and less visually noisy. FramLabs is a useful winner example because its proposition is built around clarity, decision support and measurable learning.\u201D')] },
      { _key: 'eq1', _type: 'expertQuote', name: 'Sumin Chou', title: 'Partner, Schema', linkedInUrl: 'https://www.linkedin.com/in/sumin-chou', quoteText: [textBlock('\u201CThere was a notable maturity in motion design \u2014 purposeful animation that guided attention and focus for meaningful experience outcomes.\u201D')] },
      { _key: 'eq2', _type: 'expertQuote', name: 'Alex Naghavi', title: 'Creative Director, Block', linkedInUrl: 'https://www.linkedin.com/in/alexnaghavi', quoteText: [textBlock('\u201CWith AI lowering the barrier to building more ambitious experiences\u2014and more people vibe\u2011coding on their own\u2014we\u2019re starting to see interfaces that take bigger swings in interaction, motion, and narrative structure. There\u2019s a desire to make sites feel specific again, not just interchangeable layouts with different logos.\u201D')] },
    ],
  },
  {
    enabled: true,
    trendTitle: 'Brand Partnerships That Feel Internet Native',
    trendBody: [
      textBlock('The benchmark Executive Judges set was simple: would people follow this even without a media buy behind it? This season\u2019s top brand partnerships and creator collaborations embedded a brand inside conversations that the Internet would already be having, with creators who would already be leading them.'),
      textBlock('This was most prevalent in the inaugural Creator Business categories. Standout brand work launched products inside a creator\u2019s ecosystem or channels. Platform fluency was also a consistent marker of success.'),
    ],
    showFeaturedProjects: true,
    featuredProjects: [
      { _key: 'fp0', _type: 'featuredProject', title: 'Jordan Brand \u201CCan\u2019t Ban Greatness\u201D', url: 'https://www.nike.com/a/air-jordan-banned-history' },
      { _key: 'fp1', _type: 'featuredProject', title: 'Bottega Veneta \u201CCreative Rites of Venice\u201D', url: 'https://www.theatlantic.com/sponsored/bottega-veneta-2025/the-creative-rites-of-venice/3991/' },
      { _key: 'fp2', _type: 'featuredProject', title: 'Kismet - A Journey with Adrien Brody', url: 'https://www.youtube.com/watch?v=kp4SZAchvgI' },
      { _key: 'fp3', _type: 'featuredProject', title: 'Etsy\u2019s The Icon Collection', url: 'https://www.etsy.com/featured/theiconcollection' },
    ],
    showQuotes: true,
    expertQuotes: [
      { _key: 'eq0', _type: 'expertQuote', name: 'Brendan Gahan', title: 'CEO, Creator Authority', linkedInUrl: 'https://www.linkedin.com/in/brendangahan', quoteText: [textBlock('\u201CThe standout partnerships involved creators early and gave them real creative ownership. You could feel when a collaboration was culturally additive rather than transactional.\u201D')] },
      { _key: 'eq1', _type: 'expertQuote', name: 'Mees Rutten', title: 'Founder, Merlin', linkedInUrl: 'https://www.linkedin.com/in/mees-rutten/', quoteText: [textBlock('\u201CWhen a brand trusts a creator enough to let them shape the message and format, you get something that feels native to the platform and earns real engagement.\u201D')] },
      { _key: 'eq2', _type: 'expertQuote', name: 'Lilah Obregon-Wilson', title: 'Music Supervisor and Multi-Media Producer, Disco Cha Cha', linkedInUrl: 'https://www.linkedin.com/in/lilah-obregon-wilson-475aa43', quoteText: [textBlock('\u201CSocial collaborations that had more real people involved, even if a celebrity of sorts was attached was what stood out. Brands seemed to be paying attention to everyday people\u2019s concerns and creating with that in mind.\u201D')] },
    ],
  },
  {
    enabled: true,
    trendTitle: 'Podcasts As Full Visual Worlds',
    trendBody: [
      textBlock('Video has become the default distribution layer for podcasts, and judges were unanimous: the shift is permanent. The best podcast shows built visual worlds, where video was a necessary extension of the story\u2014judges cited production design, more intimate framing, and slower pacing helped video podcasts cut through.'),
      textBlock('Beyond production, the highest-ranking shows built multiplatform ecosystems that extended the conversation beyond the episode. The emotional connection between hosts and listeners carries weight. The highest-performing shows made listeners feel genuinely seen.'),
    ],
    showQuotes: true,
    expertQuotes: [
      { _key: 'eq0', _type: 'expertQuote', name: 'Edmond Huot', title: 'Chief Creative Officer, Forward Studio', linkedInUrl: 'https://www.linkedin.com/in/edmondhuot', quoteText: [textBlock('\u201CI noticed that the highest ranking podcast productions treated visuals as an extension of the storytelling\u2014using framing, pacing, and visual context to deepen the conversation rather than simply recording it.\u201D')] },
      { _key: 'eq1', _type: 'expertQuote', name: 'Rob Rasmussen', title: 'ROBRAS Creative Collective', linkedInUrl: 'https://www.linkedin.com/in/robras', quoteText: [textBlock('\u201CIt feels up close and personal. Eye contact is made as if those speaking could almost see the viewer watching\u2014it holds attention differently than an audio-only format.\u201D')] },
      { _key: 'eq2', _type: 'expertQuote', name: 'Laci Mosley', title: 'Scam Goddess', linkedInUrl: 'https://www.linkedin.com/in/laci-mosley-29814047', quoteText: [textBlock('\u201CPodcasts have always felt like punk rock to me. I think celebrity and social media influence pushed forward a lot of shows this season. That\u2019s not to say that all of those celebrity shows are not worthy of recognition\u2026but there are so many shows that have been steadfast and going for years in smaller markets with a loyal fan base creating consistent, amazing work.\u201D')] },
    ],
  },
  {
    enabled: true,
    trendTitle: 'Craft As an Act of AI Defiance',
    trendBody: [
      textBlock('The strongest ad campaigns and video work operated as systems, spanning multiple channels, but anchored in a single idea. While some entries felt stagnant, branded work that was designed for community participation and centered on real, human stories stood out.'),
      textBlock('Craft made a comeback as an act of defiance against AI, according to several judges. Specificity trumped polish: niche stories, humor, and narratives rooted in empathy and the resilience of the human spirit outperformed generic executions.'),
      textBlock('Mid-form storytelling (3\u20137 minutes) emerged as a new format preference, prioritizing depth over a quick viral hook.'),
    ],
    showFeaturedProjects: true,
    featuredProjects: [
      { _key: 'fp0', _type: 'featuredProject', title: 'KLM Recruitment Campaign' },
      { _key: 'fp1', _type: 'featuredProject', title: 'Fractional Window Shopping' },
      { _key: 'fp2', _type: 'featuredProject', title: 'Ladywell \u201CUncensor Your Health\u201D' },
      { _key: 'fp3', _type: 'featuredProject', title: 'Only Murders In the Building \u2014 Digital Playing Cards' },
      { _key: 'fp4', _type: 'featuredProject', title: 'Complete the Streets \u2014 Community Biking Campaign' },
    ],
    showQuotes: true,
    expertQuotes: [
      { _key: 'eq0', _type: 'expertQuote', name: 'Marisa Lather', title: 'Marketer Marisa', linkedInUrl: 'https://www.linkedin.com/in/marisalather', quoteText: [textBlock('\u201CThe strongest campaigns weren\u2019t single executions\u2014they were systems. Spanning two to three channels, anchored in a single core idea, built for participation from the outset.\u201D')] },
      { _key: 'eq1', _type: 'expertQuote', name: 'Ari Halper', title: 'R/GA', linkedInUrl: 'https://www.linkedin.com/in/ari-halper', quoteText: [textBlock('\u201CAs AI continues to disrupt creative industries, craft is starting to make a comeback. Perhaps out of defiance. A nice reminder that while AI is incredible, so are people.\u201D')] },
      { _key: 'eq2', _type: 'expertQuote', name: 'Mary Nittolo', title: 'Founder & CCO, the STUDIO', linkedInUrl: 'https://www.linkedin.com/in/mary-nittolo-333a064/', quoteText: [textBlock('\u201CThe number of AI entries was significant this year, and some were genuinely exciting. Others, however, felt underdeveloped, and in some cases didn\u2019t perform as well as tools already available. The contrasts were clarifying; it\u2019s artistry and ideas, executed with care intention, and dare I say humanism, that really matters.\u201D')] },
    ],
  },
]

// Add _key and _type to each trend
const trendSections = trends.map((t, i) => ({
  _key: `trend-${i}`,
  _type: 'trendSection',
  ...t,
}))

async function migrate() {
  // Find the report document
  const report = await client.fetch(`*[_type == "report"][0]{ _id }`)
  if (!report) {
    console.error('No report document found in Sanity. Create one first via the Studio.')
    process.exit(1)
  }

  console.log(`Found report: ${report._id}`)
  console.log(`Migrating ${trendSections.length} trends...`)

  // Patch the report with the new trend sections
  await client
    .patch(report._id)
    .set({ trendSections })
    .commit()

  console.log('Done! All 7 trends have been migrated to Sanity.')
  console.log('Open the Sanity Studio to verify: http://localhost:3000/studio')
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
