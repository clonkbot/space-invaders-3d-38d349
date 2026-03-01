import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface Score {
  _id: string;
  playerName: string;
  score: number;
  wave: number;
}

interface LeaderboardProps {
  onClose: () => void;
}

export default function Leaderboard({ onClose }: LeaderboardProps) {
  const topScores = useQuery(api.scores.getTopScores);
  const userScores = useQuery(api.scores.getUserScores);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl">
        {/* Glowing border */}
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-2xl blur-lg opacity-40" />

        <div className="relative bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-yellow-500/20 p-4 md:p-8 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-wider text-yellow-400"
              style={{ fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 20px rgba(255,200,0,0.5)' }}>
              HALL OF FAME
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800
                text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Top Scores */}
          <div className="mb-8">
            <h3 className="text-sm font-mono text-cyan-400 uppercase tracking-wider mb-4">
              Global Rankings
            </h3>
            <div className="space-y-2">
              {topScores === undefined ? (
                <div className="text-center py-8">
                  <div className="inline-block w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : topScores.length === 0 ? (
                <p className="text-gray-500 text-center py-8 font-mono">No scores yet. Be the first!</p>
              ) : (
                topScores.map((score: Score, index: number) => (
                  <div
                    key={score._id}
                    className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg transition-all
                      ${index === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' :
                        index === 1 ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border border-gray-400/30' :
                        index === 2 ? 'bg-gradient-to-r from-orange-700/20 to-orange-800/20 border border-orange-600/30' :
                        'bg-gray-800/50'}`}
                  >
                    <div className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg font-bold text-lg
                      ${index === 0 ? 'bg-yellow-500 text-black' :
                        index === 1 ? 'bg-gray-400 text-black' :
                        index === 2 ? 'bg-orange-700 text-white' :
                        'bg-gray-700 text-gray-400'}`}
                      style={{ fontFamily: 'Orbitron, sans-serif' }}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-white truncate text-sm md:text-base">{score.playerName}</p>
                      <p className="text-xs text-gray-500 font-mono">WAVE {score.wave}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg md:text-xl font-mono"
                        style={{
                          fontFamily: 'Orbitron, sans-serif',
                          color: index === 0 ? '#fbbf24' : index === 1 ? '#9ca3af' : index === 2 ? '#c2410c' : '#ffffff',
                        }}>
                        {score.score.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* User's Scores */}
          {userScores && userScores.length > 0 && (
            <div>
              <h3 className="text-sm font-mono text-purple-400 uppercase tracking-wider mb-4">
                Your Best Scores
              </h3>
              <div className="space-y-2">
                {userScores.map((score: Score, index: number) => (
                  <div
                    key={score._id}
                    className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg bg-purple-500/10 border border-purple-500/20"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg bg-purple-500/30 text-purple-300 font-bold"
                      style={{ fontFamily: 'Orbitron, sans-serif' }}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-mono">WAVE {score.wave}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg md:text-xl font-mono text-purple-300"
                        style={{ fontFamily: 'Orbitron, sans-serif' }}>
                        {score.score.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
