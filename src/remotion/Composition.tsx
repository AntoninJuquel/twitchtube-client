import { OffthreadVideo, Sequence, useVideoConfig } from 'remotion';
import { Clip } from './Clip';

type CompositionProps = {
  clips: Clip[];
};

function VideoClip({ clip, from }: { clip: Clip; from: number }) {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.round(from) * fps} durationInFrames={Math.round(clip.duration) * fps}>
      <OffthreadVideo src={clip.videoUrl} />
    </Sequence>
  );
}

export default function MyComp({ clips }: CompositionProps) {
  return (
    <>
      {clips.map((clip, index) => (
        <VideoClip
          key={clip.id}
          clip={clip}
          from={clips.slice(0, index).reduce<number>((acc, c) => acc + c.duration, 0)}
        />
      ))}
    </>
  );
}
