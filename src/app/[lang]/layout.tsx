import type { Metadata } from "next"
import type { ReactNode } from "react"
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionaries"
import { DictionaryProvider } from "@/lib/i18n-context"
import { redirect } from "next/navigation"

export function generateStaticParams() {
  return [{ lang: "th" }, { lang: "en" }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang : "th"
  const dict = await getDictionary(locale as Locale)
  return {
    title: dict.meta.title,
    description: dict.meta.description,
  }
}

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) redirect("/th")
  const dict = await getDictionary(lang as Locale)

  return (
    <DictionaryProvider dict={dict} locale={lang as Locale}>
      {children}
    </DictionaryProvider>
  )
}
