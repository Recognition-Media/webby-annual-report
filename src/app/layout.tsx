import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: 'Webby Awards Annual Report',
  description: 'The annual report on the state of the internet from The Webby Awards.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/ona0hkt.css" />
      </head>
      <body className={`${montserrat.className} bg-white text-black`}>{children}</body>
    </html>
  )
}
