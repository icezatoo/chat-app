"use client"

import { signIn } from "next-auth/react"
import { Icon } from "@/components/icons"
import { useDictionary, useLocale } from "@/lib/i18n-context"
import { LangSwitcher } from "@/components/lang-switcher"

export function AuthScreen() {
  const { auth: t } = useDictionary()
  const locale = useLocale()

  return (
    <div className="auth">
      {/* Brand panel */}
      <div className="auth-brand">
        <div className="auth-brand-head">
          <div className="glyph">ป</div>
          <div className="name">ปลดหนี้ · Plodnee</div>
        </div>
        <div className="auth-brand-body">
          <h2>
            {t.brand.headlinePart1}
            <em>{t.brand.headlineEm}</em>
            {t.brand.headlinePart2}
          </h2>
          <p>{t.brand.desc}</p>
          <div className="brand-stats">
            <div className="brand-stat">
              <div className="n">48k+</div>
              <div className="l">{t.brand.stats.users}</div>
            </div>
            <div className="brand-stat">
              <div className="n">฿2.1B</div>
              <div className="l">{t.brand.stats.debt}</div>
            </div>
            <div className="brand-stat">
              <div className="n">94%</div>
              <div className="l">{t.brand.stats.satisfaction}</div>
            </div>
          </div>
        </div>
        <div className="auth-brand-foot">
          <span>{t.brand.footer}</span>
          <span>{t.brand.certs}</span>
        </div>
      </div>

      {/* Form pane */}
      <div className="auth-form-pane">
        <div className="auth-card">
          <div className="auth-eyebrow">{t.eyebrow}</div>
          <h1>{t.title}</h1>
          <p className="sub">{t.subtitle}</p>

          <button className="sso-btn-primary" onClick={() => signIn("keycloak", { callbackUrl: `/${locale}` })}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="none">
              <rect width="24" height="24" rx="6" fill="#4d6eff" />
              <path
                d="M12 4.5L6 8.25v7.5L12 19.5l6-3.75v-7.5L12 4.5z"
                fill="white"
                fillOpacity=".9"
              />
              <circle cx="12" cy="12" r="2.5" fill="#4d6eff" />
            </svg>
            <span style={{ flex: 1, textAlign: "left" }}>{t.keycloakBtn}</span>
            <Icon name="chevDown" size={16} className="rotate-[-90deg]" />
          </button>

          <ul className="auth-bullets">
            <li>
              <Icon name="shield" size={14} />
              {t.bullets.mfa}
            </li>
            <li>
              <Icon name="lock" size={14} />
              {t.bullets.pdpa}
            </li>
            <li>
              <Icon name="user" size={14} />
              {t.bullets.account}
            </li>
          </ul>

          <p className="legal">
            {t.legal.prefix}{" "}
            <a className="link" href="#">{t.legal.terms}</a>{" "}
            {t.legal.and}{" "}
            <a className="link" href="#">{t.legal.privacy}</a>{" "}
            {t.legal.suffix}
          </p>

          <div className="auth-help" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <a href="#" className="link">{t.help}</a>
            <LangSwitcher />
          </div>
        </div>
      </div>
    </div>
  )
}
