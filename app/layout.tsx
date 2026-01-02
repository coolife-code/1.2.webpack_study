import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Grok Chat App',
  description: 'AI Chat App powered by GitHub Models Grok API',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}