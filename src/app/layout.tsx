import type { Metadata } from 'next'
import './globals.css'

// Generic site-wide fallback. Each report route overrides via its own
// `generateMetadata` in app/[slug]/page.tsx, which pulls metaTitle/
// metaDescription/shareImage from the Sanity Report doc.
export const metadata: Metadata = {
  title: 'Annual Report',
  description: 'The annual reports from The International Academy of Digital Arts and Sciences.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/jpeg" />
        <link rel="stylesheet" href="https://use.typekit.net/ona0hkt.css" />
        {/* Anthem Typekit (Roc Grotesk + Decoy) — loaded alongside Webby's;
            theme scoping happens via body class set by template */}
        <link rel="stylesheet" href="https://use.typekit.net/ods5cgw.css" />
      </head>
      <body className="bg-white text-black">{children}</body>
    </html>
  )
}
