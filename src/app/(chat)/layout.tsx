import { SessionProvider } from "next-auth/react"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/login")

  return <SessionProvider session={session}>{children}</SessionProvider>
}
