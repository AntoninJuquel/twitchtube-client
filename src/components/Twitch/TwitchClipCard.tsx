import { Card, CardHeader, CardMedia, Skeleton } from '@mui/material';
import { TwitchClip } from 'twitch-api-helix';

export enum TwitchClipDisplayMode {
  Video = 'Video',
  Image = 'Image',
  Text = 'Text',
}

type TwitchClipProps = {
  clip?: TwitchClip;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  cardProps?: React.ComponentProps<typeof Card>;
  displayMode?: TwitchClipDisplayMode;
};

type TwitchClipDisplayProps = {
  clip: TwitchClip;
};

function TwitchVideoDisplay({ clip }: TwitchClipDisplayProps) {
  return (
    <CardMedia>
      <iframe
        title={clip.id}
        src={`${clip.embed_url}&parent=${window.location.hostname}`}
        width={448}
        height={252}
        allowFullScreen
        frameBorder={0}
      />
    </CardMedia>
  );
}

function TwitchImageDisplay({ clip }: TwitchClipDisplayProps) {
  return (
    <CardMedia
      src={clip.thumbnail_url}
      image={clip.thumbnail_url}
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
        subheader={clip.broadcaster_name}
        subheaderTypographyProps={{ color: 'white' }}
      />
    </CardMedia>
  );
}

function TwitchTextDisplay({ clip }: TwitchClipDisplayProps) {
  return <CardHeader title={clip.title} subheader={clip.broadcaster_name} />;
}

const TwitchClipDisplay: Record<
  TwitchClipDisplayMode,
  (props: TwitchClipDisplayProps) => JSX.Element
> = {
  [TwitchClipDisplayMode.Video]: TwitchVideoDisplay,
  [TwitchClipDisplayMode.Image]: TwitchImageDisplay,
  [TwitchClipDisplayMode.Text]: TwitchTextDisplay,
};

export default function TwitchClipCard({
  clip,
  header,
  footer,
  children,
  cardProps,
  displayMode,
}: TwitchClipProps) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Card variant="outlined" {...cardProps}>
      {header}
      {clip ? (
        TwitchClipDisplay[displayMode ?? TwitchClipDisplayMode.Video]({ clip })
      ) : (
        <Skeleton
          variant="rectangular"
          height={252}
          width={448}
          animation="wave"
        />
      )}

      {children}
      {footer}
    </Card>
  );
}

TwitchClipCard.defaultProps = {
  clip: undefined,
  displayMode: TwitchClipDisplayMode.Video,
  header: null,
  footer: null,
  children: null,
  cardProps: {},
};
