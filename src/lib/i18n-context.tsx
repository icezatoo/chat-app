"use client"

import { createContext, useContext } from "react"
import type { Dictionary, Locale } from "@/lib/dictionaries"

type I18nContextValue = {
  dict: Dictionary
  locale: Locale
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function DictionaryProvider({
  dict,
  locale,
  children,
}: {
  dict: Dictionary
  locale: Locale
  children: React.ReactNode
}) {
  return <I18nContext.Provider value={{ dict, locale }}>{children}</I18nContext.Provider>
}

export function useDictionary(): Dictionary {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useDictionary must be used inside DictionaryProvider")
  return ctx.dict
}

export function useLocale(): Locale {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useLocale must be used inside DictionaryProvider")
  return ctx.locale
}
