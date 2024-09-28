import React, { useState, useEffect } from 'react';
import { Menu, MenuItem, IconButton, Avatar, Box } from '@mui/material';

const WalletMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setLoading(true);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setConnected(true);
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      } finally {
        setLoading(false);
      }
    } else {
      alert('MetaMask not installed. Please install it to continue.');
    }
  };

  const logoutWallet = () => {
    setAccount(null);
    setConnected(false);
    handleMenuClose();
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
          setConnected(false);
        }
      });
    }
  }, []);

  return (
    <div>
      {!connected ? (
        <Box
          onClick={connectWallet}
          sx={{
            position: "relative",
            color: "white",
            cursor: "pointer",
            textDecoration: "none",
            textTransform: "uppercase",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 0, lg: 3 },
            mb: { xs: 3, lg: 0 },
            fontSize: "24px",
            lineHeight: "normal",
            width: "300px",
            height: "45px",
            borderRadius: "6px",
            backgroundColor: "#00dbe3",
            "&:hover": {
              backgroundColor: "#00b5c0",
            },
            transition: "background-color 0.3s ease",
          }}
        >
          {loading ? "Connecting..." : "Connect Wallet"}
        </Box>
      ) : (
        <div>
          <IconButton onClick={handleMenuOpen}>
            <Avatar alt="Wallet Avatar">
              {account ? `${account.substring(0, 2)}...${account.substring(account.length - 2)}` : '??'}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              Account: {account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : '??'}
            </MenuItem>
            <MenuItem onClick={logoutWallet}>Logout</MenuItem>
          </Menu>
        </div>
      )}
    </div>
  );
};

export default WalletMenu;