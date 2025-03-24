import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(128, 0, 0)',
    },
  },
  typography: {
    button: {
      textTransform: 'none',
      fontWeight: 400,
    },
  },
});
