import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SyntaxShot — Beautiful Code Screenshots',
  description: 'Create stunning, shareable code screenshots with ease.',
  icons: {
    icon: '/Logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
