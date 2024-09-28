import { useState, useEffect } from "react";
import { ethers } from "ethers";

const useMetaMask = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [connected, setConnected] = useState(false);  // Added connected state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if MetaMask is installed
    const checkMetaMaskInstalled = async () => {
      if (window.ethereum) {
        const ethProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(ethProvider);
      } else {
        setError("MetaMask is not installed.");
      }
    };
    checkMetaMaskInstalled();
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      // Listen for account changes
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setConnected(true);  // Set connected to true if accounts exist
        } else {
          setAccount(null);
          setConnected(false);  // Set connected to false if no accounts
        }
      };

      // Listen for chain changes and reload the page
      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setLoading(true);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("MetaMask accounts:", accounts);
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setConnected(true);  // Set connected to true
        } else {
          console.error("No accounts found");
        }
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
        setError('Error connecting to MetaMask.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('MetaMask not installed. Please install it to continue.');
      setError("MetaMask not installed.");
    }
  };

  return { account, connected, connectWallet, loading, error };
};

export default useMetaMask;