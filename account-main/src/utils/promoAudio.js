/**
 * Promo Video Background Music Generator
 * Creates ambient corporate background music using the Web Audio API.
 * No external audio files required.
 */

class PromoAudioEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.isPlaying = false;
        this.nodes = [];
        this.intervals = [];
        this.isMuted = false;
        this.volume = 0.35;
    }

    init() {
        if (this.ctx) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();

        // Master gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0;
        this.masterGain.connect(this.ctx.destination);

        // Compressor for smooth output
        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.value = -24;
        this.compressor.knee.value = 30;
        this.compressor.ratio.value = 12;
        this.compressor.connect(this.masterGain);
    }

    // Create a soft pad sound
    createPad(freq, detune = 0) {
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc1.type = 'sine';
        osc1.frequency.value = freq;
        osc1.detune.value = detune;

        osc2.type = 'triangle';
        osc2.frequency.value = freq * 1.002; // slight detune for warmth
        osc2.detune.value = -detune;

        filter.type = 'lowpass';
        filter.frequency.value = 800;
        filter.Q.value = 0.5;

        gain.gain.value = 0;

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.compressor);

        osc1.start();
        osc2.start();

        this.nodes.push(osc1, osc2, gain, filter);
        return { osc1, osc2, gain, filter };
    }

    // Create subtle bell/chime
    createChime(freq, time, duration = 2) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.value = freq;

        filter.type = 'lowpass';
        filter.frequency.value = 2000;

        gain.gain.value = 0;
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.06, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.compressor);

        osc.start(time);
        osc.stop(time + duration + 0.1);

        return { osc, gain };
    }

    // Play an evolving chord progression
    startMusic() {
        if (this.isPlaying) return;
        this.init();
        this.isPlaying = true;

        const now = this.ctx.currentTime;

        // Key of C major / A minor — peaceful corporate feel
        // Chord progression: Am → F → C → G (6-4-1-5)
        const chordProgression = [
            [220.00, 261.63, 329.63],  // Am  (A3, C4, E4)
            [174.61, 220.00, 261.63],  // F   (F3, A3, C4)
            [261.63, 329.63, 392.00],  // C   (C4, E4, G4)
            [196.00, 246.94, 293.66],  // G   (G3, B3, D4)
        ];

        // Sub bass
        const sub = this.createPad(55, 0);  // A1
        sub.gain.gain.setValueAtTime(0, now);
        sub.gain.gain.linearRampToValueAtTime(0.08, now + 2);
        sub.filter.frequency.value = 200;

        // Create evolving pads
        const pads = [];
        for (let i = 0; i < 3; i++) {
            const pad = this.createPad(chordProgression[0][i], (i - 1) * 5);
            pads.push(pad);
            pad.gain.gain.setValueAtTime(0, now);
            pad.gain.gain.linearRampToValueAtTime(0.04, now + 1.5);
        }

        // Chord change interval (every ~7.5 seconds = 30s / 4 chords)
        let chordIndex = 0;
        const chordInterval = setInterval(() => {
            if (!this.isPlaying) return;
            chordIndex = (chordIndex + 1) % chordProgression.length;
            const chord = chordProgression[chordIndex];
            const t = this.ctx.currentTime;

            pads.forEach((pad, i) => {
                pad.osc1.frequency.linearRampToValueAtTime(chord[i], t + 1.5);
                pad.osc2.frequency.linearRampToValueAtTime(chord[i] * 1.002, t + 1.5);
            });

            // Update sub bass root
            const subFreq = chord[0] / 2;
            sub.osc1.frequency.linearRampToValueAtTime(subFreq, t + 1.5);
            sub.osc2.frequency.linearRampToValueAtTime(subFreq * 1.002, t + 1.5);
        }, 7500);
        this.intervals.push(chordInterval);

        // Chime melody — gentle bells
        const melodyNotes = [
            523.25, 659.25, 783.99, 659.25,  // C5, E5, G5, E5
            698.46, 523.25, 587.33, 523.25,  // F5, C5, D5, C5
            783.99, 659.25, 523.25, 440.00,  // G5, E5, C5, A4
            587.33, 523.25, 440.00, 392.00,  // D5, C5, A4, G4
        ];

        let noteIndex = 0;
        const melodyInterval = setInterval(() => {
            if (!this.isPlaying) return;
            const t = this.ctx.currentTime;
            const note = melodyNotes[noteIndex % melodyNotes.length];
            this.createChime(note, t, 2.5);
            noteIndex++;
        }, 1875); // 30s / 16 notes
        this.intervals.push(melodyInterval);

        // Initial chime
        this.createChime(melodyNotes[0], now + 0.5, 2.5);
        noteIndex++;

        // Fade in master
        this.masterGain.gain.setValueAtTime(0, now);
        this.masterGain.gain.linearRampToValueAtTime(
            this.isMuted ? 0 : this.volume,
            now + 2
        );
    }

    stopMusic() {
        if (!this.isPlaying || !this.ctx) return;
        this.isPlaying = false;

        const now = this.ctx.currentTime;

        // Fade out
        this.masterGain.gain.linearRampToValueAtTime(0, now + 1);

        // Clear intervals
        this.intervals.forEach(id => clearInterval(id));
        this.intervals = [];

        // Stop and disconnect nodes after fade
        setTimeout(() => {
            this.nodes.forEach(node => {
                try {
                    if (node.stop) node.stop();
                    node.disconnect();
                } catch (e) { /* already stopped */ }
            });
            this.nodes = [];
        }, 1500);
    }

    setMuted(muted) {
        this.isMuted = muted;
        if (!this.ctx || !this.masterGain) return;
        const now = this.ctx.currentTime;
        this.masterGain.gain.linearRampToValueAtTime(
            muted ? 0 : this.volume,
            now + 0.3
        );
    }

    setVolume(vol) {
        this.volume = vol;
        if (!this.isMuted && this.ctx && this.masterGain) {
            this.masterGain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.1);
        }
    }

    destroy() {
        this.stopMusic();
        if (this.ctx && this.ctx.state !== 'closed') {
            this.ctx.close();
        }
        this.ctx = null;
    }
}

// Singleton instance
let instance = null;

export const getPromoAudio = () => {
    if (!instance) {
        instance = new PromoAudioEngine();
    }
    return instance;
};

export default getPromoAudio;
