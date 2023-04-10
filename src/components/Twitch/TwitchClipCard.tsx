import { useState } from 'react';
import { Card, CardHeader, CardMedia, CardActions, Checkbox, Tabs, Tab, Icon } from '@mui/material';
import { Clip } from '@/remotion/Clip';
import { useVideo } from '@/contexts/VideoContext';
import { TwitchClipDisplayMode } from '@/types/twitch';

type TwitchClipProps = {
  clip: Clip;
};

type TwitchClipCardProps = TwitchClipProps & {
  checkbox?: boolean;
  tab?: boolean | TwitchClipDisplayMode;
};

export function TwitchClipCardVideo({ clip }: TwitchClipProps) {
  return (
    <CardMedia>
      <iframe
        title={clip.id}
        src={`${clip.embedUrl}&parent=${window.location.hostname}`}
        width={448}
        height={252}
        allowFullScreen
        frameBorder={0}
      />
    </CardMedia>
  );
}

export function TwitchClipCardImage({ clip }: TwitchClipProps) {
  return (
    <CardMedia
      src={clip.thumbnailUrl}
      image={clip.thumbnailUrl}
      sx={{
        height: 252,
        width: 448,
        boxShadow: 'inset 0px 0px 200px rgba(0,0,0,0.9)',
      }}
      title={clip.title}
    >
      <CardHeader
        title={clip.title}
        titleTypographyProps={{ color: 'white' }}
        subheader={clip.broadcaster}
        subheaderTypographyProps={{ color: 'white' }}
      />
    </CardMedia>
  );
}

export function TwitchClipCardText({ clip }: TwitchClipProps) {
  return <CardHeader title={clip.title} subheader={clip.broadcaster} />;
}

const TwitchClipDisplay: Record<TwitchClipDisplayMode, (props: TwitchClipProps) => JSX.Element> = {
  [TwitchClipDisplayMode.Video]: TwitchClipCardVideo,
  [TwitchClipDisplayMode.Image]: TwitchClipCardImage,
  [TwitchClipDisplayMode.Text]: TwitchClipCardText,
};

export function TwitchClipCardTab({ clip }: TwitchClipProps) {
  const [tab, setTab] = useState<TwitchClipDisplayMode>(TwitchClipDisplayMode.Video);
  const handleChange = (event: React.SyntheticEvent, newValue: TwitchClipDisplayMode) => {
    setTab(newValue);
  };
  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value={TwitchClipDisplayMode.Video} icon={<Icon>play_circle</Icon>} />
        <Tab value={TwitchClipDisplayMode.Image} icon={<Icon>image</Icon>} />
        <Tab value={TwitchClipDisplayMode.Text} icon={<Icon>text_fields</Icon>} />
      </Tabs>
      {TwitchClipDisplay[tab]({ clip })}
    </>
  );
}

export function TwitchClipCardCheckBox({ clip }: TwitchClipProps) {
  const { setClipSelect } = useVideo();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClipSelect(clip.id, event.target.checked);
  };
  return (
    <CardActions>
      <Checkbox checked={clip.selected} onChange={handleChange} />
    </CardActions>
  );
}

export default function TwitchClipCard({ clip, tab, checkbox }: TwitchClipCardProps) {
  return (
    <Card
      sx={{
        width: 448,
      }}
    >
      {typeof tab === 'boolean' && tab ? (
        <TwitchClipCardTab clip={clip} />
      ) : (
        TwitchClipDisplay[tab || TwitchClipDisplayMode.Video]({ clip })
      )}
      {checkbox && <TwitchClipCardCheckBox clip={clip} />}
    </Card>
  );
}

TwitchClipCard.defaultProps = {
  checkbox: false,
  tab: false,
};
