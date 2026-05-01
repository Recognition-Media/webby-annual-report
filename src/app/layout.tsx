import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Anthem Awards — 2026 State of Social Impact',
  description: 'The 2026 State of Social Impact Report from The Anthem Awards.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/ods5cgw.css" />
      </head>
      <body className="bg-[#21261A] text-[#E3DDCA]">{children}</body>
    </html>
  )
}
