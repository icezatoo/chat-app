"use client"

import { useLocale } from "@/lib/i18n-context"
import { usePathname, useRouter } from "next/navigation"

export function LangSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const toggle = () => {
    const next = locale === "th" ? "en" : "th"
    // Replace /th/... with /en/... or vice versa
    const newPath = pathname.replace(`/${locale}`, `/${next}`)
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000`
    router.push(newPath)
  }

  return (
    <button
      className="btn-icon"
      onClick={toggle}
      title={locale === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
      style={{ fontSize: 12, fontWeight: 600, width: 32, height: 32 }}
    >
      {locale === "th" ? "EN" : "TH"}
    </button>
  )
}
