import { useState } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';

export default function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<'signIn' | 'signUp'>('signIn');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      await signIn('password', formData);
    } catch (err) {
      setError(flow === 'signIn' ? 'Invalid credentials' : 'Could not create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymous = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn('anonymous');
    } catch (err) {
      setError('Failed to continue as guest');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-purple-950/30 to-gray-950" />
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Scan lines overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.1) 2px, rgba(0,255,255,0.1) 4px)',
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Glowing border effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-30 animate-pulse" />

        <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6 md:p-8">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-wider mb-2"
              style={{
                fontFamily: 'Orbitron, sans-serif',
                background: 'linear-gradient(135deg, #00ffff, #ff00ff, #ffff00)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(0,255,255,0.3)',
              }}>
              SPACE
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold tracking-[0.3em] text-white/90"
              style={{ fontFamily: 'Orbitron, sans-serif' }}>
              INVADERS
            </h2>
            <div className="mt-4 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-cyan-400 text-xs font-mono tracking-wider mb-2 uppercase">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 bg-gray-800/80 border border-cyan-500/30 rounded-lg
                  text-white font-mono placeholder-gray-500
                  focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50
                  transition-all duration-300"
                placeholder="pilot@galaxy.com"
              />
            </div>

            <div>
              <label className="block text-cyan-400 text-xs font-mono tracking-wider mb-2 uppercase">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 bg-gray-800/80 border border-cyan-500/30 rounded-lg
                  text-white font-mono placeholder-gray-500
                  focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50
                  transition-all duration-300"
                placeholder="••••••••"
              />
            </div>

            <input name="flow" type="hidden" value={flow} />

            {error && (
              <div className="text-red-400 text-sm font-mono text-center py-2 px-4 bg-red-500/10 rounded-lg border border-red-500/20">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg
                font-bold tracking-wider uppercase text-white
                hover:from-cyan-400 hover:to-purple-400
                disabled:opacity-50 disabled:cursor-not-allowed
                transform hover:scale-[1.02] active:scale-[0.98]
                transition-all duration-200
                shadow-lg shadow-cyan-500/25"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  INITIATING...
                </span>
              ) : flow === 'signIn' ? 'LAUNCH' : 'REGISTER'}
            </button>
          </form>

          {/* Toggle sign in/up */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setFlow(flow === 'signIn' ? 'signUp' : 'signIn')}
              className="text-gray-400 hover:text-cyan-400 font-mono text-sm transition-colors"
            >
              {flow === 'signIn' ? (
                <>New pilot? <span className="text-cyan-400 underline">Create account</span></>
              ) : (
                <>Already registered? <span className="text-cyan-400 underline">Sign in</span></>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-gray-900 text-gray-500 text-xs font-mono uppercase tracking-wider">
                or
              </span>
            </div>
          </div>

          {/* Guest mode */}
          <button
            type="button"
            onClick={handleAnonymous}
            disabled={isLoading}
            className="w-full py-3 bg-transparent border border-purple-500/50 rounded-lg
              font-mono tracking-wider text-purple-400
              hover:bg-purple-500/10 hover:border-purple-400
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200"
          >
            PLAY AS GUEST
          </button>

          {/* Controls hint */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <p className="text-gray-500 text-xs font-mono text-center uppercase tracking-wider mb-3">
              Controls
            </p>
            <div className="flex justify-center gap-6 text-gray-400 text-sm font-mono">
              <span className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-gray-800 rounded text-cyan-400 border border-cyan-500/30">←→</kbd>
                Move
              </span>
              <span className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-gray-800 rounded text-cyan-400 border border-cyan-500/30">SPACE</kbd>
                Fire
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
