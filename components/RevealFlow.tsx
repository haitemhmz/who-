import React, { useState } from 'react';
import { Player } from '../types';
import { UserIcon, SpyIcon, CheckIcon, ArrowLeftIcon, UpArrowIcon } from './Icons';
import { playRevealSound, playGameStartSound, playClickSound } from '../utils/sounds';

interface RevealFlowProps {
  players: Player[];
  secretWord: string;
  secretWordCategory: string;
  onRevealComplete: () => void;
}

const TransitionScreen: React.FC<{ onTransitionEnd: () => void, playerName: string }> = ({ onTransitionEnd, playerName }) => {
    React.useEffect(() => {
        const timer = setTimeout(onTransitionEnd, 1500);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="w-full h-screen bg-blue-900 text-white flex flex-col items-center justify-center p-4 text-center animate-pulse">
            <h2 className="text-3xl font-bold">استعد يا</h2>
            <h1 className="text-5xl font-black text-blue-300">{playerName}</h1>
            <p className="mt-4 text-lg">مرّر الجهاز للاعب التالي</p>
        </div>
    );
};


const PlayerIntroScreen: React.FC<{ playerName: string; onReveal: () => void }> = ({ playerName, onReveal }) => {
    const [isRevealing, setIsRevealing] = useState(false);

    const handleReveal = () => {
        playRevealSound();
        setIsRevealing(true);
        setTimeout(onReveal, 500); // duration of the slide-up animation
    }

    return (
        <div className="w-full h-screen bg-green-900 text-white flex flex-col items-center justify-center p-4 text-center overflow-hidden">
            <div className={`transition-transform duration-500 ease-in-out ${isRevealing ? '-translate-y-full' : 'translate-y-0'}`}>
                <UserIcon className="w-24 h-24 text-green-300 mx-auto mb-4"/>
                <h2 className="text-3xl font-bold">دورك يا</h2>
                <h1 className="text-6xl font-black text-green-200 mb-8">{playerName}</h1>
                <p className="text-xl mb-10">اسحب للأعلى لكشف دورك. <br/> <strong className="text-yellow-300">لا تدع أحداً يرى!</strong></p>
                <button
                    onClick={handleReveal}
                    className="bg-green-200 text-green-900 font-bold text-2xl px-12 py-5 rounded-full shadow-lg transform active:scale-95 transition-transform flex items-center animate-bounce"
                >
                    <UpArrowIcon className="w-8 h-8 me-2"/>
                    اسحب للكشف
                </button>
            </div>
        </div>
    );
};

const RoleRevealScreen: React.FC<{ player: Player; secretWord: string; secretWordCategory: string; onNext: () => void; isLastPlayer: boolean }> = ({ player, secretWord, secretWordCategory, onNext, isLastPlayer }) => {
    return (
        <div className="w-full h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 text-center animate-fade-in">
            <div className="w-full max-w-sm bg-gray-800 rounded-3xl p-8 shadow-2xl border-2 border-green-500/50">
                {player.isSpy ? (
                    <>
                        <SpyIcon className="w-28 h-28 text-red-500 mx-auto mb-4"/>
                        <h2 className="text-5xl font-black text-red-400 mb-2">أنت الجسّوس</h2>
                        <p className="text-lg text-gray-300">مهمتك هي معرفة الكلمة الرئيسية دون أن يكشفك أحد!</p>
                    </>
                ) : (
                    <>
                        <CheckIcon className="w-28 h-28 text-green-500 mx-auto mb-4"/>
                        <h2 className="text-2xl font-bold text-gray-300 mb-2">الكلمة الرئيسية هي:</h2>
                        <p className="text-6xl font-black text-green-400">{secretWord}</p>
                        <p className="text-lg text-gray-400 mt-2 mb-4">الفئة: <span className="font-bold text-green-300">{secretWordCategory}</span></p>
                        <p className="text-lg text-gray-300">مهمتك هي كشف الجسّوس!</p>
                    </>
                )}
            </div>
            <button
                onClick={onNext}
                className="mt-12 bg-green-500 text-white font-bold text-2xl px-10 py-4 rounded-full shadow-lg flex items-center transform active:scale-95 transition-transform"
            >
                {isLastPlayer ? 'ابدأ الجولة' : 'اللاعب التالي'}
                <ArrowLeftIcon className="w-8 h-8 ms-2"/>
            </button>
        </div>
    );
};


const RevealFlow: React.FC<RevealFlowProps> = ({ players, secretWord, secretWordCategory, onRevealComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [step, setStep] = useState<'intro' | 'role' | 'transition'>('intro');

  const player = players[currentIndex];

  const handleReveal = () => setStep('role');

  const handleNext = () => {
    playClickSound();
    if (currentIndex < players.length - 1) {
      setStep('transition');
    } else {
      playGameStartSound();
      onRevealComplete();
    }
  };
  
  const handleTransitionEnd = () => {
    setCurrentIndex(prev => prev + 1);
    setStep('intro');
  }

  if (step === 'transition') {
    return <TransitionScreen playerName={players[currentIndex + 1].name} onTransitionEnd={handleTransitionEnd} />;
  }

  if (step === 'intro') {
    return <PlayerIntroScreen playerName={player.name} onReveal={handleReveal} />;
  }
  
  return <RoleRevealScreen player={player} secretWord={secretWord} secretWordCategory={secretWordCategory} onNext={handleNext} isLastPlayer={currentIndex === players.length - 1} />;
};

export default RevealFlow;