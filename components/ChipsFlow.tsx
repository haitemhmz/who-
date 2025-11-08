
import React, { useState, useEffect, useCallback } from 'react';
import { Board, Boards, Chip, ChipsGamePhase } from '../types';
import { HeartIcon, BombIcon, CheckIcon, ChipsIcon, ArrowLeftIcon } from './Icons';
import { playChipSelectSound, playChipReadySound, playChipEatGoodSound, playChipEatBombSound, playWinSound, playLoseSound, playClickSound, initAudio } from '../utils/sounds';

const NUM_CHIPS = 9;
const NUM_BOMBS = 3;
const INITIAL_LIVES = 3;

const createEmptyBoard = (): Board => Array(NUM_CHIPS).fill(null).map(() => ({ isBomb: false, isRevealed: false }));

const ChipImage: React.FC = () => (
    <img 
        src="data:image/png;base64,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"
        alt="Chip" 
        className="w-16 h-16 object-contain pointer-events-none"
    />
);

// --- Sub-components ---

const ChipsIntroScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => (
    <div className="w-full min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <ChipsIcon className="w-32 h-32 text-yellow-400 mb-4" />
        <h1 className="text-6xl font-black text-yellow-300 mb-2">لعبة الشيبس</h1>
        <p className="text-xl text-gray-400 mb-10">هل ستأكل القنبلة؟</p>
        <button
            onClick={onStart}
            className="w-full max-w-sm bg-yellow-500 text-gray-900 font-bold text-2xl p-4 rounded-lg shadow-lg hover:bg-yellow-400 transition transform hover:scale-105"
        >
            ابدأ
        </button>
    </div>
);

const ChipGrid: React.FC<{
    board: Board;
    onChipClick: (index: number) => void;
    isDisabled: boolean;
    isSetup: boolean;
}> = ({ board, onChipClick, isDisabled, isSetup }) => (
    <div className={`grid grid-cols-3 gap-3 p-3 rounded-lg bg-gray-700/50 ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
        {board.map((chip, index) => (
            <button
                key={index}
                onClick={() => onChipClick(index)}
                disabled={isDisabled}
                className={`relative w-20 h-20 rounded-full transition-transform transform flex items-center justify-center
                    ${isDisabled ? 'cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
                    ${chip.isRevealed ? (chip.isBomb ? 'bg-red-500' : 'bg-green-500') : (isSetup && chip.isBomb ? 'bg-yellow-600' : 'bg-gray-800')}
                `}
            >
                {chip.isRevealed ? (
                    chip.isBomb ? <BombIcon className="w-12 h-12 text-white" /> : <CheckIcon className="w-12 h-12 text-white" />
                ) : (
                    <ChipImage />
                )}
            </button>
        ))}
    </div>
);

const TransitionScreen: React.FC<{ onContinue: () => void, nextPlayerName: string }> = ({ onContinue, nextPlayerName }) => {
    return (
        <div className="w-full h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 text-center">
            <h1 className="text-4xl font-black text-yellow-300 mb-4">تم الإعداد!</h1>
            <p className="text-xl text-gray-300 mb-8">مرّر الجهاز إلى <span className="font-bold text-yellow-400">{nextPlayerName}</span>.</p>
            <button
                onClick={onContinue}
                className="mt-8 px-12 py-4 bg-green-500 text-white font-bold text-xl rounded-lg shadow-lg hover:bg-green-600 transition flex items-center"
            >
                <span>أنا {nextPlayerName}، لنكمل</span>
                <ArrowLeftIcon className="w-8 h-8 ms-2"/>
            </button>
        </div>
    );
};


const ChipsSetupScreen: React.FC<{ onSetupComplete: (boards: Boards) => void }> = ({ onSetupComplete }) => {
    const [setupStep, setSetupStep] = useState<'p1_placing' | 'transition' | 'p2_placing'>('p1_placing');
    const [p1Bombs, setP1Bombs] = useState<number[]>([]);
    const [p2Bombs, setP2Bombs] = useState<number[]>([]);

    const handleChipClick = (index: number) => {
        playChipSelectSound();
        const bombs = setupStep === 'p1_placing' ? p2Bombs : p1Bombs;
        const setBombs = setupStep === 'p1_placing' ? setP2Bombs : setP1Bombs;

        if (bombs.includes(index)) {
            setBombs(bombs.filter(i => i !== index));
        } else if (bombs.length < NUM_BOMBS) {
            setBombs([...bombs, index]);
        }
    };

    const handleReady = () => {
        playChipReadySound();
        if (setupStep === 'p1_placing') {
            setSetupStep('transition');
        } else {
            const finalBoards: Boards = {
                player1: createEmptyBoard(),
                player2: createEmptyBoard(),
            };
            p1Bombs.forEach(i => finalBoards.player1[i].isBomb = true);
            p2Bombs.forEach(i => finalBoards.player2[i].isBomb = true);
            onSetupComplete(finalBoards);
        }
    };

    if (setupStep === 'transition') {
        return <TransitionScreen onContinue={() => { playClickSound(); setSetupStep('p2_placing'); }} nextPlayerName="اللاعب 2" />;
    }

    const bombsForP1 = createEmptyBoard();
    p1Bombs.forEach(i => bombsForP1[i].isBomb = true);
    const bombsForP2 = createEmptyBoard();
    p2Bombs.forEach(i => bombsForP2[i].isBomb = true);

    const isP1Placing = setupStep === 'p1_placing';
    const currentBombs = isP1Placing ? p2Bombs : p1Bombs;

    return (
        <div className="w-full min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold mb-2">مرحلة الإعداد</h1>
            <p className="text-xl mb-4 text-center">
                دور <span className="font-black text-yellow-400">{isP1Placing ? 'اللاعب 1' : 'اللاعب 2'}</span>
                <br />
                اخفِ {NUM_BOMBS} قنابل في منطقة <span className="font-black text-yellow-400">{isP1Placing ? 'اللاعب 2' : 'اللاعب 1'}</span>
            </p>
            <p className="text-2xl font-bold mb-6 text-green-400">({currentBombs.length} / {NUM_BOMBS})</p>

            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex flex-col items-center">
                    <h2 className="text-lg font-bold mb-2">منطقة اللاعب 1</h2>
                    <ChipGrid board={bombsForP1} onChipClick={handleChipClick} isDisabled={isP1Placing} isSetup={true} />
                </div>
                <div className="flex flex-col items-center">
                    <h2 className="text-lg font-bold mb-2">منطقة اللاعب 2</h2>
                    <ChipGrid board={bombsForP2} onChipClick={handleChipClick} isDisabled={!isP1Placing} isSetup={true} />
                </div>
            </div>
            
            <button
                onClick={handleReady}
                disabled={currentBombs.length !== NUM_BOMBS}
                className="mt-8 px-12 py-4 bg-green-500 text-white font-bold text-xl rounded-lg shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-green-600 transition"
            >
                {isP1Placing ? 'جاهز، مرر للاعب 2' : 'جاهز، لنبدأ اللعب'}
            </button>
        </div>
    );
};

const Lives: React.FC<{ count: number }> = ({ count }) => (
    <div className="flex justify-center gap-2">
        {Array(INITIAL_LIVES).fill(0).map((_, i) => (
            <HeartIcon key={i} className={`w-8 h-8 transition-colors ${i < count ? 'text-red-500' : 'text-gray-600'}`} />
        ))}
    </div>
);

const ChipsGameScreen: React.FC<{
    boards: Boards,
    onChipClick: (player: 'player1' | 'player2', index: number) => void,
    lives: { player1: number, player2: number },
    turn: 'player1' | 'player2'
}> = ({ boards, onChipClick, lives, turn }) => (
    <div className="w-full min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-2">
        <h1 className="text-4xl font-black text-yellow-400 my-4 animate-pulse">
            دور {turn === 'player1' ? 'اللاعب 1' : 'اللاعب 2'}
        </h1>

        <div className="w-full flex flex-col md:flex-row items-center justify-around gap-4 flex-grow">
            <div className="flex flex-col items-center gap-4">
                <h2 className="text-2xl font-bold">خصمك (اللاعب 1)</h2>
                <Lives count={lives.player1} />
                <ChipGrid board={boards.player1} onChipClick={(i) => onChipClick('player1', i)} isDisabled={turn !== 'player2'} isSetup={false} />
            </div>
            <div className="flex flex-col items-center gap-4">
                <h2 className="text-2xl font-bold">خصمك (اللاعب 2)</h2>
                <Lives count={lives.player2} />
                <ChipGrid board={boards.player2} onChipClick={(i) => onChipClick('player2', i)} isDisabled={turn !== 'player1'} isSetup={false} />
            </div>
        </div>
    </div>
);

const ChipsGameOverScreen: React.FC<{ winner: 'player1' | 'player2'; onRestart: () => void }> = ({ winner, onRestart }) => {
    useEffect(() => {
        playWinSound();
    }, []);
    return (
        <div className="w-full min-h-screen bg-green-900 text-white flex flex-col items-center justify-center p-4 text-center">
            <h1 className="text-6xl font-black mb-4">الفائز هو {winner === 'player1' ? 'اللاعب 1' : 'اللاعب 2'}!</h1>
            <p className="text-2xl mb-10">لقد نجوت من القنابل!</p>
            <button
                onClick={onRestart}
                className="w-full max-w-sm bg-white text-gray-900 font-bold text-2xl p-4 rounded-lg shadow-lg hover:bg-gray-200 transition transform hover:scale-105"
            >
                العب مرة أخرى
            </button>
        </div>
    );
}

// --- Main Flow Component ---

const ChipsFlow: React.FC = () => {
    const [phase, setPhase] = useState<ChipsGamePhase>(ChipsGamePhase.INTRO);
    const [boards, setBoards] = useState<Boards | null>(null);
    const [lives, setLives] = useState({ player1: INITIAL_LIVES, player2: INITIAL_LIVES });
    const [turn, setTurn] = useState<'player1' | 'player2'>('player1');
    const [winner, setWinner] = useState<'player1' | 'player2' | null>(null);

    const handleStart = () => {
        initAudio();
        playClickSound();
        setPhase(ChipsGamePhase.SETUP);
    };
    
    const handleRestart = () => {
        playClickSound();
        setPhase(ChipsGamePhase.INTRO);
        setBoards(null);
        setLives({ player1: INITIAL_LIVES, player2: INITIAL_LIVES });
        setTurn('player1');
        setWinner(null);
    }

    const handleSetupComplete = useCallback((finalBoards: Boards) => {
        setBoards(finalBoards);
        setPhase(ChipsGamePhase.GAMEPLAY);
    }, []);

    const handleChipClick = (player: 'player1' | 'player2', index: number) => {
        if (!boards || winner) return;

        const boardKey = turn === 'player1' ? 'player2' : 'player1';
        const boardToUpdate = boards[boardKey];
        if (boardToUpdate[index].isRevealed) return;

        boardToUpdate[index].isRevealed = true;

        if (boardToUpdate[index].isBomb) {
            playChipEatBombSound();
            const newLives = { ...lives };
            newLives[turn]--;
            setLives(newLives);

            if (newLives[turn] <= 0) {
                setWinner(turn === 'player1' ? 'player2' : 'player1');
                setPhase(ChipsGamePhase.GAME_OVER);
            }
        } else {
            playChipEatGoodSound();
        }

        const newBoards = { ...boards, [boardKey]: boardToUpdate };
        setBoards(newBoards);
        setTurn(turn === 'player1' ? 'player2' : 'player1');
    };

    switch (phase) {
        case ChipsGamePhase.INTRO:
            return <ChipsIntroScreen onStart={handleStart} />;
        case ChipsGamePhase.SETUP:
            return <ChipsSetupScreen onSetupComplete={handleSetupComplete} />;
        case ChipsGamePhase.GAMEPLAY:
            if (!boards) return null;
            return <ChipsGameScreen boards={boards} onChipClick={handleChipClick} lives={lives} turn={turn} />;
        case ChipsGamePhase.GAME_OVER:
             if (!winner) return null;
            return <ChipsGameOverScreen winner={winner} onRestart={handleRestart}/>;
        default:
            return <ChipsIntroScreen onStart={handleStart} />;
    }
};

export default ChipsFlow;