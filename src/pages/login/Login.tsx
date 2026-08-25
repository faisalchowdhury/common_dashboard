import { useState, type FormEvent } from "react";
import { Navigate, useLocation } from "react-router";
import { Loader2, Lock, Mail } from "lucide-react";

import { useAuth } from "../../auth/AuthContext";
import { APP_NAME, APP_TAGLINE } from "../../config/app";

/**
 * The sign-in screen.
 *
 * Design mode: nothing is validated and nothing is sent anywhere — submitting
 * the form signs you straight in. The submitting state is still exercised so
 * the button's loading treatment is visible.
 */
export default function Login() {
  const { user, signIn } = useAuth();
  const location = useLocation();

  const [email, setEmail] = useState("alex@example.com");
  const [password, setPassword] = useState("password");
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    const from = (location.state as { from?: string } | null)?.from;
    return <Navigate to={from && from !== "/login" ? from : "/"} replace />;
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setTimeout(signIn, 600);
  };

  const inputClass =
    "w-full bg-luxury-black border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm placeholder-white/25 focus:border-luxury-gold outline-none transition-colors";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-luxury-black relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[520px] h-[320px] bg-luxury-gold/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-9">
          <span className="font-serif text-3xl font-bold tracking-widest text-luxury-ivory block uppercase">
            {APP_NAME}
          </span>
          <span className="text-[9px] tracking-[0.35em] text-luxury-gold font-semibold uppercase">
            {APP_TAGLINE}
          </span>
        </div>

        <form onSubmit={onSubmit} className="panel rounded-3xl p-7 sm:p-8">
          <h1 className="font-serif text-2xl font-bold mb-1">Sign in</h1>
          <p className="text-xs text-white/40 font-light mb-7">
            Administrator accounts only.
          </p>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-[10px] uppercase tracking-widest text-white/45 mb-2 font-semibold"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[10px] uppercase tracking-widest text-white/45 mb-2 font-semibold"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
                />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 mt-7 py-3.5 bg-luxury-gold text-luxury-black font-semibold text-xs uppercase tracking-widest rounded-full hover:bg-white transition-colors focus-gold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>

          <p className="text-[10px] text-white/25 text-center mt-5 leading-relaxed">
            Design preview — any credentials will do.
          </p>
        </form>
      </div>
    </div>
  );
}
