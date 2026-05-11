import "server-only"

export const locales = ["th", "en"] as const
export type Locale = (typeof locales)[number]

export function hasLocale(lang: string): lang is Locale {
  return (locales as readonly string[]).includes(lang)
}

const dictionaries = {
  th: () => import("@/dictionaries/th.json").then((m) => m.default),
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
}

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]()
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>
