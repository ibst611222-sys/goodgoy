'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [supabaseAvailable] = useState(
    () => typeof process !== 'undefined' && !!process.env.NEXT_PUBLIC_SUPABASE_URL
  )
  const router = useRouter()

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault()
    if (!supabaseAvailable) {
      setError('Supabase not configured yet. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable authentication.')
      return
    }
    setLoading(true)
    setError(null)

    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError('Failed to sign in. Supabase may not be configured.')
    }
    setLoading(false)
  }

  async function handleGoogleSignIn() {
    if (!supabaseAvailable) {
      setError('Supabase not configured yet.')
      return
    }
    setLoading(true)
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) setError(error.message)
    } catch {
      setError('Failed to sign in with Google.')
    }
    setLoading(false)
  }

  async function handleSignUp() {
    if (!email || !password || !supabaseAvailable) return
    setLoading(true)
    setError(null)

    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) setError(error.message)
      else setError('Check your email for the confirmation link!')
    } catch {
      setError('Failed to sign up.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-surface-dark flex items-center justify-center p-4">
      <div className="w-full max-w-sm glass rounded-xl p-6 border border-surface-border/50">
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center mx-auto mb-3">
            <span className="text-black font-bold text-sm">G</span>
          </div>
          <h1 className="text-lg font-bold text-white">goodgoy</h1>
          <p className="text-xs text-white/30 font-mono mt-0.5">
            {supabaseAvailable ? 'Sign in to your account' : 'Supabase not connected'}
          </p>
          {!supabaseAvailable && (
            <p className="text-[9px] text-neon-amber/60 font-mono mt-1">
              Add Supabase env vars to enable auth
            </p>
          )}
        </div>

        <form onSubmit={handleEmailSignIn} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-surface-card border border-surface-border rounded-lg px-3 py-2 text-xs font-mono text-white/80 focus:outline-none focus:border-cosmic-500/50"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-surface-card border border-surface-border rounded-lg px-3 py-2 text-xs font-mono text-white/80 focus:outline-none focus:border-cosmic-500/50"
            required
          />

          {error && (
            <div className="text-[10px] font-mono text-neon-pink bg-neon-pink/5 rounded-lg px-3 py-2 border border-neon-pink/10">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !supabaseAvailable}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-semibold text-xs font-mono hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center gap-2 my-4">
          <div className="flex-1 h-px bg-surface-border/30" />
          <span className="text-[10px] text-white/20 font-mono">or</span>
          <div className="flex-1 h-px bg-surface-border/30" />
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading || !supabaseAvailable}
          className="w-full py-2 rounded-lg bg-surface-card border border-surface-border text-white/80 text-xs font-mono hover:bg-surface-elevated transition-colors disabled:opacity-50 mb-3"
        >
          Continue with Google
        </button>

        <button
          onClick={handleSignUp}
          disabled={loading || !supabaseAvailable}
          className="w-full text-center text-[10px] text-white/30 font-mono hover:text-white/50 transition-colors"
        >
          Don't have an account? Sign up
        </button>
      </div>
    </div>
  )
}
