'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { motion } from 'framer-motion'
import type { TrendSection as TrendSectionType, DataStat, TrendVideo } from '@/sanity/types'
import { AnimatedBg } from './AnimatedBg'
import { urlFor } from '@/sanity/image'

// Use Next.js basePath from config — works at build time for static export
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

// Runtime basePath hook for client-side rendering
function useBasePath() {
  const [bp, setBp] = useState(basePath)
  useEffect(() => {
    // Detect from current page URL if the env var was empty at build time
    if (!bp && typeof window !== 'undefined') {
      const match = window.location.pathname.match(/^(\/preview\/[^/]+)/)
      if (match) setBp(match[1])
    }
  }, [bp])
  return bp
}


export const TREND_COLORS = [
  '#8B70D1', // purple
  '#82D8EB', // cyan
  '#FF7F63', // coral
  '#80D064', // green
  '#FFB763', // orange
  '#FF67CB', // pink
  '#FFDE67', // yellow
]

// Hardcoded trend content overrides (will move to Sanity later)
export const TREND_OVERRIDES: Record<number, {
  title: string
  body: React.ReactNode[]
  featuredProjects: { title: string; url?: string }[]
  quotes?: { name: string; title?: string; quoteText: any[]; linkedInUrl?: string; image?: string }[]
  video?: { type: 'local' | 'youtube'; src: string }
}> = {
  0: {
    title: 'The Best AI Is Invisible',
    body: [
      'The strongest AI products this season shared one quality: the technology was invisible. They solved existing problems — tax preparation, health monitoring, wildfire detection, and accessibility — without making users consider the AI layer. The moment they did, Executive Judges noted that the product had already lost users.',
      'As AI becomes a mainstay, utility and novelty are the bars to meet.',
    ],
    featuredProjects: [
      { title: 'TurboTax AI Concierge', url: 'https://turbotax.intuit.com/lp/webby/' },
      { title: "Carveco LTD's Beyond Vision - AI for Blind", url: 'http://www.touch-beyond-vision.com' },
      { title: 'ClimateGPT 3.0', url: 'http://climategpt.ai' },
      { title: 'MiroMind', url: 'http://www.MiroMind.ai' },
    ],
    quotes: [
      {
        name: 'Tom Hale',
        title: 'CEO, Oura',
        image: `${basePath}/judges/tom_hale_720.jpg`,
        quoteText: [{ _type: 'block', _key: 'q0', children: [{ _type: 'span', _key: 's0', text: '\u201CThe best AI category entrants avoided the trap of \u2018chat shall be its interface\u2019 and leaned more on personalization, interaction, and just-in-time content generation.\u201D' }], markDefs: [], style: 'normal' }],
      },
      {
        name: 'Jeanniey Walden',
        title: 'Founder & CMO, Liftoff Enterprises',
        image: `${basePath}/judges/jeanniey__walden_360.jpg`,
        quoteText: [{ _type: 'block', _key: 'q1', children: [{ _type: 'span', _key: 's1', text: '\u201CWhat distinguished the best AI products was this: the AI was invisible to the person using it. You didn\u2019t feel like you were \u2018using an AI product.\u2019 You felt like the product finally worked the way it should have always worked. The moment someone has to think about the AI layer, the product has already lost.\u201D' }], markDefs: [], style: 'normal' }],
      },
      {
        name: 'Martin Cedergren',
        title: 'Creative Director, Xnet',
        image: `${basePath}/judges/martin_cedergren_360.jpg`,
        quoteText: [{ _type: 'block', _key: 'q2', children: [{ _type: 'span', _key: 's2', text: '\u201CA focus on \u2018invisible\u2019 utility that automates drudgery rather than just adding a chatbot. Also, accessibility tools and real-time translation that solved actual human barriers with zero friction.\u201D' }], markDefs: [], style: 'normal' }],
      },
    ],
  },
  1: {
    title: 'The Best AI Integrations Were Unapologetic',
    body: [
      <><span style={{ color: '#82D8EB', fontWeight: 500 }}>More than 50% of Executive Judges</span> ranked AI Integration as the craft discipline that showed the most growth in the 30th Annual Webby Awards.</>,
      'The strongest integrations this season used AI as a means, but not the primary idea. Half of the judges also ranked Executive & Production as the most sophisticated use of AI, by using it to unlock new ways for people to engage or experience an idea.',
      'Unlike AI products, where invisibility is the goal, the best integrations in Webby 30 were unapologetically AI. The technology wasn\u2019t hidden; it was the point to produce something surreal, personalized, or scalable.',
    ],
    featuredProjects: [
      { title: 'Jeep\u2019s \u201CWild Thoughts\u201D by HighDive', url: 'https://www.youtube.com/watch?v=zKfk5x0PMMs' },
      { title: 'Find Your Feet by Code and Theory', url: 'https://www.codeandtheory.com/things-we-make/scores-network-find-your-feet' },
    ],
    quotes: [
      {
        name: 'Robert Slot',
        title: 'Chief Innovation Officer, TBWA\\NEBOKO',
        linkedInUrl: 'https://nl.linkedin.com/in/robertslot',
        quoteText: [{ _type: 'block', _key: 'q1-0', children: [{ _type: 'span', _key: 's1-0', text: '\u201CThe standout work used AI as a means, not the message. The most interesting applications weren\u2019t about showing off the technology, but about unlocking new ways for people to engage, contribute, or experience an idea.\u201D' }], markDefs: [], style: 'normal' }],
      },
      {
        name: 'Jeanniey Walden',
        title: 'Founder, CMO, Liftoff Enterprises',
        linkedInUrl: 'https://www.linkedin.com/in/jeannieywalden',
        quoteText: [{ _type: 'block', _key: 'q1-1', children: [{ _type: 'span', _key: 's1-1', text: '\u201CJeep\u2019s \u2018Wild Thoughts\u2019 campaign for the 2026 Grand Cherokee put talking wild animals in front of the camera to give unfiltered reviews of the vehicle\u2026 It\u2019s ridiculous, and it knows it. What makes it work is that the AI isn\u2019t hiding. The absurdity of the concept requires AI to exist.\u201D' }], markDefs: [], style: 'normal' }],
      },
      {
        name: 'Kim Larson',
        title: 'Managing Director, Head of Creators & Gaming, YouTube',
        linkedInUrl: 'https://www.linkedin.com/in/kim-larson-304486',
        quoteText: [{ _type: 'block', _key: 'q1-2', children: [{ _type: 'span', _key: 's1-2', text: '\u201CThe best AI integrations were unapologetically AI. They went beyond transitions and used AI to elevate the complete narrative arc.\u201D' }], markDefs: [], style: 'normal' }],
      },
    ],
  },
  2: {
    title: 'The Best Creators Went Deeper, Not Broader',
    body: [
      'More than a third of judges named distinct POV as the defining quality of this season\u2019s top Creator and Social projects. The work that stood out dove deeper into a niche, a format, or a community. Intentional, serialized storytelling that committed to a narrative over time outperformed single executions.',
      <>Executive Judges also flagged <span style={{ color: '#FF7F63', fontWeight: 500 }}>&ldquo;radical humanism&rdquo;</span> as a differentiator amongst social entries. While production quality was important, the best stories leaned into influencer maturity and cultural awareness over a polished product.</>,
    ],
    featuredProjects: [
      { title: 'Stella Artois \u201CWho Is Other David?\u201D', url: 'https://www.youtube.com/watch?v=FQ_pPtV2uWo' },
      { title: '15 Second Film', url: 'https://www.youtube.com/watch?v=FQ_pPtV2uWo' },
      { title: 'iPhone Standby Dock by OVERWERK and Scott Yu-Jan', url: 'https://www.instagram.com/reel/C_fwPDqpwXB/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
    ],
    quotes: [
      {
        name: 'Mary Nittolo',
        title: 'Founder & CCO, the STUDIO',
        quoteText: [{ _type: 'block', _key: 'q2-0', children: [{ _type: 'span', _key: 's2-0', text: '\u201CIt\u2019s not the format, it\u2019s the person. Performance and specificity are what make stuff effective.\u201D' }], markDefs: [], style: 'normal' }],
      },
      {
        name: 'Olive Mwangi',
        title: 'Head of Social Media, Dentsu Creative Kenya',
        quoteText: [{ _type: 'block', _key: 'q2-1', children: [{ _type: 'span', _key: 's2-1', text: '\u201CFor more complex, tech-led products, audiences are not only willing but actively choosing to engage with longer, more detailed storytelling. The most effective work came from creators who understood where their product naturally fits within that spectrum.\u201D' }], markDefs: [], style: 'normal' }],
      },
      {
        name: 'Alessandro Bogliari',
        title: 'Co-Founder & CEO, The Influencer Marketing Factory',
        quoteText: [{ _type: 'block', _key: 'q2-2', children: [{ _type: 'span', _key: 's2-2', text: '\u201CThe creators doing the most interesting work this season aren\u2019t optimizing for everyone. They\u2019re going deeper on a niche, a format, a community, and the audience loyalty that follows is measurably stronger.\u201D' }], markDefs: [], style: 'normal' }],
      },
    ],
  },
  3: {
    title: 'The Best Websites Did Less, To Do More',
    body: [
      'Restraint and creative risk. Those themes defined web experiences this season. As AI tools democratize templates and design conventions, UX literacy has risen for both creatives and users. That made standing out amongst the competition more difficult this year.',
      'For Executive Judges, the top websites and mobile sites scaled back and invested in doing fewer things extremely well.',
      <><span style={{ color: '#80D064', fontWeight: 500 }}>47% of judges</span> cited intentional motion as a defining quality, followed by broken-grid layouts, kinetic typography, and scroll-based narratives. The throughline was a desire to have websites feel specific.</>,
    ],
    featuredProjects: [
      { title: 'FramLabs', url: 'https://framlabs.com/' },
      { title: 'GUDEA', url: 'https://www.gudea.ai/' },
      { title: 'BEA \u2014 Brand Experience Agent', url: 'http://brand-experience-agent.com' },
    ],
    quotes: [
      {
        name: 'Magnus Östberg',
        title: 'Chief Software Officer, Mercedes-Benz AG',
        linkedInUrl: 'https://de.linkedin.com/in/magnus-%C3%B6stberg',
        quoteText: [{ _type: 'block', _key: 'q3-0', children: [{ _type: 'span', _key: 's3-0', text: '\u201CUX is moving toward quieter intelligence: interfaces that are more adaptive, more context-aware, and less visually noisy. FramLabs is a useful winner example because its proposition is built around clarity, decision support and measurable learning.\u201D' }], markDefs: [], style: 'normal' }],
      },
      {
        name: 'Sumin Chou',
        title: 'Partner, Schema',
        linkedInUrl: 'https://www.linkedin.com/in/sumin-chou',
        quoteText: [{ _type: 'block', _key: 'q3-1', children: [{ _type: 'span', _key: 's3-1', text: '\u201CThere was a notable maturity in motion design \u2014 purposeful animation that guided attention and focus for meaningful experience outcomes.\u201D' }], markDefs: [], style: 'normal' }],
      },
      {
        name: 'Alex Naghavi',
        title: 'Creative Director, Block',
        linkedInUrl: 'https://www.linkedin.com/in/alexnaghavi',
        quoteText: [{ _type: 'block', _key: 'q3-2', children: [{ _type: 'span', _key: 's3-2', text: '\u201CWith AI lowering the barrier to building more ambitious experiences\u2014and more people vibe\u2011coding on their own\u2014we\u2019re starting to see interfaces that take bigger swings in interaction, motion, and narrative structure. There\u2019s a desire to make sites feel specific again, not just interchangeable layouts with different logos.\u201D' }], markDefs: [], style: 'normal' }],
      },
    ],
  },
  4: {
    title: 'Brand Partnerships That Feel Internet Native',
    body: [
      <>The benchmark Executive Judges set was simple: would people follow this even without a media buy behind it? This season&rsquo;s top brand partnerships and creator collaborations <span style={{ color: '#FFB763', fontWeight: 500 }}>embedded a brand inside conversations that the Internet would already be having</span>, with creators who would already be leading them.</>,
      'This was most prevalent in the inaugural Creator Business categories. Standout brand work launched products inside a creator\u2019s ecosystem or channels. Platform fluency was also a consistent marker of success.',
    ],
    featuredProjects: [
      { title: 'Jordan Brand \u201CCan\u2019t Ban Greatness\u201D', url: 'https://www.nike.com/a/air-jordan-banned-history' },
      { title: 'Bottega Veneta \u201CCreative Rites of Venice\u201D', url: 'https://www.theatlantic.com/sponsored/bottega-veneta-2025/the-creative-rites-of-venice/3991/' },
      { title: 'Kismet - A Journey with Adrien Brody', url: 'https://www.youtube.com/watch?v=kp4SZAchvgI' },
      { title: 'Etsy\u2019s The Icon Collection', url: 'https://www.etsy.com/featured/theiconcollection' },
    ],
    quotes: [
      {
        name: 'Brendan Gahan',
        title: 'CEO, Creator Authority',
        linkedInUrl: 'https://www.linkedin.com/in/brendangahan',
        quoteText: [{ _type: 'block', _key: 'q4-0', children: [{ _type: 'span', _key: 's4-0', text: '\u201CThe standout partnerships involved creators early and gave them real creative ownership. You could feel when a collaboration was culturally additive rather than transactional.\u201D' }], markDefs: [], style: 'normal' }],
      },
      {
        name: 'Mees Rutten',
        title: 'Founder, Merlin',
        linkedInUrl: 'https://www.linkedin.com/in/mees-rutten/',
        quoteText: [{ _type: 'block', _key: 'q4-1', children: [{ _type: 'span', _key: 's4-1', text: '\u201CWhen a brand trusts a creator enough to let them shape the message and format, you get something that feels native to the platform and earns real engagement.\u201D' }], markDefs: [], style: 'normal' }],
      },
      {
        name: 'Lilah Obregon-Wilson',
        title: 'Music Supervisor and Multi-Media Producer, Disco Cha Cha',
        linkedInUrl: 'https://www.linkedin.com/in/lilah-obregon-wilson-475aa43',
        quoteText: [{ _type: 'block', _key: 'q4-2', children: [{ _type: 'span', _key: 's4-2', text: '\u201CSocial collaborations that had more real people involved, even if a celebrity of sorts was attached was what stood out. Brands seemed to be paying attention to everyday people\u2019s concerns and creating with that in mind.\u201D' }], markDefs: [], style: 'normal' }],
      },
    ],
  },
  5: {
    title: 'Podcasts As Full Visual Worlds',
    body: [
      <>Video has become the default distribution layer for podcasts, and judges were unanimous: the shift is permanent. The best podcast shows built visual worlds, where <span style={{ color: '#FF67CB', fontWeight: 500 }}>video was a necessary extension of the story</span>&mdash;judges cited production design, more intimate framing, and slower pacing helped video podcasts cut through.</>,
      'Beyond production, the highest-ranking shows built multiplatform ecosystems that extended the conversation beyond the episode. The emotional connection between hosts and listeners carries weight. The highest-performing shows made listeners feel genuinely seen.',
    ],
    featuredProjects: [],
    quotes: [
      {
        name: 'Edmond Huot',
        title: 'Chief Creative Officer, Forward Studio',
        linkedInUrl: 'https://www.linkedin.com/in/edmondhuot',
        quoteText: [{ _type: 'block', _key: 'q5-0', children: [{ _type: 'span', _key: 's5-0', text: '\u201CI noticed that the highest ranking podcast productions treated visuals as an extension of the storytelling\u2014using framing, pacing, and visual context to deepen the conversation rather than simply recording it.\u201D' }], markDefs: [], style: 'normal' }],
      },
      {
        name: 'Rob Rasmussen',
        title: 'ROBRAS Creative Collective',
        linkedInUrl: 'https://www.linkedin.com/in/robras',
        quoteText: [{ _type: 'block', _key: 'q5-1', children: [{ _type: 'span', _key: 's5-1', text: '\u201CIt feels up close and personal. Eye contact is made as if those speaking could almost see the viewer watching\u2014it holds attention differently than an audio-only format.\u201D' }], markDefs: [], style: 'normal' }],
      },
      {
        name: 'Laci Mosley',
        title: 'Scam Goddess',
        linkedInUrl: 'https://www.linkedin.com/in/laci-mosley-29814047',
        quoteText: [{ _type: 'block', _key: 'q5-2', children: [{ _type: 'span', _key: 's5-2', text: '\u201CPodcasts have always felt like punk rock to me. I think celebrity and social media influence pushed forward a lot of shows this season. That\u2019s not to say that all of those celebrity shows are not worthy of recognition\u2026but there are so many shows that have been steadfast and going for years in smaller markets with a loyal fan base creating consistent, amazing work.\u201D' }], markDefs: [], style: 'normal' }],
      },
    ],
  },
  6: {
    title: 'Craft As an Act of AI Defiance',
    body: [
      'The strongest ad campaigns and video work operated as systems, spanning multiple channels, but anchored in a single idea. While some entries felt stagnant, branded work that was designed for community participation and centered on real, human stories stood out.',
      <><span style={{ color: '#FFDE67', fontWeight: 500 }}>Craft made a comeback as an act of defiance against AI</span>, according to several judges. Specificity trumped polish: niche stories, humor, and narratives rooted in empathy and the resilience of the human spirit outperformed generic executions.</>,
      'Mid-form storytelling (3\u20137 minutes) emerged as a new format preference, prioritizing depth over a quick viral hook.',
    ],
    featuredProjects: [
      { title: 'KLM Recruitment Campaign' },
      { title: 'Fractional Window Shopping' },
      { title: 'Ladywell \u201CUncensor Your Health\u201D' },
      { title: 'Only Murders In the Building \u2014 Digital Playing Cards' },
      { title: 'Complete the Streets \u2014 Community Biking Campaign' },
    ],
    quotes: [
      {
        name: 'Marisa Lather',
        title: 'Marketer Marisa',
        linkedInUrl: 'https://www.linkedin.com/in/marisalather',
        quoteText: [{ _type: 'block', _key: 'q6-0', children: [{ _type: 'span', _key: 's6-0', text: '\u201CThe strongest campaigns weren\u2019t single executions\u2014they were systems. Spanning two to three channels, anchored in a single core idea, built for participation from the outset.\u201D' }], markDefs: [], style: 'normal' }],
      },
      {
        name: 'Ari Halper',
        title: 'R/GA',
        linkedInUrl: 'https://www.linkedin.com/in/ari-halper',
        quoteText: [{ _type: 'block', _key: 'q6-1', children: [{ _type: 'span', _key: 's6-1', text: '\u201CAs AI continues to disrupt creative industries, craft is starting to make a comeback. Perhaps out of defiance. A nice reminder that while AI is incredible, so are people.\u201D' }], markDefs: [], style: 'normal' }],
      },
      {
        name: 'Mary Nittolo',
        title: 'Founder & CCO, the STUDIO',
        linkedInUrl: 'https://www.linkedin.com/in/mary-nittolo-333a064/',
        quoteText: [{ _type: 'block', _key: 'q6-2', children: [{ _type: 'span', _key: 's6-2', text: '\u201CThe number of AI entries was significant this year, and some were genuinely exciting. Others, however, felt underdeveloped, and in some cases didn\u2019t perform as well as tools already available. The contrasts were clarifying; it\u2019s artistry and ideas, executed with care intention, and dare I say humanism, that really matters.\u201D' }], markDefs: [], style: 'normal' }],
      },
    ],
  },
}

// Mock data for trend data modules (will move to Sanity later)
const MOCK_DATA_STATS: Record<number, { headline: string; subheadline: string; stats: DataStat[] }> = {
  0: {
    headline: 'What Webby 30 Signals About the Future',
    subheadline: 'When asked about the competition and future, these are the signals Executive Judges returned to most. AI and storytelling are capturing the industry\u2019s attention right now.',
    stats: [
      { value: 79, label: 'AI categories will transform by Webby 31' },
      { value: 61, label: 'cited storytelling as a recurring theme across categories' },
      { value: 53, label: 'named AI Integration as the craft showing the most growth' },
    ],
  },
  1: {
    headline: 'What Set AI Integrations Apart',
    subheadline: 'Judges weighed in on where AI integrations performed best in this year\u2019s top entries, and where they saw the biggest leaps. Half said execution and production, followed by concept.',
    stats: [
      { value: 50, label: 'Execution & Production' },
      { value: 19, label: 'Concept' },
      { value: 12, label: 'Audience Interaction' },
      { value: 12, label: 'Distribution' },
    ],
  },
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') return window.matchMedia('(max-width: 768px)').matches
    return false
  })
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    // If mobile, immediately clear any scroll locks that may have been set
    if (mq.matches) {
      document.body.style.overflow = ''
      document.documentElement.classList.remove('snap-active')
    }
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

export function TrendSection({ section, index }: { section: TrendSectionType; index: number }) {
  const isMobile = useIsMobile()
  const resolvedBasePath = useBasePath()
  const trendColor = TREND_COLORS[index % TREND_COLORS.length]

  // Quotes — from CMS, respecting toggle
  const allQuotes = (section.showQuotes !== false && section.expertQuotes) ? section.expertQuotes : []
  const quotes = allQuotes.slice(0, 3)

  // Data module — from CMS, respecting toggle
  const dataStats = section.showData !== false && section.dataStats && section.dataStats.length > 0
    ? section.dataStats
    : undefined
  const dataHeadline = section.dataHeadline || section.dataContext
  const dataSubheadline = section.dataSubheadline
  const hasData = !!dataStats && dataStats.length > 0

  // Video — from CMS trendVideo (primary) or legacy videoType/videoUrl fields
  const videoConfig = section.showVideo && section.videoUrl
    ? {
        type: (section.videoType || 'youtube') as 'local' | 'youtube',
        src: section.videoType === 'local' ? `${resolvedBasePath}${section.videoUrl}` : section.videoUrl,
      }
    : undefined
  const hasVideo = section.showVideo !== false && (!!section.trendVideo || !!videoConfig)

  // Build ordered module list based on CMS moduleOrder
  const defaultOrder = ['data', 'quotes', 'video']
  const rawOrder = section.moduleOrder && section.moduleOrder.length > 0
    ? section.moduleOrder.map((m) => typeof m === 'string' ? m : m.module).filter(Boolean)
    : []
  const moduleOrder = rawOrder.length > 0 ? rawOrder : defaultOrder

  // Build phase list: always starts with 'title', then ordered modules
  type PhaseType = 'title' | 'data' | 'quote' | 'video'
  const phaseList: PhaseType[] = ['title']
  for (const mod of moduleOrder) {
    if (mod === 'data' && hasData) phaseList.push('data')
    if (mod === 'quotes') {
      for (let q = 0; q < quotes.length; q++) phaseList.push('quote')
    }
    if (mod === 'video' && hasVideo) phaseList.push('video')
  }

  const totalPhases = phaseList.length
  const dataPhase = phaseList.indexOf('data')
  const quoteStartPhase = phaseList.indexOf('quote')
  const [phase, setPhase] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [videoClosed, setVideoClosed] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const lockRef = useRef(false)
  const enterCooldownRef = useRef(false)

  // Track when this section is in view (desktop only)
  useEffect(() => {
    if (isMobile) return
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting)
        if (entry.isIntersecting) {
          enterCooldownRef.current = true
          setTimeout(() => { enterCooldownRef.current = false }, 800)
          // Reset video closed state when returning to this trend
          setVideoClosed(false)
        }
        // Never reset phase — preserve wherever the user left off
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const advancePhase = useCallback(() => {
    if (lockRef.current) return
    if (phase < totalPhases - 1) {
      lockRef.current = true
      const nextPhase = phase + 1
      // Skip video if it was closed — go straight to next trend
      if (hasVideo && nextPhase === totalPhases - 1 && videoClosed) {
        setCompleted(true)
        setTimeout(() => { lockRef.current = false }, 600)
        window.dispatchEvent(new CustomEvent('trend-next-or-exit'))
        return
      }
      setPhase(nextPhase)
      if (nextPhase === totalPhases - 1) {
        setCompleted(true)
      }
      setTimeout(() => { lockRef.current = false }, 600)
    } else if (phase === totalPhases - 1) {
      // Already on last phase — go to next trend or exit
      window.dispatchEvent(new CustomEvent('trend-next-or-exit'))
    }
  }, [phase, totalPhases, hasVideo, videoClosed])

  const retreatPhase = useCallback(() => {
    if (lockRef.current) return
    if (phase > 0) {
      lockRef.current = true
      setPhase((p) => p - 1)
      setTimeout(() => { lockRef.current = false }, 600)
      return true
    }
    // At phase 0 — go to previous trend
    if (index > 0) {
      window.dispatchEvent(new Event('trend-prev'))
    }
    return false
  }, [phase, index])

  // Lock scrolling while inside an incomplete trend (desktop only)
  useEffect(() => {
    if (!isActive || isMobile) return

    // Let the snap scroll finish, then lock
    document.documentElement.classList.remove('snap-active')
    const lockTimeout = setTimeout(() => {
      document.body.style.overflow = 'hidden'
    }, 600)

    return () => {
      clearTimeout(lockTimeout)
      document.body.style.overflow = ''
      // Only re-enable snap if not on the goodbye page
      const thankYou = document.getElementById('thank-you')
      const thankYouRect = thankYou?.getBoundingClientRect()
      const goingToGoodbye = thankYouRect && thankYouRect.top < window.innerHeight
      if (!goingToGoodbye) {
        document.documentElement.classList.add('snap-active')
      }
    }
  }, [isActive, phase, isMobile])

  // Expose advance/retreat for click-to-navigate (via custom events, desktop only)
  useEffect(() => {
    if (!isActive || isMobile) return
    function handleAdvance() { advancePhase() }
    function handleRetreat() { retreatPhase() }
    window.addEventListener('trend-advance', handleAdvance)
    window.addEventListener('trend-retreat', handleRetreat)
    return () => {
      window.removeEventListener('trend-advance', handleAdvance)
      window.removeEventListener('trend-retreat', handleRetreat)
    }
  }, [isActive, advancePhase, retreatPhase])

  // Touch swipe support (desktop horizontal carousel only — mobile uses vertical scroll)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  useEffect(() => {
    if (!isActive || isMobile) return
    const el = sectionRef.current
    if (!el) return

    function handleTouchStart(e: TouchEvent) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }

    function handleTouchEnd(e: TouchEvent) {
      if (!touchStartRef.current) return
      const dx = e.changedTouches[0].clientX - touchStartRef.current.x
      const dy = e.changedTouches[0].clientY - touchStartRef.current.y
      touchStartRef.current = null

      // Only handle horizontal swipes (dx > dy)
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return

      if (dx < 0) {
        // Swipe left = advance
        advancePhase()
      } else {
        // Swipe right = retreat
        retreatPhase()
      }
    }

    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isActive, advancePhase, retreatPhase])

  // Reset to phase 0 when navigating via subnav (desktop only)
  useEffect(() => {
    if (isMobile) return
    function handleReset(e: Event) {
      const detail = (e as CustomEvent).detail
      if (detail?.index === index) {
        setPhase(0)
        setCompleted(false)
        setVideoClosed(false)
      }
    }
    window.addEventListener('trend-reset-phase', handleReset)
    return () => window.removeEventListener('trend-reset-phase', handleReset)
  }, [index])

  // ── Mobile: vertical stacked layout ──
  if (isMobile) {
    return (
      <div
        ref={sectionRef}
        id={`mobile-trend-${index}`}
        data-mobile-trend={index}
        data-nav-id={`mobile-trend-${index}`}
        style={{
          padding: '60px 20px',
          position: 'relative',
          overflow: 'hidden',
          borderTop: index > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
        }}
      >
        <AnimatedBg variant={index} />

        <div style={{ maxWidth: 1000, width: '100%', margin: '0 auto', position: 'relative' }}>
          {/* Title + Body + Projects */}
          <PhaseTitle
            title={section.trendTitle}
            body={section.trendBody}
            featuredProjects={section.showFeaturedProjects !== false ? section.featuredProjects : undefined}
            index={index}
            color={trendColor}
            isMobile={true}
          />

          {/* Modules — rendered in CMS-defined order */}
          {moduleOrder.map((mod) => {
            if (mod === 'data' && hasData) return (
              <div key="data" style={{ marginTop: 48 }}>
                <PhaseData
                  stats={dataStats!}
                  eyebrow={section.dataEyebrow}
                  headline={dataHeadline}
                  subheadline={dataSubheadline}
                  color={trendColor}
                  isActive={true}
                  isMobile={true}
                />
              </div>
            )
            if (mod === 'quotes' && quotes.length > 0) return (
              <div key="quotes" style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 32 }}>
                {quotes.map((quote, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 48, lineHeight: 0.8, color: `${trendColor}25`, fontWeight: 700, marginBottom: -10, userSelect: 'none' }}>
                      &ldquo;
                    </div>
                    <div data-content style={{ fontSize: 16, lineHeight: 1.6, color: '#fff', marginBottom: 12 }}>
                      <div className="report-links [&_p]:inline">
                        <PortableText value={quote.quoteText} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {(quote.headshot || quote.headshotUrl) ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={quote.headshot ? urlFor(quote.headshot).width(100).height(100).fit('crop').url() : `${resolvedBasePath}${quote.headshotUrl}`}
                          alt={quote.name}
                          style={{
                            width: 36, height: 36, borderRadius: '50%',
                            objectFit: 'cover', objectPosition: 'center 20%',
                            flexShrink: 0, border: `2px solid ${trendColor}`,
                          }}
                        />
                      ) : (
                        <div style={{ width: 24, height: 2, background: trendColor, borderRadius: 2 }} />
                      )}
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>
                          {quote.linkedInUrl ? (
                            <a href={quote.linkedInUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>{quote.name}</a>
                          ) : quote.name}
                        </p>
                        {quote.title && <p style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{quote.title}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
            if (mod === 'video' && hasVideo && (section.trendVideo || videoConfig)) return (
            <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', maxWidth: 400, position: 'relative' }}>
                {(() => {
                  // CMS trendVideo (primary)
                  if (section.trendVideo) {
                    const tv = section.trendVideo
                    const isYT = tv.sourceType === 'youtube'
                    const ytId = isYT && tv.youtubeUrl
                      ? tv.youtubeUrl.match(/(?:v=|\/embed\/|youtu\.be\/)([^&?#]+)/)?.[1]
                      : null
                    const cssAR = tv.aspectRatio.replace(':', ' / ')
                    return isYT && ytId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${ytId}?rel=0`}
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        style={{ width: '100%', aspectRatio: cssAR, borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)' }}
                      />
                    ) : (
                      <video
                        src={tv.videoFile?.url}
                        controls
                        playsInline
                        style={{ width: '100%', aspectRatio: cssAR, borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)' }}
                      />
                    )
                  }
                  // Legacy videoConfig fallback
                  if (videoConfig) {
                    return videoConfig.type === 'youtube' ? (() => {
                      const youtubeId = videoConfig.src.match(/(?:v=|\/embed\/|youtu\.be\/)([^&?#]+)/)?.[1]
                      return youtubeId ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                          style={{ width: '100%', aspectRatio: '16 / 9', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)' }}
                        />
                      ) : null
                    })() : (
                      <video
                        src={videoConfig.src}
                        controls
                        playsInline
                        style={{ width: '100%', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)' }}
                      />
                    )
                  }
                  return null
                })()}
              </div>
              {/* Caption on mobile */}
              {section.trendVideo && (
                <div style={{ width: '100%', maxWidth: 400, marginTop: 12, paddingTop: 10, borderTop: `2px solid ${trendColor}` }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#fff', margin: 0 }}>{section.trendVideo.name}</p>
                  {section.trendVideo.title && <p style={{ fontSize: 12, color: '#ccc', margin: '2px 0 0' }}>{section.trendVideo.title}</p>}
                  {section.trendVideo.description && <p style={{ fontSize: 13, color: '#bbb', lineHeight: 1.5, margin: '6px 0 0' }}>{section.trendVideo.description}</p>}
                </div>
              )}
            </div>
            )
            return null
          })}
        </div>
      </div>
    )
  }

  // ── Desktop: horizontal carousel with phases ──
  return (
    <div
      data-trend-active={isActive ? 'true' : undefined}
      data-trend-completed={completed ? 'true' : undefined}
      data-trend-total-phases={totalPhases}
      data-trend-index={index}
      data-trend-phase={phase}
      ref={sectionRef}
      style={{
        width: '100vw',
        height: '100vh',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        padding: '0 60px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <AnimatedBg variant={index} />

      <div style={{ maxWidth: 1000, width: '100%', margin: '0 auto', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '80vh' }}>

        {/* Page 0: Title + Body — always rendered */}
        <motion.div
          animate={{ opacity: phase === 0 ? 1 : 0, x: phase === 0 ? 0 : -200 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          style={{
            position: 'absolute', top: 12, left: 0, right: 0, bottom: 0,
            pointerEvents: phase === 0 ? 'auto' : 'none',
          }}
        >
          <PhaseTitle
            title={section.trendTitle}
            body={section.trendBody}
            featuredProjects={section.showFeaturedProjects !== false ? section.featuredProjects : undefined}
            index={index}
            color={trendColor}
          />
        </motion.div>

        {/* Data module phase */}
        {hasData && (
          <motion.div
            animate={{
              opacity: phase === dataPhase ? 1 : 0,
              x: phase < dataPhase ? 200 : phase > dataPhase ? -200 : 0,
            }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              pointerEvents: phase === dataPhase ? 'auto' : 'none',
            }}
          >
            <PhaseData
              stats={dataStats!}
              headline={dataHeadline}
              subheadline={dataSubheadline}
              color={trendColor}
              isActive={phase === dataPhase}
            />
          </motion.div>
        )}

        {/* Quote pages — each always rendered, accumulating on screen */}
        {quotes.map((quote, i) => {
          const quotePhase = quoteStartPhase + i
          const isCurrentPage = phase === quotePhase
          const isVisible = phase >= quotePhase && phase < (hasVideo ? totalPhases - 1 : totalPhases)
          const isVideoPhase = hasVideo && phase === totalPhases - 1
          const visibleCount = Math.max(0, Math.min(phase - quoteStartPhase + 1, quotes.length))
          const position = visibleCount - (i + 1)

          return (
            <div
              key={`quote-wrapper-${i}`}
              style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                pointerEvents: isCurrentPage ? 'auto' : 'none',
              }}
            >
              <PhaseQuote
                quote={quote}
                position={position}
                visibleCount={visibleCount}
                isNew={phase === quotePhase}
                visible={isVisible || isVideoPhase}
                videoActive={isVideoPhase}
                color={trendColor}
              />
            </div>
          )
        })}
      </div>

      {/* Video page — always rendered if trend has video */}
      {hasVideo && section.trendVideo && (
        <motion.div
          animate={{
            opacity: phase === totalPhases - 1 ? 1 : 0,
          }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: phase === totalPhases - 1 ? 'auto' : 'none',
            zIndex: 20,
          }}
        >
          <PhaseVideo
            trendVideo={section.trendVideo!}
            trendColor={trendColor}
            onClose={() => { setVideoClosed(true); setPhase(totalPhases - 2) }}
            isActive={isActive && phase === totalPhases - 1}
          />
        </motion.div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Phase: Title + Body                                                */
/* ------------------------------------------------------------------ */

function PhaseTitle({
  title,
  body,
  featuredProjects,
  index,
  color,
  isMobile,
}: {
  title: string
  body?: any[]
  featuredProjects?: { title: string; url?: string }[]
  index: number
  color: string
  isMobile?: boolean
}) {
  // Strip emojis from title
  const cleanTitle = title.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim()
  const trendNumber = String(index + 1).padStart(2, '0')

  return (
    <div style={{ position: 'relative' }}>


      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Eyebrow with trend number */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
          <span
            style={{
              fontSize: 11,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: color,
              fontWeight: 500,
            }}
          >
            Trend {trendNumber}
          </span>
          <div style={{ width: 60, height: 2, background: color, borderRadius: 2 }} />
        </div>

        {/* Title — large, editorial */}
        <h2
          style={{
            fontSize: isMobile ? 28 : 48,
            fontWeight: 400,
            color: '#fff',
            lineHeight: isMobile ? '36px' : '58px',
            letterSpacing: isMobile ? '-1px' : '-2px',
            marginBottom: isMobile ? 24 : 40,
            maxWidth: 750,
          }}
        >
          {cleanTitle}
        </h2>

        {/* Divider line */}
        <div
          style={{
            width: 80,
            height: 1,
            background: 'rgba(255,255,255,0.14)',
            marginBottom: 32,
          }}
        />

        {/* Body — two column feel with narrower text */}
        {body && (
          <div style={{ display: 'flex', gap: isMobile ? 0 : 60 }}>
            <div
              data-content
              style={{
                fontSize: isMobile ? 15 : 16,
                lineHeight: '28px',
                color: '#D4D4D4',
                maxWidth: isMobile ? '100%' : 749,
                flex: isMobile ? '1 1 auto' : '0 0 auto',
                minWidth: 0,
              }}
            >
              <div className="report-links [&_p]:mb-4">
                <PortableText value={body} />
              </div>

              {/* Featured projects */}
              {featuredProjects && featuredProjects.length > 0 && (
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: color, fontWeight: 500, marginBottom: isMobile ? 12 : 8 }}>
                    Standout Projects
                  </p>
                  {isMobile ? (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {featuredProjects.map((project, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 4, height: 4, borderRadius: '50%', background: color, flexShrink: 0 }} />
                          {project.url ? (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: '#D4D4D4', fontWeight: 500, fontSize: 14, lineHeight: 1.4, textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.15)' }}
                            >
                              {project.title}
                            </a>
                          ) : (
                            <span style={{ color: '#D4D4D4', fontSize: 14 }}>{project.title}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ fontSize: 14, color: '#999', lineHeight: 1.6 }}>
                      {featuredProjects.map((project, i) => (
                        <span key={i}>
                          {i > 0 && '  ·  '}
                          {project.url ? (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="report-link"
                              style={{ color: '#D4D4D4', fontWeight: 500 }}
                            >
                              {project.title}
                            </a>
                          ) : (
                            <span style={{ color: '#D4D4D4' }}>{project.title}</span>
                          )}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Phase: Quote                                                       */
/* ------------------------------------------------------------------ */

// Positions for quotes as they accumulate
// Counter-clockwise: newest enters right-center, older ones rotate left and up
function getQuoteLayout(position: number, visibleCount: number) {
  if (visibleCount === 1) {
    // Single quote: shifted 30px left of center so image extends further left
    return { top: '50%', left: 'calc(50% - 103px)', xOffset: '-50%', yOffset: '-50%', scale: 1, opacity: 1, maxWidth: 'min(87vw, 1195px)' }
  }
  if (visibleCount === 2) {
    if (position === 0) {
      // Newest: shifted left, wider
      return { top: '40%', left: 'calc(50% - 103px)', xOffset: '-50%', yOffset: '-50%', scale: 1, opacity: 1, maxWidth: 'min(87vw, 1195px)' }
    }
    // Older: top-left
    return { top: '15%', left: '0%', xOffset: '0%', yOffset: '0%', scale: 0.8, opacity: 0.35, maxWidth: 'min(35vw, 500px)' }
  }
  // 3 quotes
  if (position === 0) {
    // Newest: above the 2nd quote, shifted left
    return { top: '-8%', left: 'calc(50% - 103px)', xOffset: '-50%', yOffset: '0%', scale: 1, opacity: 1, maxWidth: 'min(87vw, 1195px)' }
  }
  if (position === 1) {
    // 2nd quote: down and right, shrinks and dims
    return { top: '52%', left: 'calc(35% - 50px)', xOffset: '-50%', yOffset: '-50%', scale: 0.8, opacity: 0.35, maxWidth: 'min(65vw, 900px)' }
  }
  // Oldest: stays top-left, unchanged
  return { top: '15%', left: '0%', xOffset: '0%', yOffset: '0%', scale: 0.8, opacity: 0.35, maxWidth: 'min(35vw, 500px)' }
}

function PhaseQuote({
  quote,
  position,
  visibleCount,
  isNew,
  visible = false,
  videoActive = false,
  color,
  isMobile,
}: {
  quote: { name: string; title?: string; quoteText: any[]; linkedInUrl?: string; headshot?: any; headshotUrl?: string }
  position: number
  visibleCount: number
  isNew: boolean
  visible?: boolean
  videoActive?: boolean
  color: string
  isMobile?: boolean
}) {
  const layout = getQuoteLayout(position, visibleCount)
  const isLatest = position === 0

  // When video is active, all quotes dim further and the newest shrinks too
  const finalOpacity = !visible ? 0 : videoActive ? 0.15 : layout.opacity
  const finalScale = videoActive && isLatest ? 0.8 : layout.scale

  const isNewest = position === 0
  // Resolve headshot: prefer Sanity image upload, fall back to URL path
  const bp = typeof window !== 'undefined' ? (window.location.pathname.match(/^(\/preview\/[^/]+)/)?.[1] || basePath) : basePath
  const resolvedHeadshot = quote.headshot
    ? urlFor(quote.headshot).width(250).height(250).fit('crop').url()
    : quote.headshotUrl
      ? `${bp}${quote.headshotUrl}`
      : undefined
  const hasImage = !!resolvedHeadshot

  // Attribution line (shared)
  const attributionLine = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {hasImage && !isNewest && !isMobile ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={resolvedHeadshot}
          alt={quote.name}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
            flexShrink: 0,
            border: `2px solid ${color}`,
          }}
        />
      ) : hasImage && isMobile ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={resolvedHeadshot}
          alt={quote.name}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
            flexShrink: 0,
            border: `2px solid ${color}`,
          }}
        />
      ) : (
        <div style={{ width: 40, height: 2, background: color, borderRadius: 2 }} />
      )}
      <div>
        <p style={{ fontSize: isMobile ? 14 : 16, fontWeight: 500, color: '#fff' }}>
          {quote.linkedInUrl ? (
            <a href={quote.linkedInUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>{quote.name}</a>
          ) : quote.name}
        </p>
        {quote.title && (
          <p style={{ fontSize: isMobile ? 11 : 13, color: '#999', marginTop: 2 }}>{quote.title}</p>
        )}
      </div>
    </div>
  )

  // Desktop newest quote with large image: image to the left, everything else to the right
  const quoteContent = !isMobile && isNewest && hasImage ? (
    <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
      {/* Large portrait — centered vertically against the whole quote block */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolvedHeadshot}
        alt={quote.name}
        style={{
          width: 125,
          height: 125,
          borderRadius: '50%',
          objectFit: 'cover',
          objectPosition: 'center 20%',
          flexShrink: 0,
          border: `3px solid ${color}`,
        }}
      />

      {/* Quote mark + text + attribution */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 100, lineHeight: 0.8, color: 'rgba(139, 112, 209, 0.15)', fontWeight: 700, marginBottom: -24, userSelect: 'none' }}>
          &ldquo;
        </div>
        <div data-content style={{ fontSize: 19, lineHeight: 1.45, color: '#fff', fontWeight: 400, marginBottom: 20 }}>
          <div className="report-links [&_p]:inline">
            <PortableText value={quote.quoteText} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 2, background: color, borderRadius: 2 }} />
          <div>
            <p style={{ fontSize: 16, fontWeight: 500, color: '#fff' }}>
              {quote.linkedInUrl ? (
                <a href={quote.linkedInUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>{quote.name}</a>
              ) : quote.name}
            </p>
            {quote.title && <p style={{ fontSize: 13, color: '#999', marginTop: 2 }}>{quote.title}</p>}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <>
      {/* Quote mark */}
      <div style={{ fontSize: isMobile ? 60 : 100, lineHeight: 0.8, color: 'rgba(139, 112, 209, 0.15)', fontWeight: 700, marginBottom: isMobile ? -16 : -24, userSelect: 'none' }}>
        &ldquo;
      </div>
      {/* Quote text */}
      <div data-content style={{ fontSize: isMobile ? 16 : 19, lineHeight: isMobile ? 1.5 : 1.45, color: '#fff', fontWeight: 400, marginBottom: isMobile ? 14 : 20 }}>
        <div className="report-links [&_p]:inline">
          <PortableText value={quote.quoteText} />
        </div>
      </div>
      {attributionLine}
    </>
  )

  if (isMobile) {
    // Mobile: only show the current (newest) quote, centered
    const mobileOpacity = !visible ? 0 : isLatest ? 1 : 0.2
    return (
      <motion.div
        initial={isNew ? { opacity: 0, x: 100 } : false}
        animate={{ opacity: mobileOpacity, x: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        style={{
          position: 'absolute',
          top: '5%',
          left: 0,
          right: 0,
          padding: '0 4px',
          transform: isLatest ? 'none' : 'scale(0.85)',
          transformOrigin: 'top center',
          pointerEvents: isLatest ? 'auto' : 'none',
        }}
      >
        {quoteContent}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={isNew ? { opacity: 0, x: 300, scale: 1 } : false}
      animate={{
        opacity: finalOpacity,
        scale: finalScale,
        x: 0,
        top: layout.top,
        left: layout.left,
        maxWidth: layout.maxWidth,
      }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      style={{
        position: 'absolute',
        transform: `translate(${layout.xOffset}, ${layout.yOffset})`,
        transformOrigin: 'top left',
      }}
    >
      {quoteContent}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Phase: Data Module — Editorial Spread                              */
/* ------------------------------------------------------------------ */

function PhaseData({
  stats,
  eyebrow,
  headline,
  subheadline,
  color,
  isActive,
  isMobile,
}: {
  stats: DataStat[]
  eyebrow?: string
  headline?: string
  subheadline?: string
  color: string
  isActive: boolean
  isMobile?: boolean
}) {
  const [hasAnimated, setHasAnimated] = useState(false)
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const [barWidths, setBarWidths] = useState<Record<number, boolean>>({})

  const maxValue = Math.max(...stats.map((s) => s.value))

  useEffect(() => {
    if (!isActive || hasAnimated) return
    setHasAnimated(true)

    stats.forEach((_, i) => {
      const delay = 100 + i * 120
      setTimeout(() => {
        setVisibleItems((prev) => new Set(prev).add(i))
      }, delay)
      setTimeout(() => {
        setBarWidths((prev) => ({ ...prev, [i]: true }))
      }, delay + 200)
    })
  }, [isActive, hasAnimated, stats])

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? 32 : 80,
        alignItems: 'center',
      }}
    >
      {/* Left — Header + Subheader */}
      <div>
        <div
          style={{
            fontSize: 11,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: color,
            fontWeight: 500,
            marginBottom: 24,
          }}
        >
          {eyebrow || 'What Judges Said'}
        </div>
        {headline && (
          <h2
            style={{
              fontSize: isMobile ? 24 : 42,
              fontWeight: 400,
              color: '#fff',
              lineHeight: 1.15,
              letterSpacing: isMobile ? '-0.5px' : '-1.5px',
              marginBottom: isMobile ? 12 : 20,
            }}
          >
            {headline}
          </h2>
        )}
        {subheadline && (
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.6,
              color: '#D4D4D4',
            }}
          >
            {subheadline}
          </p>
        )}
      </div>

      {/* Right — Stats with bars */}
      <div>
        {stats.map((stat, i) => {
          const fillPct = (stat.value / maxValue) * 100
          const isVisible = visibleItems.has(i)
          const barExpanded = barWidths[i]

          return (
            <div
              key={i}
              style={{
                padding: '28px 0',
                borderBottom: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Number */}
              <div
                style={{
                  fontSize: isMobile ? 40 : 64,
                  fontWeight: 400,
                  color: '#fff',
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '-0.03em',
                  marginBottom: 10,
                }}
              >
                {stat.value}%
              </div>

              {/* Bar */}
              <div
                style={{
                  height: 6,
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    height: '100%',
                    borderRadius: 3,
                    background: color,
                    width: barExpanded ? `${fillPct}%` : '0%',
                    transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </div>

              {/* Label */}
              <div
                style={{
                  fontSize: 13,
                  color: '#D4D4D4',
                  letterSpacing: 0.5,
                }}
              >
                {stat.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Phase: Video                                                       */
/* ------------------------------------------------------------------ */

function PhaseVideo({
  trendVideo,
  trendColor,
  onClose,
  isActive,
}: {
  trendVideo: TrendVideo
  trendColor: string
  onClose: () => void
  isActive: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(false)

  const isYoutube = trendVideo.sourceType === 'youtube'
  const youtubeId = isYoutube && trendVideo.youtubeUrl
    ? trendVideo.youtubeUrl.match(/(?:v=|\/embed\/|youtu\.be\/)([^&?#]+)/)?.[1]
    : null

  useEffect(() => {
    if (isYoutube) return
    const el = videoRef.current
    if (!el) return
    if (isActive) {
      el.currentTime = 0
      el.muted = false
      el.play().catch(() => {
        el.muted = true
        setMuted(true)
        el.play()
      })
      setMuted(false)
    } else {
      el.pause()
      el.currentTime = 0
    }
  }, [isActive, isYoutube])

  function toggleMute() {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setMuted(videoRef.current.muted)
    }
  }

  function replay() {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
    }
  }

  // Map CMS aspect ratio to CSS and constraints
  const cssAspectRatio = trendVideo.aspectRatio.replace(':', '/')
  const videoConstraints: React.CSSProperties =
    trendVideo.aspectRatio === '16:9'
      ? { maxWidth: '66vw', maxHeight: '57vh' }
      : trendVideo.aspectRatio === '1:1'
        ? { maxHeight: '50vh', maxWidth: '50vh' }
        : { maxHeight: '57vh', maxWidth: '33vh' } // 9:16

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose() }}
        className="no-custom-cursor"
        style={{
          position: 'absolute',
          top: -40,
          right: 0,
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.3)',
          background: 'rgba(0,0,0,0.6)',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 30,
          pointerEvents: 'auto',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.5">
          <line x1="2" y1="2" x2="12" y2="12" />
          <line x1="12" y1="2" x2="2" y2="12" />
        </svg>
      </button>

      {/* YouTube embed */}
      {isYoutube && youtubeId ? (
        <iframe
          src={isActive ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0` : `https://www.youtube.com/embed/${youtubeId}?rel=0`}
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{
            aspectRatio: cssAspectRatio,
            width: '100%',
            height: 'auto',
            ...videoConstraints,
            borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        />
      ) : (
        /* Uploaded video */
        <video
          ref={videoRef}
          src={trendVideo.videoFile?.url}
          playsInline
          style={{
            aspectRatio: cssAspectRatio,
            width: 'auto',
            height: 'auto',
            ...videoConstraints,
            borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        />
      )}

      {/* Controls — only for uploaded videos */}
      {!isYoutube && (
        <div
          style={{
            position: 'absolute',
            bottom: trendVideo.name ? 80 : 12,
            right: 12,
            display: 'flex',
            gap: 8,
            pointerEvents: 'auto',
          }}
        >
          <button
            onClick={toggleMute}
            className="no-custom-cursor"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(0,0,0,0.6)',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
            }}
          >
            {muted ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            )}
          </button>
          <button
            onClick={replay}
            className="no-custom-cursor"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(0,0,0,0.6)',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
          </button>
        </div>
      )}

      {/* Context caption below video */}
      <div
        style={{
          marginTop: 12,
          paddingTop: 10,
          borderTop: `2px solid ${trendColor}`,
          width: '100%',
          maxWidth: trendVideo.aspectRatio === '16:9' ? '80vw' : trendVideo.aspectRatio === '1:1' ? '60vh' : '40vh',
        }}
      >
        <p style={{ fontSize: 16, fontWeight: 500, color: '#fff', margin: 0 }}>
          {trendVideo.name}
        </p>
        {trendVideo.title && (
          <p style={{ fontSize: 13, color: '#ccc', margin: '2px 0 0' }}>
            {trendVideo.title}
          </p>
        )}
        {trendVideo.description && (
          <p style={{ fontSize: 14, color: '#bbb', lineHeight: 1.5, margin: '8px 0 0' }}>
            {trendVideo.description}
          </p>
        )}
      </div>
    </div>
  )
}
