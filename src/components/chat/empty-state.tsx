"use client"

import { useState } from "react"
import { Icon } from "@/components/icons"
import { useDictionary } from "@/lib/i18n-context"

function FaqItem({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen)
  return (
    <div className={`faq-item${open ? " open" : ""}`}>
      <button className="faq-q" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <span className="chev">
          <Icon name="chevDown" size={16} />
        </span>
      </button>
      {open && <div className="faq-a">{a}</div>}
    </div>
  )
}

export function EmptyState({
  firstName,
  onPick,
}: {
  firstName: string
  onPick: (text: string) => void
}) {
  const { empty: t } = useDictionary()

  return (
    <div className="empty">
      <div>
        <div style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 8 }}>
          {t.greeting.replace("{name}", firstName)}
        </div>
        <h1>
          {t.questionPart1}
          <em>{t.questionEm}</em>
          {t.questionPart2}
        </h1>
        <p className="lead">{t.lead}</p>
      </div>

      <div className="suggestion-grid">
        {t.suggestions.map((s) => (
          <button key={s.title} className="suggestion" onClick={() => onPick(s.title)}>
            <span className="tag">{s.tag}</span>
            <span className="title">{s.title}</span>
            <span className="desc">{s.desc}</span>
          </button>
        ))}
      </div>

      <div className="faq-section">
        <div className="faq-head">
          <h3>{t.faqTitle}</h3>
          <span className="meta">{t.faqUpdated}</span>
        </div>
        <div className="faq-list">
          {t.faqs.map((f, i) => (
            <FaqItem key={i} q={f.q} a={f.a} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </div>
  )
}
