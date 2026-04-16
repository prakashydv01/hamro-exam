import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/app/Components/Header'
import Footer from '@/app/Components/Footer'
import Providers from './provider'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hamro Exam - Exam Preparation Platform',
  description:
    'Hamro Exam is a comprehensive exam preparation platform designed to help students excel in their academic pursuits.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />

          {/* ✅ Google AdSense Script (CORRECT WAY) */}
          <Script
            id="adsense-script"
            async
            strategy="afterInteractive"
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5140324631395842"
            crossOrigin="anonymous"
          />

          <main className="min-h-screen">{children}</main>

          <Footer />
        </Providers>
      </body>
    </html>
  )
}