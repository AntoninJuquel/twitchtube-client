import { Composition, getInputProps } from 'remotion';
import { TwitchClip } from 'twitch-api-helix';
import MyComp from './Composition';

const inputProps = getInputProps();

export default function MyVideo() {
  const { clips, fps, width, height } = inputProps;

  const duration = (clips as TwitchClip[]).reduce<number>(
    (acc, clip) => acc + clip.duration,
    0
  );

  return (
    <Composition
      component={MyComp}
      durationInFrames={Math.max(Math.round(duration), 1) * fps}
      width={width || 1920}
      height={height || 1080}
      fps={fps || 30}
      id="my-comp"
    />
  );
}
