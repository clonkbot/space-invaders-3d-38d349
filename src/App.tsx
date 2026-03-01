import { useConvexAuth } from 'convex/react';
import { useAuthActions } from '@convex-dev/auth/react';
import { useState, useCallback } from 'react';
import AuthScreen from './components/AuthScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';
import Leaderboard from './components/Leaderboard';

type GameScreen = 'menu' | 'playing' | 'gameover';

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const [screen, setScreen] = useState<GameScreen>('menu');
  const [finalScore, setFinalScore] = useState(0);
  const [finalWave, setFinalWave] = useState(1);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const handleGameOver = useCallback((score: number, wave: number) => {
    setFinalScore(score);
    setFinalWave(wave);
    setScreen('gameover');
  }, []);

  const handlePlayAgain = useCallback(() => {
    setScreen('playing');
  }, []);

  const handleStartGame = useCallback(() => {
    setScreen('playing');
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin" />
          </div>
          <p className="text-cyan-400 font-mono text-sm tracking-wider animate-pulse">
            INITIALIZING...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="relative z-20 flex items-center justify-between p-3 md:p-4 bg-gray-900/80 backdrop-blur-sm border-b border-cyan-500/20">
        <h1 className="text-lg md:text-xl font-bold tracking-wider"
          style={{
            fontFamily: 'Orbitron, sans-serif',
            background: 'linear-gradient(135deg, #00ffff, #ff00ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
          SPACE INVADERS
        </h1>
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setShowLeaderboard(true)}
            className="px-3 py-1.5 md:px-4 md:py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg
              text-yellow-400 font-mono text-xs md:text-sm uppercase tracking-wider
              hover:bg-yellow-500/30 transition-colors"
          >
            <span className="hidden sm:inline">Leaderboard</span>
            <span className="sm:hidden">🏆</span>
          </button>
          <button
            onClick={() => signOut()}
            className="px-3 py-1.5 md:px-4 md:py-2 bg-red-500/20 border border-red-500/30 rounded-lg
              text-red-400 font-mono text-xs md:text-sm uppercase tracking-wider
              hover:bg-red-500/30 transition-colors"
          >
            <span className="hidden sm:inline">Sign Out</span>
            <span className="sm:hidden">✕</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative">
        {screen === 'menu' && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-purple-950/30 to-gray-950" />
              {[...Array(100)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-0.5 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.5 + 0.2,
                    animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>

            <div className="relative text-center max-w-lg w-full px-4">
              {/* Main Title */}
              <div className="mb-8 md:mb-12">
                <h1 className="text-5xl md:text-7xl font-bold tracking-wider mb-3"
                  style={{
                    fontFamily: 'Orbitron, sans-serif',
                    background: 'linear-gradient(135deg, #00ffff, #ff00ff, #ffff00)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 40px rgba(0,255,255,0.3)',
                  }}>
                  SPACE
                </h1>
                <h2 className="text-3xl md:text-5xl font-bold tracking-[0.4em] text-white/90"
                  style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  INVADERS
                </h2>
              </div>

              {/* Animated UFO */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-8 md:mb-12"
                style={{ animation: 'float 3s ease-in-out infinite' }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-16 h-8 md:w-20 md:h-10 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full shadow-lg shadow-cyan-500/50"
                      style={{ boxShadow: '0 0 30px #00ffff, inset 0 0 10px rgba(255,255,255,0.5)' }} />
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 md:w-32 h-2 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent rounded-full" />
                  </div>
                </div>
              </div>

              {/* Play Button */}
              <button
                onClick={handleStartGame}
                className="relative group px-8 md:px-12 py-4 md:py-6 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-xl
                  group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-[2px] bg-gray-900 rounded-xl" />
                <div className="absolute inset-[2px] bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-xl
                  group-hover:from-cyan-500/30 group-hover:via-purple-500/30 group-hover:to-pink-500/30 transition-colors" />
                <span className="relative text-xl md:text-2xl font-bold tracking-[0.3em] text-white uppercase"
                  style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  START GAME
                </span>
              </button>

              {/* Instructions */}
              <div className="mt-8 md:mt-12 space-y-3 text-gray-500 font-mono text-xs md:text-sm">
                <p className="hidden md:block">Use <kbd className="px-2 py-1 bg-gray-800 rounded text-cyan-400 border border-cyan-500/30">←</kbd> <kbd className="px-2 py-1 bg-gray-800 rounded text-cyan-400 border border-cyan-500/30">→</kbd> to move, <kbd className="px-2 py-1 bg-gray-800 rounded text-cyan-400 border border-cyan-500/30">SPACE</kbd> to fire</p>
                <p className="md:hidden">Slide to move • Tap to fire</p>
                <p className="text-purple-400">Destroy all invaders before they reach you!</p>
              </div>
            </div>
          </div>
        )}

        {screen === 'playing' && (
          <div className="absolute inset-0">
            <Game onGameOver={handleGameOver} />
          </div>
        )}

        {screen === 'gameover' && (
          <GameOver
            score={finalScore}
            wave={finalWave}
            onPlayAgain={handlePlayAgain}
            onShowLeaderboard={() => {
              setShowLeaderboard(true);
            }}
          />
        )}
      </main>

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      )}

      {/* Footer */}
      <footer className="relative z-20 py-3 md:py-4 text-center border-t border-gray-800/50">
        <p className="text-gray-600 text-xs font-mono">
          Requested by <span className="text-gray-500">@web-user</span> · Built by <span className="text-gray-500">@clonkbot</span>
        </p>
      </footer>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
}
