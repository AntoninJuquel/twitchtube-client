import { useToggle } from 'usehooks-ts';
import {
  OutlinedInput,
  InputAdornment,
  IconButton,
  InputLabel,
  FormControl,
  OutlinedInputProps,
  Icon,
} from '@mui/material';

export default function HiddenField({
  id,
  label,
  ...props
}: OutlinedInputProps) {
  const [show, toggleShow] = useToggle(false);

  return (
    <FormControl variant="outlined">
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <OutlinedInput
        id={id}
        label={label}
        type={show ? 'text' : 'password'}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={toggleShow}
              onMouseDown={(e) => e.preventDefault()}
              edge="end"
            >
              <Icon>{show ? 'visibility' : 'visibility_off'}</Icon>
            </IconButton>
          </InputAdornment>
        }
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    </FormControl>
  );
}
