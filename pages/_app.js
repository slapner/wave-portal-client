import { ChakraProvider } from '@chakra-ui/react';
import { AccountProvider } from '../hooks/useAccount';

import MainLayout from '../layouts/MainLayout';
import theme from '../theme';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <MainLayout>
        <AccountProvider>
          <Component {...pageProps} />
        </AccountProvider>
      </MainLayout>
    </ChakraProvider>
  );
}

export default MyApp;
