import React, { useState } from 'react';
import { Player } from '../types';
import { UserIcon, SpyIcon } from './Icons';
import { playEliminateSound, playClickSound } from '../utils/sounds';

interface GameScreenProps {
  players: Player[];
  secretWord: string;
  onEliminatePlayer: (id: number) => void;
  onEndGame: () => void;
}

const EliminatedScreen: React.FC<{ player: Player; onContinue: () => void }> = ({ player, onContinue }) => {
    return (
        <div className="absolute inset-0 bg-red-900/95 text-white flex flex-col items-center justify-center z-20 p-4 text-center animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">تم كشف اللاعب</h2>
            <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-xs shadow-lg flex flex-col items-center">
                {player.isSpy ? <SpyIcon className="w-20 h-20 text-red-400"/> : <UserIcon className="w-20 h-20 text-green-400"/>}
                <p className="text-4xl font-black my-2">{player.name}</p>
                <p className={`text-2xl font-bold ${player.isSpy ? 'text-red-400' : 'text-green-400'}`}>
                    {player.isSpy ? 'كان الجسّوس!' : 'لم يكن الجسّوس'}
                </p>
            </div>
             <button
                onClick={() => {
                    playClickSound();
                    onContinue();
                }}
                className="mt-8 bg-white text-red-900 font-bold text-xl px-8 py-3 rounded-full shadow-lg"
            >
                متابعة اللعب
            </button>
        </div>
    );
};


const GameScreen: React.FC<GameScreenProps> = ({ players, secretWord, onEliminatePlayer, onEndGame }) => {
  const [playerToConfirm, setPlayerToConfirm] = useState<Player | null>(null);
  const [eliminatedPlayerInfo, setEliminatedPlayerInfo] = useState<Player | null>(null);

  const activePlayers = players.filter(p => !p.isEliminated);
  const spy = players.find(p => p.isSpy);
  
  const handleVoteClick = (player: Player) => {
    playClickSound();
    setPlayerToConfirm(player);
  };
  
  const confirmElimination = () => {
    if (playerToConfirm) {
        playEliminateSound();
        onEliminatePlayer(playerToConfirm.id);
        setEliminatedPlayerInfo(playerToConfirm);
        setPlayerToConfirm(null);
    }
  };

  const handleContinueAfterElimination = () => {
      const spyWasEliminated = eliminatedPlayerInfo?.isSpy;
      setEliminatedPlayerInfo(null);
      if (spyWasEliminated) {
        onEndGame();
      }
  };

  return (
    <div className="relative w-full min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 pt-10">
        {eliminatedPlayerInfo && <EliminatedScreen player={eliminatedPlayerInfo} onContinue={handleContinueAfterElimination} />}
        {playerToConfirm && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 p-4">
                <div className="bg-gray-800 rounded-2xl p-8 text-center shadow-lg animate-fade-in">
                    <h3 className="text-2xl font-bold mb-2">هل أنت متأكد؟</h3>
                    <p className="text-lg mb-6">سيتم طرد <span className="font-bold text-yellow-400">{playerToConfirm.name}</span> من الجولة.</p>
                    <div className="flex justify-center gap-4">
                         <button onClick={() => { playClickSound(); setPlayerToConfirm(null);}} className="px-8 py-3 bg-gray-600 rounded-lg font-bold">إلغاء</button>
                         <button onClick={confirmElimination} className="px-8 py-3 bg-red-600 text-white rounded-lg font-bold">تأكيد الطرد</button>
                    </div>
                </div>
            </div>
        )}

      <h1 className="text-4xl font-black text-green-400 mb-2">الجولة بدأت!</h1>
      <p className="text-lg text-gray-400 mb-8">تحدثوا وحاولوا كشف الجسّوس</p>
      
      <div className="w-full max-w-md">
        <h2 className="text-xl font-bold text-right mb-3 text-green-300">اللاعبون النشطون ({activePlayers.length})</h2>
        <div className="space-y-3">
          {players.map((player) => (
            <div
              key={player.id}
              className={`flex items-center justify-between p-4 rounded-lg transition ${player.isEliminated ? 'bg-gray-700 opacity-50' : 'bg-gray-800'}`}
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-full me-4 ${player.isEliminated ? 'bg-gray-600' : 'bg-green-500/20'}`}>
                    <UserIcon className={`w-6 h-6 ${player.isEliminated ? 'text-gray-500' : 'text-green-300'}`} />
                </div>
                <span className={`text-xl font-bold ${player.isEliminated ? 'line-through' : ''}`}>{player.name}</span>
              </div>
              {!player.isEliminated && (
                <button
                  onClick={() => handleVoteClick(player)}
                  className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 transition text-sm"
                >
                  تصويت للطرد
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-auto pt-8 w-full max-w-md">
         <button
            onClick={() => {
                playClickSound();
                onEndGame();
            }}
            className="w-full p-4 bg-yellow-500 text-gray-900 font-bold rounded-lg"
          >
            كشف الجسّوس وإنهاء الجولة
        </button>
      </div>
    </div>
  );
};

export default GameScreen;