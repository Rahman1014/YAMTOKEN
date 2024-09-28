import { useState, useEffect } from "react";
import { ethers } from "ethers";

const useMetaMask = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  const connectWallet = async () => {
    setLoading(true);
    setError(null);
    if (provider) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
      } catch (err) {
        setError("Failed to connect MetaMask");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setError("MetaMask is not installed.");
    }
  };

  return { account, connectWallet, loading, error };
};

export default useMetaMask;