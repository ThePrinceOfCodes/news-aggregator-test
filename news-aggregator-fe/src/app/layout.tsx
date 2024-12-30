import type { Metadata } from "next"
import "./globals.css"
import NextTopLoader from 'nextjs-toploader'
import ReactQueryClient from '@/config/ReactQueryClient'


// export const revalidate = 0;

export const metadata: Metadata = {
  title: "Warped - The news room on steroids",
  description: "Access current affairs and stories everyday",
}

export default function RootLayout ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // const [expand, setExpand] = useState(true);
  return (
    <html lang="en" className="text-gray-dark">
      <body
      >
        <NextTopLoader color='#0D1F23' />
        <ReactQueryClient>
          {children}
        </ReactQueryClient>

      </body>
    </html>
  )
}
