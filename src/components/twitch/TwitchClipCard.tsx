/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardMedia,
  CardActions,
  Checkbox,
  Tabs,
  Tab,
  Icon,
  CardProps,
} from '@mui/material';
import { Clip } from '@/remotion/Clip';
import { TwitchClipDisplayMode } from '@/types/twitch';

type TwitchClipProps = {
  clip: Clip;
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
  const [tab, setTab] = useState<TwitchClipDisplayMode>(TwitchClipDisplayMode.Image);
  const handleChange = (event: React.SyntheticEvent, newValue: TwitchClipDisplayMode) => {
    setTab(newValue);
  };
  return (
    <>
      <Tabs
        value={tab}
        onChange={handleChange}
        sx={{
          '& .MuiTabs-indicator': {
            display: 'none',
          },
        }}
      >
        <Tab value={TwitchClipDisplayMode.Video} icon={<Icon>play_circle</Icon>} />
        <Tab value={TwitchClipDisplayMode.Image} icon={<Icon>image</Icon>} />
        <Tab value={TwitchClipDisplayMode.Text} icon={<Icon>text_fields</Icon>} />
      </Tabs>
      {TwitchClipDisplay[tab]({ clip })}
    </>
  );
}

type TwitchClipCardCheckBoxProps = TwitchClipProps & {
  selected: boolean;
  setClipSelect: (clip: Clip, selected: boolean) => void;
};

export function TwitchClipCardCheckBox({
  clip,
  selected,
  setClipSelect,
}: TwitchClipCardCheckBoxProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClipSelect(clip, event.target.checked);
  };
  return (
    <CardActions>
      <Checkbox checked={selected} onChange={handleChange} />
    </CardActions>
  );
}

type TwitchClipCardProps = TwitchClipProps & {
  checkbox?: boolean;
  TwitchClipCardCheckBoxProps?: Omit<TwitchClipCardCheckBoxProps, 'clip'>;
  tab?: boolean | TwitchClipDisplayMode;
  children?: React.ReactNode;
  cardProps?: CardProps;
};

export default function TwitchClipCard({
  clip,
  tab,
  checkbox,
  TwitchClipCardCheckBoxProps,
  children,
  cardProps,
}: TwitchClipCardProps) {
  return (
    <Card
      sx={{
        width: 448,
      }}
      {...cardProps}
    >
      {typeof tab === 'boolean' && tab ? (
        <TwitchClipCardTab clip={clip} />
      ) : (
        TwitchClipDisplay[tab || TwitchClipDisplayMode.Video]({ clip })
      )}
      {checkbox && TwitchClipCardCheckBoxProps && (
        <TwitchClipCardCheckBox {...TwitchClipCardCheckBoxProps} clip={clip} />
      )}
      {children}
    </Card>
  );
}

TwitchClipCard.defaultProps = {
  checkbox: false,
  tab: false,
  TwitchClipCardCheckBoxProps: undefined,
  children: undefined,
  cardProps: {},
};
