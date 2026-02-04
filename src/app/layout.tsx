import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Webby Awards Annual Report',
  description: 'The annual report on the state of the internet from The Webby Awards.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
