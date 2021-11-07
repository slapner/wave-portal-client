import { Box } from '@chakra-ui/react';

export default function MainLayout(props) {
  return (
    <Box minH="100vh" minW="100vw" bg="blue.900">
      <Box w="2xl" mx="auto">
        {props.children}
      </Box>
    </Box>
  );
}
