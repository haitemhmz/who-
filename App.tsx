
import React, { useState, useCallback, useEffect } from 'react';
import { GamePhase, Player } from './types';
import SetupScreen from './components/SetupScreen';
import RevealFlow from './components/RevealFlow';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import SplashScreen from './components/SplashScreen';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // State for Spy Game
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.SETUP);
  const [players, setPlayers] = useState<Player[]>([]);
  const [secretWord, setSecretWord] = useState<string>('');
  const [secretWordCategory, setSecretWordCategory] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => {
        setShowSplash(false);
    }, 2000); // shorter splash
    return () => clearTimeout(timer);
  }, []);
  
  // Handlers for Spy Game
  const handleGameStart = useCallback((playerNames: string[], word: string, category: string) => {
    const spyIndex = Math.floor(Math.random() * playerNames.length);
    const newPlayers: Player[] = playerNames.map((name, index) => ({
      id: index,
      name,
      isSpy: index === spyIndex,
      isEliminated: false,
    }));
    
    setPlayers(newPlayers);
    setSecretWord(word);
    setSecretWordCategory(category);
    setGamePhase(GamePhase.REVEAL);
  }, []);

  const handleRevealComplete = useCallback(() => {
    setGamePhase(GamePhase.GAMEPLAY);
  }, []);

  const handleEliminatePlayer = useCallback((id: number) => {
    setPlayers(prevPlayers => 
        prevPlayers.map(p => p.id === id ? { ...p, isEliminated: true } : p)
    );
  }, []);

  const handleEndGame = useCallback(() => {
    setGamePhase(GamePhase.GAME_OVER);
  }, []);

  const handleRestart = useCallback(() => {
    setPlayers([]);
    setSecretWord('');
    setSecretWordCategory('');
    setGamePhase(GamePhase.SETUP);
  }, []);

  const renderGame = () => {
    switch (gamePhase) {
      case GamePhase.SETUP:
        return <SetupScreen onGameStart={handleGameStart} />;
      case GamePhase.REVEAL:
        return <RevealFlow players={players} secretWord={secretWord} secretWordCategory={secretWordCategory} onRevealComplete={handleRevealComplete} />;
      case GamePhase.GAMEPLAY:
        return <GameScreen players={players} secretWord={secretWord} onEliminatePlayer={handleEliminatePlayer} onEndGame={handleEndGame} />;
      case GamePhase.GAME_OVER:
        return <GameOverScreen players={players} secretWord={secretWord} secretWordCategory={secretWordCategory} onRestart={handleRestart} />;
      default:
        return <SetupScreen onGameStart={handleGameStart} />;
    }
  };

  return (
    <div className="bg-gray-900 text-gray-800 min-h-screen antialiased">
      {showSplash ? <SplashScreen /> : renderGame()}
    </div>
  );
};

export default App;
