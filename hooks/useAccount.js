import { useToast } from '@chakra-ui/react';
import abi from '../utils/WavePortal.json';
import React from 'react';
import { ethers } from 'ethers';

const AccountContext = React.createContext();

function AccountProvider(props) {
  const [currentAccount, setCurrentAccount] = React.useState(null);
  const [allWaves, setAllWaves] = React.useState([]);

  const toast = useToast();
  const contractAddress = '0xa40ee2E10c802817615962E6ddD4F0fb0B1D482a';
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
      } else {
        console.log('We have the Ethereum object', ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Found authorized account', account);
        setCurrentAccount(account);
        getAllWaves();
      } else {
        console.log('No accounts found');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        toast({
          title: 'Error',
          description: 'Make sure you have MetaMask!',
          status: 'error',
          duration: 9000,
        });
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {}
  };

  const getAllWaves = async () => {
    const { ethereum } = window;

    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        const waves = await wavePortalContract.getAllWaves();

        const wavesCleaned = waves.map((wave) => {
          return {
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          };
        });

        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    checkIfWalletIsConnected();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    let wavePortalContract;

    const onNewWave = (from, timestamp, message) => {
      console.log('New wave', from, timestamp, message);
      setAllWaves((prevWaves) => [
        ...prevWaves,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      wavePortalContract.on('NewWave', onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off('NewWave', onNewWave);
      }
    };
  }, [contractABI]);

  const value = {
    currentAccount,
    connectWallet,
    contractABI,
    contractAddress,
    allWaves,
    getAllWaves,
  };

  return (
    <AccountContext.Provider value={value}>
      {props.children}
    </AccountContext.Provider>
  );
}

function useAccount() {
  const context = React.useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within a AccountProvider');
  }
  return context;
}

export { AccountProvider, useAccount };
