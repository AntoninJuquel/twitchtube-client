import { Button, colors } from '@mui/material';
import { Handle, Position, NodeProps } from 'reactflow';

import { TwitchClip } from 'twitch-api-helix';

import TwitchClipCard from '@/components/twitch/TwitchClipCard';
import { Clip } from '@/remotion/Clip';

const border = {
  start: `5px solid ${colors.lightGreen[500]}`,
  end: `5px solid ${colors.lightGreen[500]}`,
  middle: undefined,
};

export default function VideoNode({ data, isConnectable, dragging }: NodeProps<Clip>) {
  return (
    <TwitchClipCard
      tab
      clip={data}
      cardProps={{
        sx: {
          opacity: dragging ? 0.5 : 1,
        },
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{
          width: 10,
          height: 20,
          borderRadius: 10,
          left: '-12px',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{
          width: 10,
          height: 20,
          borderRadius: 10,
          right: '-12px',
        }}
      />
    </TwitchClipCard>
  );
}
