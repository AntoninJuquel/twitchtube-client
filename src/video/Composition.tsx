import { OffthreadVideo, Sequence, useVideoConfig } from 'remotion';
import { TwitchClip } from 'twitch-api-helix';

type CompositionProps = {
  clips: TwitchClip[];
};

function VideoClip({ clip, from }: { clip: TwitchClip; from: number }) {
  const { fps } = useVideoConfig();
  const slicePoint = clip.thumbnail_url.indexOf('-preview-');
  const videoUrl = `${clip.thumbnail_url.slice(0, slicePoint)}.mp4`;

  return (
    <Sequence
      from={Math.round(from) * fps}
      durationInFrames={Math.round(clip.duration) * fps}
    >
      <OffthreadVideo src={videoUrl} />
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
          from={clips
            .slice(0, index)
            .reduce<number>((acc, c) => acc + c.duration, 0)}
        />
      ))}
    </>
  );
}
