'use client'

import { useActionState } from 'react'
import { BrandLogo, Icon } from '@/components/Icon'
import { signIn, type LoginState } from './actions'

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(signIn, {})

  return (
    <div className="auth">
      <form className="auth-card" action={formAction}>
        <div className="auth-brand">
          <BrandLogo />
          <div>
            <b>Sentral CCTV</b>
            <span>Kasir &amp; Inventory</span>
          </div>
        </div>

        <h1>Masuk sebagai Admin</h1>
        <p className="sub">Gunakan akun admin untuk mengelola toko.</p>

        {state.error ? (
          <div className="auth-err" role="alert">
            <Icon name="alert" />
            <span>{state.error}</span>
          </div>
        ) : null}

        <input type="hidden" name="next" value={next} />

        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <input
            className="input"
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            placeholder="admin@sentralcctv.id"
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input
            className="input"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />
        </div>

        <button className="btn primary" type="submit" disabled={pending}>
          {pending ? 'Memeriksa…' : 'Masuk'}
        </button>

        <p className="auth-foot">
          Akses terbatas. Hubungi pemilik toko bila Anda butuh akun admin.
        </p>
      </form>
    </div>
  )
}
