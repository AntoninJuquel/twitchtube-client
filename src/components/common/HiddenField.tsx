import { useToggle } from 'usehooks-ts';
import {
  OutlinedInput,
  InputAdornment,
  IconButton,
  InputLabel,
  FormControl,
  OutlinedInputProps,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

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
              {show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    </FormControl>
  );
}
