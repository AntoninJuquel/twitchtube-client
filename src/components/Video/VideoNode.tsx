import { TwitchClip } from '@/api';
import { CardActions, Tab, Tabs } from '@mui/material';

import { Handle, Position, NodeProps } from 'reactflow';

import { TwitchClipCard, TwitchClipDisplayMode } from '@/components/Twitch';
import { useState } from 'react';

type VideoNodeProps = {
  data: TwitchClip;
  isConnectable: boolean;
} & NodeProps;

const TwitchClipDisplayModeIcons = {
  [TwitchClipDisplayMode.Video]: await import('@mui/icons-material/PlayCircle'),
  [TwitchClipDisplayMode.Image]: await import('@mui/icons-material/Image'),
  [TwitchClipDisplayMode.Text]: await import('@mui/icons-material/TextFields'),
};

export default function VideoNode({
  data,
  isConnectable,
  dragging,
}: VideoNodeProps) {
  const [displayMode, setDisplayMode] = useState<TwitchClipDisplayMode>(
    TwitchClipDisplayMode.Video
  );

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: TwitchClipDisplayMode
  ) => {
    setDisplayMode(newValue);
  };

  return (
    <TwitchClipCard
      clip={data}
      header={
        <CardActions>
          <Tabs
            value={displayMode}
            onChange={handleChange}
            TabIndicatorProps={{
              sx: { display: 'none' },
            }}
          >
            {Object.values(TwitchClipDisplayMode).map((mode) => {
              const Icon = TwitchClipDisplayModeIcons[mode].default;
              return <Tab key={mode} value={mode} icon={<Icon />} />;
            })}
          </Tabs>
        </CardActions>
      }
      displayMode={displayMode}
      cardProps={{
        sx: {
          opacity: dragging ? 0.5 : 1,
          transition: 'opacity 0.2s',
        },
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </TwitchClipCard>
  );
}
