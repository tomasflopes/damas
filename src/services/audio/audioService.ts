export interface AudioService {
  toggleMute(): boolean;
  isMuted(): boolean;
  setMuted(muted: boolean): void;
  playMove(): void;
  playCapture(): void;
  playIllegal(): void;
  playPromotion(): void;
}
