export enum ClipPosition {
  Start = 'start',
  End = 'end',
  Middle = 'middle',
}

export type Clip = {
  id: string;
  title: string;
  broadcaster: string;
  game: string;
  thumbnailUrl: string;
  videoUrl: string;
  views: number;
  duration: number;
  position: ClipPosition;
};
