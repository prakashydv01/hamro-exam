import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/app/Components/Header'
import Footer from '@/app/Components/Footer'
import Providers from './provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hamro Exam - Exam Preparation Platform',
  description: 'Hamro Exam is a comprehensive exam preparation platform designed to help students excel in their academic pursuits. We offer a wide range of resources, including mock tests, study materials, and expert guidance, to ensure that students are well-prepared for their exams. Our mission is to empower students with the tools and knowledge they need to succeed in their educational journey.',
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
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}