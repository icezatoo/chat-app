import { headers } from "next/headers"
import "./globals.css"

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const lang = headersList.get("x-locale") ?? "th"

  return (
    <html lang={lang} data-mode="light">
      <body>{children}</body>
    </html>
  )
}
