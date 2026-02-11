/**
 * Web Audio API utility for synthesized cybernetic sounds.
 * Avoids the need for external assets.
 */

let audioCtx = null;

const initAudio = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
};

const playTone = (frequency, type, duration, volume) => {
    try {
        initAudio();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = type; // 'sine', 'square', 'sawtooth', 'triangle'
        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

        gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
        // Silently fail if audio is blocked or unsupported
    }
};

export const playHoverSound = () => {
    // Subtle high-pitch "tick"
    playTone(880, 'sine', 0.05, 0.05);
};

export const playClickSound = () => {
    // Two-tone digital "chirp"
    playTone(440, 'square', 0.1, 0.08);
    setTimeout(() => playTone(880, 'square', 0.05, 0.05), 50);
};

export const playNotifySound = () => {
    // Pleasant rising chime
    playTone(523.25, 'sine', 0.2, 0.1); // C5
    setTimeout(() => playTone(659.25, 'sine', 0.2, 0.1), 100); // E5
    setTimeout(() => playTone(783.99, 'sine', 0.2, 0.1), 200); // G5
};
