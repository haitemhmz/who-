import React, { useState, useCallback } from 'react';
import { PlusIcon, TrashIcon } from './Icons';
import { GoogleGenAI } from "@google/genai";
import { playClickSound, initAudio } from '../utils/sounds';

interface SetupScreenProps {
  onGameStart: (playerNames: string[], secretWord: string, category: string) => void;
}

const categories = [
  'حيوانات', 'فواكه', 'خضروات', 'مهن', 'دول', 'مدن', 'أدوات منزلية', 'ملابس', 'رياضة',
  'أفلام', 'مشاعر', 'علوم', 'تكنولوجيا', 'طعام', 'مشروبات', 'طبيعة', 'ألوان',
  'أدوات مكتبية', 'وسائل نقل', 'آلات موسيقية', 'شخصيات تاريخية', 'علامات تجارية'
];

const SetupScreen: React.FC<SetupScreenProps> = ({ onGameStart }) => {
  const [players, setPlayers] = useState<string[]>(['', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePlayerNameChange = useCallback((index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index] = name;
    setPlayers(newPlayers);
  }, [players]);

  const addPlayer = useCallback(() => {
    playClickSound();
    setPlayers([...players, '']);
  }, [players]);

  const removePlayer = useCallback((index: number) => {
    if (players.length > 3) {
      playClickSound();
      const newPlayers = players.filter((_, i) => i !== index);
      setPlayers(newPlayers);
    }
  }, [players]);

  const handleStart = async () => {
    initAudio();
    playClickSound();

    const trimmedPlayers = players.map(p => p.trim()).filter(p => p.length > 0);

    if (trimmedPlayers.length < 3) {
      setError('يجب أن يكون هناك 3 لاعبين على الأقل.');
      return;
    }
    if (trimmedPlayers.length !== players.length) {
        setError('جميع أسماء اللاعبين مطلوبة.');
        return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `اقترح كلمة عربية شائعة من فئة "${randomCategory}". يجب أن تكون الكلمة اسمًا واحدًا فقط بدون أي علامات ترقيم أو وصف. لا تقم بتضمين أي شيء آخر في الرد، فقط الكلمة.`,
      });

      const aiWord = response.text.trim().replace(/[."]/g, '');

      if (aiWord) {
        onGameStart(trimmedPlayers, aiWord, randomCategory);
      } else {
        throw new Error("AI returned an empty word.");
      }
    } catch (e) {
      console.error("Gemini API error:", e);
      setError('حدث خطأ أثناء إنشاء الكلمة. الرجاء المحاولة مرة أخرى.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-5xl font-black text-green-500 mb-2">Impostrico</h1>
        <p className="text-lg text-gray-500 mb-8">لعبة الشك والتخمين</p>

        <div className="bg-white p-6 rounded-2xl">
          <div className="mb-4">
             <label className="block text-right text-gray-600 font-bold mb-2">اللاعبون ({players.length})</label>
            {players.map((player, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={player}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                  placeholder={`اسم اللاعب ${index + 1}`}
                  className="w-full bg-gray-100 border-2 border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-500 text-lg focus:outline-none focus:border-green-500 transition"
                />
                {players.length > 3 && (
                   <button onClick={() => removePlayer(index)} className="p-2 me-2 text-red-500 hover:text-red-400 transition">
                       <TrashIcon className="w-6 h-6" />
                   </button>
                )}
              </div>
            ))}
             <button onClick={addPlayer} className="w-full flex items-center justify-center p-3 mt-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-bold">
                <PlusIcon className="w-6 h-6 ms-2" />
                <span>إضافة لاعب</span>
            </button>
          </div>
          
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <button
            onClick={handleStart}
            disabled={isLoading}
            className="w-full bg-green-500 text-white font-bold text-xl p-4 rounded-lg shadow-lg hover:bg-green-600 transition transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'جاري إنشاء كلمة...' : 'ابدأ اللعبة'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;