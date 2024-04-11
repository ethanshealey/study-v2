import './globals.scss'
import type { Metadata } from 'next'
import Wrapper from '@/Wrapper'


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
          { children }
        </Wrapper>
      </body>
    </html>
  )
}
