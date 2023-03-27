import { TwitchClip } from '@/api';
import { CardActions } from '@mui/material';

import { Handle, Position, NodeProps } from 'reactflow';

import VideoIcon from '@mui/icons-material/PlayCircle';
import ImageIcon from '@mui/icons-material/Image';
import TextIcon from '@mui/icons-material/TextFields';

import { TwitchClipCard, TwitchClipDisplayMode } from '@/components/Twitch';
import { useTabs } from '@/hooks';

type VideoNodeProps = {
  data: TwitchClip;
  isConnectable: boolean;
} & NodeProps;

export default function VideoNode({
  data,
  isConnectable,
  dragging,
}: VideoNodeProps) {
  const { Tabs, activeTab } = useTabs<TwitchClipDisplayMode>(
    TwitchClipDisplayMode.Video,
    [
      {
        label: 'Video',
        value: TwitchClipDisplayMode.Video,
        icon: <VideoIcon />,
      },
      {
        label: 'Image',
        value: TwitchClipDisplayMode.Image,
        icon: <ImageIcon />,
      },
      {
        label: 'Text',
        value: TwitchClipDisplayMode.Text,
        icon: <TextIcon />,
      },
    ]
  );

  return (
    <TwitchClipCard
      clip={data}
      header={<CardActions>{Tabs}</CardActions>}
      displayMode={activeTab}
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
