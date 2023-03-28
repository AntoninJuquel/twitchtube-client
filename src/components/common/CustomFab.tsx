import { forwardRef } from 'react';
import { Fab, Icon } from '@mui/material';

type Position =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

type CustomFabProps = {
  onClick: () => void;
  position: Position;
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  iconSize?: 'small' | 'medium' | 'large';
};

const positions: Record<
  Position,
  {
    top?: number | string;
    bottom?: number | string;
    left?: number | string;
    right?: number | string;
  }
> = {
  top: { top: 32, left: '50%' },
  bottom: { bottom: 32, left: '50%' },
  left: { top: '50%', left: 32 },
  right: { top: '50%', right: 32 },
  'top-left': { top: 32, left: 32 },
  'top-right': { top: 32, right: 32 },
  'bottom-left': { bottom: 32, left: 32 },
  'bottom-right': { bottom: 32, right: 32 },
};

type Ref = HTMLButtonElement;

const CustomFab = forwardRef<Ref, CustomFabProps>(
  ({ onClick, position, icon, size, iconSize }, ref) => (
    <Fab
      onClick={onClick}
      color="primary"
      sx={{
        position: 'fixed',
        zIndex: 1,
        ...positions[position],
      }}
      size={size}
      ref={ref}
    >
      <Icon fontSize={iconSize}>{icon}</Icon>
    </Fab>
  )
);

CustomFab.displayName = 'CustomFab';
CustomFab.defaultProps = {
  size: 'large',
  icon: 'add',
  iconSize: 'small',
};

export default CustomFab;
