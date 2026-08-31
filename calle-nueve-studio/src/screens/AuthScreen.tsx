import { useState, type FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signupDone, setSignupDone] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (mode === "login") {
      const { error: err } = await signIn(email, password);
      if (err) setError(err);
    } else {
      const { error: err } = await signUp(email, password);
      if (err) setError(err);
      else setSignupDone(true);
    }
    setLoading(false);
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo">C9</div>
        <div className="auth-title">Calle Nueve Studio</div>
        <div className="auth-subtitle">Production Tool</div>

        {signupDone ? (
          <div className="auth-success">
            Check your email to confirm your account, then sign in.
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
              />
            </div>
            <div className="field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            {error && <div className="auth-error">{error}</div>}
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: "100%", marginTop: 8 }}
            >
              {loading
                ? "…"
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>
        )}

        {!signupDone && (
          <button
            className="auth-toggle"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError(null);
            }}
          >
            {mode === "login"
              ? "No account? Sign up"
              : "Have an account? Sign in"}
          </button>
        )}
      </div>
    </div>
  );
}
