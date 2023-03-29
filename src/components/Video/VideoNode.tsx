import { TwitchClip } from '@/api';
import { Button, CardActions, Icon } from '@mui/material';

import { Handle, Position, NodeProps } from 'reactflow';

import { TwitchClipCard, TwitchClipDisplayMode } from '@/components/Twitch';
import { useTabs } from '@/hooks';

type VideoNodeProps = {
  data: TwitchClip;
  isConnectable: boolean;
} & NodeProps;

function VideoNodeHeader({ Tabs }: { Tabs: React.ReactNode }) {
  return <CardActions>{Tabs}</CardActions>;
}

export default function VideoNode({
  data,
  isConnectable,
  dragging,
}: VideoNodeProps) {
  const { Tabs, activeTab } = useTabs<TwitchClipDisplayMode>(
    TwitchClipDisplayMode.Image,
    [
      {
        label: 'Video',
        value: TwitchClipDisplayMode.Video,
        icon: 'play_circle',
      },
      {
        label: 'Image',
        value: TwitchClipDisplayMode.Image,
        icon: 'image',
      },
      {
        label: 'Text',
        value: TwitchClipDisplayMode.Text,
        icon: 'text_fields',
      },
    ]
  );

  return (
    <TwitchClipCard
      clip={data}
      header={<VideoNodeHeader Tabs={Tabs} />}
      displayMode={activeTab}
      cardProps={{
        sx: {
          opacity: dragging ? 0.5 : 1,
          transition: 'opacity 0.2s',
        },
      }}
    >
      <CardActions>
        <Button variant="contained" size="small" fullWidth title="Add layer">
          <Icon>add</Icon>
        </Button>
      </CardActions>
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
