import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Text, Float, Html } from '@react-three/drei';
import { useRef, useState, useEffect, useCallback, Suspense } from 'react';
import * as THREE from 'three';

interface Invader {
  id: number;
  position: [number, number, number];
  type: 'grunt' | 'soldier' | 'boss';
  health: number;
}

interface Projectile {
  id: number;
  position: [number, number, number];
  isEnemy: boolean;
}

interface GameState {
  score: number;
  wave: number;
  lives: number;
  gameOver: boolean;
  isPaused: boolean;
}

// Player Spaceship Component
function PlayerShip({ position, isHit }: { position: [number, number, number]; isHit: boolean }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.05;
      if (isHit) {
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 30) * 0.1);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Main body */}
      <mesh>
        <coneGeometry args={[0.3, 1, 4]} />
        <meshStandardMaterial color={isHit ? '#ff0044' : '#00ffff'} emissive={isHit ? '#ff0044' : '#00ffff'} emissiveIntensity={0.5} />
      </mesh>
      {/* Wings */}
      <mesh position={[-0.4, -0.2, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.5, 0.1, 0.2]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.4, -0.2, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.5, 0.1, 0.2]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.3} />
      </mesh>
      {/* Engine glow */}
      <mesh position={[0, -0.6, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffaa00" emissiveIntensity={2} transparent opacity={0.8} />
      </mesh>
      <pointLight position={[0, -0.6, 0]} color="#ffaa00" intensity={1} distance={2} />
    </group>
  );
}

// Invader Component
function InvaderMesh({ invader, time }: { invader: Invader; time: number }) {
  const meshRef = useRef<THREE.Group>(null);

  const colors = {
    grunt: { main: '#ff4444', emissive: '#ff0000' },
    soldier: { main: '#ff8800', emissive: '#ff4400' },
    boss: { main: '#ff00ff', emissive: '#aa00ff' },
  };

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 2;
      meshRef.current.position.y = invader.position[1] + Math.sin(time * 3 + invader.id) * 0.1;
    }
  });

  const scale = invader.type === 'boss' ? 1.5 : invader.type === 'soldier' ? 1.2 : 1;

  return (
    <group ref={meshRef} position={invader.position} scale={scale}>
      {/* Body */}
      <mesh>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color={colors[invader.type].main}
          emissive={colors[invader.type].emissive}
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.15, 0.1, 0.3]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#00ff00" emissiveIntensity={1} />
      </mesh>
      <mesh position={[0.15, 0.1, 0.3]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#00ff00" emissiveIntensity={1} />
      </mesh>
      {/* Tentacles */}
      {[...Array(4)].map((_, i) => (
        <mesh key={i} position={[Math.cos(i * Math.PI / 2) * 0.3, -0.3, Math.sin(i * Math.PI / 2) * 0.3]}>
          <cylinderGeometry args={[0.05, 0.02, 0.3, 8]} />
          <meshStandardMaterial color={colors[invader.type].main} emissive={colors[invader.type].emissive} emissiveIntensity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// Projectile Component
function ProjectileMesh({ projectile }: { projectile: Projectile }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 10;
    }
  });

  return (
    <mesh ref={meshRef} position={projectile.position}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshStandardMaterial
        color={projectile.isEnemy ? '#ff0000' : '#00ffff'}
        emissive={projectile.isEnemy ? '#ff0000' : '#00ffff'}
        emissiveIntensity={2}
        transparent
        opacity={0.9}
      />
      <pointLight
        color={projectile.isEnemy ? '#ff0000' : '#00ffff'}
        intensity={0.5}
        distance={1}
      />
    </mesh>
  );
}

// Explosion Effect
function Explosion({ position, onComplete }: { position: [number, number, number]; onComplete: () => void }) {
  const [scale, setScale] = useState(0.1);
  const [opacity, setOpacity] = useState(1);

  useFrame((_, delta) => {
    setScale(s => s + delta * 5);
    setOpacity(o => Math.max(0, o - delta * 3));
    if (opacity <= 0) onComplete();
  });

  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial
        color="#ffaa00"
        emissive="#ff4400"
        emissiveIntensity={2}
        transparent
        opacity={opacity}
      />
      <pointLight color="#ff4400" intensity={opacity * 3} distance={3} />
    </mesh>
  );
}

// Game HUD
function GameHUD({ gameState }: { gameState: GameState }) {
  return (
    <Html fullscreen>
      <div className="pointer-events-none absolute inset-0 p-4 md:p-6">
        <div className="flex justify-between items-start">
          <div className="text-left">
            <div className="text-cyan-400 font-mono text-xs md:text-sm tracking-wider mb-1">SCORE</div>
            <div className="text-2xl md:text-4xl font-bold text-white font-mono tracking-widest"
              style={{ textShadow: '0 0 20px #00ffff, 0 0 40px #00ffff' }}>
              {gameState.score.toString().padStart(8, '0')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-fuchsia-400 font-mono text-xs md:text-sm tracking-wider mb-1">WAVE</div>
            <div className="text-2xl md:text-4xl font-bold text-white font-mono"
              style={{ textShadow: '0 0 20px #ff00ff, 0 0 40px #ff00ff' }}>
              {gameState.wave}
            </div>
          </div>
          <div className="text-right">
            <div className="text-red-400 font-mono text-xs md:text-sm tracking-wider mb-1">LIVES</div>
            <div className="flex gap-1 md:gap-2 justify-end">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`w-4 h-4 md:w-6 md:h-6 ${i < gameState.lives ? 'bg-red-500' : 'bg-gray-700'}
                  transform rotate-45 transition-all duration-300`}
                  style={{ boxShadow: i < gameState.lives ? '0 0 10px #ff0000' : 'none' }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Html>
  );
}

// Main Game Scene
function GameScene({
  onGameOver,
  onScoreUpdate
}: {
  onGameOver: (score: number, wave: number) => void;
  onScoreUpdate: (score: number) => void;
}) {
  const [playerX, setPlayerX] = useState(0);
  const [invaders, setInvaders] = useState<Invader[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [explosions, setExplosions] = useState<{ id: number; position: [number, number, number] }[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    wave: 1,
    lives: 3,
    gameOver: false,
    isPaused: false,
  });
  const [isHit, setIsHit] = useState(false);
  const [time, setTime] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const lastShot = useRef(0);
  const lastEnemyShot = useRef(0);
  const invaderDirection = useRef(1);
  const projectileId = useRef(0);
  const explosionId = useRef(0);
  const { viewport } = useThree();

  // Detect mobile
  useEffect(() => {
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Spawn invaders for current wave
  const spawnWave = useCallback((wave: number) => {
    const newInvaders: Invader[] = [];
    const rows = Math.min(3 + Math.floor(wave / 2), 6);
    const cols = Math.min(6 + Math.floor(wave / 3), 10);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const type: Invader['type'] = row === 0 ? 'boss' : row < 2 ? 'soldier' : 'grunt';
        newInvaders.push({
          id: row * cols + col,
          position: [(col - cols / 2 + 0.5) * 1.2, 4 - row * 0.8, 0],
          type,
          health: type === 'boss' ? 3 : type === 'soldier' ? 2 : 1,
        });
      }
    }
    setInvaders(newInvaders);
  }, []);

  // Initialize first wave
  useEffect(() => {
    spawnWave(1);
  }, [spawnWave]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameOver) return;

      const speed = 0.3;
      const bounds = viewport.width / 2 - 0.5;

      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setPlayerX(x => Math.max(-bounds, x - speed));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setPlayerX(x => Math.min(bounds, x + speed));
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        const now = Date.now();
        if (now - lastShot.current > 200) {
          lastShot.current = now;
          setProjectiles(prev => [...prev, {
            id: ++projectileId.current,
            position: [playerX, -3.5, 0],
            isEnemy: false,
          }]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.gameOver, viewport.width, playerX]);

  // Touch/click controls for mobile
  const handleCanvasClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (gameState.gameOver) return;

    const now = Date.now();
    if (now - lastShot.current > 200) {
      lastShot.current = now;
      setProjectiles(prev => [...prev, {
        id: ++projectileId.current,
        position: [playerX, -3.5, 0],
        isEnemy: false,
      }]);
    }
  }, [gameState.gameOver, playerX]);

  // Game loop
  useFrame((state, delta) => {
    if (gameState.gameOver || gameState.isPaused) return;

    setTime(state.clock.elapsedTime);

    // Move invaders
    setInvaders(prev => {
      let shouldDescend = false;
      const bounds = viewport.width / 2 - 1;

      const moved = prev.map(inv => {
        const newX = inv.position[0] + invaderDirection.current * delta * (0.5 + gameState.wave * 0.1);
        if (Math.abs(newX) > bounds) shouldDescend = true;
        return { ...inv, position: [newX, inv.position[1], inv.position[2]] as [number, number, number] };
      });

      if (shouldDescend) {
        invaderDirection.current *= -1;
        return moved.map(inv => ({
          ...inv,
          position: [inv.position[0], inv.position[1] - 0.3, inv.position[2]] as [number, number, number],
        }));
      }

      return moved;
    });

    // Check if invaders reached bottom
    const lowestInvader = invaders.reduce((min, inv) => Math.min(min, inv.position[1]), Infinity);
    if (lowestInvader < -3) {
      setGameState(prev => ({ ...prev, gameOver: true }));
      onGameOver(gameState.score, gameState.wave);
      return;
    }

    // Enemy shooting
    const now = Date.now();
    if (invaders.length > 0 && now - lastEnemyShot.current > Math.max(500, 2000 - gameState.wave * 100)) {
      lastEnemyShot.current = now;
      const shooter = invaders[Math.floor(Math.random() * invaders.length)];
      setProjectiles(prev => [...prev, {
        id: ++projectileId.current,
        position: [...shooter.position] as [number, number, number],
        isEnemy: true,
      }]);
    }

    // Move projectiles
    setProjectiles(prev => prev
      .map(p => ({
        ...p,
        position: [p.position[0], p.position[1] + (p.isEnemy ? -delta * 8 : delta * 12), p.position[2]] as [number, number, number],
      }))
      .filter(p => Math.abs(p.position[1]) < 6)
    );

    // Check collisions
    setProjectiles(prev => {
      const remaining: Projectile[] = [];

      for (const proj of prev) {
        let hit = false;

        if (!proj.isEnemy) {
          // Player projectile hits invader
          for (let i = 0; i < invaders.length; i++) {
            const inv = invaders[i];
            const dist = Math.sqrt(
              Math.pow(proj.position[0] - inv.position[0], 2) +
              Math.pow(proj.position[1] - inv.position[1], 2)
            );

            if (dist < 0.5) {
              hit = true;
              setInvaders(curr => {
                const updated = [...curr];
                updated[i] = { ...updated[i], health: updated[i].health - 1 };
                if (updated[i].health <= 0) {
                  const points = inv.type === 'boss' ? 300 : inv.type === 'soldier' ? 200 : 100;
                  setGameState(g => {
                    const newScore = g.score + points;
                    onScoreUpdate(newScore);
                    return { ...g, score: newScore };
                  });
                  setExplosions(e => [...e, { id: ++explosionId.current, position: inv.position }]);
                  return updated.filter((_, idx) => idx !== i);
                }
                return updated;
              });
              break;
            }
          }
        } else {
          // Enemy projectile hits player
          const dist = Math.sqrt(
            Math.pow(proj.position[0] - playerX, 2) +
            Math.pow(proj.position[1] - (-4), 2)
          );

          if (dist < 0.4) {
            hit = true;
            setIsHit(true);
            setTimeout(() => setIsHit(false), 300);
            setGameState(g => {
              const newLives = g.lives - 1;
              if (newLives <= 0) {
                onGameOver(g.score, g.wave);
                return { ...g, lives: 0, gameOver: true };
              }
              return { ...g, lives: newLives };
            });
          }
        }

        if (!hit) remaining.push(proj);
      }

      return remaining;
    });

    // Check wave complete
    if (invaders.length === 0 && !gameState.gameOver) {
      const newWave = gameState.wave + 1;
      setGameState(g => ({ ...g, wave: newWave }));
      spawnWave(newWave);
    }
  });

  // Mobile movement via tilt or touch position
  useEffect(() => {
    if (!isMobile) return;

    const handleTouch = (e: TouchEvent) => {
      if (gameState.gameOver) return;
      const touch = e.touches[0];
      if (!touch) return;
      const screenX = touch.clientX / window.innerWidth;
      const bounds = viewport.width / 2 - 0.5;
      setPlayerX((screenX - 0.5) * bounds * 4);
    };

    window.addEventListener('touchmove', handleTouch);
    return () => {
      window.removeEventListener('touchmove', handleTouch);
    };
  }, [isMobile, gameState.gameOver, viewport.width]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 10, 5]} intensity={1} color="#ffffff" />

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Grid floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
        <planeGeometry args={[50, 50, 50, 50]} />
        <meshStandardMaterial
          color="#000022"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Player */}
      <PlayerShip position={[playerX, -4, 0]} isHit={isHit} />

      {/* Invaders */}
      {invaders.map(invader => (
        <InvaderMesh key={invader.id} invader={invader} time={time} />
      ))}

      {/* Projectiles */}
      {projectiles.map(projectile => (
        <ProjectileMesh key={projectile.id} projectile={projectile} />
      ))}

      {/* Explosions */}
      {explosions.map(exp => (
        <Explosion
          key={exp.id}
          position={exp.position}
          onComplete={() => setExplosions(e => e.filter(x => x.id !== exp.id))}
        />
      ))}

      {/* Game Over Text */}
      {gameState.gameOver && (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <Text
            position={[0, 0, 1]}
            fontSize={1}
            color="#ff0044"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/orbitron/v29/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyKS6xpmIyXjU1pg.woff2"
          >
            GAME OVER
          </Text>
        </Float>
      )}

      <GameHUD gameState={gameState} />

      {/* Mobile tap zone */}
      {isMobile && (
        <Html fullscreen>
          <div
            className="absolute inset-0"
            onClick={handleCanvasClick}
            onTouchStart={handleCanvasClick}
          />
        </Html>
      )}
    </>
  );
}

export default function Game({
  onGameOver
}: {
  onGameOver: (score: number, wave: number) => void;
}) {
  const [currentScore, setCurrentScore] = useState(0);

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: 'linear-gradient(to bottom, #000011, #110022)' }}
      >
        <Suspense fallback={null}>
          <GameScene
            onGameOver={onGameOver}
            onScoreUpdate={setCurrentScore}
          />
        </Suspense>
      </Canvas>

      {/* Mobile controls hint */}
      <div className="absolute bottom-20 left-0 right-0 text-center pointer-events-none md:hidden">
        <p className="text-cyan-400/60 text-xs font-mono">
          SLIDE TO MOVE • TAP TO SHOOT
        </p>
      </div>
    </div>
  );
}
