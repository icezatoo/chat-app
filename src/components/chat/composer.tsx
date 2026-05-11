'use client'

import { useRef, useEffect } from 'react'
import { Icon } from '@/components/icons'
import { useDictionary } from '@/lib/i18n-context'

export function Composer({ value, onChange, onSend, disabled, hint }: { value: string; onChange: (v: string) => void; onSend: () => void; disabled?: boolean; hint?: string }) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const { composer: t } = useDictionary()

  useEffect(() => {
    if (!ref.current) return
    ref.current.style.height = 'auto'
    ref.current.style.height = Math.min(ref.current.scrollHeight, 200) + 'px'
  }, [value])

  const send = () => {
    if (value.trim() && !disabled) onSend()
  }

  return (
    <div className="composer-wrap">
      <div style={{ width: '100%', maxWidth: 760 }}>
        <div className="composer">
          <textarea
            ref={ref}
            rows={1}
            placeholder={hint ?? t.placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
          />
          <div className="composer-toolbar">
            <button className="send-btn" onClick={send} disabled={!value.trim() || disabled}>
              <Icon name="send" size={16} stroke={2} />
            </button>
          </div>
        </div>
        <div className="composer-foot">
          {t.disclaimer} ·{' '}
          <a href="#" className="link">
            {t.disclaimerLink}
          </a>
        </div>
      </div>
    </div>
  )
}
