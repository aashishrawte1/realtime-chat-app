import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Chat App',
  description: 'Real-time WhatsApp-style chat'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  )
}
