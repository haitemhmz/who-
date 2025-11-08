
import React from 'react';
import { SpyIcon, ChipsIcon } from './Icons';

type GameType = 'spy' | 'chips';

interface BottomNavProps {
    activeGame: GameType;
    onGameSelect: (game: GameType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeGame, onGameSelect }) => {
    const navItemClasses = "flex flex-col items-center justify-center w-full h-full transition-colors duration-200 focus:outline-none";
    const activeClasses = "text-green-400";
    const inactiveClasses = "text-gray-500 hover:text-green-300";

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-gray-900 border-t border-gray-700 shadow-lg z-50">
            <div className="flex justify-around h-full">
                <button
                    onClick={() => onGameSelect('spy')}
                    className={`${navItemClasses} ${activeGame === 'spy' ? activeClasses : inactiveClasses}`}
                    aria-label="Play Impostrico Game"
                >
                    <SpyIcon className="w-8 h-8 mb-1" />
                    <span className="text-xs font-bold">الجاسوس</span>
                </button>
                <button
                    onClick={() => onGameSelect('chips')}
                    className={`${navItemClasses} ${activeGame === 'chips' ? activeClasses : inactiveClasses}`}
                    aria-label="Play Chips Game"
                >
                    <ChipsIcon className="w-8 h-8 mb-1" />
                    <span className="text-xs font-bold">الشيبس</span>
                </button>
            </div>
        </nav>
    );
};

export default BottomNav;
