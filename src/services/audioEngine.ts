/**
 * Lumora Cinematic Audio Engine
 * Combines Web Audio ambient soundscape synthesis with HTML5 Audio playback
 * Provides a real AnalyserNode for audio visualization.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private audioSourceNode: MediaElementAudioSourceNode | null = null;
  private synthInterval: number | null = null;
  private isPlaying: boolean = false;
  private currentVolume: number = 0.8;
  private activeOscillators: OscillatorNode[] = [];

  constructor() {
    // Lazy initialize upon user gesture
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        this.ctx = new AudioCtx();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;
        this.analyser.smoothingTimeConstant = 0.85;

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);

        this.analyser.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
      } catch (err) {
        console.warn('AudioContext initialization failed or blocked:', err);
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public setVolume(volume: number) {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.currentVolume, this.ctx.currentTime, 0.05);
    }
    if (this.audioElement) {
      this.audioElement.volume = this.currentVolume;
    }
  }

  public async playTrack(trackSrc?: string, synthPreset?: string): Promise<void> {
    this.stop();
    this.initContext();

    if (!this.ctx || !this.analyser) return;

    if (trackSrc && trackSrc.trim().length > 0) {
      // Use HTML5 audio
      try {
        if (!this.audioElement) {
          this.audioElement = new Audio();
          this.audioElement.crossOrigin = 'anonymous';
          try {
            this.audioSourceNode = this.ctx.createMediaElementSource(this.audioElement);
            this.audioSourceNode.connect(this.analyser);
          } catch {
            // In case media element source is already bound
          }
        }
        this.audioElement.src = trackSrc;
        this.audioElement.volume = this.currentVolume;
        await this.audioElement.play();
        this.isPlaying = true;
      } catch (err) {
        console.warn('HTML5 Audio playback failed or blocked:', err);
        // Fallback to ambient synth
        this.startAmbientSynth(synthPreset || 'golden');
      }
    } else {
      // Use built-in ambient cinematic synthesizer
      this.startAmbientSynth(synthPreset || 'golden');
    }
  }

  private startAmbientSynth(preset: string) {
    if (!this.ctx || !this.analyser) return;

    this.isPlaying = true;
    this.stopSynthNodes();

    // Sound palettes
    let baseFrequencies: number[] = [146.83, 220.0, 261.63, 329.63]; // D3, A3, C4, E4 (Atmospheric Dm9)
    if (preset === 'midnight') {
      baseFrequencies = [110.0, 164.81, 196.0, 246.94]; // A2, E3, G3, B3
    } else if (preset === 'rain') {
      baseFrequencies = [130.81, 196.0, 246.94, 293.66]; // C3, G3, B3, D4
    } else if (preset === 'starlight') {
      baseFrequencies = [174.61, 261.63, 329.63, 392.0]; // F3, C4, E4, G4
    }

    // Create lush drone pad
    const padGain = this.ctx.createGain();
    padGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    padGain.gain.exponentialRampToValueAtTime(0.25, this.ctx.currentTime + 3);

    // Warm Low Pass Filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

    baseFrequencies.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      // Slight detune for rich spatial warmth
      osc.detune.setValueAtTime((idx - 1.5) * 4, this.ctx.currentTime);

      osc.connect(filter);
      osc.start();
      this.activeOscillators.push(osc);
    });

    filter.connect(padGain);
    padGain.connect(this.analyser);

    // Soft gentle arpeggiator / chime every few seconds
    this.synthInterval = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.analyser) return;

      const randomFreq = baseFrequencies[Math.floor(Math.random() * baseFrequencies.length)] * 2;
      const chimeOsc = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();

      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(randomFreq, this.ctx.currentTime);

      chimeGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      chimeGain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.1);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 3.5);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(filter);

      chimeOsc.start();
      chimeOsc.stop(this.ctx.currentTime + 4);
    }, 3800);
  }

  private stopSynthNodes() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Already stopped
      }
    });
    this.activeOscillators = [];
  }

  public pause(): void {
    if (this.audioElement && !this.audioElement.paused) {
      this.audioElement.pause();
    }
    this.stopSynthNodes();
    this.isPlaying = false;
  }

  public resume(trackSrc?: string, synthPreset?: string): void {
    if (this.audioElement && trackSrc && this.audioElement.src) {
      this.audioElement.play().catch(() => {});
      this.isPlaying = true;
    } else {
      this.playTrack(trackSrc, synthPreset);
    }
  }

  public stop(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    this.stopSynthNodes();
    this.isPlaying = false;
  }

  public seek(seconds: number): void {
    if (this.audioElement) {
      this.audioElement.currentTime = seconds;
    }
  }

  public getCurrentTime(): number {
    return this.audioElement ? this.audioElement.currentTime : 0;
  }

  public getDuration(): number {
    return this.audioElement ? (this.audioElement.duration || 0) : 0;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public onEnded(callback: () => void): void {
    if (this.audioElement) {
      this.audioElement.onended = callback;
    }
  }
}

export const globalAudioEngine = new AudioEngine();
