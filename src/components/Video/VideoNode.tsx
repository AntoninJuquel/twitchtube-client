import { TwitchClip } from 'twitch-api-helix';
import { Button, CardActions, Icon, colors } from '@mui/material';

import { Handle, Position, NodeProps } from 'reactflow';

import { TwitchClipCard, TwitchClipDisplayMode } from '@/components/Twitch';
import { useTabs } from '@/hooks';

type NodeData = TwitchClip & {
  videoPosition: 'start' | 'end' | 'middle';
};

function VideoNodeHeader({ Tabs }: { Tabs: React.ReactNode }) {
  return <CardActions>{Tabs}</CardActions>;
}

const border = {
  start: `5px solid ${colors.lightGreen[500]}`,
  end: `5px solid ${colors.lightGreen[500]}`,
  middle: undefined,
};

export default function VideoNode({
  data,
  isConnectable,
  dragging,
}: NodeProps<NodeData>) {
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
          border: border[data.videoPosition],
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
