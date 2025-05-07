import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

const MainFeature = ({ username }) => {
  const Refresh = getIcon('RefreshCw');
  const Settings = getIcon('Settings');
  const User = getIcon('User');
  const UserPlus = getIcon('UserPlus');
  const Volume2 = getIcon('Volume2');
  const VolumeX = getIcon('VolumeX');
  const Share = getIcon('Share2');
  
  // Game settings
  const [gridSize, setGridSize] = useState(5);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [players, setPlayers] = useState([
    { id: 1, username: username || 'Player 1', color: '#5383ED', score: 0, isActive: true },
    { id: 2, username: 'Player 2', color: '#FF6B6B', score: 0, isActive: false },
  ]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [newPlayerName, setNewPlayerName] = useState('');
  
  // Grid state
  const [grid, setGrid] = useState({
    dots: [],
    horizontalLines: [],
    verticalLines: [],
    squares: []
  });
  
  // Game status
  const [gameStatus, setGameStatus] = useState('waiting'); // waiting, active, completed
  const [winner, setWinner] = useState(null);
  
  // Initialize or reset the game
  const initializeGame = () => {
    // Create dots grid
    const dots = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        dots.push({ x: j, y: i, id: `dot-${j}-${i}` });
      }
    }
    
    // Create horizontal lines
    const horizontalLines = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize - 1; j++) {
        horizontalLines.push({ 
          x: j, 
          y: i, 
          id: `h-${j}-${i}`,
          drawn: false,
          playerId: null
        });
      }
    }
    
    // Create vertical lines
    const verticalLines = [];
    for (let i = 0; i < gridSize - 1; i++) {
      for (let j = 0; j < gridSize; j++) {
        verticalLines.push({ 
          x: j, 
          y: i, 
          id: `v-${j}-${i}`,
          drawn: false,
          playerId: null
        });
      }
    }
    
    // Create squares
    const squares = [];
    for (let i = 0; i < gridSize - 1; i++) {
      for (let j = 0; j < gridSize - 1; j++) {
        squares.push({
          x: j,
          y: i,
          id: `square-${j}-${i}`,
          top: `h-${j}-${i}`,
          right: `v-${j+1}-${i}`,
          bottom: `h-${j}-${i+1}`,
          left: `v-${j}-${i}`,
          completed: false,
          playerId: null
        });
      }
    }
    
    setGrid({ dots, horizontalLines, verticalLines, squares });
    resetPlayers();
    setCurrentPlayerIndex(0);
    setGameStatus('active');
    setWinner(null);
    
    toast.info(`Game started with a ${gridSize}x${gridSize} grid!`);
  };
  
  // Reset player scores
  const resetPlayers = () => {
    setPlayers(players.map(player => ({ ...player, score: 0, isActive: player.id === 1 })));
  };
  
  // Add a new player
  const addPlayer = () => {
    if (!newPlayerName.trim()) {
      toast.error("Please enter a player name");
      return;
    }
    
    if (players.length >= 4) {
      toast.error("Maximum 4 players allowed");
      return;
    }
    
    const colors = ['#5383ED', '#FF6B6B', '#7C3AED', '#10B981'];
    const newId = players.length + 1;
    
    setPlayers([
      ...players,
      {
        id: newId,
        username: newPlayerName,
        color: colors[players.length % colors.length],
        score: 0,
        isActive: false
      }
    ]);
    
    setNewPlayerName('');
    toast.success(`${newPlayerName} added to the game!`);
  };
  
  // Handle line click
  const handleLineClick = (lineType, id) => {
    if (gameStatus !== 'active') return;
    
    const currentPlayer = players[currentPlayerIndex];
    let squareCompleted = false;
    
    // Update lines
    if (lineType === 'horizontal') {
      const newHorizontalLines = grid.horizontalLines.map(line => 
        line.id === id ? { ...line, drawn: true, playerId: currentPlayer.id } : line
      );
      
      // Check if any squares were completed
      const updatedSquares = grid.squares.map(square => {
        if (square.completed) return square;
        
        // Get the lines that make up this square
        const topLine = newHorizontalLines.find(line => line.id === square.top);
        const bottomLine = newHorizontalLines.find(line => line.id === square.bottom);
        const leftLine = grid.verticalLines.find(line => line.id === square.left);
        const rightLine = grid.verticalLines.find(line => line.id === square.right);
        
        // Check if all lines are drawn
        if (topLine?.drawn && bottomLine?.drawn && leftLine?.drawn && rightLine?.drawn) {
          squareCompleted = true;
          return { ...square, completed: true, playerId: currentPlayer.id };
        }
        
        return square;
      });
      
      setGrid({
        ...grid,
        horizontalLines: newHorizontalLines,
        squares: updatedSquares
      });
      
    } else { // vertical line
      const newVerticalLines = grid.verticalLines.map(line => 
        line.id === id ? { ...line, drawn: true, playerId: currentPlayer.id } : line
      );
      
      // Check if any squares were completed
      const updatedSquares = grid.squares.map(square => {
        if (square.completed) return square;
        
        // Get the lines that make up this square
        const topLine = grid.horizontalLines.find(line => line.id === square.top);
        const bottomLine = grid.horizontalLines.find(line => line.id === square.bottom);
        const leftLine = newVerticalLines.find(line => line.id === square.left);
        const rightLine = newVerticalLines.find(line => line.id === square.right);
        
        // Check if all lines are drawn
        if (topLine?.drawn && bottomLine?.drawn && leftLine?.drawn && rightLine?.drawn) {
          squareCompleted = true;
          return { ...square, completed: true, playerId: currentPlayer.id };
        }
        
        return square;
      });
      
      setGrid({
        ...grid,
        verticalLines: newVerticalLines,
        squares: updatedSquares
      });
    }
    
    // Play sound if enabled
    if (soundEnabled) {
      const audio = new Audio(squareCompleted ? 
        'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3' : 
        'https://assets.mixkit.co/sfx/preview/mixkit-short-click-tonal-2588.mp3');
      audio.volume = 0.3;
      audio.play();
    }
    
    // Update player scores if square was completed
    if (squareCompleted) {
      const updatedPlayers = players.map(player => 
        player.id === currentPlayer.id 
          ? { ...player, score: player.score + 1 }
          : player
      );
      setPlayers(updatedPlayers);
      
      toast.info(`${currentPlayer.username} completed a square!`);
      
      // Check if game is over
      const totalSquares = (gridSize - 1) * (gridSize - 1);
      const completedSquares = grid.squares.filter(square => square.completed).length + 1;
      
      if (completedSquares >= totalSquares) {
        const highestScore = Math.max(...updatedPlayers.map(p => p.score));
        const winners = updatedPlayers.filter(p => p.score === highestScore);
        
        setGameStatus('completed');
        setWinner(winners.length === 1 ? winners[0] : null);
        
        if (winners.length === 1) {
          toast.success(`Game Over! ${winners[0].username} wins with ${winners[0].score} points!`);
        } else {
          toast.info(`Game Over! It's a tie with ${highestScore} points each!`);
        }
        return;
      }
    }
    
    // Move to next player if no square was completed
    if (!squareCompleted) {
      const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
      setCurrentPlayerIndex(nextPlayerIndex);
      
      // Update active player
      const updatedPlayers = players.map((player, idx) => ({
        ...player,
        isActive: idx === nextPlayerIndex
      }));
      setPlayers(updatedPlayers);
    }
  };
  
  // Share game
  const shareGame = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join my DotNect game!',
        text: `I'm playing DotNect. Join me for a game of Connect the Dots!`,
        url: window.location.href,
      })
      .catch(error => toast.error('Error sharing: ' + error));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success('Game link copied to clipboard!'))
        .catch(() => toast.error('Failed to copy link'));
    }
  };
  
  // Initialize game when component mounts or grid size changes
  useEffect(() => {
    initializeGame();
  }, [gridSize]);
  
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col flex-grow">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">DotNect Game</h2>
          <p className="text-surface-600 dark:text-surface-400">
            {gameStatus === 'waiting' && 'Game setup...'}
            {gameStatus === 'active' && `${players[currentPlayerIndex].username}'s turn`}
            {gameStatus === 'completed' && winner 
              ? `Game over! ${winner.username} wins!` 
              : gameStatus === 'completed' ? 'Game over! It\'s a tie!' : ''}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="btn btn-outline"
            aria-label="Game Settings"
          >
            <Settings size={18} />
            <span className="hidden sm:inline">Settings</span>
          </button>
          
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="btn btn-outline"
            aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            <span className="hidden sm:inline">{soundEnabled ? "Sound On" : "Sound Off"}</span>
          </button>
          
          <button 
            onClick={shareGame}
            className="btn btn-outline"
            aria-label="Share game"
          >
            <Share size={18} />
            <span className="hidden sm:inline">Share</span>
          </button>
          
          <button 
            onClick={initializeGame}
            className="btn btn-primary"
            aria-label="Reset game"
          >
            <Refresh size={18} />
            <span className="hidden sm:inline">New Game</span>
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Game Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-medium">Grid Size ({gridSize}x{gridSize})</label>
                  <input 
                    type="range" 
                    min="3" 
                    max="10" 
                    value={gridSize} 
                    onChange={(e) => setGridSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-surface-500 dark:text-surface-400 mt-1">
                    <span>3x3</span>
                    <span>10x10</span>
                  </div>
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Players</label>
                  <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                    {players.map((player, index) => (
                      <div 
                        key={player.id} 
                        className="flex items-center p-2 rounded-lg bg-surface-100 dark:bg-surface-800 border-l-4"
                        style={{ borderLeftColor: player.color }}
                      >
                        <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: player.color }}></div>
                        <span className="flex-grow font-medium">{player.username}</span>
                        <span className="text-sm text-surface-500 dark:text-surface-400">{player.score} pts</span>
                      </div>
                    ))}
                  </div>
                  
                  {players.length < 4 && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add player"
                        value={newPlayerName}
                        onChange={(e) => setNewPlayerName(e.target.value)}
                        className="flex-grow"
                      />
                      <button 
                        onClick={addPlayer}
                        className="btn btn-primary btn-sm"
                        aria-label="Add player"
                      >
                        <UserPlus size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex-grow flex flex-col md:flex-row gap-6">
        <div className="flex-grow card flex flex-col items-center justify-center p-4 md:p-8">
          <div 
            className="relative p-2"
            style={{ 
              display: 'grid',
              gridTemplateColumns: `repeat(${gridSize * 2 - 1}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${gridSize * 2 - 1}, minmax(0, 1fr))`,
              gap: '0',
              width: '100%',
              maxWidth: '600px',
              aspectRatio: '1/1'
            }}
          >
            {/* Draw grid dots */}
            {grid.dots.map(dot => (
              <div 
                key={dot.id}
                className="flex items-center justify-center"
                style={{ 
                  gridColumn: dot.x * 2 + 1,
                  gridRow: dot.y * 2 + 1
                }}
              >
                <motion.div
                  className="w-4 h-4 rounded-full bg-surface-600 dark:bg-surface-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                />
              </div>
            ))}
            
            {/* Draw horizontal lines */}
            {grid.horizontalLines.map(line => {
              const isDrawn = line.drawn;
              const lineColor = isDrawn 
                ? players.find(p => p.id === line.playerId)?.color 
                : '';
              
              return (
                <div 
                  key={line.id}
                  className="flex items-center justify-center"
                  style={{ 
                    gridColumn: `${line.x * 2 + 1} / span 2`,
                    gridRow: line.y * 2 + 1
                  }}
                >
                  <div 
                    className={`w-full h-2 rounded-full transition-all duration-200 ${
                      isDrawn 
                        ? '' 
                        : 'hover:bg-primary/30 cursor-pointer'
                    }`}
                    style={{ 
                      backgroundColor: isDrawn ? lineColor : 'rgba(203, 213, 225, 0.3)'
                    }}
                    onClick={() => !isDrawn && handleLineClick('horizontal', line.id)}
                  />
                </div>
              );
            })}
            
            {/* Draw vertical lines */}
            {grid.verticalLines.map(line => {
              const isDrawn = line.drawn;
              const lineColor = isDrawn 
                ? players.find(p => p.id === line.playerId)?.color 
                : '';
              
              return (
                <div 
                  key={line.id}
                  className="flex items-center justify-center"
                  style={{ 
                    gridColumn: line.x * 2 + 1,
                    gridRow: `${line.y * 2 + 1} / span 2`
                  }}
                >
                  <div 
                    className={`h-full w-2 rounded-full transition-all duration-200 ${
                      isDrawn 
                        ? '' 
                        : 'hover:bg-primary/30 cursor-pointer'
                    }`}
                    style={{ 
                      backgroundColor: isDrawn ? lineColor : 'rgba(203, 213, 225, 0.3)'
                    }}
                    onClick={() => !isDrawn && handleLineClick('vertical', line.id)}
                  />
                </div>
              );
            })}
            
            {/* Draw squares */}
            {grid.squares.map(square => {
              const isCompleted = square.completed;
              const squareColor = isCompleted 
                ? players.find(p => p.id === square.playerId)?.color 
                : 'transparent';
              
              return (
                <div 
                  key={square.id}
                  className="flex items-center justify-center overflow-hidden"
                  style={{ 
                    gridColumn: square.x * 2 + 2,
                    gridRow: square.y * 2 + 2
                  }}
                >
                  <motion.div 
                    className="w-full h-full rounded-sm flex items-center justify-center text-white font-bold"
                    initial={{ backgroundColor: 'rgba(0,0,0,0)' }}
                    animate={{ 
                      backgroundColor: isCompleted ? squareColor + '80' : 'rgba(0,0,0,0)'
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                      >
                        {square.playerId === 1 && <User size={16} />}
                        {square.playerId === 2 && <User size={16} />}
                        {square.playerId === 3 && <User size={16} />}
                        {square.playerId === 4 && <User size={16} />}
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
          
          {gameStatus === 'completed' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <h3 className="text-xl font-bold mb-2">Game Over!</h3>
              {winner ? (
                <p className="text-lg">
                  <span style={{ color: winner.color }}>{winner.username}</span> wins with {winner.score} points!
                </p>
              ) : (
                <p className="text-lg">It's a tie!</p>
              )}
              <button 
                onClick={initializeGame}
                className="btn btn-primary mt-4"
              >
                Play Again
              </button>
            </motion.div>
          )}
        </div>
        
        <div className="md:w-64 lg:w-80 card overflow-hidden">
          <h3 className="text-xl font-semibold mb-4">Players</h3>
          
          <div className="space-y-3">
            {players.map((player) => (
              <motion.div
                key={player.id}
                className={`p-3 rounded-lg flex items-center ${
                  player.isActive ? 'bg-surface-100 dark:bg-surface-800 ring-2 ring-primary' : ''
                }`}
                animate={{
                  scale: player.isActive ? [1, 1.02, 1] : 1
                }}
                transition={{ 
                  duration: 0.4, 
                  repeat: player.isActive ? Infinity : 0,
                  repeatType: "reverse"
                }}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                  style={{ backgroundColor: player.color }}
                >
                  <User size={16} className="text-white" />
                </div>
                <div className="flex-grow">
                  <div className="font-medium">{player.username}</div>
                  <div className="text-sm text-surface-500 dark:text-surface-400">
                    {player.score} {player.score === 1 ? 'square' : 'squares'}
                  </div>
                </div>
                {player.isActive && (
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-surface-200 dark:border-surface-700">
            <h4 className="font-medium mb-2">How to Play</h4>
            <ul className="text-sm text-surface-600 dark:text-surface-400 space-y-2">
              <li>• Click on a line to draw it</li>
              <li>• Complete a square to earn a point</li>
              <li>• Complete a square to get an extra turn</li>
              <li>• Player with the most squares wins</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainFeature;