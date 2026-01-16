import { AudioService } from './audioService';

export class DamaAudioService implements AudioService {
  private ctx: AudioContext | null = null;
  private muted = false;

  toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }

  isMuted(): boolean {
    return this.muted;
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
  }

  private getContext(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext();
    return this.ctx;
  }

  private playTone(frequency: number, duration = 0.1, gainValue = 0.12) {
    if (this.muted) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.value = frequency;
    gain.gain.value = gainValue;

    osc.connect(gain).connect(ctx.destination);

    const now = ctx.currentTime;
    osc.start(now);
    gain.gain.setTargetAtTime(0, now + duration * 0.6, duration * 0.6);
    osc.stop(now + duration);
  }

  playMove() {
    this.playTone(220, 0.12, 0.12);
  }

  playCapture() {
    this.playTone(340, 0.14, 0.14);
  }

  playIllegal() {
    this.playTone(120, 0.08, 0.16);
  }

  playPromotion() {
    this.playTone(820, 0.16, 0.12);
  }
}
