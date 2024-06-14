import './globals.scss'
import './spinner.scss'
import './mobile.scss'
import type { Metadata } from 'next'
import Wrapper from '@/Wrapper'
import { Toaster } from 'react-hot-toast'


export const metadata: Metadata = {
  title: 'Study | ethanshealey.com',
  description: 'Study all your subjects in one handy place!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body>
        <Wrapper>
          <Toaster position="top-center" />
          { children }
        </Wrapper>
      </body>
    </html>
  )
}
