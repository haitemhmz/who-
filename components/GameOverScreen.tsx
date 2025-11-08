import React, { useEffect } from 'react';
import { Player } from '../types';
import { SpyIcon, UserIcon } from './Icons';
import { playWinSound, playLoseSound, playClickSound } from '../utils/sounds';

interface GameOverScreenProps {
  players: Player[];
  secretWord: string;
  secretWordCategory: string;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ players, secretWord, secretWordCategory, onRestart }) => {
  const spy = players.find(p => p.isSpy);
  const spyWasFound = spy?.isEliminated;

  useEffect(() => {
    if (spyWasFound) {
      playWinSound();
    } else {
      playLoseSound();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`w-full min-h-screen text-white flex flex-col items-center justify-center p-4 text-center transition-colors duration-500 ${spyWasFound ? 'bg-green-900' : 'bg-red-900'}`}>
        <div className="w-full max-w-md">
            <h1 className="text-5xl font-black mb-4">
                {spyWasFound ? 'تم كشف الجسّوس!' : 'الجسّوس قد نجح!'}
            </h1>
            <p className="text-2xl mb-8">
                 {spyWasFound ? `أحسنتم! لقد وجدتم الجسّوس.` : `للأسف، لم تتمكنوا من كشف الجسّوس.`}
            </p>

            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg mb-8">
                <h3 className="text-xl font-bold text-green-300 mb-2">الجسّوس كان</h3>
                <div className="flex items-center justify-center bg-gray-900/50 p-4 rounded-lg">
                    <SpyIcon className="w-10 h-10 text-red-400 me-4"/>
                    <p className="text-4xl font-black">{spy?.name}</p>
                </div>
                 <h3 className="text-xl font-bold text-green-300 mt-6 mb-2">الكلمة الرئيسية كانت</h3>
                 <div className="bg-gray-900/50 p-4 rounded-lg">
                    <p className="text-4xl font-black text-green-400">{secretWord}</p>
                    <p className="text-lg text-gray-400 mt-1">الفئة: <span className="font-bold text-green-300">{secretWordCategory}</span></p>
                </div>
            </div>

            <button
                onClick={() => {
                    playClickSound();
                    onRestart();
                }}
                className="w-full bg-white text-gray-900 font-bold text-2xl p-4 rounded-lg shadow-lg hover:bg-gray-200 transition transform hover:scale-105"
            >
                العب مرة أخرى
            </button>
        </div>
    </div>
  );
};

export default GameOverScreen;