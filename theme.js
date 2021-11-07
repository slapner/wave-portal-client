// theme.js
import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

// Version 1: Using objects
const theme = extendTheme({
  fonts: {
    body: 'Inter var',
  },
});

export default theme;
