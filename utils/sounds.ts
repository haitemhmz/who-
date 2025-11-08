
// A single AudioContext is created and reused to manage audio resources efficiently.
let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
    // Check if running in a browser environment.
    if (typeof window !== 'undefined') {
        if (!audioContext) {
            // Create a new AudioContext, supporting older browser versions.
            audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return audioContext;
    }
    return null;
}

/**
 * A generic function to play a tone with a specific frequency, duration, and waveform.
 * @param freq - The frequency of the tone in Hertz.
 * @param duration - The duration of the tone in seconds.
 * @param type - The shape of the sound wave (e.g., 'sine', 'square').
 */
const playTone = (freq: number, duration: number, type: OscillatorType = 'sine') => {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    // Browsers often require user interaction before audio can be played.
    // This resumes the context if it was suspended.
    if (ctx.state === 'suspended') {
        ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
    
    // Set initial volume and create a fade-out effect for a smoother sound.
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    // FIX: Corrected typo in Web Audio API method name.
    gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
};

// --- Public Sound Effect Functions ---

/**
 * Plays a short, sharp click sound, often used for UI button presses.
 */
export const playClickSound = () => {
    playTone(600, 0.05, 'triangle');
    setTimeout(() => playTone(800, 0.05, 'triangle'), 50);
};

/**
 * Plays a mysterious, ascending series of tones for role reveal moments.
 */
export const playRevealSound = () => {
    playTone(400, 0.1, 'sine');
    setTimeout(() => playTone(600, 0.1, 'sine'), 100);
    setTimeout(() => playTone(800, 0.2, 'sine'), 200);
};

/**
 * Plays a dramatic, descending tone for player elimination.
 */
export const playEliminateSound = () => {
    playTone(500, 0.2, 'sawtooth');
    setTimeout(() => playTone(300, 0.3, 'sawtooth'), 150);
};

/**
 * Plays an upbeat, short melody to signal the start of the game.
 */
export const playGameStartSound = () => {
    playTone(523.25, 0.1); // C5
    setTimeout(() => playTone(659.25, 0.1), 100); // E5
    setTimeout(() => playTone(783.99, 0.2), 200); // G5
};

/**
 * Plays a positive, triumphant sound for when the players win.
 */
export const playWinSound = () => {
    playTone(783.99, 0.15); // G5
    setTimeout(() => playTone(1046.50, 0.3), 150); // C6
};

/**
 * Plays a somber, lower-pitched sound for when the spy wins.
 */
export const playLoseSound = () => {
    playTone(300, 0.25, 'square');
    setTimeout(() => playTone(200, 0.4, 'square'), 200);
};

/**
 * Initializes the AudioContext. This should be called on the first user interaction
 * to comply with browser autoplay policies.
 */
export const initAudio = () => {
    getAudioContext()?.resume();
};

// FIX: Add missing sound effect functions for the Chips game.
/**
 * Plays a light, quick sound for selecting a chip during setup.
 */
export const playChipSelectSound = () => {
    playTone(800, 0.05, 'triangle');
};

/**
 * Plays a confirming sound when a player is ready.
 */
export const playChipReadySound = () => {
    playTone(600, 0.1, 'sine');
    setTimeout(() => playTone(900, 0.15, 'sine'), 100);
};

/**
 * Plays a positive sound for eating a safe chip.
 */
export const playChipEatGoodSound = () => {
    playTone(1000, 0.1, 'sine');
};

/**
 * Plays a low, dangerous sound for eating a bomb chip.
 */
export const playChipEatBombSound = () => {
    playTone(150, 0.3, 'sawtooth');
};
