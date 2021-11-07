import React from 'react';
import {
  Flex,
  VStack,
  Button,
  Text,
  Box,
  Heading,
  useToast,
  Textarea,
} from '@chakra-ui/react';
import Head from 'next/head';
import truncateEthAddress from 'truncate-eth-address';
import { ethers } from 'ethers';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useAccount } from '../hooks/useAccount';

dayjs.extend(relativeTime);

export default function Home() {
  const [loading, setLoading] = React.useState(false);
  const messageRef = React.useRef(null);
  const toast = useToast();
  const {
    currentAccount,
    connectWallet,
    contractAddress,
    contractABI,
    allWaves,
    getAllWaves,
  } = useAccount();

  const wave = async () => {
    try {
      const { ethereum } = window;
      setLoading(true);
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await wavePortalContract.getTotalWaves();
        console.log('Retrieved total wave count...', count.toNumber());
        /**
         * Execute the actual wave from the smart contract
         */
        const waveTxn = await wavePortalContract.wave(
          messageRef.current.value,
          {
            gasLimit: 300000,
          }
        );
        console.log('Mining...', waveTxn.hash);

        await waveTxn.wait();
        console.log('Minted --', waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log('Retrieved total wave count...', count.toNumber());

        toast({
          title: '👋 Hi, there',
          description: 'Thanks for the wave, Bud!',
          status: 'success',
        });

        // await getAllWaves();
      } else {
        console.log(`Ethereum doesn't exist!`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      messageRef.current.value = '';
      setLoading(false);
    }
  };

  return (
    <Box py={8}>
      <Head>
        <title>Wave Portal</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <VStack textAlign="center" spacing={8}>
        <Heading fontSize="4xl" color="blue.100" fontWeight="medium">
          Welcome to Wave Portal 👋
        </Heading>

        <Text color="blue.200">
          I&apos;m Brian, I am building the next web. Say hi.
        </Text>
        <Textarea
          placeholder="Say something to me..."
          ref={messageRef}
          disabled={loading}
        />
        <Button
          size="lg"
          onClick={wave}
          isLoading={loading}
          loadingText="Waving..."
        >
          👋 Wave to Me
        </Button>
        {!currentAccount && (
          <Button size="lg" onClick={connectWallet}>
            Connect Wallet
          </Button>
        )}
      </VStack>
      <VStack mt={12}>
        {allWaves.map((wave, index) => (
          <Box
            key={index}
            bg="blue.50"
            rounded="base"
            p={8}
            color="blue.900"
            w="full"
          >
            <Flex w="full" alignItems="center">
              <Box mr={4}>
                <Text fontWeight="bold">
                  {truncateEthAddress(wave.address)}
                </Text>
                <Text>{dayjs().to(dayjs(wave.timestamp.toString()))}</Text>
              </Box>
              <Text flex="1" textAlign="center">
                {wave.message}
              </Text>
            </Flex>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
