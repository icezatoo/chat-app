import { SessionProvider } from "next-auth/react"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function ChatLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const session = await auth()
  if (!session) redirect(`/${lang}/login`)

  return <SessionProvider session={session}>{children}</SessionProvider>
}
