import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface GameOverProps {
  score: number;
  wave: number;
  onPlayAgain: () => void;
  onShowLeaderboard: () => void;
}

export default function GameOver({ score, wave, onPlayAgain, onShowLeaderboard }: GameOverProps) {
  const [playerName, setPlayerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const submitScore = useMutation(api.scores.submitScore);

  const handleSubmit = async () => {
    if (!playerName.trim() || isSubmitting || hasSubmitted) return;

    setIsSubmitting(true);
    try {
      await submitScore({
        playerName: playerName.trim().toUpperCase(),
        score,
        wave,
      });
      setHasSubmitted(true);
    } catch (error) {
      console.error('Failed to submit score:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.5 + 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-md">
        {/* Glowing border */}
        <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 rounded-2xl blur-lg opacity-50 animate-pulse" />

        <div className="relative bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-red-500/30 p-6 md:p-8 text-center">
          {/* Game Over Title */}
          <h1 className="text-4xl md:text-5xl font-bold tracking-wider mb-2"
            style={{
              fontFamily: 'Orbitron, sans-serif',
              color: '#ff0044',
              textShadow: '0 0 30px rgba(255,0,68,0.5), 0 0 60px rgba(255,0,68,0.3)',
            }}>
            GAME OVER
          </h1>
          <p className="text-gray-500 font-mono text-sm mb-8">MISSION FAILED</p>

          {/* Score Display */}
          <div className="space-y-4 mb-8">
            <div className="p-4 md:p-6 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-xl border border-cyan-500/20">
              <p className="text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">Final Score</p>
              <p className="text-3xl md:text-4xl font-bold text-white"
                style={{ fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 20px rgba(0,255,255,0.5)' }}>
                {score.toLocaleString()}
              </p>
            </div>
            <div className="p-3 md:p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
              <p className="text-purple-400 text-xs font-mono uppercase tracking-wider mb-1">Wave Reached</p>
              <p className="text-2xl md:text-3xl font-bold text-white"
                style={{ fontFamily: 'Orbitron, sans-serif' }}>
                {wave}
              </p>
            </div>
          </div>

          {/* Submit Score */}
          {!hasSubmitted ? (
            <div className="mb-6">
              <label className="block text-gray-400 text-xs font-mono uppercase tracking-wider mb-2">
                Enter Your Name
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value.slice(0, 12))}
                  placeholder="AAA"
                  maxLength={12}
                  className="flex-1 px-4 py-3 bg-gray-800/80 border border-cyan-500/30 rounded-lg
                    text-white font-mono text-center uppercase tracking-widest
                    focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50
                    placeholder-gray-600"
                />
                <button
                  onClick={handleSubmit}
                  disabled={!playerName.trim() || isSubmitting}
                  className="px-4 md:px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg
                    font-mono text-white uppercase tracking-wider
                    hover:from-cyan-400 hover:to-purple-400
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200"
                >
                  {isSubmitting ? '...' : 'SAVE'}
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
              <p className="text-green-400 font-mono text-sm">
                ✓ Score submitted as {playerName}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onPlayAgain}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg
                font-bold tracking-wider uppercase text-white
                hover:from-green-400 hover:to-emerald-400
                transform hover:scale-[1.02] active:scale-[0.98]
                transition-all duration-200
                shadow-lg shadow-green-500/25"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              PLAY AGAIN
            </button>
            <button
              onClick={onShowLeaderboard}
              className="w-full py-3 bg-transparent border border-yellow-500/50 rounded-lg
                font-mono tracking-wider text-yellow-400 uppercase
                hover:bg-yellow-500/10 hover:border-yellow-400
                transition-all duration-200"
            >
              VIEW LEADERBOARD
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
