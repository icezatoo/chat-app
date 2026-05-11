import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { AuthScreen } from "@/components/auth/auth-screen"

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const session = await auth()
  if (session) redirect(`/${lang}`)

  return <AuthScreen />
}
