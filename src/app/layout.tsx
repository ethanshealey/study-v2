import './globals.scss'
import './spinner.scss'
import './mobile.scss'
import type { Metadata } from 'next'
import Wrapper from '@/Wrapper'
import { Toaster } from 'react-hot-toast'
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, theme } from 'antd'

export const metadata: Metadata = {
  title: 'Study | ethanshealey.com',
  description: 'Study all your subjects in one handy place!',
  icons: [
    'flash-cards-icon.png'
  ]
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
          <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
            <AntdRegistry>{children}</AntdRegistry>
          </ConfigProvider>
        </Wrapper>
      </body>
    </html>
  )
}
